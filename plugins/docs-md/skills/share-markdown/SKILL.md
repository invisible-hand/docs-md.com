---
name: share-markdown
description: Publish markdown at a public docs-md.com link (rendered tables, code, Mermaid diagrams, table of contents) and read docs-md.com links. Use when the user wants to share, send, publish or hand off a markdown document such as a plan, spec, report, README, changelog or agent handoff, or gives you a docs-md.com link to read.
---

# Share markdown with Docs MD

Docs MD (https://docs-md.com) turns markdown into a clean, rendered web page at a short link. No account, no API key.

## Publish

Prefer the `share_markdown` MCP tool from the `docs-md` server if it is available. Otherwise use the REST API with one command:

```bash
curl --data-binary @PLAN.md "https://docs-md.com/api/share?expiry=7d&filename=PLAN.md&client=claude-skill"
```

The reply is plain text: the share URL on the first line, then the raw URL, the expiry date and an edit token.

- Expiry: `1d`, `7d`, `30d` (default) or `never`. Use `never` only when the user asks for a permanent link; permanent links can appear in search engines.
- Pipe text instead of a file: `printf '%s' "$MARKDOWN" | curl --data-binary @- "https://docs-md.com/api/share?expiry=7d"`.
- Limits: 120,000 characters per share, 100 new shares per day per address.

Give the user the URL. Keep the edit token (tell the user where you saved it, for example in your reply): it is the only way to update or delete the share.

## Update or delete

With the MCP server: `update_share` / `delete_share` with the id (the URL path) and the edit token. Over HTTP:

```bash
curl -X PATCH https://docs-md.com/api/share/<id> -H "x-edit-token: <token>" -H "content-type: application/json" \
  -d "$(jq -n --rawfile c PLAN.md '{content: $c}')"
curl -X DELETE https://docs-md.com/api/share/<id> -H "x-edit-token: <token>"
```

## Read a docs-md.com link

Use the `read_share` MCP tool, or fetch the markdown directly: `https://docs-md.com/<id>.md` (or `https://docs-md.com/raw/<id>`). Do not scrape the HTML page.

## Rules

- A share is public to anyone with the link. Never include passwords, API keys, tokens, payment card numbers, customer data or other people's personal data. Redact them first and tell the user you did.
- Write the document so it stands on its own: a title, a one-paragraph summary, then sections. Mermaid code blocks render as diagrams.
- Content must follow https://docs-md.com/acceptable-use.
