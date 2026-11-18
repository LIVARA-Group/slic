# 1. Purpose
This appendix is intended to hold the test catalogue, requirement links, release gates, and acceptance matrix for Personal v1.0. The source programme reports 109 tests and 74 refined requirements, but the individual rows, acceptance cases, and traceability matrix are not included in this repository edition. No mechanical coverage result or QA report is present here; the counts must not be read as verified coverage.

# 2. Gate codes
GP = Personal v1.0 release · GS = encrypted sync release · GA = AI release · GI = Investigative foundation · GX = later scope.
Automation: **Auto** = runs in CI; **Manual** = scripted human test; **Review** = independent review with recorded outcome; **Drill** = operational exercise.

**Quantities inside scenarios** (e.g. 1000 crash-injection transactions, 50 draft-crash runs, 10^6 simulated encryptions, 100k-object fixtures) are **proposed protocol parameters** chosen to be demanding but runnable; they are not measured results, and they may be changed by the owner at SG0/SG1 with a recorded rationale.

# 3. Test catalogue
> **Catalogue gap:** The individual test definitions are not included in this repository edition. Test IDs referenced elsewhere are traceability references, not proof that the test is implemented or passing.

# 4. Acceptance matrix — Personal v1.0 P0 requirements
> **Acceptance gap:** Per-requirement acceptance cases are not included in this repository edition. Restore preconditions, steps, expected results, and evidence requirements before using this document as a release checklist.
Where a threshold is needed (latency, recall), it is recorded only after the baseline run and ratified by the product owner; no threshold in this package is a measured result.

# 5. Requirements Traceability Matrix
> **Traceability gap:** The generated requirement ↔ test ↔ work-package matrix is not included in this repository edition. Coverage cannot be verified until the source records and generation process are restored.
