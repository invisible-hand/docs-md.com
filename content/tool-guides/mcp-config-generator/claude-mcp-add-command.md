---
title: claude mcp add: Syntax, Scopes, Flags and JSON
h1: How does the claude mcp add command work?
description: claude mcp add --transport http NAME URL adds a remote MCP server to Claude Code. Scopes, every flag, the -- separator, .mcp.json and add-json.
tool: mcp-config-generator
updated: 2026-11-24
related: /mcp-config-generator/add-mcp-server-to-codex, /mcp-config-generator/cursor-mcp-json, /mcp-config-generator/vscode-mcp-server-config, /mcp-config-generator/mcp-tool-call-timeout
---
`claude mcp add` registers an MCP server with Claude Code. For a remote server, run `claude mcp add --transport http <name> <url>`. For a local one, put the command after two dashes: `claude mcp add <name> -- <command>`. Without `--scope`, the server is saved for you alone and only in the current project.

The syntax, scopes and limits below come from the [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp) and from `claude mcp add --help` in Claude Code 2.1.331, both read on 2026-11-24. The [MCP config generator](/mcp-config-generator) builds the command for your own server, with headers and environment variables quoted for the shell.

## What is the syntax of claude mcp add?

The help output gives it as `claude mcp add [options] <name> <commandOrUrl> [args...]`: options, the server name, then a URL or a command. The transport defaults to stdio, so a remote server needs `--transport http`.

```bash
# remote server (Streamable HTTP)
claude mcp add --transport http docs-md https://docs-md.com/mcp

# remote server with a header
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"

# local server: everything after -- is the command that starts it
claude mcp add --transport stdio myserver -- npx server
```

