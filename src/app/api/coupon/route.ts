import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = (body.code || '').trim().toUpperCase();
    const subtotal = Number(body.subtotal) || 0;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid coupon code.' },
        { status: 400 }
      );
    }

    // First check database Discount table
    const dbDiscount = await prisma.discount.findFirst({
      where: {
        code: code,
        isActive: true,
      },
    });

    if (dbDiscount) {
      if (dbDiscount.minOrderAmount && subtotal < dbDiscount.minOrderAmount) {
        return NextResponse.json(
          {
            success: false,
            message: `Minimum order amount of Rs. ${dbDiscount.minOrderAmount.toLocaleString()} required for this coupon.`,
          },
          { status: 400 }
        );
      }

      let discountAmount = 0;
      if (dbDiscount.type === 'PERCENTAGE') {
        discountAmount = Math.round((subtotal * dbDiscount.value) / 100);
      } else {
        discountAmount = Math.min(dbDiscount.value, subtotal);
      }

      return NextResponse.json({
        success: true,
        discount: {
          id: dbDiscount.id,
          code: dbDiscount.code,
          type: dbDiscount.type,
          value: dbDiscount.value,
          amount: discountAmount,
        },
      });
    }

    // Built-in store promotional coupons
    const PROMO_CODES: Record<string, { type: 'PERCENTAGE' | 'FIXED'; value: number; minSubtotal: number }> = {
      AFSHAN10: { type: 'PERCENTAGE', value: 10, minSubtotal: 5000 },
      WELCOME500: { type: 'FIXED', value: 500, minSubtotal: 3000 },
      FESTIVE15: { type: 'PERCENTAGE', value: 15, minSubtotal: 20000 },
      VEHARI5: { type: 'PERCENTAGE', value: 5, minSubtotal: 1000 },
    };

    const promo = PROMO_CODES[code];
    if (promo) {
      if (subtotal < promo.minSubtotal) {
        return NextResponse.json(
          {
            success: false,
            message: `Code ${code} requires a minimum order of Rs. ${promo.minSubtotal.toLocaleString()}.`,
          },
          { status: 400 }
        );
      }

      const discountAmount =
        promo.type === 'PERCENTAGE'
          ? Math.round((subtotal * promo.value) / 100)
          : Math.min(promo.value, subtotal);

      return NextResponse.json({
        success: true,
        discount: {
          id: `promo-${code}`,
          code: code,
          type: promo.type,
          value: promo.value,
          amount: discountAmount,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid or expired coupon code.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to apply coupon.' },
      { status: 500 }
    );
  }
}
