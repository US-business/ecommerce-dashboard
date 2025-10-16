import { ProductStatus } from "@/types/product"

export const getStatusColor = (status: ProductStatus) => {
  switch (status) {
    case 'best_seller':
      return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30'
    case 'new':
      return 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30'
    case 'coming_soon':
      return 'bg-purple-500/20 text-purple-700 border-purple-500/30 hover:bg-purple-500/30'
    case 'on_sale':
      return 'bg-rose-500/20 text-rose-700 border-rose-500/30 hover:bg-rose-500/30'
    default:
      return 'bg-gray-600 hover:bg-gray-600 '
  }
}

export const getStatusText = (status: ProductStatus, dir: string, translations?: {
  bestSeller?: string
  new?: string
  comingSoon?: string
  onSale?: string
}) => {
  if (dir === 'rtl') {
    switch (status) {
      case 'best_seller':
        return translations?.bestSeller || 'الأكثر مبيعاً'
      case 'new':
        return translations?.new || 'جديد'
      case 'coming_soon':
        return translations?.comingSoon || 'قريباً'
      case 'on_sale':
        return translations?.onSale || 'تخفيض'
      default:
        return ''
    }
  }
  switch (status) {
    case 'best_seller':
      return translations?.bestSeller || 'Best Seller'
    case 'new':
      return translations?.new || 'New'
    case 'coming_soon':
      return translations?.comingSoon || 'Coming Soon'
    case 'on_sale':
      return translations?.onSale || 'On Sale'
    default:
      return ''
  }
}
