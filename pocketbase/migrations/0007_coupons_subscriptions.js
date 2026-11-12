migrate(
  (app) => {
    // ─────────────────────────────────────────────────────────────
    // 1. Collection: coupons (cupons de desconto)
    //    Leitura pública (necessária para validar cupom no checkout);
    //    escrita apenas pelo backend/hook (admin).
    // ─────────────────────────────────────────────────────────────
    let coupons = null
    try {
      coupons = app.findCollectionByNameOrId('coupons')
    } catch (_) {
      coupons = null
    }

    if (!coupons) {
      coupons = new Collection({
        name: 'coupons',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'code', type: 'text', required: true },
          {
            name: 'type',
            type: 'select',
            required: true,
            values: ['percent', 'fixed'],
            maxSelect: 1,
          },
          { name: 'value', type: 'number', required: true },
          { name: 'description', type: 'text' },
          { name: 'active', type: 'bool' },
          { name: 'expires_at', type: 'date' },
          { name: 'max_uses', type: 'number' }, // 0 = ilimitado
          { name: 'used_count', type: 'number' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE UNIQUE INDEX idx_coupons_code ON coupons (code)'],
      })
      app.save(coupons)
    }

    // ─────────────────────────────────────────────────────────────
    // 2. orders: campos de cupom e assinatura recorrente
    // ─────────────────────────────────────────────────────────────
    const orders = app.findCollectionByNameOrId('orders')

    if (!orders.fields.getByName('coupon_code')) {
      orders.fields.add(new TextField({ name: 'coupon_code' }))
      orders.fields.add(new NumberField({ name: 'discount_amount' }))
      orders.fields.add(
        new SelectField({ name: 'subscription_period', values: ['mensal', 'anual'], maxSelect: 1 }),
      )
      app.save(orders)
    }

    // ─────────────────────────────────────────────────────────────
    // 3. products: elegibilidade para assinatura recorrente
    // ─────────────────────────────────────────────────────────────
    const products = app.findCollectionByNameOrId('products')
    if (!products.fields.getByName('subscription_eligible')) {
      products.fields.add(new BoolField({ name: 'subscription_eligible' }))
      app.save(products)
    }

    // Mentoria e Serviços/Consultoria são elegíveis a assinatura
    const eligibleSlugs = ['mentoria-executiva', 'servicos-consultoria-apresentacao-institucional']
    for (const slug of eligibleSlugs) {
      try {
        const rec = app.findFirstRecordByData('products', 'slug', slug)
        rec.set('subscription_eligible', true)
        app.save(rec)
      } catch (_) {}
    }

    // ─────────────────────────────────────────────────────────────
    // 4. Seed de cupons de demonstração (idempotente)
    // ─────────────────────────────────────────────────────────────
    const seedCoupons = [
      {
        code: 'BEMVINDO10',
        type: 'percent',
        value: 10,
        description: '10% de desconto de boas-vindas na primeira contratação.',
        active: true,
        expires_at: '2027-12-31 23:59:59.000Z',
        max_uses: 0,
      },
      {
        code: 'A2PRIME50',
        type: 'fixed',
        value: 50,
        description: 'R$ 50 de desconto direto no total do pedido.',
        active: true,
        expires_at: '2027-06-30 23:59:59.000Z',
        max_uses: 100,
      },
    ]

    for (const c of seedCoupons) {
      let existing = null
      try {
        existing = app.findFirstRecordByData('coupons', 'code', c.code)
      } catch (_) {
        existing = null
      }
      if (existing) continue

      const record = new Record(coupons)
      record.set('code', c.code)
      record.set('type', c.type)
      record.set('value', c.value)
      record.set('description', c.description)
      record.set('active', c.active)
      record.set('expires_at', c.expires_at)
      record.set('max_uses', c.max_uses)
      record.set('used_count', 0)
      app.save(record)
    }
  },
  (app) => {
    // Revert: remove cupons seed
    for (const code of ['BEMVINDO10', 'A2PRIME50']) {
      try {
        const rec = app.findFirstRecordByData('coupons', 'code', code)
        app.delete(rec)
      } catch (_) {}
    }

    // Remove campos adicionados
    try {
      const orders = app.findCollectionByNameOrId('orders')
      for (const f of ['coupon_code', 'discount_amount', 'subscription_period']) {
        if (orders.fields.getByName(f)) orders.fields.removeByName(f)
      }
      app.save(orders)
    } catch (_) {}

    try {
      const products = app.findCollectionByNameOrId('products')
      if (products.fields.getByName('subscription_eligible')) {
        products.fields.removeByName('subscription_eligible')
        app.save(products)
      }
    } catch (_) {}

    try {
      const coupons = app.findCollectionByNameOrId('coupons')
      app.delete(coupons)
    } catch (_) {}
  },
)
