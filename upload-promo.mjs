import fs from 'fs'
import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')
const file = 'C:/Users/Soubw/.gemini/antigravity/brain/1f59d47e-ccf1-4037-a656-5680cb7be8ae/.user_uploaded/media_1787606860263.jpg'

async function uploadBanner() {
  const data = fs.readFileSync(file)
  const base64 = 'data:image/jpeg;base64,' + data.toString('base64')
  
  await sql`
    UPDATE "StoreSettings"
    SET "bannerBase64" = ${base64}
  `
  console.log('Banner da promo atualizado no banco de dados!')
}

uploadBanner().catch(console.error)
