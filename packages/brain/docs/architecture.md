# Architecture

## Purpose

The `@repo/brain` package provides a typed, curated conceptual model of selected neuroanatomical structures and their functional relationships.

## Responsibilities

The package owns:

- Anatomical identifiers and definitions.
- Parent-child anatomical hierarchy.
- Functional system membership.
- Curated connectivity definitions.
- Simplified pathway descriptions.
- Cognitive process contracts.
- Graph queries.
- Bounded graph traversal.
- Model integrity validation.

## Non-responsibilities

The package does not own:

- User data.
- Application state.
- Persistence.
- Authentication or authorization.
- AI orchestration.
- User interface.
- Medical diagnosis.
- Physiological neural simulation.

## Module boundaries

### Anatomy

The anatomy module owns the canonical structural vocabulary.

`brainStructures` is the source of truth.

`RegionId` is derived from its literal identifiers.

The `regions` object is a lookup index derived from the registry.

### Connectome

The connectome module owns typed connectivity definitions and explanatory pathways.

Connectivity is independent of the anatomical parent-child hierarchy.

### Cognition

The cognition module describes distributed functional processes.

A cognitive process may involve multiple regions and functional systems.

### Graph

The graph module exposes read-only graph queries.

### Runtime

The runtime module provides bounded traversal over curated connections.

### Validation

The validation module checks registry integrity and cross-module references.

## Dependency direction

- Anatomy depends only on shared types.
- Connectome depends on anatomy and shared types.
- Cognition depends on anatomy and shared types.
- Graph depends on connectome and anatomy.
- Runtime depends on graph.
- Validation depends on anatomy, connectome and cognition.
- The root entry point composes public exports.

No module may import from the root entry point.

## Registry immutability

Registries are authored as immutable definitions.

Identifier types must be derived from registry literals rather than maintained as separate duplicated unions.

## Runtime dependencies

The package has no runtime dependencies.
