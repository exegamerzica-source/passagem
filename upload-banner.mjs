import fs from 'fs'
import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')
const file = 'C:/Users/Soubw/.gemini/antigravity/brain/1f59d47e-ccf1-4037-a656-5680cb7be8ae/.user_uploaded/media_1787606064927.webp'

async function uploadBanner() {
  const data = fs.readFileSync(file)
  const base64 = 'data:image/webp;base64,' + data.toString('base64')
  console.log('Tamanho da imagem base64:', base64.length)
  
  await sql`
    UPDATE "StoreSettings"
    SET "bannerBase64" = ${base64}
  `
  console.log('Banner atualizado no banco de dados!')
}

uploadBanner().catch(console.error)
