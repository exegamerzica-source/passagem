import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')

async function run() {
  await sql`ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "siteTexts" JSONB DEFAULT '{}'`
  console.log('Done')
}
run().catch(console.error)
