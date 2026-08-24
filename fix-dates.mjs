import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
const sql = neon(process.env.DATABASE_URL);
async function run() {
  await sql`UPDATE "TravelPackage" SET departure = '2026-10-10', ret = '2026-10-17' WHERE departure IS NULL`;
  console.log("Updated");
}
run();
