import MermaidExamplesView from '@/components/MermaidExamplesView';
import { getMermaidPage } from '@/lib/mermaid-examples';
import { pageMetadata } from '@/lib/page-metadata';

const PAGE = getMermaidPage('mermaid-bar-chart-examples');

export const metadata = pageMetadata({ title: PAGE.title, description: PAGE.description, path: `/${PAGE.slug}`, type: 'article', kicker: 'Mermaid examples' });

export default function Page() {
  return <MermaidExamplesView page={PAGE} />;
}
