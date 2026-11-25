# @repo/brain

A curated conceptual model of selected human neuroanatomical structures, connectivity and distributed functional relationships.

## Scope

`@repo/brain` provides:

- A typed anatomical registry.
- Anatomical hierarchy queries.
- Functional system definitions.
- Cortical area references.
- Curated connectivity definitions.
- Simplified pathway descriptions.
- Cognitive process contracts.
- Graph traversal utilities.
- Bounded graph tracing.
- Model validation.

The package is a conceptual and curated model. It is not:

- A complete human brain atlas.
- A clinically validated anatomical reference.
- A medical diagnostic tool.
- A validated human connectome.
- A biologically faithful neural simulator.
- A model of consciousness.

## Architecture

| Module       | Responsibility                              |
| ------------ | ------------------------------------------- |
| `anatomy`    | Anatomical vocabulary and hierarchy         |
| `connectome` | Connectivity definitions and pathways       |
| `cognition`  | Distributed functional process descriptions |
| `graph`      | Graph queries and traversal                 |
| `runtime`    | Bounded graph tracing                       |
| `validation` | Referential and structural validation       |

## Installation

This package is part of the SLIC monorepo.

```bash
pnpm install
```

## Build

```bash
pnpm --filter @repo/brain build
```

## Typecheck

```bash
pnpm --filter @repo/brain typecheck
```

## Tests

```bash
pnpm --filter @repo/brain test
```

## Test UI

```bash
pnpm --filter @repo/brain test:ui
```

## Coverage

```bash
pnpm --filter @repo/brain test:coverage
```

## Usage

### Anatomical lookup

```ts
import { getStructure, getChildren, getAncestors } from '@repo/brain/anatomy';

const hippocampus = getStructure('left-hippocampus');

const children = getChildren('brain');

const ancestors = getAncestors('left-hippocampus');
```

### Functional systems

```ts
import { getSystemsForRegion } from '@repo/brain/anatomy';

const systems = getSystemsForRegion('left-hippocampus');
```

### Connectivity

```ts
import { getOutgoingConnections } from '@repo/brain/graph';

const connections = getOutgoingConnections('retina');
```

### Cognitive processes

```ts
import { findCognitiveProcessesByRegion } from '@repo/brain/cognition';

const processes = findCognitiveProcessesByRegion('left-hippocampus');
```

### Graph tracing

```ts
import { traceSignal } from '@repo/brain/runtime';

const trace = traceSignal('retina', {
  maxDepth: 3,
  maxNodes: 50,
});
```

### Validation

```ts
import { validateAnatomy, validateConnectome } from '@repo/brain/validation';

const anatomyResult = validateAnatomy();
const connectomeResult = validateConnectome();

if (!anatomyResult.valid || !connectomeResult.valid) {
  throw new Error('Brain model validation failed.');
}
```

## Scientific constraints

Connection definitions represent curated relationships. They do not imply:

- Synaptic strength.
- Excitatory or inhibitory effects.
- Neurotransmitter identity.
- Conduction latency.
- Neuron counts.
- Physiological signal propagation.

Pathways are explanatory sequences. They may omit intermediate structures.

`traceSignal` performs bounded graph traversal. It does not simulate action potentials, synaptic transmission, plasticity or neural population dynamics.

## Data provenance

The current baseline uses curated conceptual definitions. Empty source lists mean that source-level provenance has not yet been attached to the individual definition.

Do not interpret `curated_baseline` as a numerical confidence score.

Future dataset-derived definitions must include dataset identity, version and mapping provenance.

## Merged model (0.4.0)

The registry now combines the curated baseline with the SLIC prototype data:

| Registry            | Baseline | Merged |
| ------------------- | -------: | -----: |
| Structures          |       71 |    144 |
| Connections         |       26 |    208 |
| Pathways            |        6 |     38 |
| Cognitive processes |       10 |     24 |

Merged entries use `evidence.level = 'moderate'` and empty `sources`. Use `getProvenanceSummary()` to track sourcing progress and `validateProvenance()` to list unsourced connections.

### Frontal part and the rest of the brain

```ts
import { getBrainPart, type FrontalRegionId, type RestOfBrainRegionId } from '@repo/brain/anatomy';

getBrainPart('dorsolateral-prefrontal-cortex'); // 'frontal'
getBrainPart('thalamus'); // 'rest'
getBrainPart('retina'); // null (outside the brain)
```

The types are derived from the `parentId` hierarchy, so adding a structure under a frontal lobe updates `FrontalRegionId` automatically.

### Related packages

| Package           | Purpose                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `@repo/brain-sim` | Event-driven activity simulator (latency, weight, thoughts, actions) |
| `@repo/brain-viz` | Renderer-neutral graph export and standalone HTML map                |

See `docs/merge-notes.md` for modelling decisions and known gaps.
