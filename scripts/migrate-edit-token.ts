import { sql } from '@vercel/postgres';

async function migrate() {
  await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS edit_token TEXT;`;
  const check = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'shares'
  `;
  console.log('Columns:', check.rows.map((r) => r.column_name).join(', '));
}

migrate().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
