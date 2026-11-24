import Link from 'next/link';
import { ToolGuideLinks } from '@/components/ToolGuidePage';
import McpConfigGenerator from '@/components/tools/McpConfigGenerator';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';
import { DEFAULT_INPUT, FACTS_CHECKED, MCP_CLIENTS, RETIRED_CLIENTS, timeoutLabel, type McpClient } from '@/lib/mcp-clients';

export const metadata = toolMetadata('mcp-config-generator');

const LINK = 'text-indigo-700 underline';
const TH = 'border-b border-gray-300 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600';
const TD = 'border-b border-gray-200 px-3 py-2 align-top';

const CLIENT_NAMES = MCP_CLIENTS.map((c) => c.name).join(', ');

/** Where one client keeps a server, read from the same generator the tool uses. */
function storage(client: McpClient) {
  const blocks = client.generate(DEFAULT_INPUT);
  const file = blocks.find((b) => b.kind === 'file');
  const cli = blocks.find((b) => b.kind === 'command' && !/one session/.test(b.label));
  return {
    command: cli ? cli.code.split(' ').slice(0, 3).join(' ') : null,
    project: file?.locations?.filter((l) => l.scope !== 'user').map((l) => l.path) ?? [],
    user: file?.locations?.filter((l) => l.scope === 'user').map((l) => l.path) ?? [],
    where: file?.where ?? (file ? null : 'Added in the app, by URL'),
  };
}

const STORAGE = MCP_CLIENTS.map((c) => ({ client: c, ...storage(c) }));
const WITH_COMMAND = STORAGE.filter((s) => s.command).length;
const BY_TIMEOUT = [...MCP_CLIENTS].sort((a, b) => (a.timeout.seconds ?? Infinity) - (b.timeout.seconds ?? Infinity));
const UNDOCUMENTED = MCP_CLIENTS.filter((c) => c.timeout.seconds === null).map((c) => c.name);

const FAQ = [
  {
    q: 'Which MCP clients does the generator cover?',
    a: `${MCP_CLIENTS.length} clients with a documented way to add a remote MCP server: ${CLIENT_NAMES}. Each one was checked against its vendor page on ${FACTS_CHECKED}, and every card links that page. ${RETIRED_CLIENTS.map((r) => r.note).join(' ')}`,
  },
  {
    q: 'Do I need mcp-remote or another bridge for a remote MCP server?',
    a: 'Not for the clients on this page. Each of them documents a native way to connect to a Streamable HTTP endpoint by URL. A bridge such as mcp-remote wraps a remote server in a local command (npx -y mcp-remote followed by the URL). Warp shows that form as one option in its examples, next to a plain URL entry; none of the vendor pages requires it.',
  },
  {
    q: 'Why is the same server written differently for each client?',
    a: 'The protocol defines how a client talks to a server, not how a client stores its list of servers, so every vendor chose a format. Most use JSON with a top-level "mcpServers" key, but the field for the address is "url" in Cursor, "httpUrl" in Gemini CLI, "serverUrl" in Antigravity and "uri" in Goose, and the type value is "http" in Claude Code, "streamableHttp" in Cline and "remote" in OpenCode. Codex uses TOML, and Continue and Goose use YAML.',
  },
  {
    q: 'Is the server URL or a header I type sent anywhere?',
    a: 'No. The commands and config blocks are built in your browser and the page makes no request with what you enter. The form is kept in the part of the address after the # sign, which browsers do not send to a server, so a copied link reproduces the name, the URL or command, and the selected clients. Header and variable values are never put in the link, only their names. An install link for Cursor, VS Code, Kiro or LM Studio does contain the values, because the client reads them from it.',
  },
  {
    q: 'Where does VS Code keep MCP servers now?',
    a: 'In .mcp.json at the workspace root or in ~/.copilot/mcp-config.json for all workspaces, both with a top-level "mcpServers" key. The older .vscode/mcp.json with a top-level "servers" key belongs to what the VS Code reference dated 11/18/2026 calls the deprecated Local harness, whose removal is announced for February 2027. The generator prints the current format first and the deprecated one below it.',
  },
  {
    q: 'What does the timeout field in the form do?',
    a: 'It writes a per-server limit for tool calls in the unit each client expects, and only for clients that document such a setting: milliseconds for Claude Code, GitHub Copilot CLI, Gemini CLI and Junie, seconds for Codex (tool_timeout_sec), Antigravity (timeoutSeconds), Zed and Goose. For every other client the card says the value was left out, because the vendor documents no per-server field for it.',
  },
  {
    q: 'How current are these formats?',
    a: `Every command, path and field was read from the vendor documentation on ${FACTS_CHECKED}. The blocks were not run against each client, so treat one as the documented shape with your values filled in. Clients change their config formats often; when a card and the linked vendor page disagree, the vendor page is right.`,
  },
];

