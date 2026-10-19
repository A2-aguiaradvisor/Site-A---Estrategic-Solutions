migrate(
  (app) => {
    // Test and seed real order records for user vinicius_contabeis89@yahoo.com.br
    let user
    try {
      user = app.findAuthRecordByEmail('_pb_users_auth_', 'vinicius_contabeis89@yahoo.com.br')
    } catch (_) {
      return // Skip if user not found
    }

    const ordersCol = app.findCollectionByNameOrId('orders')
    const products = app.findRecordsByFilter('products', '', '-created', 5, 0)
    if (products.length === 0) return

    const p1 = products[0]
    const p2 = products.length > 1 ? products[1] : products[0]

    const items = [
      {
        product_id: p1.id,
        title: p1.getString('title'),
        price: p1.getFloat('price'),
        quantity: 1,
        category: p1.getString('category'),
        cover_image_url: '',
      },
      {
        product_id: p2.id,
        title: p2.getString('title'),
        price: p2.getFloat('price'),
        quantity: 1,
        category: p2.getString('category'),
        cover_image_url: '',
      },
    ]

    const total = Number((p1.getFloat('price') + p2.getFloat('price')).toFixed(2))

    const testMethods = ['credit_card', 'pix', 'boleto']
    const codes = ['AG-2026-CC01', 'AG-2026-PIX01', 'AG-2026-BOL01']

    testMethods.forEach((method, idx) => {
      try {
        app.findFirstRecordByData('orders', 'order_code', codes[idx])
        return // already exists
      } catch (_) {}

      const order = new Record(ordersCol)
      order.set('user_id', user.id)
      order.set('order_code', codes[idx])
      order.set('status', 'paid')
      order.set('payment_method', method)
      order.set('total', total)
      order.set('items_json', JSON.stringify(items))
      app.save(order)
    })
  },
  (app) => {
    const codes = ['AG-2026-CC01', 'AG-2026-PIX01', 'AG-2026-BOL01']
    codes.forEach((code) => {
      try {
        const record = app.findFirstRecordByData('orders', 'order_code', code)
        app.delete(record)
      } catch (_) {}
    })
  },
)
