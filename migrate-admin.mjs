import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')

async function migrate() {
  console.log("Dropping old simple tables...")
  await sql`DROP TABLE IF EXISTS "Package" CASCADE`
  await sql`DROP TABLE IF EXISTS "Flight" CASCADE`
  await sql`DROP TABLE IF EXISTS "Hotel" CASCADE`
  await sql`DROP TABLE IF EXISTS "Customer" CASCADE`

  console.log("Creating Destination table...")
  await sql`
    CREATE TABLE IF NOT EXISTS "Destination" (
      "id" TEXT PRIMARY KEY,
      "slug" TEXT UNIQUE NOT NULL,
      "name" TEXT NOT NULL,
      "uf" TEXT,
      "region" TEXT,
      "short" TEXT,
      "description" TEXT,
      "image" TEXT,
      "fromPrice" DOUBLE PRECISION,
      "highlights" JSONB,
      "active" BOOLEAN DEFAULT true,
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `

  console.log("Creating Hotel table...")
  await sql`
    CREATE TABLE IF NOT EXISTS "Hotel" (
      "id" TEXT PRIMARY KEY,
      "slug" TEXT UNIQUE NOT NULL,
      "name" TEXT NOT NULL,
      "destinationSlug" TEXT,
      "stars" INTEGER,
      "rating" DOUBLE PRECISION,
      "reviews" INTEGER,
      "board" TEXT,
      "address" TEXT,
      "description" TEXT,
      "image" TEXT,
      "gallery" JSONB,
      "amenities" JSONB,
      "nightPrice" DOUBLE PRECISION,
      "active" BOOLEAN DEFAULT true,
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `

  console.log("Creating TravelPackage table...")
  await sql`
    CREATE TABLE IF NOT EXISTS "TravelPackage" (
      "id" TEXT PRIMARY KEY,
      "slug" TEXT UNIQUE NOT NULL,
      "title" TEXT NOT NULL,
      "destinationSlug" TEXT,
      "origin" TEXT,
      "hotelSlug" TEXT,
      "nights" INTEGER,
      "board" TEXT,
      "transfer" BOOLEAN,
      "flightAirline" TEXT,
      "flightOutbound" TEXT,
      "flightInbound" TEXT,
      "flightBaggage" TEXT,
      "flightStops" INTEGER,
      "price" DOUBLE PRECISION,
      "oldPrice" DOUBLE PRECISION,
      "installments" INTEGER,
      "badges" JSONB,
      "seats" INTEGER,
      "departure" TEXT,
      "ret" TEXT,
      "category" TEXT,
      "featured" BOOLEAN DEFAULT false,
      "active" BOOLEAN DEFAULT true,
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `

  console.log("Creating Banner table...")
  await sql`
    CREATE TABLE IF NOT EXISTS "Banner" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "subtitle" TEXT,
      "cta" TEXT,
      "link" TEXT,
      "image" TEXT,
      "startsAt" TEXT,
      "endsAt" TEXT,
      "active" BOOLEAN DEFAULT true,
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `

  console.log("Creating Coupon table...")
  await sql`
    CREATE TABLE IF NOT EXISTS "Coupon" (
      "id" TEXT PRIMARY KEY,
      "code" TEXT UNIQUE NOT NULL,
      "percent" INTEGER NOT NULL,
      "description" TEXT,
      "active" BOOLEAN DEFAULT true,
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `

  console.log("Creating Customer table...")
  await sql`
    CREATE TABLE IF NOT EXISTS "Customer" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT UNIQUE,
      "phone" TEXT,
      "document" TEXT,
      "since" TEXT,
      "bookings" INTEGER DEFAULT 0,
      "spent" DOUBLE PRECISION DEFAULT 0,
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `

  console.log("Migration complete!")
}

migrate().catch(console.error)
