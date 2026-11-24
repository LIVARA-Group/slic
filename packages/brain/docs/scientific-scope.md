# Scientific scope, limitations and source register

## Scope statement

This package is an engineering-oriented, curated conceptual model of selected human neuroanatomy and functional relationships. It is not exhaustive and is not a medical reference, diagnostic tool, validated connectome, or biologically faithful simulation.

The human brain contains tens of billions of neurons and vastly more synapses. A complete cell-level connectome and a complete account of cognition are not available as a single settled reference model. Therefore, “every piece from A to Z” is not a responsible claim for this package.

## Important interpretation constraints

1. The first supplied diagram contains a computer-inspired functional analogy (MUX/DEMUX, B-CPU, conscious engine). It can inspire software architecture, but those labels are not literal anatomical structures.
2. Cognitive functions are distributed. Working memory, attention, emotion, language and decision-making should not be mapped one-to-one to a single brain region.
3. Labels such as “limbic system” and “Wernicke's area” have variable definitions across scientific literature. This package marks them as network/functional labels where appropriate.
4. Sensory boundary structures such as retina and cochlea are included for pathway continuity, but are not brain tissue proper.
5. A connection marked `curated-baseline` is not a quantitative confidence score or evidence grade.
6. Simplified pathways explicitly omit intermediate relays. Do not use them for clinical, physiological or educational claims requiring full tract detail.

## Source register for future validation

The following are authoritative starting points for dataset-backed expansion. The current baseline is not represented as having been imported or validated against these sources.

- **Allen Brain Atlas:** anatomical reference resources and brain atlases. https://brain-map.org/
- **Human Connectome Project:** human structural and functional connectivity research resources. https://www.humanconnectome.org/
- **EBRAINS / Human Brain Project atlas resources:** brain atlases and neuroscience data infrastructure. https://www.ebrains.eu/
- **Brodmann areas:** use a named atlas/parcellation and document mapping uncertainty; do not treat Brodmann labels as universal functional boundaries.
- **Uberon:** cross-species anatomical ontology. https://obophenotype.github.io/uberon/

## Required provenance fields before scientific release

For each imported or curated datum, record:
- source title and publisher;
- source URL or persistent identifier;
- dataset/atlas version and release date;
- species and population, where applicable;
- coordinate space and parcellation;
- original identifier and local SLIC identifier;
- evidence modality (tract tracing, diffusion MRI, functional association, review, etc.);
- transformation/mapping procedure;
- reviewer and review date;
- known limitations.

Do not promote this baseline to a scientific atlas until that provenance and validation process exists.
