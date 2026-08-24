import { neon } from '@neondatabase/serverless'
const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')
async function fix() {
  await sql`UPDATE "TravelPackage" SET price = 750, "oldPrice" = 1750 WHERE slug = 'rio-de-janeiro-promo-casal'`
  console.log('Fixed promo price')
}
fix().catch(console.error)
