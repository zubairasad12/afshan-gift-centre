import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Tag, Sparkles, Percent, Truck, PhoneCall, ChevronRight, Gift } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/product';
import { SITE_NAME, CONTACT_PHONE_FORMATTED } from '@/lib/constants';

interface SalePageProps {
  searchParams?: {
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export const metadata: Metadata = {
  title: `Special Sale & Offers | ${SITE_NAME}`,
  description: 'Shop exclusive gift discounts on tissue boxes, plants, pots, vases, wall frames, and lamps at Afshan Gift Centre Vehari.',
};

export default async function SalePage({ searchParams }: SalePageProps) {
  const sort = searchParams?.sort || 'featured';
  const minPrice = searchParams?.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;

  let saleProducts: Product[] = [];
  let recommendedProducts: Product[] = [];

  try {
    const rawProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { isOnSale: true },
          { compareAtPrice: { gt: 0 } },
        ],
      },
      include: {
        images: { orderBy: { position: 'asc' } },
        category: true,
        variants: { where: { isActive: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 40,
    });

    if (rawProducts.length > 0) {
      saleProducts = rawProducts.map((p) => ({
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
    }

    // Always have top catalogue recommendations ready in case filters yield no products
    const rawRecs = await prisma.product.findMany({
      where: { isActive: true },
      take: 4,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      include: {
        images: { orderBy: { position: 'asc' } },
        category: true,
        variants: { where: { isActive: true } },
      },
    });

    recommendedProducts = rawRecs.map((p) => ({
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
    console.error('Failed to load sale products from database:', err);
  }

  // Filter by price
  let filtered = saleProducts.filter((product) => {
    if (minPrice !== undefined && !isNaN(minPrice) && product.price < minPrice) return false;
    if (maxPrice !== undefined && !isNaN(maxPrice) && product.price > maxPrice) return false;
    return true;
  });

  // Sort products
  filtered = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'discount') {
      const discA = a.compareAtPrice ? (a.compareAtPrice - a.price) / a.compareAtPrice : 0;
      const discB = b.compareAtPrice ? (b.compareAtPrice - b.price) / b.compareAtPrice : 0;
      return discB - discA;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Sale Hero Banner */}
      <section className="relative bg-[#2C2C2C] text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-stone-900/80 z-0" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B8956A]/20 border border-[#B8956A]/40 text-amber-200 text-xs font-semibold uppercase tracking-widest mb-4">
            <Percent className="w-3.5 h-3.5 text-[#B8956A]" />
            Limited Time Offers
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Gift Specials & Promotional Pieces
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Discover exceptional savings on handcrafted tissue boxes, lifelike botanicals, vases, wall frames, and ambient lamps.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Sort & Count bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200 mb-8">
          <span className="text-xs sm:text-sm font-semibold text-[#2C2C2C]">
            Showing {filtered.length} {filtered.length === 1 ? 'Special Offer' : 'Special Offers'}
          </span>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500">Sort by:</span>
            <div className="flex bg-white border border-stone-200 divide-x divide-stone-200">
              <Link
                href="/sale?sort=featured"
                className={`px-3 py-1.5 transition-colors ${
                  sort === 'featured' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                Featured
              </Link>
              <Link
                href="/sale?sort=discount"
                className={`px-3 py-1.5 transition-colors ${
                  sort === 'discount' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                Biggest Discount
              </Link>
              <Link
                href="/sale?sort=price-asc"
                className={`px-3 py-1.5 transition-colors ${
                  sort === 'price-asc' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                Price: Low to High
              </Link>
              <Link
                href="/sale?sort=price-desc"
                className={`px-3 py-1.5 transition-colors ${
                  sort === 'price-desc' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                Price: High to Low
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid or Clean Empty State */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center py-16 px-4 bg-white border border-stone-200 max-w-xl mx-auto rounded-xl">
              <Tag className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-semibold text-[#2C2C2C]">
                No discounted products found
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                There are currently no items matching your price range in the sale collection. Browse our full gift catalog below.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/collections"
                  className="px-6 py-2.5 bg-[#2C2C2C] hover:bg-black text-white text-xs uppercase font-semibold tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore All Gifts</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/collections/tissue-boxes"
                  className="px-6 py-2.5 border border-stone-300 hover:border-stone-400 text-[#2C2C2C] text-xs uppercase font-semibold tracking-wider transition-colors"
                >
                  Tissue Boxes
                </Link>
              </div>
            </div>

            {/* Recommendations below empty state */}
            {recommendedProducts.length > 0 && (
              <div className="mt-12 pt-10 border-t border-stone-200">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <span className="text-[#B8956A] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Recommended For You
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#2C2C2C]">
                    Popular Gift Items
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {recommendedProducts.map((recProd) => (
                    <ProductCard key={recProd.id} product={recProd} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
