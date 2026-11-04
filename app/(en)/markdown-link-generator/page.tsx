import Link from 'next/link';
import LinkGenerator from '@/components/tools/LinkGenerator';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-link-generator');

export default function LinkGeneratorPage() {
  return (
    <ToolPage
      slug="markdown-link-generator"
      intro="The three snippets people most often get slightly wrong — links, images, and fenced code blocks — generated correctly from a form, with a live preview. It handles the edge cases for you: tooltip titles, reference-style links, sized images (which need HTML), clickable images, and code that itself contains backtick fences."
      tool={<LinkGenerator />}
      related={['markdown-table-generator', 'markdown-toc-generator', 'markdown-badge-generator', 'markdown-cheat-sheet']}
      faq={[
        {
          q: 'How do I add a tooltip to a markdown link?',
          a: 'Put the title in quotes after the URL: [text](https://example.com "Shown on hover"). The title is optional and most renderers show it as a browser tooltip; GitHub does, chat apps generally do not.',
        },
        {
          q: 'How do I resize an image in markdown?',
          a: 'Markdown has no size syntax, so the generator switches to an HTML tag when you enter a width: <img src="…" alt="…" width="400">. That works on GitHub and in most documentation sites; renderers that strip HTML show the image at full size.',
        },
        {
          q: 'How do I make an image clickable?',
          a: 'Wrap the image in a link: [![alt text](image.png)](https://example.com). The outer brackets are the link, the inner ![…](…) is the image. Fill in the target field in the image tab and the generator produces exactly that.',
        },
        {
          q: 'How do I put backticks inside a code block?',
          a: 'Open and close the block with four backticks instead of three (or use ~~~). The generator checks your code for a triple-backtick fence and lengthens the outer fence automatically.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>The syntax being generated</h2>
        <p>
          Links are <code className={CODE}>[text](url &quot;title&quot;)</code> — no space
          between the brackets and parenthesis. Images are the same with a leading{' '}
          <code className={CODE}>!</code>, and sizing requires switching to an HTML{' '}
          <code className={CODE}>&lt;img width&gt;</code> tag. Code blocks are fenced with
          three backticks plus a language tag — or four backticks when the code contains a fence.
          Full details in the guides:{' '}
          <Link href="/guides/markdown-link" className="text-indigo-700 underline">links</Link>,{' '}
          <Link href="/guides/markdown-image" className="text-indigo-700 underline">images</Link>,{' '}
          <Link href="/guides/markdown-code-block" className="text-indigo-700 underline">code blocks</Link>.
          When the document is done, <Link href="/" className="text-indigo-700 underline">share it as a link</Link>.
        </p>
      </section>
    </ToolPage>
  );
}
