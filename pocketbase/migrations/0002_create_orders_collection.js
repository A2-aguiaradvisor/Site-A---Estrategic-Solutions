migrate(
  (app) => {
    const collection = new Collection({
      name: 'orders',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'order_code', type: 'text', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pending', 'paid', 'cancelled'],
          maxSelect: 1,
        },
        {
          name: 'payment_method',
          type: 'select',
          required: true,
          values: ['credit_card', 'pix', 'boleto'],
          maxSelect: 1,
        },
        { name: 'total', type: 'number', required: false, min: 0 },
        { name: 'items_json', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_orders_order_code ON orders (order_code)',
        'CREATE INDEX idx_orders_user_id ON orders (user_id)',
        'CREATE INDEX idx_orders_created ON orders (created)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('orders')
    app.delete(collection)
  },
)
