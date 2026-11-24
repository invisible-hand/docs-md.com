---
title: Codex MCP: Add a Server via CLI or config.toml
h1: How do I add an MCP server to Codex?
description: Add an MCP server to Codex with codex mcp add or a [mcp_servers] table in config.toml. CLI, IDE extension, headers, approval and the 60 s timeout.
tool: mcp-config-generator
updated: 2026-11-24
related: /mcp-config-generator/claude-mcp-add-command, /mcp-config-generator/cursor-mcp-json, /mcp-config-generator/vscode-mcp-server-config, /mcp-config-generator/mcp-tool-call-timeout
---
Run `codex mcp add <name> --url <URL>` for a remote server, or `codex mcp add <name> -- <command>` for a local one. Codex keeps each server as a `[mcp_servers.<name>]` table in `config.toml`, by default `~/.codex/config.toml`, and you can write that table by hand instead. The Codex CLI, the IDE extension and the ChatGPT desktop app read the same file.

Everything below follows OpenAI's [Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) and the output of `codex mcp add --help` in codex-cli 0.169.1, both read on 2026-11-24. To get the command and the table for your own server without typing them, fill in the [MCP config generator](/mcp-config-generator) and copy the Codex block.

## What does codex mcp add do?

It adds one server entry to your Codex configuration. The usage line printed by the CLI is `codex mcp add [OPTIONS] <NAME> (--url <URL> | -- <COMMAND>...)`: a name, then either `--url` with the address of a Streamable HTTP server, or two dashes followed by the command that starts a local server.

```bash
# remote server (Streamable HTTP)
codex mcp add docs-md --url https://docs-md.com/mcp

# local server (stdio): everything after -- is the command
codex mcp add context7 -- npx -y @upstash/context7-mcp

# local server with environment variables
codex mcp add my-server --env API_KEY=dmk_… --env LOG_LEVEL=info -- node ./server.js
```

The local forms are in the [Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli), which writes the pattern as `codex mcp add <server-name> --env VAR1=VALUE1 --env VAR2=VALUE2 -- <stdio server-command>`. The `--url` form appears there only inside an OAuth example, but the help text of the installed CLI describes `--url` as the "URL for a streamable HTTP MCP server" and asks for no OAuth flag with it. `--env` is valid for local servers only and can be repeated. The other subcommands are `list`, `get`, `remove`, `login` and `logout`.

## What does an MCP server look like in config.toml?

Each server is a TOML table named `[mcp_servers.<name>]`. A remote server needs one key, `url`. A local server needs `command` and can take `args`, `env`, `env_vars` and `cwd`.

```toml
[mcp_servers.docs-md]
url = "https://docs-md.com/mcp"

[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]

[mcp_servers.context7.env]
MY_ENV_VAR = "MY_ENV_VALUE"
```

The [documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) describes the local fields this way: `command` is "(required): The command that starts the server", `args` holds its arguments, `env` holds variables to set, `env_vars` lists variables "to allow and forward" from your own environment, and `cwd` is the working directory to start the server from. On the TOML side, a server name with a hyphen, such as `docs-md`, is a valid bare key. A name with a dot or a space has to be quoted, as in `[mcp_servers."my.server"]`, because an unquoted dot starts a nested table. A name made of letters, digits, hyphens and underscores avoids the question.

## Where is the Codex config.toml, and can a project have its own?

The file is `~/.codex/config.toml` by default, and a project can have its own at `.codex/config.toml`. The [documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) puts a condition on the second one: "you can also scope MCP servers to a project with `.codex/config.toml` (trusted projects only)". A project file is read only in a project you have marked as trusted.

The same page states that "The ChatGPT desktop app, Codex CLI, and IDE extension share this configuration", so a server added in one of the three is there in the other two. The help output of `codex mcp add` lists no option for choosing a scope. To put a server in a project, write the table into `.codex/config.toml` yourself.

## How do I add an MCP server in the Codex IDE extension?

Open the gear menu and select **MCP servers**, then **Add server**. Enter a name, choose **STDIO** or **Streamable HTTP**, and give the command or the URL. Save the server, then select **Restart extension**. Those are the steps in the [IDE section of the Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=ide).

