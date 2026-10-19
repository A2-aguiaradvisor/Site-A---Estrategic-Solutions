import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import type { Product } from '@/types'
import { getProducts } from '@/services/products'
import { ProductCard } from '@/components/ProductCard'
import { ServiceFronts } from '@/components/ServiceFronts'
import {
  Layers,
  Sparkles,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Loader2,
  PackageSearch,
  ArrowRight,
} from 'lucide-react'

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('categoria') || 'Todos'

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const list = await getProducts()
        if (mounted) setProducts(list)
      } catch (err) {
        console.error('Erro ao carregar catálogo:', err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // Sync category state with query param if it changes externally
  useEffect(() => {
    const cat = searchParams.get('categoria')
    if (cat) {
      setSelectedCategory(cat)
    }
  }, [searchParams])

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat)
    if (cat === 'Todos') {
      searchParams.delete('categoria')
      setSearchParams(searchParams, { replace: true })
    } else {
      setSearchParams({ categoria: cat }, { replace: true })
    }
  }

  const categories = ['Todos', 'Produto de Entrada', 'Box', 'Curso', 'Mentoria', 'Serviços']

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Todos' || p.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesQuery =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24">
      {/* Header Banner - LeverPro Style Navy Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1526] via-[#0F1E36] to-[#1F3A5F] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_50%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1A63E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-4 text-xs font-semibold text-[#E1A63E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portfólio de Soluções Estratégicas & Financeiras</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Catálogo Oficial de Soluções
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Modelagem financeira, controladoria estratégica, automação analítica, FP&A e mentoria
              executiva estruturadas no padrão institucional da{' '}
              <strong>A² Strategic Solutions</strong>.
            </p>
          </div>

          {/* Quick Metrics Bar LeverPro-style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#E1A63E] mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Governança</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">Padrão CFO</p>
              <p className="text-[11px] text-slate-400">Frameworks validados</p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Valuation</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">+3.2x ROI</p>
              <p className="text-[11px] text-slate-400">Médio reportado por clientes</p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Segurança</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">100%</p>
              <p className="text-[11px] text-slate-400">Sigilo & conformidade LGPD</p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-300 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Disponibilidade</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">Imediata</p>
              <p className="text-[11px] text-slate-400">Acesso pós-confirmação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-card-hover border border-[#E2E8F0] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por programa, mentoria, curso..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#0F1E36] text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F1E36]">
              {selectedCategory === 'Todos'
                ? 'Todos os Produtos'
                : `Categoria: ${selectedCategory}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'solução disponível' : 'soluções disponíveis'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Layers className="w-4 h-4 text-[#2563EB]" />
            <span className="hidden sm:inline">Exibindo catálogo completo</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">Carregando catálogo oficial...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto border border-[#E2E8F0] shadow-sm">
            <PackageSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0F1E36] mb-1">Nenhum programa encontrado</h3>
            <p className="text-xs text-slate-500 mb-6">
              Não encontramos resultados para os filtros selecionados. Tente buscar com outro termo.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todos')
                setSearchQuery('')
              }}
              className="px-5 py-2.5 bg-[#0F1E36] text-white rounded-xl text-xs font-bold hover:bg-[#1F3A5F] transition-colors"
            >
              Resetar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}

        {/* Four Service Fronts Institutional Section */}
        <div className="mt-20 pt-12 border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-2 block">
              Estrutura Institucional
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1E36] mb-3">
              As Quatro Frentes de Atuação
            </h2>
            <p className="text-sm text-slate-600">
              Conheça a arquitetura completa das frentes de consultoria e soluções analíticas da A²
              Strategic Solutions.
            </p>
          </div>
          <ServiceFronts variant="light" showStatement={true} />
        </div>

        {/* Bottom Institutional Info Banner */}
        <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#0F1E36] to-[#1F3A5F] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-700">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E1A63E]">
              Apresentação Institucional
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Demanda de projetos corporativos ou assessoria continuada?
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Estruturamos atuações modulares nas frentes de Modelagem Financeira, Controle de
              Processos, BI e FP&A com governança de padrão executivo.
            </p>
          </div>
          <Link
            to="/produto/servicos-consultoria-apresentacao-institucional"
            className="flex-shrink-0 px-6 py-3.5 bg-white text-[#0F1E36] hover:bg-slate-100 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
          >
            <span>Ver detalhes dos Serviços</span>
            <ArrowRight className="w-4 h-4 text-[#2563EB]" />
          </Link>
        </div>
      </div>
    </div>
  )
}
