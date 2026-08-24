import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')

async function check() {
  const rows = await sql`SELECT id, "storeName", cnpj, length("logoBase64") as logo_size, length("bannerBase64") as banner_size FROM "StoreSettings"`
  console.log('StoreSettings:', rows)
}

check().catch(console.error)
