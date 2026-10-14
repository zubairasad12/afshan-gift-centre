'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_SEARCH_PRODUCTS = [
  {
    id: 'p1',
    name: 'Royale Chesterfield Velvet 3-Seater Sofa',
    category: 'Sofas',
    price: 85000,
    compareAtPrice: 95000,
    slug: 'royale-chesterfield-velvet-sofa',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p2',
    name: 'Artisan Solid Sheesham Dining Table 6-Seater',
    category: 'Dining Tables',
    price: 110000,
    compareAtPrice: 125000,
    slug: 'artisan-solid-sheesham-dining-table',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p3',
    name: 'Gilded Brass Arch Floor Standing Mirror',
    category: 'Decor',
    price: 24500,
    compareAtPrice: 29000,
    slug: 'gilded-brass-arch-floor-standing-mirror',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p4',
    name: 'Venetian Crystal Grand Chandelier',
    category: 'Lighting',
    price: 68000,
    compareAtPrice: 78000,
    slug: 'venetian-crystal-grand-chandelier',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p5',
    name: 'Nordic Oak Minimalist Coffee Table',
    category: 'Coffee Tables',
    price: 32000,
    compareAtPrice: 38000,
    slug: 'nordic-oak-minimalist-coffee-table',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p6',
    name: 'Vehari Heritage Handcarved King Bedstead',
    category: 'Beds',
    price: 145000,
    compareAtPrice: 165000,
    slug: 'vehari-heritage-handcarved-king-bedstead',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
  },
];

const POPULAR_SEARCHES = [
  'Chesterfield Sofa',
  'Dining Table',
  'Brass Mirror',
  'Chandeliers',
  'King Bed',
  'Wall Sconce',
  'Vases',
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(SAMPLE_SEARCH_PRODUCTS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!query.trim()) {
        setResults(SAMPLE_SEARCH_PRODUCTS);
      } else {
        const q = query.toLowerCase();
        const filtered = SAMPLE_SEARCH_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
        setResults(filtered);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
    >
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Top bar with Close */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 text-stone-500 hover:text-[#2C2C2C] text-sm uppercase tracking-wider font-medium p-2 transition-colors"
            aria-label="Close search"
          >
            <span>Close (ESC)</span>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Search Input */}
        <div className="relative border-b-2 border-[#2C2C2C] pb-4 mb-8">
          <div className="flex items-center gap-4">
            <Search className="w-8 h-8 text-[#B8956A] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search luxury furniture, chandeliers, decor..."
              className="w-full text-2xl md:text-4xl font-serif bg-transparent text-[#2C2C2C] placeholder:text-stone-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-stone-400 hover:text-[#2C2C2C]"
                aria-label="Clear query"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mb-10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
            Popular Searches
          </h4>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-3.5 py-1.5 text-xs bg-[#F5F0EB] text-[#3D3229] hover:bg-[#2C2C2C] hover:text-white transition-colors duration-150"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#3D3229]">
              {query ? `Search Results (${results.length})` : 'Recommended For You'}
            </h3>
            {query && (
              <Link
                href={`/collections?search=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="text-xs uppercase tracking-wider font-semibold text-[#B8956A] hover:underline flex items-center gap-1"
              >
                <span>View all results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {results.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-base text-stone-500 mb-4">
                No products found matching &ldquo;{query}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-sm text-[#B8956A] hover:underline uppercase tracking-wider font-semibold"
              >
                Reset search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="group flex gap-4 p-3 bg-white border border-stone-200/80 hover:border-[#B8956A] transition-all duration-200 hover:shadow-subtle"
                >
                  <div className="relative w-20 h-24 bg-stone-100 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'; }}
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[10px] tracking-wider uppercase text-stone-500 mb-1">
                      {product.category}
                    </span>
                    <h5 className="text-sm font-medium text-[#2C2C2C] group-hover:text-[#B8956A] transition-colors truncate">
                      {product.name}
                    </h5>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-[#2C2C2C]">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
