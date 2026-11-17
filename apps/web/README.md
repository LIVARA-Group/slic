# Web Design System

The web app follows the SLIC Swiss-style interface specification: a restrained black-and-white base, a red action color, precise typography, square geometry, and strong alignment. The design is intentionally applied to the existing routes and content rather than introducing new product screens.

## Foundations

Global styles live in `src/globals.css`. Tailwind CSS v4 is compiled by the Vite plugin; Inter Variable and JetBrains Mono are bundled locally through Fontsource, so production does not depend on a third-party font host.

| Role                    | Token / value                             | Use                                    |
| ----------------------- | ----------------------------------------- | -------------------------------------- |
| Background / foreground | `--background` / `--foreground`           | Page canvas and primary text           |
| Primary                 | `--primary` / `--primary-foreground`      | High-contrast controls                 |
| Brand                   | `--brand` / `--brand-hover`               | Important actions, focus, and emphasis |
| Muted                   | `--muted` / `--muted-foreground`          | Secondary copy and subtle surfaces     |
| Border / input          | `--border` / `--input`                    | Dividers and form controls             |
| Status                  | `--success`, `--warning`, `--destructive` | Explicit feedback states               |

The `.dark` class switches the token set to the dark palette. Avoid hard-coded colors in route styles; use the semantic tokens so both palettes remain consistent.

## Typography and shape

- **Inter Variable** is the interface and body face.
- **JetBrains Mono Variable** is reserved for code, identifiers, and technical values.
- Use the named type scale exposed through Tailwind v4 (`text-caption`, `text-body`, `text-h1`, and related sizes).
- The radius scale is deliberately zero. Prefer square corners and thin rules over shadows, gradients, or decorative containers.
- Use the red brand role sparingly for interaction, selection, status, and emphasis; keep most surfaces neutral.

## Component conventions

This small foundation currently uses semantic React/HTML elements with project-owned CSS, not generated shadcn/ui components. Keep them native and accessible until the product needs a reusable component library. When adding components, follow the shadcn token roles and interaction states defined in `globals.css` rather than creating a parallel palette.

- Keep one clear page heading and preserve the skip link and keyboard-visible focus ring.
- Use headings, landmarks, lists, `dl` for name/value data, and buttons/links according to their behavior.
- Provide loading, success, and error feedback for asynchronous requests; do not communicate status with color alone.
- Keep layouts usable at narrow widths and honor `prefers-reduced-motion`.
- Do not add remote fonts or inline styles; the production nginx Content Security Policy allows same-origin styles and fonts only.

## Development and checks

Run from the repository root:

```sh
pnpm dev
pnpm --filter @repo/web test
pnpm --filter @repo/web build
```

The Tailwind Vite plugin processes `@import`, `@theme`, and `@apply` in `src/globals.css` in both development and production builds. The `apps/web/Dockerfile` builds the Vite output and serves it from the unprivileged nginx image.
