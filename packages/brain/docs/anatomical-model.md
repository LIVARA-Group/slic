# Anatomical model

## Structure record

Every region has:

- a stable machine identifier;
- display name;
- structural kind;
- optional parent identifier;
- high-level functional annotations;
- a short scope note.

`RegionId` is derived from the `regions` registry. Parent-child nesting describes anatomical containment or a curated organizational grouping; it is not a connectivity edge.

## Coverage in this baseline

The initial registry includes:

- central nervous system and brain divisions;
- cerebral hemispheres and selected cortical lobes/regions;
- selected primary cortical areas and Brodmann associations;
- medial temporal structures and hippocampal formation;
- amygdala and basal ganglia structures;
- thalamic nuclei and hypothalamus;
- midbrain, pons, medulla and selected brainstem nuclei;
- cerebellar cortex and deep nuclei;
- selected white-matter tracts;
- sensory boundary structures (retina, cochlea, dorsal root ganglion) and spinal cord.

Some structures are intentionally represented as grouped nodes. For example, the thalamus is a parent node with selected relay nuclei, not an exhaustive thalamic nuclear atlas.

## Later anatomical expansion

Recommended hierarchy:

1. Major divisions and lobes.
2. Cortical gyri, sulci, and parcellation-specific cortical areas.
3. Subcortical nuclei and their subdivisions.
4. White-matter tracts and tract segments.
5. Brainstem nuclei and cranial nerve nuclei.
6. Cerebellar lobules, zones and nuclei.
7. Cell types and microcircuits only when a specific dataset and use case justify them.

Do not mix parcellation systems without recording the atlas and version. A region identifier should remain stable even if labels or atlas mappings evolve; atlas-specific identifiers belong in a mapping layer.
