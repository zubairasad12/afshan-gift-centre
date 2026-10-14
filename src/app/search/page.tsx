import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Search as SearchIcon, Filter, RotateCcw, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/product';
import { SITE_NAME } from '@/lib/constants';

interface SearchPageProps {
  searchParams?: {
    q?: string;
    search?: string;
    sort?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export const metadata: Metadata = {
  title: `Search Products | ${SITE_NAME}`,
  description: 'Search our handcrafted furniture, lighting, and home decor pieces at Afshan Gift Centre Vehari.',
};

const POPULAR_SEARCH_TERMS = [
  'Sofa',
  'Dining Table',
  'Chandelier',
  'Velvet Chair',
  'Mirror',
  'Clock',
  'Vase',
  'Bed',
  'Candles',
  'Coffee Table',
];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams?.q || searchParams?.search || '').trim();
  const sort = searchParams?.sort || 'featured';
  const categoryFilter = searchParams?.category || '';
  const minPrice = searchParams?.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;

  let products: Product[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];

  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      take: 12,
    });

    const where: any = {
      isActive: true,
    };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { tags: { contains: query } },
        { material: { contains: query } },
      ];
    }

    if (categoryFilter) {
      where.category = {
        slug: categoryFilter,
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined && !isNaN(minPrice)) where.price.gte = minPrice;
      if (maxPrice !== undefined && !isNaN(maxPrice)) where.price.lte = maxPrice;
    }

    let orderBy: any = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'price-asc') orderBy = [{ price: 'asc' }];
    else if (sort === 'price-desc') orderBy = [{ price: 'desc' }];
    else if (sort === 'newest') orderBy = [{ createdAt: 'desc' }];

    const rawProducts = await prisma.product.findMany({
      where,
      orderBy,
      take: 36,
      include: {
        images: { orderBy: { position: 'asc' } },
        category: true,
        variants: { where: { isActive: true } },
      },
    });

    products = rawProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      sku: p.sku,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
      isOnSale: p.isOnSale,
      material: p.material || undefined,
      dimensions: p.dimensions || undefined,
      images: p.images.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.alt || p.name,
        isPrimary: img.isPrimary,
      })),
      variants: p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
      })),
      category: p.category
        ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
        : undefined,
      createdAt: p.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error('Failed to run search query:', err);
  }

  // Fallback demo results if database product count is empty and user searched
  if (products.length === 0 && query) {
    const demoItems: Product[] = [
      {
        id: 'sr-1',
        name: 'Royale Chesterfield 3-Seater Velvet Sofa',
        slug: 'royale-chesterfield-3-seater-velvet-sofa',
        description: 'Deep button-tufted upholstery with solid Sheesham wood frame.',
        sku: 'AGC-SOF-001',
        price: 85000,
        compareAtPrice: 95000,
        isFeatured: true,
        isActive: true,
        isOnSale: true,
        material: 'Velvet & Sheesham Wood',
        images: [
          {
            id: 'sr-1a',
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
            altText: 'Chesterfield Sofa',
            isPrimary: true,
          },
        ],
        variants: [],
        category: { id: 'c-sofas', name: 'Sofas', slug: 'sofas' },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sr-2',
        name: 'Artisan Solid Sheesham 6-Seater Dining Table',
        slug: 'artisan-solid-sheesham-dining-table',
        description: 'Natural grain solid Sheesham hardwood finished in satin warm walnut.',
        sku: 'AGC-DIN-001',
        price: 110000,
        compareAtPrice: 125000,
        isFeatured: true,
        isActive: true,
        isOnSale: true,
        material: '100% Solid Sheesham',
        images: [
          {
            id: 'sr-2a',
            url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
            altText: 'Dining Table',
            isPrimary: true,
          },
        ],
        variants: [],
        category: { id: 'c-dining', name: 'Dining Tables', slug: 'dining-tables' },
        createdAt: new Date().toISOString(),
      },
    ];

    const qLower = query.toLowerCase();
    products = demoItems.filter(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.description.toLowerCase().includes(qLower) ||
        p.category?.name.toLowerCase().includes(qLower)
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search Header & Form */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#B8956A] font-semibold block mb-2">
            Catalog Search
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C2C2C] tracking-tight">
            Find Your Perfect Piece
          </h1>

          {/* Search Input Bar */}
          <form action="/search" method="GET" className="mt-6 flex shadow-sm max-w-2xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search sofas, dining tables, lamps, vases, clocks..."
                className="w-full pl-11 pr-4 py-3.5 text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-[#B8956A] bg-white"
              />
              <SearchIcon className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-6 sm:px-8 py-3.5 bg-[#2C2C2C] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Popular Search Suggestions */}
          <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-xs text-stone-500">
            <span className="text-stone-400">Popular:</span>
            {POPULAR_SEARCH_TERMS.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="px-2.5 py-1 bg-white border border-stone-200 hover:border-[#B8956A] text-stone-700 hover:text-[#B8956A] transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Filter and Results bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200 mb-8">
          <div>
            <h2 className="text-sm font-semibold text-[#2C2C2C]">
              {query ? (
                <>
                  Results for &ldquo;<span className="text-[#B8956A]">{query}</span>&rdquo; ({products.length})
                </>
              ) : (
                <>All Available Products ({products.length})</>
              )}
            </h2>
          </div>

          {/* Sort links */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500">Sort by:</span>
            <div className="flex bg-white border border-stone-200 divide-x divide-stone-200">
              <Link
                href={`/search?q=${encodeURIComponent(query)}&sort=featured`}
                className={`px-3 py-1.5 transition-colors ${
                  sort === 'featured' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                Featured
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(query)}&sort=newest`}
                className={`px-3 py-1.5 transition-colors ${
                  sort === 'newest' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                Newest
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(query)}&sort=price-asc`}
                className={`px-3 py-1.5 transition-colors ${
                  sort === 'price-asc' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                Price: Low to High
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(query)}&sort=price-desc`}
                className={`px-3 py-1.5 transition-colors ${
                  sort === 'price-desc' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                Price: High to Low
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white border border-stone-200 max-w-xl mx-auto">
            <SearchIcon className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-semibold text-[#2C2C2C]">
              No exact matches found for &ldquo;{query}&rdquo;
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              Try checking your spelling, using more general search terms, or exploring our full catalog by category.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/collections"
                className="px-6 py-2.5 bg-[#2C2C2C] hover:bg-black text-white text-xs uppercase font-semibold tracking-wider transition-colors inline-flex items-center gap-2"
              >
                <span>Browse All Collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/collections/sale"
                className="px-6 py-2.5 border border-stone-300 hover:border-stone-400 text-[#2C2C2C] text-xs uppercase font-semibold tracking-wider transition-colors"
              >
                View Discounted Items
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
