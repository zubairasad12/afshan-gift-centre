'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { FREE_DELIVERY_THRESHOLD, CONTACT_PHONE_FORMATTED } from '@/lib/constants';
import { useToast } from '@/components/ui/Toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { success, error: toastError } = useToast();

  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    amount: number;
    type: string;
    value: number;
  } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#B8956A] border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  const subtotal = getTotal();
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // Shipping cost: Free if subtotal >= 10,000, else Rs. 500
  const shippingCost = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : 500;
  const discountAmount = appliedCoupon ? appliedCoupon.amount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(data.discount);
        success(`Coupon "${data.discount.code}" applied successfully!`);
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        toastError(data.message || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to apply coupon. Please try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#FAFAF7] flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md bg-white border border-stone-200/90 p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 bg-[#F5F0EB] flex items-center justify-center mx-auto mb-5 rounded-full">
            <ShoppingBag className="w-8 h-8 text-[#B8956A]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C2C2C]">
            Your Shopping Cart is Empty
          </h1>
          <p className="text-stone-500 text-sm mt-3 leading-relaxed">
            Looks like you haven&apos;t added any gifts or luxury home decor pieces to your cart yet.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/collections"
              className="px-6 py-3.5 bg-[#2C2C2C] hover:bg-black text-white text-xs uppercase font-semibold tracking-wider transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/collections/sale"
              className="px-6 py-3.5 border border-stone-300 hover:border-stone-400 text-[#2C2C2C] text-xs uppercase font-semibold tracking-wider transition-colors"
            >
              View Sale Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C2C2C] tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {items.length} {items.length === 1 ? 'unique item' : 'unique items'} in your bag
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-stone-500 hover:text-[#C75050] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="mt-6 bg-white border border-stone-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2.5">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#B8956A]" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-[#5A7A60] font-semibold">
                  Congratulations! You unlocked FREE Delivery across Pakistan!
                </span>
              ) : (
                <span className="text-[#2C2C2C]">
                  Add <strong className="text-[#B8956A] font-semibold">{formatPrice(remainingForFreeShipping)}</strong> more to get <strong className="text-[#2C2C2C]">FREE Delivery</strong>
                </span>
              )}
            </div>
            <span className="text-stone-500 font-semibold">{progressToFreeShipping}%</span>
          </div>
          <div className="w-full bg-[#F5F0EB] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#B8956A] h-full transition-all duration-500 ease-out"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Main Grid: Items Table (8 cols) & Summary (4 cols) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ITEMS LIST (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-stone-200/90 shadow-xs">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-[#F5F0EB]/60 border-b border-stone-200 text-xs uppercase tracking-wider font-semibold text-stone-600">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            <div className="divide-y divide-stone-200">
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                  >
                    {/* Item Image and Meta (6 cols on desktop) */}
                    <div className="sm:col-span-6 flex gap-4">
                      <Link
                        href={`/products/${item.slug}`}
                        className="relative w-20 h-24 sm:w-24 sm:h-28 bg-stone-100 shrink-0 border border-stone-200 overflow-hidden"
                      >
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex flex-col justify-between py-0.5">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-serif text-sm sm:text-base font-semibold text-[#2C2C2C] hover:text-[#B8956A] transition-colors leading-snug line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          {item.variantName && (
                            <span className="text-xs text-stone-500 block mt-1">
                              Option: {item.variantName}
                            </span>
                          )}
                          {item.material && (
                            <span className="text-[11px] text-stone-400 block mt-0.5">
                              {item.material}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-stone-400 hover:text-[#C75050] transition-colors flex items-center gap-1 mt-2 self-start"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Unit Price (2 cols) */}
                    <div className="sm:col-span-2 sm:text-center flex sm:block justify-between items-center text-xs sm:text-sm text-stone-700">
                      <span className="sm:hidden text-stone-400">Unit Price:</span>
                      <span className="font-medium">{formatPrice(item.price)}</span>
                    </div>

                    {/* Quantity Picker (2 cols) */}
                    <div className="sm:col-span-2 flex sm:justify-center items-center justify-between">
                      <span className="sm:hidden text-xs text-stone-400">Qty:</span>
                      <div className="inline-flex items-center border border-stone-200 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-stone-500 hover:text-black hover:bg-stone-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#2C2C2C]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-stone-500 hover:text-black hover:bg-stone-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Line Subtotal (2 cols) */}
                    <div className="sm:col-span-2 sm:text-right flex sm:block justify-between items-center">
                      <span className="sm:hidden text-xs text-stone-400">Total:</span>
                      <span className="text-sm font-bold text-[#2C2C2C]">
                        {formatPrice(lineTotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 sm:p-6 bg-[#FAFAF7] border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/collections"
                className="text-xs uppercase tracking-wider font-semibold text-[#2C2C2C] hover:text-[#B8956A] transition-colors flex items-center gap-1.5"
              >
                <span>&larr; Continue Browsing</span>
              </Link>
              <div className="text-xs text-stone-500">
                Support: <strong className="text-stone-700">{CONTACT_PHONE_FORMATTED}</strong>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-stone-200/90 p-6 sm:p-7 shadow-xs">
            <h2 className="font-serif text-xl font-semibold text-[#2C2C2C] pb-4 border-b border-stone-200">
              Order Summary
            </h2>

            {/* Coupon Code Input */}
            <div className="py-5 border-b border-stone-200">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#2C2C2C] mb-2">
                Have a Promo Code?
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#FAFDFB] border border-[#5A7A60]/40 text-xs text-[#5A7A60]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-stone-400 hover:text-stone-700 text-xs font-semibold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. AFSHAN10"
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-[#B8956A] uppercase font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-[#2C2C2C] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                  >
                    {isApplyingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponError && (
                <p className="mt-2 text-xs text-[#C75050] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponError}</span>
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="py-5 space-y-3.5 text-xs sm:text-sm border-b border-stone-200">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-[#2C2C2C]">{formatPrice(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-[#5A7A60]">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-medium">-{formatPrice(appliedCoupon.amount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  Shipping Fee
                  {shippingCost === 0 && <span className="text-[10px] text-[#5A7A60] bg-[#FAFDFB] border border-[#5A7A60]/30 px-1 font-semibold uppercase">Free</span>}
                </span>
                <span className="font-medium text-[#2C2C2C]">
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
            </div>

            {/* Total Price */}
            <div className="pt-5 pb-6 flex items-baseline justify-between">
              <div>
                <span className="text-base font-semibold text-[#2C2C2C] block">Estimated Total</span>
                <span className="text-[11px] text-stone-400 font-light">Including all applicable taxes</span>
              </div>
              <span className="text-2xl font-serif font-bold text-[#2C2C2C]">
                {formatPrice(finalTotal)}
              </span>
            </div>

            {/* Checkout Action Button */}
            <Link
              href="/checkout"
              className="w-full py-4 bg-[#B8956A] hover:bg-[#A07F56] text-white text-xs uppercase tracking-wider font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Reassurance Details */}
            <div className="mt-6 pt-5 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B8956A] shrink-0" />
                <span>Cash on Delivery (COD) supported nationwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#B8956A] shrink-0" />
                <span>Carefully packed & insured wooden crating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