Because the extension shares `config.toml` with the CLI, a table you wrote by hand appears in the same list, and a server you add in the dialog can be edited in the file afterwards.

## How do I send a header or a token to a remote server?

Put it in `config.toml`, because `codex mcp add` has no header flag. The [documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) lists four keys for a remote server: `http_headers` is a table of fixed header names and values, `env_http_headers` maps a header name to the environment variable that holds its value, `bearer_token_env_var` names a variable whose value is sent as a bearer token, and `http_headers_helper` runs a command that prints the headers as JSON.

```toml
[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"
http_headers = { "X-Figma-Region" = "us-east-1" }
```

That example is OpenAI's own. For anything secret, the two keys that read an environment variable keep the value out of a file that may be shared or committed. On the command line, `--bearer-token-env-var` is the one credential option that works without OAuth; the help text marks it as valid for Streamable HTTP servers only. A server that needs no credentials needs none of this: the documentation says that when no credential source resolves, "Codex can connect to the server without authentication".

## Why does a Codex MCP tool call stop after 60 seconds?

Because `tool_timeout_sec` defaults to 60. The [documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) defines it as the "Timeout (seconds) for the server to run a tool. Default: `60`." Next to it sits `startup_timeout_sec`, the "Timeout (seconds) for the server to start", which defaults to 10. Both are set per server:

```toml
[mcp_servers.docs-md]
url = "https://docs-md.com/mcp"
tool_timeout_sec = 120
```

Raise `tool_timeout_sec` for a server whose tools wait on purpose, for example a tool that holds the call open until another agent replies. Raise `startup_timeout_sec` when a local server is slow to start: the default of 10 seconds can be short for a command such as `npx -y` that downloads a package the first time it runs. The command line has no flag for either value. [Why an MCP tool call times out](/mcp-config-generator/mcp-tool-call-timeout) compares the 60 seconds with the limits of other clients.

## How do I check that Codex sees the server?

Run `codex mcp list` in a terminal to see the configured servers, or type `/mcp` in the Codex TUI to see the active ones. In the ChatGPT desktop app, typing `/mcp` in the composer shows the connected servers, and according to the [documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) its server list "shows which servers are enabled and which require OAuth".

Then ask the agent which tools the server offers. When a server is listed but its tools never appear, two documented causes are worth checking first: the server did not start within `startup_timeout_sec`, or it requires OAuth and you have not signed in yet. `codex mcp --help` lists `login` and `logout` subcommands next to `list`, `get`, `add` and `remove`.

## Can Codex ask before it runs an MCP tool?

Yes, per server and per tool. `default_tools_approval_mode` sets the behavior for every tool of a server, and the [documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) lists its values as `auto`, `prompt`, `writes` and `approve`. It defines one of them in words: "The `writes` mode prompts for tools that aren't marked read-only." A single tool can differ from the server default through its own table with `approval_mode`. Two more keys limit what the model can call at all: `enabled_tools` is an allow list, and `disabled_tools` is applied after it.

```toml
[mcp_servers.chrome_devtools]
url = "http://localhost:3000/mcp"
enabled_tools = ["open", "screenshot"]
default_tools_approval_mode = "prompt"

[mcp_servers.chrome_devtools.tools.open]
approval_mode = "approve"
```

This block is a shortened copy of the example in the documentation. If you maintain the server, one more line from that page is for you: Codex reads the server's `instructions`, and the page asks authors to "Keep the first 512 characters self-contained".

## Does the same server work in other clients?

Yes, but each client writes it differently, and a Codex table cannot be pasted into a JSON file. The [MCP config generator](/mcp-config-generator) prints the same server for every client it covers. The neighbors of this page go through three of them: [the claude mcp add command](/mcp-config-generator/claude-mcp-add-command) for Claude Code, [Cursor's mcp.json](/mcp-config-generator/cursor-mcp-json), and [the current VS Code files](/mcp-config-generator/vscode-mcp-server-config). If the protocol itself is new to you, start with [what MCP is](/what-is-mcp).
