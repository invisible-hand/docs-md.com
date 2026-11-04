import Link from 'next/link';
import HandoffGenerator from '@/components/tools/HandoffGenerator';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('handoff-generator');

const LINK = 'text-indigo-700 underline';
const TH = 'border-b border-gray-200 px-3 py-2 text-left font-semibold text-gray-900';
const TD = 'border-b border-gray-100 px-3 py-2 align-top';

const SECTIONS: { section: string; write: string; why: string }[] = [
  {
    section: 'Goal',
    write: 'One sentence that defines "done" and names what must not change.',
    why: 'Every later judgment ("is this step worth doing?") is made against this line. Without it an agent optimizes for the wrong thing.',
  },
  {
    section: 'Repo and branch',
    write: 'owner/name and the branch the work lives on; the base branch if it is not main.',
    why: 'An agent cannot guess which checkout the rest of the document describes.',
  },
  {
    section: 'Current state',
    write: 'Three lists: done, in progress, blocked. Facts, not intentions.',
    why: 'Prevents redoing finished work and flags the half-finished edit that will otherwise look like a bug.',
  },
  {
    section: 'How to run and test',
    write: 'The exact commands, one per line, in a code block.',
    why: 'Commands are the fastest way for an agent to verify the state before trusting the prose.',
  },
  {
    section: 'Key files',
    write: 'Path and one line on what it does, as a table.',
    why: 'Turns "explore the repo" (slow, expensive in context) into "read these four files".',
  },
  {
    section: 'Decisions and why',
    write: 'Each choice with its reason, as a table.',
    why: 'The reason is what stops the next person from reversing a decision that was made for a cause they cannot see.',
  },
  {
    section: 'Open questions',
    write: 'Things nobody has decided yet.',
    why: 'Marks where the agent should ask instead of assume.',
  },
  {
    section: 'Next steps',
    write: 'A numbered list, first thing first.',
    why: 'An ordered list is executable; a paragraph of suggestions is not.',
  },
  {
    section: 'Constraints and gotchas',
    write: 'Limits, known-bad paths, pre-existing warnings to ignore.',
    why: 'Saves the hour that would be spent "fixing" something that is unrelated or intentional.',
  },
  {
    section: 'Owners and links',
    write: 'Who to ask, and the ticket, design doc, PR.',
    why: 'Gives the reader an escalation path and the source documents behind the summary.',
  },
  {
    section: 'For an AI agent (optional)',
    write: 'Context budget, do-not-touch paths, verification commands.',
    why: 'Agents follow explicit limits well and implicit ones badly; stating them costs three lines.',
  },
];

