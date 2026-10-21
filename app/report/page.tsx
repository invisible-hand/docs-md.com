import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import ReportForm from '@/components/ReportForm';
import { LegalMeta, LegalSection, legalLinkClass } from '@/components/LegalSection';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'Report Content',
  description:
    'Report a share on Docs MD that breaks the rules, send a copyright (DMCA) notice, or ask for your personal data to be removed.',
  path: '/report',
});

interface ReportPageProps {
  searchParams: Promise<{ share?: string | string[] }>;
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const { share } = await searchParams;
  const initialShare = typeof share === 'string' && /^[a-z]+-[a-z]+-[A-Za-z0-9]{5}$/.test(share) ? `https://docs-md.com/${share}` : '';

  return (
    <ContentPage
      title="Report content"
      description="Tell us about a share that is illegal, harmful, infringes your rights or exposes your personal data. We review every report."
    >
      <LegalMeta current="/report" />

      <ReportForm initialShare={initialShare} />

      <LegalSection title="How we handle reports">
        <p>
          This form is the only contact channel for Docs MD, for reports and for any other question. Reports about child
          sexual abuse material and intimate images shared without consent are handled first. Leave an email address if
          you want a reply.
        </p>
      </LegalSection>

      <section id="copyright" className="space-y-3 leading-relaxed">
        <h2 className="text-xl font-semibold text-gray-950">Copyright notices (DMCA)</h2>
        <p>
          To ask us to remove material that infringes your copyright, send the form above with the reason
          &quot;Copyright or trademark infringement&quot; and put the following in the details:
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>The copyrighted work you believe is infringed.</li>
          <li>The link to each share that contains the material.</li>
          <li>Your name, postal address, phone number and email address.</li>
          <li>
            A statement that you believe in good faith that the use is not authorised by the copyright owner, its agent
            or the law.
          </li>
          <li>
            A statement that the information in your notice is accurate and, under penalty of perjury, that you are the
            owner or are authorised to act for the owner.
          </li>
          <li>Your physical or electronic signature.</li>
        </ol>
        <p>
          If your share was removed after a notice and you believe that was a mistake, you can send a counter-notice
          through the same form. Include the removed link, your contact details, a statement under penalty of perjury that you
          believe the material was removed by mistake, and your consent to the jurisdiction of the relevant court. We
          remove content from people who repeatedly infringe.
        </p>
      </section>

      <LegalSection title="Removing your personal data">
        <p>
          If a share exposes your personal data, report it with the reason &quot;My personal data, payment card data or
          passwords&quot;. You do not need to be its author. See the{' '}
          <Link href="/privacy" className={legalLinkClass}>Privacy Policy</Link> for what we store.
        </p>
      </LegalSection>
    </ContentPage>
  );
}
