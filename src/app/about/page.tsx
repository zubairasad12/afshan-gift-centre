import { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Award,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Clock,
  ArrowRight,
  Gift,
  Gem,
} from 'lucide-react';
import { CONTACT_PHONE, CONTACT_PHONE_FORMATTED, ADDRESS, LOCATION } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us | Afshan Gift Centre Vehari',
  description:
    'Discover the story and values behind Afshan Gift Centre in Vehari, Pakistan. Curated gifts, handcrafted tissue boxes, botanical plants, artisan pots, decorative vases, and gilded wall frames.',
};

export default function AboutPage() {
  const stats = [
    { value: '15+', label: 'Years Serving Vehari & Pakistan' },
    { value: '15,000+', label: 'Delightful Gifts Delivered' },
    { value: '100%', label: 'Safe Delivery & Fragile Care' },
    { value: '40+', label: 'Cities Delivered Across Pakistan' },
  ];

  const values = [
    {
      icon: Gift,
      title: 'Artisan Gift Curation',
      description:
        'Every tissue box, vase, botanical planter, and wall frame in our gallery is hand-selected for exceptional aesthetic beauty, durability, and gift appeal.',
    },
    {
      icon: Gem,
      title: 'Finest Materials & Detailing',
      description:
        'From genuine mother-of-pearl inlays and hand-hammered brass to kiln-fired ceramic and museum-quality gilded calligraphy, we only stock premium quality.',
    },
    {
      icon: HeartHandshake,
      title: 'Transparent & Fair Pricing',
      description:
        'Honest showroom pricing in Pakistani Rupees (PKR) with free delivery across Pakistan for orders above Rs. 10,000, and reliable Cash on Delivery.',
    },
    {
      icon: ShieldCheck,
      title: '7-Day Safe Replacement',
      description:
        'All fragile glass, ceramic, and delicate decor is packed with multi-layered protective cushioning and backed by a 7-day replacement guarantee.',
    },
  ];

  return (
    <div className="bg-[#FAFAF7] text-[#3D3229]">
      {/* Hero Section */}
      <section className="relative bg-[#F5F0EB] py-16 sm:py-24 border-b border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B8956A] font-semibold block mb-3">
            Our Story & Heritage
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C2C2C] mb-6 max-w-3xl mx-auto leading-tight">
            Elevating Celebrations & Gifting in Vehari and Across Pakistan
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            From handcrafted tissue boxes and lifelike botanical plants to fine ceramic vases and gilded Islamic calligraphy, <strong>Afshan Gift Centre</strong> transforms special occasions into cherished memories.
          </p>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-12 bg-white border-b border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4">
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2C2C] mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-stone-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-stone-700">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C]">
              A House of Meaningful Gifts & Living Accents
            </h2>
            <p>
              Located in the commercial heart of Vehari on Club Road, <strong>Afshan Gift Centre</strong> was founded on a simple premise: a great gift expresses appreciation, love, and respect in ways words cannot.
            </p>
            <p>
              Whether you are searching for an unforgettable housewarming gift, a wedding bridal token, a festive Eid celebration present, or an accent piece to revitalize your own living room, our showroom curates only the finest:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="bg-[#F5F0EB] p-4 rounded-xl border border-stone-200">
                <h3 className="font-serif font-bold text-[#2C2C2C] mb-1">Tissue Boxes & Organizers</h3>
                <p className="text-xs text-stone-600">Handcrafted wooden, mother-of-pearl inlaid, and plush velvet covers that add refinement to living room center tables.</p>
              </div>
              <div className="bg-[#F5F0EB] p-4 rounded-xl border border-stone-200">
                <h3 className="font-serif font-bold text-[#2C2C2C] mb-1">Botanical Plants & Pots</h3>
                <p className="text-xs text-stone-600">Evergreen, maintenance-free faux foliage and artisan hammered brass, ceramic, and terracotta pots.</p>
              </div>
              <div className="bg-[#F5F0EB] p-4 rounded-xl border border-stone-200">
                <h3 className="font-serif font-bold text-[#2C2C2C] mb-1">Artisan Vases</h3>
                <p className="text-xs text-stone-600">Contemporary ribbed stoneware, fluted glass, and porcelain silhouettes that turn fresh or dried stems into art.</p>
              </div>
              <div className="bg-[#F5F0EB] p-4 rounded-xl border border-stone-200">
                <h3 className="font-serif font-bold text-[#2C2C2C] mb-1">Gilded Wall Frames</h3>
                <p className="text-xs text-stone-600">Museum-glass mounted Ayat-ul-Kursi, 4 Quls, and timeless photo gallery frame sets.</p>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="pt-8">
            <h3 className="font-serif text-2xl font-bold text-[#2C2C2C] text-center mb-10">
              Why Choose Afshan Gift Centre
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={i}
                    className="p-6 bg-white rounded-2xl border border-stone-200 shadow-subtle flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#F5F0EB] flex items-center justify-center shrink-0 text-[#2C2C2C]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#2C2C2C] mb-1">
                        {v.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Showroom Contact Card */}
          <div className="p-8 bg-[#F5F0EB] rounded-2xl border border-stone-300/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-serif text-xl font-bold text-[#2C2C2C]">
                Visit Our Vehari Gift Showroom
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {ADDRESS} · Open Mon–Sat 10:00 AM – 9:00 PM
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C2C2C] text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors shrink-0"
            >
              Get Directions & Contact <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
