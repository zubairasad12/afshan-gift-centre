'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ChevronDown, Search, User, Phone, MapPin, Heart } from 'lucide-react';
import { NAV_ITEMS, CONTACT_PHONE_FORMATTED, LOCATION } from '@/lib/constants';
import useWishlistStore from '@/store/wishlistStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onOpenSearch }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const wishlistCount = useWishlistStore((state) => state.items.length);

  if (!isOpen) return null;

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-sm bg-[#FAFAF7] shadow-drawer flex flex-col animate-in slide-in-from-left duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-white">
            <span className="font-serif text-lg font-bold text-[#2C2C2C] tracking-tight">
              Afshan Gift Centre
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-[#2C2C2C] transition-colors"
              aria-label="Close mobile menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Button */}
          <div className="p-4 border-b border-stone-200 bg-white">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F5F0EB] text-stone-500 text-xs tracking-wider uppercase border border-stone-200"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#B8956A]" />
                Search gifts, decor...
              </span>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="divide-y divide-stone-200">
              {NAV_ITEMS.map((item, index) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedIndex === index;

                return (
                  <li key={item.label} className="py-2.5">
                    {hasChildren ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleExpand(index)}
                          className="w-full flex items-center justify-between text-left text-sm uppercase tracking-wider font-medium text-[#2C2C2C] py-2"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-[#B8956A]' : ''
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <ul className="pl-4 pr-2 py-2 space-y-2 bg-[#F5F0EB]/50 border-l-2 border-[#B8956A] my-1">
                            {item.children?.map((sub) => (
                              <li key={sub.label}>
                                <Link
                                  href={sub.href}
                                  onClick={onClose}
                                  className="block py-1.5 text-xs text-stone-600 hover:text-[#B8956A] transition-colors"
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block text-sm uppercase tracking-wider font-medium text-[#2C2C2C] hover:text-[#B8956A] py-2 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* User & Wishlist Shortcuts */}
            <div className="mt-6 pt-6 border-t border-stone-200 space-y-3">
              <Link
                href="/wishlist"
                onClick={onClose}
                className="flex items-center justify-between text-xs uppercase tracking-wider font-medium text-[#3D3229] py-2 hover:text-[#B8956A]"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#B8956A]" />
                  <span>My Wishlist</span>
                </div>
                <span className="bg-[#F5F0EB] px-2 py-0.5 text-xs">{wishlistCount}</span>
              </Link>
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-[#3D3229] py-2 hover:text-[#B8956A]"
              >
                <User className="w-4 h-4 text-[#B8956A]" />
                <span>My Account</span>
              </Link>
            </div>
          </nav>

          {/* Footer Contact Info */}
          <div className="border-t border-stone-200 p-6 bg-white space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#B8956A] shrink-0" />
              <a href="tel:03001005861" className="hover:text-black font-semibold">
                {CONTACT_PHONE_FORMATTED}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B8956A] shrink-0" />
              <span>{LOCATION}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
