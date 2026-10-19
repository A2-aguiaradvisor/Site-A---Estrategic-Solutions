import pb from '@/lib/pocketbase/client'
import type { Product } from '@/types'

export async function getProducts(): Promise<Product[]> {
  try {
    const records = await pb.collection('products').getFullList<Product>({
      sort: '-created',
    })
    return records
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    throw error
  }
}

export async function getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  try {
    // Try by ID first
    try {
      const record = await pb.collection('products').getOne<Product>(idOrSlug)
      if (record) return record
    } catch (_) {
      // not an ID or not found, try slug
    }

    const record = await pb.collection('products').getFirstListItem<Product>(`slug = "${idOrSlug}"`)
    return record
  } catch (error) {
    console.error('Produto não encontrado:', error)
    return null
  }
}

export function getProductImageUrl(product: Product): string {
  if (product.cover_image) {
    return pb.files.getURL(product, product.cover_image)
  }
  // Technological Dashboards & Analytics images matching LeverPro standards
  const queryMap: Record<string, string> = {
    'Produto de Entrada': 'spreadsheet financial data',
    Box: 'financial model chart',
    Curso: 'financial data chart',
    Mentoria: 'executive advisor meeting',
    Serviços: 'executive corporate analytics',
    'E-book': 'business metrics report',
    Serviço: 'executive trading monitor',
  }
  const q = encodeURIComponent(queryMap[product.category] || 'dashboard analytics screen')
  return `https://img.usecurling.com/p/800/600?q=${q}&color=blue&dpr=2`
}
