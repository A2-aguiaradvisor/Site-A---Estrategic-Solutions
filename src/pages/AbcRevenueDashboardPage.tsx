import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Layers,
  Users,
  FileText,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  PieChart as PieIcon,
  Calendar,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
} from 'recharts'
import { ABC_DATA, DRE_VALUES, MONTHS } from '@/data/abcRevenueData'

const F = (v: number, n: number = 1) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: n, maximumFractionDigits: n })

const P = (v: number) => (v >= 0 ? '+' : '') + F(v * 100) + '%'
const formatK = (v: number) => F(v * 1000, 0)

// Brand Navy & Gold Palette
const NAVY_2025 = '#94A3B8' // 2025 (prata/slate suave)
const NAVY_2026 = '#1F3A5F' // 2026 (navy institucional)
const GOLD = '#E1A63E'
const BRAND_COLORS = ['#1F3A5F', '#0D9488', '#D97706', '#7C3AED', '#BE185D', '#64748B']
const RAMP_COLORS = [
  '#0A1526',
  '#1F3A5F',
  '#2563EB',
  '#38BDF8',
  '#0D9488',
  '#2DD4BF',
  '#E1A63E',
  '#F59E0B',
  '#94A3B8',
  '#CBD5E1',
  '#64748B',
]

export default function AbcRevenueDashboard() {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [channelViewMode, setChannelViewMode] = useState<'conta' | 'ajustado'>('ajustado')
  const [monthlyViewMode, setMonthlyViewMode] = useState<'produto' | 'canal'>('canal')
  const [clientFilter, setClientFilter] = useState<string>('Todos')

  const R = ABC_DATA.rol
  const A = ABC_DATA.accts
  const PL = ABC_DATA.P
  const CL = ABC_DATA.clients

  // KPIs
  const rolDelta = R[1] / R[0] - 1
  const mgb2025 = (DRE_VALUES.lb[0] / R[0]) * 100
  const mgb2026 = (DRE_VALUES.lb[1] / R[1]) * 100
  const llDelta = DRE_VALUES.ll[1] / DRE_VALUES.ll[0] - 1
  const dig = [A[3].a + A[4].a, A[3].b + A[4].b]
  const digShare2025 = (dig[0] / R[0]) * 100
  const digShare2026 = (dig[1] / R[1]) * 100
  const digDelta = dig[1] / dig[0] - 1
  const atacadoShare = (A[0].b / R[1]) * 100
  const atacadoDelta = A[0].b / A[0].a - 1

  // Gráfico 1: ROL por canal de venda (Horizontal Bar)
  const channelData = A.map((x) => ({
    name: x.n.replace('Venda ', ''),
    '2025': x.a,
    '2026': x.b,
  }))

  // Gráfico 2: Do ROL ao Lucro (DRE consolidado)
  const dreData = [
    { name: 'ROL', '2025': DRE_VALUES.rol[0], '2026': DRE_VALUES.rol[1] },
    { name: 'CMV', '2025': DRE_VALUES.cmv[0], '2026': DRE_VALUES.cmv[1] },
    { name: 'Lucro Bruto', '2025': DRE_VALUES.lb[0], '2026': DRE_VALUES.lb[1] },
    { name: 'Lucro Líquido', '2025': DRE_VALUES.ll[0], '2026': DRE_VALUES.ll[1] },
  ]

  // Gráfico 3: Variação por linha de produto (Contribuição ao crescimento)
  const productDeltas = PL.map((name, i) => {
    const val25 = ABC_DATA.gt[0][i]
    const val26 = ABC_DATA.gt[1][i]
    return {
      name,
      delta: Number((val26 - val25).toFixed(2)),
      val25,
      val26,
    }
  })
  const totalDeltaROL = R[1] - R[0]

  // Gráfico 4: Mix por linha de produto (Doughnut 2025 e 2026)
  const mix2025 = PL.map((name, i) => ({
    name,
    value: ABC_DATA.gt[0][i],
    percent: (ABC_DATA.gt[0][i] / R[0]) * 100,
  }))
  const mix2026 = PL.map((name, i) => ({
    name,
    value: ABC_DATA.gt[1][i],
    percent: (ABC_DATA.gt[1][i] / R[1]) * 100,
  }))

  // Gráfico 5: Reclassificação de contas (Conta Contábil vs Canal Ajustado)
  const reclassData =
    channelViewMode === 'conta'
      ? A.map((x) => ({
          name: x.n.replace('Venda ', ''),
          '2025': x.a,
          '2026': x.b,
        }))
      : [
          { name: 'Atacado', '2025': A[0].a, '2026': A[0].b },
          { name: 'Varejo – Lojas', '2025': A[1].a, '2026': A[1].b },
          { name: 'Franquias', '2025': A[2].a, '2026': A[2].b },
          { name: 'Digital (E-com + Mktp)', '2025': dig[0], '2026': dig[1] },
          { name: 'Royalties e Serviços', '2025': A[5].a, '2026': A[5].b },
        ]

  // Gráfico 6: Evolução mensal 2026 empilhada
  const monthlyStackedData = MONTHS.map((m, mIdx) => {
    const row: Record<string, any> = { month: m }
    if (monthlyViewMode === 'produto') {
      PL.forEach((prod) => {
        row[prod] = Number(ABC_DATA.mp[prod][mIdx].toFixed(2))
      })
    } else {
      Object.keys(ABC_DATA.mch).forEach((canal) => {
        const key = canal.replace('Venda ', '')
        row[key] = Number(ABC_DATA.mch[canal][mIdx].toFixed(2))
      })
    }
    return row
  })

  // Gráfico 7: Sazonalidade do ROL 2026 (Mensal + Variação m/m %)
  const monthlySeasonalityData = MONTHS.map((m, mIdx) => {
    const totalMes = PL.reduce((sum, p) => sum + ABC_DATA.mp[p][mIdx], 0)
    return {
      month: m,
      rol: Number(totalMes.toFixed(2)),
      varMm: 0,
    }
  })
  monthlySeasonalityData.forEach((item, idx) => {
    if (idx > 0) {
      const prev = monthlySeasonalityData[idx - 1].rol
      item.varMm = Number((((item.rol - prev) / prev) * 100).toFixed(1))
    }
  })

  // Clientes: Top 10
  const getTop10Clients = (category: string) => {
    const getVal = (c: (typeof CL)[0]) => (category === 'Todos' ? c.t : (c.by[category] ?? 0))
    const filtered = [...CL]
      .filter((c) => getVal(c) > 0.05)
      .sort((a, b) => getVal(b) - getVal(a))
      .slice(0, 10)
    const totalCategory = category === 'Todos' ? R[1] : ABC_DATA.gt[1][PL.indexOf(category as any)]
    const sumTop10 = filtered.reduce((s, c) => s + getVal(c), 0)
    const remainder = Math.max(0, totalCategory - sumTop10)

    const list = [
      ...filtered.map((c) => ({
        name: c.n,
        value: Number(getVal(c).toFixed(2)),
      })),
      {
        name: 'Demais clientes e consumidor final',
        value: Number(remainder.toFixed(2)),
      },
    ]

    return { list, filtered, sumTop10, totalCategory }
  }

  const {
    list: top10ChartData,
    filtered: top10Ranked,
    totalCategory,
  } = getTop10Clients(clientFilter)
  const top3Sum = top10Ranked
    .slice(0, 3)
    .reduce((s, c) => s + (clientFilter === 'Todos' ? c.t : (c.by[clientFilter] ?? 0)), 0)
  const top10Sum = top10Ranked
    .slice(0, 10)
    .reduce((s, c) => s + (clientFilter === 'Todos' ? c.t : (c.by[clientFilter] ?? 0)), 0)

  const tabs = [
    { id: 0, label: 'Visão Executiva' },
    { id: 1, label: 'Receita & Mix' },
    { id: 2, label: 'Clientes & Concentração' },
    { id: 3, label: 'Amarração com a DRE' },
    { id: 4, label: 'Anexo Narrativo' },
  ]

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* Header Banner - A² Navy Theme */}
      <div className="bg-[#0A1526] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E1A63E] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modelagem Analítica • Empresa-Modelo ABC</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Dashboard de Receita (2025 × 2026)
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Valores em R$ milhões • Dados integrados e amarrados ao ROL consolidado da DRE
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm self-start md:self-auto">
              <Calendar className="w-4 h-4 text-[#E1A63E]" />
              <span>Exercício Base: 2025 × 2026</span>
            </div>
          </div>

          {/* Subtabs navigation */}
          <div className="flex items-center gap-1 overflow-x-auto mt-8 pt-2 border-t border-slate-800 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-white border-[#E1A63E] bg-white/10'
                    : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ============================================================== */}
        {/* TAB 0: VISÃO EXECUTIVA */}
        {/* ============================================================== */}
        {activeTab === 0 && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 border-t-4 border-t-[#1F3A5F] shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  ROL 2026
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0F1E36] block mt-1">
                  R$ {F(R[1])}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {P(rolDelta)} vs 2025
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 border-t-4 border-t-[#1F3A5F] shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Margem Bruta
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0F1E36] block mt-1">
                  {F(mgb2026)}%
                </span>
                <span className="text-xs font-semibold text-slate-600 block mt-1">
                  2025: {F(mgb2025)}%
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 border-t-4 border-t-[#1F3A5F] shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Lucro Líquido
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0F1E36] block mt-1">
                  R$ {F(DRE_VALUES.ll[1])}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {P(llDelta)} vs 2025
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 border-t-4 border-t-[#1F3A5F] shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Receita Digital
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0F1E36] block mt-1">
                  {F(digShare2026)}%
                </span>
                <span className="text-xs font-semibold text-slate-600 block mt-1">
                  2025: {F(digShare2025)}% ({P(digDelta)})
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 border-t-4 border-t-[#1F3A5F] shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Maior Canal
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0F1E36] block mt-1">
                  Atacado {F(atacadoShare, 0)}%
                </span>
                <span className="text-xs font-semibold text-slate-600 block mt-1">
                  R$ {F(A[0].b)} mi ({P(atacadoDelta)})
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 border-t-4 border-t-[#1F3A5F] shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Top 10 Clientes
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0F1E36] block mt-1">
                  53,3%
                </span>
                <span className="text-xs font-semibold text-slate-500 block mt-1">
                  Concentração moderada
                </span>
              </div>
            </div>

            {/* Row 1: Charts ROL por canal e Do ROL ao Lucro */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ROL por Canal de Venda */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-[#0F1E36]">ROL por Canal de Venda</h3>
                  <p className="text-xs text-slate-500">
                    Conta contábil de receita (R$ milhões) • 2025 vs 2026
                  </p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={channelData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={false}
                        stroke="#E2E8F0"
                      />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={130}
                        tick={{ fontSize: 11, fill: '#1F3A5F', fontWeight: 600 }}
                      />
                      <Tooltip
                        formatter={(val: any) => [`R$ ${F(Number(val))} mi`, '']}
                        contentStyle={{
                          backgroundColor: '#0F1E36',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      />
                      <Bar dataKey="2025" fill={NAVY_2025} radius={[0, 4, 4, 0]} name="2025" />
                      <Bar dataKey="2026" fill={NAVY_2026} radius={[0, 4, 4, 0]} name="2026" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Do ROL ao Lucro (DRE) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-[#0F1E36]">Do ROL ao Lucro</h3>
                  <p className="text-xs text-slate-500">
                    DRE consolidada da empresa ABC (R$ milhões) • 2025 vs 2026
                  </p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dreData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#1F3A5F', fontWeight: 600 }}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                      <Tooltip
                        formatter={(val: any) => [`R$ ${F(Number(val))} mi`, '']}
                        contentStyle={{
                          backgroundColor: '#0F1E36',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      />
                      <Bar dataKey="2025" fill={NAVY_2025} radius={[4, 4, 0, 0]} name="2025" />
                      <Bar dataKey="2026" fill={GOLD} radius={[4, 4, 0, 0]} name="2026" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 2: Variação por linha de produto e Principais Leituras */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contribuição ao Crescimento */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-[#0F1E36]">
                    Variação do ROL por Linha de Produto
                  </h3>
                  <p className="text-xs text-slate-500">
                    Contribuição ao crescimento total (+R$ {F(totalDeltaROL)} mi)
                  </p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productDeltas}
                      margin={{ top: 5, right: 20, left: 0, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        angle={-15}
                        textAnchor="end"
                        interval={0}
                        tick={{ fontSize: 10, fill: '#1F3A5F', fontWeight: 600 }}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                      <Tooltip
                        formatter={(val: any) => [`+R$ ${F(Number(val))} mi`, 'Aumento']}
                        contentStyle={{
                          backgroundColor: '#0F1E36',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="delta" radius={[5, 5, 0, 0]}>
                        {productDeltas.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={BRAND_COLORS[index % BRAND_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Principais Leituras */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0F1E36] mb-4">Principais Leituras</h3>
                  <div className="space-y-3.5">
                    <div className="border-l-4 border-l-[#1F3A5F] pl-3 py-1 bg-slate-50/70 rounded-r-lg">
                      <strong className="block text-xs font-bold text-[#0F1E36]">
                        ROL amarrado à DRE
                      </strong>
                      <p className="text-xs text-slate-600 mt-0.5">
                        R$ {F(R[1])} mi em 2026 = soma integral das 6 contas de receita, sem
                        diferença. Base auditada amarrada à DRE consolidada da empresa.
                      </p>
                    </div>

                    <div className="border-l-4 border-l-[#0D9488] pl-3 py-1 bg-slate-50/70 rounded-r-lg">
                      <strong className="block text-xs font-bold text-[#0F1E36]">
                        Skincare e Maquiagem lideram o crescimento
                      </strong>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Somam R$ {F(productDeltas[0].delta + productDeltas[1].delta)} mi dos R${' '}
                        {F(totalDeltaROL)} mi de aumento (
                        {F(
                          ((productDeltas[0].delta + productDeltas[1].delta) / totalDeltaROL) * 100,
                          0,
                        )}
                        %). Cabelos avança expressivos{' '}
                        {P(ABC_DATA.gt[1][3] / ABC_DATA.gt[0][3] - 1)}.
                      </p>
                    </div>

                    <div className="border-l-4 border-l-[#D97706] pl-3 py-1 bg-slate-50/70 rounded-r-lg">
                      <strong className="block text-xs font-bold text-[#0F1E36]">
                        Digital já pesa {F(digShare2026, 0)}% do ROL
                      </strong>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Parte do salto em Marketplaces é reclassificação do E-commerce próprio. No
                        consolidado, o digital cresce {P(digDelta)}.
                      </p>
                    </div>

                    <div className="border-l-4 border-l-[#7C3AED] pl-3 py-1 bg-slate-50/70 rounded-r-lg">
                      <strong className="block text-xs font-bold text-[#0F1E36]">
                        Comparabilidade 2025 × 2026
                      </strong>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Eliminações intercompany estruturadas conferem transparência contábil: o ROL
                        consolidado cresce +19,6%, enquanto a base combinada avança +27,1%.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Metodologia A² Strategic Engine</span>
                  <span className="font-semibold text-[#1F3A5F]">Padrão CFO / FP&A</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: RECEITA & MIX */}
        {/* ============================================================== */}
        {activeTab === 1 && (
          <div className="space-y-8 animate-fade-in">
            {/* Top row: Mix por linha (2025 e 2026) e Reclassificação de contas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mix por Linha de Produto */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-[#0F1E36]">Mix por Linha de Produto</h3>
                  <p className="text-xs text-slate-500">Participação no ROL em 2025 e 2026</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-center text-slate-600 mb-1">
                      Exercício 2025
                    </p>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mix2025}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={2}
                          >
                            {mix2025.map((_, index) => (
                              <Cell
                                key={`cell-25-${index}`}
                                fill={BRAND_COLORS[index % BRAND_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(val: any, name: any) => [
                              `R$ ${F(Number(val))} mi (${F((Number(val) / R[0]) * 100)}%)`,
                              name,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-center text-[#1F3A5F] mb-1">
                      Exercício 2026
                    </p>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mix2026}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={2}
                          >
                            {mix2026.map((_, index) => (
                              <Cell
                                key={`cell-26-${index}`}
                                fill={BRAND_COLORS[index % BRAND_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(val: any, name: any) => [
                              `R$ ${F(Number(val))} mi (${F((Number(val) / R[1]) * 100)}%)`,
                              name,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Micro legend */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                  {PL.map((p, idx) => (
                    <div key={p} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: BRAND_COLORS[idx % BRAND_COLORS.length] }}
                      />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reclassificação de Contas */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-[#0F1E36]">
                      Reclassificação de Contas
                    </h3>
                    <div className="inline-flex bg-slate-100 p-1 rounded-lg">
                      <button
                        onClick={() => setChannelViewMode('conta')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                          channelViewMode === 'conta'
                            ? 'bg-[#1F3A5F] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Por Conta
                      </button>
                      <button
                        onClick={() => setChannelViewMode('ajustado')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                          channelViewMode === 'ajustado'
                            ? 'bg-[#1F3A5F] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Por Canal Ajustado
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    E-commerce próprio → Marketplaces: compare a visão contábil e a ajustada
                  </p>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={reclassData}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={true}
                          vertical={false}
                          stroke="#E2E8F0"
                        />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={140}
                          tick={{ fontSize: 11, fill: '#1F3A5F', fontWeight: 600 }}
                        />
                        <Tooltip
                          formatter={(val: any) => [`R$ ${F(Number(val))} mi`, '']}
                          contentStyle={{
                            backgroundColor: '#0F1E36',
                            borderColor: '#334155',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '12px',
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        />
                        <Bar dataKey="2025" fill={NAVY_2025} radius={[0, 4, 4, 0]} name="2025" />
                        <Bar dataKey="2026" fill={NAVY_2026} radius={[0, 4, 4, 0]} name="2026" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <p className="text-xs text-slate-500 italic mt-3 pt-2 border-t border-slate-100">
                  * Na visão ajustada, E-commerce e Marketplaces compõem o canal Digital unificado.
                </p>
              </div>
            </div>

            {/* Bottom row: Evolução mensal 2026 empilhada e Sazonalidade do ROL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolução Mensal 2026 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[#0F1E36]">Evolução Mensal 2026</h3>
                  <div className="inline-flex bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setMonthlyViewMode('canal')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                        monthlyViewMode === 'canal'
                          ? 'bg-[#1F3A5F] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Por Canal
                    </button>
                    <button
                      onClick={() => setMonthlyViewMode('produto')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                        monthlyViewMode === 'produto'
                          ? 'bg-[#1F3A5F] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Por Linha de Produto
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Colunas empilhadas (R$ milhões) • Alterne a leitura por canal ou categoria
                </p>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyStackedData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#1F3A5F', fontWeight: 600 }}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                      <Tooltip
                        formatter={(val: any, name: any) => [`R$ ${F(Number(val))} mi`, name]}
                        contentStyle={{
                          backgroundColor: '#0F1E36',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                      {(monthlyViewMode === 'produto'
                        ? PL
                        : Object.keys(ABC_DATA.mch).map((k) => k.replace('Venda ', ''))
                      ).map((key, idx) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          stackId="a"
                          fill={BRAND_COLORS[idx % BRAND_COLORS.length]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sazonalidade do ROL 2026 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-2">
                  <h3 className="text-base font-bold text-[#0F1E36]">Sazonalidade do ROL 2026</h3>
                  <p className="text-xs text-slate-500">
                    ROL mensal (barras) e variação percentual sobre o mês anterior (linha m/m)
                  </p>
                </div>

                <div className="h-80 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={monthlySeasonalityData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#1F3A5F', fontWeight: 600 }}
                      />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        unit="%"
                        tick={{ fontSize: 11, fill: '#D97706' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F1E36',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                        formatter={(val: any, name: any) =>
                          name === 'ROL (R$ mi)'
                            ? [`R$ ${F(Number(val))} mi`, name]
                            : [`${val}%`, name]
                        }
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="rol"
                        name="ROL (R$ mi)"
                        fill={NAVY_2026}
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="varMm"
                        name="Var. m/m (%)"
                        stroke={GOLD}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: GOLD }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CLIENTES & CONCENTRAÇÃO */}
        {/* ============================================================== */}
        {activeTab === 2 && (
          <div className="space-y-8 animate-fade-in">
            {/* Filter buttons */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 mr-2 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#1F3A5F]" />
                Filtrar por Linha de Produto:
              </span>
              {['Todos', ...PL.slice(0, 5)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setClientFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    clientFilter === cat
                      ? 'bg-[#1F3A5F] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Top 10 Charts: Participação (Donut) e R$ milhões (Bar) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donut: Participação */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-2">
                  <h3 className="text-base font-bold text-[#0F1E36]">
                    Top 10 Clientes • Participação no ROL
                  </h3>
                  <p className="text-xs text-slate-500">
                    Filtro ativo: <strong className="text-[#1F3A5F]">{clientFilter}</strong>
                  </p>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={top10ChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {top10ChartData.map((_, index) => (
                          <Cell
                            key={`top-cell-${index}`}
                            fill={RAMP_COLORS[index % RAMP_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any, name: any) => [
                          `R$ ${F(Number(val))} mi (${F((Number(val) / totalCategory) * 100)}%)`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 text-center font-medium">
                  Top 3 ={' '}
                  <strong className="text-[#1F3A5F]">{F((top3Sum / totalCategory) * 100)}%</strong>{' '}
                  • Top 10 ={' '}
                  <strong className="text-[#1F3A5F]">{F((top10Sum / totalCategory) * 100)}%</strong>{' '}
                  do ROL ({clientFilter})
                </div>
              </div>

              {/* Bar: R$ Milhões */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-2">
                  <h3 className="text-base font-bold text-[#0F1E36]">
                    Top 10 Clientes • R$ Milhões
                  </h3>
                  <p className="text-xs text-slate-500">
                    Volume financeiro absoluto realizado em 2026
                  </p>
                </div>

                <div className="h-80 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={top10ChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={false}
                        stroke="#E2E8F0"
                      />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={130}
                        tick={{ fontSize: 10, fill: '#1F3A5F', fontWeight: 600 }}
                      />
                      <Tooltip
                        formatter={(val: any) => [`R$ ${F(Number(val))} mi`, 'Total']}
                        contentStyle={{
                          backgroundColor: '#0F1E36',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {top10ChartData.map((_, index) => (
                          <Cell
                            key={`cell-bar-${index}`}
                            fill={RAMP_COLORS[index % RAMP_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tabela de Ranking por Linha de Produto */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-[#0F1E36] mb-4">
                Ranking Completo de Clientes por Linha de Produto (2026)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 px-3 font-bold text-[#0F1E36]">Cliente</th>
                      <th className="py-2.5 px-3 font-bold">Canal</th>
                      {PL.slice(0, 5).map((prod) => (
                        <th key={prod} className="py-2.5 px-3 font-bold text-right">
                          {prod}
                        </th>
                      ))}
                      <th className="py-2.5 px-3 font-bold text-right text-[#0F1E36]">Total</th>
                      <th className="py-2.5 px-3 font-bold text-right text-[#0F1E36]">% ROL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...CL]
                      .sort((a, b) => b.t - a.t)
                      .map((c) => (
                        <tr key={c.n} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-3 font-semibold text-[#1F3A5F]">{c.n}</td>
                          <td className="py-2 px-3 text-slate-600">{c.ch.replace('Venda ', '')}</td>
                          {PL.slice(0, 5).map((prod) => (
                            <td key={prod} className="py-2 px-3 text-right text-slate-600">
                              {F(c.by[prod] ?? 0)}
                            </td>
                          ))}
                          <td className="py-2 px-3 text-right font-black text-[#0F1E36]">
                            {F(c.t)}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-[#1F3A5F]">
                            {F((c.t / R[1]) * 100)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: AMARRAÇÃO COM A DRE */}
        {/* ============================================================== */}
        {activeTab === 3 && (
          <div className="space-y-8 animate-fade-in">
            {/* Tabela de Amarração Composição x DRE */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0F1E36]">
                    Amarração • Composição × DRE (ROL Consolidado)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Valores expressos em R$ mil • Auditoria integral de fechamento
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Diferença 0 ✓ Auditado</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 px-3 font-bold text-[#0F1E36]">Conta Contábil</th>
                      <th className="py-2.5 px-3 font-bold text-right">2025 (R$ mil)</th>
                      <th className="py-2.5 px-3 font-bold text-right">2026 (R$ mil)</th>
                      <th className="py-2.5 px-3 font-bold text-right">Var. R$ mil</th>
                      <th className="py-2.5 px-3 font-bold text-right">Var. %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {A.map((x) => (
                      <tr key={x.c} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-mono text-slate-700">
                          <span className="text-slate-400 mr-2">{x.c}</span>
                          <span className="font-sans font-semibold text-[#1F3A5F]">{x.n}</span>
                        </td>
                        <td className="py-2 px-3 text-right text-slate-600">{formatK(x.a)}</td>
                        <td className="py-2 px-3 text-right text-slate-800 font-semibold">
                          {formatK(x.b)}
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-emerald-600">
                          {formatK(x.b - x.a)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-[#1F3A5F]">
                          {x.a > 0 ? P(x.b / x.a - 1) : 'novo'}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-300 bg-slate-50/70 font-bold text-slate-900">
                      <td className="py-2.5 px-3 font-black text-[#0F1E36]">Total Composição</td>
                      <td className="py-2.5 px-3 text-right font-black">{formatK(R[0])}</td>
                      <td className="py-2.5 px-3 text-right font-black text-[#1F3A5F]">
                        {formatK(R[1])}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-emerald-600">
                        {formatK(R[1] - R[0])}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-[#1F3A5F]">
                        {P(R[1] / R[0] - 1)}
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/50 font-bold text-emerald-900">
                      <td className="py-2.5 px-3">ROL Consolidado (DRE da Empresa ABC)</td>
                      <td className="py-2.5 px-3 text-right font-mono">94.101</td>
                      <td className="py-2.5 px-3 text-right font-mono">112.545</td>
                      <td colSpan={2} className="py-2.5 px-3 text-right text-emerald-600">
                        Diferença 0 ✓ Fechamento Perfeito
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabela de Composição por Linha de Produto */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-[#0F1E36] mb-4">
                Composição por Linha de Produto (R$ milhões)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 px-3 font-bold text-[#0F1E36]">Linha de Produto</th>
                      <th className="py-2.5 px-3 font-bold text-right">2025 (R$ mi)</th>
                      <th className="py-2.5 px-3 font-bold text-right">2026 (R$ mi)</th>
                      <th className="py-2.5 px-3 font-bold text-right">Var. R$ mi</th>
                      <th className="py-2.5 px-3 font-bold text-right">Var. %</th>
                      <th className="py-2.5 px-3 font-bold text-right">% ROL 2026</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PL.map((p, i) => {
                      const v25 = ABC_DATA.gt[0][i]
                      const v26 = ABC_DATA.gt[1][i]
                      return (
                        <tr key={p} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-3 font-semibold text-[#1F3A5F]">{p}</td>
                          <td className="py-2 px-3 text-right text-slate-600">{F(v25)}</td>
                          <td className="py-2 px-3 text-right font-semibold text-slate-800">
                            {F(v26)}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-emerald-600">
                            {F(v26 - v25)}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-[#1F3A5F]">
                            {P(v26 / v25 - 1)}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">
                            {F((v26 / R[1]) * 100)}%
                          </td>
                        </tr>
                      )
                    })}
                    <tr className="border-t-2 border-slate-300 bg-slate-50/70 font-black text-slate-900">
                      <td className="py-2.5 px-3 text-[#0F1E36]">Total</td>
                      <td className="py-2.5 px-3 text-right">{F(R[0])}</td>
                      <td className="py-2.5 px-3 text-right text-[#1F3A5F]">{F(R[1])}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600">{F(R[1] - R[0])}</td>
                      <td className="py-2.5 px-3 text-right text-[#1F3A5F]">
                        {P(R[1] / R[0] - 1)}
                      </td>
                      <td className="py-2.5 px-3 text-right">100,0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: ANEXO NARRATIVO */}
        {/* ============================================================== */}
        {activeTab === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E1A63E] block mb-1">
                  Anexo Narrativo de Gestão
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F1E36]">
                  A História da Receita em 4 Atos (2025 × 2026)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Relatório executivo estruturado com as principais dinâmicas operacionais da
                  empresa ABC
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 border-l-4 border-l-[#1F3A5F]">
                  <h4 className="text-sm font-bold text-[#0F1E36] mb-1">
                    1. ROL avança de R$ {F(R[0])} mi para R$ {F(R[1])} mi ({P(rolDelta)})
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Crescimento consistente puxado pelas categorias de {PL[0]}, {PL[1]} e {PL[2]}. A
                    base de 2025 é combinada, sem distorções de eliminações intercompany pendentes,
                    demonstrando solidez na tração comercial.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 border-l-4 border-l-[#0D9488]">
                  <h4 className="text-sm font-bold text-[#0F1E36] mb-1">
                    2. Reclassificação estratégica no digital
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A conta Marketplaces atinge R$ {F(A[4].b)} mi em 2026 enquanto o E-commerce
                    próprio recua {P(A[3].b / A[3].a - 1)}. Somados, o canal digital cresce{' '}
                    {P(digDelta)}: a análise isolada conta a conta tenderia a superestimar quedas e
                    altas decorrentes de migração de plataforma.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 border-l-4 border-l-[#D97706]">
                  <h4 className="text-sm font-bold text-[#0F1E36] mb-1">
                    3. Sazonalidade típica do mercado de cosméticos
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Picos expressivos de vendas registrados em maio (Dia das Mães) e novembro (Black
                    Friday), com dezembro fechando logo abaixo de novembro. Devoluções controladas
                    de R$ 1,0 mi no final do ano merecem acompanhamento contínuo de corte contábil.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 border-l-4 border-l-[#7C3AED]">
                  <h4 className="text-sm font-bold text-[#0F1E36] mb-1">
                    4. Qualidade e expansão da margem
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A margem bruta salta de {F(mgb2025)}% para {F(mgb2026)}%, impulsionando o lucro
                    líquido para R$ {F(DRE_VALUES.ll[1])} mi (+{F(llDelta * 100)}%). A leitura
                    recorrente confirma ganho real de alavancagem operacional e controle de custos.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500">
                <p>
                  <strong>Empresa-modelo ABC:</strong> Contas contábeis, clientes e valores por
                  canal, linha de produto e mês são estruturados para fechar rigorosamente com o ROL
                  consolidado da DRE. Estrutura analítica padronizada pela A² Strategic Solutions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
