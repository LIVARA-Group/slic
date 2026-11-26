# SLIC Test Kit

Internal engineering package for deterministic synthetic dataset generation, benchmark execution, environment capture, integrity validation, and technical validation workflows in SLIC.

> **Status:** Work in progress. The package provides a layered architecture, reusable application workflows, benchmark infrastructure, dataset generation, and a preliminary CLI. Full CLI-to-Application execution, POC-specific adapters, and complete WP-010 self-validation remain outstanding.

## 1. Responsibilities

The Test Kit provides reusable infrastructure for SLIC technical validation:

- Deterministic synthetic dataset generation.
- Seeded pseudo-random number generation.
- Shared dataset metadata and manifest contracts.
- Record counts, distribution metadata, and SHA-256 checksums.
- Execution environment manifest collection.
- Benchmark execution and statistical analysis.
- Runtime memory measurements.
- Benchmark and POC result construction.
- ACK-ledger integrity checking, persistence, and recovery workflows.
- Application-level orchestration.
- Raw POC result serialization.
- JSON report generation.
- CLI argument parsing and validation.

The Test Kit provides reusable validation infrastructure. Individual POC scenarios and candidate implementations consume its APIs and remain outside this package.

## 2. Architecture

The package follows a layered modular architecture.

```text
src/
├── cli/                 # Command-line interface and argument parsing
├── application/         # Application-level workflows
│   ├── benchmark/       # Benchmark orchestration
│   ├── dataset/         # Dataset preparation
│   ├── ledger/          # ACK-ledger workflows
│   └── poc/             # POC benchmark orchestration
├── core/                # Domain contracts and pure logic
│   ├── benchmark/
│   ├── dataset/
│   ├── environment/
│   ├── ledger/
│   ├── random/
│   └── results/
├── generators/          # Synthetic dataset generators
│   └── personal/        # DS-P generator
├── infrastructure/      # Runtime and persistence implementations
│   ├── benchmark/
│   ├── environment/
│   ├── filesystem/
│   └── reporting/
└── benchmark/           # End-to-end infrastructure validation
```

### 2.1. Dependency principles

- Core must not depend on Infrastructure, CLI, Application, or concrete Generators.
- Application orchestrates Core, Generators, and Infrastructure.
- Infrastructure implements runtime and persistence concerns around Core contracts.
- CLI delegates application work rather than implementing benchmark logic.
- Generators use Core contracts and deterministic random utilities.
- POC scenarios consume Test Kit APIs from outside this package.

### 2.2. Application workflows

The Application layer currently provides:

| Workflow                              | Responsibility                                                                           |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `prepareDataset`                      | Prepares a dataset through its generator                                                 |
| `runBenchmarkWorkflow`                | Collects environment data, prepares a dataset, executes a benchmark, and writes a report |
| `runPocWorkflow`                      | Executes configured benchmark runs and produces raw and aggregated POC results           |
| `restoreAckLedgerWorkflow`            | Restores persisted ACK-ledger state                                                      |
| `acknowledgeTransactionWorkflow`      | Restores the ledger and durably acknowledges a transaction                               |
| `verifyRecoveredTransactionsWorkflow` | Checks recovered transactions against the restored ACK ledger                            |

Application workflows use dependency injection to keep orchestration separate from concrete infrastructure implementations.

These workflows provide reusable execution primitives. They do not yet constitute complete POC-specific execution or a fully connected CLI-to-Application flow.

## 3. Dataset generation

### 3.1. Dataset families

The shared dataset contract recognizes the following families:

| Family        | Identifier |
| ------------- | ---------- |
| Personal      | `DS-P`     |
| Graph         | `DS-G`     |
| Text          | `DS-T`     |
| Attachments   | `DS-A`     |
| Cryptographic | `DS-C`     |
| Investigative | `DS-I`     |

The currently implemented generator produces synthetic Personal datasets (`DS-P`). Other family identifiers are part of the shared contract; their generators are not yet implemented.

### 3.2. Dataset manifests

Generated datasets include a manifest containing:

- Dataset identifier.
- Dataset family.
- Random seed.
- Generator version.
- SHA-256 dataset checksum.
- Record counts.
- Distribution metadata.

Generation is deterministic for a fixed seed and generator configuration.

The manifest provides metadata for identifying and reproducing generated datasets.

## 4. Environment manifests

The environment collector captures available execution metadata:

- Operating system name, version, and architecture.
- CPU model and logical core count.
- Total system memory.
- Runtime name, version, and flags.
- Package manager information when available.
- Git commit information when available.
- Capture timestamp and manifest identifier.

Unavailable measurements are represented as `null`; unknown values must not be fabricated.

The current Node.js collector does not yet provide complete browser/device matrix coverage. Browser metadata, storage type, free space, and power mode are currently unavailable through this collector.

## 5. Benchmark execution

The benchmark runner supports:

- Configurable warm-up iterations.
- Configurable measured iterations.
- Configurable concurrency.
- Per-batch execution timing.
- Duration statistics and percentiles.
- Throughput calculation.
- Runtime memory snapshots before and after execution.

Benchmark results include:

- Benchmark name and configuration.
- Start and completion timestamps.
- Individual timing samples.
- Total duration.
- Operations per second.
- Memory measurement metadata.
- Memory before, after, and delta values.

### 5.1. Memory measurements

Current memory measurements use Node.js `process.memoryUsage()`.

They represent the Node.js process memory state and must not be interpreted as complete system-wide or browser/device memory measurements.

### 5.2. Cache state

The benchmark contract supports cache-state metadata:

