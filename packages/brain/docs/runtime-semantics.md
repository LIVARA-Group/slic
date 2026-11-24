# Runtime semantics

## Current runtime

`traceSignal` performs bounded graph traversal from an origin region. It follows directed edges from `from` to `to`, and follows the reverse direction only for edges marked `bidirectional`.

Options:

- `maxHops`: maximum graph distance;
- `includeFunctional`: include functional association edges;
- `includeModulatory`: include modulatory edges.

The result is an ordered list of visited regions with hop count and traversed edge identifier.

## What this does not model

It does not simulate:

- action potentials or membrane dynamics;
- synaptic transmission or plasticity;
- excitatory/inhibitory population dynamics;
- neurotransmitter concentrations;
- oscillations or timing;
- neural coding;
- muscle activation or biomechanics;
- consciousness or semantic content of thoughts.

`NeuralEvent` is a software event contract for application-level representation. It is not a claim that a biological neural event has this exact shape.

## Rust/WASM gate

Do not introduce Rust/WASM for the current graph traversal. It is simple and likely dominated by data/model design, not compute. Consider a Rust engine only after:

1. a defined numerical model exists;
2. representative workloads and correctness fixtures exist;
3. profiling identifies a CPU-bound hot path in TypeScript;
4. a benchmark shows a material improvement that justifies FFI and packaging complexity.

A future simulator should live in a separate package and consume the domain schema.
