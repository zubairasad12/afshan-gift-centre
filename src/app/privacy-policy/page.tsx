import { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield,
  Lock,
  EyeOff,
  Database,
  UserCheck,
  Phone,
  Mail,
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
  title: 'Privacy Policy | Afshan Gift Centre',
  description:
    'Privacy Policy and personal data protection practices at Afshan Gift Centre (Vehari, Pakistan). How we collect, safeguard, and process your order details.',
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: '1. Information We Collect',
      content: [
        'Contact & Shipping Details: Full name, delivery street address, city, postal code, mobile phone number, and email address when placing orders or submitting inquiries.',
        'Order & Transaction Records: Products ordered, gift packaging preferences, transaction confirmations, and delivery status milestones.',
        'Communication Logs: Records of inquiries or customer support messages sent via our website contact forms, WhatsApp, or phone calls with our Vehari desk.',
      ],
    },
    {
      icon: UserCheck,
      title: '2. How We Use Your Data',
      content: [
        'Order Fulfillment & Dispatch: Sharing necessary delivery coordinates and telephone numbers exclusively with our trusted logistics couriers (TCS, Leopard Courier) to enable prompt doorstep delivery.',
        'Order Verification & Updates: Conducting quick phone or WhatsApp verification calls before packaging custom or COD orders to eliminate transit inaccuracies.',
        'Customer Support: Answering your queries regarding product specifications, wood polishing recommendations, and warranty assistance.',
      ],
    },
    {
      icon: EyeOff,
      title: '3. No Commercial Selling or Third-Party Renting',
      content: [
        'Afshan Gift Centre strictly upholds customer confidentiality. We never sell, rent, trade, or distribute your telephone numbers, postal addresses, or email addresses to any outside marketing companies, advertisers, or third-party brokers.',
        'Data is stored securely on protected server infrastructure and accessed exclusively by authorized staff responsible for order processing and logistics in Vehari.',
      ],
    },
    {
      icon: Lock,
      title: '4. Data Security & Storage Safeguards',
      content: [
        'We enforce industry-standard digital and physical safeguards to prevent unauthorized data access, disclosure, or misuse.',
        'Online interactions and form submissions across our website are encrypted using modern Transport Layer Security (HTTPS/TLS) cryptographic protocols.',
      ],
    },
    {
      icon: Shield,
      title: '5. Your Rights & Data Preferences',
      content: [
        'You have the complete right to request a summary of the personal information stored in your account.',
        'You can request correction of outdated address details, deletion of non-essential profile information, or opt out of promotional announcements at any time by contacting our helpline.',
      ],
    },
  ];

  return (
    <div className="bg-[#FAFAF7] text-[#3D3229]">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#F5F0EB] to-[#FAFAF7] py-14 sm:py-20 border-b border-[#DDD1C2]/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8956A]/10 text-[#8C6E48] text-xs font-semibold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Integrity & Confidentiality</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2C2C] font-normal tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5E5E5E] leading-relaxed">
            We value your trust as dearly as we value our craftsmanship. Learn how Afshan Gift Centre protects your personal data and order information.
          </p>
          <div className="mt-4 text-xs text-[#757575]">
            Last updated: October 2026 • Effective for all patrons across Pakistan
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE3D9] shadow-subtle space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FAF7F4] border border-[#DDD1C2] flex items-center justify-center text-[#B8956A] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#2C2C2C]">{sec.title}</h2>
              </div>
              <ul className="space-y-3 pt-2 text-sm sm:text-base text-[#5E5E5E] leading-relaxed">
                {sec.content.map((point, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B8956A] shrink-0 mt-1" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Contact Privacy Officer Box */}
        <div className="bg-[#F5F0EB] rounded-2xl p-6 sm:p-8 border border-[#DDD1C2] space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C2C2C]">
            Questions Regarding Data Privacy?
          </h3>
          <p className="text-xs sm:text-sm text-[#5E5E5E] leading-relaxed">
            If you have questions regarding our data collection, wish to update your records, or request removal of profile information, please contact our data officer:
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#4D4D4D]">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#B8956A]" />
              <span>Telephone: {CONTACT_PHONE_FORMATTED}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#B8956A]" />
              <span>Email: {CONTACT_EMAIL}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin className="w-4 h-4 text-[#B8956A]" />
              <span>Address: {ADDRESS}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
