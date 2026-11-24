# Anatomical Model

## Scope

The anatomy registry represents selected human neuroanatomical structures and selected sensory interfaces.

It is a curated conceptual baseline, not an exhaustive atlas.

## Identifiers

Identifiers use stable kebab-case names.

Examples:

- `central-nervous-system`
- `left-hippocampus`
- `lateral-geniculate-nucleus`
- `primary-visual-cortex`

Identifiers are part of the package API and should not be renamed without considering compatibility.

## Structure definitions

Every structure has:

- Stable ID.
- Display name.
- Structural kind.
- Functional classification.
- Laterality.
- Optional parent ID.
- Description.
- Evidence metadata.
- Optional aliases.

## Hierarchy

Parent-child relationships represent anatomical containment or a deliberate conceptual grouping.

They do not represent neural connectivity.

A structure may participate in multiple functional systems while having only one parent in the hierarchy.

## Laterality

Supported values:

- `left`
- `right`
- `midline`
- `bilateral`
- `unspecified`

## Sensory boundaries

The retina and cochlea are included as sensory interfaces.

Their inclusion does not classify them as brain structures.

The registry explicitly distinguishes sensory boundaries from the brain proper.

## Cortical areas

Cortical area definitions may reference Brodmann areas.

Brodmann mappings are approximate references and must not be treated as exact one-to-one equivalences with modern parcellations.

## Limitations

The registry is not:

- A complete anatomical atlas.
- A complete list of nuclei.
- A validated spatial coordinate system.
- A clinical reference.