export default function McpConfigGeneratorPage() {
  return (
    <ToolPage
      slug="mcp-config-generator"
      intro={
        <>
          Enter an MCP server once, as a remote URL or a local command, and get the documented way to add it to each
          client: the command where the client has one, the config file with its project and user paths, and the JSON,
          TOML or YAML to put in it. Each block has a copy button and a link to the vendor page it follows. The example
          is the <Link href="/agents/connect" className={LINK}>Docs MD server</Link>; replace it with your own. Everything
          runs in your browser.
        </>
      }
      tool={<McpConfigGenerator />}
      faq={FAQ}
    >
      <section className="space-y-3">
        <h2 className={H2}>What is an MCP config, and where does each client keep it?</h2>
        <p>
          An MCP config is the entry that tells a client which{' '}
          <Link href="/what-is-an-mcp-server" className={LINK}>
            MCP server
          </Link>{' '}
          to connect to: a name, and either a URL or a command that starts the server. Each client stores that entry in
          its own place and its own shape. Most use a JSON file with a top-level <code className={CODE}>mcpServers</code>{' '}
          key. Zed uses <code className={CODE}>context_servers</code> in its settings file, OpenCode nests servers under{' '}
          <code className={CODE}>mcp.servers</code>, Codex uses a TOML table named{' '}
          <code className={CODE}>[mcp_servers.name]</code>, and Continue and Goose use YAML. Claude on the web, Claude
          Desktop and ChatGPT have no file for a remote server: you add it in the app.
        </p>
        <p>
          Most clients read two files. The one inside the project can be committed, so everyone who opens the repository
          gets the server. The one in your home directory follows you across projects. {WITH_COMMAND} of the{' '}
          {MCP_CLIENTS.length} clients also have a command that writes the entry for you.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <caption className="sr-only">Where each MCP client keeps its server list, checked {FACTS_CHECKED}</caption>
            <thead>
              <tr>
                <th scope="col" className={TH}>Client</th>
                <th scope="col" className={TH}>Command</th>
                <th scope="col" className={TH}>Project file</th>
                <th scope="col" className={TH}>User file</th>
              </tr>
            </thead>
            <tbody>
              {STORAGE.map((s) => (
                <tr key={s.client.id}>
                  <th scope="row" className={`${TD} text-left font-medium text-gray-950`}>
                    <a href={s.client.docUrl} className={LINK}>
                      {s.client.name}
                    </a>
                    {s.client.formerName ? <span className="block text-xs font-normal text-gray-600">formerly {s.client.formerName}</span> : null}
                  </th>
                  <td className={TD}>{s.command ? <code className={CODE}>{s.command}</code> : <span className="text-gray-500">none documented</span>}</td>
                  {s.where ? (
                    <td className={TD} colSpan={2}>
                      {s.where}
                    </td>
                  ) : (
                    <>
                      <td className={TD}>
                        {s.project.length ? (
                          s.project.map((p) => (
                            <code key={p} className={`${CODE} mb-1 mr-1 inline-block`}>
                              {p}
                            </code>
                          ))
                        ) : (
                          <span className="text-gray-500">none documented</span>
                        )}
                      </td>
                      <td className={TD}>
                        {s.user.length ? (
                          s.user.map((p) => (
                            <code key={p} className={`${CODE} mb-1 mr-1 inline-block`}>
                              {p}
                            </code>
                          ))
                        ) : s.client.userStore ? (
                          s.client.userStore
                        ) : (
                          <span className="text-gray-500">none documented</span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Each client name links to the vendor page the row was read from on {FACTS_CHECKED}. For the background on the
          protocol itself, see{' '}
          <Link href="/what-is-mcp" className={LINK}>
            what MCP is
          </Link>{' '}
          and the{' '}
          <Link href="/mcp-servers" className={LINK}>
            list of MCP servers
          </Link>
          ; for one server at work inside an editor, see{' '}
          <Link href="/ai-powered-ide" className={LINK}>
            sharing markdown from Cursor and Claude with MCP
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>Should I enter a remote URL or a local command?</h2>
        <p>
          Enter the URL when the server is hosted somewhere. Nothing is installed on your machine, and every client on
          this page documents a native way to reach a Streamable HTTP endpoint. Enter a command when the server is a
          program on your own machine: the client starts it, talks to it over standard input and output (stdio), and
          stops it when the session ends. Headers belong to the first kind and environment variables to the second.
        </p>
        <p>The same URL is not written the same way everywhere. Four clients read the obvious spelling differently:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Cline</strong> needs <code className={CODE}>&quot;type&quot;: &quot;streamableHttp&quot;</code>. Without a type it
            uses the older SSE transport (
            <a href="https://docs.cline.bot/mcp/mcp-overview" className={LINK}>
              Cline docs
            </a>
            ).
          </li>
          <li>
            <strong>Gemini CLI</strong> reads <code className={CODE}>httpUrl</code> as Streamable HTTP and{' '}
            <code className={CODE}>url</code> as SSE (
            <a href="https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md" className={LINK}>
              Gemini CLI docs
            </a>
            ).
          </li>
          <li>
            <strong>Antigravity</strong> wants <code className={CODE}>serverUrl</code> and does not support{' '}
            <code className={CODE}>httpUrl</code> (
            <a href="https://antigravity.google/docs/mcp" className={LINK}>
              Antigravity docs
            </a>
            ).
          </li>
          <li>
            <strong>Claude Code</strong> treats a JSON entry that has a <code className={CODE}>url</code> but no{' '}
            <code className={CODE}>type</code> as a configuration error, because an entry without a type is read as a local
            command (
            <a href="https://code.claude.com/docs/en/mcp" className={LINK}>
              Claude Code docs
            </a>
            ).
          </li>
        </ul>
        <p>
          Claude on the web, Claude Desktop and ChatGPT take a URL only. For Claude the connection comes from
          Anthropic&apos;s servers, not from your machine (
          <a href="https://claude.com/docs/connectors/custom/add-unlisted" className={LINK}>
            Claude docs
          </a>
          ), so the URL has to be reachable from the internet. For a local command, most command-line clients put{' '}
          <code className={CODE}>--</code> between their own options and the command that starts the server; the generator
          places it where each vendor documents it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>Why does a long MCP tool call get cut off?</h2>
        <p>
          Because the client runs a timer on every tool call. When the timer ends the client drops the call and the agent
          sees an error, even if the server would have answered a moment later. A tool that waits on purpose, for another
          agent&apos;s reply or for a job to finish, meets this first. The shortest documented default is 30 seconds,
          several clients use 60, and {UNDOCUMENTED.length} of the {MCP_CLIENTS.length} vendors publish no number.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <caption className="sr-only">Documented limit on one MCP tool call per client, checked {FACTS_CHECKED}</caption>
            <thead>
              <tr>
                <th scope="col" className={TH}>Client</th>
                <th scope="col" className={TH}>Documented limit on one tool call</th>
                <th scope="col" className={TH}>Setting that changes it</th>
              </tr>
            </thead>
            <tbody>
              {BY_TIMEOUT.map((c) => (
                <tr key={c.id}>
                  <th scope="row" className={`${TD} text-left font-medium text-gray-950`}>
                    {c.name}
                  </th>
                  <td className={TD}>
                    <span className="font-medium text-gray-950">{timeoutLabel(c.timeout)}</span>
                    {c.timeout.seconds !== null ? <span className="block text-xs text-gray-600">{c.timeout.summary}</span> : null}
                    {c.timeout.seconds === null && c.timeout.summary !== 'Not documented.' ? (
                      <span className="block text-xs text-gray-600">{c.timeout.summary}</span>
                    ) : null}
                    <a href={c.timeout.sourceUrl ?? c.docUrl} className={`${LINK} text-xs`}>
                      {c.timeout.seconds === null ? 'vendor page checked' : 'source'}
                      <span className="sr-only"> for {c.name}</span>
                    </a>
                  </td>
                  <td className={`${TD} text-xs`}>{c.timeout.setting ?? <span className="text-gray-500">none documented</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          If you control the client, raise the limit where a setting exists: fill in the timeout field above and the
          generator writes it in that client&apos;s unit. If you write the server or the agent&apos;s instructions, do
          not depend on one long call. Have the tool wait a short, fixed time and return, and let the agent call again.
          Waiting in turns of 25 seconds stays under the shortest documented default, the 30 seconds of GitHub Copilot
          CLI.{' '}
          <Link href="/mcp-config-generator/mcp-tool-call-timeout" className={LINK}>
            Why an MCP tool call times out
          </Link>{' '}
          goes through each client and the settings in detail.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>How do I check that the MCP server is connected?</h2>
        <p>
          Look at the client&apos;s own status view first, then ask the agent which tools the server offers. A server can
          be saved in the file and still not be connected: a project server may wait for your approval, and a remote one
          may wait for a sign-in. These are the documented checks:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          {MCP_CLIENTS.filter((c) => c.verify).map((c) => (
            <li key={c.id}>
              <strong>{c.name}:</strong> {c.verify}
            </li>
          ))}
        </ul>
        <p>
          With the default example, a first test that changes nothing is to ask the agent to read a shared document
          through the <code className={CODE}>docs-md</code> server, since reading needs no key.{' '}
          <Link href="/agents/connect" className={LINK}>
            Connect an agent to the Docs MD MCP server
          </Link>{' '}
          continues from there.
        </p>
      </section>

      <ToolGuideLinks tool="mcp-config-generator" />
    </ToolPage>
  );
}
