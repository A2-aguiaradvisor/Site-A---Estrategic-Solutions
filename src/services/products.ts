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
  // Curated clean category placeholders using project CDN rule
  const queryMap: Record<string, string> = {
    Mentoria: 'executive advisory meeting',
    Curso: 'business finance analytics',
    'E-book': 'financial planning document',
    Serviço: 'corporate consultancy board',
  }
  const q = encodeURIComponent(queryMap[product.category] || 'business advisory')
  return `https://img.usecurling.com/p/800/600?q=${q}&dpr=2`
}
