# 1. Purpose
Operation, event and error contracts derived from domain operations (doc 06), not from a wish list of endpoints. Personal operations are **in-process application ports** (typed commands/queries over the local repository); only the Personal relay and the Investigative service expose network APIs. Status: @R@ unless noted.

# 2. Conventions
- **Command/query separation.** Commands change state and emit Application Events; queries do not. No generic "update any field" endpoint exists.
- **Contract format.** Schemas are written in TypeScript with Zod runtime validators generated from a single definition (candidate, @R@, ADR-001); network APIs publish an OpenAPI 3.x description generated from the same definitions (candidate).
- **Versioning.** URL or header major version for network APIs; `schema_version` in every stored/exchanged payload; additive changes only within a major version; unknown fields preserved on round trip.
- **Idempotency.** Retryable commands carry an idempotency key (or a deterministic natural key such as content hash). Re-delivery returns the original result.
- **Optimistic concurrency.** Mutable objects require `expected_rev`; mismatch yields `STALE_REVISION` with the current revision.
- **Pagination.** Cursor-based, opaque cursors, server-enforced maximum page size; graph traversals additionally enforce depth and node limits (`DEPTH_LIMIT`).
- **Authentication/authorization.** Personal relay: device-bound credentials; the relay's authorization only decides whether a device may read/write ciphertext of its own vault. Investigative: strong authentication, deny-by-default case-scoped authorization in domain services, uniform `NOT_FOUND` for out-of-scope resources (SEC-009).
- **Error shape.** `{code, message, details[], correlation_id}`; `correlation_id` carries no content (PRV-002).

# 3. Operations
@@OPS@@

# 4. Application Events
Application Events are software messages, distinct from the domain type **Event** (glossary). Personal events are in-process; Investigative events use a transactional outbox so that a state change and its event commit together. Delivery is at-least-once; consumers must be idempotent.
@@EVENTS@@

# 5. Event payload rules
- Payloads carry identifiers, revisions and hashes — not content — so that telemetry, logs and audit sinks cannot become content leaks (PRV-002).
- Each event has `event_id`, `occurred_at` (system time), `schema_version`, `actor` and `scope` (vault, or tenant+case).
- Breaking payload changes require a new event name or major schema version.

# 6. Error codes
@@ERRORS@@

# 7. Retry semantics
Clients retry only on `STORAGE_FAILURE`, `INDEX_REBUILDING`, `QUOTA` (after user action) and network errors, always with the same idempotency key. `STALE_REVISION` requires re-read and re-decision, never blind retry. `REPLAY` is terminal and treated as success if the original result is known.
