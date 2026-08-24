import { neon } from '@neondatabase/serverless'
import { seedDestinations, seedHotels, seedPackages, seedBanners, seedCoupons, seedCustomers } from './src/data/seed'

const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')

async function seed() {
  console.log("Seeding Destinations...")
  for (const d of seedDestinations) {
    await sql`
      INSERT INTO "Destination" (id, slug, name, uf, region, short, description, image, "fromPrice", highlights, active)
      VALUES (${d.id}, ${d.slug}, ${d.name}, ${d.uf}, ${d.region}, ${d.short}, ${d.description}, ${d.image}, ${d.fromPrice}, ${JSON.stringify(d.highlights)}, ${d.active})
      ON CONFLICT (slug) DO NOTHING
    `
  }

  console.log("Seeding Hotels...")
  for (const h of seedHotels) {
    await sql`
      INSERT INTO "Hotel" (id, slug, name, "destinationSlug", stars, rating, reviews, board, address, description, image, gallery, amenities, "nightPrice", active)
      VALUES (${h.id}, ${h.slug}, ${h.name}, ${h.destinationSlug}, ${h.stars}, ${h.rating}, ${h.reviews}, ${h.board}, ${h.address}, ${h.description}, ${h.image}, ${JSON.stringify(h.gallery)}, ${JSON.stringify(h.amenities)}, ${h.nightPrice}, ${h.active})
      ON CONFLICT (slug) DO NOTHING
    `
  }

  console.log("Seeding TravelPackages...")
  for (const p of seedPackages) {
    await sql`
      INSERT INTO "TravelPackage" (id, slug, title, "destinationSlug", origin, "hotelSlug", nights, board, transfer, "flightAirline", "flightOutbound", "flightInbound", "flightBaggage", "flightStops", price, "oldPrice", installments, badges, seats, departure, ret, category, featured, active)
      VALUES (
        ${p.id}, ${p.slug}, ${p.title}, ${p.destinationSlug}, ${p.origin}, ${p.hotelSlug}, ${p.nights}, ${p.board}, ${p.transfer},
        ${p.flight?.airline}, ${p.flight?.outboundTime}, ${p.flight?.returnTime}, ${p.flight?.baggage || null}, ${p.flight?.stops || 0},
        ${p.price}, ${p.oldPrice}, ${p.installments}, ${JSON.stringify(p.badges)}, ${p.seats}, ${p.departure}, ${p.ret}, ${p.category}, ${p.featured}, ${p.active}
      )
      ON CONFLICT (slug) DO NOTHING
    `
  }

  console.log("Seeding Banners...")
  for (const b of seedBanners) {
    await sql`
      INSERT INTO "Banner" (id, title, subtitle, cta, link, image, "startsAt", "endsAt", active)
      VALUES (${b.id}, ${b.title}, ${b.subtitle}, ${b.cta}, ${b.link}, ${b.image}, ${b.startsAt}, ${b.endsAt}, ${b.active})
      ON CONFLICT DO NOTHING
    `
  }

  console.log("Seeding Coupons...")
  for (const c of seedCoupons) {
    await sql`
      INSERT INTO "Coupon" (id, code, percent, description, active)
      VALUES (${c.id}, ${c.code}, ${c.percent}, ${c.description}, ${c.active})
      ON CONFLICT (code) DO NOTHING
    `
  }

  console.log("Seeding Customers...")
  for (const c of seedCustomers) {
    await sql`
      INSERT INTO "Customer" (id, name, email, phone, document, since, bookings, spent)
      VALUES (${c.id}, ${c.name}, ${c.email}, ${c.phone}, ${c.document}, ${c.since}, ${c.bookings}, ${c.spent})
      ON CONFLICT (email) DO NOTHING
    `
  }

  console.log("Seeding completed successfully!")
}

seed().catch(console.error)
