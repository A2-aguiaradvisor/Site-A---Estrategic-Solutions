import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Order, OrderItemSnapshot } from '@/types'
import { getOrderById } from '@/services/orders'
import { formatBRL, formatDateBR } from '@/lib/formatters'
import { useRealtime } from '@/hooks/use-realtime'
import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    if (!id) return
    try {
      const data = await getOrderById(id)
      setOrder(data)
    } catch (err) {
      console.error('Erro ao carregar pedido:', err)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  // Real-time listener for status changes
  useRealtime<Order>('orders', (data) => {
    if (data.record.id === id) {
      if (data.action === 'update') {
        setOrder(data.record)
      }
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mb-3" />
        <p className="text-sm text-[#64748B]">Carregando dados do pedido...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#1F3A5F] mb-3">Pedido não encontrado</h2>
        <p className="text-sm text-slate-600 mb-6">
          Não conseguimos localizar as informações deste pedido ou você não tem permissão para
          visualizá-lo.
        </p>
        <Link
          to="/meus-pedidos"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1F3A5F] text-white text-xs font-semibold hover:bg-[#17304F]"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para meus pedidos
        </Link>
      </div>
    )
  }

  let items: OrderItemSnapshot[] = []
  try {
    items = JSON.parse(order.items_json)
  } catch (e) {
    console.error('Falha ao parsear items_json:', e)
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            Pagamento Aprovado (Simulado)
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-4 h-4" />
            Em processamento
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-4 h-4" />
            Cancelado
          </span>
        )
    }
  }

  const getPaymentName = (method: Order['payment_method']) => {
    switch (method) {
      case 'credit_card':
        return 'Cartão de Crédito (Simulado)'
      case 'pix':
        return 'Pix Instantâneo (Simulado)'
      case 'boleto':
        return 'Boleto Bancário (Simulado)'
    }
  }

  return (
    <div className="bg-[#F8FAFC] pb-24">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center text-xs font-medium text-slate-500">
            <Link to="/meus-pedidos" className="hover:text-[#2563EB] transition-colors">
              Meus Pedidos
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400" />
            <span className="text-[#1F3A5F] font-semibold">{order.order_code}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Header with Order code and status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card-rest mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-[#1F3A5F]">Pedido {order.order_code}</h1>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Realizado em {formatDateBR(order.created)}
            </p>
          </div>
          <div>{getStatusBadge(order.status)}</div>
        </div>

        {/* 2-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-card-rest">
              <div className="p-4 bg-slate-50 border-b border-[#E2E8F0] text-xs font-bold text-[#1F3A5F]">
                Itens do pedido ({items.length})
              </div>

              <ul className="divide-y divide-[#E2E8F0]">
                {items.map((item, idx) => (
                  <li key={idx} className="p-4 sm:p-5 flex items-center gap-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-xs font-bold">
                          AA
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#1F3A5F] truncate">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.quantity} × {formatBRL(item.price)}
                      </p>
                    </div>

                    {/* Item Line Total */}
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#1F3A5F]">
                        {formatBRL(item.price * item.quantity)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Link
                to="/meus-pedidos"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar para meus pedidos
              </Link>
            </div>
          </div>

          {/* Right Column: Financial & Payment Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card-rest space-y-5">
              <h3 className="text-base font-bold text-[#1F3A5F] pb-3 border-b border-slate-100">
                Resumo Financeiro
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatBRL(order.total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Frete & Envio Digital</span>
                  <span className="font-semibold text-emerald-600 uppercase text-[11px]">
                    Grátis
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#1F3A5F]">Total Pago</span>
                  <span className="text-2xl font-black text-[#1F3A5F]">
                    {formatBRL(order.total)}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-[#1F3A5F] block">Forma de pagamento</span>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                  {order.payment_method === 'credit_card' && (
                    <CreditCard className="w-4 h-4 text-[#2563EB]" />
                  )}
                  {order.payment_method === 'pix' && <QrCode className="w-4 h-4 text-[#2563EB]" />}
                  {order.payment_method === 'boleto' && (
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                  )}
                  <span>{getPaymentName(order.payment_method)}</span>
                </div>
              </div>

              {/* Simulated Invoice note */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#1F3A5F]">
                  <FileSpreadsheet className="w-4 h-4 text-[#2563EB]" />
                  <span>Nota Fiscal & Contrato Executivo (Simulado)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Os arquivos de recibo e materiais pedagógicos foram provisionados em ambiente de
                  teste. Nossa equipe de concierge entrará em contato via e-mail para agendamento
                  dos módulos de mentoria.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Transação registrada com segurança no Skip Cloud</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
