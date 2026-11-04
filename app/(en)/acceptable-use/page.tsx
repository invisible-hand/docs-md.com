import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import { LegalMeta, LegalSection, legalLinkClass } from '@/components/LegalSection';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'Acceptable Use Policy',
  description: 'What you may not publish on Docs MD, and what happens to shares that break the rules.',
  path: '/acceptable-use',
});

const PROHIBITED = [
  'Child sexual abuse material, or any content that sexualises minors. We report it to the relevant authorities.',
  'Intimate or sexual images of a real person shared without their consent, including AI-generated or altered ones, and tools or services that create them.',
  'Malware, exploit kits, phishing pages, credential harvesting, or instructions written to defraud people.',
  'Payment card numbers, bank account credentials, passwords, API keys, or other secrets that belong to someone else.',
  'Personal data about other people published to expose, harass or endanger them (doxxing).',
  'Content that infringes copyright, trademarks or other rights, including pirated software, cracked licence keys and links to unauthorised downloads.',
  'Credible threats of violence, promotion of terrorism, or harassment and hate aimed at people for who they are.',
  'Sale or promotion of goods and services that are illegal where they are offered, such as prescription drugs without a prescription, weapons or unlicensed gambling.',
  'Content that impersonates another person or organisation in order to mislead.',
];

export default function AcceptableUsePage() {
  return (
    <ContentPage
      title="Acceptable Use Policy"
      description="Docs MD is for sharing documents: notes, plans, READMEs, reports and AI-generated handoffs. This policy lists what you may not publish."
    >
      <LegalMeta current="/acceptable-use" />

      <LegalSection title="Do not publish">
        <ul className="list-disc space-y-2 pl-5">
          {PROHIBITED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Do not misuse the service">
        <ul className="list-disc space-y-2 pl-5">
          <li>Do not get around rate limits by spreading requests over many addresses or accounts.</li>
          <li>Do not create shares in bulk with automated duplicate content.</li>
          <li>Do not use the link checker or any other endpoint to probe or attack other systems.</li>
        </ul>
      </LegalSection>

      <LegalSection title="What happens when a share breaks these rules">
        <p>
          We may remove the share, block the address it came from, and, where the law requires it, report it. Reports of
          intimate images shared without consent are handled within 48 hours. These rules apply to shares created through
          the website, the API, the MCP server and the GitHub Action alike. The full terms are in our{' '}
          <Link href="/terms" className={legalLinkClass}>Terms of Service</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Report a share">
        <p>
          If you find a share that breaks these rules, use the{' '}
          <Link href="/report" className={legalLinkClass}>report form</Link>. Every share page also has a Report link at
          the bottom.
        </p>
      </LegalSection>
    </ContentPage>
  );
}
