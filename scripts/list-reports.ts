// Lists abuse reports from the report form, newest first. Run: npx tsx scripts/list-reports.ts [all]
process.loadEnvFile('.env.production.local');

import { sql } from '@vercel/postgres';

async function main() {
  const all = process.argv[2] === 'all';
  const { rows } = all
    ? await sql`SELECT * FROM share_reports ORDER BY created_at DESC LIMIT 100`
    : await sql`SELECT * FROM share_reports WHERE status = 'open' ORDER BY created_at DESC LIMIT 100`;
  for (const r of rows) {
    const created = new Date(Number(r.created_at)).toISOString().slice(0, 16);
    console.log(`#${r.id}  ${created}  ${r.status.padEnd(6)}  ${r.reason.padEnd(16)}  ${r.share_id ?? '-'}  ${r.contact ?? ''}`);
    if (r.details) console.log(`    ${String(r.details).replace(/\s+/g, ' ').slice(0, 300)}`);
  }
  console.log(`${all ? 'reports' : 'open reports'} shown: ${rows.length}`);
}
main().then(() => process.exit(0));
