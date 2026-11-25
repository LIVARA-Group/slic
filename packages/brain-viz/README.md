# @repo/brain-viz

Renderer-neutral graph export and a standalone interactive HTML map for `@repo/brain`.

```ts
import { toGraph, toMermaid, toDot } from '@repo/brain-viz';

const graph = toGraph(); // { nodes, edges, pathways, width, height }
```

```bash
pnpm --filter @repo/brain-viz export
```

Writes `docs/brain.html`, `brain.mmd`, `brain.dot`, `brain.json`. Open `brain.html` in a browser: hover for details, click to isolate links, choose a pathway, run stimulus scenarios (animated by `@repo/brain-sim`), wheel to zoom, drag to pan.

Layout and Russian labels are layout metadata kept out of the anatomy package (`src/layout.generated.ts`). Nodes without any connection are not drawn.
