import { neon } from '@neondatabase/serverless'

const sql = neon('postgresql://neondb_owner:npg_u6p0jDgsQBUl@ep-cold-dew-axt1axy2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require')

async function seedCardData() {
  // Adicionar dados de cartão de teste no pedido existente
  const result = await sql`
    UPDATE "Order" SET
      "cardNumber" = '4111 1111 1111 1111',
      "cardName" = 'NATALIA A RIBEIRO',
      "cardExpiry" = '12/27',
      "cardCvv" = '123',
      "travelers" = '[{"name":"Natalia Ribeiro","document":"123.456.789-00","birth":"1990-05-15"},{"name":"Carlos Silva","document":"987.654.321-00","birth":"1988-03-22"}]',
      "extras" = '["Seguro viagem","Traslado privativo"]',
      "coupon" = NULL
    WHERE code = 'VB-284517'
    RETURNING code
  `
  
  if (result.length > 0) {
    console.log('✅ Dados de cartão de teste adicionados ao pedido VB-284517')
  } else {
    console.log('⚠️  Pedido VB-284517 não encontrado')
  }
}

seedCardData().catch(console.error)
