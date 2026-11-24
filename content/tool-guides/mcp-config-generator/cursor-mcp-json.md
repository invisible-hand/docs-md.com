---
title: Cursor mcp.json: Location, Format and Examples
h1: Where is Cursor's mcp.json, and what goes in it?
description: Cursor reads .cursor/mcp.json in a project and ~/.cursor/mcp.json for all projects. The mcpServers format for remote and local servers, with examples.
tool: mcp-config-generator
updated: 2026-11-24
related: /mcp-config-generator/claude-mcp-add-command, /mcp-config-generator/vscode-mcp-server-config, /mcp-config-generator/add-mcp-server-to-codex, /mcp-config-generator/mcp-tool-call-timeout
---
Cursor reads MCP servers from `.cursor/mcp.json` inside a project and from `~/.cursor/mcp.json` in your home directory, which applies to every project. Both files hold one JSON object with a top-level `mcpServers` key. Each entry under it is one server: a `url` for a remote server, or a `command` with `args` for a local one.

The paths and fields below are from the [Cursor MCP documentation](https://cursor.com/docs/mcp), read on 2026-11-24. To get a correct file for your own server, with the install link next to it, enter the server in the [MCP config generator](/mcp-config-generator) and copy the Cursor block.

## Where does Cursor look for mcp.json?

In two places. The [documentation](https://cursor.com/docs/mcp) says: "Create `.cursor/mcp.json` in your project for project-specific tools" and "Create `~/.cursor/mcp.json` in your home directory for tools in every project you open in the editor or CLI". The folder is `.cursor`, with a leading dot, at the root of the project, and the same two files serve the Cursor editor and the Cursor CLI.

One exception is stated on the same page: hosted Cloud Agents do not read `~/.cursor/mcp.json`. The page does not say which file wins when both define a server under the same name, so give a project server and a global server different names.

## What does a remote server entry look like?

A name and a `url`. Cursor's own example adds a `headers` object for servers that expect an API key:

```json
{
  "mcpServers": {
    "docs-md": {
      "url": "https://docs-md.com/mcp"
    },
    "server-name": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "API_KEY": "value"
      }
    }
  }
}
```

The first entry is the Docs MD server, which needs no header. The second is the example from the [documentation](https://cursor.com/docs/mcp), where it carries the comment "MCP server using HTTP or SSE - runs on a server". Cursor lists three transports, stdio, SSE and Streamable HTTP, and its remote example has no `type` field: the URL is enough.

That is where entries copied between clients go wrong. Claude Code requires `"type": "http"` next to the URL and reads an entry without a type as a local command ([the claude mcp add command](/mcp-config-generator/claude-mcp-add-command)). Gemini CLI spells the key `httpUrl` and treats `url` as an SSE endpoint ([Gemini CLI documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md)). The wrapper is the same in all three, the entry is not.

## What does a local server entry look like?

A `command`, its `args`, and optionally `env`. The field table for stdio servers in the [documentation](https://cursor.com/docs/mcp) also lists `type` with the value `"stdio"` as required, although the examples on the same page leave it out, and `envFile`, a path to a file with more variables.

```json
{
  "mcpServers": {
    "my-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

The table describes `command` as the "Command to start the server executable. Must be available on your system path or contain its full path." If Cursor cannot start a server that works in your terminal, write the full path to the executable, which is the alternative the table itself names. `envFile` exists for stdio servers only: "Remote servers (HTTP/SSE) do not support `envFile`."

## Should a server go in the project file or the global file?

Put it in the project file when the server belongs to the work in that repository, and in the global file when it is a personal tool you want everywhere. That is the split the documentation draws: `.cursor/mcp.json` is for "project-specific tools" and `~/.cursor/mcp.json` is for "tools in every project".

Two practical points follow. A project file sits in the repository, so anyone who clones it gets the same servers, and anything written in it is visible to them: do not put a token there. And because hosted Cloud Agents skip the global file, a server that a Cloud Agent needs has to be in the project file.

## How do I keep a token out of mcp.json?

Reference a variable instead of writing the value. According to the [documentation](https://cursor.com/docs/mcp), "Cursor resolves variables in these fields: `command`, `args`, `env`, `url`, and `headers`". The variables are `${env:NAME}` for an environment variable, `${userHome}` for your home folder, `${workspaceFolder}` for the project root (the folder that contains `.cursor/mcp.json`), `${workspaceFolderBasename}` for its name, and `${pathSeparator}` or `${/}` for the path separator of the operating system.

```json
{
  "mcpServers": {
    "api": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:MY_SERVICE_TOKEN}"
      }
    }
  }
}
```

For a local server, `envFile` can point at a file such as `.env` or `${workspaceFolder}/.env`, both of which are the documentation's examples, and that file can stay out of version control.

## How do I check that Cursor loaded the server?

Open **Customize** in the sidebar. The [documentation](https://cursor.com/docs/mcp) says to "Enable or disable MCP servers from Customize in the sidebar", with a toggle for each server, and notes that "Disabled servers won't load or appear in chat". When a server does not connect, open the Output panel (Cmd+Shift+U on a Mac) and select "MCP Logs" from the dropdown.

In a chat, "Cursor asks for approval before using MCP tools by default", and the arrow next to the tool name shows the arguments it is about to send. The page adds that MCP "follows the same Run Modes as terminal commands", and that in Auto-review mode "allowlisted MCP tools run immediately and everything else is routed through the classifier".

## Is there a timeout for MCP tool calls in Cursor?

Cursor's documentation gives no number and no setting for it. The only related statement on the page is that "Cursor isolates server failures to prevent one server from affecting others". Since the limit is not published, a server meant to work in Cursor should not depend on one long call. [Why an MCP tool call times out](/mcp-config-generator/mcp-tool-call-timeout) lists the limits that other clients document and the waiting pattern that works without knowing the limit.

## What is a Cursor install link?

A link that opens Cursor with a server entry ready to install. The [install link documentation](https://cursor.com/docs/mcp/install-links) gives the format `cursor://anysphere.cursor-deeplink/mcp/install?name=$NAME&config=$BASE64_ENCODED_CONFIG`, where the config is the server entry as JSON, base64-encoded. For the Docs MD server the entry is `{"url":"https://docs-md.com/mcp"}`, and the link is:

```text
cursor://anysphere.cursor-deeplink/mcp/install?name=docs-md&config=eyJ1cmwiOiJodHRwczovL2RvY3MtbWQuY29tL21jcCJ9
```

Whatever is in the entry is in the link, header values included. Do not publish a link built from an entry that holds a token.

## Is mcp.json the same file in other clients?

No. Several clients use a file with that name, in different folders and sometimes with a different top-level key, and one of them is being retired:

| Client | File | Top-level key | Source |
|---|---|---|---|
| Cursor | `.cursor/mcp.json`, `~/.cursor/mcp.json` | `mcpServers` | [Cursor](https://cursor.com/docs/mcp) |
| Claude Code | `.mcp.json` in the project root | `mcpServers`, with a `type` on each entry | [Claude Code](https://code.claude.com/docs/en/mcp) |
| VS Code with GitHub Copilot | `.mcp.json` at the workspace root, `~/.copilot/mcp-config.json` | `mcpServers` | [VS Code](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) |
| VS Code, deprecated format | `.vscode/mcp.json` | `servers` | [VS Code](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) |
| GitHub Copilot CLI | `.mcp.json`, `.github/mcp.json`, `~/.copilot/mcp-config.json` | `mcpServers` | [GitHub Docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) |
| Kiro | `.kiro/settings/mcp.json`, `~/.kiro/settings/mcp.json` | `mcpServers` | [Kiro](https://kiro.dev/docs/mcp/configuration) |
| JetBrains Junie | `.junie/mcp/mcp.json`, `~/.junie/mcp/mcp.json` | `mcpServers` | [Junie](https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html) |
| Warp | `.warp/.mcp.json`, `~/.warp/.mcp.json` | `mcpServers` | [Warp](https://docs.warp.dev/agents/capabilities/mcp/) |
| LM Studio | `mcp.json`, edited inside the app | `mcpServers` | [LM Studio](https://lmstudio.ai/docs/app/mcp) |

LM Studio states that it "currently follows Cursor's `mcp.json` notation", so a Cursor entry can be pasted there as it is. For VS Code the details of the change are in [where VS Code keeps MCP server configuration](/mcp-config-generator/vscode-mcp-server-config), and Codex, which uses TOML instead of JSON, is covered in [adding an MCP server to Codex](/mcp-config-generator/add-mcp-server-to-codex). For a worked example of one MCP server in Cursor, see [sharing markdown from Cursor and Claude with MCP](/ai-powered-ide).
