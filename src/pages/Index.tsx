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
import { Reveal } from '@/components/home/Reveal'
import { HeroChart } from '@/components/home/HeroChart'
import { CredibilityCounters } from '@/components/home/CredibilityCounters'
import { ServiceFrontsInfographic } from '@/components/home/ServiceFrontsInfographic'

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
      {/* ───────────────────────── Hero (navy profundo, referência Dribbble) ───────────────────────── */}
      <section className="relative overflow-hidden bg-[#030C1E] text-white pt-24 pb-20 sm:pt-32 sm:pb-28 border-b border-slate-800">
        {/* Decorative glows & grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.28),transparent_65%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#E1A63E]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] bg-[size:44px_44px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-16 sm:mb-20">
            {/* Left: headline & CTAs */}
            <div className="lg:col-span-6 space-y-8">
              <Reveal direction="up">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#E1A63E]" />
                  <span className="text-xs font-bold tracking-widest text-slate-100 uppercase">
                    A² Strategic Solutions
                  </span>
                </div>
              </Reveal>

              {/* Impactful Headline in Brand Navy & Gold */}
              <Reveal direction="up" delay={120}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
                  Controladoria Estratégica &{' '}
                  <span className="bg-gradient-to-r from-[#E1A63E] via-amber-200 to-[#E1A63E] bg-clip-text text-transparent drop-shadow-sm">
                    Modelagem Financeira
                  </span>
                </h1>
              </Reveal>

              {/* Product ladder quick chips */}
              <Reveal direction="up" delay={240}>
                <div className="flex flex-wrap items-center gap-2 max-w-xl text-xs">
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
              </Reveal>

              {/* Action Buttons */}
              <Reveal direction="up" delay={360}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={scrollToProducts}
                    className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1E36] font-bold text-sm shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    <span>Conhecer a Escada de Soluções</span>
                    <ArrowRight className="w-4 h-4 text-[#2563EB]" />
                  </button>
                  <Link
                    to="/catalogo"
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-blue-500 hover:to-blue-700 text-white font-bold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>Ver Catálogo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right: animated financial chart panel */}
            <Reveal direction="left" delay={200} className="lg:col-span-6">
              <div className="relative rounded-2xl border border-slate-700/70 bg-[#0A1526]/80 backdrop-blur-md p-4 sm:p-6 shadow-2xl">
                <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#E1A63E]/70 to-transparent" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 hero-pulse-dot" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
                      Receita & EBITDA • Simulação 12M
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E1A63E]/15 text-[#E1A63E] border border-[#E1A63E]/30">
                    A² Engine
                  </span>
                </div>
                <div className="relative">
                  <HeroChart />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Interactive Technology Showcase (Hero Interactive Dashboard) */}
          <Reveal direction="up" delay={150}>
            <div className="max-w-5xl mx-auto">
              <FinancialInteractiveDashboard
                title="A² Strategic Engine • Simulação Executiva em Tempo Real"
                defaultPeriod="12M"
              />
            </div>
          </Reveal>
        </div>
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
      <section className="py-20 bg-[#0B1527] text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.15),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left explanation */}
            <Reveal direction="right" className="lg:col-span-5 space-y-6">
              <div className="space-y-6">
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
                        Simulação de cenários (Conservador, Base, Otimista) com testes de estresse
                        de liquidez.
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
                        Alçadas de aprovação, auditoria de processos e segregação estrita de
                        funções.
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
            </Reveal>

            {/* Right Video Embed */}
            <Reveal direction="left" delay={150} className="lg:col-span-7">
              <div>
                <TechDemoVideoEmbed />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

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
