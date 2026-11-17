# 1. Purpose
Define one logical model for information in SLIC: object types, epistemic states, time, provenance, relations and the database design that realises them. Errors here propagate into storage, graph, search, AI, sync and export, so this document is the most constrained one in the package.

# 2. Scope
Canonical model for both contours (shared vocabulary, separate physical stores — ADR-002). Field-level detail: Appendix B. Storage mappings: doc 08 (Personal) and doc 15 (Investigative).

# 3. Dependencies
Research Pack 02 (all) @SD@; doc 02 requirements FR-ENT/REL/SRC/HYP, INT-001…005. Open: OQ-04 (authoritative object model), OQ-07 (provenance coverage), OQ-13 (Note representation), ADR-014/015/016/026.

# 4. Requirements
| Req | Statement |
|---|---|
| INT-001 | no dangling references; checker available |
| INT-002 | revisions immutable |
| INT-004 | temporal invariants enforced |
| INT-005 | AI output never canonical-verified without human review event |
| FR-SRC-001…003 | sources, observations with locators, claims with evidence and separate status fields |
| FR-REL-001/002 | typed, validated relations; derived inverses |
| Source principles @SD@ | distinct types; reversible entity resolution; no hypothesis silently becomes fact; deletion ≠ correction (tombstones, holds, erasure modelled explicitly); "unknown" ≠ 0 |

# 5. Design
## 5.1 Canonical domain model
@@IMG|d09_domain_model|Figure 6.1 Canonical domain model (types and principal relationships; @SD@ taxonomy 02§3, proposals @R@: Note, Collection, ai_proposal staging, review_event)|@SD@/@R@@@

The pillars (Structure, Life, Information, Complexity) are **lenses**, not databases or services @SD@ (00§0): Structure → Entity/Relation/Collection; Life → Event/Revision/time fields; Information → Source/Observation/Claim/Provenance; Complexity → Hypothesis, causal predicates, scenarios (deferred).

### Type specifications
| Type | Purpose | Lifecycle | Key relationships | Validation / invariants | Versioning | Example |
|---|---|---|---|---|---|---|
| **Entity** | Persistent referent | active → merged (reversible) / archived / tombstone | aliases, identifiers, relations, claims | type fixed at creation; label NFC 1–300; merge records evidence and is reversible | revisioned | *Organisation "Acme Ltd"* |
| **Note** (@R@, OQ-13) | User-authored Markdown | draft → active → archived/tombstone | links to any object; frozen revision may be a source | body size limit; sanitised on render only | every commit = revision | *"Meeting notes 12 Nov"* |
| **Source Artifact** | Captured representation of a source | immutable once registered | attachment bytes; observations | hash, media type, length, acquired_at, collector required; derivatives separate | immutable (annotations revisioned) | *PDF snapshot, SHA-256 h* |
| **Observation** | What a source directly shows | immutable | source, locator, activity | locator bound to snapshot; minimal interpretation | immutable; correction supersedes | *"Invoice total 4,200 EUR (p.2, box…)"* |
| **Claim** | Proposition about entity/event/relation | statuses are independent fields | subject, object, evidence links | evidence optional but absence flagged; reviewed requires review event | revisioned | *"Acme Ltd acquired Beta Inc"* valid 2024-03 |
| **Hypothesis** | Candidate explanation | open/competing → supported/rejected/superseded | claims (role) | falsifiers required; no averaging across hypotheses | revisioned | *"Delay caused by supplier change"* |
| **Decision** | Accountable choice | immutable once recorded; may be superseded | claims/hypotheses considered, actor, approval | actor human/org; rationale + alternatives required | append annotations | *"Adopt supplier B"* |
| **Action** | Planned/performed activity | planned → performed/cancelled | decision | never inferred from model output | revisioned | *"Send request to supplier"* |
| **Event** | Real-world occurrence | revisionable | participants (relations) | event time with precision enum; distinct from acquired/recorded time | revisioned | *"Contract signed 2024-03-14"* |
| **Revision** | Immutable state record | create-only | any object | contiguous numbering; prev_hash chain | n/a | rev 5 of a note |
| **Relation** | Typed directed edge | created → closed (valid/tx intervals) | endpoints (any registry object), predicate_def | domain/range/class/temporal rules from predicate | revisioned | *Acme —ownerOf→ Beta* |
| **Collection/Project** | Grouping | active → archived | members (any object) | acyclic nesting (v1.x), depth limit | revisioned | *Project "Supplier review"* |
| **Attachment** | Binary blob | refcounted; orphan cleanup | source artifact | content hash unique per scope | immutable | *scan.pdf* |
| **Actor / Agent** | Human, software, model, organisation | versioned | activities, reviews | model agents record provider/model/version/quantisation | versioned | *OCR engine v3.2* |
| **Provenance Record** (activity + links) | How an object was produced | immutable | derived objects, sources, agents | every derived object has a path or an explicit reason none exists | immutable | *Extraction activity E1 used source S, produced observation O* |

