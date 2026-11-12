import pb from '@/lib/pocketbase/client'
import type { Coupon } from '@/types'

export interface CouponValidation {
  valid: boolean
  coupon?: Coupon
  message?: string
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase()
}

/**
 * Valida um cupom de desconto e retorna os metadados se estiver válido.
 * Regras: ativo, dentro da validade, dentro do limite de usos.
 */
export async function validateCoupon(rawCode: string): Promise<CouponValidation> {
  const code = normalizeCode(rawCode)
  if (!code) {
    return { valid: false, message: 'Digite um código de cupom para aplicar.' }
  }

  try {
    const coupon = await pb.collection('coupons').getFirstListItem<Coupon>(`code = "${code}"`)

    if (!coupon.active) {
      return { valid: false, message: 'Este cupom não está mais ativo.' }
    }

    if (coupon.expires_at) {
      const expires = new Date(coupon.expires_at)
      if (!Number.isNaN(expires.getTime()) && expires.getTime() < Date.now()) {
        return { valid: false, message: 'Este cupom está expirado.' }
      }
    }

    if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses) {
      return { valid: false, message: 'Este cupom esgotou seu limite de utilizações.' }
    }

    return { valid: true, coupon }
  } catch (error: any) {
    if (error?.status === 404) {
      return { valid: false, message: 'Cupom inválido. Verifique o código digitado.' }
    }
    console.error('Erro ao validar cupom:', error)
    return { valid: false, message: 'Não foi possível validar o cupom agora. Tente novamente.' }
  }
}

export function computeDiscount(coupon: Coupon | null | undefined, subtotal: number): number {
  if (!coupon || subtotal <= 0) return 0

  let discount = 0
  if (coupon.type === 'percent') {
    discount = (subtotal * coupon.value) / 100
  } else if (coupon.type === 'fixed') {
    discount = coupon.value
  }

  // Nunca descontar mais do que o subtotal
  return Math.min(Math.max(discount, 0), subtotal)
}

export function describeCoupon(coupon: Coupon): string {
  return coupon.type === 'percent'
    ? `${coupon.value}% de desconto`
    : `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(coupon.value)} de desconto`
}
