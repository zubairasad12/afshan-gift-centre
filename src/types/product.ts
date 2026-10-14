export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary?: boolean;
  order?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  color?: string;
  size?: string;
  material?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  itemCount?: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId?: string;
  category?: Category;
  isFeatured: boolean;
  isActive: boolean;
  isOnSale: boolean;
  isNewArrival?: boolean;
  material?: string;
  dimensions?: string;
  tags?: string | string[];
  stock?: number;
  rating?: number;
  reviewCount?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt?: string;
}

export interface ProductFilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  isOnSale?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
