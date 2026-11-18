# 1. Purpose
One term, one meaning. Where the Research Pack used metaphors (B-CPU, Cerebrum, Attention Switch, Conscious Engine, sensory cortex, STM/LTM/Visual/Episode) they are **not** engineering terms in this package: they remain UX/vocabulary metaphors until translated into inputs, outputs, state, invariants and failure modes @SD@.

# 2. Terms
| Term | Meaning in this documentation |
|---|---|
| Activity | A recorded process such as capture, extraction, transformation, review, import, or restore. |
| Application Event | A software message emitted by an application; distinct from the domain object Event. |
| Claim | A statement represented separately from its source and observations, with evidence and assessment links. |
| Contour | A separated product and trust context: Personal or Investigative. |
| Entity | A stable identity for a person, organisation, place, asset, or other domain object. |
| Evidence | In the Investigative contour, material handled under custody and governance controls; not a synonym for every source. |
| Event | A real-world occurrence represented in the domain model; not a software message. |
| Observation | A record of what was noticed in a source, ideally with a locator back to that source. |
| Provenance | The recorded origin and transformation path of information. Provenance structure does not prove source quality or truth. |
| Relation | A typed connection between records. A graph path does not, by itself, prove causation. |
| Source Artifact | Preserved source material, distinct from observations or claims derived from it. |
| Transaction time | When a record or revision was stored in the system. |
| Valid time | When a statement is asserted to apply in the world. It can differ from transaction time. |

This is a working glossary of core terms, not a complete generated vocabulary catalogue. Use the [Data Dictionary](B_Domain_Data_Dictionary.md) and [Domain and Data Architecture](../markdown/06_Domain_and_Data_Architecture.md) for the proposed type taxonomy.

# 3. Disambiguations
| Potentially confusing | Rule |
|---|---|
| Event vs Application Event | Event = real-world occurrence (domain type). Application Event = software message. |
| Source vs Evidence | Source Artifact exists in both contours; "Evidence" is used in Investigative for custody-governed material. |
| Verified | In documents, the tag **V** means "supported by a primary technical source or experiment"; it never means "claim verified as true". |
| Hash | Proves byte equality, never truth. |
| Review vs Decision | Review events record human assessment of an object; a Decision is a domain object recording an accountable choice. |
