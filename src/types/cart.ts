export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  quantity: number;
  image: string;
  variantName?: string;
  material?: string;
  maxStock?: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}
