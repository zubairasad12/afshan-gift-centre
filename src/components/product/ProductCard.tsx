'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';
import { useToast } from '@/components/ui/Toast';

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { success } = useToast();

  const isFavorited = isInWishlist(product.id);
  const isSoldOut = product.stock !== undefined && product.stock <= 0;
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? getDiscountPercentage(product.price, product.compareAtPrice)
      : 0;

  const primaryImage =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';
  const secondaryImage =
    product.images?.[1]?.url || primaryImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(
      {
        id: `${product.id}-default`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: primaryImage,
        maxStock: product.stock || 10,
      },
      1
    );

    success(`Added "${product.name}" to your cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <div
      className={`group relative flex flex-col bg-white border border-stone-200/80 hover:border-[#B8956A]/60 transition-all duration-300 ${
        className || ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Aspect Ratio (3:4) Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative w-full aspect-[3/4] bg-stone-100 overflow-hidden">
        {/* Main Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Badges Container (top left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isOnSale && discountPercent > 0 && (
            <Badge variant="sale">-{discountPercent}% OFF</Badge>
          )}
          {product.isNewArrival && <Badge variant="new">NEW</Badge>}
          {isSoldOut && <Badge variant="sold-out">SOLD OUT</Badge>}
        </div>

        {/* Wishlist Heart Icon (top right) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#2C2C2C] hover:text-[#C75050] transition-colors shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorited ? 'fill-[#C75050] text-[#C75050]' : ''
            }`}
          />
        </button>

        {/* Quick Add to Cart Button (appears on hover) */}
        <div className="absolute inset-x-3 bottom-3 z-10 transition-all duration-300 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            type="button"
            disabled={isSoldOut}
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2C2C2C] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#B8956A]" />
            <span>{isSoldOut ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {product.category && (
            <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">
              {product.category.name}
            </span>
          )}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-medium text-[#2C2C2C] group-hover:text-[#B8956A] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex items-baseline gap-2 pt-2 border-t border-stone-100">
          <span className="text-sm font-bold text-[#2C2C2C]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-stone-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
