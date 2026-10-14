'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Search,
  HelpCircle,
  Truck,
  CreditCard,
  Gift,
  ShieldCheck,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { CONTACT_PHONE, CONTACT_PHONE_FORMATTED } from '@/lib/constants';

interface FAQItem {
  id: string;
  category: 'shipping' | 'gifting' | 'cod' | 'care' | 'returns';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'shipping',
    question: 'How long does gift delivery take to my city in Pakistan?',
    answer:
      'For local deliveries within Vehari, gifts typically arrive within 24 to 48 hours (same-day delivery option available for urgent orders). For Multan, Lahore, Karachi, Islamabad/Rawalpindi, Faisalabad, and all other nationwide cities, delivery takes 2 to 4 business days via our courier partners (TCS and Leopard Courier).',
  },
  {
    id: 'faq-2',
    category: 'shipping',
    question: 'What are the delivery charges, and do you offer free shipping?',
    answer:
      'All orders over Rs. 10,000 qualify for FREE standard delivery across Pakistan! For orders below Rs. 10,000, standard nationwide courier shipping is Rs. 450 per order.',
  },
  {
    id: 'faq-3',
    category: 'shipping',
    question: 'How are delicate items like glass vases, pots, and wall frames protected during transit?',
    answer:
      'We specialize in fragile gift shipments. All ceramic vases, glass frames, and delicate tissue boxes receive multi-layered protection: air-bubble wrap, polystyrene corner buffers, and rigid outer protective boxes marked with Fragile stamps. Every parcel is insured during transit.',
  },
  {
    id: 'faq-4',
    category: 'gifting',
    question: 'Can you gift-wrap my order and include a custom greeting message?',
    answer:
      'Yes, absolutely! We provide premium gift wrapping in our signature warm cream paper with satin ribbons and an embossed greeting card. You can enter your personal gift message during checkout or share it directly with our WhatsApp team at 0300 1005861.',
  },
  {
    id: 'faq-5',
    category: 'gifting',
    question: 'Can I send a surprise gift directly to another person?',
    answer:
      'Yes! Simply enter the recipient’s address and phone number as the shipping address. We will omit the price invoice from the parcel and enclose your personalized greeting message.',
  },
  {
    id: 'faq-6',
    category: 'cod',
    question: 'Do you offer Cash on Delivery (COD)?',
    answer:
      'Yes, Cash on Delivery is available across all major cities and towns in Pakistan. You can pay the courier upon receiving your parcel.',
  },
  {
    id: 'faq-7',
    category: 'cod',
    question: 'What other payment methods are supported for gift orders?',
    answer:
      'In addition to Cash on Delivery, we accept Direct Bank Transfer / IBFT (Meezan Bank, HBL, Bank Alfalah) and mobile banking. Bank transfer is ideal if you are sending a gift surprise where the recipient should not pay.',
  },
  {
    id: 'faq-8',
    category: 'care',
    question: 'How do I clean and care for Mother-of-Pearl tissue boxes and brass pots?',
    answer:
      'Wipe mother-of-pearl and wooden tissue boxes with a soft dry microfiber cloth. Avoid harsh chemical sprays. For brass pots and metal stands, use a dry cloth or mild brass cleaner to maintain their brilliant antique lustre.',
  },
  {
    id: 'faq-9',
    category: 'returns',
    question: 'What is your return & replacement policy if a gift item arrives damaged?',
    answer:
      'We offer an unconditional 7-day safe inspection and replacement guarantee. If any vase, frame, or pot arrives with transit damage, simply record a brief unboxing video or take photos, and WhatsApp our customer support at 0300 1005861. We dispatch a free replacement immediately without hassle.',
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory =
        activeCategory === 'all' || faq.category === activeCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="bg-[#FAFAF7] text-[#3D3229] min-h-screen">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-14 sm:py-20 border-b border-stone-200">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B8956A] font-semibold block mb-3">
            Help & Customer Support
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C2C2C] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about ordering gifts, packaging, shipping across Pakistan, and delicate item care.
          </p>

          {/* Search Box */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your question (e.g. gift wrap, delivery, vases)..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-stone-300 text-sm focus:outline-none focus:border-[#B8956A] shadow-xs"
            />
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'gifting', label: 'Gift Wrap & Surprises' },
              { id: 'shipping', label: 'Delivery & Shipping' },
              { id: 'cod', label: 'Payment & COD' },
              { id: 'returns', label: '7-Day Replacement' },
              { id: 'care', label: 'Product Care' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  activeCategory === tab.id
                    ? 'bg-[#2C2C2C] text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = !!openItems[faq.id];
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-subtle transition-colors"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between text-[#2C2C2C] font-semibold text-sm sm:text-base hover:text-[#B8956A] transition-colors"
                    >
                      <span className="pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#B8956A]' : 'text-stone-400'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-0 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-stone-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
                <HelpCircle className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="text-stone-500 text-sm">No matching questions found.</p>
              </div>
            )}
          </div>

          {/* Contact Assistance Callout */}
          <div className="mt-14 p-8 bg-[#F5F0EB] rounded-2xl border border-stone-300/80 text-center">
            <h3 className="font-serif text-xl font-bold text-[#2C2C2C] mb-2">
              Still have questions about a gift order?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-6 max-w-md mx-auto">
              Our customer service desk at our Vehari showroom is available Monday to Saturday (10am–9pm) on WhatsApp or phone call.
            </p>
            <a
              href={`https://wa.me/923001005861?text=${encodeURIComponent('Hello Afshan Gift Centre, I have a question about placing an order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5A7A60] hover:bg-[#48634d] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us: {CONTACT_PHONE_FORMATTED}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