*Entity vs Collection:* a Project/Collection is a grouping container, not a referent. A user who wants to relate a project as a subject may create an Entity (type `concept` or `other`) and link it; the system does not auto-create one. This avoids a universal container type and keeps relation semantics explicit (SI-11).

## 5.2 Epistemic model
@@IMG|d10_epistemic_lifecycle|Figure 6.2 Epistemic state machines (separate dimensions; AI proposals staged outside canonical tables)|@R@@@

**Correction of a source ambiguity (SI-02, SI-03).** The Research Pack's epistemic table mixes *object kinds* (source artifact, observation, hypothesis) with *statuses* (supported, disputed, rejected) and lists "Reviewed conclusion" as a state @SD@ (02§4). Here **object type** is fixed by the table in §5.1; **status** lives in separate, independent fields; "Reviewed conclusion" is `review_status ∈ {accepted, edited}` on a Claim or Hypothesis, optionally referenced by a Decision.

| Dimension | Values | Who may set it |
|---|---|---|
| Claim.origin | human, ai_proposal_accepted, import, derived_rule | system, at creation; immutable |
| Claim.assessment | unassessed → supported/disputed/rejected/superseded | human (or deterministic rule recorded as activity) |
| review_status | none → pending → accepted/edited/rejected | **human reviewer only**, with review event |
| Hypothesis.status | open, competing, supported, rejected, superseded | human |
| ai_proposal.review_status | pending → accepted/edited/rejected/deferred | human |

Rules: (1) A Claim is a *neutral container*; truth status is never inferred from origin, repetition, graph proximity or model score @SD@. (2) Confidence is **not** a single number: source reliability, extraction confidence, claim support/contradiction and analyst confidence are separate fields; "unknown", "not assessed" and "not applicable" are distinct from zero @SD@. (3) Correlated sources carry an `independence_group` so they are not counted as independent corroboration @SD@. (4) Competing hypotheses stay separate with assumptions, predictions, supporting and contradicting evidence and falsifiers @SD@. (5) The structure supports refutation, alternative explanations and revisiting decisions (superseding Decision/Claim records, never deleting).

## 5.3 Temporal model
Definitions @SD@: **Valid time** — when a statement applies in the world; **Transaction time** — when SLIC recorded/believed it. Fields: Appendix B §4. Policies @R@ (ADR-015): valid time may be an instant, interval, approximate or unknown (precision enum, never forced precision); transaction time is system-controlled — server clock in Investigative; in Personal a device monotonic `tx_seq` orders history and the wall-clock is advisory (client clocks are untrusted); source-provided timestamps are stored separately and never used for ordering.

| Question | Answer mechanism |
|---|---|
| What did we know on date D? | latest revision of each object with `tx_from ≤ D < tx_to` (as-of transaction time) |
| When did it become known? | `tx_from` of the first revision containing the statement |
| What value was current in the past? | as-of query on (valid_at, tx_at) |
| When did our understanding change? | revision chain with `change_kind`/`change_ref` |
| Restore a prior state | create new revision copying the payload of revision *n* (history preserved) |

