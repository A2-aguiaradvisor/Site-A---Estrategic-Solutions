import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { formatBRL, formatDateBR } from '@/lib/formatters'
import { getProductImageUrl } from '@/services/products'
import { createOrder } from '@/services/orders'
import type { Coupon, SubscriptionPeriod } from '@/types'
import { computeDiscount, describeCoupon, validateCoupon } from '@/services/coupons'
import { cn } from '@/lib/utils'
import { Lock, Loader2, TicketPercent, X, BadgeCheck, Repeat, ShieldCheck } from 'lucide-react'

interface AppliedCoupon {
  coupon: Coupon
  discount: number
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>(
    'credit_card',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Cupom ────────────────────────────────────────────────
  const [couponInput, setCouponInput] = useState('')
  const [applied, setApplied] = useState<AppliedCoupon | null>(null)
  const [couponChecking, setCouponChecking] = useState(false)
  const [couponMessage, setCouponMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const discount = applied?.discount ?? 0
  const total = Math.max(subtotal - discount, 0)

  // Primeiro item com assinatura define a periodicidade registrada no pedido
  const subscriptionPeriod = useMemo(() => {
    for (const item of items) {
      if (item.subscription_period) return item.subscription_period
    }
    return undefined
  }, [items])

  const hasSubscriptionItem = Boolean(subscriptionPeriod)

  async function handleApplyCoupon() {
    const code = couponInput.trim()
    if (!code) {
      setCouponMessage({ type: 'error', text: 'Digite um código de cupom para aplicar.' })
      return
    }

    setCouponChecking(true)
    try {
      const result = await validateCoupon(code)
      if (!result.valid || !result.coupon) {
        setCouponMessage({ type: 'error', text: result.message ?? 'Cupom inválido.' })
        setApplied(null)
        return
      }

      const currentDiscount = computeDiscount(result.coupon, subtotal)
      if (currentDiscount <= 0) {
        setCouponMessage({
          type: 'error',
          text: 'Este cupom não gera desconto para o pedido atual.',
        })
        setApplied(null)
        return
      }

      setApplied({ coupon: result.coupon, discount: currentDiscount })
      setCouponMessage({
        type: 'success',
        text: `Cupom ${result.coupon.code} aplicado — ${describeCoupon(result.coupon)}!`,
      })
    } finally {
      setCouponChecking(false)
    }
  }

  function handleRemoveCoupon() {
    setApplied(null)
    setCouponInput('')
    setCouponMessage(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isAuthenticated || !user) {
      toast({ title: 'Sessão expirada', description: 'Faça login novamente para continuar.' })
      navigate('/entrar', { state: { from: { pathname: '/checkout' } } })
      return
    }

    setIsSubmitting(true)

    try {
      // Revalida o cupom no envio (pode ter expirado/esgotado enquanto o usuário preenchia)
      let couponCode: string | undefined
      let discountAmount = 0

      if (applied) {
        const revalidation = await validateCoupon(applied.coupon.code)
        if (revalidation.valid && revalidation.coupon) {
          couponCode = revalidation.coupon.code
          discountAmount = computeDiscount(revalidation.coupon, subtotal)
        } else {
          setApplied(null)
          setError(revalidation.message ?? 'O cupom aplicado não é mais válido. Revise o pedido.')
          setIsSubmitting(false)
          return
        }
      }

      const itemsPayload = items.map((item) => ({
        product_id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        category: item.product.category,
        subscription_period: item.subscription_period,
      }))

      const orderTotal = Math.max(subtotal - discountAmount, 0)

      // Simulação de pagamento online v1: aprovado instantaneamente
      await new Promise((r) => setTimeout(r, 700))

      await createOrder({
        paymentMethod,
        items: itemsPayload,
        total: orderTotal,
        couponCode,
        discountAmount,
        subscriptionPeriod,
      })

      clearCart()
      toast({
        title: 'Pedido confirmado!',
        description: 'Sua compra foi registrada com sucesso.',
      })
      navigate('/meus-pedidos')
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err)
      setError('Não foi possível finalizar o pedido. Tente novamente em instantes.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-[#1F3A5F] mb-3">Carrinho vazio</h1>
        <p className="text-sm text-slate-500 mb-6">
          Adicione soluções ao carrinho para finalizar a compra.
        </p>
        <Link
          to="/catalogo"
          className="px-6 py-3 rounded-xl bg-[#1F3A5F] text-white font-semibold text-sm"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3A5F]">Checkout</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Revise os itens, aplique um cupom e finalize a contratação.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Coluna esquerda: itens, cupom e pagamento ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Itens */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card-rest overflow-hidden">
            <header className="px-5 py-4 bg-slate-50 border-b border-[#E2E8F0]">
              <h2 className="text-sm font-bold text-[#1F3A5F]">Itens do pedido ({items.length})</h2>
            </header>
            <ul className="divide-y divide-[#E2E8F0]">
              {items.map((item) => {
                const imageUrl = getProductImageUrl(item.product)
                return (
                  <li
                    key={`${item.product.id}-${item.subscription_period ?? 'unico'}`}
                    className="p-4 sm:p-5 flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <img
                        src={imageUrl}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block">
                        {item.product.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#1F3A5F] truncate">
                        {item.product.title}
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        {item.quantity} × {formatBRL(item.product.price)}
                      </p>
                      {item.subscription_period && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[10px] font-bold text-[#2563EB] uppercase tracking-wide">
                          <Repeat className="w-3 h-3" />
                          Assinatura recorrente — {item.subscription_period}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#1F3A5F] block">
                        {formatBRL(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          {/* Cupom de desconto */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card-rest p-5">
            <h2 className="text-sm font-bold text-[#1F3A5F] flex items-center gap-2 mb-3">
              <TicketPercent className="w-4 h-4 text-[#E1A63E]" />
              Cupom de desconto
            </h2>

            {applied ? (
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-start gap-2">
                  <BadgeCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-800">
                      {applied.coupon.code} — {describeCoupon(applied.coupon)}
                    </p>
                    {applied.coupon.description && (
                      <p className="text-xs text-emerald-700 mt-0.5">
                        {applied.coupon.description}
                      </p>
                    )}
                    {applied.coupon.expires_at && (
                      <p className="text-[11px] text-emerald-600 mt-0.5">
                        Válido até {formatDateBR(applied.coupon.expires_at)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="p-1 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors"
                  aria-label="Remover cupom"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Digite o código do cupom (ex.: BEMVINDO10)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  aria-label="Código do cupom"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponChecking}
                  className="px-5 py-2.5 rounded-xl bg-[#0F1E36] hover:bg-[#17304F] disabled:opacity-60 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {couponChecking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TicketPercent className="w-4 h-4" />
                  )}
                  Aplicar cupom
                </button>
              </div>
            )}

            {couponMessage && !applied && (
              <p
                className={cn(
                  'mt-3 text-xs font-semibold',
                  couponMessage.type === 'error' ? 'text-red-600' : 'text-emerald-600',
                )}
                role="alert"
              >
                {couponMessage.text}
              </p>
            )}
          </section>

          {/* Forma de pagamento (simulada) */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card-rest p-5">
            <h2 className="text-sm font-bold text-[#1F3A5F] mb-3">Forma de pagamento</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { value: 'credit_card', label: 'Cartão de crédito' },
                  { value: 'pix', label: 'Pix' },
                  { value: 'boleto', label: 'Boleto' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPaymentMethod(option.value)}
                  className={cn(
                    'px-4 py-3 rounded-xl border text-sm font-semibold transition-all',
                    paymentMethod === option.value
                      ? 'border-[#2563EB] bg-blue-50 text-[#1F3A5F]'
                      : 'border-[#E2E8F0] text-slate-600 hover:border-slate-300',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Pagamento simulado v1 — nenhuma cobrança bancária real é efetuada.
            </p>
          </section>
        </div>

        {/* ── Coluna direita: resumo ── */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card-rest sticky top-28 space-y-5">
            <h2 className="text-lg font-bold text-[#1F3A5F] pb-3 border-b border-slate-100">
              Resumo do pedido
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1F3A5F]">{formatBRL(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1.5">
                    <TicketPercent className="w-4 h-4" />
                    Desconto ({applied?.coupon.code})
                  </span>
                  <span className="font-semibold">− {formatBRL(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Frete (produtos digitais)</span>
                <span className="font-semibold text-emerald-600 uppercase text-xs">Grátis</span>
              </div>

              {hasSubscriptionItem && subscriptionPeriod && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-[#1F3A5F]">
                  <Repeat className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Assinatura recorrente {subscriptionPeriod}.</strong> A renovação será
                    registrada no pedido (cobrança simulada nesta versão).
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-base font-bold text-[#1F3A5F]">Total</span>
                <span className="text-2xl font-black text-[#1F3A5F] tracking-tight">
                  {formatBRL(total)}
                </span>
              </div>
            </div>

            {error && (
              <p
                className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg p-3"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-[#1F3A5F] hover:bg-[#17304F] disabled:opacity-60 text-white font-bold text-sm shadow-btn-primary transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#E1A63E]" />
                  <span>Confirmar pedido</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Ao confirmar, você concorda com os termos de uso da A² Strategic Solutions.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
