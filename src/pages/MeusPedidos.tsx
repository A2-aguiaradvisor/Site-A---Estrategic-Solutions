import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '@/types'
import { getUserOrders } from '@/services/orders'
import { formatBRL, formatDateBR } from '@/lib/formatters'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Package,
  ArrowRight,
  PackageX,
  CreditCard,
  QrCode,
  FileText,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'

export default function MeusPedidos() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getUserOrders()
      setOrders(data)
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Real-time updates for orders collection
  useRealtime<Order>('orders', (data) => {
    if (data.action === 'create') {
      setOrders((prev) => [data.record, ...prev.filter((o) => o.id !== data.record.id)])
    } else if (data.action === 'update') {
      setOrders((prev) => prev.map((o) => (o.id === data.record.id ? data.record : o)))
    } else if (data.action === 'delete') {
      setOrders((prev) => prev.filter((o) => o.id !== data.record.id))
    }
  })

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Pago
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Processando
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Cancelado
          </span>
        )
      default:
        return null
    }
  }

  const getPaymentLabel = (method: Order['payment_method']) => {
    switch (method) {
      case 'credit_card':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <CreditCard className="w-3.5 h-3.5 text-[#2563EB]" /> Cartão de Crédito
          </span>
        )
      case 'pix':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <QrCode className="w-3.5 h-3.5 text-[#2563EB]" /> Pix
          </span>
        )
      case 'boleto':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <FileText className="w-3.5 h-3.5 text-[#2563EB]" /> Boleto Bancário
          </span>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mb-3" />
        <p className="text-sm text-[#64748B]">Carregando seus pedidos...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3A5F]">Meus Pedidos</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Acompanhe o status e os detalhes das suas consultorias e materiais contratados
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center max-w-xl mx-auto shadow-card-rest">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <PackageX className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#1F3A5F] mb-1">
            Você ainda não fez nenhum pedido
          </h2>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-6">
            Navegue pelo nosso catálogo de soluções executivas e acelere o crescimento do seu
            negócio.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1F3A5F] hover:bg-[#17304F] text-white font-semibold text-xs shadow-btn-primary transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Explorar produtos</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-card-rest">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    <th className="py-3.5 px-4 sm:px-6">Código</th>
                    <th className="py-3.5 px-4 sm:px-6">Data</th>
                    <th className="py-3.5 px-4 sm:px-6">Forma Pagto</th>
                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Total</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm">
                  {orders.map((order) => {
                    let itemsCount = 0
                    try {
                      const parsed = JSON.parse(order.items_json)
                      itemsCount = Array.isArray(parsed)
                        ? parsed.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
                        : 0
                    } catch {
                      /* intentionally ignored */
                    }

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-4 px-4 sm:px-6 font-bold text-[#1F3A5F]">
                          {order.order_code}
                          <span className="block text-[11px] text-slate-400 font-normal">
                            {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-xs text-slate-600">
                          {formatDateBR(order.created)}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          {getPaymentLabel(order.payment_method)}
                        </td>
                        <td className="py-4 px-4 sm:px-6">{getStatusBadge(order.status)}</td>
                        <td className="py-4 px-4 sm:px-6 text-right font-extrabold text-[#1F3A5F]">
                          {formatBRL(order.total)}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <Link
                            to={`/pedido/${order.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 text-xs font-semibold transition-all group-hover:shadow-sm"
                          >
                            <span>Ver detalhes</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
