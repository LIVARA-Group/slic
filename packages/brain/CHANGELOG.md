# Changelog

## 0.4.0

- Merged the SLIC prototype model into the registry: +73 structures (now 144), +182 connections (now 208), +32 pathways (now 38), +14 cognitive processes (now 24), +18 cortical fields.
- `RegionId` is now a literal union derived from the registry (previously widened to `string`), so unknown identifiers in connections, pathways and processes fail at compile time.
- Added optional `effect` and `neurotransmitter` fields to `ConnectionDefinition`.
- Added `getBrainPart`, `FrontalRegionId`, `RestOfBrainRegionId` and `BrainRegionId` for the frontal / rest-of-brain division, derived from the hierarchy.
- Added `validateProvenance`, `validateCoverage` and `getProvenanceSummary` (warnings only).
- Added `*-extended.ts` data modules; baseline data modules are unchanged apart from merging the extended arrays.
- Simulation parameters (latency, weight) are intentionally NOT part of this package; see `@repo/brain-sim`.

## 0.1.0

- Initial data-driven anatomical and functional brain model.
- Added region hierarchy, curated connectome, selected pathways and functional systems.
- Added cognitive process/event contracts, graph queries and bounded signal tracing.
- Added scientific-scope documentation and expansion roadmap.
