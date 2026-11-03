# Discord formatting topic pages

One page per Discord formatting question at `/discord-markdown/<slug>`, under the
`/discord-markdown` cheat sheet. Each page shows the syntax as a vector diagram, then examples as
typed text next to a Discord-style preview, then answers.

| Piece | File |
|---|---|
| Content (one per topic) | `lib/discord-guides/<slug>.ts`, exporting `GUIDE: DiscordGuide` |
| Type | `lib/discord-guides/types.ts` |
| Registry + validator | `lib/discord-guides/index.ts` (`DISCORD_GUIDES`, `validateDiscordGuide`) |
| Route | `app/discord-markdown/[topic]/page.tsx` |
| Preview renderer | `lib/discord/render.ts` + `components/discord/DiscordMessage.tsx` |
| Diagram | `components/SyntaxAnatomy.tsx` |
| Check | `node scripts/check-discord-guides.mjs` (registered pages) or `--file lib/discord-guides/<slug>.ts` (one unregistered file); part of `npm run build` |

Model: `lib/discord-guides/strikethrough.ts`. Read it before writing.

## Writer contract

| Rule | Enforced |
|---|---|
| `title` ≤ 60 characters; `description` 80–155 | yes |
| `answer` ≤ 60 words, answers the H1 plainly, no link in its first sentence | yes |
| `anatomy`: the core syntax split into marker / content / extra parts, each with a short label | yes |
| 2–6 `examples`; each `source` is exactly what a user types, and the preview must look right | yes / review |
| ≥ 3 `sections`, ≥ 4 `faq` (questions end in `?`, answers 30–120 words and stand alone) | yes |
| Body ≥ 600 words excluding examples | yes |
| Text uses only `code` and `[label](/path or https://…)`; internal links resolve | yes |
| 2–6 `related` internal paths | yes |
| Every factual claim is checked against Discord's own support articles or developer docs, listed in `sources` | review |
| Say what differs between desktop, web and mobile only when you have checked it | review |
| No invented numbers, no hype, no claims about Discord features you could not verify | review |

The renderer is a preview, not Discord: if an example uses syntax the preview cannot show, change
the example or extend `lib/discord/render.ts`, and say so in the page text when Discord itself
behaves differently from the preview.
