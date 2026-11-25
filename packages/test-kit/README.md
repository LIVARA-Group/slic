# SLIC Test Kit

Internal tooling for deterministic dataset generation, benchmark execution, environment capture, result reporting, and technical validation workflows in SLIC.

> **Status:** Work in progress. The package provides benchmark infrastructure and a preliminary CLI. Full application orchestration and POC execution are not implemented yet.

## Responsibilities

The Test Kit provides reusable infrastructure for technical validation:

- Deterministic synthetic dataset generation.
- Seeded pseudo-random number generation.
- Dataset metadata, record counts, distributions, and checksums.
- Execution environment manifest collection.
- Benchmark execution and statistical analysis.
- Runtime memory measurements.
- POC result and benchmark report construction.
- ACK-ledger integrity checking and persistence.
- JSON report serialization.
- CLI argument parsing and validation.

The package is infrastructure for validation scenarios. Individual POC implementations consume its APIs and do not belong inside the Test Kit.

## Architecture

The package follows a layered modular architecture.

```text
src/
├── cli/                 # Command-line interface
├── application/         # Application orchestration (planned)
├── core/                # Domain contracts and pure logic
│   ├── benchmark/
│   ├── dataset/
│   ├── environment/
│   ├── ledger/
│   ├── random/
│   └── results/
├── generators/          # Synthetic dataset generators
│   └── personal/
└── infrastructure/      # Runtime and filesystem implementations
    ├── benchmark/
    ├── environment/
    ├── filesystem/
    └── reporting/
```

### Dependency principles

- Core must not depend on Infrastructure, CLI, or Application.
- Application orchestrates Core, Generators, and Infrastructure.
- Infrastructure implements runtime and persistence concerns around Core contracts.
- CLI delegates application work rather than implementing benchmark logic.
- Generators use Core contracts and deterministic random utilities.
- POC scenarios consume Test Kit APIs from outside this package.

The Application layer is planned and is not yet implemented.

## Current capabilities

### Dataset generation

The package defines shared dataset contracts:

- Dataset families: `DS-P`, `DS-G`, `DS-T`, `DS-A`, `DS-C`, `DS-I`.
- Dataset metadata and generator version.
- Seed tracking.
- Record counts and distribution metadata.
- SHA-256 dataset checksums.

The currently implemented generator produces synthetic Personal datasets (`DS-P`).

Generation is deterministic for a fixed seed and generator configuration.

### Environment manifests

The environment collector captures available execution metadata, including:

- Operating system and architecture.
- CPU model and logical core count.
- Total system memory.
- Runtime name, version, and flags.
- Package manager information when available.
- Git commit information when available.

Unavailable measurements are represented as `null`; unknown values must not be fabricated.

Browser-specific metadata, storage type, free space, and power mode are not currently collected by the Node.js collector.

### Benchmark execution

The benchmark runner supports:

- Warm-up iterations.
- Configurable iteration count.
- Configurable concurrency.
- Per-batch execution timing.
- Duration statistics and percentiles.
- Throughput calculation.
- Runtime memory snapshots before and after execution.

Memory measurements currently use Node.js `process.memoryUsage()`.

The cache state (`warm`, `cold`, or `not-applicable`) is metadata. Selecting `cold` does not itself clear operating-system, browser, or application caches.

### Results and reporting

The package defines structured benchmark and POC result contracts.

POC results include:

- POC identifier and scenario.
- Candidate implementation.
- Dataset identifier and seed.
- Environment manifest identifier.
- Benchmark runs.
- Aggregated p50, p95, and p99 latency.
- Per-run memory measurements.
- Failure records.
- Raw result location.
- Operation mix metadata.

Operation mix ratios must be valid, non-negative fractions greater than zero and sum to `1`.

Benchmark reports can be serialized as JSON through the filesystem reporting implementation.

### ACK ledger

The ACK-ledger core provides:

- Ledger construction.
- Transaction checksums.
- Transaction acknowledgement.
- Ledger integrity checking.

The filesystem implementation supports appending entries and restoring ledger state.

## CLI

The package exposes a preliminary `test-kit` executable.

Build the package:

```bash
pnpm --filter @repo/test-kit build
```

Display help:

```bash
node packages/test-kit/dist/cli/index.js --help
```

### Benchmark invocation format

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

### Examples

POC-01:

```bash
test-kit bench poc01 \
  --seed 20261115 \
  --dataset M \
  --engine idb \
  --out results/
```

POC-02:

```bash
test-kit bench poc02 \
  --files DS-A \
  --vfs sqlite-opfs \
  --kill-points all
```

**Execution status:** The current CLI validates arguments but does not execute benchmark scenarios. A valid benchmark invocation exits with code `2` and reports that Application orchestration is pending.

Exit codes:

| Code | Meaning                                               |
| ---- | ----------------------------------------------------- |
| `0`  | Help displayed successfully                           |
| `1`  | Invalid command or arguments                          |
| `2`  | Valid benchmark invocation; execution not implemented |

## Development

Run package checks independently:

```bash
pnpm --filter @repo/test-kit typecheck
pnpm --filter @repo/test-kit test
pnpm --filter @repo/test-kit lint
pnpm --filter @repo/test-kit build
```

Run all repository checks:

```bash
pnpm check
```

## Current validation status

The current package test suite covers:

- Seeded random generation.
- Dataset contracts and Personal dataset generation.
- Benchmark statistics and execution.
- Benchmark and POC result construction.
- Report generation and serialization.
- ACK-ledger integrity and filesystem persistence.
- CLI argument parsing.

## Scope and limitations

The following capabilities are not yet implemented:

- Application orchestration.
- Full CLI-to-Application execution flow.
- POC-specific benchmark adapters and execution.
- Generators for dataset families other than the currently implemented `DS-P`.
- Complete environment collection across the required browser/device matrix.
- Automated cache-state control.
- Full WP-010 self-validation and evidence publication.

The Test Kit must not be considered complete until the WP-010 requirements and validation criteria are satisfied.

Passing package tests verifies the implemented package behavior; it does not establish that the SLIC technical validation program or SG1 is complete.
