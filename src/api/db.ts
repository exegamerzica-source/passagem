import { neon } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

// HTTP mode - funciona em qualquer ambiente (Node, Edge, CF Workers, Vercel)
// Sem WebSocket, sem TCP, sem dependencia de ambiente.
const connectionString = 'postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require'
const sql = neon(connectionString)
const adapter = new PrismaNeon(sql as any)

export const db = new PrismaClient({ adapter, datasourceUrl: connectionString })
