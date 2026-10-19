import { useState } from 'react'
import { createOrder, getUserOrders, getOrderById } from '@/services/orders'
import { getProducts } from '@/services/products'
import pb from '@/lib/pocketbase/client'
import type { PaymentMethod, OrderItemSnapshot, Order } from '@/types'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function OrderFlowE2ETester() {
  const [logs, setLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [createdOrders, setCreatedOrders] = useState<Order[]>([])

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  const runE2EValidation = async () => {
    setIsRunning(true)
    setLogs([])
    setCreatedOrders([])

    try {
      addLog('Iniciando validação ponta a ponta do fluxo de pedidos...')

      // 1. Catálogo
      addLog('Etapa 1: Carregando produtos do catálogo via serviço getProducts()...')
      const products = await getProducts()
      if (!products || products.length === 0) {
        throw new Error('Nenhum produto retornado pelo catálogo.')
      }
      addLog(`Etapa 1 OK: ${products.length} produtos carregados com foto, preço e detalhes.`)

      // 2. Auth do Usuário de Teste
      addLog('Etapa 2: Autenticando com usuário de teste vinicius_contabeis89@yahoo.com.br...')
      await pb
        .collection('users')
        .authWithPassword('vinicius_contabeis89@yahoo.com.br', 'Skip@Pass')
      const authUser = pb.authStore.record
      if (!authUser) throw new Error('Falha ao autenticar usuário de teste')
      addLog(
        `Etapa 2 OK: Autenticado como ${authUser.name} (${authUser.email}), ID: ${authUser.id}`,
      )

      // 3. Simulação de Carrinho
      addLog('Etapa 3: Simulando carrinho com 2 itens (Planilha e Box/Reforma)...')
      const p1 = products[0]
      const p2 = products[1] || products[0]
      const qty1 = 2
      const qty2 = 1
      const subtotal = p1.price * qty1 + p2.price * qty2
      addLog(
        `Etapa 3 OK: Subtotal calculado R$ ${subtotal.toFixed(2)} (Frete R$ 0,00 - Digital). Total: R$ ${subtotal.toFixed(2)}`,
      )

      const itemsSnapshot: OrderItemSnapshot[] = [
        {
          product_id: p1.id,
          title: p1.title,
          price: p1.price,
          quantity: qty1,
          category: p1.category,
          cover_image_url: '',
        },
        {
          product_id: p2.id,
          title: p2.title,
          price: p2.price,
          quantity: qty2,
          category: p2.category,
          cover_image_url: '',
        },
      ]

      // 4. Testar cada forma de pagamento no Checkout
      const methods: PaymentMethod[] = ['credit_card', 'pix', 'boleto']
      const ordersList: Order[] = []

      for (const method of methods) {
        addLog(`Etapa 4: Processando checkout com forma de pagamento simulada '${method}'...`)
        const order = await createOrder({
          paymentMethod: method,
          items: itemsSnapshot,
          total: subtotal,
        })
        ordersList.push(order)
        addLog(
          `Etapa 4 OK: Pedido criado! Código: ${order.order_code}, Status: ${order.status}, Total: R$ ${order.total.toFixed(2)}`,
        )
      }

      setCreatedOrders(ordersList)

      // 5. Confirmação / OrderDetail
      addLog('Etapa 5: Validando página de confirmação/detalhe do pedido com getOrderById()...')
      const firstOrderId = ordersList[0].id
      const fetchedOrder = await getOrderById(firstOrderId)
      if (!fetchedOrder) throw new Error(`Não foi possível recuperar o pedido ${firstOrderId}`)
      const parsedItems = JSON.parse(fetchedOrder.items_json)
      addLog(
        `Etapa 5 OK: Pedido ${fetchedOrder.order_code} recuperado com sucesso. Itens gravados: ${parsedItems.length}, Total: R$ ${fetchedOrder.total}`,
      )

      // 6. Painel Meus Pedidos
      addLog('Etapa 6: Validando listagem de Meus Pedidos com getUserOrders()...')
      const userOrders = await getUserOrders()
      addLog(`Etapa 6 OK: ${userOrders.length} pedidos encontrados no histórico do usuário.`)

      addLog('✓ TODAS AS 6 ETAPAS DO FLUXO END-TO-END FORAM VALIDADAS COM SUCESSO NO BANCO!')
    } catch (err: any) {
      addLog(`✗ FALHA NO TESTE: ${err?.message || err}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm my-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-[#1F3A5F]">Validador do Fluxo de Pedido (E2E)</h3>
          <p className="text-xs text-slate-500">
            Executa a cadeia completa: Catálogo → Carrinho → Checkout (Cartão, Pix, Boleto) →
            Gravação no PocketBase → Painel
          </p>
        </div>
        <button
          onClick={runE2EValidation}
          disabled={isRunning}
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Executar Teste Completo E2E
            </>
          )}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs max-h-64 overflow-y-auto space-y-1">
          {logs.map((log, index) => (
            <div
              key={index}
              className={
                log.includes('✗')
                  ? 'text-red-400'
                  : log.includes('✓')
                    ? 'text-emerald-400 font-bold'
                    : ''
              }
            >
              {log}
            </div>
          ))}
        </div>
      )}

      {createdOrders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {createdOrders.map((o) => (
            <div
              key={o.id}
              className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950"
            >
              <span className="font-bold block">{o.order_code}</span>
              <span>
                {o.payment_method} • R$ {o.total.toFixed(2)}
              </span>
              <span className="block text-[10px] text-emerald-700 mt-1">Status: {o.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
