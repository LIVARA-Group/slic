import os from 'node:os';

export interface EnvironmentManifest {
  platform: string;
  architecture: string;
  cpu: string;
  cpuCount: number;
  totalMemoryBytes: number;
  nodeVersion: string;
  pnpmVersion: string | null;
  commitSha: string | null;
  timestamp: string;
}

function getPnpmVersion(): string | null {
  const userAgent = process.env.npm_config_user_agent;

  if (!userAgent) {
    return null;
  }

  return userAgent.match(/pnpm\/([^\s]+)/)?.[1] ?? null;
}

export function collectEnvironmentManifest(): EnvironmentManifest {
  return {
    platform: os.platform(),
    architecture: os.arch(),
    cpu: os.cpus()[0]?.model ?? 'unknown',
    cpuCount: os.cpus().length,
    totalMemoryBytes: os.totalmem(),
    nodeVersion: process.version,
    pnpmVersion: getPnpmVersion(),
    commitSha: process.env.SLIC_COMMIT_SHA ?? process.env.GITHUB_SHA ?? null,
    timestamp: new Date().toISOString(),
  };
}
