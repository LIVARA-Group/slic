# 1. Purpose
This package turns the **SLIC Engineering Research Pack v0.1** (13 November 2026) into an implementation-oriented engineering blueprint: 18 main documents, 8 appendices and a source/QA layer. It is meant to be read and challenged by an engineering team and kept in Git next to the code.

It is **not** an approved production design. No proof of concept has been run, no benchmark executed, no cryptographic protocol reviewed. Every performance figure is a target to be measured; every technology that the Research Pack left open is still open here, now with a concrete experiment, decision rule and ADR slot.

# 2. Scope
In scope: the engineering path from the current research state to **Personal Contour v1.0**, plus the **Investigative technical foundation**, plus clearly gated advanced capabilities (encrypted sync, AI assistance). Out of scope: market analysis, legal opinion, security certification, cost quotes, delivery dates (the team and capacity are unknown — OQ-16).

# 3. Statement labels used throughout
| Label | Meaning | Rule |
|---|---|---|
| @SD@ Source-derived | Present in the Research Pack | Cite the pack document and section |
| @V@ Verified | Confirmed against primary technical documentation, a standard, or a reproducible experiment | Listed with verification level in `sources/External_References.pdf`; "secondary" or "pack-cited" levels are shown explicitly |
| @R@ Recommendation | Engineering proposal of this programme | Rationale given; may be overturned by evidence |
| @OD@ Open Decision | Not enough evidence | Options, experiment, acceptance criteria and ADR slot provided |

**Verified does not mean "true for SLIC".** A verified statement about PostgreSQL or Web Crypto supports only the scope of that source; it never proves that a technology fits SLIC.

# 4. Package map
| ID | Document | Purpose | Stage |
|---|---|---|---|
| 00 | README & Documentation Guide | This guide, index, rules | — |
| 01 | Engineering Master Plan | Sequence, dependencies, gates, critical path | S0 |
| 02 | Engineering Foundation | Requirements catalogue, ADR system | S0 |
| 03 | System Architecture | Context, containers, components, boundaries | S0 |
| 04 | Infrastructure & DevOps | Repo, environments, CI/CD, topology, cost model structure | S0 |
| 05 | Technical Validation & POCs | Ten experiment protocols | S1 |
| 06 | Domain & Data Architecture | Canonical model, epistemics, time, provenance, schema | S2 |
| 07 | Application Architecture | Layers, services, state, design system | S2 |
| 08 | Local Storage Engine | Personal persistence subsystem | S3 |
| 09 | Core Product Implementation | Capture, notes, entities, sources, relations, collections | S3 |
| 10 | Knowledge Navigation | Search, graph, timeline, visualisation | S3 |
| 11 | Security & Data Integrity | Threat models, crypto architecture, privacy, integrity | S4 |
| 12 | Import & Export Architecture | Portability, backup, verified restore | S4 |
| 13 | AI Engineering | Controlled AI subsystem | S5 |
| 14 | Synchronization Engineering | Encrypted multi-device sync | S5 |
| 15 | Investigative Contour Foundation | Tenants, cases, evidence, audit | S6 |
| 16 | Testing & Production Readiness | Test strategy, gates, operations | S7 |
| 17 | Release Engineering | v1.0 definition and release process | S7 |
| A–H | Appendices | ADRs, data dictionary, contracts, threat matrix, tests, infrastructure, glossary, open questions/risks | — |
| sources | Source Register, External References, Original Research Pack | Evidence base | — |

Numbering is a reading order, not an execution order. Execution order is in document 01.

# 5. Dependency map and reading order
@@IMG|d19_doc_map|Figure 0.1 Document dependency map (solid = content dependency, dashed = programme guidance)|@R@@@
Recommended reading: 00 → 01 → 02 → 03 → 05 → 06 → 08 → 09 → 11 → (12, 10) → 14/13 → 15 → 16 → 17. Security reviewers should read 03, 11, 14, 15 and Appendix D first; storage engineers 05, 06, 08, 12; QA 02, 16, Appendices E and H.

# 6. Traceability model
@@IMG|d20_traceability|Figure 0.2 Requirements traceability chain|@R@@@
The full Requirements Traceability Matrix is generated from the same data as the requirements catalogue (document 02) and test catalogue (Appendix E) and appears in Appendix E §5. The QA Report records the mechanical checks (every requirement has a test, every test traces to a requirement, every requirement maps to a work package).

# 7. Rules for changing the documentation
1. **Docs-as-code.** Sources are Markdown plus DOT/Python diagram sources in `source_package/`; PDFs are build products. Changes go through pull requests reviewed like code. @R@
2. **ADR discipline.** A change to a decision is a new ADR that supersedes the old; statuses follow Appendix A §2.
3. **Version numbers.** Package version `MAJOR.MINOR`: MAJOR when an Accepted ADR, an invariant or the release scope changes; MINOR for all other substantive edits. Each document carries its own date and the baseline it was derived from.
4. **Evidence updates.** When a POC runs, results are added to document 05 and the ADR's *Validation evidence* field; labels change from @OD@ to @V@/@R@ in the same change.
5. **Open decisions are never deleted** — they move to a closed section with the deciding ADR.
6. **Terminology** changes are made in Appendix G first.

# 7. Source materials
The Research Pack contains eight PDFs (`sources/Original_Research_Pack.pdf` merges them). It was built from two further artefacts — *LIVARA Group.pdf* and *SLIC-Research-and-Documentation-Checklist.pdf* — which **were not supplied** to this programme (OQ-18). Statements about their content are known only through the pack.

# 8. Limitations of this documentation
- No experiments executed; Results fields in document 05 are intentionally empty.
- External references were checked selectively (see verification levels); remaining ones are carried from the pack and must be re-verified before they support a release decision.
- No decision owner, team, budget, jurisdiction or customer is known; decisions depending on them are @OD@.
- Dates are not given. Effort estimation criteria are in document 01 §10.
- Wording of invariants from the Research Pack is preserved; this package never promises: brain replication, absolute immutability, absolute zero-knowledge, legal admissibility, automatic establishment of guilt or intent, measured performance, a ready-made key-recovery system from WebAuthn, or a pre-selected CRDT/graph/vector engine.

# 9. Document index and deliverables
The deliverable set is: ZIP of PDFs; this README; the Document Index (§4); ADR Register (Appendix A); Open Decisions Register (Appendix H §2); QA Report (`QA_Report.pdf`); Source Register (`sources/Source_Register.pdf`); `MANIFEST.json` / `SHA256SUMS`; and `source_package/` containing Markdown, DOT and generator sources.
