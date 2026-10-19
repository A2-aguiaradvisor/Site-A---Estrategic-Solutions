export type ProductCategory = 'Mentoria' | 'Curso' | 'E-book' | 'Serviço'

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
}
