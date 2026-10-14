'use client';

import React, { useState } from 'react';
import { X, Truck, Phone } from 'lucide-react';
import { CONTACT_PHONE_FORMATTED } from '@/lib/constants';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#2C2C2C] text-[#FAFAF7] text-xs py-2 px-4 relative z-40 transition-all duration-300">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-1.5 text-stone-300 font-medium">
          <Phone className="w-3.5 h-3.5 text-[#B8956A]" />
          <span>Need help? Call: </span>
          <a
            href="tel:03001005861"
            className="text-white hover:text-[#B8956A] transition-colors underline-offset-2 hover:underline"
          >
            {CONTACT_PHONE_FORMATTED}
          </a>
        </div>

        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <Truck className="w-3.5 h-3.5 text-[#B8956A] shrink-0" />
          <span>
            Free Delivery on Orders Above <strong className="text-[#B8956A] font-semibold">Rs. 10,000</strong> | Vehari, Pakistan
          </span>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-stone-400 hover:text-white p-1 transition-colors"
            aria-label="Close announcement bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
