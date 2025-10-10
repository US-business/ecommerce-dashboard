export interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  image?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CategoryFormData {
  nameEn: string;
  nameAr: string;
  slug: string;
  image?: string;
}

export interface CategoryIconMapping {
  [key: string]: React.ReactElement;
}

export type CategoriesListProps = {
  categories: Category[];
  dictionary: Record<string, string>;
  dir: string;
}