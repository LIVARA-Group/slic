# Connectome Model

## Purpose

The connectome module represents selected curated relationships between anatomical structures.

## Connection definition

Each connection includes:

- Stable identifier.
- Source region.
- Target region.
- Connection kind.
- Directionality.
- Evidence status.
- Evidence metadata.
- Description.

## Directionality

`directed` means the graph edge is traversable from source to target.

`bidirectional` means the edge may be traversed in both directions.

Directionality is a graph traversal property and does not represent physiological signal polarity.

## Connection kinds

Connection kinds categorize the conceptual relationship.

They do not encode:

- Excitatory or inhibitory effects.
- Neurotransmitter identity.
- Synaptic strength.
- Conduction speed.
- Connection weight.
- Neuron count.

## Evidence status

`curated_baseline` identifies a manually curated conceptual definition.

It is not a confidence score.

`dataset_derived` must only be used when dataset identity, version and mapping provenance are available.

`research_candidate` identifies a relationship requiring further review.

## Pathways

Pathways are explanatory ordered sequences of regions and connection references.

They may omit intermediate anatomical structures.

A pathway is not necessarily a complete anatomical route.

## Future extensions

Dataset-backed connectivity should add:

- Dataset identifier.
- Dataset version.
- Source record identifier.
- Atlas mapping.
- Parcellation identity.
- Mapping procedure.
- Provenance and review status.
