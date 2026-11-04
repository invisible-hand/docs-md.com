import Link from 'next/link';
import DiscordMessage from '@/components/discord/DiscordMessage';
import DiscordTimestamp from '@/components/tools/DiscordTimestamp';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';
import SyntaxAnatomy from '@/components/SyntaxAnatomy';

export const metadata = toolMetadata('discord-timestamp-generator');

const DOCS = 'https://docs.discord.com/developers/reference';
const LINK = 'text-indigo-700 underline';

const STYLES: Array<[string, string, string]> = [
  ['t', 'Short time', '16:20'],
  ['T', 'Medium time', '16:20:30'],
  ['d', 'Short date', '20/04/2021'],
  ['D', 'Long date', 'April 20, 2021'],
  ['f', 'Long date, short time (default)', 'April 20, 2021 at 16:20'],
  ['F', 'Full date, short time', 'Tuesday, April 20, 2021 at 16:20'],
  ['s', 'Short date, short time', '20/04/2021, 16:20'],
  ['S', 'Short date, medium time', '20/04/2021, 16:20:30'],
  ['R', 'Relative time', '4 years ago'],
];

export default function DiscordTimestampGeneratorPage() {
  return (
    <ToolPage
      slug="discord-timestamp-generator"
      intro={
        <>
          A Discord timestamp is a code like <code className={CODE}>{'<t:1767225600:F>'}</code> that Discord turns into a date
          shown in each reader&apos;s own time zone and language. Pick a date, time and time zone below and copy any of the nine
          styles Discord supports. Runs in your browser.
        </>
      }
      tool={<DiscordTimestamp />}
      faq={[
        {
          q: 'How do Discord timestamps work?',
          a: 'You send <t:UNIX:STYLE>, where UNIX is the number of seconds since 1 January 1970 UTC and STYLE is one letter. Discord replaces the code with a date formatted for each reader: someone in Tokyo and someone in New York see the same moment in their own local time. Without a style letter, Discord uses f (long date, short time).',
        },
        {
          q: 'How do I find the Unix timestamp for a date?',
          a: 'Pick the date, time and time zone in the generator above; the Unix field updates as you go, and every code in the table already contains it. Paste an existing <t:…> code or a plain Unix number into the decoder to go the other way and see which moment it stands for.',
        },
        {
          q: 'Do Discord timestamps work in embeds and bot messages?',
          a: 'Yes. Discord’s developer reference lists timestamps under message formatting, so a bot can send the same <t:UNIX:STYLE> code in message content or an embed description, and each reader sees it in their own time zone. A timestamp in a username or a channel name is not formatted.',
        },
        {
          q: 'Why does the relative timestamp say “in 2 hours” for me but something else for a friend?',
          a: 'The R style counts from the moment each reader looks at the message, and Discord keeps it current while the message is on screen. Two people looking at different times, or with clocks set differently, can see different wording for the same event, but it always points at the same instant.',
        },
        {
          q: 'Which timestamp style should I use for an event announcement?',
          a: 'F (full date with weekday) is the clearest single choice for an event, because readers see the weekday as well as the date. Many servers pair it with R, for example “Starts <t:…:F> (<t:…:R>)”, so readers see both the date and how far away it is.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>What does a Discord timestamp look like?</h2>
        <SyntaxAnatomy
          title="Discord timestamp syntax"
          parts={[
            { text: '<t:', label: 'opens the timestamp', kind: 'marker' },
            { text: '1767225600', label: 'Unix seconds (UTC)', kind: 'content' },
            { text: ':F', label: 'style letter (optional)', kind: 'extra' },
            { text: '>', label: 'closes it', kind: 'marker' },
          ]}
        />
        <p>Typed into a message, the code becomes a highlighted date. This is roughly how it looks to a reader:</p>
        <DiscordMessage source={'Game night starts <t:1767225600:F> (<t:1767225600:R>)'} />
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Which timestamp styles does Discord support?</h2>
        <p>
          Nine, as listed in Discord&apos;s{' '}
          <a href={DOCS} className={LINK} rel="noopener noreferrer">
            developer reference
          </a>{' '}
          (examples there use a 24-hour English locale; readers see their own format):
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-2.5 font-semibold text-gray-950">Style</th>
                <th className="px-4 py-2.5 font-semibold text-gray-950">Name</th>
                <th className="px-4 py-2.5 font-semibold text-gray-950">Example output</th>
              </tr>
            </thead>
            <tbody>
              {STYLES.map(([s, n, e]) => (
                <tr key={s} className="border-b border-gray-100">
                  <td className="px-4 py-2.5 font-mono text-gray-900">{s}</td>
                  <td className="px-4 py-2.5 text-gray-700">{n}</td>
                  <td className="px-4 py-2.5 text-gray-700">{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Why is my Discord timestamp showing as plain text?</h2>
        <p>
          Check the format character by character: angle brackets, a lowercase <code className={CODE}>t</code>, colons, and a
          number of <em>seconds</em>. A millisecond value (13 digits, as JavaScript&apos;s <code className={CODE}>Date.now()</code>{' '}
          returns) points thousands of years ahead, so divide it by 1,000. An unknown style letter, a space inside the brackets,
          or a code inside a code block also stops it rendering. Everything else about Discord formatting is on the{' '}
          <Link href="/discord-markdown" className={LINK}>
            Discord markdown cheat sheet
          </Link>
          .
        </p>
      </section>
    </ToolPage>
  );
}
