export type ProductStatus = "best_seller" | "new" | "coming_soon";

export interface ProductProps {
  id?: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  sku: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image?: string;
  imageName?: string;
  images?: string[];
  price?: number | any;
  isPriceActive?: boolean;
  discountType?: "fixed" | "percentage" | "none"
  discountValue?: number;
  quantityInStock?: number | any;
  brand?: string;
  isFeatured?: boolean;
  size?: string;
  material?: string;
  materialAr?: string;
  badge?: string;
  badgeAr?: string;
  weight?: number;
  dimensions?: string;
  status?: ProductStatus; // ✅ النوع الموحد
  color?: string;
  capacity?: string;
  categoryId: number;
  relatedProducts?: number[];
  availableProducts?: number[];
  filteredProducts?: number[];
  selectedRelatedProducts?: number[];
  createdAt: Date
  category?: {
    id: number
    nameEn: string
    nameAr: string
  }
}

