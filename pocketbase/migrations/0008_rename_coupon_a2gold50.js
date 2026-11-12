migrate(
  (app) => {
    // Renomeia o cupom fixo A2PRIME50 para A2GOLD50 (seed original da 0007 usava
    // outro código; o requisito é A2GOLD50 com R$ 50). Idempotente.
    const rename = (from, to) => {
      let rec = null
      try {
        rec = app.findFirstRecordByData('coupons', 'code', from)
      } catch (_) {
        rec = null
      }
      if (rec) {
        rec.set('code', to)
        app.save(rec)
        return
      }
      // Origem não existe: garante que o destino exista com os valores oficiais.
      let dest = null
      try {
        dest = app.findFirstRecordByData('coupons', 'code', to)
      } catch (_) {
        dest = null
      }
      if (dest) return
      const coupons = app.findCollectionByNameOrId('coupons')
      const record = new Record(coupons)
      record.set('code', to)
      record.set('type', 'fixed')
      record.set('value', 50)
      record.set('description', 'R$ 50 de desconto direto no total do pedido.')
      record.set('active', true)
      record.set('expires_at', '2027-06-30 23:59:59.000Z')
      record.set('max_uses', 100)
      record.set('used_count', 0)
      app.save(record)
    }

    rename('A2PRIME50', 'A2GOLD50')
    rename('A2GOLD50', 'A2GOLD50')

    // BEMVINDO10 é garantido pela 0007; reconfirma caso o banco esteja vazio.
    let bemvindo = null
    try {
      bemvindo = app.findFirstRecordByData('coupons', 'code', 'BEMVINDO10')
    } catch (_) {
      bemvindo = null
    }
    if (!bemvindo) {
      const coupons = app.findCollectionByNameOrId('coupons')
      const record = new Record(coupons)
      record.set('code', 'BEMVINDO10')
      record.set('type', 'percent')
      record.set('value', 10)
      record.set('description', '10% de desconto de boas-vindas na primeira contratação.')
      record.set('active', true)
      record.set('expires_at', '2027-12-31 23:59:59.000Z')
      record.set('max_uses', 0)
      record.set('used_count', 0)
      app.save(record)
    }
  },
  (app) => {
    // Revert: restaura o código anterior do cupom fixo (best effort).
    try {
      const rec = app.findFirstRecordByData('coupons', 'code', 'A2GOLD50')
      rec.set('code', 'A2PRIME50')
      app.save(rec)
    } catch (_) {}
  },
)
