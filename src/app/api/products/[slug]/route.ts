import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Product slug is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch related products (same category or featured, excluding current product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        ...(product.categoryId ? { categoryId: product.categoryId } : {}),
      },
      take: 4,
      orderBy: { isFeatured: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { position: 'asc' },
          take: 2,
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            price: true,
            compareAtPrice: true,
            stock: true,
          },
        },
      },
    });

    // Calculate rating statistics
    const reviewCount = product.reviews.length;
    const averageRating =
      reviewCount > 0
        ? product.reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviewCount
        : 0;

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        rating: Math.round(averageRating * 10) / 10,
        reviewCount,
      },
      relatedProducts,
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
