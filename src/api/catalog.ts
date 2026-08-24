import { createServerFn } from '@tanstack/react-start'
import { sql } from './db'

// ==========================================
// DESTINATIONS
// ==========================================
export const getDestinations = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await sql`SELECT * FROM "Destination" ORDER BY name ASC`
  })

export const createDestination = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const res = await sql`
      INSERT INTO "Destination" (id, slug, name, uf, region, short, description, image, "fromPrice", highlights, active)
      VALUES (gen_random_uuid()::text, ${data.slug}, ${data.name}, ${data.uf}, ${data.region}, ${data.short}, ${data.description}, ${data.image}, ${data.fromPrice}, ${JSON.stringify(data.highlights)}, ${data.active})
      RETURNING *
    `
    return res[0]
  })

export const updateDestination = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const res = await sql`
      UPDATE "Destination" SET
        slug = ${data.slug}, name = ${data.name}, uf = ${data.uf}, region = ${data.region},
        short = ${data.short}, description = ${data.description}, image = ${data.image},
        "fromPrice" = ${data.fromPrice}, highlights = ${JSON.stringify(data.highlights)}, active = ${data.active}
      WHERE id = ${data.id}
      RETURNING *
    `
    return res[0]
  })

export const deleteDestination = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await sql`DELETE FROM "Destination" WHERE id = ${data.id}`
    return { success: true }
  })

// ==========================================
// HOTELS
// ==========================================
export const getHotels = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await sql`SELECT * FROM "Hotel" ORDER BY name ASC`
  })

export const createHotel = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const res = await sql`
      INSERT INTO "Hotel" (id, slug, name, "destinationSlug", stars, rating, reviews, board, address, description, image, gallery, amenities, "nightPrice", active)
      VALUES (gen_random_uuid()::text, ${data.slug}, ${data.name}, ${data.destinationSlug}, ${data.stars}, ${data.rating}, ${data.reviews}, ${data.board}, ${data.address}, ${data.description}, ${data.image}, ${JSON.stringify(data.gallery)}, ${JSON.stringify(data.amenities)}, ${data.nightPrice}, ${data.active})
      RETURNING *
    `
    return res[0]
  })

export const updateHotel = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const res = await sql`
      UPDATE "Hotel" SET
        slug = ${data.slug}, name = ${data.name}, "destinationSlug" = ${data.destinationSlug}, stars = ${data.stars},
        rating = ${data.rating}, reviews = ${data.reviews}, board = ${data.board}, address = ${data.address},
        description = ${data.description}, image = ${data.image}, gallery = ${JSON.stringify(data.gallery)},
        amenities = ${JSON.stringify(data.amenities)}, "nightPrice" = ${data.nightPrice}, active = ${data.active}
      WHERE id = ${data.id}
      RETURNING *
    `
    return res[0]
  })

export const deleteHotel = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await sql`DELETE FROM "Hotel" WHERE id = ${data.id}`
    return { success: true }
  })

// ==========================================
// PACKAGES
// ==========================================
export const getPackages = createServerFn({ method: 'GET' })
  .handler(async () => {
    const pkgs = await sql`SELECT * FROM "TravelPackage" ORDER BY "createdAt" DESC`
    // Remap flight details back to JSON object for UI ease
    return pkgs.map(p => ({
      ...p,
      flight: {
        airline: p.flightAirline,
        outboundTime: p.flightOutbound,
        returnTime: p.flightInbound,
        baggage: p.flightBaggage,
        stops: p.flightStops
      }
    }))
  })

export const createPackage = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const res = await sql`
      INSERT INTO "TravelPackage" (
        id, slug, title, "destinationSlug", origin, "hotelSlug", nights, board, transfer,
        "flightAirline", "flightOutbound", "flightInbound", "flightBaggage", "flightStops",
        price, "oldPrice", installments, badges, seats, departure, ret, category, featured, active
      )
      VALUES (
        gen_random_uuid()::text, ${data.slug}, ${data.title}, ${data.destinationSlug}, ${data.origin}, ${data.hotelSlug}, ${data.nights}, ${data.board}, ${data.transfer},
        ${data.flight?.airline}, ${data.flight?.outboundTime}, ${data.flight?.returnTime}, ${data.flight?.baggage}, ${data.flight?.stops},
        ${data.price}, ${data.oldPrice}, ${data.installments}, ${JSON.stringify(data.badges)}, ${data.seats}, ${data.departure}, ${data.ret}, ${data.category}, ${data.featured}, ${data.active}
      )
      RETURNING *
    `
    return res[0]
  })

export const updatePackage = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const res = await sql`
      UPDATE "TravelPackage" SET
        slug = ${data.slug}, title = ${data.title}, "destinationSlug" = ${data.destinationSlug}, origin = ${data.origin},
        "hotelSlug" = ${data.hotelSlug}, nights = ${data.nights}, board = ${data.board}, transfer = ${data.transfer},
        "flightAirline" = ${data.flight?.airline}, "flightOutbound" = ${data.flight?.outboundTime}, "flightInbound" = ${data.flight?.returnTime},
        "flightBaggage" = ${data.flight?.baggage}, "flightStops" = ${data.flight?.stops}, price = ${data.price}, "oldPrice" = ${data.oldPrice},
        installments = ${data.installments}, badges = ${JSON.stringify(data.badges)}, seats = ${data.seats}, departure = ${data.departure},
        ret = ${data.ret}, category = ${data.category}, featured = ${data.featured}, active = ${data.active}
      WHERE id = ${data.id}
      RETURNING *
    `
    return res[0]
  })

export const deletePackage = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await sql`DELETE FROM "TravelPackage" WHERE id = ${data.id}`
    return { success: true }
  })

// ==========================================
// COUPONS
// ==========================================
export const getCoupons = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await sql`SELECT * FROM "Coupon" ORDER BY percent DESC`
  })

export const createCoupon = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const res = await sql`
      INSERT INTO "Coupon" (id, code, percent, description, active)
      VALUES (gen_random_uuid()::text, ${data.code}, ${data.percent}, ${data.description}, ${data.active})
      RETURNING *
    `
    return res[0]
  })

export const updateCoupon = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const res = await sql`
      UPDATE "Coupon" SET code = ${data.code}, percent = ${data.percent}, description = ${data.description}, active = ${data.active}
      WHERE id = ${data.id}
      RETURNING *
    `
    return res[0]
  })

export const deleteCoupon = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await sql`DELETE FROM "Coupon" WHERE id = ${data.id}`
    return { success: true }
  })

// ==========================================
// CUSTOMERS
// ==========================================
export const getCustomers = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await sql`SELECT * FROM "Customer" ORDER BY "createdAt" DESC`
  })

// ==========================================
// BANNERS
// ==========================================
export const getBanners = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await sql`SELECT * FROM "Banner" ORDER BY "createdAt" ASC`
  })
