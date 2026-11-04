/**
 * Last substantive change of each hand-built explainer page (YYYY-MM-DD). Shown as the visible
 * "Updated" line and emitted as `dateModified` in the page's Article JSON-LD. Tools, guides and
 * the data-driven pages carry their own dates in their registries.
 */
export const PAGE_DATES: Record<string, string> = {
  '/about': '2026-09-08',
  '/agents': '2026-10-20',
  '/ai-powered-ide': '2026-09-08',
  '/api-docs': '2026-10-20',
  '/readme-templates': '2026-09-12',
  '/use-cases': '2026-09-08',
  '/what-is-an-mcp-server': '2026-10-14',
  '/what-is-mcp': '2026-09-08',
};

export function pageDate(path: string): string {
  const date = PAGE_DATES[path];
  if (!date) throw new Error(`page-dates: no updated date for ${path}`);
  return date;
}
