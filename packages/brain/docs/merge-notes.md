# Merge notes (0.4.0)

This release merged the SLIC prototype (flat camelCase registry, 105 regions, 192 projections, built-in simulator) into the curated `@repo/brain` model.

## Principles

1. The curated package is the base. Existing identifiers, tests and module boundaries are preserved.
2. Simulation and visualisation stay outside this package (see `architecture.md` and `roadmap.md`): `@repo/brain-sim` and `@repo/brain-viz`.
3. Numeric parameters without source-defined semantics (latency, weight) are not stored here (see roadmap Phase 3). They live in `@repo/brain-sim/src/dynamics.generated.ts`.
4. Qualitative edge properties that are standard anatomy (effect sign, principal neurotransmitter) are optional fields on `ConnectionDefinition`.

## Identifier mapping

Prototype identifiers were converted from camelCase to kebab-case slugs of the structure name (`dorsolateralPFC` -> `dorsolateral-prefrontal-cortex`). Where the base already had a node, the prototype node was mapped onto it:

- Lateralized cortical and limbic nodes map to the **left** node (for example `primaryVisualCortex` -> `left-primary-visual-cortex`), matching the simplification the base connections already use.
- Midline and bilateral nodes map directly (`thalamus`, `retina`, `cerebellum`, `fornix`, ...).

Ten prototype edges duplicated existing baseline edges and were dropped; the baseline edge definition wins.

## Placement of new structures

- New cortical areas are aggregates with `laterality: 'unspecified'`, placed under the left lobe for hierarchy only.
- Receptors sit under `sensory-boundaries`; effectors under the new `motor-boundaries` subsystem.
- `system` (the coarse `StructureSystem`) is derived from functional annotations; it is a heuristic.
- Functional-system membership for new structures is derived from the prototype's function tags (`anatomy/systems-extended.ts`).

## Provenance

Merged entries are `evidence.level: 'moderate'` with empty `sources`. They are an unsourced simplified baseline, not dataset-derived. Release gate "No undocumented scientific edges" is **not yet met** for merged edges; track it with `validateProvenance()`.

## Known gaps

- Right-hemisphere nodes exist in the base but have no connections. A mirrored-edge pass belongs in Phase 1 (laterality).
- Language edges (`wernicke-area` -> `left-broca-area`) are not lateralized-aware.
- Some prototype edges collapse relays (for example direct nucleus-to-effector projections).
- Cognitive processes are co-activation sets, not validated functional networks; the simulator's process detection is heuristic and can over-trigger on densely connected regions.

## Workspace requirements

`@repo/brain-viz` uses `tsx` and `@types/node` through `catalog:`. Add them to your `pnpm-workspace.yaml` catalog if they are not already there.
