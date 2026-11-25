import {
  type BrainPart,
  brainStructures,
  connections,
  getAncestors,
  getBrainPart,
  pathways,
  type RegionId,
} from '@repo/brain';
import { clusterByRegion, englishLabels } from './layout.generated.js';

export type EdgeEffect = 'excitatory' | 'inhibitory' | 'modulatory';

export interface GraphNode {
  readonly id: RegionId;
  readonly label: string;
  readonly ru: string;
  readonly cluster: string;
  readonly part: BrainPart | 'outside';
  readonly kind: string;
  readonly desc: string;
  readonly brodmann: readonly number[];
  readonly x: number;
  readonly y: number;
  readonly color: string;
}

export interface GraphEdge {
  readonly id: string;
  readonly from: RegionId;
  readonly to: RegionId;
  readonly effect: EdgeEffect;
  readonly nt: string;
  readonly kind: string;
}

export interface GraphPathway {
  readonly id: string;
  readonly ru: string;
  readonly steps: readonly RegionId[];
  readonly description: string;
}

export interface Graph {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
  readonly pathways: readonly GraphPathway[];
  readonly width: number;
  readonly height: number;
}

export const clusterColors: Readonly<Record<string, string>> = {
  frontal: '#e5484d',
  parietal: '#3e63dd',
  temporal: '#30a46c',
  occipital: '#12a594',
  insular: '#ab4aba',
  limbic: '#f76b15',
  basalGanglia: '#ffc53d',
  diencephalon: '#a18072',
  midbrain: '#8e4ec6',
  pons: '#6e56cf',
  medulla: '#5b5bd6',
  cerebellum: '#946c28',
  spinal: '#889096',
  periphery: '#0090ff',
  other: '#8b949e',
};

/** Cluster centres on a 2000×1400 canvas; roughly follows anatomy, frontal at the left. */
const centers: Readonly<Record<string, readonly [number, number]>> = {
  frontal: [420, 240],
  parietal: [900, 170],
  occipital: [1400, 260],
  temporal: [800, 500],
  insular: [1180, 520],
  limbic: [1060, 740],
  basalGanglia: [620, 680],
  diencephalon: [830, 930],
  midbrain: [1180, 1020],
  pons: [850, 1150],
  medulla: [1060, 1270],
  cerebellum: [1480, 960],
  spinal: [1400, 1280],
  other: [1700, 600],
};

const FRONTAL_ANCHORS = new Set(['left-frontal-lobe', 'right-frontal-lobe']);
const ANCESTOR_CLUSTERS: ReadonlyArray<readonly [string, string]> = [
  ['left-frontal-lobe', 'frontal'],
  ['right-frontal-lobe', 'frontal'],
  ['left-parietal-lobe', 'parietal'],
  ['right-parietal-lobe', 'parietal'],
  ['left-temporal-lobe', 'temporal'],
  ['right-temporal-lobe', 'temporal'],
  ['left-occipital-lobe', 'occipital'],
  ['right-occipital-lobe', 'occipital'],
  ['basal-ganglia', 'basalGanglia'],
  ['diencephalon', 'diencephalon'],
  ['midbrain', 'midbrain'],
  ['pons', 'pons'],
  ['medulla-oblongata', 'medulla'],
  ['cerebellum', 'cerebellum'],
  ['spinal-cord', 'spinal'],
  ['hippocampal-formation', 'limbic'],
];

/** Cluster from generated layout metadata, falling back to the nearest clustered ancestor. */
export function clusterOf(id: RegionId): string {
  const direct = clusterByRegion[id];

  if (direct) {
    return direct;
  }

  const chain: string[] = [id, ...getAncestors(id).map((s) => s.id)];

  for (const entry of chain) {
    const hit = ANCESTOR_CLUSTERS.find(([anchor]) => anchor === entry);

    if (hit) {
      return hit[1];
    }
  }

  return 'other';
}

