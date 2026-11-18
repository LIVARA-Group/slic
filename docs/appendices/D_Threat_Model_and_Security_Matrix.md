# 1. Purpose
Asset/threat/mitigation/verification matrices for both contours. Status: threat identification @SD@ (Research Pack doc 04 §2) extended with mitigations @R@; no mitigation is claimed implemented. Each row names the tests that must pass (Appendix E).

# 2. How to read
Impact is qualitative. "Verification" lists test IDs from Appendix E or a review activity. Rows marked with an open question (OQ-xx) cannot be closed until that question is answered. A threat model is a living artefact; sign-off per contour is a release gate (doc 16 §12).

# 3. Assumptions and out-of-scope
- The endpoint and browser are trusted while unlocked; a compromised endpoint defeats E2EE for data displayed or processed there @SD@.
- Nation-state-level adversaries and hardware attacks are out of scope until the customer model (OQ-02) says otherwise.
- Legal admissibility is out of scope for any technical control (doc 11 §5.9).

# 4. Personal Contour
> **Threat-matrix gap:** Personal-contour asset/threat/mitigation rows are not included in this repository edition. The assumptions above and the security design in [Document 11](../markdown/11_Security_and_Data_Integrity.md) are not a substitute for a reviewed, test-linked threat model.

# 5. Investigative Contour
> **Threat-matrix gap:** Investigative-contour asset/threat/mitigation rows are not included in this repository edition. The cross-cutting STRIDE table below is illustrative coverage, not a complete risk assessment or security sign-off.

# 6. Cross-cutting STRIDE coverage check
| Category | Covered by (examples) |
|---|---|
| Spoofing | device-bound credentials; phishing-resistant authentication (Inv); envelope signatures |
| Tampering | AEAD with AAD; content hashes; hash-chained audit; immutable object versions |
| Repudiation | audit events; review events with reviewer identity |
| Information disclosure | E2EE; deny-by-default; metadata authorisation; log hygiene |
| Denial of service | quotas, size limits, resource-limited parsers, rate limits |
| Elevation of privilege | non-owner DB roles, FORCE RLS, separated service identities, step-up |
