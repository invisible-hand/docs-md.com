import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import { LegalMeta, LegalSection, legalLinkClass } from '@/components/LegalSection';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'What Docs MD stores when you share markdown, how long it keeps it, which services process it, and how to get content removed.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      description="Docs MD has no accounts and asks for no personal details. This page lists what we do store, why, and for how long."
    >
      <LegalMeta current="/privacy" />

      <LegalSection title="What you publish">
        <p>
          When you create a share, we store the markdown, the file name you gave it, the time it was created, when it
          expires, and its edit token. That applies to shares from the website, the REST API, the MCP server and the
          GitHub Action. A share is public to anyone with its link, and permanent shares can appear in search engines.
          Do not put personal data in a share unless you want it public.
        </p>
      </LegalSection>

      <LegalSection title="Tools that run in your browser">
        <p>
          The converters, generators and checkers on this site process your text in your browser and do not send it to
          us. Two exceptions: the link checker sends the URLs you give it to our server, which requests each one and
          returns the status without keeping the list; and the GitHub README viewer fetches public repositories from
          GitHub through our server.
        </p>
      </LegalSection>

      <LegalSection title="Rate limiting">
        <p>
          To stop abuse we count how many shares and reports come from each network address per day. We store a salted
          one-way hash of the address, not the address itself, and delete the counters after two days.
        </p>
      </LegalSection>

      <LegalSection title="Reports">
        <p>
          If you report a share, we store the link, your reason and description, and the email address you choose to
          give us. We use these only to handle the report and keep them as long as we need to for that and for our
          legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="Analytics and logs">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Google Analytics measures page views and sets cookies in your browser for that. You can block it with any
            content blocker or by opting out at{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" className={legalLinkClass} rel="noopener noreferrer">
              tools.google.com/dlpage/gaoptout
            </a>
            .
          </li>
          <li>Vercel Web Analytics counts page views without cookies.</li>
          <li>
            Our hosting provider records standard request logs, including IP addresses, for security and debugging, and
            keeps them for a short period.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Services that process data for us">
        <ul className="list-disc space-y-2 pl-5">
          <li>Vercel: hosting, request logs, Web Analytics, and file storage for share content (Vercel Blob).</li>
          <li>Neon: the Postgres database that holds share details and report records.</li>
          <li>Google: Google Analytics.</li>
          <li>Search engines that receive IndexNow notifications when a permanent share is created.</li>
        </ul>
        <p>These services are based in, or process data in, the United States.</p>
      </LegalSection>

      <LegalSection title="How long we keep things">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Expiring shares are deleted within about a day of their expiry date. Shared links can stay in other
            people&apos;s browsers and caches after that.
          </li>
          <li>Permanent shares stay until you delete them with the edit token or we remove them.</li>
          <li>Rate-limit counters are deleted after two days.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Images in shares">
        <p>
          A share can show images hosted on other websites. When you open such a share, your browser loads those images
          directly from the other site, which can see your IP address.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          Delete your own share at any time with its edit token. If a share contains your personal data and you do not
          have the token, ask us to remove it through the <Link href="/report" className={legalLinkClass}>report form</Link>.
          Depending on where you live, you may have rights to access, correct or delete personal data we hold about
          you. Use the same form to exercise them. We do not sell personal data.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>Docs MD is not meant for children under 16, and we do not knowingly collect their personal data.</p>
      </LegalSection>

      <LegalSection title="Changes and contact">
        <p>
          We will update this page when our practices change and update the date at the top. For questions, use the{' '}
          <Link href="/report" className={legalLinkClass}>contact and report form</Link> (choose &quot;Something
          else&quot;). See also the{' '}
          <Link href="/terms" className={legalLinkClass}>Terms of Service</Link>.
        </p>
      </LegalSection>
    </ContentPage>
  );
}
