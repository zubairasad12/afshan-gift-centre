'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Truck,
  RotateCcw,
  Lock,
  ChevronDown,
  Gift,
  Sparkles,
  PhoneCall,
  Check,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductGrid from '@/components/product/ProductGrid';
import { Product } from '@/types/product';
import { CONTACT_PHONE_FORMATTED } from '@/lib/constants';

interface HomePageClientProps {
  bestSellers: Product[];
  newArrivals: Product[];
}

const GIFT_CATEGORIES = [
  {
    name: 'Tissue Boxes',
    slug: 'tissue-boxes',
    image: '/uploads/1791997481095-WhatsApp_Image_2026-10-13_at_8.57.34_PM.jpeg',
    itemCount: 'Luxury Covers',
    description: 'Mother-of-pearl, velvet & artisan timber covers',
  },
  {
    name: 'Plants',
    slug: 'plants',
    image: '/uploads/1791997237049-WhatsApp_Image_2026-10-13_at_8.57.42_PM__1_.jpeg',
    itemCount: 'Evergreen Accents',
    description: 'Everlasting indoor greens & faux botanicals',
  },
  {
    name: 'Pots',
    slug: 'pots',
    image: '/uploads/1791998246038-WhatsApp_Image_2026-10-13_at_8.57.58_PM__1_.jpeg',
    itemCount: 'Handcrafted Planters',
    description: 'Glazed ceramic, brass & terracotta planters',
  },
  {
    name: 'Vases',
    slug: 'vases',
    image: '/uploads/1791998850209-WhatsApp_Image_2026-10-13_at_8.57.33_PM.jpeg',
    itemCount: 'Ceramic & Glass',
    description: 'Ribbed ceramic, fluted glass & porcelain vases',
  },
  {
    name: 'Wall Frames',
    slug: 'wall-frames',
    image: '/uploads/1791997948462-WhatsApp_Image_2026-10-13_at_8.57.46_PM.jpeg',
    itemCount: 'Islamic Calligraphy',
    description: 'Ayat-ul-Kursi, gallery photo & gold art frames',
  },
  {
    name: 'Lighting & Lamps',
    slug: 'table-lamps',
    image: '/uploads/1791996953409-WhatsApp_Image_2026-10-13_at_8.57.43_PM__1_.jpeg',
    itemCount: 'Ambient Glow',
    description: 'Ambient bedside lamps & contemporary floor lamps',
  },
];

const FAQS = [
  {
    question: 'Do you offer premium gift packaging and personalized greeting cards?',
    answer:
      'Yes, absolutely! Every order at Afshan Gift Centre can be gift-wrapped in our signature warm cream box with satin ribbon and an embossed greeting card. You can add a gift note during checkout or message our WhatsApp desk at 0300 1005861.',
  },
  {
    question: 'How do you ship delicate items like glass vases and wall frames safely?',
    answer:
      'All fragile gift items receive triple-layer cushioning: shock-absorbent bubble cushioning, rigid foam corner shields, and reinforced outer shipping boxes. All shipments across Pakistan are insured.',
  },
  {
    question: 'Can you deliver gifts directly to a recipient in Vehari or other cities?',
    answer:
      'Yes! Provide your recipient’s delivery address and phone number during checkout. We will omit the price invoice and include your personalized gift card message.',
  },
  {
    question: 'What are your delivery times and shipping costs?',
    answer:
      'Local deliveries within Vehari arrive same-day or next-day. Nationwide courier delivery takes 2 to 4 business days. All orders over Rs. 10,000 qualify for FREE delivery across Pakistan!',
  },
  {
    question: 'Do you accept Cash on Delivery (COD)?',
    answer:
      'Yes, we accept Cash on Delivery (COD) for orders nationwide. We also accept direct bank transfers (IBFT) for prepaid gift surprises.',
  },
];

