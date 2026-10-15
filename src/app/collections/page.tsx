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
    description: 'Gold metal embossed, mirror finished, and luxury crystal tissue box covers.',
    image: '/uploads/1791997481095-WhatsApp_Image_2026-10-13_at_8.57.34_PM.jpeg',
    categoryGroup: 'Gifts',
  },
  {
    id: 'c-plants',
    name: 'Botanical Plants',
    slug: 'plants',
    description: 'Lifelike faux greenery, money plant leaves, banana leaf decor, and evergreen botanicals.',
    image: '/uploads/1791997237049-WhatsApp_Image_2026-10-13_at_8.57.42_PM__1_.jpeg',
    categoryGroup: 'Botanicals',
  },
  {
    id: 'c-pots',
    name: 'Pots & Planters',
    slug: 'pots',
    description: 'Hand-hammered brass metal planters, ribbed ceramic pots, and dual-tone stands.',
    image: '/uploads/1791998246038-WhatsApp_Image_2026-10-13_at_8.57.58_PM__1_.jpeg',
    categoryGroup: 'Botanicals',
  },
  {
    id: 'c-vases',
    name: 'Artisan Vases',
    slug: 'vases',
    description: 'Fluted glass, tinted borosilicate, and textured stoneware vases for elegant living spaces.',
    image: '/uploads/1791998850209-WhatsApp_Image_2026-10-13_at_8.57.33_PM.jpeg',
    categoryGroup: 'Decor',
  },
  {
    id: 'c-wall-frames',
    name: 'Wall Frames & Art',
    slug: 'wall-frames',
    description: '3D floral metal frames, calligraphy wall decor, and gilded multi-tone hanging art.',
    image: '/uploads/1791996994883-WhatsApp_Image_2026-10-13_at_8.57.47_PM__2_.jpeg',
    categoryGroup: 'Decor',
  },
  {
    id: 'c-table-lamps',
    name: 'Table Lamps',
    slug: 'table-lamps',
    description: 'Amber fluted glass, pleated shade accents, and warm bedside ambient lamps.',
    image: '/uploads/1791996953409-WhatsApp_Image_2026-10-13_at_8.57.43_PM__1_.jpeg',
    categoryGroup: 'Lighting',
  },
  {
    id: 'c-floor-lamps',
    name: 'Floor Lamps',
    slug: 'floor-lamps',
    description: 'Minimalist arc floor lamps with heavy marble base for reading corners.',
    image: '/uploads/1791997730155-WhatsApp_Image_2026-10-13_at_8.57.43_PM.jpeg',
    categoryGroup: 'Lighting',
  },
  {
    id: 'c-candle-stands',
    name: 'Candle Stands',
    slug: 'candle-stands',
    description: 'Rose quartz pedestals, brass candelabras, and crystal candle holders.',
    image: '/uploads/1791997169258-WhatsApp_Image_2026-10-13_at_8.57.40_PM.jpeg',
    categoryGroup: 'Gifts',
  },
  {
    id: 'c-scented-candles',
    name: 'Scented Candles',
    slug: 'scented-candles',
    description: 'Amber jar scented candles and decorative bird sparrow candles.',
    image: '/uploads/1791997665357-WhatsApp_Image_2026-10-13_at_8.57.40_PM__1_.jpeg',
    categoryGroup: 'Gifts',
  },
  {
    id: 'c-crystal-jar',
    name: 'Crystal Jars',
    slug: 'crystal-jar',
    description: 'Decorative globe candy jars and crystal dry fruit sets with lids.',
    image: '/uploads/1791997405884-WhatsApp_Image_2026-10-13_at_8.57.35_PM__2_.jpeg',
    categoryGroup: 'Gifts',
  },
  {
    id: 'c-plant-holders-stand',
    name: 'Plant Holders & Stands',
    slug: 'plant-holders-stand',
    description: 'Metal cage plant holders, cycle stands, and elevated cactus plant displays.',
    image: '/uploads/1791997278580-WhatsApp_Image_2026-10-13_at_8.57.49_PM__1_.jpeg',
    categoryGroup: 'Botanicals',
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

  const giftHighlights = collections
    .slice(0, 5)
    .map((c) => ({
      name: c.name,
      slug: c.slug,
      count: c.itemCount != null ? `${c.itemCount} Items` : 'View All',
    }));

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={col.image}
                    alt={col.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-[#2C2C2C] shadow-xs">
                      {col.categoryGroup}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs uppercase tracking-wider text-amber-200">
                      {col.itemCount != null && col.itemCount > 0 ? `${col.itemCount} Items` : col.categoryGroup}
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
