'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, Menu, ChevronDown } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import SearchOverlay from './SearchOverlay';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { openCart, getCount: getCartCount } = useCartStore();
  const getWishlistCount = useWishlistStore((state) => state.items.length);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = mounted ? getCartCount() : 0;
  const wishlistCount = mounted ? getWishlistCount : 0;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-200',
          isScrolled
            ? 'bg-[#FAFAF7]/95 backdrop-blur-md shadow-subtle border-b border-stone-200/80'
            : 'bg-[#FAFAF7]'
        )}
      >
        {/* Announcement Bar */}
        <AnnouncementBar />

        {/* Main Header Bar */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-[#2C2C2C] hover:text-[#B8956A] transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#2C2C2C] hover:text-[#B8956A] transition-colors ml-1"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-block group">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2C2C] group-hover:text-[#B8956A] transition-colors">
                  {SITE_NAME}
                </span>
                <span className="block text-[10px] tracking-[0.25em] uppercase text-stone-500 font-sans font-medium text-center lg:text-left">
                  Vehari, Pakistan
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => {
                const hasChildren = item.children && item.children.length > 0;

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        'text-xs uppercase tracking-widest font-semibold transition-colors duration-200 py-2',
                        item.label === 'Sale'
                          ? 'text-[#C75050] hover:text-red-700 font-bold'
                          : 'text-[#2C2C2C] hover:text-[#B8956A]'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.label}
                    className="relative group py-6"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 text-xs uppercase tracking-widest font-semibold text-[#2C2C2C] group-hover:text-[#B8956A] transition-colors duration-200"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    </Link>

                    {/* Mega / Dropdown Menu */}
                    <div
                      className={cn(
                        'absolute top-full left-1/2 -translate-x-1/2 w-80 bg-white border border-stone-200 shadow-xl transition-all duration-200 py-3 px-2',
                        activeDropdown === item.label
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                      )}
                    >
                      <ul className="space-y-1">
                        {item.children?.map((sub) => (
                          <li key={sub.label}>
                            <Link
                              href={sub.href}
                              className="block px-3 py-2 text-xs text-[#3D3229] hover:bg-[#F5F0EB] hover:text-[#B8956A] transition-colors group/sub"
                            >
                              <div className="font-semibold text-stone-900 group-hover/sub:text-[#B8956A]">
                                {sub.label}
                              </div>
                              {sub.description && (
                                <div className="text-[11px] text-stone-400 font-normal truncate mt-0.5">
                                  {sub.description}
                                </div>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 pt-2 border-t border-stone-100 px-3">
                        <Link
                          href={item.href}
                          className="text-[11px] font-semibold text-[#B8956A] uppercase tracking-wider hover:underline"
                        >
                          View All {item.label} &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Search Icon (desktop) */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex p-2 text-[#2C2C2C] hover:text-[#B8956A] transition-colors"
                aria-label="Search site"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className="p-2 text-[#2C2C2C] hover:text-[#B8956A] transition-colors"
                aria-label="My account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="p-2 text-[#2C2C2C] hover:text-[#B8956A] transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-[#B8956A] text-white text-[10px] font-bold rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="p-2 text-[#2C2C2C] hover:text-[#B8956A] transition-colors relative"
                aria-label="Open shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-[#2C2C2C] text-white text-[10px] font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Modals & Overlays */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
};

export default Header;
