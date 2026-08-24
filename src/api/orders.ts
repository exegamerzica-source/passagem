import { createServerFn } from '@tanstack/react-start'
import { sql } from './db'

export const getOrders = createServerFn({ method: 'GET' })
  .handler(async () => {
    const orders = await sql`
      SELECT 
        o.id, o.code, o.status, o.total, o."paymentMethod", o."createdAt",
        c.id as "customerId", c.name as "customerName", c.email as "customerEmail",
        c.phone as "customerPhone", c.cpf as "customerCpf",
        p.title as "packageTitle",
        f.airline, f.origin, f.destination,
        h.name as "hotelName"
      FROM "Order" o
      LEFT JOIN "Customer" c ON o."customerId" = c.id
      LEFT JOIN "Package" p ON o."packageId" = p.id
      LEFT JOIN "Flight" f ON o."flightId" = f.id
      LEFT JOIN "Hotel" h ON o."hotelId" = h.id
      ORDER BY o."createdAt" DESC
    `
    return orders.map((row: any) => ({
      id: row.id,
      code: row.code,
      status: row.status,
      total: row.total,
      paymentMethod: row.paymentMethod,
      createdAt: row.createdAt,
      customer: {
        id: row.customerId,
        name: row.customerName,
        email: row.customerEmail,
        phone: row.customerPhone,
        cpf: row.customerCpf,
      },
      package: row.packageTitle ? { title: row.packageTitle } : null,
      flight: row.airline ? { airline: row.airline, origin: row.origin, destination: row.destination } : null,
      hotel: row.hotelName ? { name: row.hotelName } : null,
    }))
  })

export const updateOrderStatus = createServerFn({ method: 'POST' })
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    await sql`UPDATE "Order" SET status = ${data.status} WHERE id = ${data.id}`
    return { success: true }
  })
