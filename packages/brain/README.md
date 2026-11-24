# @repo/brain

A data-driven, strongly typed brain model for SLIC.

`@repo/brain` provides a shared vocabulary and graph model for representing:
- gross neuroanatomy and nested brain structures;
- cortical areas and functional systems;
- directed and undirected anatomical/functional connections;
- neural pathways as ordered sequences of structures;
- cognitive-process and signal-event contracts;
- graph queries and a deliberately simplified event-propagation runtime.

It is a **model and software abstraction**, not a biologically complete digital twin, medical tool, or validated neural simulator.

## Design principles

1. **Data is the source of truth.** Runtime registries are `as const` data. TypeScript types are derived from those registries.
2. **Anatomy is not cognition.** Physical structures, functional systems, cognitive processes, and runtime events are separate concepts.
3. **Connections carry epistemic metadata.** A connection records its kind, direction, evidence status, and a source note. The model does not imply that every edge is equally certain.
4. **No false precision.** Latency, neurotransmitter, strength, and other biological values are omitted unless a dataset-specific source justifies them.
5. **Runtime is an abstraction.** The included propagation utility traverses a graph; it does not simulate action potentials, synapses, consciousness, or human thought.
6. **SLIC boundaries remain outside this package.** This package defines a reusable model only. It must not couple Personal and Investigative storage, identity, keys, authorization, or audit boundaries.

## Installation inside the SLIC workspace

Add the package to a consumer's `package.json`:

```json
{
  "dependencies": {
    "@repo/brain": "workspace:*"
  }
}
```

Then import:

```ts
import { Brain, regions, connections, traceSignal } from "@repo/brain";
```

## Package map

```text
src/
├── anatomy/       # structures, hierarchy, cortical areas
├── connectome/    # connection registry and pathway definitions
├── cognition/     # cognitive process and event contracts
├── graph/         # graph traversal and structural queries
├── runtime/       # simplified event propagation
└── index.ts       # public API and aggregate Brain model
```

## Quick example

```ts
import {
  connections,
  getChildren,
  getConnections,
  regions,
  traceSignal,
} from "@repo/brain";

const children = getChildren("telencephalon");
const thalamicEdges = getConnections("thalamus");
const trace = traceSignal({
  origin: "retina",
  connections,
  maxHops: 4,
});

console.log(regions.retina.name, children, thalamicEdges, trace);
```

## Current scope

The initial registry covers major divisions, selected cortical regions, subcortical structures, brainstem nuclei/regions, cerebellar structures, selected sensory/motor structures, pathways, and functional systems. It is intentionally a curated baseline, not an exhaustive atlas.

See:
- [Architecture](docs/architecture.md)
- [Anatomical model](docs/anatomical-model.md)
- [Connectome model](docs/connectome-model.md)
- [Runtime semantics](docs/runtime-semantics.md)
- [Scientific limitations and source register](docs/scientific-scope.md)
- [Roadmap](docs/roadmap.md)

## Development

```bash
pnpm --filter @repo/brain typecheck
pnpm --filter @repo/brain test
pnpm --filter @repo/brain build
```

The package expects the workspace TypeScript and Vitest versions to be supplied through the pnpm catalog.
