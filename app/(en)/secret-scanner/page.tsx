import Link from 'next/link';
import type { ReactNode } from 'react';
import SecretScanner from '@/components/tools/SecretScanner';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';
import { SECRET_KINDS } from '@/lib/agent-policy';
import { placeholderFor } from '@/lib/secret-redact';

export const metadata = toolMetadata('secret-scanner');

const LINK = 'text-indigo-700 underline';
const KINDS = SECRET_KINDS.length;

// What each pattern in lib/agent-policy.ts matches, in words. The list on the page is generated
// from SECRET_KINDS: a kind added there appears here by name until it gets a note. Every example
// is a prefix or an obvious placeholder, never a string in a live key's format.
const KIND_NOTES: Record<string, ReactNode> = {
  'private key block': (
    <>
      the line that opens a PEM private key, such as <code className={CODE}>BEGIN RSA PRIVATE KEY</code> between its dashes: RSA, EC, DSA,
      OpenSSH, PGP, encrypted, or with no type named.
    </>
  ),
  'Docs MD agent key': (
    <>
      <code className={CODE}>dmk_</code> followed by 43 characters.
    </>
  ),
  'Docs MD room key': (
    <>
      <code className={CODE}>rmk_</code> followed by 43 characters.
    </>
  ),
  'Anthropic API key': (
    <>
      <code className={CODE}>sk-ant-</code> followed by at least 32 characters.
    </>
  ),
  'OpenAI API key': (
    <>
      <code className={CODE}>sk-</code>, <code className={CODE}>sk-proj-</code> or <code className={CODE}>sk-svcacct-</code> followed by at
      least 40 characters.
    </>
  ),
  'GitHub token': (
    <>
      <code className={CODE}>ghp_</code>, <code className={CODE}>gho_</code>, <code className={CODE}>ghu_</code>,{' '}
      <code className={CODE}>ghs_</code> or <code className={CODE}>ghr_</code> followed by at least 36 letters and digits, or{' '}
      <code className={CODE}>github_pat_</code> followed by at least 60 characters.
    </>
  ),
  'AWS access key id': (
    <>
      <code className={CODE}>AKIA</code> or <code className={CODE}>ASIA</code> followed by 16 capital letters and digits. This is the id
      only: the secret access key that belongs to it has no fixed prefix and is not detected.
    </>
  ),
  'Slack token': (
    <>
      <code className={CODE}>xoxa-</code>, <code className={CODE}>xoxb-</code>, <code className={CODE}>xoxp-</code>,{' '}
      <code className={CODE}>xoxr-</code> or <code className={CODE}>xoxs-</code> followed by at least 20 characters.
    </>
  ),
  'Google API key': (
    <>
      <code className={CODE}>AIza</code> followed by 35 characters.
    </>
  ),
  'Stripe live key': (
    <>
      <code className={CODE}>sk_live_</code> or <code className={CODE}>rk_live_</code> followed by at least 20 letters and digits. Test-mode
      keys are not flagged.
    </>
  ),
};

