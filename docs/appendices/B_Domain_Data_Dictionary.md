# 1. Purpose
Field-level dictionary for the canonical domain model defined in document 06. It is the physical-naming-neutral reference used by both storage mappings (document 08) and the Investigative PostgreSQL schema (document 15). Status of the whole dictionary: @R@ (proposed model), constrained by Source-derived requirements @SD@ in Research Pack doc 02.

# 2. Conventions
- **Scope key.** Personal stores carry `vault_id`; Investigative stores carry `tenant_id` and `case_id`. The two never coexist in one store (ADR-002).
- **Sensitivity classes.** CONTENT = user/case text (titles, bodies, labels, filenames); DERIVED = content-derived metadata including hashes and locators (equality and dictionary-testing oracles — treat as content for leakage analysis, doc 11 §5.8); STRUCT = identifiers, types, timestamps; KEY = key material (never in these tables).
- **Types.** `uuid (v7)` per ADR-011; `timestamp` is UTC; "validated JSON" means JSON validated against a versioned schema with unknown fields preserved.
- **No universal table.** The `object_registry` holds only `id` and `object_type` to give foreign keys to polymorphic endpoints; all content lives in typed tables.

# 3. Enumerations
| Enum | Values |
|---|---|
| ObjectType | note, entity, source_artifact, observation, claim, hypothesis, decision, action, event, collection, attachment, agent, activity, relation |
| EntityType | person, organization, asset, location, account, wallet, document, dataset, concept, other |
| Claim.origin | human, ai_proposal_accepted, import, derived_rule |
| Claim.assessment | unassessed, supported, disputed, rejected, superseded |
| review_status | none, pending, accepted, edited, rejected |
| Evidence polarity | supports, contradicts, context |
| Predicate class | identity, structural, semantic, temporal, provenance, analytical, causal |
| Time precision | instant, interval, approximate, unknown, not_applicable |
| Activity type | capture, extraction, ocr, transformation, review, import, ai_run, merge, restore |
| Locator kind | text_span, pdf_page_box, timecode, json_pointer, dom_selector, table_cell |

# 4. Temporal fields
| Field | Meaning | Controlled by |
|---|---|---|
| created / recorded_at (= tx_from of rev 1) | when SLIC first recorded the object | system |
| tx_from / tx_to | transaction-time interval of a revision | system (server clock in Investigative; device clock + tx_seq in Personal, ADR-015) |
| valid_from / valid_to | when the statement applies in the world | user/analyst, with precision enum |
| event_time_from / to | when an Event occurred | user/analyst |
| source_timestamp | timestamp asserted by the source itself | stored as found; never used for ordering |
| acquired_at | when the source was captured | system |
| superseded_at | = tx_to of the superseded revision | system |

# 5. Versioning rules
1. Every committed change creates a `revision` row; rows are never updated. 2. `rev` is contiguous per object. 3. A restore creates a new revision. 4. Source artifacts and observations are immutable; corrections add new rows that reference and supersede. 5. Tombstones are revisions with `change_kind = tombstone`; in governed contexts nothing is hard-deleted except under an explicit retention/erasure workflow (doc 15 §5.10).

# 6. Entity tables
@@DD@@