Illustrative as-of query (PostgreSQL, Investigative) @R@: `SELECT … FROM claim_history c WHERE c.tx_from <= :tx_at AND (c.tx_to IS NULL OR c.tx_to > :tx_at) AND c.valid_during @> :valid_at`. Personal engines implement the same semantics through the query port (doc 08 §5.6).

## 5.4 Provenance model
Use W3C PROV-O (Entity–Activity–Agent) as an **interoperability reference**, not the internal storage format @SD@ (02§5; PROV-O pack-cited). SLIC adds acquisition method, transformation version, locator, model/prompt version, reviewer and validation result.

| SLIC object | PROV-O alignment |
|---|---|
| Source artifact / extracted text / claim proposal | prov:Entity |
| Capture, OCR, extraction, review, import, ai_run | prov:Activity |
| User, parser build, model, organisation | prov:Agent (Person / SoftwareAgent / Organization) |
| provenance_link kinds | wasDerivedFrom, wasGeneratedBy, used, wasAttributedTo, wasReviewedBy |

**Locator strategy (ADR-016).** A locator is `{kind, unit, start, end, quote_exact, quote_prefix, quote_suffix, snapshot_hash, norm_version}` and is bound to an **immutable snapshot**. Offsets use Unicode **code points over NFC-normalised text** (avoids UTF-16 surrogate errors in JavaScript); other kinds use page+box, timecode, JSON pointer, DOM selector, table cell. When a source changes, a **new snapshot** is registered; old observations keep resolving to the old snapshot; re-anchoring creates new observations via an explicit activity (never silent mutation). Quote prefix/suffix support re-anchoring heuristics. Text selectors of the W3C Web Annotation model are an inspiration (@R@, not re-verified here).

**Provenance coverage (proposed operational definition for OQ-07, @OD@ pending ratification).** *Coverage = claims having ≥1 valid evidence link whose observation has a valid locator against an existing snapshot, plus a recorded activity (agent+version), divided by all claims.* Claims lacking any element are flagged "no provenance" (visible defect) and cannot reach `review_status=accepted` in governed contexts. This is a definition of a metric, not an assertion that 100% will be achieved.

## 5.5 Relations
Physical edge (`relation` row) is separate from meaning (`predicate_def`). Class reconciliation:
| Research Pack classes @SD@ (02§7) | Proposed `predicate.class` @R@ | Brief classes |
|---|---|---|
| Identity / equivalence (sameAs, aliasOf, duplicateOf) | identity | Semantic |
| Structural (memberOf, owns, locatedAt, partOf) | structural | Structural |
| Informational (cites, derivedFrom, mentions, observedIn) | provenance (derivedFrom, observedIn) / semantic (mentions, cites) | Provenance / Semantic |
| Operational (transferredTo, controlledBy, interactedWith) | semantic (requires event/temporal semantics) | Semantic + Temporal |
| Analytical (associatedWith, correlatesWith, supports, contradicts) | analytical (must not imply causation) | Analytical |
| Causal (causes, contributesTo, prevents) | causal (requires model, assumptions, evidence) | Analytical |
| — | temporal (before, during, overlaps) | Temporal |
(SI-13: the pack uses six classes, the brief five; seven concrete classes cover both.)

Relation matrix required endpoints: Entity↔Entity; Entity↔Source; Source↔Observation; Observation↔Claim (via `claim_evidence`, not `relation`); Claim↔Hypothesis (`hypothesis_claim`); Hypothesis↔Decision; Event↔Entity; Object↔Revision (structural). Evidence and hypothesis links are dedicated tables because they carry polarity/role/independence data.

