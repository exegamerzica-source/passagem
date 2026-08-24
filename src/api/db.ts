import { neon } from '@neondatabase/serverless'

const connectionString = 'postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require'

// SQL direto via HTTP - sem Prisma, sem WASM, funciona em qualquer ambiente
export const sql = neon(connectionString)
