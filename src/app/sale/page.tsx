import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Tag, Sparkles, Percent, Truck, PhoneCall, ChevronRight } from 'lucide-react';
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
  description: 'Shop exclusive discounts on luxury handcrafted sofas, dining sets, mirrors, and home decor at Afshan Gift Centre Vehari.',
};

const SAMPLE_SALE_PRODUCTS: Product[] = [
  {
    id: 'sale-1',
    name: 'Royale Chesterfield 3-Seater Velvet Sofa',
    slug: 'royale-chesterfield-3-seater-velvet-sofa',
    description: 'Deep button-tufted upholstery with solid Sheesham wood frame and high-density foam.',
    sku: 'AGC-SOF-001',
    price: 85000,
    compareAtPrice: 95000,
    isFeatured: true,
    isActive: true,
    isOnSale: true,
    material: 'Premium Velvet & Sheesham Wood',
    dimensions: '88" W x 36" D x 32" H',
    stock: 4,
    images: [
      {
        id: 'img-sale-1a',
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        altText: 'Royale Chesterfield Sofa',
        isPrimary: true,
      },
    ],
    variants: [],
    category: { id: 'c-sofas', name: 'Sofas', slug: 'sofas' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sale-2',
    name: 'Artisan Solid Sheesham 6-Seater Dining Table',
    slug: 'artisan-solid-sheesham-dining-table',
    description: 'Natural grain solid Sheesham hardwood finished in satin warm walnut lacquer.',
    sku: 'AGC-DIN-001',
    price: 110000,
    compareAtPrice: 125000,
    isFeatured: true,
    isActive: true,
    isOnSale: true,
    material: '100% Solid Sheesham Hardwood',
    dimensions: '72" L x 36" W x 30" H',
    stock: 5,
    images: [
      {
        id: 'img-sale-2a',
        url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
        altText: 'Solid Sheesham Dining Table',
        isPrimary: true,
      },
    ],
    variants: [],
    category: { id: 'c-dining', name: 'Dining Tables', slug: 'dining-tables' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sale-3',
    name: 'Modern Fluted Brass Statement Chandelier',
    slug: 'modern-fluted-brass-statement-chandelier',
    description: 'Hand-burnished brushed brass frame with frosted warm LED diffusers.',
    sku: 'AGC-LGT-001',
    price: 32000,
    compareAtPrice: 38000,
    isFeatured: false,
    isActive: true,
    isOnSale: true,
    material: 'Solid Brass & Frosted Acrylic',
    dimensions: '32" Dia x 24" H',
    stock: 7,
    images: [
      {
        id: 'img-sale-3a',
        url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
        altText: 'Modern Fluted Brass Chandelier',
        isPrimary: true,
      },
    ],
    variants: [],
    category: { id: 'c-lighting', name: 'Lighting', slug: 'lighting' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sale-4',
    name: 'Handcrafted Moroccan Arch Dressing Mirror',
    slug: 'handcrafted-moroccan-arch-dressing-mirror',
    description: 'Antiqued gold leaf finish over solid wood carving with premium distortion-free glass.',
    sku: 'AGC-DEC-001',
    price: 24000,
    compareAtPrice: 29000,
    isFeatured: true,
    isActive: true,
    isOnSale: true,
    material: 'Solid Wood & Beveled Glass',
    dimensions: '60" H x 28" W',
    stock: 6,
    images: [
      {
        id: 'img-sale-4a',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        altText: 'Moroccan Arch Mirror',
        isPrimary: true,
      },
    ],
    variants: [],
    category: { id: 'c-mirrors', name: 'Mirrors', slug: 'mirrors' },
    createdAt: new Date().toISOString(),
  },
];

export default async function SalePage({ searchParams }: SalePageProps) {
  const sort = searchParams?.sort || 'featured';
  const minPrice = searchParams?.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;

  let saleProducts: Product[] = [];

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
        isOnSale: true,
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
  } catch (err) {
    console.error('Failed to load sale products from database:', err);
  }

  if (saleProducts.length === 0) {
    saleProducts = SAMPLE_SALE_PRODUCTS;
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
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
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
            <li className="font-semibold text-[#2C2C2C]">
              Special Offers & Sale
            </li>
          </ol>
        </div>
      </nav>

      {/* Sale Hero Banner */}
      <header className="relative bg-[#2C2C2C] text-white py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B8956A_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C75050] text-white text-xs font-semibold uppercase tracking-widest mb-4">
            <Percent className="w-3.5 h-3.5" />
            <span>Limited Time Offers</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight leading-tight text-white max-w-3xl mx-auto">
            Special Sale & Clearance
          </h1>
          <p className="mt-3 text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Exclusive discounts on handcrafted solid wood furniture, crystal lighting, and luxury decor pieces direct from our Vehari workshop.
          </p>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-stone-300">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#B8956A]" /> Free Shipping Over Rs. 10,000
            </span>
            <span className="h-3 w-px bg-stone-700 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#B8956A]" /> Up to 30% Off Selected Collections
            </span>
            <span className="h-3 w-px bg-stone-700 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#B8956A]" /> Showroom Helpline: {CONTACT_PHONE_FORMATTED}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200 mb-8">
          <div>
            <span className="text-sm font-semibold text-[#2C2C2C]">
              {filtered.length} {filtered.length === 1 ? 'Discounted Item' : 'Discounted Items'} Available
            </span>
          </div>

          {/* Sort bar */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500">Sort by:</span>
            <div className="flex bg-white border border-stone-200 divide-x divide-stone-200">
              <Link
                href="/sale?sort=featured"
                className={`px-3 py-1.5 transition-colors ${sort === 'featured' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'}`}
              >
                Featured
              </Link>
              <Link
                href="/sale?sort=discount"
                className={`px-3 py-1.5 transition-colors ${sort === 'discount' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'}`}
              >
                Biggest Discount
              </Link>
              <Link
                href="/sale?sort=price-asc"
                className={`px-3 py-1.5 transition-colors ${sort === 'price-asc' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'}`}
              >
                Price: Low to High
              </Link>
              <Link
                href="/sale?sort=price-desc"
                className={`px-3 py-1.5 transition-colors ${sort === 'price-desc' ? 'bg-[#2C2C2C] text-white font-medium' : 'text-stone-700 hover:bg-stone-50'}`}
              >
                Price: High to Low
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Contact Assistance Note */}
        <div className="mt-16 bg-[#F5F0EB] border border-stone-200/90 p-8 text-center max-w-2xl mx-auto">
          <Tag className="w-6 h-6 text-[#B8956A] mx-auto mb-2" />
          <h3 className="font-serif text-lg font-semibold text-[#2C2C2C]">
            Looking for Bulk or Wedding Package Discounts?
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            We provide bespoke packages for newly constructed homes and bridal suites in Vehari and Southern Punjab. Contact our master woodworkers directly.
          </p>
          <a
            href="https://wa.me/923001005861?text=Hi%20Afshan%20Gift%20Centre,%20I%20am%20inquiring%20about%20bulk/wedding%20furniture%20discounts"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block px-6 py-2.5 bg-[#B8956A] hover:bg-[#A07F56] text-white text-xs uppercase font-semibold tracking-wider transition-colors"
          >
            WhatsApp Inquiry (0300 1005861)
          </a>
        </div>
      </main>
    </div>
  );
}
