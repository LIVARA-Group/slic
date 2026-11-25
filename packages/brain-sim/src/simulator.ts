import {
  type CognitiveProcessId,
  type ConnectionDefinition,
  cognitiveProcesses,
  type NeuralEvent,
  type Neurotransmitter,
  type RegionId,
} from '@repo/brain';
import { effectors, isEffector, isSensor, sensors } from './boundary.js';
import { buildDirectedEdges, type DirectedEdge, getDynamics, getEffect } from './dynamics.js';

export interface SimulatorOptions {
  /** Activation level at which a region fires. */
  threshold?: number;
  /** Activation decay time constant, ms. */
  tauMs?: number;
  /** Refractory period after firing, ms. */
  refractoryMs?: number;
  /** Maximum number of hops from a stimulus. */
  maxHops?: number;
  /** Mean activation of a process's regions needed to count as "started". */
  processLevel?: number;
  /** Fraction of a process's regions that must be engaged. */
  processCoverage?: number;
  /** Re-amplification applied when a region passes its signal on. */
  gain?: number;
  /** Exponent dividing signal strength by the number of excitatory targets. */
  fanoutExponent?: number;
  /** Maximum number of retained events and impulses. */
  historyLimit?: number;
}

/** One firing of a connection, with strength and arrival time (used by visualisations). */
export interface ImpulseRecord {
  readonly id: string;
  readonly at: number;
  readonly arrivesAt: number;
  readonly from: RegionId;
  readonly to: RegionId;
  readonly connectionId: string;
  readonly effect: 'excitatory' | 'inhibitory' | 'modulatory';
  readonly neurotransmitter: Neurotransmitter | null;
  readonly strength: number;
}

interface RegionState {
  activation: number;
  refractoryUntil: number;
  fireCount: number;
}

interface Pending {
  readonly at: number;
  readonly edge: DirectedEdge;
  readonly strength: number;
  readonly hop: number;
}

const SOURCE = 'brain-sim';
const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

/**
 * Event-driven, rate-based activity simulator.
 *
 * A stimulus enters a region, activation propagates along the connectome with per-connection delays,
 * excitatory edges add, inhibitory edges subtract and modulatory edges change neurotransmitter levels.
 * Output is expressed with the `NeuralEvent` contract from `@repo/brain`.
 *
 * This is an abstract event-flow model, not a biophysical simulation.
 */
export class BrainSimulator {
  readonly options: Required<SimulatorOptions>;
  readonly events: NeuralEvent[] = [];
  readonly impulses: ImpulseRecord[] = [];
  readonly neuromodulators = new Map<Neurotransmitter, number>();

  time = 0;

  private readonly state = new Map<string, RegionState>();
  private readonly outgoing = new Map<string, DirectedEdge[]>();
  private queue: Pending[] = [];
  private nextId = 1;
  private readonly activeProcesses = new Set<CognitiveProcessId>();

  constructor(options: SimulatorOptions = {}) {
    this.options = {
      threshold: 0.3,
      tauMs: 60,
      refractoryMs: 25,
      maxHops: 14,
      processLevel: 0.2,
      processCoverage: 0.6,
      gain: 1.25,
      fanoutExponent: 0.5,
      historyLimit: 20_000,
      ...options,
    };

    for (const edge of buildDirectedEdges()) {
      const list = this.outgoing.get(edge.from);

      if (list) {
        list.push(edge);
      } else {
        this.outgoing.set(edge.from, [edge]);
      }
    }
  }

  /** Inject a stimulus into a receptor or directly into any region. */
  stimulate(regionId: RegionId, intensity = 1): void {
    this.record({
      id: this.makeId(),
      occurredAt: this.time,
      source: SOURCE,
      type: 'sensory-input',
      modality: isSensor(regionId) ? sensors[regionId] : 'other',
      targetRegion: regionId,
    });

    this.deliver(regionId, intensity, 0);
  }

  activation(regionId: RegionId): number {
    return this.state.get(regionId)?.activation ?? 0;
  }

  fireCount(regionId: RegionId): number {
    return this.state.get(regionId)?.fireCount ?? 0;
  }

  /** Regions sorted by current activation, highest first. */
  hottest(limit = 10): Array<[RegionId, number]> {
    return [...this.state.entries()]
      .map(([id, s]) => [id as RegionId, s.activation] as [RegionId, number])
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }

  /** Regions that fired at least once. */
  firedRegions(): RegionId[] {
    return [...this.state.entries()]
      .filter(([, s]) => s.fireCount > 0)
      .map(([id]) => id as RegionId);
  }

  run(milliseconds: number, step = 1): this {
    for (let elapsed = 0; elapsed < milliseconds; elapsed += step) {
      this.tick(step);
    }

    return this;
  }

  tick(step = 1): void {
    this.time += step;

    if (this.queue.length > 0) {
      this.queue.sort((a, b) => a.at - b.at);

      while (this.queue.length > 0 && this.queue[0]!.at <= this.time) {
        this.arrive(this.queue.shift()!);
      }
    }

    const decay = Math.exp(-step / this.options.tauMs);

    for (const s of this.state.values()) {
      s.activation *= decay;
    }

    const modulatorDecay = Math.exp(-step / 400);

    for (const [key, level] of this.neuromodulators) {
      this.neuromodulators.set(key, level * modulatorDecay);
    }

    this.detectProcesses();
  }

  /** Events of one type, narrowed. */
  eventsOfType<T extends NeuralEvent['type']>(type: T): Array<Extract<NeuralEvent, { type: T }>> {
    return this.events.filter(
      (event): event is Extract<NeuralEvent, { type: T }> => event.type === type,
    );
  }

