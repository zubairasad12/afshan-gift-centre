'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  Building,
  CreditCard,
  Banknote,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { FREE_DELIVERY_THRESHOLD, CONTACT_PHONE_FORMATTED } from '@/lib/constants';
import { useToast } from '@/components/ui/Toast';

const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
];

const POPULAR_CITIES = [
  'Vehari',
  'Lahore',
  'Multan',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Sahiwal',
  'Bahawalpur',
  'Burewala',
  'Gujranwala',
  'Sialkot',
  'Peshawar',
  'Quetta',
  'Other',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { error: toastError } = useToast();

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Step state (1: Information & Address, 2: Shipping & Payment, 3: Review)
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [shipping, setShipping] = useState({
    street: '',
    city: 'Vehari',
    customCity: '',
    state: 'Punjab',
    postalCode: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'pickup'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER'>('COD');
  const [orderNotes, setOrderNotes] = useState('');

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

  // If cart is empty, render redirection message
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAFAF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-stone-200 p-8 text-center shadow-xs">
          <h2 className="font-serif text-2xl font-semibold text-[#2C2C2C]">No Items to Checkout</h2>
          <p className="text-stone-500 text-sm mt-2 mb-6">
            Your shopping cart is currently empty. Please choose your favorite items before checkout.
          </p>
          <Link
            href="/collections"
            className="px-6 py-3 bg-[#2C2C2C] hover:bg-black text-white text-xs uppercase font-semibold tracking-wider inline-block transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || shippingMethod === 'pickup';
  const shippingCost = isFreeDelivery ? 0 : 500;
  const finalTotal = subtotal + shippingCost;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setErrorMessage('Please fill in your full name, email, and Pakistani contact phone number.');
      return;
    }

    if (!shipping.street.trim()) {
      setErrorMessage('Please provide your complete delivery street address.');
      return;
    }

    if (shipping.city === 'Other' && !shipping.customCity.trim()) {
      setErrorMessage('Please enter your city name.');
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const resolvedCity = shipping.city === 'Other' ? shipping.customCity.trim() : shipping.city;

    try {
      const payload = {
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
        },
        shipping: {
          street: shipping.street.trim(),
          city: resolvedCity,
          state: shipping.state,
          postalCode: shipping.postalCode.trim() || undefined,
        },
        shippingMethod,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          variantName: item.variantName,
          sku: item.slug ? `AGC-${item.slug.slice(0, 6).toUpperCase()}` : undefined,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          quantity: item.quantity,
        })),
        notes: orderNotes.trim() || undefined,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        setErrorMessage(data.message || 'Failed to place order. Please check your details.');
        toastError(data.message || 'Failed to place order.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-10 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B8956A] font-semibold">
              Secure Checkout
            </span>
            <h1 className="font-serif text-3xl font-semibold text-[#2C2C2C] tracking-tight mt-1">
              Complete Your Order
            </h1>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center gap-3 text-xs font-medium">
            <span
              className={`px-3 py-1 flex items-center gap-1.5 ${
                step === 1
                  ? 'bg-[#2C2C2C] text-white'
                  : 'bg-white border border-stone-300 text-stone-700'
              }`}
            >
              1. Customer & Address
            </span>
            <span className="text-stone-300">&rarr;</span>
            <span
              className={`px-3 py-1 flex items-center gap-1.5 ${
                step === 2
                  ? 'bg-[#2C2C2C] text-white'
                  : 'bg-white border border-stone-300 text-stone-400'
              }`}
            >
              2. Delivery & Payment
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-[#FDF8F8] border border-[#C75050]/40 text-[#C75050] text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Checkout Forms (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-stone-200/90 p-6 sm:p-8 shadow-xs">
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#2C2C2C] mb-4 pb-2 border-b border-stone-100">
                    1. Contact Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="e.g. Muhammad Ahmad"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-[#B8956A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="e.g. ahmad@gmail.com"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-[#B8956A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                        Mobile Phone (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="e.g. 0300 1234567"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-[#B8956A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="pt-4">
                  <h2 className="font-serif text-lg font-semibold text-[#2C2C2C] mb-4 pb-2 border-b border-stone-100">
                    2. Shipping Address in Pakistan
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                        Street Address / House No / Area *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={shipping.street}
                        onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                        placeholder="e.g. House #14, Street 3, Officers Colony, Club Road"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-[#B8956A]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                          City *
                        </label>
                        <select
                          value={shipping.city}
                          onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-[#B8956A] bg-white"
                        >
                          {POPULAR_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {shipping.city === 'Other' && (
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                            Specify City *
                          </label>
                          <input
                            type="text"
                            required
                            value={shipping.customCity}
                            onChange={(e) => setShipping({ ...shipping, customCity: e.target.value })}
                            placeholder="Your city name"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-[#B8956A]"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                          Province / Territory *
                        </label>
                        <select
                          value={shipping.state}
                          onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-[#B8956A] bg-white"
                        >
                          {PAKISTAN_PROVINCES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                          Postal Code (Optional)
                        </label>
                        <input
                          type="text"
                          value={shipping.postalCode}
                          onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                          placeholder="e.g. 61100"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-[#B8956A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <Link
                    href="/cart"
                    className="text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-black transition-colors"
                  >
                    &larr; Return to Cart
                  </Link>

                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#2C2C2C] hover:bg-black text-white text-xs uppercase font-semibold tracking-wider transition-colors inline-flex items-center gap-2"
                  >
                    <span>Continue to Delivery & Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                {/* Shipping Method Selection */}
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[#2C2C2C] mb-4 pb-2 border-b border-stone-100 flex items-center justify-between">
                    <span>1. Shipping Method</span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-[#B8956A] font-sans hover:underline font-normal"
                    >
                      Edit Address
                    </button>
                  </h2>

                  <div className="space-y-3">
                    <label
                      className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                        shippingMethod === 'standard'
                          ? 'border-[#B8956A] bg-[#FAF8F5]'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="mt-1 text-[#B8956A] focus:ring-[#B8956A]"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-semibold text-[#2C2C2C]">
                            Standard Doorstep Courier Delivery
                          </span>
                          <span className="text-xs font-bold text-[#2C2C2C]">
                            {subtotal >= FREE_DELIVERY_THRESHOLD ? 'FREE' : 'Rs. 500'}
                          </span>
                        </div>
                        <p className="text-stone-500 text-xs mt-1">
                          Express delivery across Pakistan via Leopards / TCS. Vehari deliveries dispatched within 24 hours.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                        shippingMethod === 'pickup'
                          ? 'border-[#B8956A] bg-[#FAF8F5]'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'pickup'}
                        onChange={() => setShippingMethod('pickup')}
                        className="mt-1 text-[#B8956A] focus:ring-[#B8956A]"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-semibold text-[#2C2C2C]">
                            Store Pickup (Vehari Showroom)
                          </span>
                          <span className="text-xs font-bold text-[#5A7A60]">FREE</span>
                        </div>
                        <p className="text-stone-500 text-xs mt-1">
                          Collect in person at Club Road, Commercial Area, Vehari. Mon–Sat (10 AM – 9 PM).
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="pt-4">
                  <h2 className="font-serif text-lg font-semibold text-[#2C2C2C] mb-4 pb-2 border-b border-stone-100">
                    2. Payment Method
                  </h2>

                  <div className="space-y-3">
                    {/* Cash on Delivery (COD) */}
                    <label
                      className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-[#B8956A] bg-[#FAF8F5]'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="mt-1 text-[#B8956A] focus:ring-[#B8956A]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-[#B8956A]" />
                          <span className="text-xs sm:text-sm font-semibold text-[#2C2C2C]">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[10px] bg-[#5A7A60]/10 text-[#5A7A60] px-1.5 py-0.5 font-semibold uppercase">
                            Recommended
                          </span>
                        </div>
                        <p className="text-stone-500 text-xs mt-1">
                          Pay cash to the rider upon safe receipt and inspection of your parcel at your doorstep.
                        </p>
                      </div>
                    </label>

                    {/* Direct Bank Transfer */}
                    <label
                      className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                        paymentMethod === 'BANK_TRANSFER'
                          ? 'border-[#B8956A] bg-[#FAF8F5]'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'BANK_TRANSFER'}
                        onChange={() => setPaymentMethod('BANK_TRANSFER')}
                        className="mt-1 text-[#B8956A] focus:ring-[#B8956A]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#B8956A]" />
                          <span className="text-xs sm:text-sm font-semibold text-[#2C2C2C]">
                            Direct Bank Transfer / IBFT
                          </span>
                        </div>
                        <p className="text-stone-500 text-xs mt-1">
                          Transfer directly to our Meezan Bank / Bank Alfalah account. Share payment receipt via WhatsApp to 0300 1005861.
                        </p>

                        {paymentMethod === 'BANK_TRANSFER' && (
                          <div className="mt-3 p-3 bg-white border border-stone-200 text-xs text-stone-700 space-y-1">
                            <p><strong>Bank:</strong> Meezan Bank Limited (Vehari Branch)</p>
                            <p><strong>Account Title:</strong> Afshan Gift Centre</p>
                            <p><strong>Account Number:</strong> 0812-0105861922</p>
                            <p><strong>IBAN:</strong> PK44MEZN0008120105861922</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Optional Order Notes */}
                <div className="pt-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                    Order Notes & Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Please call before arriving or deliver between 2 PM - 6 PM"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-[#B8956A]"
                  />
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-black transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Address</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-[#B8956A] hover:bg-[#A07F56] text-white text-xs uppercase font-semibold tracking-wider transition-colors inline-flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Place Order ({formatPrice(finalTotal)})</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: Order Summary & Review (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-stone-200/90 p-6 sm:p-7 shadow-xs">
            <h2 className="font-serif text-xl font-semibold text-[#2C2C2C] pb-4 border-b border-stone-200">
              Order Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            {/* Line items list */}
            <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto py-2">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 items-center">
                  <div className="relative w-14 h-16 bg-stone-100 border border-stone-200 shrink-0 overflow-hidden">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#2C2C2C] truncate">
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <span className="text-[11px] text-stone-500 block truncate">
                        {item.variantName}
                      </span>
                    )}
                    <span className="text-[11px] text-stone-400">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#2C2C2C] shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="pt-4 border-t border-stone-200 space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#2C2C2C]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === 'pickup' ? 'Pickup' : 'Courier'})</span>
                <span className="font-medium text-[#2C2C2C]">
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#2C2C2C]">Total Payable</span>
                <span className="font-serif text-2xl font-bold text-[#2C2C2C]">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Customer Details Recap (if in step 2) */}
            {step === 2 && customer.name && (
              <div className="mt-6 pt-4 border-t border-stone-200 bg-[#FAFAF7] p-3 text-xs text-stone-600 space-y-1">
                <p><strong>Deliver to:</strong> {customer.name} ({customer.phone})</p>
                <p className="truncate"><strong>Address:</strong> {shipping.street}, {shipping.city === 'Other' ? shipping.customCity : shipping.city}, {shipping.state}</p>
              </div>
            )}

            {/* Safe Shopping Guarantee */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-[#B8956A] shrink-0" />
              <span>100% Encrypted & Safe Checkout | Vehari, Pakistan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
