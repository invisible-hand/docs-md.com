# docs-md-cli

Share markdown as a rendered link from the terminal, a script or an AI agent. No account, no API key.

```bash
npx docs-md-cli share PLAN.md --expiry 7d
# https://docs-md.com/calm-river-Ab12C
```

| Command | What it does |
|---|---|
| `docs-md share <file\|->` | Publish a file (or stdin) and print the link. `--expiry 1d\|7d\|30d\|never`, `--name`, `--json` |
| `docs-md read <id\|url>` | Print the markdown of any docs-md.com share |
| `docs-md update <id\|url> <file>` | Replace the content (uses the saved edit token, or `--token`) |
| `docs-md delete <id\|url>` | Delete the share |
| `docs-md list` | Shares created from this machine |

Edit tokens are kept in `~/.config/docs-md/tokens.json` (mode 600). Shares are public to anyone with the link, so keep secrets and personal data out of them.

More: https://docs-md.com/agents · MCP server: https://docs-md.com/api/mcp · API: https://docs-md.com/openapi.json
