'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Truck,
  Check,
} from 'lucide-react';
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  CONTACT_PHONE_FORMATTED,
  CONTACT_EMAIL,
  LOCATION,
  ADDRESS,
  FOOTER_LINKS,
} from '@/lib/constants';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#F5F0EB] text-[#3D3229] border-t border-stone-200">
      {/* Top Value Proposition Highlights */}
      <div className="border-b border-stone-300/60 py-8 bg-[#EBE3D9]/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B8956A] shadow-sm shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs uppercase tracking-wider font-semibold text-[#2C2C2C]">
                  Nationwide Delivery
                </h5>
                <p className="text-xs text-stone-500">Free delivery on orders over Rs. 10,000</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B8956A] shadow-sm shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs uppercase tracking-wider font-semibold text-[#2C2C2C]">
                  Guaranteed Craftsmanship
                </h5>
                <p className="text-xs text-stone-500">Premium solid woods and durable fabrics</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B8956A] shadow-sm shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs uppercase tracking-wider font-semibold text-[#2C2C2C]">
                  Direct Vehari Support
                </h5>
                <p className="text-xs text-stone-500">Call 0300 1005861 for bespoke consultation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Grid */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#2C2C2C] tracking-tight">
              {SITE_NAME}
            </h3>
            <p className="text-xs leading-relaxed text-stone-600 max-w-sm">
              {SITE_DESCRIPTION}
            </p>
            <div className="pt-2 space-y-2 text-xs text-stone-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B8956A] shrink-0 mt-0.5" />
                <span>{ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B8956A] shrink-0" />
                <a href="tel:03001005861" className="hover:text-black font-semibold">
                  {CONTACT_PHONE_FORMATTED}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B8956A] shrink-0" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-black">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#2C2C2C] mb-4">
              Explore Furniture
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-600">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-[#B8956A] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#2C2C2C] mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-600">
              {FOOTER_LINKS.customerService.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-[#B8956A] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#2C2C2C]">
              Join Our Circle
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Subscribe to receive updates on new seasonal arrivals, private sales, and decor inspiration.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 focus:border-[#B8956A] focus:outline-none placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  className="bg-[#2C2C2C] text-white px-4 hover:bg-black transition-colors shrink-0 flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {isSubscribed && (
                <p className="text-xs text-[#5A7A60] font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Thank you for subscribing!</span>
                </p>
              )}
            </form>

            <div className="pt-2">
              <h5 className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 mb-2">
                Accepted Payment Methods
              </h5>
              <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-[#3D3229]">
                <span className="px-2.5 py-1 bg-white border border-stone-300">Cash on Delivery (COD)</span>
                <span className="px-2.5 py-1 bg-white border border-stone-300">Bank Transfer</span>
                <span className="px-2.5 py-1 bg-white border border-stone-300">JazzCash</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Policies */}
      <div className="border-t border-stone-300/80 py-6 bg-[#EBE3D9]/20 text-xs text-stone-500">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2024 {SITE_NAME}. All rights reserved. Handcrafted in {LOCATION}.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            {FOOTER_LINKS.policy.map((p) => (
              <Link key={p.label} href={p.href} className="hover:text-[#2C2C2C] transition-colors">
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
