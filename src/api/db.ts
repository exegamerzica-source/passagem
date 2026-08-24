import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

// In Cloudflare Workers / Vercel Edge: WebSocket is native, don't set ws.
// In local Node.js dev: use the 'ws' package as polyfill.
if (typeof WebSocket === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  neonConfig.webSocketConstructor = require('ws')
}

const connectionString = 'postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require'
const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

export const db = new PrismaClient({ adapter, datasourceUrl: connectionString })
