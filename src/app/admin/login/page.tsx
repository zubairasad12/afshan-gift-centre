'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, MapPin, Phone } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#EBE3D9] overflow-hidden">
          {/* Header */}
          <div className="bg-[#2C2C2C] px-8 py-8 text-center">
            <div className="w-14 h-14 bg-[#B8956A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              Afshan <span className="text-[#B8956A]">Admin</span>
            </h1>
            <p className="text-white/50 text-xs mt-1.5 flex items-center justify-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#B8956A]" />
              Gift Centre Management Portal — Vehari
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <p className="text-[#6B5E52] text-sm text-center mb-6">
              Sign in with your admin credentials to continue
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#3D3229] mb-1.5 uppercase tracking-wide">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8956A]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@afshangiftcentre.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF7F4] border border-[#DDD1C2] rounded-xl text-sm text-[#2C2C2C] placeholder-[#BFB0A0] focus:outline-none focus:ring-2 focus:ring-[#B8956A]/40 focus:border-[#B8956A] transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#3D3229] mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8956A]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 bg-[#FAF7F4] border border-[#DDD1C2] rounded-xl text-sm text-[#2C2C2C] placeholder-[#BFB0A0] focus:outline-none focus:ring-2 focus:ring-[#B8956A]/40 focus:border-[#B8956A] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#BFB0A0] hover:text-[#B8956A] transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#2C2C2C] hover:bg-[#B8956A] text-white font-semibold py-3.5 rounded-xl text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Sign In to Admin Panel
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-[#EBE3D9] text-center">
              <p className="text-[#A09080] text-xs">
                Need help? Call{' '}
                <a
                  href="tel:03001005861"
                  className="text-[#B8956A] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  0300 1005861
                </a>
              </p>
              <a
                href="/"
                className="inline-block mt-3 text-xs text-[#B8956A] hover:underline"
              >
                ← Back to Store
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#BFB0A0] mt-4">
          Afshan Gift Centre · Club Road, Vehari, Punjab
        </p>
      </div>
    </div>
  );
}