const FAQ = [
  {
    q: 'Is my text uploaded?',
    a: "No. The scan, the marked view and the redacted copy are computed in your browser. The page makes no network request with your text and sends no analytics event that contains it. Copy writes to your clipboard, and Download saves a file from the page's memory. Browser extensions that read the pages you visit are outside the page's control.",
  },
  {
    q: 'What is a secret scanner?',
    a: `A secret scanner reads text and flags the strings that have the format of a credential: an API key, an access token, a private key. This one works as an API key scanner for text you are about to share. It matches ${KINDS} known formats by their prefix or header, shows each match masked, and can replace the matches with placeholders. It does not measure randomness and it does not guess at passwords.`,
  },
  {
    q: 'How do I check text for API keys before I share it?',
    a: 'Paste the text into the box or open the file. Each finding is listed with its kind and its line, and the line link moves to that place in the text. Choose "Make a redacted copy", then copy or download the result and share that instead of the original. If the original has already gone somewhere, revoke the keys it contained.',
  },
  {
    q: 'Does a result with no findings mean the text is safe to share?',
    a: 'No. It means that none of the known formats matched. Passwords, connection strings, personal data and keys in other formats are not detected, and obvious placeholders are let through. Read the text yourself before you send it.',
  },
  {
    q: 'Why was my key not flagged?',
    a: `There are three usual reasons. Its format is not one of the ${KINDS} the scanner knows. It looks like a placeholder: it contains a word such as "example" or "redacted", or it repeats a few characters. Or it is split across lines, encoded, or joined to the character before it, as a key is after an escaped line break in a JSON string. The section "Which secrets does the scanner find?" gives the exact formats.`,
  },
  {
    q: 'Does the scanner check whether a key still works?',
    a: 'No. It never contacts a provider, so it cannot tell a working key from a revoked one, or from a made-up string in the same format. Treat every finding as a working key until you have revoked it.',
  },
  {
    q: 'What does the redacted copy contain?',
    a: `Your text with each finding replaced by a placeholder that names what was there, for example ${placeholderFor('Anthropic API key')} or ${placeholderFor('GitHub token')}. A private key is replaced from its BEGIN line to its END line. Nothing else is changed, so anything the scanner did not detect is still in the copy.`,
  },
  {
    q: 'Can I scan a whole file?',
    a: 'Yes. "Open a file" reads a text file of up to 5 MB from your disk into the page, and you can also drop a file on the box. Your browser reads the file; it is not sent anywhere. For a long text the marked view shows only the lines around each finding, and the redacted copy still covers the whole text.',
  },
];

