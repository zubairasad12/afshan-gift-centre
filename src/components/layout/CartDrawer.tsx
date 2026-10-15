'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const subtotal = getTotal();
  const freeShippingThreshold = 10000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = freeShippingThreshold - subtotal;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAFAF7] shadow-drawer flex flex-col animate-in slide-in-from-right duration-300 border-l border-stone-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B8956A]" />
              <h2 className="text-lg font-serif font-semibold text-[#2C2C2C]">Shopping Cart</h2>
              <span className="text-xs bg-[#F5F0EB] text-[#3D3229] px-2 py-0.5 font-medium ml-1">
                {items.length}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1 text-stone-400 hover:text-[#2C2C2C] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-[#F5F0EB] px-6 py-3 border-b border-stone-200 text-xs text-[#3D3229]">
            {remainingForFree > 0 ? (
              <p>
                Add <strong className="text-[#B8956A] font-semibold">{formatPrice(remainingForFree)}</strong> more for{' '}
                <strong>FREE DELIVERY</strong> in Pakistan!
              </p>
            ) : (
              <p className="text-[#5A7A60] font-semibold flex items-center gap-1.5">
                <span>🎉 You qualify for FREE DELIVERY!</span>
              </p>
            )}
            <div className="w-full bg-stone-200 h-1.5 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-[#B8956A] h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items list or Empty state */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 bg-[#F5F0EB] rounded-full flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-serif font-semibold text-[#2C2C2C] mb-2">
                  Your cart is currently empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore our curated gifts and luxury home decor to find items you love.
                </p>
                <Button variant="primary" onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-stone-200">
                {items.map((item) => (
                  <li key={item.id} className="py-4 flex gap-4">
                    {/* Item Image */}
                    <div className="relative w-20 h-24 bg-stone-100 shrink-0 overflow-hidden border border-stone-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'; }}
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="text-sm font-medium text-[#2C2C2C] hover:text-[#B8956A] transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-stone-400 hover:text-[#C75050] transition-colors p-1"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.variantName && (
                          <p className="text-xs text-stone-500 mt-0.5">{item.variantName}</p>
                        )}
                        <p className="text-xs font-semibold text-[#2C2C2C] mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-stone-300 bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-stone-600 hover:text-black transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium text-[#2C2C2C]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-stone-600 hover:text-black transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-[#2C2C2C]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer with Subtotal & Actions */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 px-6 py-5 bg-white space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2C2C2C]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600 text-xs">
                  <span>Estimated Delivery</span>
                  <span>{subtotal >= freeShippingThreshold ? 'FREE' : 'Calculated at checkout'}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <Button variant="accent" isFullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/cart" onClick={closeCart} className="block w-full">
                  <Button variant="secondary" isFullWidth>
                    View Full Cart
                  </Button>
                </Link>
              </div>

              <p className="text-[11px] text-center text-stone-400">
                Taxes included. Cash on Delivery available across Pakistan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
