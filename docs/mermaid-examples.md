# "Mermaid <chart> examples" pages

Top-level pages such as `/mermaid-pie-chart-examples`: copyable Mermaid diagrams rendered live,
then answers. `/mermaid-timeline-examples` is the older hand-written page of the same kind.

| Piece | File |
|---|---|
| Content | `lib/mermaid-examples/<slug>.ts`, exporting `PAGE: MermaidExamplesPage` |
| Type | `lib/mermaid-examples/types.ts` |
| Registry + validator | `lib/mermaid-examples/index.ts` (`MERMAID_PAGES`, `validateMermaidPage`) |
| Layout | `components/MermaidExamplesView.tsx` |
| Route | `app/(en)/<slug>/page.tsx` (copy `app/(en)/mermaid-pie-chart-examples/page.tsx`, change the slug) |
| Check | `node scripts/check-mermaid-examples.mjs` or `--file lib/mermaid-examples/<slug>.ts`; part of `npm run build` |

Model: `lib/mermaid-examples/mermaid-pie-chart-examples.ts`.

## Writer contract

| Rule | Enforced |
|---|---|
| `title` ≤ 50 (60 with the "| Docs MD" suffix); `description` 80–155; `answer` ≤ 60 words with no link in its first sentence | yes |
| 3–8 examples with unique kebab-case `id`; `code` has no ``` fence | yes |
| ≥ 3 sections, ≥ 4 FAQ (answers 30–120 words), body ≥ 700 words excluding code | yes |
| Internal links resolve; 2–6 `related` paths | yes |
| Every example renders with the Mermaid version in package.json (checked in the browser before shipping) | review |
| Syntax and options come from mermaid.js.org; note the minimum Mermaid version for newer options and that GitHub and other platforms may run older versions | review |
| Scope: chart-style diagram types (pie, Gantt, mindmap, git graph, timeline) and Mermaid inside Markdown; UML syntax references (flowchart, sequence, class, state, ER) are out of scope | review |
