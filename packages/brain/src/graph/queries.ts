import { type RegionId, regions } from '../anatomy/regions.js';
import { type ConnectionDefinition, connections } from '../connectome/connections.js';

export function getChildren(parentId: RegionId): RegionId[] {
  return (Object.keys(regions) as RegionId[]).filter((id) => regions[id].parentId === parentId);
}

export function getDescendants(parentId: RegionId): RegionId[] {
  const result: RegionId[] = [];
  const visit = (id: RegionId) => {
    for (const child of getChildren(id)) {
      result.push(child);
      visit(child);
    }
  };
  visit(parentId);
  return result;
}

export function getAncestors(regionId: RegionId): RegionId[] {
  const result: RegionId[] = [];
  let parentId = regions[regionId].parentId;
  while (parentId !== null) {
    result.push(parentId as RegionId);
    parentId = regions[parentId as RegionId].parentId;
  }
  return result;
}

export function getConnections(
  regionId: RegionId,
  source: readonly ConnectionDefinition[] = connections,
): ConnectionDefinition[] {
  return source.filter((edge) => edge.from === regionId || edge.to === regionId);
}

export function getOutgoingConnections(
  regionId: RegionId,
  source: readonly ConnectionDefinition[] = connections,
): ConnectionDefinition[] {
  return source.filter((edge) => edge.from === regionId);
}

export function getIncomingConnections(
  regionId: RegionId,
  source: readonly ConnectionDefinition[] = connections,
): ConnectionDefinition[] {
  return source.filter((edge) => edge.to === regionId);
}

export interface GraphValidationIssue {
  readonly code:
  | 'missing-region'
  | 'duplicate-connection-id'
  | 'self-connection'
  | 'orphan-region'
  | 'hierarchy-cycle';
  readonly message: string;
  readonly subject: string;
}

export function validateBrainGraph(): GraphValidationIssue[] {
  const issues: GraphValidationIssue[] = [];
  const seen = new Set<string>();
  for (const edge of connections) {
    if (!regions[edge.from] || !regions[edge.to])
      issues.push({
        code: 'missing-region',
        message: 'Connection references an unknown region.',
        subject: edge.id,
      });
    if (seen.has(edge.id))
      issues.push({
        code: 'duplicate-connection-id',
        message: 'Connection id is duplicated.',
        subject: edge.id,
      });
    seen.add(edge.id);
    if (edge.from === edge.to)
      issues.push({
        code: 'self-connection',
        message: 'Self-connections require explicit justification.',
        subject: edge.id,
      });
  }
  for (const id of Object.keys(regions) as RegionId[]) {
    const parent = regions[id].parentId;
    if (parent !== null && !regions[parent as RegionId])
      issues.push({
        code: 'orphan-region',
        message: 'Region references an unknown parent.',
        subject: id,
      });
    const ancestors = getAncestors(id);
    if (ancestors.includes(id))
      issues.push({
        code: 'hierarchy-cycle',
        message: 'Anatomical hierarchy contains a cycle.',
        subject: id,
      });
  }
  return issues;
}
