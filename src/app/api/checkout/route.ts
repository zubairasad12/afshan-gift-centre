import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customer,
      shipping,
      paymentMethod = 'COD',
      items,
      couponCode,
      notes,
    } = body;

    // Validate customer and items
    if (!customer?.name || !customer?.phone || !customer?.email) {
      return NextResponse.json(
        { success: false, message: 'Please provide full contact details (name, email, and phone).' },
        { status: 400 }
      );
    }

    if (!shipping?.street || !shipping?.city || !shipping?.state) {
      return NextResponse.json(
        { success: false, message: 'Please provide a complete shipping address.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Your cart is empty. Please add items before checking out.' },
        { status: 400 }
      );
    }

    // Calculate subtotal from line items with verified DB references
    let subtotal = 0;
    const validatedItems = await Promise.all(
      items.map(async (item: any) => {
        const price = Number(item.price) || 0;
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const lineTotal = price * quantity;
        subtotal += lineTotal;

        let validProductId: string | null = null;
        let validVariantId: string | null = null;

        if (item.productId) {
          const p = await prisma.product.findUnique({
            where: { id: String(item.productId) },
            select: { id: true },
          });
          if (p) validProductId = p.id;
        }

        if (item.variantId) {
          const v = await prisma.productVariant.findUnique({
            where: { id: String(item.variantId) },
            select: { id: true },
          });
          if (v) validVariantId = v.id;
        }

        return {
          productId: validProductId,
          variantId: validVariantId,
          productName: item.name || 'Handcrafted Item',
          variantName: item.variantName || null,
          sku: item.sku || `AGC-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          price: price,
          compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
          quantity: quantity,
          total: lineTotal,
        };
      })
    );

    // Determine shipping cost (Free for subtotal >= 10,000 PKR, else 500 PKR)
    const shippingCost = subtotal >= 10000 ? 0 : 500;

    // Determine discount if coupon provided
    let discountAmount = 0;
    let appliedDiscountId: string | null = null;

    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      const dbDiscount = await prisma.discount.findFirst({
        where: { code: cleanCode, isActive: true },
      });

      if (dbDiscount) {
        appliedDiscountId = dbDiscount.id;
        if (dbDiscount.type === 'PERCENTAGE') {
          discountAmount = Math.round((subtotal * dbDiscount.value) / 100);
        } else {
          discountAmount = Math.min(dbDiscount.value, subtotal);
        }
      } else {
        // Fallback promo codes
        if (cleanCode === 'AFSHAN10') discountAmount = Math.round(subtotal * 0.1);
        else if (cleanCode === 'WELCOME500') discountAmount = 500;
        else if (cleanCode === 'FESTIVE15') discountAmount = Math.round(subtotal * 0.15);
        else if (cleanCode === 'VEHARI5') discountAmount = Math.round(subtotal * 0.05);
      }
    }

    const total = Math.max(0, subtotal - discountAmount + shippingCost);

    // Generate unique order number (e.g. AGC-2026-XXXX)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AGC-${dateStr}-${randomSuffix}`;

    // Create Order with OrderItems in Prisma transaction
    const order = await prisma.order.create({
      data: {
        orderNumber,
        email: customer.email,
        phone: customer.phone,
        status: 'PENDING',
        subtotal,
        shippingCost,
        discount: discountAmount,
        total,
        discountId: appliedDiscountId,
        shippingName: customer.name,
        shippingPhone: customer.phone,
        shippingStreet: shipping.street,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingPostalCode: shipping.postalCode || null,
        shippingCountry: 'Pakistan',
        paymentMethod: paymentMethod === 'BANK_TRANSFER' ? 'BANK_TRANSFER' : 'COD',
        paymentStatus: 'PENDING',
        notes: notes || null,
        items: {
          create: validatedItems.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantName: item.variantName,
            sku: item.sku,
            price: item.price,
            compareAtPrice: item.compareAtPrice,
            quantity: item.quantity,
            total: item.total,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
    });
  } catch (error) {
    console.error('Checkout processing error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'There was an error creating your order. Please try again or contact us on WhatsApp at 0300 1005861.',
      },
      { status: 500 }
    );
  }
}
