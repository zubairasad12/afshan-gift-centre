import { Metadata } from 'next';
import Link from 'next/link';
import {
  RotateCcw,
  ShieldCheck,
  Camera,
  MessageCircle,
  PackageX,
  CheckCircle2,
  Phone,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { CONTACT_PHONE, CONTACT_PHONE_FORMATTED, LOCATION } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Return & Replacement Guarantee | Afshan Gift Centre',
  description:
    'Our 7-Day Inspection and Replacement Guarantee. Learn our easy claim process for transit damages and quality assurances from Afshan Gift Centre, Vehari.',
};

export default function ReturnPolicyPage() {
  const claimSteps = [
    {
      step: '1',
      title: 'Inspect Upon Arrival',
      desc: 'Carefully open your package within 7 days of delivery. If you notice any damage, defect, or missing component, take 2–3 clear photos and a short video clip showing the item and packaging label.',
      icon: Camera,
    },
    {
      step: '2',
      title: 'WhatsApp Our Vehari Team',
      desc: `Send your photos, Order Number, and a brief explanation directly to our official WhatsApp at 0300 1005861. Our support manager will review the claim within 4 hours.`,
      icon: MessageCircle,
    },
    {
      step: '3',
      title: 'Resolution Approval',
      desc: 'Once verified, we approve an immediate solution: a doorstep replacement dispatch, a complimentary repair/part shipment, or full credit according to your choice.',
      icon: CheckCircle2,
    },
    {
      step: '4',
      title: 'Hassle-Free Exchange',
      desc: 'Our partnered courier will collect the damaged item directly from your address at our cost when delivering the pristine replacement piece.',
      icon: RotateCcw,
    },
  ];

  return (
    <div className="bg-[#FAFAF7] text-[#3D3229]">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#F5F0EB] to-[#FAFAF7] py-14 sm:py-20 border-b border-[#DDD1C2]/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5A7A60]/10 text-[#5A7A60] text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Customer First Guarantee</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2C2C] font-normal tracking-tight">
            7-Day Inspection & Replacement Guarantee
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5E5E5E] leading-relaxed">
            We hold ourselves to the highest standards of woodworking and customer trust. If an item arrives broken, flawed, or inaccurate, we make it right.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Core Guarantee Highlight */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE3D9] shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF7F4] border border-[#DDD1C2] flex items-center justify-center text-[#B8956A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#2C2C2C]">
                Our 7-Day Peace of Mind Commitment
              </h2>
              <p className="text-xs text-[#757575]">Valid from the date of physical receipt by customer</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-[#5E5E5E] leading-relaxed">
            At Afshan Gift Centre, we understand buying delicate home decor and gift items online requires trust. Every piece leaves our Vehari showroom after comprehensive inspection. We give you seven (7) calendar days from parcel receipt to examine every angle and finish in your home.
          </p>
        </div>

        {/* Claim Steps */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B8956A]">
              Simple 4-Step Process
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2C2C] mt-1">
              How to File a Damage or Replacement Claim
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {claimSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-[#EBE3D9] shadow-subtle flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#FAF7F4] border border-[#DDD1C2] flex items-center justify-center text-[#B8956A]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#757575]">
                        STEP 0{s.step}
                      </span>
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-[#2C2C2C] mb-2">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-[#5E5E5E] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Eligible */}
          <div className="bg-[#EFF5F1]/60 rounded-xl p-6 border border-[#5A7A60]/30 space-y-4">
            <div className="flex items-center gap-2 text-[#5A7A60] font-semibold text-base">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Eligible for Free Replacement
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#4D4D4D]">
              <li className="flex items-start gap-2">
                <span className="text-[#5A7A60] font-bold">•</span>
                Items cracked, chipped, or structurally damaged during transit.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#5A7A60] font-bold">•</span>
                Defective hardware, loose joinery, or unstable legs upon arrival.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#5A7A60] font-bold">•</span>
                Incorrect item, wrong color, or mismatched dimensions compared to order slip.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#5A7A60] font-bold">•</span>
                Missing items or components compared to the order slip.
              </li>
            </ul>
          </div>

          {/* Ineligible / Exceptions */}
          <div className="bg-[#FAF7F4] rounded-xl p-6 border border-[#DDD1C2] space-y-4">
            <div className="flex items-center gap-2 text-[#8C6E48] font-semibold text-base">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Exceptions & Exclusions
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#5E5E5E]">
              <li className="flex items-start gap-2">
                <span className="text-[#B8956A] font-bold">•</span>
                Natural variations in handcrafted artisan materials such as ceramic glaze, brass oxidation, and glass texture (which are intrinsic characteristics of handmade goods).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B8956A] font-bold">•</span>
                Custom gift orders built specifically to non-standard client specifications once production has commenced.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B8956A] font-bold">•</span>
                Damage caused by customer mishandling, dropping, or improper chemical cleaning after delivery.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B8956A] font-bold">•</span>
                Claims initiated after 7 calendar days from confirmed delivery.
              </li>
            </ul>
          </div>
        </div>

        {/* Claim Hotline CTA */}
        <div className="bg-[#3D3229] text-[#FAFAF7] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl">
              Need assistance with a delivered item?
            </h3>
            <p className="text-xs sm:text-sm text-[#EBE3D9] mt-1 max-w-md">
              Send your order number and photos to our customer care team in Vehari. We respond swiftly on WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/923001005861?text=Hi%2C%20I%20would%20like%20to%20file%20an%20inspection%2Freplacement%20claim%20for%20my%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#1eb954] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp {CONTACT_PHONE_FORMATTED}
            </a>
            <Link
              href="/contact"
              className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition-colors border border-white/20"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
