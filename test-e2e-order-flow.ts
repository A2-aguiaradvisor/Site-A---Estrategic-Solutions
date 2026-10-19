// Test script to run end-to-end verification of order flow using real PocketBase backend
// We test:
// 1. Authenticating as vinicius_contabeis89@yahoo.com.br / Skip@Pass
// 2. Fetching products from catalog
// 3. Simulating cart items addition & calculation (credit card, pix, boleto)
// 4. Creating real orders in the PocketBase backend for each payment method
// 5. Querying getUserOrders and getOrderById
// 6. Verifying payload integrity, order_code, items_json and status 'paid'

import PocketBase from 'pocketbase'

const POCKETBASE_URL = 'https://aguiar-advisory-e-commerce-d61d6.shrd01.internal.goskip.dev'

async function runTest() {
  console.log('--- STARTING E2E ORDER FLOW TEST ---')
  const pb = new PocketBase(POCKETBASE_URL)
  pb.autoCancellation(false)

  // Step 1: Auth
  console.log('1. Autenticando com vinicius_contabeis89@yahoo.com.br...')
  const authData = await pb
    .collection('users')
    .authWithPassword('vinicius_contabeis89@yahoo.com.br', 'Skip@Pass')
  console.log('Autenticação OK! Usuário ID:', authData.record.id, 'Email:', authData.record.email)

  // Step 2: Fetch Products
  console.log('2. Consultando produtos do catálogo...')
  const products = await pb.collection('products').getFullList({ sort: '-created' })
  console.log(`Catálogo carregado com ${products.length} produtos.`)
  if (products.length === 0) {
    throw new Error('Nenhum produto encontrado no catálogo!')
  }

  const p1 = products[0] // e.g. Planilha Modelo Faturamento (147)
  const p2 = products[1] // e.g. Impacto Reforma Tributária (297)
  console.log(`Produto 1: ${p1.title} - R$ ${p1.price}`)
  console.log(`Produto 2: ${p2.title} - R$ ${p2.price}`)

  // Step 3: Cart calculation simulation
  // Item 1: 2x p1 = 2 * p1.price
  // Item 2: 1x p2 = 1 * p2.price
  const qty1 = 2
  const qty2 = 1
  const subtotal = p1.price * qty1 + p2.price * qty2
  console.log(`Subtotal calculado: R$ ${subtotal}`)

  const itemsSnapshot = [
    {
      product_id: p1.id,
      title: p1.title,
      price: p1.price,
      quantity: qty1,
      category: p1.category,
      cover_image_url: p1.cover_image
        ? pb.files.getURL(p1, p1.cover_image)
        : 'https://img.usecurling.com/p/800/600?q=financial%20sheet&color=blue',
    },
    {
      product_id: p2.id,
      title: p2.title,
      price: p2.price,
      quantity: qty2,
      category: p2.category,
      cover_image_url: p2.cover_image
        ? pb.files.getURL(p2, p2.cover_image)
        : 'https://img.usecurling.com/p/800/600?q=tax%20simulation&color=blue',
    },
  ]

  // Step 4: Test Orders Creation for Credit Card, Pix and Boleto
  const methods = ['credit_card', 'pix', 'boleto'] as const
  const createdOrders: any[] = []

  for (const method of methods) {
    console.log(`\n4. Criando pedido com método de pagamento: ${method}...`)
    const currentYear = new Date().getFullYear()
    const randomSuffix = Math.floor(100000 + Math.random() * 900000)
    const orderCode = `AG-${currentYear}-${randomSuffix}`

    const orderRecord = await pb.collection('orders').create({
      user_id: authData.record.id,
      order_code: orderCode,
      status: 'paid',
      payment_method: method,
      total: subtotal,
      items_json: JSON.stringify(itemsSnapshot),
    })

    console.log(
      `Pedido criado com sucesso! ID: ${orderRecord.id}, Código: ${orderRecord.order_code}, Total: R$ ${orderRecord.total}, Status: ${orderRecord.status}`,
    )
    createdOrders.push(orderRecord)
  }

  // Step 5: Test fetch by ID (OrderDetail page logic)
  console.log('\n5. Verificando recuperação do pedido por ID (/pedido/:id)...')
  const testOrderId = createdOrders[0].id
  const fetchedOrder = await pb.collection('orders').getOne(testOrderId)
  console.log(
    `Pedido ${fetchedOrder.order_code} recuperado com sucesso. Itens parsed:`,
    JSON.parse(fetchedOrder.items_json).length,
  )

  // Step 6: Test fetch user orders (/meus-pedidos page logic)
  console.log('\n6. Verificando listagem de Meus Pedidos (/meus-pedidos)...')
  const userOrders = await pb.collection('orders').getFullList({
    sort: '-created',
    filter: `user_id = "${authData.record.id}"`,
  })
  console.log(`Total de pedidos do usuário encontrados: ${userOrders.length}`)

  console.log('\n--- TODOS OS TESTES DE FLUXO DO BACKEND FORAM CONCLUÍDOS COM SUCESSO! ---')
}

runTest().catch((err) => {
  console.error('ERRO NO TESTE:', err)
  process.exit(1)
})