Deletion semantics by class (validated by T-REL-003): structural → block or cascade per predicate; analytical/causal → tombstone with history; provenance → never cascade-delete (blocks deletion of used sources unless erasure workflow); identity → merge reversal.

## 5.6 Database design
@@IMG|d11_erd|Figure 6.3 ERD — epistemic and provenance core (logical)|@R@@@
@@IMG|d22_erd_structure|Figure 6.4 ERD — structure, revisions, relations, collections (logical)|@R@@@

**Design decisions @R@.** (1) Typed tables, no universal JSON `items` table. (2) `object_registry` (id, type, scope) gives FK-safe polymorphic references; each typed table's PK is also an FK to it. (3) Current state in typed tables with `rev`, `tx_from`, `tx_to`; history in `revision` (full snapshots, hash-linked; ADR-014). (4) JSON/JSONB only for versioned, validated property bags (entity properties, revision payload), never for core relationships. (5) Entity identity ≠ label. (6) Investigative rows carry `tenant_id` and `case_id` and **composite foreign keys** include them, so a reference cannot cross scope even by mistake.

Physical schema excerpt — Investigative / PostgreSQL (illustrative, untested; ADR-003 Proposed):
```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE object_registry (
  tenant_id uuid NOT NULL, case_id uuid NOT NULL, id uuid NOT NULL,
  object_type text NOT NULL CHECK (object_type IN ('note','entity','source_artifact','observation',
    'claim','hypothesis','decision','action','event','collection','attachment','agent','activity','relation')),
  PRIMARY KEY (id), UNIQUE (tenant_id, case_id, id));
CREATE TABLE revision (
  tenant_id uuid NOT NULL, case_id uuid NOT NULL, object_id uuid NOT NULL, rev int NOT NULL CHECK (rev >= 1),
  tx_from timestamptz NOT NULL DEFAULT clock_timestamp(), payload jsonb NOT NULL, schema_version int NOT NULL,
  prev_hash bytea, content_hash bytea NOT NULL, change_kind text NOT NULL,
  PRIMARY KEY (object_id, rev),
  FOREIGN KEY (tenant_id, case_id, object_id) REFERENCES object_registry (tenant_id, case_id, id));
-- immutability: REVOKE UPDATE, DELETE ON revision FROM app_rw; plus a trigger that raises on UPDATE/DELETE
CREATE TABLE relation (
  tenant_id uuid NOT NULL, case_id uuid NOT NULL, id uuid PRIMARY KEY,
  subject_id uuid NOT NULL, predicate text NOT NULL REFERENCES predicate_def(key), object_id uuid NOT NULL,
  valid_during tstzrange, tx_from timestamptz NOT NULL, tx_to timestamptz,
  FOREIGN KEY (tenant_id, case_id, subject_id) REFERENCES object_registry (tenant_id, case_id, id),
  FOREIGN KEY (tenant_id, case_id, object_id)  REFERENCES object_registry (tenant_id, case_id, id));
-- predicates requiring single-valued current state add an EXCLUDE USING gist constraint on (subject_id, predicate, valid_during)
ALTER TABLE relation ENABLE ROW LEVEL SECURITY; ALTER TABLE relation FORCE ROW LEVEL SECURITY;
```
Personal mapping: same logical tables; engine mapping in doc 08 §5 (IndexedDB object stores or SQLite tables). Referential integrity is enforced by repositories (and SQL FKs where the engine has them) plus the integrity checker (INT-001).

| Constraint class | Rules |
|---|---|
| Primary keys | UUIDv7 (ADR-011); revision PK (object_id, rev) |
| Foreign keys | all references via registry; composite scope keys in Investigative |
| Unique | registry (scope,id); attachment (scope, content_hash); predicate key; (collection, member) |
| Check | enums; valid_from ≤ valid_to; ended_at ≥ started_at; `exactly one of object_ref, value` on claim; AI-origin claims require review event for accepted status |
| Indexes | (subject_id,predicate), (object_id,predicate), partial `tx_to IS NULL`, (source_id), alias (namespace,value_norm), lexical index (derived, separate) |
| Transactions | one unit of work per command: object rows + revision + provenance + outbox commit atomically |

