import { createServerFn } from '@tanstack/react-start'
import { db } from './db'

export const getOrders = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await db.order.findMany({
      include: {
        customer: true,
        package: true,
        flight: true,
        hotel: true
      },
      orderBy: { createdAt: 'desc' }
    })
  })