The [documentation](https://code.claude.com/docs/en/mcp) explains the two dashes: they separate "Claude's own options, such as `--transport`, `--env`, and `--scope`, from the command and arguments that run the server", and "Everything after `--` is passed to the server untouched". Without them, Claude Code would try to read a server flag such as `--port` as one of its own options.

## What do the scopes local, project and user mean?

They decide who gets the server and where it is stored. Local is the default: the server loads only in the project where you added it, stays private to you, and is stored in `~/.claude.json` under that project's path. Project scope writes the server to `.mcp.json` in the project root, a file meant to be committed so the team shares it. User scope stores the server in `~/.claude.json` for all your projects.

| Scope | Loads in | Shared with the team | Stored in |
|---|---|---|---|
| Local (default) | Current project only | No | `~/.claude.json` |
| Project | Current project only | Yes, through version control | `.mcp.json` in the project root |
| User | All your projects | No | `~/.claude.json` |

```bash
claude mcp add --transport http docs-md --scope user https://docs-md.com/mcp
claude mcp add --transport http docs-md --scope project https://docs-md.com/mcp
```

The table is the one in the [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp). When the same server name exists in more than one place, the documented order of precedence is local, then project, then user, then servers that come from plugins, then claude.ai connectors.

## Which flags does claude mcp add take?

Seven besides `--help`, according to the help output of version 2.1.331. Three are for everyday use and four are for OAuth:

- `-t, --transport <transport>`: `stdio`, `sse` or `http`. Defaults to stdio. The documentation calls the SSE transport deprecated.
- `-s, --scope <scope>`: `local`, `user` or `project`. Defaults to local.
- `-e, --env <env...>`: environment variables for a local server, written as `KEY=value`.
- `-H, --header <header...>`: headers for an HTTP or SSE server, written as `"Name: value"`. Repeat the flag for more than one header.
- `--client-id <clientId>`: an OAuth client ID for an HTTP or SSE server.
- `--client-secret`: prompts for an OAuth client secret, or reads it from the `MCP_CLIENT_SECRET` variable.
- `--callback-port <port>`: a fixed port for the OAuth callback, for servers that require a pre-registered redirect URI.

There is no flag for a timeout. That setting goes in the JSON entry, as shown further down.

## Why does the order of --env and the server name matter?

Because `--env` accepts several `KEY=value` pairs in a row, and the CLI cannot tell where they end. The [documentation](https://code.claude.com/docs/en/mcp) warns: "If the server name comes directly after `--env`, the CLI reads the name as another pair and rejects it, so place at least one other option, such as `--transport stdio`, between `--env` and the server name."

```bash
claude mcp add --env AIRTABLE_API_KEY=YOUR_KEY --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

That is the documentation's own example. `--header` also takes several values, and the documented examples put it at the end of the command, after the URL.

## What is the JSON alternative to claude mcp add?

There are two: write the server into `.mcp.json` by hand, or pass a JSON entry to `claude mcp add-json`. Both use the same shape, which is a `type`, then a `url` for a remote server or a `command` with `args` and `env` for a local one.

```json
{
  "mcpServers": {
    "docs-md": {
      "type": "http",
      "url": "https://docs-md.com/mcp"
    }
  }
}
```

```bash
claude mcp add-json weather-api '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'
```

One rule catches people who copy an entry from another client. In the words of the [documentation](https://code.claude.com/docs/en/mcp): "A JSON entry that has a `url` but no `type` is a configuration error, because Claude Code reads an entry with no `type` as a stdio server." A remote entry in Cursor's file has no `type` (see [Cursor's mcp.json](/mcp-config-generator/cursor-mcp-json)), so it cannot be pasted as it is. `type` also accepts `streamable-http` as another spelling of `http`.

`add-json` takes `--scope user`, and from version 2.1.327 it reads the JSON from standard input when you pass `-` in its place. In `.mcp.json`, `${VAR}` and `${VAR:-default}` are expanded in `command`, `args`, `env`, `url` and `headers`, which keeps a token out of a committed file. For headers that have to be computed, a `headersHelper` entry names a command that prints them.

## How do I list, check and remove servers?

Use `claude mcp list`, `claude mcp get <name>` and `claude mcp remove <name>` in a terminal, and `/mcp` inside a session. According to the [documentation](https://code.claude.com/docs/en/mcp), `claude mcp list` "shows a health status next to each server it lists, such as `✔ Connected`, `! Needs authentication`, or `✘ Failed to connect`". For a failed server, `claude mcp get <name>` shows the reason on an `Issue:` line. The `/mcp` panel shows the tool count next to each connected server.

The help output lists a few more subcommands: `add-from-claude-desktop` imports servers from Claude Desktop (Mac and WSL only), `login` and `logout` handle OAuth for a remote server, and `serve` starts Claude Code itself as an MCP server.

## Why is my .mcp.json server waiting for approval?

Because Claude Code asks before it connects to a server that came with a repository. In an interactive session a project-scoped server needs your approval, and until then the help text says such servers "are shown as ⏸ Pending approval and not connected to". `claude mcp reset-project-choices` clears the approvals and rejections for the project if you want to be asked again.

A non-interactive run is different. For `claude -p`, the documentation says it "loads project-scoped servers without asking". Keep that in mind before you run Claude Code headless in a repository you did not write.

## How long may a tool call run in Claude Code?

By default there is no short limit on the whole call: `MCP_TOOL_TIMEOUT` defaults to 100000000 milliseconds, about 28 hours. A `timeout` field in a server's JSON entry, in milliseconds, overrides it for that server, and values below 1000 are ignored. For an HTTP server there is a second timer on each request, up to the server's first response byte, and it is at least 60 seconds. Server startup has its own limit, `MCP_TIMEOUT`, which is 30000 milliseconds by default.

```json
{
  "mcpServers": {
    "docs-md": {
      "type": "http",
      "url": "https://docs-md.com/mcp",
      "timeout": 120000
    }
  }
}
```

These limits are described in the "Time limits on MCP tool calls" section of the [documentation](https://code.claude.com/docs/en/mcp) and on its [environment variables page](https://code.claude.com/docs/en/env-vars). [Why an MCP tool call times out](/mcp-config-generator/mcp-tool-call-timeout) explains how the timers interact and what other clients do.

## What about the same server in other tools?

Claude Code's command and JSON are specific to Claude Code. Codex uses a TOML table and its own command ([add an MCP server to Codex](/mcp-config-generator/add-mcp-server-to-codex)), and VS Code now reads different files than it used to ([where VS Code keeps MCP servers](/mcp-config-generator/vscode-mcp-server-config)). Claude on the web and Claude Desktop do not read `.mcp.json` for a remote server at all: there it is added as a custom connector by URL, as Anthropic's [connector documentation](https://claude.com/docs/connectors/custom/add-unlisted) describes. For background on servers in general, see [what an MCP server is](/what-is-an-mcp-server).