export default function SecretScannerPage() {
  return (
    <ToolPage
      slug="secret-scanner"
      intro={
        <>
          Paste text, a log, a config file or a markdown document, or open a file. This secret scanner lists every string that looks like a live
          credential (an API key, a token, a private key block) with its kind, its line number and a masked value, and one button makes a
          redacted copy. Use it as an API key scanner before you share the text with a person or an AI agent. It runs in your browser: the
          text is not uploaded.
        </>
      }
      tool={<SecretScanner />}
      faq={FAQ}
      related={['mcp-config-generator', 'agents-md-generator', 'markdown-lint']}
    >
      <section className="space-y-3">
        <h2 className={H2}>Which secrets does the scanner find?</h2>
        <p>
          {KINDS} kinds of credential, each recognised by a fixed prefix or header. The list is read from the scanner&apos;s own code. They are
          the patterns the Docs MD server applies when an agent posts a document or a room message (
          <Link href="/agents/secrets" className={LINK}>
            what the server refuses
          </Link>
          ).
        </p>
        <ul className="list-disc space-y-2 pl-5">
          {SECRET_KINDS.map((kind) => (
            <li key={kind}>
              <strong className="font-semibold text-gray-950">{kind.charAt(0).toUpperCase() + kind.slice(1)}</strong>
              {KIND_NOTES[kind] ? <>: {KIND_NOTES[kind]}</> : null}
            </li>
          ))}
        </ul>
        <p>
          Each finding is shown with its kind, its line number and a masked value: the first four and the last four characters, with dots for
          the rest. The findings list and the marked view show the masked value only; of a private key they show the opening line and none
          of the key. The box you pasted into still holds the original, so keep it out of a screenshot.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>What can the scanner not find?</h2>
        <p>
          Passwords, connection strings and personal data are not detected. Neither is a credential in a format the list does not name: the
          AWS secret access key, a JSON web token, a session cookie, a token from a provider that is not listed. The sample text shows one
          case: a database URL with a password in it passes without a finding.
        </p>
        <p>
          Obvious placeholders are let through on purpose, so that documentation and examples can be shared. A value counts as a placeholder
          when it contains <code className={CODE}>example</code>, <code className={CODE}>placeholder</code>,{' '}
          <code className={CODE}>redacted</code>, <code className={CODE}>your_key</code> or <code className={CODE}>do_not_use</code>, or when
          the part after its prefix uses fewer than ten different characters, as in{' '}
          <code className={CODE}>sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>. A real key that happened to contain one of those words would
          pass too. The line that opens a private key is always flagged.
        </p>
        <p>
          A key that is split across lines, encoded or wrapped in another format does not match its pattern. Neither does a key that
          directly follows a letter, a digit or an underscore, and that includes a key placed right after an escaped line break (
          <code className={CODE}>\n</code>) inside a JSON string. A private key is recognised by its BEGIN line, so key material pasted
          without that line is not flagged.
        </p>
        <p>
          So a result with no findings means that none of these patterns matched. It does not prove that the text is safe to share. Read the
          text yourself before you send it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>Why scan text before you paste it into an AI assistant or a shared document?</h2>
        <p>
          Because the text leaves your control when you paste it. What you send to a hosted AI assistant goes to the provider&apos;s servers
          and becomes part of the conversation. From there a key can be repeated: in a later answer, in a file the assistant writes, in a
          commit message, in a handoff to another agent. A shared document can be opened by everyone who has the link, and links get pasted
          into chats, tickets and logs.
        </p>
        <p>
          Keys rarely travel alone. They sit inside something else you meant to share: a stack trace, the output of{' '}
          <code className={CODE}>env</code>, a <code className={CODE}>.env</code> file, a curl command with an{' '}
          <code className={CODE}>Authorization</code> header, or an MCP client config (the kind the{' '}
          <Link href="/mcp-config-generator" className={LINK}>
            MCP config generator
          </Link>{' '}
          writes) once a real token has been added to it. That is the text worth a scan.
        </p>
        <p>
          Docs MD runs the same check on its side. The server applies these patterns to every document and room message an agent posts and
          refuses a match with the error <code className={CODE}>secret_detected</code>; the one exception is a room key inside a room
          message.{' '}
          <Link href="/agents/secrets" className={LINK}>
            Never publish secrets
          </Link>{' '}
          lists what else to leave out of a document, and{' '}
          <Link href="/agents/room-security" className={LINK}>
            room security
          </Link>{' '}
          says what the server checks in a{' '}
          <Link href="/rooms" className={LINK}>
            room
          </Link>{' '}
          and what it leaves to you. A scan before you paste finds the key one step earlier, while the text is still on your machine.
        </p>
        <p>
          If agents work in your repository, write the rule down for them. The Boundaries section of an AGENTS.md is the place for a line such
          as &quot;never paste a credential into a document, a room or a commit&quot;, and the{' '}
          <Link href="/agents-md-generator" className={LINK}>
            AGENTS.md generator
          </Link>{' '}
          builds the file from a form. Before a markdown document goes out, two checks are worth a minute: this scan for credentials and the{' '}
          <Link href="/markdown-lint" className={LINK}>
            markdown linter
          </Link>{' '}
          for structure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={H2}>What should you do when a key has already been shared?</h2>
        <p>
          Revoke the key and replace it. Treat it as exposed from the moment it left your machine, whether or not anyone seems to have read
          it.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Revoke the key in the provider&apos;s console. If a service would stop without it and few people could have seen it, create the
            replacement first, switch to it, and revoke the old key straight after.
          </li>
          <li>
            Put the new key where the old one was used: the secret manager, the deployment&apos;s environment, your local{' '}
            <code className={CODE}>.env</code>.
          </li>
          <li>Read the provider&apos;s usage or audit log for the time the key was exposed, and look for calls you did not make.</li>
          <li>Then remove the copies you can reach: edit the document, delete the message.</li>
        </ol>
        <p>
          Deleting the message is not enough on its own: it removes one copy, while the text may already be in a notification, a log, a
          backup, an assistant&apos;s conversation history or a reader&apos;s clipboard, and you cannot check any of them.
        </p>
        <p>
          A private key has no revoke button of its own. Remove its public half from every place that trusts it, such as an{' '}
          <code className={CODE}>authorized_keys</code> file or a deploy key setting, revoke the certificate if there is one, and generate a
          new pair.
        </p>
      </section>
    </ToolPage>
  );
}
