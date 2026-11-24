# Roadmap

## Phase 0 — Domain baseline (this package)
- Stable identifiers and hierarchical anatomy.
- Curated connection registry and pathway examples.
- Functional system and cognitive-process contracts.
- Graph queries, validation and bounded trace.
- Documentation of limitations and provenance requirements.

## Phase 1 — Scientific provenance
- Select canonical human atlas/parcellation.
- Add source records and per-region mappings.
- Replace broad grouped nodes with atlas-specific subdivisions.
- Add laterality and coordinate metadata where supported.
- Add automated checks for parent hierarchy and edge provenance.

## Phase 2 — Visualization adapter
- Export graph nodes and edges in a renderer-neutral format.
- Add layout metadata separately from anatomy.
- Provide filters by lobe, system, modality, edge kind and evidence status.
- Build a separate UI package; do not add React or Three.js here.

## Phase 3 — Data-driven connectome
- Import selected tractography/connectivity datasets.
- Keep structural connectivity distinct from functional connectivity.
- Preserve dataset version, species, parcellation and methodology.
- Add confidence/weight only with source-defined semantics.

## Phase 4 — Simulation research
- Define the intended level: abstract event flow, population model, neural mass model, or spiking network.
- Establish scientific requirements and validation fixtures.
- Benchmark a TypeScript prototype.
- Evaluate Rust/WASM only after profiling.

## Release gates
- No dangling region references.
- No duplicate identifiers.
- No undocumented scientific edges.
- No claims of complete anatomy or cognition.
- Public API and data changes covered by tests.
- Source/provenance review before scientific dataset release.
