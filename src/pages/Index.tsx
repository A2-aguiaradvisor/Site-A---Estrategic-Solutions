import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { getProducts } from '@/services/products'
import { ProductCard } from '@/components/ProductCard'
import { useAuth } from '@/contexts/AuthContext'
import {
  TrendingUp,
  Award,
  BookOpen,
  ArrowDown,
  Sparkles,
  Loader2,
  PackageSearch,
} from 'lucide-react'

export default function Index() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const list = await getProducts()
        if (mounted) {
          setProducts(list)
        }
      } catch (err) {
        console.error('Falha ao carregar catálogo:', err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  const categories = ['Todos', 'Mentoria', 'Curso', 'E-book', 'Serviço']

  const filteredProducts =
    selectedCategory === 'Todos'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const scrollToProducts = () => {
    const el = document.getElementById('produtos')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient text-white py-24 sm:py-32 lg:py-40">
        {/* Subtle decorative grid/glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.25),transparent_50%)] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#E1A63E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#E1A63E]" />
            <span className="text-xs font-semibold tracking-wider text-slate-100 uppercase">
              Consultoria & Educação Digital
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Mentoria e soluções de alto impacto para o seu{' '}
            <span className="bg-gradient-to-r from-blue-300 via-white to-[#E1A63E] bg-clip-text text-transparent">
              crescimento
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-10">
            Programas de mentoria, assessoria e materiais exclusivos da Aguiar Advisory para
            acelerar seus resultados corporativos e financeiros.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToProducts}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#1F3A5F] font-bold text-sm shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <span>Ver produtos</span>
              <ArrowDown className="w-4 h-4" />
            </button>
            {!isAuthenticated && (
              <Link
                to="/criar-conta"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur-md transition-all duration-200"
              >
                Criar conta executiva
              </Link>
            )}
          </div>

          {/* Abstract upward-trending line graphic (SVG) */}
          <div className="mt-16 sm:mt-20 pt-8 border-t border-white/10 flex items-center justify-center">
            <svg
              viewBox="0 0 600 80"
              fill="none"
              className="w-full max-w-lg h-16 opacity-75 text-[#E1A63E]"
            >
              <defs>
                <linearGradient
                  id="lineGrad"
                  x1="0"
                  y1="0"
                  x2="600"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2563EB" stopOpacity="0.2" />
                  <stop offset="0.5" stopColor="#E1A63E" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#10B981" />
                </linearGradient>
              </defs>
              <path
                d="M 10,70 Q 150,65 240,40 T 450,25 T 590,10"
                stroke="url(#lineGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="590" cy="10" r="5" fill="#10B981" />
            </svg>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="bg-white border-b border-[#E2E8F0] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-[#1F3A5F]/10 text-[#1F3A5F] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1F3A5F]">Visão Estratégica</h4>
                <p className="text-xs text-[#64748B]">
                  Metodologias aplicadas com foco em tração, governança e valor.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-[#1F3A5F]/10 text-[#1F3A5F] flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-[#E1A63E]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1F3A5F]">Assessoria Sênior</h4>
                <p className="text-xs text-[#64748B]">
                  Atendimento direto com consultores especialistas em finanças corporativas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-[#1F3A5F]/10 text-[#1F3A5F] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1F3A5F]">Educação Executiva</h4>
                <p className="text-xs text-[#64748B]">
                  Planilhas, cursos e livros práticos com aplicação corporativa imediata.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produtos" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-2 block">
              Catálogo Oficial
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F3A5F] mb-4">
              Nossos Produtos & Programas
            </h2>
            <div className="w-20 h-1 bg-[#2563EB] mx-auto rounded-full mb-4" />
            <p className="text-base text-[#64748B]">
              Selecione o programa ideal para transformar a governança e acelerar a maturidade
              financeira do seu negócio.
            </p>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1F3A5F] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-[#E2E8F0] hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid or Empty / Loading State */}
          {isLoading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">Carregando catálogo de soluções...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto border border-[#E2E8F0]">
              <PackageSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#1F3A5F] mb-1">
                Nenhum produto nesta categoria
              </h3>
              <p className="text-xs text-[#64748B] mb-4">
                Explore outras áreas do nosso catálogo para encontrar a mentoria ideal.
              </p>
              <button
                onClick={() => setSelectedCategory('Todos')}
                className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Ver todos os produtos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-white">
            Pronto para acelerar seus resultados?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Nossa equipe de consultoria está pronta para apoiar cada estágio do seu crescimento com
            inteligência de mercado e excelência técnica.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isAuthenticated ? (
              <Link
                to="/criar-conta"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#1F3A5F] font-bold text-sm shadow-lg transition-all"
              >
                Criar conta
              </Link>
            ) : (
              <button
                onClick={scrollToProducts}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#1F3A5F] font-bold text-sm shadow-lg transition-all"
              >
                Ver produtos
              </button>
            )}
            <button
              onClick={scrollToProducts}
              className="w-full sm:w-auto px-8 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 font-bold text-sm transition-all"
            >
              Explorar soluções
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
