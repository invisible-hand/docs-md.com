import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import { LegalMeta, LegalSection, legalLinkClass } from '@/components/LegalSection';
import { DAILY_SHARE_LIMIT_PER_IP } from '@/lib/quota';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'The terms for using Docs MD: markdown sharing links, the REST API, the MCP server and the free markdown tools.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Service"
      description="These terms cover docs-md.com: the markdown sharing links, the REST API, the MCP server, the GitHub Action and the free tools. By using any of them you agree to these terms."
    >
      <LegalMeta current="/terms" />

      <LegalSection title="1. The service">
        <p>
          Docs MD (&quot;we&quot;, &quot;us&quot;) lets you publish markdown at a link without an account. You can
          create a share on the website, through the REST API, through the MCP server from an AI assistant, or with
          the GitHub Action. Each share gets an edit token that lets you update or delete it later. Keep that token:
          we cannot recover it for you.
        </p>
        <p>The markdown tools on this site run in your browser. Nothing you type into them is sent to us unless you share it.</p>
      </LegalSection>

      <LegalSection title="2. Shares are public">
        <ul className="list-disc space-y-2 pl-5">
          <li>Anyone who has the link to a share can read it, along with its raw file.</li>
          <li>
            Shares set to expire are hidden from search engines. Permanent shares can be indexed by search engines, and
            we may notify search engines when one is created.
          </li>
          <li>
            Do not share passwords, API keys, payment card numbers, or anyone else&apos;s personal data. Assume
            anything you publish here can be copied by anyone who sees it.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Your content">
        <p>
          You keep ownership of what you publish. You give us a worldwide, non-exclusive, royalty-free licence to
          store, copy, display and distribute it as needed to run the service. That includes showing it at its link,
          serving the raw file, generating a preview card, and letting search engines index permanent shares. The
          licence ends when the share is deleted, except for copies that already exist in caches or backups for a short
          time afterwards.
        </p>
        <p>
          You are responsible for what you publish. You confirm that you have the right to publish it and that it
          follows our <Link href="/acceptable-use" className={legalLinkClass}>Acceptable Use Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="4. Expiry and deletion">
        <p>
          A share set to 1, 7 or 30 days stops being available when it expires, and we delete it within about a day.
          A permanent share stays up until you delete it with its edit token or we remove it. We do not keep backups of
          deleted shares for you, so keep your own copy of anything important.
        </p>
      </LegalSection>

      <LegalSection title="5. Removing content">
        <p>
          We may remove any share, or block access to the service, if we believe it breaks these terms or the law, or
          puts the service or other people at risk. We may do this without notice. To report a share, use the{' '}
          <Link href="/report" className={legalLinkClass}>report form</Link>.
        </p>
      </LegalSection>

      <LegalSection title="6. API, MCP and fair use">
        <p>
          The API and MCP server are free and do not need a key. To keep them that way they are rate limited. Each
          address can currently create up to {DAILY_SHARE_LIMIT_PER_IP} shares per day, and short bursts are limited
          as well. Do not try to get around these limits, overload the service, or use it to attack other systems. We
          may change the limits at any time.
        </p>
      </LegalSection>

      <LegalSection title="7. Copyright complaints">
        <p>
          We respond to copyright notices that meet the requirements of the US Digital Millennium Copyright Act and
          similar laws. How to send a notice or a counter-notice is explained on the{' '}
          <Link href="/report#copyright" className={legalLinkClass}>report page</Link>. We remove content from
          people who repeatedly infringe.
        </p>
      </LegalSection>

      <LegalSection title="8. No warranty">
        <p>
          The service is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind,
          express or implied. These include warranties of merchantability, fitness for a particular purpose and
          non-infringement. We do not promise that the service will be uninterrupted or error-free, or that any share
          will stay available.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of liability">
        <p>
          To the fullest extent the law allows, we are not liable for any indirect, incidental, special, consequential
          or punitive damages, or for lost data, profits or revenue, arising from your use of the service. Our total
          liability for any claim about the service is limited to 100 US dollars. Some jurisdictions do not allow these
          limits, so they may not all apply to you.
        </p>
      </LegalSection>

      <LegalSection title="10. Indemnity">
        <p>
          You agree to compensate us for claims, losses and costs (including reasonable legal fees) that arise from
          content you publish or from your breach of these terms.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes">
        <p>
          We may update these terms. The date at the top of this page changes when we do. If you keep using the service
          after a change, you accept the new terms.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing law">
        <p>
          These terms are governed by the laws of the jurisdiction where the operator of Docs MD is based. This does
          not take away any rights you have under the mandatory consumer laws of the country where you live.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Questions about these terms: use the <Link href="/report" className={legalLinkClass}>contact and report form</Link>{' '}
          (choose &quot;Something else&quot;). See also our{' '}
          <Link href="/privacy" className={legalLinkClass}>Privacy Policy</Link>.
        </p>
      </LegalSection>
    </ContentPage>
  );
}
