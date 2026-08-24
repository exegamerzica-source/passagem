import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')

async function fix() {
  await sql`
    UPDATE "Order" SET
      "paymentMethod" = ${'Cart\u00e3o de cr\u00e9dito - 10x - **** 1234'}
    WHERE code = 'VB-284517'
  `
  const r = await sql`SELECT code, "paymentMethod" FROM "Order" WHERE code = 'VB-284517'`
  console.log('Corrigido:', r[0].paymentMethod)
}

fix().catch(console.error)