export function toGraph(): Graph {
  const used = new Set<string>();

  for (const c of connections) {
    used.add(c.from);
    used.add(c.to);
  }

  const structures = brainStructures.filter((s) => used.has(s.id));
  const byCluster = new Map<string, RegionId[]>();

  for (const s of structures) {
    const key = clusterOf(s.id);
    byCluster.set(key, [...(byCluster.get(key) ?? []), s.id]);
  }

  const position = new Map<string, [number, number]>();

  for (const [cluster, ids] of byCluster) {
    if (cluster === 'periphery') {
      const inputs = ids.filter((id) => getParentId(id) === 'sensory-boundaries');
      const outputs = ids.filter((id) => getParentId(id) !== 'sensory-boundaries');

      inputs.forEach((id, i) =>
        position.set(id, [70, 150 + (i * 1100) / Math.max(1, inputs.length - 1)]),
      );
      outputs.forEach((id, i) =>
        position.set(id, [1930, 250 + (i * 800) / Math.max(1, outputs.length - 1)]),
      );
      continue;
    }

    const [cx, cy] = centers[cluster] ?? centers['other']!;
    const radius = 38 + 24 * Math.sqrt(ids.length);

    ids.forEach((id, i) => {
      const r = radius * Math.sqrt((i + 0.5) / ids.length);
      const angle = i * 2.399963;

      position.set(id, [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    });
  }

  const nodes: GraphNode[] = structures.map((s) => {
    const [x, y] = position.get(s.id) ?? [1000, 700];
    const cluster = clusterOf(s.id);
    const part = getBrainPart(s.id);
    const aliases = 'aliases' in s ? s.aliases : undefined;

    return {
      id: s.id,
      label: s.name,
      ru: englishLabels[s.id] ?? aliases?.[0] ?? s.name,
      cluster,
      part: part ?? 'outside',
      kind: s.kind,
      desc: s.description.slice(0, 220),
      brodmann: [],
      x,
      y,
      color: clusterColors[cluster] ?? clusterColors['other']!,
    };
  });

  const edges: GraphEdge[] = connections.map((c) => ({
    id: c.id,
    from: c.from,
    to: c.to,
    effect:
      'effect' in c && c.effect ? c.effect : c.kind === 'modulatory' ? 'modulatory' : 'excitatory',
    nt: 'neurotransmitter' in c && c.neurotransmitter ? c.neurotransmitter : '',
    kind: c.kind,
  }));

  const graphPathways: GraphPathway[] = pathways.map((p) => ({
    id: p.id,
    ru: p.name,
    steps: [...p.regions],
    description: p.description,
  }));

  return { nodes, edges, pathways: graphPathways, width: 2000, height: 1400 };
}

function getParentId(id: RegionId): string | null {
  return brainStructures.find((s) => s.id === id)?.parentId ?? null;
}

export function isFrontalAnchor(id: string): boolean {
  return FRONTAL_ANCHORS.has(id);
}

export function toMermaid(graph: Graph = toGraph()): string {
  const lines = ['flowchart LR'];
  const byCluster = new Map<string, GraphNode[]>();

  for (const n of graph.nodes) {
    byCluster.set(n.cluster, [...(byCluster.get(n.cluster) ?? []), n]);
  }

  const safe = (id: string): string => id.replace(/-/g, '_');

  for (const [cluster, nodes] of byCluster) {
    lines.push(`  subgraph ${cluster}["${cluster}"]`);
    nodes.forEach((n) => lines.push(`    ${safe(n.id)}["${n.ru}"]`));
    lines.push('  end');
  }

  for (const e of graph.edges) {
    const arrow = e.effect === 'inhibitory' ? '-.->' : e.effect === 'modulatory' ? '==>' : '-->';

    lines.push(`  ${safe(e.from)} ${arrow}${e.nt ? `|${e.nt}|` : ''} ${safe(e.to)}`);
  }

  return lines.join('\n');
}

export function toDot(graph: Graph = toGraph()): string {
  const out = [
    'digraph Brain {',
    '  rankdir=LR; node [shape=box, style=filled, fontname="Helvetica"];',
  ];
  const safe = (id: string): string => `"${id}"`;

  for (const n of graph.nodes) {
    out.push(`  ${safe(n.id)} [label="${n.ru}", fillcolor="${n.color}55"];`);
  }

  for (const e of graph.edges) {
    const color =
      e.effect === 'excitatory' ? '#30a46c' : e.effect === 'inhibitory' ? '#e5484d' : '#3e63dd';

    out.push(
      `  ${safe(e.from)} -> ${safe(e.to)} [color="${color}", label="${e.nt}", arrowhead=${e.effect === 'inhibitory' ? 'tee' : 'normal'}];`,
    );
  }

  out.push('}');

  return out.join('\n');
}