export default function HandoffGeneratorPage() {
  return (
    <ToolPage
      slug="handoff-generator"
      intro="Fill in the form and a complete HANDOFF.md builds itself in the preview: goal, current state, how to run and test, key files, decisions with their reasons, open questions, ordered next steps, constraints, owners, and links. Tick the option to add a preamble written for an AI coding agent. Copy it, download it, or publish it as a link the next person or agent can fetch. Everything runs in your browser; the draft autosaves locally."
      tool={<HandoffGenerator />}
      related={['readme-generator', 'changelog-generator', 'front-matter-generator', 'markdown-toc-generator', 'markdown-formatter']}
      faq={[
        {
          q: 'What is a HANDOFF.md file?',
          a: 'HANDOFF.md is a markdown file written at the end of a work session that records the goal, what is done, what is in progress or blocked, how to run and test the code, which files matter, which decisions were made and why, and the ordered next steps. It is read by the next developer or AI coding agent so they can continue without reconstructing the context. The name is a convention, not a standard; agent-handoff.md and HANDOVER.md are the same thing.',
        },
        {
          q: 'How is a handoff different from a README?',
          a: 'A README describes a project for anyone, at any time: what it is, how to install and use it. A handoff describes one piece of work, right now, for one reader: where it stands and what to do next. A README is stable; a handoff is rewritten every time work stops. Generate the README with the README generator and keep the handoff next to it, or in the pull request description.',
        },
        {
          q: 'What should the "for an AI agent" preamble say?',
          a: 'Three things an agent cannot infer: how much to read (the context budget: "this file plus the key files, do not scan the repo"), what not to modify (paths with a reason), and how to verify state before and after changes (the exact commands). The generator writes these as the first section so the agent sees them before it acts. It also tells the agent to compare the branch head with the handoff and treat the document as a starting point if they differ.',
        },
        {
          q: 'Is anything uploaded while I type?',
          a: 'No. The markdown is assembled in your browser and the draft is saved to this browser\'s localStorage so a reload does not lose it. The only network request happens if you click Share as link, which publishes the markdown to a URL that expires in 30 days and returns a raw text URL an agent can fetch. Do not share a handoff that contains tokens, keys, or customer data; the link is readable by anyone who has it.',
        },
        {
          q: 'How long should a handoff be?',
          a: 'Long enough that the reader does not have to ask you anything, short enough to read in two minutes: usually 40 to 120 lines. Empty sections are omitted automatically, so a small task produces a small file. If the next steps list is longer than ten items, the task is probably two tasks and deserves two handoffs.',
        },
      ]}
    >
      <section className="space-y-4">
        <h2 className={H2}>What does a good handoff document contain?</h2>
        <p>
          The generator emits the sections below in this order. The third column is the reason the section exists from the
          reader&apos;s side, which is also the test for whether yours is good enough: if an agent given only the file
          would still have to ask, the section is too thin.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className={TH}>Section</th>
                <th className={TH}>What to write</th>
                <th className={TH}>Why the next agent needs it</th>
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map((s) => (
                <tr key={s.section}>
                  <td className={`${TD} whitespace-nowrap font-medium text-gray-900`}>{s.section}</td>
                  <td className={TD}>{s.write}</td>
                  <td className={TD}>{s.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>Minimal or full template: which one do I need?</h2>
        <p>
          A handoff for a one-hour fix and a handoff for a week of feature work are not the same document. Fill in only
          the fields you need; the generator drops empty sections.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className={TH}>&nbsp;</th>
                <th className={TH}>Minimal (same-day, one reader)</th>
                <th className={TH}>Full (multi-day, agent or new teammate)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${TD} font-medium text-gray-900`}>Sections</td>
                <td className={TD}>Goal, Current state, Next steps</td>
                <td className={TD}>All eleven, including the AI-agent preamble and status table</td>
              </tr>
              <tr>
                <td className={`${TD} font-medium text-gray-900`}>Length</td>
                <td className={TD}>10–25 lines</td>
                <td className={TD}>60–120 lines</td>
              </tr>
              <tr>
                <td className={`${TD} font-medium text-gray-900`}>Commands</td>
                <td className={TD}>Only if they differ from the README</td>
                <td className={TD}>Run, test, and verification commands, each in its own code block</td>
              </tr>
              <tr>
                <td className={`${TD} font-medium text-gray-900`}>Key files</td>
                <td className={TD}>Skip, or list the one or two you touched</td>
                <td className={TD}>Table of every file the next step needs, with a one-line purpose</td>
              </tr>
              <tr>
                <td className={`${TD} font-medium text-gray-900`}>Decisions</td>
                <td className={TD}>Bullets, no reasons</td>
                <td className={TD}>Decision and reason as a table, so reversals are deliberate</td>
              </tr>
              <tr>
                <td className={`${TD} font-medium text-gray-900`}>Where it lives</td>
                <td className={TD}>Pull request description or a chat message</td>
                <td className={TD}>
                  <code className={CODE}>HANDOFF.md</code> in the repo root, or a shared link pasted into the next session
                </td>
              </tr>
              <tr>
                <td className={`${TD} font-medium text-gray-900`}>Timestamps</td>
                <td className={TD}>Optional</td>
                <td className={TD}>Yes, so a stale handoff can be spotted against the git log</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={H2}>How do I hand the file to the next agent?</h2>
        <p>
          Three ways, in increasing order of ceremony. Commit <code className={CODE}>HANDOFF.md</code> to the branch and
          start the next session with &quot;read HANDOFF.md and continue from its next steps&quot;. Or paste the
          markdown into the first message of the new session. Or click <em>Share as link</em> and give the agent the
          raw URL, which returns the file as <code className={CODE}>text/markdown</code> for any assistant with an HTTP
          tool. The{' '}
          <Link href="/agent-handoff-document" className={LINK}>
            HANDOFF.md walkthrough
          </Link>{' '}
          covers the MCP and curl variants, and{' '}
          <Link href="/share-implementation-plan" className={LINK}>
            sharing an implementation plan
          </Link>{' '}
          covers the review step that often precedes a handoff. For the markdown syntax used in the output, see the{' '}
          <Link href="/markdown-cheat-sheet" className={LINK}>
            markdown cheat sheet
          </Link>
          ; for the project-level document that sits next to the handoff, use the{' '}
          <Link href="/readme-generator" className={LINK}>
            README generator
          </Link>
          .
        </p>
      </section>
    </ToolPage>
  );
}
