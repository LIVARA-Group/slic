# @repo/brain-sim

Event-driven, rate-based activity simulator on top of the `@repo/brain` connectome.

```ts
import { BrainSimulator } from '@repo/brain-sim';

const sim = new BrainSimulator();
sim.stimulate('somatic-receptors');
sim.run(250); // ms

sim.startedProcesses(); // ['pain-processing', ...]
sim.firedEffectors(); // ['skeletal-muscles', ...]
sim.hottest(5);
sim.eventsOfType('regional-signal');
```

Output uses the `NeuralEvent` contract from `@repo/brain` (`sensory-input`, `regional-signal`, `cognitive-process`, `motor-command`, `behavioral-output`). `sim.impulses` additionally keeps strength and arrival time for visualisation.

## Model

- Excitatory edges add activation, inhibitory edges subtract, modulatory edges raise neurotransmitter levels.
- A region fires at `threshold`, then is refractory for `refractoryMs`.
- Signal strength is re-amplified by `gain` and divided by `fanout ** fanoutExponent` to keep activity selective.
- A process is "started" when the mean activation of its `candidateRegions` and the fraction of engaged regions pass thresholds.

## Limits

This is an abstract event-flow model. It is not a biophysical, population or spiking simulation. Latency and weight values (`src/dynamics.generated.ts`) are approximate modelling parameters, not measured data. Default parameters were tuned by hand against a few sanity scenarios (vision, hearing, pain).

Boundary structures (sensors and effectors) are declared in `src/boundary.ts`.