**Migration strategy.** Versioned forward migrations with checksums; expand/contract for Investigative; Personal migrations run in a worker with a pre-migration snapshot, are resumable, and verified by row counts and hashes (REL-002, T-MIG-001/002). Schema versions are carried in revisions and exports so older data stays readable.

**Data lifecycle.** Create → revise → supersede/tombstone. Personal: user-controlled export/delete; deletion semantics documented with residuals (PRV-003). Investigative: retention policy, legal hold and erasure workflows modelled explicitly and conflict-resolved by policy (hold wins) @SD@ (02§11, 04§11).

# 6. Technology
PostgreSQL features used: constraints, range/exclusion constraints (`btree_gist`), RLS (@V@ docs level 1 for RLS semantics; range/exclusion usage @R@), JSONB with schema/version controls @SD@. SHACL is not used internally: it validates RDF graphs, not relational schemas @SD@; RDF/SHACL mapping is an optional interchange/validation layer if justified later. Domain validators: Zod (candidate) generated from the same contract definitions as Appendix C.

# 7. Implementation
1. Fixture dataset workshop: 3 real-shaped sample vaults and 2 case-shaped datasets exercise every type (WP-030). 2. Encode invariants as pure functions + property tests (T-PRP-001/002/003, T-EPI-001). 3. Define predicate registry v1 (≈25 predicates). 4. Write Appendix B migrations for both engines. 5. Implement repositories and checker (WP-040/052). 6. Review with a domain expert that no category error is possible through the API.

# 8. Data & Contracts
Appendix B (fields), Appendix C (operations/events). Export format represents all object classes, revisions, provenance and relations (doc 12).

# 9. Security
Sensitivity classes per field (Appendix B). Hashes and locators are DERIVED data: treat as content for leakage analysis (equality/dictionary oracle) @SD@ (04§7). Investigative metadata (counts, titles, facets) is authorised before disclosure. Domain services — not the database alone — enforce epistemic rules.

# 10. Failure Handling
Invalid transitions → `CONFLICT`; missing evidence → "no provenance" flag; partial imports → closure validation, unresolved references reported not created; migration failures → rollback to snapshot; ambiguity during entity merge → reversible action with evidence recorded.

# 11. Testing
T-EPI-001/002, T-SRC-001/002/003, T-REV-001/002, T-REL-001/002/003, T-TMP-001/002, T-PRP-001/002/003/004, T-INT-001, T-MIG-001/002, T-ENT-001/002/003.

# 12. Acceptance Criteria
SG2: sample datasets validate with no category ambiguity (pack Phase 1 exit gate @SD@); invariants executable; both ERDs reviewed; OQ-04 and OQ-13 decided; ADR-014/015/016/026 Accepted or explicitly provisional.

# 13. Deliverables
Domain library (types, validators, predicate registry), logical and physical schemas, migrations, fixtures, invariant test suite, data dictionary.

# 14. Risks
Model rework if OQ-04 is wrong (mitigate with fixtures + early workshop); over-modelling for v1.0 (Hypothesis/Decision/Action UI deferred but schema ready); polymorphic references in engines without FKs (checker + repository enforcement).

# 15. Open Decisions
OQ-04, OQ-07, OQ-13, OQ-17; ADR-014 (snapshot vs delta), ADR-015, ADR-016, ADR-026; extensible ontology per user/team (pack 02§12) — not in v1.0; controlled vocabularies for financial/crypto/legal/geospatial domains; policy for special-category and non-pertinent third-party PII (OQ-03).

# 16. References
Research Pack 02 §1–12, 00 §6 @SD@. W3C PROV-O (pack-cited, level 3). W3C SHACL (pack-cited, level 3). PostgreSQL 18 Row Security Policies (level 1). W3C Web Annotation Data Model (not verified).
