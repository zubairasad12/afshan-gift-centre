import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Collection slug is required' },
        { status: 400 }
      );
    }

    const collection = await prisma.collection.findUnique({
      where: { slug },
    });

    if (!collection || !collection.isActive) {
      return NextResponse.json(
        { success: false, message: 'Collection not found' },
        { status: 404 }
      );
    }

    const category = searchParams.get('category')?.trim();
    const sort = searchParams.get('sort')?.trim() || 'featured';
    const minPriceStr = searchParams.get('minPrice');
    const maxPriceStr = searchParams.get('maxPrice');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const skip = (page - 1) * limit;

    const productWhere: Prisma.ProductWhereInput = {
      isActive: true,
      collectionProducts: {
        some: {
          collectionId: collection.id,
        },
      },
    };

    if (category) {
      productWhere.category = {
        OR: [{ slug: category }, { id: category }],
      };
    }

    const minPrice = minPriceStr ? parseFloat(minPriceStr) : undefined;
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;

    if (minPrice !== undefined || maxPrice !== undefined) {
      productWhere.price = {};
      if (minPrice !== undefined && !isNaN(minPrice)) {
        productWhere.price.gte = minPrice;
      }
      if (maxPrice !== undefined && !isNaN(maxPrice)) {
        productWhere.price.lte = maxPrice;
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (sort) {
      case 'newest':
        orderBy = [{ createdAt: 'desc' }];
        break;
      case 'price-asc':
        orderBy = [{ price: 'asc' }];
        break;
      case 'price-desc':
        orderBy = [{ price: 'desc' }];
        break;
      case 'featured':
      default:
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
        break;
    }

    const [total, products, allCollectionProducts] = await Promise.all([
      prisma.product.count({ where: productWhere }),
      prisma.product.findMany({
        where: productWhere,
        orderBy,
        skip,
        take: limit,
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
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              compareAtPrice: true,
              stock: true,
            },
          },
        },
      }),
      // Get all active products in collection for available filters
      prisma.product.findMany({
        where: {
          isActive: true,
          collectionProducts: {
            some: {
              collectionId: collection.id,
            },
          },
        },
        select: {
          price: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    // Compute filter metadata
    const categoriesMap = new Map<string, { id: string; name: string; slug: string; count: number }>();
    let availableMinPrice = 0;
    let availableMaxPrice = 0;

    if (allCollectionProducts.length > 0) {
      availableMinPrice = Math.min(...allCollectionProducts.map((p) => p.price));
      availableMaxPrice = Math.max(...allCollectionProducts.map((p) => p.price));

      for (const p of allCollectionProducts) {
        if (p.category) {
          const existing = categoriesMap.get(p.category.id);
          if (existing) {
            existing.count += 1;
          } else {
            categoriesMap.set(p.category.id, {
              id: p.category.id,
              name: p.category.name,
              slug: p.category.slug,
              count: 1,
            });
          }
        }
      }
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      collection,
      products,
      filters: {
        categories: Array.from(categoriesMap.values()),
        priceRange: {
          min: availableMinPrice,
          max: availableMaxPrice,
        },
      },
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching collection by slug:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}
