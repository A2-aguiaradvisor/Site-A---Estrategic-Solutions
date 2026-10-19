import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { createOrder } from '@/services/orders'
import { formatBRL } from '@/lib/formatters'
import { getProductImageUrl } from '@/services/products'
import type { PaymentMethod, OrderItemSnapshot } from '@/types'
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  AlertCircle,
  Loader2,
  Lock,
  CheckCircle2,
} from 'lucide-react'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Ensure user is authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/entrar', { state: { from: { pathname: '/checkout' } }, replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  // Form states
  const [fullName, setFullName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card')

  // Credit card inputs (simulated)
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821')
  const [cardName, setCardName] = useState(user?.name ? user.name.toUpperCase() : 'VINICIUS AGUIAR')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvv, setCardCvv] = useState('882')

  // Synchronize user profile if loaded asynchronously
  React.useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email)
    }
    if (user?.name && !fullName) {
      setFullName(user.name)
    }
    if (user?.name && cardName === 'VINICIUS AGUIAR') {
      setCardName(user.name.toUpperCase())
    }
  }, [user, email, fullName, cardName])

  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If cart is empty, redirect or display note
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#1F3A5F] mb-3">Seu carrinho está vazio</h2>
        <p className="text-sm text-slate-600 mb-6">
          Adicione ao menos um programa ou material executivo antes de prosseguir com o checkout.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#1F3A5F] text-white text-sm font-semibold"
        >
          Ir para o Catálogo
        </Link>
      </div>
    )
  }

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!fullName.trim()) {
      errs.fullName = 'Nome completo é obrigatório.'
    }
    if (!acceptedTerms) {
      errs.acceptedTerms = 'Você deve aceitar os termos de uso para prosseguir.'
    }

    if (paymentMethod === 'credit_card') {
      if (!cardNumber.trim()) errs.cardNumber = 'Número do cartão é obrigatório.'
      if (!cardName.trim()) errs.cardName = 'Nome no cartão é obrigatório.'
      if (!cardExpiry.trim()) errs.cardExpiry = 'Validade é obrigatória.'
      if (!cardCvv.trim()) errs.cardCvv = 'CVV é obrigatório.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const orderItems: OrderItemSnapshot[] = items.map((i) => ({
        product_id: i.product.id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        category: i.product.category,
        cover_image_url: getProductImageUrl(i.product),
      }))

      const newOrder = await createOrder({
        paymentMethod,
        items: orderItems,
        total: subtotal,
      })

      clearCart()
      toast({
        title: 'Pedido realizado com sucesso!',
        description: `Código do pedido: ${newOrder.order_code}`,
      })
      navigate(`/pedido/${newOrder.id}`)
    } catch (err: any) {
      console.error('Erro ao finalizar pedido:', err)
      toast({
        title: 'Erro ao processar pedido',
        description: err?.message || 'Ocorreu uma falha na simulação. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Step Indicator */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
          <span className="text-[#10B981] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1. Carrinho
          </span>
          <span className="text-[#2563EB] flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px]">
              2
            </span>
            2. Pagamento Simulado
          </span>
          <span className="flex items-center gap-1">3. Confirmação</span>
        </div>
        {/* Progress line */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#2563EB] h-full w-2/3 transition-all duration-500 rounded-full" />
        </div>
      </div>

      {/* Simulated Payment Notice Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-sm flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-950">Ambiente de Simulação de Pagamento (v1.0)</p>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
            Nenhuma cobrança bancária real será feita em sua conta ou cartão. Todos os fluxos abaixo
            são validados em ambiente de testes para fins de aprovação do ecossistema A² Strategic
            Solutions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Customer Data */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card-rest space-y-4">
              <h2 className="text-base font-bold text-[#1F3A5F] pb-3 border-b border-slate-100">
                1. Dados do Titular
              </h2>

              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-[#1F3A5F] mb-1">
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none ${
                    errors.fullName ? 'border-red-400' : 'border-[#E2E8F0] focus:border-[#2563EB]'
                  }`}
                  placeholder="Seu nome"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#1F3A5F] mb-1">
                  E-mail de recebimento (vinculado à sua conta)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Os dados de acesso aos programas serão direcionados para este e-mail.
                </span>
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs font-semibold text-[#1F3A5F] mb-1">
                  Observações executivas ou preferências de agendamento (opcional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Melhor horário para contato quinzenal: terças à tarde."
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Section 2: Payment Method */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card-rest space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-[#1F3A5F]">
                  2. Forma de Pagamento (Simulada)
                </h2>
                <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Sem cobrança real
                </span>
              </div>

              {/* Radio options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#2563EB] bg-blue-50/40 shadow-sm ring-2 ring-[#2563EB]/20'
                      : 'border-[#E2E8F0] hover:border-slate-300'
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 mb-2 ${paymentMethod === 'credit_card' ? 'text-[#2563EB]' : 'text-slate-400'}`}
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1F3A5F] block">
                      Cartão de Crédito
                    </span>
                    <span className="text-[10px] text-slate-500">Simulado</span>
                  </div>
                </button>

                {/* Pix */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-[#2563EB] bg-blue-50/40 shadow-sm ring-2 ring-[#2563EB]/20'
                      : 'border-[#E2E8F0] hover:border-slate-300'
                  }`}
                >
                  <QrCode
                    className={`w-5 h-5 mb-2 ${paymentMethod === 'pix' ? 'text-[#2563EB]' : 'text-slate-400'}`}
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1F3A5F] block">Pix</span>
                    <span className="text-[10px] text-slate-500">Simulado</span>
                  </div>
                </button>

                {/* Boleto */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('boleto')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'boleto'
                      ? 'border-[#2563EB] bg-blue-50/40 shadow-sm ring-2 ring-[#2563EB]/20'
                      : 'border-[#E2E8F0] hover:border-slate-300'
                  }`}
                >
                  <FileText
                    className={`w-5 h-5 mb-2 ${paymentMethod === 'boleto' ? 'text-[#2563EB]' : 'text-slate-400'}`}
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1F3A5F] block">Boleto</span>
                    <span className="text-[10px] text-slate-500">Simulado</span>
                  </div>
                </button>
              </div>

              {/* Conditional payment details */}
              {paymentMethod === 'credit_card' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 mt-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3A5F] mb-1">
                      Número do cartão (simulado)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-white focus:outline-none"
                    />
                    {errors.cardNumber && (
                      <p className="text-[10px] text-red-600 mt-0.5">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3A5F] mb-1">
                      Nome impresso no cartão
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="NOME COMO NO CARTAO"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-white focus:outline-none"
                    />
                    {errors.cardName && (
                      <p className="text-[10px] text-red-600 mt-0.5">{errors.cardName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1F3A5F] mb-1">
                        Validade (MM/AA)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-white focus:outline-none"
                      />
                      {errors.cardExpiry && (
                        <p className="text-[10px] text-red-600 mt-0.5">{errors.cardExpiry}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1F3A5F] mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-white focus:outline-none"
                      />
                      {errors.cardCvv && (
                        <p className="text-[10px] text-red-600 mt-0.5">{errors.cardCvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-1">
                  <p className="font-semibold text-[#1F3A5F]">
                    Pagamento Instantâneo via Pix (Simulado)
                  </p>
                  <p>
                    Em um cenário de produção com gateway integrado, um QR Code dinâmico do Banco
                    Central seria gerado para pagamento imediato. Nesta v1 com pagamento simulado,
                    seu pedido será aprovado instantaneamente.
                  </p>
                </div>
              )}

              {paymentMethod === 'boleto' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-1">
                  <p className="font-semibold text-[#1F3A5F]">Boleto Bancário (Simulado)</p>
                  <p>
                    Em ambiente de produção, um código de barras de compensação bancária seria
                    emitido com vencimento em até 3 dias úteis. Na versão simulada, seu pedido é
                    processado e aprovado de forma imediata para testes.
                  </p>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Li e concordo com os termos de contratação dos programas e consultorias da{' '}
                    <strong>A² Strategic Solutions</strong> e confirmo a simulação de pagamento v1.
                  </span>
                </label>
                {errors.acceptedTerms && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.acceptedTerms}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card-rest sticky top-28 space-y-6">
              <h2 className="text-base font-bold text-[#1F3A5F] pb-3 border-b border-slate-100">
                Resumo da Contratação
              </h2>

              {/* Items List */}
              <ul className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <li
                    key={product.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#1F3A5F] truncate">{product.title}</p>
                      <p className="text-slate-400">
                        Qtd: {quantity} × {formatBRL(product.price)}
                      </p>
                    </div>
                    <span className="font-bold text-[#1F3A5F] flex-shrink-0">
                      {formatBRL(product.price * quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Subtotals */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-700">{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Taxas & Frete</span>
                  <span className="font-semibold text-emerald-600 uppercase text-[11px]">
                    Grátis
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#1F3A5F]">Total</span>
                  <span className="text-2xl font-black text-[#1F3A5F]">{formatBRL(subtotal)}</span>
                </div>
              </div>

              {/* Confirm Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-[#1F3A5F] hover:bg-[#17304F] text-white font-bold text-sm shadow-btn-primary transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E1A63E]" />
                    <span>Processando simulação...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#E1A63E]" />
                    <span>Confirmar pedido (Simulado)</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-slate-400">
                Seu pedido será registrado e imediatamente disponibilizado em "Meus Pedidos".
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
