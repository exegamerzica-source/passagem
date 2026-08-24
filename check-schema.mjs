import { neon } from '@neondatabase/serverless'
const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')
async function run() {
  const q = await sql`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    ORDER BY table_name, ordinal_position;
  `
  console.log(JSON.stringify(q, null, 2))
}
run().catch(console.error)
