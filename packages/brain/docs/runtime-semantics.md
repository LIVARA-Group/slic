# Runtime Semantics

## Purpose

The runtime module provides bounded traversal over the curated graph.

## traceSignal

`traceSignal` performs breadth-first graph traversal.

Inputs:

- Origin region.
- Maximum depth.
- Maximum number of returned nodes.
- Whether to include the origin in the result.

Outputs:

- Origin.
- Visited regions.
- Traversed connections.
- Maximum depth.
- Truncation status.

## Traversal rules

- Directed edges are traversed from source to target.
- Bidirectional edges may be traversed in either direction.
- Already visited regions are not added again.
- Traversal stops at the configured depth.
- Traversal stops at the configured node limit.

## Explicit non-goals

`traceSignal` does not simulate:

- Action potentials.
- Membrane potentials.
- Synaptic transmission.
- Neurotransmitter release.
- Excitation or inhibition.
- Synaptic plasticity.
- Neural population dynamics.
- Oscillations.
- Consciousness.

The function is a graph utility, not a biological neural simulator.
