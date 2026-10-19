import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { getProducts } from '@/services/products'
import { ProductCard } from '@/components/ProductCard'
import { FinancialInteractiveDashboard } from '@/components/FinancialInteractiveDashboard'
import { TechDemoVideoEmbed } from '@/components/TechDemoVideoEmbed'
import { useAuth } from '@/contexts/AuthContext'
import {
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Loader2,
  PackageSearch,
  FileSpreadsheet,
  Boxes,
  GraduationCap,
  Users2,
  Briefcase,
} from 'lucide-react'
import { ServiceFronts } from '@/components/ServiceFronts'

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
      {/* High-Tech Hero Section with Interactive Dashboard (LeverPro Benchmark Polish) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#070D18] via-[#0B1527] to-[#0F1E36] text-white pt-24 pb-20 sm:pt-32 sm:pb-28 border-b border-slate-800">
        {/* Subtle decorative high-tech matrix grid and glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.28),transparent_65%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#E1A63E]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-14">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E1A63E]" />
              <span className="text-xs font-bold tracking-widest text-slate-100 uppercase">
                A² Strategic Solutions • Strategic Controller Advisory
              </span>
            </div>

            {/* Factual Headline derived from real offerings */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08] mb-6">
              Soluções integradas em{' '}
              <span className="bg-gradient-to-r from-blue-200 via-[#E1A63E] to-amber-200 bg-clip-text text-transparent">
                Controladoria Estratégica,
              </span>{' '}
              Modelagem e Gestão Financeira.
            </h1>

            {/* Factual Subheadline referencing real product ladder */}

            {/* Product ladder quick chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-2xl mx-auto text-xs">
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#E1A63E]" />
                Produtos de Entrada
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-blue-400" />
                Box Modelagem
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                Curso de Controladoria
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5 text-amber-300" />
                Mentoria Executiva
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                Serviços Institucionais
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={scrollToProducts}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1E36] font-bold text-sm shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>Conhecer a Escada de Soluções</span>
                <ArrowRight className="w-4 h-4 text-[#2563EB]" />
              </button>
              <Link
                to="/catalogo"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-blue-500 hover:to-blue-700 text-white font-bold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Technology Showcase (Hero Interactive Dashboard) */}
          <div className="max-w-5xl mx-auto mt-6">
            <FinancialInteractiveDashboard
              title="A² Strategic Engine • Simulação Executiva em Tempo Real"
              defaultPeriod="12M"
            />
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
                <h4 className="text-sm font-bold text-[#1F3A5F]">Modelagem & FP&A</h4>
                <p className="text-xs text-[#64748B]">
                  Projeções plurianuais, testes de estresse de liquidez, Budget e Rolling Forecast.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-[#1F3A5F]/10 text-[#1F3A5F] flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-[#E1A63E]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1F3A5F]">Controle & Processos</h4>
                <p className="text-xs text-[#64748B]">
                  Fluxo de caixa projetado vs. realizado, alçadas de aprovação e fechamento
                  estruturado.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-[#1F3A5F]/10 text-[#1F3A5F] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1F3A5F]">Automação & BI</h4>
                <p className="text-xs text-[#64748B]">
                  Dashboards executivos, integração de ERPs e painéis dinâmicos de DRE e EBITDA.
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
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-2 block">
              Escada de Soluções
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F1E36] mb-4">
              Produtos & Programas Oficiais
            </h2>
            <div className="w-20 h-1 bg-[#2563EB] mx-auto rounded-full mb-4" />
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0F1E36] text-white shadow-sm'
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
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Four Service Fronts Section (Institutional Presentation) */}
      <section className="py-20 bg-[#070D18] text-white border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.18),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

          <ServiceFronts variant="dark" showStatement={true} />
        </div>
      </section>

      {/* Video & Platform Walkthrough Section (LeverPro Benchmark Section) */}
      <section className="py-20 bg-[#0B1527] text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.15),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left explanation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#E1A63E] uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                Tecnologia & Fechamento Ágil
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Veja a inteligência estratégica acontecendo na prática.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                A <strong>A² Strategic Solutions</strong> combina rotinas de controladoria com
                modelos analíticos e visões interativas que conferem agilidade ao fechamento
                contábil e gerencial.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">DRE Gerencial em Minutos</h4>
                    <p className="text-xs text-slate-400">
                      Orçado vs. Realizado consolidado por centros de custo e unidades de negócio.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#E1A63E] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Valuation & Cenários Operacionais
                    </h4>
                    <p className="text-xs text-slate-400">
                      Simulação de cenários (Conservador, Base, Otimista) com testes de estresse de
                      liquidez.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Governança & Políticas Internas
                    </h4>
                    <p className="text-xs text-slate-400">
                      Alçadas de aprovação, auditoria de processos e segregação estrita de funções.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/catalogo"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#E1A63E] hover:text-yellow-300 transition-colors"
                >
                  <span>Conhecer todos os pacotes e mentoria</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Video Embed */}
            <div className="lg:col-span-7">
              <TechDemoVideoEmbed />
            </div>
          </div>
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
