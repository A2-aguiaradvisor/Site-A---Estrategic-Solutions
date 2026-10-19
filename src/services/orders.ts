import pb from '@/lib/pocketbase/client'
import type { Order, OrderItemSnapshot, PaymentMethod } from '@/types'

export interface CreateOrderParams {
  paymentMethod: PaymentMethod
  items: OrderItemSnapshot[]
  total: number
}

export async function createOrder(params: CreateOrderParams): Promise<Order> {
  const user = pb.authStore.record
  if (!user) {
    throw new Error('Você precisa estar autenticado para finalizar o pedido.')
  }

  // Generate unique order code e.g. AG-2026-XXXX (or timestamp suffix to guarantee uniqueness)
  const currentYear = new Date().getFullYear()
  const randomSuffix = Math.floor(100000 + Math.random() * 900000)
  const orderCode = `AG-${currentYear}-${randomSuffix}`

  const record = await pb.collection('orders').create<Order>({
    user_id: user.id,
    order_code: orderCode,
    status: 'paid', // Simulated online payment is instantly approved
    payment_method: params.paymentMethod,
    total: Number(params.total.toFixed(2)),
    items_json: JSON.stringify(params.items),
  })

  return record
}

export async function getUserOrders(): Promise<Order[]> {
  const user = pb.authStore.record
  if (!user) return []

  const records = await pb.collection('orders').getFullList<Order>({
    sort: '-created',
    filter: `user_id = "${user.id}"`,
  })

  return records
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const record = await pb.collection('orders').getOne<Order>(id)
    return record
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    return null
  }
}
