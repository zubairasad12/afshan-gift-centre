'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  Phone,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Bell,
  Search,
} from 'lucide-react';
import { CONTACT_PHONE_FORMATTED } from '@/lib/constants';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Login page renders without the admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      label: 'Customers',
      href: '/admin/customers',
      icon: Users,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out of Afshan Gift Centre Admin?')) {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]/50 text-[#3D3229] flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#2C2C2C] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="font-serif text-lg font-bold text-white tracking-wide">
            Afshan <span className="text-[#B8956A]">Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-[#FAFAF7] transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-[#B8956A]" />
            <span>Store</span>
          </Link>
        </div>
      </div>

      {/* Desktop / Collapsible Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 w-64 bg-[#2C2C2C] text-[#FAFAF7] flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-white/10 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top brand header */}
        <div>
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="block">
              <div className="font-serif text-xl font-bold tracking-tight text-white">
                Afshan <span className="text-[#B8956A]">Gift Centre</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#A07F56] mt-1 font-medium">
                <MapPin className="w-3 h-3 text-[#B8956A]" />
                <span>Vehari Showroom Operations</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-white/40 font-semibold">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#B8956A] text-white shadow-subtle'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#B8956A]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-black/25 text-white'
                          : 'bg-[#B8956A]/20 text-[#D8C3A8]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* Quick link to live site */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 text-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-[#B8956A]" />
              <span>View Online Store</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          </Link>

          {/* Direct helpline reminder */}
          <div className="px-3.5 py-2 rounded-lg bg-black/20 text-[11px] text-white/60">
            <div className="text-[10px] text-white/40 uppercase font-semibold">Vehari Desk</div>
            <div className="text-[#D8C3A8] font-mono font-medium mt-0.5">
              {CONTACT_PHONE_FORMATTED}
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#B8956A] text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <div className="text-xs font-semibold text-white leading-tight">Admin User</div>
                <div className="text-[10px] text-white/50">Vehari Superadmin</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-[#EBE3D9] sticky top-0 z-30 shadow-subtle">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-[#757575]">
              Afshan Gift Centre Management Portal
            </div>
            <div className="h-4 w-px bg-[#DDD1C2]" />
            <div className="inline-flex items-center gap-1.5 text-xs text-[#5A7A60] font-medium bg-[#EFF5F1] px-2.5 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#5A7A60] animate-pulse" />
              <span>Vehari Showroom Live & Synced</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#FAF7F4] hover:bg-[#F5F0EB] border border-[#DDD1C2] text-xs font-medium text-[#2C2C2C] transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#B8956A]" />
              <span>Customer Front</span>
            </Link>

            <a
              href="tel:03001005861"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#5E5E5E] hover:text-[#B8956A]"
            >
              <Phone className="w-3.5 h-3.5 text-[#B8956A]" />
              <span>0300 1005861</span>
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EBE3D9] text-[#757575] hover:text-[#C75050] hover:border-[#C75050]/40 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
