import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'About Docs MD',
  description:
    'Learn what Docs MD is, why it exists, and how it helps developers share markdown in AI-native workflows.',
};

export default function AboutPage() {
  return (
    <ContentPage
      title="About Docs MD"
      description="Docs MD is a focused markdown sharing product for modern developer and AI-assisted workflows."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Why we built it</h2>
        <p>
          Most markdown sharing tools are either too heavy for quick collaboration or too limited
          for technical content. Docs MD keeps one goal: make sharing readable markdown instant,
          beautiful, and safe by default.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">What you get</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Fast link creation with memorable share IDs.</li>
          <li>Automatic 30-day expiration to reduce stale content risk.</li>
          <li>High-fidelity markdown rendering with code highlighting.</li>
          <li>MCP support to share directly from AI-powered IDEs.</li>
        </ul>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Continue reading</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/what-is-mcp" className="rounded-full border border-gray-300 px-4 py-2 hover:border-indigo-300 hover:text-indigo-700">
            What is MCP
          </Link>
          <Link href="/ai-powered-ide" className="rounded-full border border-gray-300 px-4 py-2 hover:border-indigo-300 hover:text-indigo-700">
            AI-powered IDE guide
          </Link>
          <Link href="/use-cases" className="rounded-full border border-gray-300 px-4 py-2 hover:border-indigo-300 hover:text-indigo-700">
            Use cases
          </Link>
        </div>
      </section>
    </ContentPage>
  );
}
