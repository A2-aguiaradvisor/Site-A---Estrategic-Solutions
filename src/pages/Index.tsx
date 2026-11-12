import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { getProducts } from '@/services/products'
import { ProductCard } from '@/components/ProductCard'
import { FinancialInteractiveDashboard } from '@/components/FinancialInteractiveDashboard'
import { useAuth } from '@/contexts/AuthContext'
import {
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Layers,
  Loader2,
  PackageSearch,
} from 'lucide-react'
import { Reveal } from '@/components/home/Reveal'
import { HeroSection } from '@/components/home/HeroSection'
import { CredibilityCounters } from '@/components/home/CredibilityCounters'
import { ServiceFrontsInfographic } from '@/components/home/ServiceFrontsInfographic'
import { DashboardBuildShowcase } from '@/components/home/DashboardBuildShowcase'

export default function Index() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const { isAuthenticated } = useAuth()

  // Desired ordering for the product ladder
  const ladderOrder: Record<string, number> = {
    'planilha-modelo-faturamento-prompt-financeiro': 1,
    'impacto-precificacao-reforma-tributaria-planilha': 2,
    'box-analista-financeiro-modelagem': 3,
    'curso-controladoria-estrategica': 4,
    'mentoria-executiva': 5,
    'servicos-consultoria-apresentacao-institucional': 6,
  }

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const list = await getProducts()
        if (mounted) {
          const sorted = [...list].sort((a, b) => {
            const orderA = ladderOrder[a.slug] ?? 99
            const orderB = ladderOrder[b.slug] ?? 99
            return orderA - orderB
          })
          setProducts(sorted)
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

  const categories = ['Todos', 'Produto de Entrada', 'Box', 'Curso', 'Mentoria', 'Serviços']

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
      {/* ───────────────────────── Hero v2 (canvas animado, contadores, navy profundo) ───────────────────────── */}
      <HeroSection />

      {/* Interactive Technology Showcase (Hero Interactive Dashboard) */}
      <section className="bg-[#030C1E] pb-20 sm:pb-28 border-b border-slate-800">
        <Reveal direction="up" delay={150}>
          <div className="max-w-5xl mx-auto px-4">
            <FinancialInteractiveDashboard
              title="A² Strategic Engine • Simulação Executiva em Tempo Real"
              defaultPeriod="12M"
            />
          </div>
        </Reveal>
      </section>

      {/* Credibility counters (apenas fatos já presentes no site) */}
      <CredibilityCounters />

      {/* Trust Pillars */}
      <section className="bg-white border-b border-[#E2E8F0] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {[
              {
                icon: TrendingUp,
                title: 'Modelagem & FP&A',
                text: 'Projeções plurianuais, testes de estresse de liquidez, Budget e Rolling Forecast.',
                iconColor: 'text-[#2563EB]',
              },
              {
                icon: Award,
                title: 'Controle & Processos',
                text: 'Fluxo de caixa projetado vs. realizado, alçadas de aprovação e fechamento estruturado.',
                iconColor: 'text-[#E1A63E]',
              },
              {
                icon: BookOpen,
                title: 'Automação & BI',
                text: 'Dashboards executivos, integração de ERPs e painéis dinâmicos de DRE e EBITDA.',
                iconColor: 'text-[#2563EB]',
              },
            ].map((pillar, i) => {
              const PillarIcon = pillar.icon
              return (
                <Reveal key={pillar.title} delay={i * 130}>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 h-full transition-all duration-300 hover:shadow-md hover:border-slate-200">
                    <div className="w-12 h-12 rounded-xl bg-[#1F3A5F]/10 text-[#1F3A5F] flex items-center justify-center flex-shrink-0">
                      <PillarIcon className={`w-6 h-6 ${pillar.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1F3A5F]">{pillar.title}</h4>
                      <p className="text-xs text-[#64748B]">{pillar.text}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produtos" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <Reveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-2 block">
                Escada de Soluções
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F1E36] mb-4">
                Produtos & Programas Oficiais
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#2563EB] to-[#E1A63E] mx-auto rounded-full mb-4" />
              <p className="text-base text-[#64748B]">
                Catálogo compacto com soluções de entrada, Box analítico, curso de controladoria,
                mentoria individual e consultoria institucional.
              </p>

              {/* Category filter pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-[#0F1E36] text-white shadow-sm scale-105'
                        : 'bg-white text-slate-600 border border-[#E2E8F0] hover:border-slate-300 hover:scale-105'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Grid or Empty / Loading State */}
          {isLoading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">Carregando catálogo de soluções...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto border border-[#E2E8F0]">
              <PackageSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#0F1E36] mb-1">
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
                <Reveal key={product.id} delay={(idx % 3) * 120}>
                  <ProductCard product={product} index={idx} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Four Service Fronts — Interactive Infographic */}
      <section className="py-20 bg-[#070D18] text-white border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.18),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#E1A63E] uppercase tracking-wider mb-3">
                <Layers className="w-3.5 h-3.5" />
                Portfólio Institucional
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                Quatro Frentes Estruturais de Atuação
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Conheça as frentes modulares da A² Strategic Solutions, desenhadas para elevar a
                maturidade analítica e operacional da gestão financeira.
              </p>
            </div>
          </Reveal>

          <ServiceFrontsInfographic />
        </div>
      </section>

      {/* Video & Platform Walkthrough Section */}
      <DashboardBuildShowcase />

      {/* CTA Section */}
      <section className="hero-gradient text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal direction="up">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-white">
              Pronto para acelerar seus resultados?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Nossa equipe de consultoria está pronta para apoiar cada estágio do seu crescimento
              com inteligência de mercado e excelência técnica.
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
          </Reveal>
        </div>
      </section>
    </div>
  )
}