export default function HomePageClient({
  bestSellers,
  newArrivals,
}: HomePageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-[#FAFAF7]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[75vh] flex items-center bg-[#F5F0EB] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1920&q=80"
            alt="Afshan Gift Centre showroom collection"
            fill
            className="object-cover object-center opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0EB] via-[#F5F0EB]/85 to-transparent" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[#B8956A] mb-4 bg-white/70 px-3 py-1 rounded-full border border-stone-200">
              <Sparkles className="w-3.5 h-3.5" />
              Vehari&apos;s Signature Gift Showroom
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2C2C2C] leading-tight mb-6">
              Curated Gifts & Timeless Accents for Every Celebration
            </h1>
            <p className="text-base sm:text-lg text-stone-600 mb-8 leading-relaxed">
              Explore exquisite handcrafted tissue boxes, lifelike botanical plants, designer pots, artisan vases, and gilded wall frames. Thoughtfully curated in Vehari, delivered with care across Pakistan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/collections">
                <Button size="lg" className="bg-[#2C2C2C] hover:bg-black text-white px-8">
                  Explore Gifts <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/collections/tissue-boxes">
                <Button size="lg" variant="secondary" className="border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-white">
                  Tissue Box Collection
                </Button>
              </Link>
            </div>
            
            {/* Quick Badges */}
            <div className="mt-10 pt-6 border-t border-stone-300/60 flex flex-wrap gap-6 text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#5A7A60]" /> Free Delivery Over Rs. 10,000
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#5A7A60]" /> Cash on Delivery Nationwide
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#5A7A60]" /> Fragile Safe Packing Guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY GIFT CATEGORY */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B8956A] font-semibold">
              Gift Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] mt-2 mb-4">
              Find the Perfect Gift
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Delight your loved ones with elegant home accessories that add charm and warmth to every corner.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {GIFT_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-white shadow-subtle hover:shadow-card transition-all duration-300 border border-stone-200/70"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[#F5F0EB]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase tracking-wider text-amber-200 block">
                      {cat.itemCount}
                    </span>
                    <h3 className="font-serif font-semibold text-sm sm:text-base leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </div>
                <div className="p-3 text-center bg-white">
                  <p className="text-[11px] text-stone-500 line-clamp-1">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS (FROM DATABASE) */}
      <section className="py-16 bg-[#F5F0EB]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#B8956A] font-semibold">
                Customer Favorites
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] mt-1">
                Featured Gift Pieces
              </h2>
            </div>
            <Link
              href="/collections"
              className="mt-4 md:mt-0 text-sm font-semibold text-[#2C2C2C] hover:text-[#B8956A] inline-flex items-center group transition-colors"
            >
              View All Gifts
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* 4. FEATURED SHOWCASE - PLANTS, POTS & VASES */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/1791997253648-WhatsApp_Image_2026-10-13_at_8.57.42_PM.jpeg"
                alt="Indoor plants and decorative planters"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6 lg:pl-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#B8956A] font-semibold">
                Botanical Charm & Ceramics
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] leading-snug">
                Artisan Vases, Indoor Plants & Handcrafted Pots
              </h2>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                Brighten any living space or celebrate a milestone with our curated botanical combinations. From textured ceramic fluted vases to lifelike faux plants in brass hammered pots, every gift arrives ready to elevate interior ambience.
              </p>
              <ul className="space-y-3 text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#5A7A60]" />
                  <span>Fluted, ribbed, and matte stoneware ceramic finishes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#5A7A60]" />
                  <span>Zero-maintenance lifelike faux botanical plants</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#5A7A60]" />
                  <span>Hammered brass and ceramic pots with tripod stands</span>
                </li>
              </ul>
              <div className="pt-2 flex gap-4">
                <Link href="/collections/vases">
                  <Button className="bg-[#2C2C2C] hover:bg-black text-white">
                    Shop Vases
                  </Button>
                </Link>
                <Link href="/collections/plants">
                  <Button variant="secondary" className="border-[#2C2C2C] text-[#2C2C2C]">
                    Shop Plants & Pots
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED SHOWCASE - WALL FRAMES & TISSUE BOXES */}
      <section className="py-20 bg-[#F5F0EB]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <span className="text-xs uppercase tracking-[0.25em] text-[#B8956A] font-semibold">
                Memorable Keepsakes
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] leading-snug">
                Gilded Calligraphy Wall Frames & Inlaid Tissue Boxes
              </h2>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                Discover our signature Mother-of-Pearl tissue box covers and museum-grade Islamic calligraphy wall frames. Ideal housewarming and wedding presents, crafted with exquisite attention to detail by skilled artisans.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <h4 className="font-serif font-bold text-[#2C2C2C] text-sm">Tissue Box Covers</h4>
                  <p className="text-xs text-stone-500 mt-1">Mother-of-pearl, velvet & fine wood</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <h4 className="font-serif font-bold text-[#2C2C2C] text-sm">Wall Frames</h4>
                  <p className="text-xs text-stone-500 mt-1">Ayat-ul-Kursi, 4 Quls & Photo sets</p>
                </div>
              </div>
              <div className="pt-2 flex gap-4">
                <Link href="/collections/wall-frames">
                  <Button className="bg-[#2C2C2C] hover:bg-black text-white">
                    Shop Wall Frames
                  </Button>
                </Link>
                <Link href="/collections/tissue-boxes">
                  <Button variant="secondary" className="border-[#2C2C2C] text-[#2C2C2C]">
                    Shop Tissue Boxes
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card border border-stone-200 order-1 lg:order-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/1791996994883-WhatsApp_Image_2026-10-13_at_8.57.47_PM__2_.jpeg"
                alt="Gilded wall frames and home decor"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS (FROM DATABASE) */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#B8956A] font-semibold">
                Just Arrived
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] mt-1">
                New Gift Arrivals
              </h2>
            </div>
            <Link
              href="/collections/sale"
              className="mt-4 md:mt-0 text-sm font-semibold text-[#B8956A] hover:underline"
            >
              Explore Special Offers →
            </Link>
          </div>

          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* 7. TRUST GUARENTEES */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5F0EB] flex items-center justify-center shrink-0 text-[#2C2C2C]">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#2C2C2C]">Nationwide Delivery</h4>
                <p className="text-xs text-stone-600 mt-1">Free delivery across Pakistan on orders over Rs. 10,000.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5F0EB] flex items-center justify-center shrink-0 text-[#2C2C2C]">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#2C2C2C]">Gift Ready Packing</h4>
                <p className="text-xs text-stone-600 mt-1">Complimentary satin ribbon packing and greeting cards upon request.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5F0EB] flex items-center justify-center shrink-0 text-[#2C2C2C]">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#2C2C2C]">7-Day Safe Replacement</h4>
                <p className="text-xs text-stone-600 mt-1">Guaranteed replacement if any fragile item is damaged in transit.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5F0EB] flex items-center justify-center shrink-0 text-[#2C2C2C]">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#2C2C2C]">Cash on Delivery</h4>
                <p className="text-xs text-stone-600 mt-1">Inspect your parcel at doorstep with reliable Cash on Delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BRAND STORY & VEHARI SHOWROOM */}
      <section className="py-20 bg-[#F5F0EB]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#B8956A] font-semibold">
              The Story of Afshan Gift Centre
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C]">
              Vehari&apos;s Cherished House of Gifts & Fine Decor
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Located on Club Road in Vehari, Punjab, <strong>Afshan Gift Centre</strong> was born from a passion for celebrating life&apos;s precious moments. We believe giving a gift is an art form. We curate beautiful decorative tissue box covers, lifelike botanical plants, fine ceramic and brass planters, artistic vases, and framed calligraphy that turn everyday living rooms into inspiring sanctuaries.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/923001005861?text=${encodeURIComponent('Hello Afshan Gift Centre, I would like to inquire about gift collections.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#5A7A60] hover:bg-[#48634d] text-white">
                  <PhoneCall className="w-4 h-4 mr-2" /> WhatsApp: {CONTACT_PHONE_FORMATTED}
                </Button>
              </a>
              <Link href="/contact">
                <Button variant="secondary" className="border-[#2C2C2C] text-[#2C2C2C]">
                  Visit Vehari Showroom
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQS */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B8956A] font-semibold">
              Have Questions?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-subtle"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between text-[#2C2C2C] font-semibold hover:text-[#B8956A] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#B8956A]' : 'text-stone-400'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-0 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
