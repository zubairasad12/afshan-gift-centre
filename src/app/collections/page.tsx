import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowRight, Sparkles, ShieldCheck, Truck, PhoneCall, Gift } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { SITE_NAME, CONTACT_PHONE_FORMATTED } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Gift Collections | ${SITE_NAME}`,
  description: 'Explore our curated collections of luxury tissue boxes, botanical plants, artisan pots, handcrafted vases, and gilded wall frames in Vehari and nationwide.',
};

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  categoryGroup: 'Gifts' | 'Decor' | 'Botanicals' | 'Lighting';
  itemCount?: number;
}

const GIFT_COLLECTIONS: CollectionItem[] = [
  {
    id: 'c-tissue-boxes',
    name: 'Tissue Boxes',
    slug: 'tissue-boxes',
    description: 'Mother-of-pearl inlaid, velvet embroidered, and artisan wooden tissue box covers.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Gifts',
    itemCount: 18,
  },
  {
    id: 'c-plants',
    name: 'Botanical Plants',
    slug: 'plants',
    description: 'Lifelike faux greenery, fiddle leaf figs, mini olive trees, and succulent gifts.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Botanicals',
    itemCount: 24,
  },
  {
    id: 'c-pots',
    name: 'Pots & Planters',
    slug: 'pots',
    description: 'Hand-hammered brass planters, glazed ceramic bowls, and elevated iron stand pots.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Botanicals',
    itemCount: 20,
  },
  {
    id: 'c-vases',
    name: 'Artisan Vases',
    slug: 'vases',
    description: 'Fluted glass, textured ceramic, and porcelain statement vases for flower arrangements.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Decor',
    itemCount: 28,
  },
  {
    id: 'c-wall-frames',
    name: 'Wall Frames & Art',
    slug: 'wall-frames',
    description: 'Embossed gold Islamic calligraphy, multi-aperture gallery frames, and fine art pieces.',
    image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Decor',
    itemCount: 32,
  },
  {
    id: 'c-table-lamps',
    name: 'Table Lamps',
    slug: 'table-lamps',
    description: 'Amber fluted glass, ceramic bases, and warm bedside ambient lamps.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Lighting',
    itemCount: 15,
  },
  {
    id: 'c-floor-lamps',
    name: 'Floor Lamps',
    slug: 'floor-lamps',
    description: 'Minimalist tripod and warm ambient arc lamps for reading and room corners.',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Lighting',
    itemCount: 8,
  },
  {
    id: 'c-candle-stands',
    name: 'Candle Stands',
    slug: 'candle-stands',
    description: 'Rose quartz pedestals, brass candelabras, and festive taper candle holders.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Gifts',
    itemCount: 16,
  },
  {
    id: 'c-scented-candles',
    name: 'Scented Candles',
    slug: 'scented-candles',
    description: 'Hand-poured pure soy wax infused with royal oud, amber, and jasmine scents.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Gifts',
    itemCount: 14,
  },
  {
    id: 'c-mirrors',
    name: 'Mirrors',
    slug: 'mirrors',
    description: 'Arched vanity, filigree brass frames, and statement decorative wall mirrors.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Decor',
    itemCount: 12,
  },
  {
    id: 'c-clocks',
    name: 'Clocks',
    slug: 'clocks',
    description: 'Silent sweep Roman numeral clocks, vintage brass & wooden wall timepieces.',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Decor',
    itemCount: 10,
  },
  {
    id: 'c-trays',
    name: 'Trays & Table Decor',
    slug: 'trays',
    description: 'Decorative vanity trays, brass serving platters, and decorative centerpieces.',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    categoryGroup: 'Decor',
    itemCount: 19,
  },
];

export default async function CollectionsPage() {
  // Query actual item counts from DB if available
  let collections = GIFT_COLLECTIONS;
  try {
    const dbCategories = await prisma.category.findMany({
      select: {
        slug: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (dbCategories.length > 0) {
      const countMap = new Map(dbCategories.map((c) => [c.slug, c._count.products]));
      collections = GIFT_COLLECTIONS.map((c) => ({
        ...c,
        itemCount: countMap.get(c.slug) ?? c.itemCount,
      }));
    }
  } catch (err) {
    console.error('Error fetching dynamic collection counts:', err);
  }

  const giftHighlights = [
    { name: 'Tissue Boxes', slug: 'tissue-boxes', count: '18 Designs' },
    { name: 'Plants', slug: 'plants', count: '24 Designs' },
    { name: 'Pots', slug: 'pots', count: '20 Designs' },
    { name: 'Vases', slug: 'vases', count: '28 Designs' },
    { name: 'Wall Frames', slug: 'wall-frames', count: '32 Designs' },
  ];

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#F5F0EB] py-14 sm:py-20 border-b border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B8956A] block mb-3">
            Gift Showroom
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C2C2C] mb-4">
            Curated Gift Collections
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Thoughtfully organized to help you find the ideal present. Explore our signature tissue box covers, everlasting plants, artistic pots, decorative vases, and gilded frames.
          </p>

          {/* Quick Highlight Chips */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8">
            {giftHighlights.map((chip) => (
              <Link
                key={chip.slug}
                href={`/collections/${chip.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-white border border-stone-300/80 text-[#2C2C2C] hover:border-[#B8956A] hover:text-[#B8956A] transition-colors shadow-xs"
              >
                <span>{chip.name}</span>
                <span className="text-stone-400">· {chip.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {collections.map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-stone-200/80 shadow-subtle hover:shadow-card transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F0EB]">
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-[#2C2C2C] shadow-xs">
                      {col.categoryGroup}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs uppercase tracking-wider text-amber-200">
                      {col.itemCount ? `${col.itemCount} Items` : 'Featured Collection'}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                      {col.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#2C2C2C] group-hover:text-[#B8956A] transition-colors">
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Gifting Services */}
      <section className="bg-white py-16 border-t border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-[#FAFAF7] border border-stone-200/60">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F0EB] flex items-center justify-center text-[#2C2C2C] mb-4">
                <Gift className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#2C2C2C]">Custom Gift Packaging</h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Gift-wrapped in luxury cream boxes with satin ribbons and personalized cards upon request.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAFAF7] border border-stone-200/60">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F0EB] flex items-center justify-center text-[#2C2C2C] mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#2C2C2C]">Free Delivery & COD</h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Free shipping on all orders over Rs. 10,000 anywhere in Pakistan with Cash on Delivery available.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAFAF7] border border-stone-200/60">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F0EB] flex items-center justify-center text-[#2C2C2C] mb-4">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#2C2C2C]">Vehari Showroom Direct</h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Questions or bulk wedding gift packages? WhatsApp us directly at {CONTACT_PHONE_FORMATTED}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
