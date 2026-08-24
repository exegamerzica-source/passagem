import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const r = await sql`SELECT slug, title, departure, ret FROM "TravelPackage"`;
  console.log(r);
}
run();
