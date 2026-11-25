export type CliArguments =
  | { command: 'help' }
  | {
    command: 'bench';
    pocId: string;
    options: Record<string, string>;
  };

const DATASET_SIZES = ['S', 'M', 'L'];

export function parseCliArguments(args: readonly string[]): CliArguments {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    return { command: 'help' };
  }

  const [command, pocId, ...rest] = args;

  if (command !== 'bench') {
    throw new Error(`Unknown command: ${command}`);
  }

  if (!pocId || !/^poc\d{2}$/i.test(pocId)) {
    throw new Error('Expected a POC identifier, e.g. poc01');
  }

  const options: Record<string, string> = {};

  for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];

    if (!argument?.startsWith('--')) {
      throw new Error(`Unexpected argument: ${argument}`);
    }

    const name = argument.slice(2);

    if (!name) {
      throw new Error('Option name cannot be empty');
    }

    if (Object.hasOwn(options, name)) {
      throw new Error(`Duplicate option: --${name}`);
    }

    const value = rest[index + 1];

    if (!value || value.startsWith('--')) {
      throw new Error(`Option --${name} requires a value`);
    }

    options[name] = value;
    index += 1;
  }

  if (options.seed !== undefined) {
    const seed = Number(options.seed);

    if (!Number.isSafeInteger(seed) || seed < 0) {
      throw new Error('--seed must be a non-negative safe integer');
    }
  }

  if (
    options.dataset !== undefined &&
    !DATASET_SIZES.includes(options.dataset)
  ) {
    throw new Error('--dataset must be one of: S, M, L');
  }

  for (const name of ['engine', 'out', 'files', 'vfs', 'kill-points']) {
    if (options[name] !== undefined && !options[name]?.trim()) {
      throw new Error(`--${name} cannot be empty`);
    }
  }

  return {
    command: 'bench',
    pocId: pocId.toLowerCase(),
    options,
  };
}
