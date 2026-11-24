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
