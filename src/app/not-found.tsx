import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FAFAF7]">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Decorative graphic illustration */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#F5F0EB] animate-pulse" />
          <span className="relative font-serif text-6xl font-bold text-[#B8956A]">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#2C2C2C]">
            Page Not Found
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            The page you are looking for doesn’t exist or might have been relocated to another section of our showroom.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary">
              Back to Home
            </Button>
          </Link>
          <Link href="/collections">
            <Button variant="secondary">
              Browse Collections
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
