import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search')?.trim();
    const categoryId = searchParams.get('categoryId')?.trim();
    const status = searchParams.get('status')?.trim(); // 'active', 'inactive', 'all'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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
          variants: true,
          _count: {
            select: {
              orderItems: true,
              reviews: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admin products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      description,
      shortDescription,
      sku,
      price,
      compareAtPrice,
      costPrice,
      categoryId,
      isFeatured = false,
      isActive = true,
      isOnSale = false,
      material,
      dimensions,
      weight,
      tags,
      metaTitle,
      metaDescription,
      variants = [],
      images = [],
      collectionIds = [],
    } = body;

    if (!name || !sku || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Product name, SKU, and price are required.' },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const productSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    // Check unique SKU or slug
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ sku }, { slug: productSlug }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            existing.sku === sku
              ? 'A product with this SKU already exists.'
              : 'A product with this slug already exists.',
        },
        { status: 400 }
      );
    }

    const createdProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug: productSlug,
          description: description || '',
          shortDescription: shortDescription || null,
          sku,
          price: parseFloat(price),
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          costPrice: costPrice ? parseFloat(costPrice) : null,
          categoryId: categoryId || null,
          isFeatured: Boolean(isFeatured),
          isActive: Boolean(isActive),
          isOnSale: Boolean(isOnSale),
          material: material || null,
          dimensions: dimensions || null,
          weight: weight || null,
          tags: tags || null,
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
          images: {
            create: images.map((img: { url: string; alt?: string; position?: number; isPrimary?: boolean }, index: number) => ({
              url: img.url,
              alt: img.alt || name,
              position: img.position ?? index,
              isPrimary: img.isPrimary ?? index === 0,
            })),
          },
          variants: {
            create: variants.map((v: { name: string; sku?: string; price?: number; compareAtPrice?: number; stock?: number; isActive?: boolean }, idx: number) => ({
              name: v.name,
              sku: v.sku || `${sku}-VAR-${idx + 1}`,
              price: v.price ? parseFloat(String(v.price)) : parseFloat(price),
              compareAtPrice: v.compareAtPrice ? parseFloat(String(v.compareAtPrice)) : null,
              stock: v.stock !== undefined ? parseInt(String(v.stock), 10) : 0,
              isActive: v.isActive ?? true,
            })),
          },
        },
        include: {
          images: true,
          variants: true,
          category: true,
        },
      });

      // Link collections if provided
      if (Array.isArray(collectionIds) && collectionIds.length > 0) {
        await tx.collectionProduct.createMany({
          data: collectionIds.map((colId: string) => ({
            collectionId: colId,
            productId: product.id,
          })),
        });
      }

      return product;
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        product: createdProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
