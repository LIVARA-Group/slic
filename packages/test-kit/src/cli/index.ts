#!/usr/bin/env node

import { parseCliArguments } from './arguments.js';

const HELP = `
SLIC Test Kit

Usage:
  test-kit bench <poc-id> [options]

Commands:
  bench <poc-id>    Prepare a POC benchmark invocation
  --help, -h        Show this help

Common options:
  --seed <number>       Dataset seed
  --dataset <S|M|L>     Dataset size
  --engine <name>       Candidate implementation
  --out <path>          Results output directory

POC-specific options:
  --files <family>      File dataset family
  --vfs <name>          Virtual filesystem implementation
  --kill-points <set>   Process termination points
`;

function main(): void {
  try {
    const parsed = parseCliArguments(process.argv.slice(2));

    if (parsed.command === 'help') {
      process.stdout.write(`${HELP.trim()}\n`);
      return;
    }

    process.stdout.write(`POC: ${parsed.pocId}\n`);
    process.stdout.write('Arguments validated successfully.\n');
    process.stderr.write(
      'Benchmark execution is not implemented yet. Application orchestration is pending.\n',
    );

    process.exitCode = 2;
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.stderr.write('Use --help to see available options.\n');
    process.exitCode = 1;
  }
}

main();
