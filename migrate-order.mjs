import { neon } from '@neondatabase/serverless'
const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')
async function run() {
  await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "packageTitle" TEXT`
  console.log('Done')
}
run().catch(console.error)
