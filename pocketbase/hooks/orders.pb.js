onRecordCreate('orders', (e) => {
  const code = e.record.getString('coupon_code').trim().toUpperCase()
  if (!code) return

  try {
    const coupon = $app.findFirstRecordByData('coupons', 'code', code)
    const used = coupon.getInt('used_count')
    const maxUses = coupon.getInt('max_uses')

    // Limite de usos: 0 = ilimitado
    if (maxUses > 0 && used >= maxUses) {
      throw new BadRequestError('Cupom esgotado.')
    }

    coupon.set('used_count', used + 1)
    $app.save(coupon)
  } catch (err) {
    // Se o cupom não existe mais ou esgotou, o pedido segue sem desconto aplicado
    if (err instanceof BadRequestError) throw err
  }
})
