---
title: VS Code MCP Config: .mcp.json, mcp-config.json
h1: Where does VS Code keep MCP server configuration?
description: VS Code with Copilot reads .mcp.json and ~/.copilot/mcp-config.json (mcpServers). .vscode/mcp.json with servers is deprecated; removal set for Feb 2027.
tool: mcp-config-generator
updated: 2026-11-24
related: /mcp-config-generator/cursor-mcp-json, /mcp-config-generator/claude-mcp-add-command, /mcp-config-generator/add-mcp-server-to-codex, /mcp-config-generator/mcp-tool-call-timeout
---
VS Code with GitHub Copilot keeps MCP servers in `.mcp.json` at the workspace root, or in `~/.copilot/mcp-config.json` for all workspaces. Both use a top-level `mcpServers` key. The older `.vscode/mcp.json`, with a top-level `servers` key, belongs to the Local harness, which VS Code has deprecated and plans to remove in February 2027.

This page follows the [MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) and the [MCP servers page](https://code.visualstudio.com/docs/agent-customization/mcp-servers) of the VS Code documentation, both dated 11/18/2026 and read on 2026-11-24. The [MCP config generator](/mcp-config-generator) prints the current file and the deprecated one for your own server, one under the other.

## Which files does VS Code read for MCP servers now?

Two, which the [reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) calls native destinations. To use a server across your workspaces, the file is "`$COPILOT_HOME/mcp-config.json`, or `~/.copilot/mcp-config.json` when `COPILOT_HOME` is unset". To share server definitions with your team, it is "`.mcp.json` at the workspace root". About the old locations the reference is direct: "For new Copilot configurations, use these native destinations, not `.vscode/mcp.json` or profile `mcp.json`. Those files use the deprecated Local harness's editor-managed `servers` format."

One detail matters for the workspace file. Guided setup offers `.mcp.json` as a destination only "when the Experimental `chat.mcp.workspaceRootConfig.enabled` setting is on". The reference adds that "Existing workspace-root `.mcp.json` files remain available when the guided-setup setting is off", so a file that is already in the repository keeps working without the setting.

## What does the current format look like?

A JSON object with `mcpServers` at the top, one entry per server, and a `type` on each entry. The [reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) gives the values as "`stdio` for a command, `http` for Streamable HTTP, or `sse` for a legacy SSE endpoint" and adds: "Prefer HTTP when the server supports it."

```json
{
  "mcpServers": {
    "docs-md": {
      "type": "http",
      "url": "https://docs-md.com/mcp",
      "tools": ["*"]
    },
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "tools": ["*"]
    }
  }
}
```

The second entry is the reference's own stdio example. `tools` holds the tool names to make available, and `["*"]` makes all of the server's tools available. A remote entry takes `url` and optional `headers`. A local entry takes `command`, `args` and `env`, and in the user file also `cwd`: "The Copilot user configuration form supports this field; the workspace-root form does not." Header values can reference the environment as `${NAME}` or `${NAME:-default}`, and the reference warns: "Don't store literal credentials in shared files."

## What changed from .vscode/mcp.json?

Three things: the location, the top-level key, and who manages the file. The old format lives in `.vscode/mcp.json` or in the `mcp.json` of your VS Code profile, uses `servers` at the top, and is managed by the editor. The [reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) calls it "the deprecated Local harness's editor-managed `servers` format", and the documentation carries this notice: "The Local harness is deprecated and will be removed in February 2027. Move your workflows to the Copilot harness before then."

```json
{
  "servers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

That block is still documented for existing setups. One behavior is described for the editor's older client only: it "first tries the Streamable HTTP transport and falls back to SSE if HTTP is not supported". A command also changed meaning. **MCP: Open User Configuration** now opens "the editor-managed profile `mcp.json`, not the Copilot user file", which is easy to miss if you used that command to reach your user servers before.

## How do I move a server from .vscode/mcp.json to the new files?

Copy each entry from under `servers` to under `mcpServers` in `.mcp.json` or `~/.copilot/mcp-config.json`, and keep its `type`. The reference's examples for the new format also carry a `tools` list, so add `"tools": ["*"]` or the names you want.

The [reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) names the fields that must stay behind: "Don't copy editor-only fields such as `inputs`, `envFile`, `dev`, or `sandboxEnabled` into a portable file." A value that used to come from an `inputs` prompt therefore needs another source, and the portable format supports environment references such as `${NAME}`. Once the server works from the new file, remove it from the old one so it is not defined twice.

## How do I add a server without editing a file?

Use the guided flow. The [MCP servers page](https://code.visualstudio.com/docs/agent-customization/mcp-servers) gives these steps: select Copilot in the Session Target dropdown, run **Chat: Open Customizations** and select **MCP Servers**, select **Add Server (+)** in the User group, choose **HTTP (HTTP or Server-Sent Events)** and enter the server endpoint, enter a unique server ID, then select **Global** and **Copilot Global**. Running **MCP: Add Server** from the Command Palette starts the same flow.

The same view is where you manage servers afterwards: the page says to "Open Chat: Open Customizations > MCP Servers to manage your servers" and to use a server's ellipsis menu to disable or uninstall it. It also says to "Review any server trust requests before accepting them."

## What should I name the server?

Use a short name without spaces or punctuation. The [reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) says: "Use a descriptive, unique name for each server you use together, such as `github` or `database`. Avoid whitespace and special characters. For multi-word names, use camelCase, such as `uiTesting` or `githubIntegration`."

It does not say whether a hyphen counts as a special character. For a server that most instructions call `docs-md`, the spelling that certainly follows the stated convention is `docsMd`. The [generator](/mcp-config-generator) keeps the name exactly as you type it, so enter the spelling you want in the file.

## Does the same file work in Copilot CLI and on GitHub?

Partly. GitHub Copilot CLI reads the same user file, `~/.copilot/mcp-config.json`, and project files named `.mcp.json` or `.github/mcp.json`. Its documentation states that "The `.vscode/mcp.json` file for VS Code is not read by Copilot CLI" ([GitHub Docs: adding MCP servers for Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)). In the CLI's own examples a local server is written with `"type": "local"`.

The Copilot cloud agent, which used to be called the Copilot coding agent, reads no file from your machine. Its JSON is pasted into the repository's settings under Copilot, then MCP servers, in the same `mcpServers` shape and with a required `tools` list ([GitHub Docs: configure MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers)). That page also says the cloud agent uses the tools without asking for approval and does not support remote servers that use OAuth.

## Is there an install link for VS Code?

Yes. The [MCP extension guide](https://github.com/microsoft/vscode-docs/blob/main/api/extension-guides/ai/mcp.md) in the VS Code documentation gives the format `vscode:mcp/install?{json-configuration}` (`vscode-insiders:` for Insiders), built by URL-encoding a JSON object that holds the server name and its settings. For the Docs MD server:

```text
vscode:mcp/install?%7B%22name%22%3A%22docs-md%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fdocs-md.com%2Fmcp%22%7D
```

The guide says the link "opens the MCP server details editor in VS Code so the user can review the configuration before choosing to install". It does not say which file the install writes to, the Copilot user file or the editor-managed one, so check where the server landed afterwards. The command line has a similar option, `code --add-mcp`, and the reference notes that it "uses the VS Code format, not the portable Copilot user file".

## How long may a tool call run in VS Code?

The VS Code pages give no number. For "additional runtime-specific options" they point to the Copilot CLI guidance, and the [Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) documents a `timeout` of 30000 milliseconds by default "for tool discovery and tool calls". Whether the editor applies the same default is not stated anywhere on the pages read for this guide.

If one of your tools waits longer than half a minute, treat the limit as unknown and read [why an MCP tool call times out](/mcp-config-generator/mcp-tool-call-timeout), which lists what each client documents.

## How does this compare with other editors?

The wrapper is shared and the details are not. Cursor also uses `mcpServers`, in `.cursor/mcp.json`, but puts no `type` on a remote entry ([Cursor's mcp.json](/mcp-config-generator/cursor-mcp-json)). Claude Code uses a file with the same name as the new VS Code one, `.mcp.json` in the project root, and requires the `type` ([the claude mcp add command](/mcp-config-generator/claude-mcp-add-command)). Codex uses TOML ([adding an MCP server to Codex](/mcp-config-generator/add-mcp-server-to-codex)). If you are new to the protocol, [what MCP is](/what-is-mcp) explains the parts.