  /** Cognitive processes that were started during the run. */
  startedProcesses(): CognitiveProcessId[] {
    return [
      ...new Set(
        this.eventsOfType('cognitive-process')
          .filter((event) => event.phase === 'started')
          .map((event) => event.processId),
      ),
    ];
  }

  /** Effectors that fired during the run. */
  firedEffectors(): Array<keyof typeof effectors> {
    return [
      ...new Set(
        this.eventsOfType('behavioral-output').flatMap((event) =>
          event.description && isEffector(event.description) ? [event.description] : [],
        ),
      ),
    ];
  }

  // ── internals ──

  private arrive(pending: Pending): void {
    const { connection, to } = pending.edge;
    const effect = getEffect(connection);
    const { weight } = getDynamics(connection.id);

    if (
      effect === 'modulatory' &&
      'neurotransmitter' in connection &&
      connection.neurotransmitter
    ) {
      const previous = this.neuromodulators.get(connection.neurotransmitter) ?? 0;
      this.neuromodulators.set(
        connection.neurotransmitter,
        clamp01(previous + pending.strength * 0.2),
      );
    }

    const sign = effect === 'excitatory' ? 1 : effect === 'inhibitory' ? -1 : 0.5;

    this.deliver(to as RegionId, sign * pending.strength * weight, pending.hop);
  }

  private stateOf(regionId: string): RegionState {
    let s = this.state.get(regionId);

    if (!s) {
      s = { activation: 0, refractoryUntil: 0, fireCount: 0 };
      this.state.set(regionId, s);
    }

    return s;
  }

  private deliver(regionId: RegionId, delta: number, hop: number): void {
    const s = this.stateOf(regionId);

    s.activation = clamp01(s.activation + delta);

    if (delta > 0 && s.activation >= this.options.threshold && this.time >= s.refractoryUntil) {
      this.fire(regionId, hop);
    }
  }

  private fire(regionId: RegionId, hop: number): void {
    const s = this.stateOf(regionId);

    s.refractoryUntil = this.time + this.options.refractoryMs;
    s.fireCount += 1;

    if (isEffector(regionId)) {
      this.record({
        id: this.makeId(),
        occurredAt: this.time,
        source: SOURCE,
        type: 'behavioral-output',
        category: effectors[regionId],
        description: regionId,
      });
    }

    if (hop >= this.options.maxHops) {
      return;
    }

    const edges = this.outgoing.get(regionId) ?? [];
    const excitatory = edges.filter((edge) => getEffect(edge.connection) === 'excitatory').length;
    const strength = Math.min(
      1,
      (s.activation * this.options.gain) / Math.max(1, excitatory) ** this.options.fanoutExponent,
    );

    for (const edge of edges) {
      const arrivesAt = this.time + getDynamics(edge.connection.id).latencyMs;

      this.queue.push({ at: arrivesAt, edge, strength, hop: hop + 1 });
      this.recordImpulse(edge.connection, edge.from, edge.to, arrivesAt, strength);

      if (edge.connection.kind === 'motor_pathway') {
        this.record({
          id: this.makeId(),
          occurredAt: this.time,
          source: SOURCE,
          type: 'motor-command',
          sourceRegion: edge.from as RegionId,
          targetRegion: edge.to as RegionId,
        });
      }
    }
  }

  private detectProcesses(): void {
    for (const process of cognitiveProcesses) {
      const regions = process.candidateRegions;
      const levels = regions.map((id) => this.activation(id));
      const mean = levels.reduce((sum, level) => sum + level, 0) / levels.length;
      const engaged =
        levels.filter((level) => level >= this.options.processLevel / 2).length / levels.length;
      const id = process.id as CognitiveProcessId;

      if (!this.activeProcesses.has(id)) {
        if (mean >= this.options.processLevel && engaged >= this.options.processCoverage) {
          this.activeProcesses.add(id);
          this.record({
            id: this.makeId(),
            occurredAt: this.time,
            source: SOURCE,
            type: 'cognitive-process',
            processId: id,
            phase: 'started',
          });
        }
      } else if (mean < this.options.processLevel / 3) {
        this.activeProcesses.delete(id);
        this.record({
          id: this.makeId(),
          occurredAt: this.time,
          source: SOURCE,
          type: 'cognitive-process',
          processId: id,
          phase: 'completed',
        });
      }
    }
  }

  private recordImpulse(
    connection: ConnectionDefinition,
    from: string,
    to: string,
    arrivesAt: number,
    strength: number,
  ): void {
    const id = this.makeId();

    this.impulses.push({
      id,
      at: this.time,
      arrivesAt,
      from: from as RegionId,
      to: to as RegionId,
      connectionId: connection.id,
      effect: getEffect(connection),
      neurotransmitter:
        'neurotransmitter' in connection && connection.neurotransmitter
          ? connection.neurotransmitter
          : null,
      strength,
    });

    this.record({
      id: this.makeId(),
      occurredAt: this.time,
      source: SOURCE,
      type: 'regional-signal',
      from: from as RegionId,
      to: to as RegionId,
      description: connection.id,
    });

    if (this.impulses.length > this.options.historyLimit) {
      this.impulses.shift();
    }
  }

  private record(event: NeuralEvent): void {
    this.events.push(event);

    if (this.events.length > this.options.historyLimit) {
      this.events.shift();
    }
  }

  private makeId(): string {
    return String(this.nextId++);
  }
}
