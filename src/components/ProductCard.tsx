import React from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { formatBRL } from '@/lib/formatters'
import { getProductImageUrl } from '@/services/products'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/hooks/use-toast'
import { ShoppingBag, ArrowRight } from 'lucide-react'

interface ProductCardProps {
  product: Product
  index?: number
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'Produto de Entrada': {
    bg: 'bg-blue-50 text-blue-700 border border-blue-200',
    text: 'text-blue-700',
  },
  Box: { bg: 'bg-indigo-50 text-indigo-700 border border-indigo-200', text: 'text-indigo-700' },
  Curso: {
    bg: 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20',
    text: 'text-[#2563EB]',
  },
  Mentoria: {
    bg: 'bg-[#1F3A5F]/10 text-[#1F3A5F] border border-[#1F3A5F]/20',
    text: 'text-[#1F3A5F]',
  },
  Serviços: { bg: 'bg-amber-50 text-amber-800 border border-amber-200', text: 'text-amber-800' },
  // Legacy safety
  'E-book': { bg: 'bg-amber-50 text-amber-700', text: 'text-amber-700' },
  Serviço: { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700' },
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const imageUrl = getProductImageUrl(product)

  const catStyle = categoryColors[product.category] || {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast({
      title: 'Adicionado ao carrinho!',
      description: `${product.title} foi adicionado.`,
    })
  }

  return (
    <div
      className="group flex flex-col bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-card-rest hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Product Image / Technological Dashboard Container */}
      <Link
        to={`/produto/${product.id}`}
        className="relative aspect-[16/10] overflow-hidden bg-[#0F1E36] block"
      >
        <img
          src={imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
        />

        {/* Technological HUD overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1526] via-transparent to-black/30 pointer-events-none" />

        {/* Live metric badge overlay */}
        <div className="absolute bottom-2.5 right-3 bg-black/75 backdrop-blur-md border border-white/15 px-2 py-0.5 rounded-md text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE KPI</span>
        </div>

        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm ${catStyle.bg} ${catStyle.text} backdrop-blur-md`}
          >
            {product.category}
          </span>
        </div>
      </Link>

      {/* Product Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          <Link to={`/produto/${product.id}`}>
            <h3 className="text-lg font-bold text-[#1F3A5F] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug mb-2">
              {product.title}
            </h3>
          </Link>
          <p className="text-sm text-[#64748B] line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price */}
          <div className="pt-3 border-t border-slate-100 mb-4">
            <span className="text-xs text-[#64748B] block">Investimento</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#1F3A5F] tracking-tight">
                {formatBRL(product.price)}
              </span>
            </div>
          </div>

          {/* Buttons: Add to cart & View details */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold text-xs transition-all active:scale-95 shadow-sm"
              aria-label={`Adicionar ${product.title} ao carrinho`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>

            <Link
              to={`/produto/${product.id}`}
              className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#1F3A5F] font-semibold text-xs transition-colors"
            >
              <span>Detalhes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
