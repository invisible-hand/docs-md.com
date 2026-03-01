import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Use Cases',
  description:
    'Explore practical use cases for Docs MD across engineering, AI operations, support, and product teams.',
};

const useCases = [
  {
    title: 'Engineering design reviews',
    body: 'Share RFC drafts and architecture notes with links that can expire after sign-off.',
  },
  {
    title: 'Incident response summaries',
    body: 'Publish postmortems quickly with syntax-highlighted logs and command snippets.',
  },
  {
    title: 'AI-generated deliverables',
    body: 'Convert assistant output into a clean URL for stakeholders without exposing full IDE context.',
  },
  {
    title: 'Async product collaboration',
    body: 'Share launch docs and project briefs between design, product, and engineering.',
  },
];

export default function UseCasesPage() {
  return (
    <ContentPage
      title="Use cases for Docs MD"
      description="From technical reviews to AI-generated briefs, Docs MD is designed for fast, readable document sharing."
    >
      <section className="grid gap-4 sm:grid-cols-2">
        {useCases.map((useCase) => (
          <article key={useCase.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-lg font-semibold text-gray-950">{useCase.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{useCase.body}</p>
          </article>
        ))}
      </section>
    </ContentPage>
  );
}
