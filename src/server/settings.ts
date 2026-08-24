import { createServerFn } from '@tanstack/react-start'
import { db } from './db'

export const getStoreSettings = createServerFn({ method: 'GET' })
  .handler(async () => {
    let settings = await db.storeSettings.findFirst()
    if (!settings) {
      settings = await db.storeSettings.create({
        data: {
          storeName: 'Voar Brasil',
        }
      })
    }
    return settings
  })

export const updateStoreSettings = createServerFn({ method: 'POST' })
  .validator((data: { storeName?: string, cnpj?: string, logoBase64?: string, bannerBase64?: string }) => data)
  .handler(async ({ data }) => {
    let settings = await db.storeSettings.findFirst()
    if (!settings) {
      settings = await db.storeSettings.create({ data })
    } else {
      settings = await db.storeSettings.update({
        where: { id: settings.id },
        data
      })
    }
    return settings
  })
