import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  category?: string;
  inStock?: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem | Product) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem | Product) => void;
  isInWishlist: (id: string) => boolean;
  getCount: () => number;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) {
            return state;
          }
          const wishlistItem: WishlistItem = {
            id: item.id,
            name: item.name,
            slug: item.slug,
            price: item.price,
            compareAtPrice: item.compareAtPrice,
            image:
              'image' in item && typeof item.image === 'string'
                ? item.image
                : (item as Product).images?.[0]?.url || '/placeholder.jpg',
            category: (item as Product).category?.name,
            inStock: true,
          };
          return { items: [...state.items, wishlistItem] };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (item) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(item.id)) {
          removeItem(item.id);
        } else {
          addItem(item);
        }
      },

      isInWishlist: (id: string) => {
        const { items } = get();
        return items.some((item) => item.id === id);
      },

      getCount: () => {
        const { items } = get();
        return items.length;
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'afshan-wishlist-storage',
    }
  )
);

export default useWishlistStore;
