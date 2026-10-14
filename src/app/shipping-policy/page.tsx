import { Metadata } from 'next';
import Link from 'next/link';
import {
  Truck,
  Clock,
  ShieldCheck,
  PackageCheck,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  CONTACT_PHONE,
  CONTACT_PHONE_FORMATTED,
  FREE_DELIVERY_THRESHOLD,
  CURRENCY_SYMBOL,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Afshan Gift Centre',
  description:
    'Shipping policy, delivery timelines (Vehari, Multan, Lahore 2-4 days, nationwide 4-7 days), free delivery over Rs. 10,000, and TCS/Leopard courier tracking details.',
};

export default function ShippingPolicyPage() {
  const deliveryZones = [
    {
      region: 'Local & Regional (Vehari, Multan, Bahawalpur, Sahiwal)',
      timeframe: '2 – 4 Business Days',
      couriers: 'Afshan Fleet Direct / Leopard Courier Express',
      notes: 'Priority white-glove delivery available upon request',
    },
    {
      region: 'Major Metros (Lahore, Faisalabad, Gujranwala, Sialkot)',
      timeframe: '2 – 4 Business Days',
      couriers: 'TCS Courier Overland / Leopard Commercial',
      notes: 'Direct transit hub connection from Vehari',
    },
    {
      region: 'Nationwide (Karachi, Islamabad/Rawalpindi, Peshawar, Quetta)',
      timeframe: '4 – 7 Business Days',
      couriers: 'TCS Overland Cargo & Leopard Freight',
      notes: 'Fully insured wooden-crate handling for fragile goods',
    },
    {
      region: 'Remote & Azad Kashmir / Gilgit-Baltistan',
      timeframe: '6 – 9 Business Days',
      couriers: 'TCS Express Domestic',
      notes: 'Subject to regional weather and road route advisories',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Order Confirmation & Verification',
      desc: 'Our dispatch team calls you from 03001005861 within 2 to 4 hours of placing an order to confirm shipping address, dimensions, and Cash on Delivery details.',
    },
    {
      step: '02',
      title: 'Packaging & Wooden Crate Security',
      desc: 'Goods undergo a 5-point quality check at our Vehari facility, enveloped in high-density polyethylene protective film and reinforced corner guards.',
    },
    {
      step: '03',
      title: 'Dispatch & Tracking Generation',
      desc: 'Your parcel is handed over to TCS or Leopard Courier. A digital tracking ID is instantly dispatched via SMS and WhatsApp to monitor milestones.',
    },
    {
      step: '04',
      title: 'Safe Doorstep Delivery',
      desc: 'The courier rider delivers to your doorstep. You inspect the parcel seal, settle the COD balance, and sign for delivery.',
    },
  ];

  return (
    <div className="bg-[#FAFAF7] text-[#3D3229]">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#F5F0EB] to-[#FAFAF7] py-14 sm:py-20 border-b border-[#DDD1C2]/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8956A]/10 text-[#8C6E48] text-xs font-semibold uppercase tracking-wider mb-4">
            <Truck className="w-3.5 h-3.5" />
            <span>Nationwide Safe Transit Logistics</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2C2C] font-normal tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5E5E5E] leading-relaxed">
            Transparent timelines, reliable packaging, and trusted courier logistics connecting Vehari to every corner of Pakistan.
          </p>
        </div>
      </section>

      {/* Threshold Highlight Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-[#3D3229] text-[#FAFAF7] rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#B8956A] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#D8C3A8] font-semibold">
                Free Delivery Offer
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold">
                Orders Above {CURRENCY_SYMBOL} {FREE_DELIVERY_THRESHOLD.toLocaleString()} Ship Free!
              </h3>
              <p className="text-xs text-[#EBE3D9] mt-0.5">
                Applies automatically at checkout to standard home decor, lighting, and ready-to-ship furniture.
              </p>
            </div>
          </div>
          <Link
            href="/collections"
            className="px-5 py-2.5 rounded-lg bg-[#B8956A] hover:bg-[#A07F56] text-white text-xs sm:text-sm font-medium transition-colors shrink-0 shadow-subtle"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Delivery Timelines Table */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE3D9] shadow-subtle">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-[#B8956A]" />
            <h2 className="font-serif text-xl sm:text-2xl text-[#2C2C2C]">
              Delivery Timelines by Region
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#DDD1C2] text-xs uppercase tracking-wider text-[#757575] bg-[#FAF7F4]">
                  <th className="py-3 px-4">Destination Region</th>
                  <th className="py-3 px-4">Estimated Transit</th>
                  <th className="py-3 px-4">Carrier Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE3D9]">
                {deliveryZones.map((zone, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF7F4]/60 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#2C2C2C] block">{zone.region}</span>
                      <span className="text-xs text-[#757575]">{zone.notes}</span>
                    </td>
                    <td className="py-4 px-4 font-medium text-[#8C6E48] whitespace-nowrap">
                      {zone.timeframe}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#5E5E5E]">{zone.couriers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Courier Partners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-[#EBE3D9] shadow-subtle space-y-3">
            <div className="flex items-center gap-3">
              <PackageCheck className="w-5 h-5 text-[#B8956A]" />
              <h3 className="font-serif font-bold text-lg text-[#2C2C2C]">TCS Courier Logistics</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5E5E5E] leading-relaxed">
              We rely on TCS Overland and Express Networks for fast parcel movement with trackable barcode tracking across all provincial capitals and major Pakistani cities.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#EBE3D9] shadow-subtle space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#B8956A]" />
              <h3 className="font-serif font-bold text-lg text-[#2C2C2C]">Leopard Courier Logistics</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5E5E5E] leading-relaxed">
              Leopard Courier handles our regional network across South Punjab and interior districts, providing prompt Cash on Delivery reconciliation and SMS delivery reminders.
            </p>
          </div>
        </div>

        {/* Dispatch & Packaging Lifecycle */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE3D9] shadow-subtle">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2C2C2C] mb-6">
            How Your Order Travels to You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#FAF7F4] border border-[#EBE3D9] space-y-2">
                <span className="text-xs font-mono font-bold text-[#B8956A] uppercase tracking-wider">
                  Step {s.step}
                </span>
                <h4 className="font-serif font-semibold text-base text-[#2C2C2C]">{s.title}</h4>
                <p className="text-xs text-[#5E5E5E] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fragile Crating & Insurance */}
        <div className="bg-[#F5F0EB] rounded-2xl p-6 sm:p-8 border border-[#DDD1C2] space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#5A7A60]" />
            <h3 className="font-serif font-bold text-lg text-[#2C2C2C]">
              Zero-Damage Crating & Full In-Transit Insurance
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#5E5E5E] leading-relaxed">
            Glass tabletops, chandeliers, wall mirrors, and intricately carved wood products are secured inside custom pine wood crates with internal cushioning. Should any transit harm occur despite our rigid crating, our <strong>7-Day Replacement Guarantee</strong> covers you completely at no additional expense.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-[#4D4D4D]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#5A7A60]" />
              Corner Edge Protection
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#5A7A60]" />
              Heavy-Duty Corrugation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#5A7A60]" />
              Fragile Stamping & Handling
            </span>
          </div>
        </div>

        {/* Contact Help */}
        <div className="text-center pt-4">
          <p className="text-sm text-[#5E5E5E]">
            Have an urgent delivery requirement or need to change your delivery address?
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-[#B8956A]" />
            <span className="text-xs text-[#757575]">Call our Vehari dispatch team directly:</span>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="text-sm font-bold text-[#2C2C2C] hover:text-[#B8956A] transition-colors"
            >
              {CONTACT_PHONE_FORMATTED}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