- `warm`
- `cold`
- `not-applicable`

Cache state is currently descriptive metadata. Selecting `cold` does not automatically clear operating-system, browser, or application caches.

Automated cache-state control remains outstanding.

## 6. Results and reporting

### 6.1. Benchmark reports

The benchmark report contract includes:

- Schema version.
- Report identifier and creation timestamp.
- Environment manifest.
- Dataset manifest.
- Benchmark results.
- POC results.

Reports can be serialized as JSON through the filesystem reporting implementation.

### 6.2. POC results

The POC result contract includes:

- POC identifier.
- Scenario identifier.
- Candidate implementation.
- Dataset identifier and seed.
- Environment manifest identifier.
- Number of benchmark runs.
- Aggregated p50, p95, and p99 latency.
- Per-run memory measurements.
- Failure records.
- Raw result location.
- Operation mix metadata.

Operation mix ratios must be greater than zero, no greater than one, and sum to `1`.

### 6.3. Raw POC results

The raw POC results writer persists structured JSON containing:

- Schema version.
- POC identifier.
- Scenario.
- Candidate.
- Dataset metadata.
- Environment manifest.
- Seed.
- Operation mix.
- Individual benchmark runs.

The writer creates the destination directory when necessary and prevents accidental overwriting of an existing raw result file.

Raw result persistence is implemented as infrastructure; POC-specific scenario execution and evidence publication remain outstanding.

## 7. ACK ledger

The ACK-ledger implementation provides integrity validation and filesystem persistence.

### Core capabilities

- Ledger construction.
- Transaction checksums.
- Transaction acknowledgement.
- Duplicate transaction detection.
- Recovered transaction validation.
- Missing, incomplete, and checksum-mismatch detection.

### Filesystem capabilities

- JSONL-based ledger persistence.
- Durable append operations.
- Filesystem synchronization.
- Ledger restoration.
- Incomplete trailing record handling.
- Persisted state validation.

### Application workflows

Application workflows expose operations for restoring the ledger, acknowledging transactions, and verifying recovered transactions.

The current Test Kit validation exercises these workflows with an independent persisted transaction state. This is infrastructure self-validation, not a substitute for POC-specific crash-consistency testing against real candidate storage engines.

## 8. CLI

The package exposes a preliminary `test-kit` executable.

Build the package:

```bash
pnpm --filter @repo/test-kit build
```

Display help:

```bash
node packages/test-kit/dist/cli/index.js --help
```

### 8.1. Benchmark invocation format

```bash
test-kit bench <poc-id> [options]
```

Common options:

| Option                | Description                       |
| --------------------- | --------------------------------- |
| `--seed <number>`     | Non-negative integer dataset seed |
| `--dataset <S\|M\|L>` | Dataset size                      |
| `--engine <name>`     | Candidate implementation          |
| `--out <path>`        | Results output directory          |

POC-specific options currently accepted by the parser include:

| Option                | Description                         |
| --------------------- | ----------------------------------- |
| `--files <family>`    | File dataset family                 |
| `--vfs <name>`        | Virtual filesystem implementation   |
| `--kill-points <set>` | Process termination point selection |

Additional named options are accepted to support future POC-specific arguments.

### 8.2. Execution status

The current CLI parses and validates benchmark arguments but does not yet execute POC scenarios through the Application layer.

A valid benchmark invocation currently exits with code `2` and reports that benchmark execution is not implemented.

| Exit code | Meaning                                               |
| --------- | ----------------------------------------------------- |
| `0`       | Help displayed successfully                           |
| `1`       | Invalid command or arguments                          |
| `2`       | Valid benchmark invocation; execution not implemented |

## 9. Development

Run package checks independently:

```bash
pnpm --filter @repo/test-kit typecheck
pnpm --filter @repo/test-kit test
pnpm --filter @repo/test-kit lint
pnpm --filter @repo/test-kit build
```

Run repository checks:

```bash
pnpm check
```

Inspect the package archive without publishing:

```bash
cd packages/test-kit
npm pack --dry-run
```

## 10. Validation strategy

The current package test suite covers:

- Seeded random generation.
- Dataset contracts and DS-P generation.
- Dataset determinism and metadata.
- Benchmark statistics and execution.
- Benchmark and POC result construction.
- Report generation and serialization.
- Environment manifest collection.
- ACK-ledger integrity and persistence.
- ACK-ledger application workflows.
- Dataset preparation workflow.
- Benchmark application workflow.
- POC orchestration workflow.
- Raw POC result serialization.
- CLI argument parsing.
- Test Kit infrastructure self-validation.

Passing package tests verifies implemented package behavior. It does not establish that the full SLIC technical validation program or SG1 is complete.

## 11. Scope and remaining work

The following capabilities remain outstanding for WP-010:

- Full CLI-to-Application execution flow.
- POC-specific benchmark adapters and execution.
- Generators for dataset families other than the currently implemented `DS-P`.
- Complete environment collection across the required browser/device matrix.
- Automated cache-state control.
- Full WP-010 self-validation and evidence publication.

Additional POC validation depends on the relevant upstream requirements and work packages. In particular, POC-08 and POC-09 depend on the WP-008 threat-model baseline.

The Test Kit must not be considered complete until WP-010 requirements and validation criteria are satisfied.

## 12. Engineering principle

The Test Kit is a validation instrument, not evidence of correctness by itself.

Its responsibilities are to make technical experiments reproducible, measurable, traceable, and independently verifiable. Conclusions about candidate implementations must be based on collected evidence, documented methodology, and reproducible results.
