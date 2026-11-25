import { brainStructures } from '../anatomy/regions.js';
import { cognitiveProcesses } from '../cognition/processes.js';
import { connections } from '../connectome/connections.js';
import { pathways } from '../connectome/pathways.js';
import type { EvidenceLevel } from '../shared/types.js';
import { createValidationResult, type ValidationIssue, type ValidationResult } from './anatomy.js';

export interface ProvenanceEntityStats {
  readonly total: number;
  readonly withSources: number;
  readonly withoutSources: number;
  readonly byLevel: Readonly<Record<EvidenceLevel, number>>;
}

export interface ProvenanceSummary {
  readonly structures: ProvenanceEntityStats;
  readonly connections: ProvenanceEntityStats;
  readonly pathways: ProvenanceEntityStats;
  readonly cognitiveProcesses: ProvenanceEntityStats;
}

interface HasEvidence {
  readonly evidence: { readonly level: EvidenceLevel; readonly sources: readonly unknown[] };
}

function summarize(items: readonly HasEvidence[]): ProvenanceEntityStats {
  const byLevel: Record<EvidenceLevel, number> = {
    established: 0,
    strong: 0,
    moderate: 0,
    limited: 0,
    hypothesis: 0,
  };

  let withSources = 0;

  for (const item of items) {
    byLevel[item.evidence.level] += 1;

    if (item.evidence.sources.length > 0) {
      withSources += 1;
    }
  }

  return {
    total: items.length,
    withSources,
    withoutSources: items.length - withSources,
    byLevel,
  };
}

/** Counts of evidence levels and source coverage. Used to track Phase 1 (provenance) progress. */
export function getProvenanceSummary(): ProvenanceSummary {
  return {
    structures: summarize(brainStructures),
    connections: summarize(connections),
    pathways: summarize(pathways),
    cognitiveProcesses: summarize(cognitiveProcesses),
  };
}

/**
 * Release-gate check: every connection should carry source references.
 * Emits one warning per unsourced connection (never an error, so it can be adopted gradually).
 */
export function validateProvenance(): ValidationResult {
  const issues: ValidationIssue[] = [];

  for (const connection of connections) {
    if (connection.evidence.sources.length === 0) {
      issues.push({
        code: 'UNSOURCED_CONNECTION',
        severity: 'warning',
        entityId: connection.id,
        message: `Connection "${connection.id}" has no source references (evidence level: ${connection.evidence.level}).`,
      });
    }
  }

  return createValidationResult(issues);
}

/**
 * Coverage check: leaf structures that no connection mentions.
 * Warnings only; hemisphere-mirrored and container structures are expected to appear here until modelled.
 */
export function validateCoverage(): ValidationResult {
  const issues: ValidationIssue[] = [];

  const parents = new Set<string>();
  for (const structure of brainStructures) {
    if (structure.parentId !== null) {
      parents.add(structure.parentId);
    }
  }

  const connected = new Set<string>();
  for (const connection of connections) {
    connected.add(connection.from);
    connected.add(connection.to);
  }

  for (const structure of brainStructures) {
    if (!parents.has(structure.id) && !connected.has(structure.id)) {
      issues.push({
        code: 'UNCONNECTED_LEAF_STRUCTURE',
        severity: 'warning',
        entityId: structure.id,
        message: `Leaf structure "${structure.id}" is not referenced by any connection.`,
      });
    }
  }

  return createValidationResult(issues);
}
