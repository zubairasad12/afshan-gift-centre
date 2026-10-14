import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status')?.trim();
    const search = searchParams.get('search')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { shippingName: { contains: search } },
        { shippingCity: { contains: search } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: true,
          payments: true,
          shipments: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admin orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      orderNumber,
      status,
      paymentStatus,
      trackingNumber,
      carrier,
      notes,
    } = body;

    const identifier = orderId || orderNumber;
    if (!identifier) {
      return NextResponse.json(
        { success: false, message: 'orderId or orderNumber is required.' },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [{ id: identifier }, { orderNumber: identifier }],
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    const updateData: Prisma.OrderUpdateInput = {};

    if (status) {
      updateData.status = status;
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: existingOrder.id },
        data: updateData,
        include: {
          items: true,
          payments: true,
          shipments: true,
        },
      });

      // Update payment status if modified
      if (paymentStatus && order.payments.length > 0) {
        await tx.payment.updateMany({
          where: { orderId: order.id },
          data: { status: paymentStatus },
        });
      }

      // Upsert shipment if trackingNumber or carrier is provided or order marked as SHIPPED
      if (trackingNumber || carrier || status === 'SHIPPED') {
        const existingShipment = await tx.shipment.findFirst({
          where: { orderId: order.id },
        });

        if (existingShipment) {
          await tx.shipment.update({
            where: { id: existingShipment.id },
            data: {
              carrier: carrier || existingShipment.carrier,
              trackingNumber: trackingNumber || existingShipment.trackingNumber,
              status: status || existingShipment.status,
              shippedAt: status === 'SHIPPED' ? new Date() : existingShipment.shippedAt,
              deliveredAt: status === 'DELIVERED' ? new Date() : existingShipment.deliveredAt,
            },
          });
        } else {
          await tx.shipment.create({
            data: {
              orderId: order.id,
              carrier: carrier || 'TCS / Leopards Courier',
              trackingNumber: trackingNumber || null,
              status: status || 'SHIPPED',
              shippedAt: status === 'SHIPPED' ? new Date() : null,
              deliveredAt: status === 'DELIVERED' ? new Date() : null,
            },
          });
        }
      }

      return order;
    });

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order' },
      { status: 500 }
    );
  }
}
