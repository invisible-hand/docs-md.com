import MermaidExamplesView from '@/components/MermaidExamplesView';
import { getMermaidPage } from '@/lib/mermaid-examples';
import { pageMetadata } from '@/lib/page-metadata';

const PAGE = getMermaidPage('mermaid-gantt-chart-examples');

// The today-marker example is dated around the render date; re-render monthly so its line stays in view.
export const revalidate = 2592000;

export const metadata = pageMetadata({ title: PAGE.title, description: PAGE.description, path: `/${PAGE.slug}`, type: 'article', kicker: 'Mermaid examples' });

export default function Page() {
  return <MermaidExamplesView page={PAGE} />;
}
