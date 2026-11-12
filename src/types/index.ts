export type ProductCategory = 'Produto de Entrada' | 'Box' | 'Curso' | 'Mentoria' | 'Serviços'

export type SubscriptionPeriod = 'mensal' | 'anual'

export interface Coupon {
  id: string
  collectionId: string
  collectionName: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  description?: string
  active: boolean
  expires_at?: string
  max_uses: number
  used_count: number
  created: string
  updated: string
}

export interface Product {
  id: string
  collectionId: string
  collectionName: string
  title: string
  slug: string
  description: string
  long_description?: string
  price: number
  category: ProductCategory
  whats_included?: string
  for_whom?: string
  requirements?: string
  subscription_eligible?: boolean
  cover_image?: string
  created: string
  updated: string
}

export type OrderStatus = 'pending' | 'paid' | 'cancelled'
export type PaymentMethod = 'credit_card' | 'pix' | 'boleto'

export interface OrderItemSnapshot {
  product_id: string
  title: string
  price: number
  quantity: number
  category?: ProductCategory
  subscription_period?: SubscriptionPeriod
  cover_image_url?: string
}

export interface Order {
  id: string
  collectionId: string
  collectionName: string
  user_id: string
  order_code: string
  status: OrderStatus
  payment_method: PaymentMethod
  total: number
  items_json: string
  coupon_code?: string
  discount_amount?: number
  subscription_period?: SubscriptionPeriod | ''
  created: string
  updated: string
  expand?: {
    user_id?: {
      name?: string
      email?: string
    }
  }
}

export interface CartItem {
  product: Product
  quantity: number
  subscription_period?: SubscriptionPeriod
}
