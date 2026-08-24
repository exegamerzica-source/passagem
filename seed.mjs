import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const customer = await prisma.customer.create({
    data: {
      name: 'Natalia Ribeiro',
      email: 'natalia@email.com',
      phone: '(11) 99999-9999',
      cpf: '123.456.789-00'
    }
  })

  const pkg = await prisma.package.create({
    data: {
      title: 'Porto Seguro - 5 noites com all inclusive',
      price: 2898.00,
      imageUrl: 'https://via.placeholder.com/150'
    }
  })

  await prisma.order.create({
    data: {
      code: 'VB-284517',
      customerId: customer.id,
      packageId: pkg.id,
      status: 'Confirmada',
      total: 2898.00,
      paymentMethod: 'Cartão de crédito - 10x'
    }
  })
  
  console.log('Banco populado com dados reais do Neon!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
