import Link from 'next/link';
import DiscordColoredText from '@/components/tools/DiscordColoredText';
import SyntaxAnatomy from '@/components/SyntaxAnatomy';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';
import { ANSI_BG, ANSI_FG } from '@/lib/discord/render';

export const metadata = toolMetadata('discord-colored-text-generator');

const LINK = 'text-indigo-700 underline';
const PYDIS = 'https://pythondiscord.com/pages/guides/python-guides/discord-messages-with-colors/';
const MOBILE = 'https://support.discord.com/hc/en-us/community/posts/8128597744919-ANSI-formatting-is-unreadable-on-mobile';

export default function DiscordColoredTextPage() {
  return (
    <ToolPage
      slug="discord-colored-text-generator"
      intro={
        <>
          Discord has no text-colour button, but it colours text inside a code block tagged{' '}
          <code className={CODE}>ansi</code> using terminal colour codes. Build the message part by part below, check the
          preview, and copy it: the button includes the invisible escape characters that make the colours work. Runs in your
          browser.
        </>
      }
      tool={<DiscordColoredText />}
      faq={[
        {
          q: 'How do you write in color on Discord?',
          a: 'Send a code block whose language is ansi. Inside it, put an escape sequence before each piece of text: the escape character, then [, then colour codes separated by semicolons, then m. For example ESC[1;32m makes the following text bold and green. The generator above writes these sequences for you, because the escape character cannot be typed on a normal keyboard.',
        },
        {
          q: 'Does colored text work on Discord mobile?',
          a: 'Not in colour. The Discord mobile apps show the ansi code block and its text but drop the colours, according to reports from users on Discord’s own community forum. The desktop app and the browser show the colours. If most of your server reads on phones, do not rely on colour alone to carry meaning.',
        },
        {
          q: 'Why does my colored text show strange characters like [0;31m?',
          a: 'The escape character was lost, usually because the text was retyped or passed through something that strips control characters. Discord then shows the rest of the sequence as plain text. Copy the message with the generator’s button and paste it straight into Discord, or make sure your bot sends the real character (\\u001b in most programming languages).',
        },
        {
          q: 'Which colours can Discord show in an ansi block?',
          a: 'Eight text colours (codes 30 to 37), eight background colours (40 to 47), plus bold (1) and underline (4), with 0 resetting everything. Discord maps the codes to its own fixed palette, shown in the swatches above, so you cannot pick an arbitrary hex colour. Not every combination is easy to read on Discord’s dark theme.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>How does an ANSI colour code work?</h2>
        <SyntaxAnatomy
          title="One ANSI escape sequence"
          parts={[
            { text: 'ESC[', label: 'escape + bracket', kind: 'marker' },
            { text: '1;32', label: 'bold ; green', kind: 'extra' },
            { text: 'm', label: 'ends the code', kind: 'marker' },
            { text: 'passed', label: 'your text', kind: 'content' },
          ]}
        />
        <p>
          Each sequence changes the style of everything after it until the next sequence. The generator starts every part
          with <code className={CODE}>0</code> (reset) so one part&apos;s colour never leaks into the next, and ends the block
          with a reset. The colour table below matches the palette documented in the{' '}
          <a href={PYDIS} className={LINK} rel="noopener noreferrer">
            Python Discord guide to coloured messages
          </a>
          .
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: 'Text colours', p: ANSI_FG },
            { title: 'Background colours', p: ANSI_BG },
          ].map(({ title, p }) => (
            <div key={title} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-950">{title}</div>
              <ul className="divide-y divide-gray-100 text-sm">
                {Object.entries(p).map(([code, c]) => (
                  <li key={code} className="flex items-center gap-3 px-4 py-2">
                    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                      <rect x="0.5" y="0.5" width="17" height="17" rx="4" fill={c.hex} stroke="#d1d5db" />
                    </svg>
                    <span className="w-8 font-mono text-gray-900">{code}</span>
                    <span className="text-gray-700">{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>What are the limits of coloured text on Discord?</h2>
        <p>
          The colours exist only inside a code block, so the text is monospaced and other formatting such as bold with
          asterisks, links and mentions does not apply there. The mobile apps show the block without colours (see this{' '}
          <a href={MOBILE} className={LINK} rel="noopener noreferrer">
            thread on Discord&apos;s community forum
          </a>
          ). For ordinary emphasis, Discord&apos;s regular{' '}
          <Link href="/discord-markdown" className={LINK}>
            markdown formatting
          </Link>{' '}
          works everywhere and needs no special characters.
        </p>
      </section>
    </ToolPage>
  );
}
