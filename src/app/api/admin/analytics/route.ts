import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders,
      allOrdersForRevenue,
      statusGroups,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          shippingName: true,
          email: true,
          phone: true,
          status: true,
          total: true,
          paymentMethod: true,
          createdAt: true,
          _count: {
            select: { items: true },
          },
        },
      }),
      prisma.order.findMany({
        where: {
          status: {
            notIn: ['CANCELLED', 'PAYMENT_FAILED'],
          },
        },
        select: {
          total: true,
        },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),
    ]);

    const totalRevenue = allOrdersForRevenue.reduce((sum, ord) => sum + ord.total, 0);

    const ordersByStatus = statusGroups.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        orderCount: totalOrders,
        productsCount: totalProducts,
        customersCount: totalCustomers,
        ordersByStatus,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
