import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ChevronRight, SlidersHorizontal, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/product';
import { SITE_NAME, CONTACT_PHONE_FORMATTED } from '@/lib/constants';

interface CollectionPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const formattedTitle = params.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} | ${SITE_NAME}`,
    description: `Shop luxury ${formattedTitle.toLowerCase()} handcrafted with fine timber and premium fabrics at Afshan Gift Centre Vehari.`,
  };
}

export default async function CollectionDetailPage({ params, searchParams }: CollectionPageProps) {
  const slug = params.slug.toLowerCase();
  const sort = searchParams?.sort || 'featured';
  const minPrice = searchParams?.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;

  let title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  let description = `Explore our curated selection of ${title.toLowerCase()}, handcrafted in Vehari for enduring elegance and sophistication.`;

  // Fetch category or collection from database
  let dbProducts: Product[] = [];

  try {
    // Try Category first
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: { orderBy: { position: 'asc' } },
            category: true,
            variants: { where: { isActive: true } },
          },
        },
      },
    });

    if (category) {
      title = category.name;
      if (category.description) description = category.description;
      dbProducts = category.products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription || undefined,
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
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
        })),
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
        createdAt: p.createdAt.toISOString(),
      }));
    } else {
      // Try Collection
      const coll = await prisma.collection.findUnique({
        where: { slug },
        include: {
          collectionProducts: {
            include: {
              product: {
                include: {
                  images: { orderBy: { position: 'asc' } },
                  category: true,
                  variants: { where: { isActive: true } },
                },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      if (coll) {
        title = coll.name;
        if (coll.description) description = coll.description;
        dbProducts = coll.collectionProducts
          .map((cp) => cp.product)
          .filter((p) => p.isActive)
          .map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            shortDescription: p.shortDescription || undefined,
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
              compareAtPrice: v.compareAtPrice,
              stock: v.stock,
            })),
            category: p.category
              ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
              : undefined,
            createdAt: p.createdAt.toISOString(),
          }));
      }
    }
  } catch (err) {
    console.error('Error fetching collection from DB:', err);
  }

  // Only use products from database so admin modifications persist reliably
  let allProducts = dbProducts;

  // If still empty and slug is a known category like 'furniture' or 'decor', fetch top products from DB
  if (allProducts.length === 0) {
    try {
      const generalProducts = await prisma.product.findMany({
        where: { isActive: true },
        take: 12,
        include: {
          images: { orderBy: { position: 'asc' } },
          category: true,
          variants: true,
        },
      });
      if (generalProducts.length > 0) {
        allProducts = generalProducts.map((p) => ({
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
    } catch {
      // fallback already empty
    }
  }

  // Apply Price Filters
  let filteredProducts = allProducts.filter((product) => {
    if (minPrice !== undefined && !isNaN(minPrice) && product.price < minPrice) {
      return false;
    }
    if (maxPrice !== undefined && !isNaN(maxPrice) && product.price > maxPrice) {
      return false;
    }
    return true;
  });

  // Apply Sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // 'featured' default
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // Calculate helper for price bounds
  const hasActivePriceFilter = minPrice !== undefined || maxPrice !== undefined;

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-stone-200/80 bg-white py-3.5">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-xs text-stone-500">
            <li>
              <Link href="/" className="hover:text-[#B8956A] transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <li>
              <Link href="/collections" className="hover:text-[#B8956A] transition-colors">
                Collections
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <li className="font-semibold text-[#2C2C2C] truncate max-w-[200px] sm:max-w-none">
              {title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Collection Hero Header */}
      <header className="bg-[#F5F0EB] border-b border-stone-200/80 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[#B8956A] text-xs font-semibold uppercase tracking-[0.2em] block mb-2">
              Afshan Gift Centre Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2C2C2C] tracking-tight">
              {title}
            </h1>
            <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Filter and Sort Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-200 mb-8">
          {/* Item count & active filter badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-[#2C2C2C]">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
            </span>

            {hasActivePriceFilter && (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white border border-[#B8956A]/40 text-[#2C2C2C] px-2.5 py-1 inline-flex items-center gap-1.5 font-medium">
                  Price: {minPrice ? `Rs. ${minPrice.toLocaleString()}` : 'Rs. 0'} - {maxPrice ? `Rs. ${maxPrice.toLocaleString()}` : 'Any'}
                </span>
                <Link
                  href={`/collections/${slug}?sort=${sort}`}
                  className="text-xs text-[#B8956A] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </Link>
              </div>
            )}
          </div>

          {/* Quick Price Ranges & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Price Filter Links */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              <span className="text-stone-400 mr-1 font-medium">Price:</span>
              <Link
                href={`/collections/${slug}?sort=${sort}`}
                className={`px-2.5 py-1.5 border transition-colors ${
                  !hasActivePriceFilter ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                All
              </Link>
              <Link
                href={`/collections/${slug}?sort=${sort}&maxPrice=25000`}
                className={`px-2.5 py-1.5 border transition-colors ${
                  maxPrice === 25000 && !minPrice ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                Under 25k
              </Link>
              <Link
                href={`/collections/${slug}?sort=${sort}&minPrice=25000&maxPrice=75000`}
                className={`px-2.5 py-1.5 border transition-colors ${
                  minPrice === 25000 && maxPrice === 75000 ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                25k - 75k
              </Link>
              <Link
                href={`/collections/${slug}?sort=${sort}&minPrice=75000`}
                className={`px-2.5 py-1.5 border transition-colors ${
                  minPrice === 75000 && !maxPrice ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                75k+
              </Link>
            </div>

            {/* Sorting Links Form / Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 hidden sm:inline">Sort by:</span>
              <div className="flex items-center bg-white border border-stone-200 divide-x divide-stone-200 text-xs">
                <Link
                  href={`/collections/${slug}?sort=featured${minPrice ? `&minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`}
                  className={`px-3 py-2 transition-colors ${sort === 'featured' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'}`}
                >
                  Featured
                </Link>
                <Link
                  href={`/collections/${slug}?sort=newest${minPrice ? `&minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`}
                  className={`px-3 py-2 transition-colors ${sort === 'newest' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'}`}
                >
                  Newest
                </Link>
                <Link
                  href={`/collections/${slug}?sort=price-asc${minPrice ? `&minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`}
                  className={`px-3 py-2 transition-colors ${sort === 'price-asc' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'}`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={`/collections/${slug}?sort=price-desc${minPrice ? `&minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`}
                  className={`px-3 py-2 transition-colors ${sort === 'price-desc' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'}`}
                >
                  Price: High to Low
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-white border border-dashed border-stone-300 max-w-2xl mx-auto my-12">
            <Filter className="w-10 h-10 text-stone-300 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold text-[#2C2C2C]">
              No products found in this filter
            </h3>
            <p className="text-stone-500 text-sm mt-2 max-w-md mx-auto">
              We couldn&apos;t find any items matching your price range in the {title} collection.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href={`/collections/${slug}`}
                className="px-6 py-2.5 bg-[#2C2C2C] text-white text-xs uppercase font-semibold tracking-wider hover:bg-black transition-colors"
              >
                Reset Filters
              </Link>
              <Link
                href="/collections"
                className="px-6 py-2.5 border border-stone-300 text-[#2C2C2C] text-xs uppercase font-semibold tracking-wider hover:bg-stone-50 transition-colors"
              >
                Browse All Collections
              </Link>
            </div>
          </div>
        )}

        {/* Vehari Showroom Assistance Banner */}
        <div className="mt-20 p-8 bg-[#F5F0EB] border border-stone-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-serif text-xl font-semibold text-[#2C2C2C]">
              Need custom measurements for {title}?
            </h4>
            <p className="text-stone-600 text-sm mt-1">
              Speak directly with our Vehari master craftsmen for custom fabric swatches, wood finishes, or home delivery queries.
            </p>
          </div>
          <a
            href="https://wa.me/923001005861"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 bg-[#B8956A] hover:bg-[#A07F56] text-white text-xs uppercase font-semibold tracking-wider transition-colors"
          >
            WhatsApp Support: {CONTACT_PHONE_FORMATTED}
          </a>
        </div>
      </main>
    </div>
  );
}
