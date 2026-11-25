import { randomUUID } from 'node:crypto';
import os from 'node:os';

import type { EnvironmentManifest } from '../../core/environment/environment-manifest.js';

function getPnpmVersion(): string | null {
  const userAgent = process.env.npm_config_user_agent;

  if (!userAgent) {
    return null;
  }

  return userAgent.match(/pnpm\/([^\s]+)/)?.[1] ?? null;
}

export function collectEnvironmentManifest(): EnvironmentManifest {
  const cpus = os.cpus();
  const pnpmVersion = getPnpmVersion();

  return {
    schemaVersion: 1,
    id: randomUUID(),
    capturedAt: new Date().toISOString(),

    host: {
      os: {
        name: os.platform(),
        version: os.release(),
        architecture: os.arch(),
      },
      cpu: {
        model: cpus[0]?.model ?? 'unknown',
        logicalCores: cpus.length,
      },
      memory: {
        totalBytes: os.totalmem(),
      },
      storage: {
        type: null,
        freeSpaceBytes: null,
      },
    },

    runtime: {
      name: 'node',
      version: process.version,
      flags: [...process.execArgv],
    },

    browser: null,

    execution: {
      powerMode: null,
    },

    source: {
      commitSha:
        process.env.SLIC_COMMIT_SHA ??
        process.env.GITHUB_SHA ??
        null,
      packageManager: pnpmVersion
        ? {
          name: 'pnpm',
          version: pnpmVersion,
        }
        : null,
    },
  };
}
