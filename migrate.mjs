import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')

async function migrate() {
  await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "cardNumber" TEXT`
  await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "cardName" TEXT`
  await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "cardExpiry" TEXT`
  await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "cardCvv" TEXT`
  await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "extras" TEXT`
  await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "travelers" TEXT`
  await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "coupon" TEXT`
  await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT`
  await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT`
  console.log('✅ Colunas de cartão e dados extras adicionadas com sucesso!')
}

migrate().catch(console.error)
