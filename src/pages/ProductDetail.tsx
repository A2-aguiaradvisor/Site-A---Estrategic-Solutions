import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import type { Product } from '@/types'
import { getProductByIdOrSlug, getProductImageUrl } from '@/services/products'
import { formatBRL } from '@/lib/formatters'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/hooks/use-toast'
import { ProductDashboardMockup } from '@/components/ProductDashboardMockup'
import {
  ShoppingBag,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Users,
  FileCheck2,
  Loader2,
  Calendar,
  BarChart3,
  Sparkles,
} from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    async function load() {
      if (!id) return
      setIsLoading(true)
      try {
        const item = await getProductByIdOrSlug(id)
        if (mounted) {
          setProduct(item)
        }
      } catch (err) {
        console.error('Erro ao buscar produto:', err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin mb-4" />
        <p className="text-sm text-[#64748B]">Carregando detalhes do programa...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#1F3A5F] mb-3">Produto não encontrado</h2>
        <p className="text-sm text-slate-600 mb-6">
          O produto ou programa que você procura não existe ou foi descontinuado.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1F3A5F] text-white text-sm font-semibold hover:bg-[#17304F]"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const imageUrl = getProductImageUrl(product)
  const whatsIncludedList = product.whats_included
    ? product.whats_included.split('\n').filter((line) => line.trim().length > 0)
    : []

  const handleAddToCart = () => {
    addToCart(product, 1)
    toast({
      title: 'Adicionado ao carrinho!',
      description: `${product.title} foi adicionado com sucesso.`,
    })
  }

  const handleBuyNow = () => {
    addToCart(product, 1)
    navigate('/checkout')
  }

  return (
    <div className="bg-[#F8FAFC] pb-24">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-[#2563EB] transition-colors">
              Catálogo
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400" />
            <span className="text-slate-400">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400" />
            <span className="text-[#1F3A5F] font-semibold truncate max-w-xs sm:max-w-md">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Product Image + Technological Interactive Dashboard Mockup */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-card-rest">
              <div className="relative aspect-[16/11] bg-[#0F1E36] overflow-hidden">
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#0F1E36]/90 border border-white/20 text-white shadow-md backdrop-blur-md">
                    {product.category}
                  </span>
                  <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-[#E1A63E] text-slate-950 shadow-md">
                    A² Strategic
                  </span>
                </div>
              </div>

              {/* Highlights strip below image */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/60 grid grid-cols-2 gap-4 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Acesso imediato pós-confirmação</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span>Suporte institucional A² Strategic Solutions</span>
                </div>
              </div>
            </div>

            {/* Embedded Live Dashboard Preview (Interactive) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F1E36] flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#2563EB]" />
                  Painel Analítico Aplicado a este Programa
                </span>
                <span className="text-[11px] text-[#B47517] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Interativo
                </span>
              </div>
              <ProductDashboardMockup
                variant={
                  product.category === 'Mentoria'
                    ? 'mentoria'
                    : product.category === 'Curso'
                      ? 'curso'
                      : 'valuation'
                }
              />
            </div>
          </div>

          {/* Right: Info & Purchase actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block mb-2">
                {product.category} • Programa Oficial
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1F3A5F] leading-tight mb-4">
                {product.title}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-card-rest">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                Investimento
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#1F3A5F] tracking-tight">
                  {formatBRL(product.price)}
                </span>
                <span className="text-xs text-slate-500 font-medium">à vista</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium mt-1">
                Parcelamento em até 12x no cartão de crédito (simulado)
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#1F3A5F] hover:bg-[#17304F] text-white font-bold text-sm shadow-btn-primary transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar ao carrinho</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border-2 border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-bold text-sm transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Comprar agora</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400 mt-4">
                Pagamento seguro simulado • Nenhum dado financeiro real será cobrado nesta versão
              </p>
            </div>

            {/* Structured Details Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card-rest space-y-6">
              <h3 className="text-base font-bold text-[#1F3A5F] pb-3 border-b border-slate-100">
                Sobre este produto
              </h3>

              {/* Long description */}
              {product.long_description && (
                <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                  <p>{product.long_description}</p>
                </div>
              )}

              {/* O que está incluído */}
              {whatsIncludedList.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-[#1F3A5F] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                    O que está incluído
                  </h4>
                  <ul className="space-y-2.5">
                    {whatsIncludedList.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E1A63E] mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Para quem é */}
              {product.for_whom && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-[#1F3A5F] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#2563EB]" />
                    Para quem é
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{product.for_whom}</p>
                </div>
              )}

              {/* Requisitos */}
              {product.requirements && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-[#1F3A5F] flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#2563EB]" />
                    Requisitos recomendados
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{product.requirements}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] p-4 shadow-modal">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Total</span>
            <span className="text-lg font-bold text-[#1F3A5F]">{formatBRL(product.price)}</span>
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-xs justify-end">
            <button
              onClick={handleAddToCart}
              className="py-2.5 px-4 rounded-lg border border-[#2563EB] text-[#2563EB] text-xs font-bold hover:bg-blue-50"
            >
              Adicionar
            </button>
            <button
              onClick={handleBuyNow}
              className="py-2.5 px-4 rounded-lg bg-[#1F3A5F] text-white text-xs font-bold shadow-sm"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
