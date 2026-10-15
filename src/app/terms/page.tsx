import { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  Scale,
  CreditCard,
  Truck,
  RotateCcw,
  Sparkles,
  Phone,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import {
  CONTACT_PHONE,
  CONTACT_PHONE_FORMATTED,
  CONTACT_EMAIL,
  ADDRESS,
  LOCATION,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Afshan Gift Centre',
  description:
    'Terms and conditions of sale, bespoke order commitments, payments, and delivery acceptance governing purchases at Afshan Gift Centre (Vehari, Pakistan).',
};

export default function TermsPage() {
  const clauses = [
    {
      icon: Scale,
      title: '1. Agreement & Governing Law',
      desc: 'By visiting our website or placing an order at Afshan Gift Centre, you agree to comply with these terms. All commercial transactions, disputes, and contracts are governed in accordance with the applicable laws of the Islamic Republic of Pakistan, subject to the jurisdiction of the courts of Vehari / Multan, Punjab.',
    },
    {
      icon: CreditCard,
      title: '2. Pricing, Currencies & Payment Terms',
      desc: 'All prices displayed on this website are listed in Pakistani Rupees (PKR). We reserve the right to correct accidental typographic errors in pricing prior to order dispatch. Orders placed via Cash on Delivery (COD) require telephone confirmation. Bulk or custom gift orders may require a partial advance deposit agreed upon prior to processing.',
    },
    {
      icon: Sparkles,
      title: '3. Product Characteristics & Handcrafting Tolerances',
      desc: 'Because our gift items include artisan ceramics, hand-hammered brass, mother-of-pearl inlays, and handblown glass, minor natural variations in texture, glaze tone, or finish are intrinsic characteristics of handcrafted goods and are not considered defects.',
    },
    {
      icon: Truck,
      title: '4. Delivery Acceptance & Inspection Responsibilities',
      desc: 'Customers or authorized representatives are required to inspect parcels upon handover by TCS, Leopard Courier, or our dedicated transport staff. If the parcel exhibits visible transit damage, note it on the courier delivery run-sheet and notify us within 24 hours.',
    },
    {
      icon: RotateCcw,
      title: '5. Inspection & Replacement Guarantee',
      desc: 'All catalog items are protected by our 7-Day Inspection and Replacement Guarantee. Defective, broken, or mismatched items reported within 7 calendar days of receipt with verifiable photographic evidence will be repaired, exchanged, or credited without courier surcharges.',
    },
    {
      icon: FileText,
      title: '6. Intellectual Property & Brand Rights',
      desc: 'All photographs, branding graphics, product descriptions, and textual media displayed on this website are the proprietary property of Afshan Gift Centre. Reproduction without written consent is strictly prohibited.',
    },
  ];

  return (
    <div className="bg-[#FAFAF7] text-[#3D3229]">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#F5F0EB] to-[#FAFAF7] py-14 sm:py-20 border-b border-[#DDD1C2]/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8956A]/10 text-[#8C6E48] text-xs font-semibold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Terms of Service</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2C2C] font-normal tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5E5E5E] leading-relaxed">
            Clear, ethical, and transparent guidelines governing all purchases, custom commissions, and deliveries at Afshan Gift Centre.
          </p>
          <div className="mt-4 text-xs text-[#757575]">
            Last updated: October 2026 • Afshan Gift Centre, Vehari, Pakistan
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#EBE3D9] shadow-subtle space-y-8">
          {clauses.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="pb-8 border-b last:border-b-0 border-[#EBE3D9] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF7F4] border border-[#DDD1C2] flex items-center justify-center text-[#B8956A] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#2C2C2C]">
                    {item.title}
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-[#5E5E5E] leading-relaxed pl-12">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Contact info box */}
        <div className="bg-[#F5F0EB] rounded-2xl p-6 sm:p-8 border border-[#DDD1C2] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#2C2C2C]">
              Have Questions About Our Terms?
            </h3>
            <p className="text-xs sm:text-sm text-[#5E5E5E] mt-1 max-w-md">
              Our administration desk on Club Road, Vehari is available to clarify any contractual or bespoke commission questions.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3D3229] hover:bg-[#2A221B] text-white text-xs sm:text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4 text-[#B8956A]" />
              Call {CONTACT_PHONE_FORMATTED}
            </a>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-lg bg-white border border-[#DDD1C2] text-[#2C2C2C] text-xs sm:text-sm font-medium hover:bg-[#FAF7F4] transition-colors"
            >
              Contact Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
