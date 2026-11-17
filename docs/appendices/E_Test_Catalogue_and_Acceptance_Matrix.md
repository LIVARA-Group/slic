# 1. Purpose
Central list of tests (109), their link to requirements (74), release gates, and the acceptance matrix for every P0 requirement of Personal v1.0. The same data generates the traceability matrix in §5, so coverage is checked mechanically: every requirement has at least one test and every test traces to a requirement (verified in the QA Report).

# 2. Gate codes
GP = Personal v1.0 release · GS = encrypted sync release · GA = AI release · GI = Investigative foundation · GX = later scope.
Automation: **Auto** = runs in CI; **Manual** = scripted human test; **Review** = independent review with recorded outcome; **Drill** = operational exercise.

**Quantities inside scenarios** (e.g. 1000 crash-injection transactions, 50 draft-crash runs, 10^6 simulated encryptions, 100k-object fixtures) are **proposed protocol parameters** chosen to be demanding but runnable; they are not measured results, and they may be changed by the owner at SG0/SG1 with a recorded rationale.

# 3. Test catalogue
@@TESTS@@

# 4. Acceptance matrix — Personal v1.0 P0 requirements
@@ACC@@
Where a threshold is needed (latency, recall), it is recorded only after the baseline run and ratified by the product owner; no threshold in this package is a measured result.

# 5. Requirements Traceability Matrix
@@RTM@@
