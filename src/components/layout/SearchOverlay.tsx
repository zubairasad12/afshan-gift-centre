'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  slug: string;
  image: string;
}

const POPULAR_SEARCHES = [
  'Tissue Boxes',
  'Plants',
  'Planters & Pots',
  'Vases',
  'Wall Frames',
  'Table Lamps',
  'Candles',
  'Crystal Jar',
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProductItem[]>([]);
  const [recommended, setRecommended] = useState<SearchProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch initial recommended products on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Fetch featured products from live API for recommendations
      fetch('/api/search?limit=6')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.products)) {
            const mapped: SearchProductItem[] = data.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.category?.name || 'Gift Item',
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              slug: p.slug,
              image: p.images?.[0]?.url || '/uploads/1791997481095-WhatsApp_Image_2026-10-13_at_8.57.34_PM.jpeg',
            }));
            setRecommended(mapped);
          }
        })
        .catch(() => {});
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
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

  // Query live API with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=8`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.products)) {
            const mapped: SearchProductItem[] = data.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.category?.name || 'Gift Item',
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              slug: p.slug,
              image: p.images?.[0]?.url || '/uploads/1791997481095-WhatsApp_Image_2026-10-13_at_8.57.34_PM.jpeg',
            }));
            setResults(mapped);
          } else {
            setResults([]);
          }
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  if (!isOpen) return null;

  const displayList = query.trim() ? results : recommended;
  const isSearchEmpty = query.trim().length > 0 && results.length === 0 && !isLoading;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in flex flex-col justify-start overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full min-h-[50vh] p-6 md:p-12 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto">
          {/* Close Button Top */}
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-[#2C2C2C] hover:bg-stone-100 rounded-full transition-colors flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold"
              aria-label="Close search"
            >
              <span>Close</span>
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
                placeholder="Search tissue boxes, plants, pots, vases, frames, lamps..."
                className="w-full text-xl sm:text-2xl md:text-3xl font-serif bg-transparent text-[#2C2C2C] placeholder:text-stone-400 focus:outline-none"
              />
              {isLoading && (
                <Loader2 className="w-5 h-5 text-[#B8956A] animate-spin shrink-0" />
              )}
              {query && !isLoading && (
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8956A]" />
              Popular Gift Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3.5 py-1.5 text-xs bg-[#F5F0EB] text-[#3D3229] hover:bg-[#2C2C2C] hover:text-white transition-colors duration-150 rounded-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Results or Recommendations Header */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-100">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#3D3229]">
              {query.trim()
                ? `Search Results (${results.length})`
                : 'Recommended For You'}
            </h3>
            {query.trim() && (
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={onClose}
                className="text-xs uppercase tracking-wider font-semibold text-[#B8956A] hover:underline flex items-center gap-1"
              >
                <span>View on full search page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Empty Search State */}
          {isSearchEmpty ? (
            <div className="space-y-8">
              <div className="py-12 px-6 text-center bg-[#FAF7F4] border border-stone-200/80 rounded-xl">
                <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-semibold text-[#2C2C2C]">
                  No products found for &ldquo;{query}&rdquo;
                </h4>
                <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-md mx-auto">
                  We couldn&apos;t find any items matching your search. Please check your spelling or browse popular categories below.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="px-4 py-2 bg-[#2C2C2C] text-white text-xs uppercase font-semibold tracking-wider hover:bg-black transition-colors"
                  >
                    Clear Search
                  </button>
                  <Link
                    href="/collections"
                    onClick={onClose}
                    className="px-4 py-2 border border-stone-300 text-[#2C2C2C] text-xs uppercase font-semibold tracking-wider hover:bg-white transition-colors"
                  >
                    Browse Collections
                  </Link>
                </div>
              </div>

              {/* Recommended alternatives shown below empty state */}
              {recommended.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-4">
                    Recommended Alternatives:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {recommended.slice(0, 3).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="group flex gap-3 p-3 bg-white border border-stone-200/80 hover:border-[#B8956A] transition-all duration-200 hover:shadow-subtle rounded-sm"
                      >
                        <div className="relative w-16 h-20 bg-stone-100 shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="text-[10px] tracking-wider uppercase text-stone-500 mb-0.5">
                            {product.category}
                          </span>
                          <h5 className="text-xs font-medium text-[#2C2C2C] group-hover:text-[#B8956A] transition-colors truncate">
                            {product.name}
                          </h5>
                          <span className="text-xs font-semibold text-[#2C2C2C] mt-1">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {displayList.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="group flex gap-4 p-3 bg-white border border-stone-200/80 hover:border-[#B8956A] transition-all duration-200 hover:shadow-subtle rounded-sm"
                >
                  <div className="relative w-20 h-24 bg-stone-100 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[10px] tracking-wider uppercase text-stone-500 mb-1">
                      {product.category}
                    </span>
                    <h5 className="text-xs sm:text-sm font-medium text-[#2C2C2C] group-hover:text-[#B8956A] transition-colors truncate">
                      {product.name}
                    </h5>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-[#2C2C2C]">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-[11px] text-stone-400 line-through">
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
