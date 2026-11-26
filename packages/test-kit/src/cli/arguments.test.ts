import { describe, expect, it } from 'vitest';
import { parseCliArguments } from './arguments.js';

describe('parseCliArguments', () => {
  it('returns help without arguments', () => {
    expect(parseCliArguments([])).toEqual({ command: 'help' });
  });

  it('returns help when requested', () => {
    expect(parseCliArguments(['--help'])).toEqual({ command: 'help' });
  });

  it('parses common benchmark arguments', () => {
    expect(
      parseCliArguments([
        'bench',
        'poc01',
        '--seed',
        '20261115',
        '--dataset',
        'M',
        '--engine',
        'idb',
        '--out',
        'results/',
      ]),
    ).toEqual({
      command: 'bench',
      pocId: 'poc01',
      options: {
        seed: '20261115',
        dataset: 'M',
        engine: 'idb',
        out: 'results/',
      },
    });
  });

  it('parses POC-specific arguments', () => {
    expect(
      parseCliArguments([
        'bench',
        'poc02',
        '--files',
        'DS-A',
        '--vfs',
        'sqlite-opfs',
        '--kill-points',
        'all',
      ]),
    ).toEqual({
      command: 'bench',
      pocId: 'poc02',
      options: {
        files: 'DS-A',
        vfs: 'sqlite-opfs',
        'kill-points': 'all',
      },
    });
  });

  it('normalizes POC identifiers', () => {
    const result = parseCliArguments(['bench', 'POC01']);

    expect(result.command).toBe('bench');

    if (result.command !== 'bench') {
      throw new Error('Expected bench command');
    }

    expect(result.pocId).toBe('poc01');
  });

  it('rejects unknown commands', () => {
    expect(() => parseCliArguments(['generate'])).toThrow('Unknown command');
  });

  it('rejects invalid POC identifiers', () => {
    expect(() => parseCliArguments(['bench', 'poc1'])).toThrow('Expected a POC identifier');
  });

  it('rejects options without values', () => {
    expect(() => parseCliArguments(['bench', 'poc01', '--seed'])).toThrow('requires a value');
  });

  it('rejects duplicate options', () => {
    expect(() => parseCliArguments(['bench', 'poc01', '--seed', '1', '--seed', '2'])).toThrow(
      'Duplicate option',
    );
  });

  it('rejects invalid seeds', () => {
    expect(() => parseCliArguments(['bench', 'poc01', '--seed', '-1'])).toThrow(
      '--seed must be a non-negative safe integer',
    );
  });

  it('rejects invalid dataset sizes', () => {
    expect(() => parseCliArguments(['bench', 'poc01', '--dataset', 'XL'])).toThrow(
      '--dataset must be one of: S, M, L',
    );
  });

  it('allows future POC-specific options', () => {
    const result = parseCliArguments(['bench', 'poc03', '--custom-option', 'value']);

    expect(result.command).toBe('bench');

    if (result.command !== 'bench') {
      throw new Error('Expected bench command');
    }

    expect(result.options).toEqual({ 'custom-option': 'value' });
  });
});
