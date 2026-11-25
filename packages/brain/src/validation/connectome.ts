import type { RegionId } from '../anatomy/regions.js';
import { brainStructures } from '../anatomy/regions.js';
import { connections } from '../connectome/connections.js';
import { pathways } from '../connectome/pathways.js';
import type { ConnectionDefinition } from '../connectome/types.js';
import { createValidationResult, type ValidationIssue, type ValidationResult } from './anatomy.js';

function matchesPathwaySegment(
  connection: ConnectionDefinition,
  from: RegionId,
  to: RegionId,
): boolean {
  if (connection.from === from && connection.to === to) {
    return true;
  }

  return (
    connection.direction === 'bidirectional' && connection.from === to && connection.to === from
  );
}

export function validateConnectome(): ValidationResult {
  const issues: ValidationIssue[] = [];

  const regionIds = new Set(brainStructures.map((structure) => structure.id));

  const connectionIds = new Set<string>();

  for (const connection of connections) {
    if (connectionIds.has(connection.id)) {
      issues.push({
        code: 'DUPLICATE_CONNECTION_ID',
        severity: 'error',
        entityId: connection.id,
        message: `Duplicate connection ID "${connection.id}".`,
      });
    }

    connectionIds.add(connection.id);

    if (!regionIds.has(connection.from)) {
      issues.push({
        code: 'MISSING_CONNECTION_SOURCE',
        severity: 'error',
        entityId: connection.id,
        message: `Connection "${connection.id}" references unknown source "${connection.from}".`,
      });
    }

    if (!regionIds.has(connection.to)) {
      issues.push({
        code: 'MISSING_CONNECTION_TARGET',
        severity: 'error',
        entityId: connection.id,
        message: `Connection "${connection.id}" references unknown target "${connection.to}".`,
      });
    }

    if (connection.from === connection.to) {
      issues.push({
        code: 'SELF_CONNECTION',
        severity: 'error',
        entityId: connection.id,
        message: `Connection "${connection.id}" cannot connect a structure to itself.`,
      });
    }
  }

  const pathwayIds = new Set<string>();

  for (const pathway of pathways) {
    if (pathwayIds.has(pathway.id)) {
      issues.push({
        code: 'DUPLICATE_PATHWAY_ID',
        severity: 'error',
        entityId: pathway.id,
        message: `Duplicate pathway ID "${pathway.id}".`,
      });
    }

    pathwayIds.add(pathway.id);

    for (const regionId of pathway.regions) {
      if (!regionIds.has(regionId)) {
        issues.push({
          code: 'MISSING_PATHWAY_REGION',
          severity: 'error',
          entityId: pathway.id,
          message: `Pathway "${pathway.id}" references unknown region "${regionId}".`,
        });
      }
    }

    for (const connectionId of pathway.connectionIds) {
      if (!connectionIds.has(connectionId)) {
        issues.push({
          code: 'MISSING_PATHWAY_CONNECTION',
          severity: 'error',
          entityId: pathway.id,
          message: `Pathway "${pathway.id}" references unknown connection "${connectionId}".`,
        });
      }
    }

    if (pathway.regions.length < 2) {
      issues.push({
        code: 'PATHWAY_TOO_SHORT',
        severity: 'warning',
        entityId: pathway.id,
        message: `Pathway "${pathway.id}" contains fewer than two regions.`,
      });
    }

    if (pathway.connectionIds.length !== pathway.regions.length - 1) {
      issues.push({
        code: 'PATHWAY_SEQUENCE_LENGTH_MISMATCH',
        severity: 'error',
        entityId: pathway.id,
        message: `Pathway "${pathway.id}" must have one connection for every adjacent pair of regions.`,
      });

      continue;
    }

    for (let index = 0; index < pathway.connectionIds.length; index++) {
      const connectionId = pathway.connectionIds[index];
      const from = pathway.regions[index];
      const to = pathway.regions[index + 1];

      const connection = connections.find((candidate) => candidate.id === connectionId);

      if (!connection || !from || !to) {
        continue;
      }

      if (!matchesPathwaySegment(connection, from, to)) {
        issues.push({
          code: 'PATHWAY_CONNECTION_MISMATCH',
          severity: 'error',
          entityId: pathway.id,
          message: `Connection "${connectionId}" does not match pathway segment "${from}" → "${to}".`,
        });
      }
    }
  }

  return createValidationResult(issues);
}
