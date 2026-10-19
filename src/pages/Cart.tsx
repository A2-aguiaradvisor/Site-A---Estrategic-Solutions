import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { formatBRL } from '@/lib/formatters'
import { getProductImageUrl } from '@/services/products'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  PackageX,
  Lock,
} from 'lucide-react'

export default function Cart() {
  const { items, subtotal, itemCount, updateQuantity, removeFromCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Faça login para continuar',
        description:
          'É necessário ter uma conta para associar o seu pedido aos programas adquiridos.',
      })
      navigate('/entrar', { state: { from: { pathname: '/checkout' } } })
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 sm:py-32 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <PackageX className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3A5F] mb-3">
          Seu carrinho está vazio
        </h1>
        <p className="text-sm text-[#64748B] max-w-md mx-auto mb-8 leading-relaxed">
          Explore nossos programas de mentoria, cursos executivos e assessoria especializada para
          impulsionar seu negócio.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1F3A5F] hover:bg-[#17304F] text-white font-semibold text-sm shadow-btn-primary transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explorar produtos</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3A5F]">Meu Carrinho</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Revise suas soluções executivas antes de prosseguir para o checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart items */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-card-rest">
            <div className="p-4 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1F3A5F]">
              <span>
                Soluções ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
              </span>
              <span className="hidden sm:inline">Total por item</span>
            </div>

            <ul className="divide-y divide-[#E2E8F0]">
              {items.map(({ product, quantity }) => {
                const imageUrl = getProductImageUrl(product)
                const lineTotal = product.price * quantity

                return (
                  <li
                    key={product.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    {/* Item Image */}
                    <Link
                      to={`/produto/${product.id}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200"
                    >
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block mb-1">
                        {product.category}
                      </span>
                      <Link to={`/produto/${product.id}`}>
                        <h3 className="text-base font-bold text-[#1F3A5F] hover:text-[#2563EB] transition-colors truncate">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Unitário: {formatBRL(product.price)}
                      </p>

                      {/* Controls mobile */}
                      <div className="flex sm:hidden items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center border border-[#E2E8F0] rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1.5 text-slate-500 hover:text-[#1F3A5F]"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#1F3A5F]">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1.5 text-slate-500 hover:text-[#1F3A5F]"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-extrabold text-[#1F3A5F]">
                          {formatBRL(lineTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls desktop */}
                    <div className="hidden sm:flex items-center gap-6">
                      <div className="flex items-center border border-[#E2E8F0] rounded-lg bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-2 text-slate-500 hover:text-[#1F3A5F] transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#1F3A5F] min-w-[28px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-2 text-slate-500 hover:text-[#1F3A5F] transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[100px]">
                        <span className="text-base font-extrabold text-[#1F3A5F] block">
                          {formatBRL(lineTotal)}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-slate-400 hover:text-[#DC2626] transition-colors rounded-lg hover:bg-red-50"
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Delete mobile */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="sm:hidden self-end text-xs text-red-600 flex items-center gap-1 mt-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/"
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              ← Continuar comprando
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card-rest sticky top-28 space-y-6">
            <h2 className="text-lg font-bold text-[#1F3A5F] pb-3 border-b border-slate-100">
              Resumo do pedido
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1F3A5F]">{formatBRL(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frete (produtos digitais)</span>
                <span className="font-semibold text-emerald-600 uppercase text-xs">Grátis</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-base font-bold text-[#1F3A5F]">Total</span>
                <span className="text-2xl font-black text-[#1F3A5F] tracking-tight">
                  {formatBRL(subtotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-4 px-6 rounded-xl bg-[#1F3A5F] hover:bg-[#17304F] text-white font-bold text-sm shadow-btn-primary transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Lock className="w-4 h-4 text-[#E1A63E]" />
              <span>Finalizar compra</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/"
                className="text-xs text-slate-500 hover:text-[#2563EB] transition-colors"
              >
                Continuar comprando
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Simulação segura v1.0 — nenhuma cobrança bancária real</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
