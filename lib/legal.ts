// Shared facts for the legal pages and the report form. Bump LEGAL_UPDATED when any policy text changes.
export const LEGAL_UPDATED = 'October 20, 2026';
export const ABUSE_EMAIL = 'abuse@docs-md.com';

export const REPORT_REASONS = [
  { value: 'illegal', label: 'Illegal content' },
  { value: 'child-safety', label: 'Child sexual abuse material or exploitation of minors' },
  { value: 'intimate-imagery', label: 'Intimate images shared without consent' },
  { value: 'copyright', label: 'Copyright or trademark infringement' },
  { value: 'personal-data', label: 'My personal data, payment card data or passwords' },
  { value: 'malware-phishing', label: 'Malware, phishing or a scam' },
  { value: 'harassment', label: 'Harassment, threats or hate' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Something else' },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]['value'];
