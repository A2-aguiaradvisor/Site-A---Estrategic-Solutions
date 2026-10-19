migrate(
  (app) => {
    const collection = new Collection({
      name: 'products',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'long_description', type: 'text' },
        { name: 'price', type: 'number', required: false, min: 0 },
        {
          name: 'category',
          type: 'select',
          required: true,
          values: ['Mentoria', 'Curso', 'E-book', 'Serviço'],
          maxSelect: 1,
        },
        { name: 'whats_included', type: 'text' },
        { name: 'for_whom', type: 'text' },
        { name: 'requirements', type: 'text' },
        {
          name: 'cover_image',
          type: 'file',
          maxSelect: 1,
          maxSize: 2097152,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_products_slug ON products (slug)',
        'CREATE INDEX idx_products_category ON products (category)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('products')
    app.delete(collection)
  },
)
