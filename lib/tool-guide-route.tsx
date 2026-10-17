import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolGuidePage from '@/components/ToolGuidePage';
import { pageMetadata } from '@/lib/page-metadata';
import { getToolGuide, toolGuidesFor } from '@/lib/tool-guides';
import { getTool } from '@/lib/tools-registry';

type Props = { params: Promise<{ question: string }> };

/**
 * Everything app/<tool>/[question]/page.tsx needs. Next.js reads route segment
 * config statically, so each page file still declares `dynamicParams = false`
 * itself; the factory supplies the params, metadata and the page component.
 */
export function makeToolGuideRoute(tool: string) {
  getTool(tool); // fail the build early on a typo

  function generateStaticParams() {
    return toolGuidesFor(tool).map((g) => ({ question: g.slug }));
  }

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { question } = await params;
    try {
      const guide = getToolGuide(tool, question);
      return pageMetadata({
        title: guide.title,
        description: guide.description,
        path: guide.path,
        type: 'article',
        kicker: getTool(tool).name,
      });
    } catch {
      return {};
    }
  }

  async function Page({ params }: Props) {
    const { question } = await params;
    let guide;
    try {
      guide = getToolGuide(tool, question);
    } catch {
      notFound();
    }
    return <ToolGuidePage guide={guide} />;
  }

  return { dynamicParams: false as const, generateStaticParams, generateMetadata, default: Page };
}
