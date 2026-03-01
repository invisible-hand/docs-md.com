import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'AI-powered IDE Guide',
  description:
    'How AI-powered IDE workflows benefit from fast markdown sharing and MCP-based tool integrations.',
};

export default function AiPoweredIdePage() {
  return (
    <ContentPage
      title="AI-powered IDE workflows"
      description="A practical guide to pairing AI coding assistants with lightweight markdown publishing."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Why this matters</h2>
        <p>
          AI assistants generate plans, architecture notes, and runbooks quickly. The bottleneck is
          usually distribution. Docs MD turns those artifacts into share links in seconds.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Typical workflow</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Generate or refine markdown in your IDE.</li>
          <li>Call the Docs MD MCP tool from your assistant.</li>
          <li>Share an expiring URL in Slack, Linear, or PR comments.</li>
          <li>Update and re-share as the work evolves.</li>
        </ol>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Best practices</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Keep documents scoped to one decision or rollout.</li>
          <li>Use code fences and headings for machine + human readability.</li>
          <li>Expire links by default for safer ephemeral communication.</li>
        </ul>
      </section>
    </ContentPage>
  );
}
