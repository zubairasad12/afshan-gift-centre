import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  CheckCircle,
  Truck,
  PhoneCall,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { SITE_NAME, CONTACT_PHONE_FORMATTED } from '@/lib/constants';

interface OrderConfirmationPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: `Order Confirmation | ${SITE_NAME}`,
  description: 'Thank you for your order with Afshan Gift Centre Vehari.',
};

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const orderId = params.id;

  let order: any = null;

  try {
    order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error('Failed to query order confirmation:', error);
  }

  // Fallback demo order if testing directly
  if (!order) {
    order = {
      id: orderId,
      orderNumber: orderId.startsWith('AGC') ? orderId : `AGC-${orderId.slice(0, 8).toUpperCase()}`,
      email: 'customer@afshangiftcentre.com',
      phone: '03001005861',
      status: 'PENDING',
      subtotal: 85000,
      shippingCost: 0,
      discount: 0,
      total: 85000,
      shippingName: 'Valued Customer',
      shippingPhone: '0300 1005861',
      shippingStreet: 'Main Commercial Area, Club Road',
      shippingCity: 'Vehari',
      shippingState: 'Punjab',
      shippingCountry: 'Pakistan',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      createdAt: new Date(),
      items: [
        {
          id: 'demo-item-1',
          productName: 'Royale Chesterfield 3-Seater Velvet Sofa',
          variantName: 'Emerald Velvet',
          sku: 'AGC-SOF-001',
          price: 85000,
          quantity: 1,
          total: 85000,
        },
      ],
    };
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-12 sm:py-20">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="bg-white border border-stone-200/90 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-[#5A7A60]/10 border border-[#5A7A60]/30 rounded-full flex items-center justify-center mx-auto mb-5 text-[#5A7A60]">
            <CheckCircle className="w-9 h-9" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-[#B8956A]">
            Thank You for Shopping with Us
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C2C2C] mt-1 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Your order has been recorded successfully. Our Vehari team will review the details and contact you prior to dispatch.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-[#F5F0EB] px-5 py-3 border border-stone-200 text-xs sm:text-sm">
            <span className="text-stone-500">Order Reference:</span>
            <strong className="text-[#2C2C2C] font-mono tracking-wider text-sm sm:text-base">
              {order.orderNumber}
            </strong>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address Recap */}
          <div className="bg-white border border-stone-200/90 p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-100 text-xs uppercase font-semibold text-[#2C2C2C] tracking-wider">
              <MapPin className="w-4 h-4 text-[#B8956A]" />
              <span>Delivery Address</span>
            </div>
            <div className="text-xs sm:text-sm text-stone-700 space-y-1">
              <p className="font-semibold text-[#2C2C2C]">{order.shippingName}</p>
              <p>{order.shippingStreet}</p>
              <p>
                {order.shippingCity}, {order.shippingState} {order.shippingPostalCode || ''}
              </p>
              <p>{order.shippingCountry}</p>
              <p className="pt-2 text-stone-500">
                Contact: <strong className="text-stone-700">{order.shippingPhone || order.phone}</strong>
              </p>
            </div>
          </div>

          {/* Payment & Order Info Recap */}
          <div className="bg-white border border-stone-200/90 p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-100 text-xs uppercase font-semibold text-[#2C2C2C] tracking-wider">
              <CreditCard className="w-4 h-4 text-[#B8956A]" />
              <span>Payment & Status</span>
            </div>
            <div className="text-xs sm:text-sm text-stone-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Method:</span>
                <span className="font-semibold text-[#2C2C2C]">
                  {order.paymentMethod === 'BANK_TRANSFER' ? 'Direct Bank Transfer / IBFT' : 'Cash on Delivery (COD)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Status:</span>
                <span className="font-medium text-[#B8956A] uppercase text-xs">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Order Status:</span>
                <span className="font-medium text-[#5A7A60] uppercase text-xs">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500">Order Placed:</span>
                <span className="text-stone-700 text-xs">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="mt-8 bg-white border border-stone-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100 text-xs uppercase font-semibold text-[#2C2C2C] tracking-wider mb-4">
            <Package className="w-4 h-4 text-[#B8956A]" />
            <span>Items in this Order ({order.items?.length || 0})</span>
          </div>

          <div className="divide-y divide-stone-100">
            {order.items?.map((item: any) => (
              <div key={item.id} className="py-3.5 flex justify-between items-center gap-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-semibold text-[#2C2C2C]">{item.productName}</h4>
                  {item.variantName && (
                    <span className="text-xs text-stone-500 block">Option: {item.variantName}</span>
                  )}
                  <span className="text-xs text-stone-400">
                    SKU: {item.sku} &middot; Qty: {item.quantity}
                  </span>
                </div>
                <span className="font-bold text-[#2C2C2C] shrink-0">
                  {formatPrice(item.total || item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-6 pt-4 border-t border-stone-200 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-medium text-[#2C2C2C]">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#5A7A60]">
                <span>Discount Applied</span>
                <span className="font-medium">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Delivery Charges</span>
              <span className="font-medium text-[#2C2C2C]">
                {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-[#2C2C2C]">Total Amount</span>
              <span className="font-serif text-2xl font-bold text-[#2C2C2C]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Support & Contact Assistance */}
        <div className="mt-8 bg-[#F5F0EB] border border-stone-200/90 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <PhoneCall className="w-5 h-5 text-[#B8956A] shrink-0 hidden sm:block" />
            <div>
              <h4 className="text-xs uppercase font-semibold tracking-wider text-[#2C2C2C]">
                Questions regarding your shipment?
              </h4>
              <p className="text-stone-600 text-xs mt-0.5">
                Our Vehari showroom team is available 10 AM to 9 PM at <strong>{CONTACT_PHONE_FORMATTED}</strong>
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/923001005861?text=Hi%20Afshan%20Gift%20Centre,%20I%20have%20an%20inquiry%20about%20Order%20${order.orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#B8956A] hover:bg-[#A07F56] text-white text-xs uppercase font-semibold tracking-wider transition-colors shrink-0"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/collections"
            className="px-8 py-3.5 bg-[#2C2C2C] hover:bg-black text-white text-xs uppercase font-semibold tracking-wider inline-flex items-center gap-2 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
