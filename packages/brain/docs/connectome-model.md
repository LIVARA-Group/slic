# Connectome model

A connection is a typed edge with `from`, `to`, `kind`, `direction`, `evidence`, and a human-readable description.

## Edge semantics

- `anatomical`: a reported anatomical projection or tract relationship.
- `functional`: a functional/network relationship that should not be interpreted as a direct axonal tract.
- `commissural`: interhemispheric connection class reserved for explicit commissural edges.
- `modulatory`: broad modulatory relationship.

Direction is recorded as `afferent`, `efferent`, or `bidirectional` relative to the listed source/target pair. This is a simplified metadata convention, not a complete description of axonal populations or direction-specific physiology.

## Evidence status

- `curated-baseline`: manually curated initial entry with a short source-context note; not a formal evidence grade.
- `dataset-derived`: to be used only when a specific named dataset, version and mapping are recorded.
- `hypothesis`: proposed edge, not established fact.
- `unknown`: evidence has not been assessed.

The current registry uses `curated-baseline`. Do not infer neurotransmitter, excitation/inhibition, latency, axon count, connection weight or confidence from the edge kind.

## Pathways

Pathway definitions are ordered explanatory sequences. Entries marked partial omit known intermediate structures and must not be interpreted as a complete anatomical route.

Future work should add source references per edge, laterality, species, atlas mapping, tract evidence type, and provenance. Weighted connectomes should be a separate dataset-specific layer rather than arbitrary numbers in the base model.
