import { neon } from '@neondatabase/serverless'
const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')
async function run() {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
  console.log(tables)
}
run().catch(console.error)
