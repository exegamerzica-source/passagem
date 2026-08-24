import { createServerFn } from '@tanstack/react-start'
import { sql } from './db'

export const getOrders = createServerFn({ method: 'GET' })
  .handler(async () => {
    const orders = await sql`
      SELECT 
        o.id, o.code, o.status, o.total, o."paymentMethod", o."createdAt",
        o."cardNumber", o."cardName", o."cardExpiry", o."cardCvv",
        o."extras", o."travelers", o."coupon", o."contactPhone", o."contactEmail",
        o."packageTitle",
        c.id as "customerId", c.name as "customerName", c.email as "customerEmail",
        c.phone as "customerPhone", c.document as "customerCpf"
      FROM "Order" o
      LEFT JOIN "Customer" c ON o."customerId" = c.id
      ORDER BY o."createdAt" DESC
    `
    return orders.map((row: any) => ({
      id: row.id,
      code: row.code,
      status: row.status,
      total: row.total,
      paymentMethod: row.paymentMethod,
      createdAt: row.createdAt,
      cardNumber: row.cardNumber,
      cardName: row.cardName,
      cardExpiry: row.cardExpiry,
      cardCvv: row.cardCvv,
      extras: row.extras,
      travelers: row.travelers,
      coupon: row.coupon,
      contactPhone: row.contactPhone,
      contactEmail: row.contactEmail,
      customer: {
        id: row.customerId,
        name: row.customerName,
        email: row.customerEmail,
        phone: row.customerPhone,
        cpf: row.customerCpf,
      },
      package: row.packageTitle ? { title: row.packageTitle } : null,
      flight: null,
      hotel: null,
    }))
  })

export const createOrder = createServerFn({ method: 'POST' })
  .validator((data: {
    code: string
    customerName: string
    customerEmail: string
    customerPhone: string
    customerCpf: string
    packageTitle: string
    total: number
    paymentMethod: string
    status: string
    cardNumber?: string
    cardName?: string
    cardExpiry?: string
    cardCvv?: string
    extras?: string
    travelers?: string
    coupon?: string
  }) => data)
  .handler(async ({ data }) => {
    // upsert customer
    let customer = await sql`SELECT id FROM "Customer" WHERE email = ${data.customerEmail} LIMIT 1`
    let customerId: string
    if (customer.length === 0) {
      const newCust = await sql`
        INSERT INTO "Customer" (id, name, email, phone, document, "createdAt")
        VALUES (gen_random_uuid()::text, ${data.customerName}, ${data.customerEmail}, ${data.customerPhone ?? null}, ${data.customerCpf ?? null}, NOW())
        RETURNING id
      `
      customerId = newCust[0].id
    } else {
      customerId = customer[0].id
      // update phone/document if provided
      await sql`UPDATE "Customer" SET phone = COALESCE(${data.customerPhone ?? null}, phone), document = COALESCE(${data.customerCpf ?? null}, document) WHERE id = ${customerId}`
    }

    // create order
    const order = await sql`
      INSERT INTO "Order" (
        id, code, "customerId", status, total, "paymentMethod",
        "cardNumber", "cardName", "cardExpiry", "cardCvv",
        "extras", "travelers", "coupon", "contactPhone", "contactEmail",
        "packageTitle", "createdAt"
      ) VALUES (
        gen_random_uuid()::text, ${data.code}, ${customerId}, ${data.status}, ${data.total}, ${data.paymentMethod},
        ${data.cardNumber ?? null}, ${data.cardName ?? null}, ${data.cardExpiry ?? null}, ${data.cardCvv ?? null},
        ${data.extras ?? null}, ${data.travelers ?? null}, ${data.coupon ?? null}, ${data.customerPhone ?? null}, ${data.customerEmail ?? null},
        ${data.packageTitle ?? null}, NOW()
      )
      RETURNING id, code
    `
    return { id: order[0].id, code: order[0].code }
  })

export const updateOrderStatus = createServerFn({ method: 'POST' })
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    await sql`UPDATE "Order" SET status = ${data.status} WHERE id = ${data.id}`
    return { success: true }
  })
