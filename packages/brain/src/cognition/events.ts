import type { RegionId } from '../anatomy/regions.js';
import type { CognitiveProcessId } from './processes.js';

export interface NeuralEventBase {
  readonly id: string;
  readonly occurredAt: number;
  readonly source: string;
}

export interface SensoryInputEvent extends NeuralEventBase {
  readonly type: 'sensory-input';
  readonly modality: 'visual' | 'auditory' | 'somatosensory' | 'other';
  readonly targetRegion: RegionId;
}

export interface RegionalSignalEvent extends NeuralEventBase {
  readonly type: 'regional-signal';
  readonly from: RegionId;
  readonly to: RegionId;
  readonly description?: string;
}

export interface CognitiveProcessEvent extends NeuralEventBase {
  readonly type: 'cognitive-process';
  readonly processId: CognitiveProcessId;
  readonly phase: 'started' | 'updated' | 'completed' | 'interrupted';
}

export interface MotorCommandEvent extends NeuralEventBase {
  readonly type: 'motor-command';
  readonly sourceRegion: RegionId;
  readonly targetRegion: RegionId;
}

export interface BehavioralOutputEvent extends NeuralEventBase {
  readonly type: 'behavioral-output';
  readonly category: 'movement' | 'speech' | 'autonomic' | 'other';
  readonly description?: string;
}

export type NeuralEvent =
  | SensoryInputEvent
  | RegionalSignalEvent
  | CognitiveProcessEvent
  | MotorCommandEvent
  | BehavioralOutputEvent;
