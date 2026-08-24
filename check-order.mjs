import { neon } from '@neondatabase/serverless'
const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')
async function run() {
  const result = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'Order'`
  console.log(result)
}
run().catch(console.error)
