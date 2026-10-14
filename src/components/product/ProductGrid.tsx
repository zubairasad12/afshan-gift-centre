'use client';

import React from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  skeletonCount = 8,
  className,
  emptyMessage = 'No products found in this collection.',
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8',
          className
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <Skeleton key={idx} variant="productCard" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-stone-300 p-8 my-8 bg-[#F5F0EB]/30">
        <p className="text-stone-500 text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8',
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
