---
title: MCP Tool Call Timeout: Limits by Client, Fixes
h1: Why does an MCP tool call time out, and how do I fix it?
description: MCP clients end a tool call after a set time, from 30 s in Copilot CLI to 60 s in Codex, Zed and Junie. Limits per client, settings, and the 25 s pattern.
tool: mcp-config-generator
updated: 2026-11-24
related: /mcp-config-generator/add-mcp-server-to-codex, /mcp-config-generator/claude-mcp-add-command, /mcp-config-generator/cursor-mcp-json, /mcp-config-generator/vscode-mcp-server-config
---
An MCP tool call times out because the client limits how long one call may run, and each client sets its own limit. Documented defaults start at 30 seconds in GitHub Copilot CLI and are 60 seconds in Codex, Zed and Junie. Raise the client's setting where one exists, or make the tool return within 25 seconds and call again.

The numbers on this page were read from each vendor's documentation on 2026-11-24, and every row links its source. To get the setting written in the right unit for your own server, enter a timeout in the [MCP config generator](/mcp-config-generator).

## Which clients cut a tool call, and after how long?

Twelve clients document a number, and they are listed here from the shortest limit to the longest. The limit applies to one tool call unless the row says otherwise.

| Client | Documented default for one tool call | Source |
|---|---|---|
| GitHub Copilot CLI | 30 seconds (30000 ms), "for tool discovery and tool calls" | [Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Codex (CLI, IDE extension, ChatGPT desktop app) | 60 seconds (`tool_timeout_sec`) | [Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) |
| Zed | 60 seconds (`context_server_timeout`), capped at 600 | [Zed settings reference](https://github.com/zed-industries/zed/blob/main/docs/src/reference/all-settings.md) |
| JetBrains Junie | 60 seconds, for every request to the server | [Junie MCP configuration](https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html) |
| Cline | 60 seconds, a value from the repository source, not from the docs | [Cline source](https://github.com/cline/cline/blob/main/sdk/packages/shared/src/mcp.ts) |
| Claude Code | 60 seconds to the first response byte of an HTTP request; about 28 hours for the whole call | [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp) |
| Kiro CLI | 120 seconds (`requestTimeout`, 120000 ms) | [Kiro agent configuration reference](https://kiro.dev/docs/custom-agents/configuration-reference) |
| Google Antigravity | 180 seconds (`timeoutSeconds`) | [Antigravity MCP documentation](https://antigravity.google/docs/mcp) |
| Claude on the web, Claude Desktop | 240 seconds | [Claude connector limits](https://claude.com/docs/connectors/building/index) |
| Goose | 300 seconds in every documented example; no default is stated | [Goose extensions guide](https://github.com/aaif-goose/goose/blob/main/documentation/docs/getting-started/using-extensions.md) |
| Gemini CLI | 600 seconds (600,000 ms) | [Gemini CLI MCP documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md) |
| OpenCode | 12 hours (`execution`) | [OpenCode MCP documentation](https://opencode.ai/docs/mcp-servers) |

Roo Code documented 60 seconds as well, but the extension was shut down on May 15, 2026, according to the notice in its own [documentation](https://docs.roocode.com).

## Which clients document no limit at all?

ChatGPT, Cursor, VS Code with GitHub Copilot, the GitHub Copilot cloud agent, Devin Desktop (formerly Windsurf), Continue, JetBrains AI Assistant, LM Studio and Warp publish no tool-call timeout on the pages read for this guide. A limit that is not published is not the same as no limit: it is a number you cannot see and that can change between releases.

Two of them come close to a statement. Continue documents only `connectionTimeout`, which covers the first connection to a server and not the calls after it ([Continue MCP documentation](https://docs.continue.dev/customize/deep-dives/mcp)). The VS Code pages refer to the Copilot CLI guidance for runtime options without repeating its 30 second default ([VS Code MCP reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)). For all nine, plan for the shortest limit that anyone documents.

## Which settings raise the limit?

Most of the twelve have a documented setting, and each one has its own name and unit: seconds in some clients, milliseconds in others. Check the unit before anything else when a raised timeout seems to have no effect.

- **Claude Code:** `"timeout": 120000` in the server's JSON entry, in milliseconds, or the `MCP_TOOL_TIMEOUT` variable for all servers. Values below 1000 are ignored ([source](https://code.claude.com/docs/en/mcp)).
- **Codex:** `tool_timeout_sec = 120` in the server's table in `config.toml`, in seconds ([source](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)).
- **GitHub Copilot CLI:** `--timeout 120000` on `copilot mcp add`, or `"timeout": 120000` in the entry, in milliseconds ([source](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Gemini CLI:** `"timeout"` in the entry, in milliseconds ([source](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md)).
- **Antigravity:** `"timeoutSeconds"` in the entry. A positive value replaces the connect limit as well, and "A negative value, such as `-1`, turns off both limits" ([source](https://antigravity.google/docs/mcp)).
- **Zed:** `"timeout": 120` in the server entry, in seconds, or `context_server_timeout` for all servers. "Timeouts are capped at `600` seconds" ([source](https://github.com/zed-industries/zed/blob/main/docs/src/reference/all-settings.md)).
- **Junie:** `"timeout": 120000`, in milliseconds, "between `1000` (1 second) and `3600000` (1 hour)". The documentation warns that `"timeout": 60` is rejected, not read as one minute ([source](https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html)).
- **Goose:** `timeout: 300` in the extension entry, in seconds ([source](https://github.com/aaif-goose/goose/blob/main/documentation/docs/getting-started/using-extensions.md)).
- **Kiro CLI:** `requestTimeout` in the agent configuration, in milliseconds ([source](https://kiro.dev/docs/custom-agents/configuration-reference)).

```toml
[mcp_servers.docs-md]
url = "https://docs-md.com/mcp"
tool_timeout_sec = 120
```

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

The first block is the Codex table from [adding an MCP server to Codex](/mcp-config-generator/add-mcp-server-to-codex). The second is a Claude Code `.mcp.json` entry, explained in [the claude mcp add command](/mcp-config-generator/claude-mcp-add-command). For Claude on the web and Claude Desktop no setting is documented for the 240 seconds. Cline's documentation says only "Set request timeouts" without naming the field, and OpenCode has per-server timeout overrides whose default for tool calls is already 12 hours.

## Why does Claude Code have more than one timer?

Because it separates the length of the whole call from the wait for the server's first byte. The [documentation](https://code.claude.com/docs/en/mcp) describes three limits. The overall one is `MCP_TOOL_TIMEOUT`, with a "default: 100000000, about 28 hours", or the per-server `timeout`, which is "a hard wall-clock limit per tool call". For an HTTP, SSE or claude.ai connector server there is also "a second, per-request timer that covers each request through to the server's first response byte", set to the greatest of 60 seconds, the tool timeout that applies to the server, and `MCP_TIMEOUT`. The third is an idle window that "defaults to five minutes" for HTTP servers and is changed with `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`.

In practice, a remote tool that holds the request open and sends nothing for more than 60 seconds is cut, unless the server's entry has a `timeout` above 60000. The same page notes that a tool call in the main conversation "that is still running after two minutes moves to a background task".

## Do progress notifications keep a call alive?

Not in a way a server can count on. Two vendors document the case, and they differ. Claude Code says the per-server timeout is a hard limit "and progress notifications from the server don't extend it" ([source](https://code.claude.com/docs/en/mcp)). GitHub Copilot CLI says: "An MCP tool call that keeps emitting progress notifications is canceled once it has run for ten times the server's `timeout`" ([source](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)), which suggests that progress does extend a call there, up to five minutes at the default of 30 seconds. The other vendors do not describe what happens.

## What should a server do about client timeouts?

Return before the shortest limit, every time. A tool that has to wait for another agent's reply, a build or a person should take the waiting time as an argument, cap it, and answer when the time is up with a plain "nothing yet" result and a cursor that the next call passes back. Waiting in turns of 25 seconds fits under the 30 seconds of GitHub Copilot CLI with a margin for the network, and so under every documented limit in the table.

The Docs MD server works this way. Its `read_room` tool takes `wait_seconds`, holds the call until a message arrives or the time runs out, and returns a cursor in both cases. The tool's own description tells agents that 25 is the value that works in every client. A result that says the wait ended empty is a normal answer, not an error, and the agent's next step is to call again with the cursor.

Three more rules help. State the limit in the tool description, so the model picks a safe value on its own. Make the call safe to repeat, because a call that the client cut may still have run on the server. And keep the state on the server, behind the cursor, not in the open connection.

## What should an agent do when a tool call times out?

Call again, with the cursor from the last result if there is one, and do not report the task as failed after a single cut. A timeout means the client stopped waiting. It says nothing about whether the server did the work. For a read or a wait, repeating the call is harmless. For a call that writes, check the state first, for example by listing what exists, before sending it a second time.

If the same tool times out on every attempt, the limit is too low for it. Lower the tool's own wait argument if it has one, or ask the person you work for to raise the client setting named above.

## Is a startup timeout the same thing?

No. Several clients have a separate limit for starting the server and listing its tools, and it shows a different symptom: the server's tools never appear. Codex gives a server 10 seconds to start (`startup_timeout_sec`, [source](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)). Claude Code uses `MCP_TIMEOUT`, 30000 milliseconds by default ([source](https://code.claude.com/docs/en/env-vars)). Antigravity allows 300 seconds to connect and list tools ([source](https://antigravity.google/docs/mcp)). Kiro CLI allows 60000 milliseconds for the connection handshake ([source](https://kiro.dev/docs/custom-agents/configuration-reference)). OpenCode allows 30 seconds for startup and 30 for listing tools ([source](https://opencode.ai/docs/mcp-servers)). Junie applies its 60 seconds to "the startup handshake, listing tools, and each tool call" alike ([source](https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html)).

A local server whose command downloads a package the first time it runs is one reason to raise a startup limit. A remote server that is slow to answer its first request is another.

## Where do I set all of this for my own server?

In each client's own config file, which is a different file with a different shape every time. Cursor and VS Code, for example, document no timeout field at all ([Cursor's mcp.json](/mcp-config-generator/cursor-mcp-json), [where VS Code keeps MCP servers](/mcp-config-generator/vscode-mcp-server-config)). The [MCP config generator](/mcp-config-generator) takes one timeout in seconds and writes it for the clients that have a field, in the unit each one expects, and says which clients it left out. For the basics behind all of this, see [what an MCP server is](/what-is-an-mcp-server).
