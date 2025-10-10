export type ProductStatus = "best_seller" | "new" | "coming_soon" | "on_sale"  | "normal";
export type ProductDetail = {
  title: string
  description: string
}
export interface ProductProps {
  id?: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  sku: string;
  descriptionEn?: string;
  descriptionAr?: string;
  detailsEn?: ProductDetail[] | undefined ;
  detailsAr?: ProductDetail[] | undefined ;
  images?: string[];
  imageAlt?: string;
  price?: number | any;
  isPriceActive?: boolean;
  discountType?: "fixed" | "percentage" | "none"
  discountValue?: number;
  quantityInStock?: number | any;
  brand?: string;
  isFeatured?: boolean;
  offerEn?: string;
  offerAr?: string;
  status?: ProductStatus; // ✅ النوع الموحد
  color?: string;
  warrantyEn?: string;
  warrantyAr?: string;
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

