import { createServerFn } from '@tanstack/react-start'
import { sql } from './db'

export const getStoreSettings = createServerFn({ method: 'GET' })
  .handler(async () => {
    const rows = await sql`SELECT * FROM "StoreSettings" LIMIT 1`
    if (rows.length === 0) {
      const newRows = await sql`
        INSERT INTO "StoreSettings" (id, "storeName", "updatedAt")
        VALUES (gen_random_uuid()::text, 'Voar Brasil', NOW())
        RETURNING *
      `
      return newRows[0]
    }
    return rows[0]
  })

export const updateStoreSettings = createServerFn({ method: 'POST' })
  .validator((data: { storeName?: string; cnpj?: string; logoBase64?: string; bannerBase64?: string }) => data)
  .handler(async ({ data }) => {
    const existing = await sql`SELECT id FROM "StoreSettings" LIMIT 1`
    if (existing.length === 0) {
      const rows = await sql`
        INSERT INTO "StoreSettings" (id, "storeName", cnpj, "logoBase64", "bannerBase64", "updatedAt")
        VALUES (gen_random_uuid()::text, ${data.storeName ?? null}, ${data.cnpj ?? null}, ${data.logoBase64 ?? null}, ${data.bannerBase64 ?? null}, NOW())
        RETURNING *
      `
      return rows[0]
    } else {
      const id = existing[0].id
      const rows = await sql`
        UPDATE "StoreSettings" SET
          "storeName" = COALESCE(${data.storeName ?? null}, "storeName"),
          "cnpj" = COALESCE(${data.cnpj ?? null}, "cnpj"),
          "logoBase64" = CASE WHEN ${data.logoBase64 ?? null}::text IS NOT NULL THEN ${data.logoBase64 ?? null} ELSE "logoBase64" END,
          "bannerBase64" = CASE WHEN ${data.bannerBase64 ?? null}::text IS NOT NULL THEN ${data.bannerBase64 ?? null} ELSE "bannerBase64" END,
          "updatedAt" = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return rows[0]
    }
  })
