import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

    if (!q) {
      return NextResponse.json({
        success: true,
        query: '',
        suggestions: [],
        products: [],
        total: 0,
      });
    }

    const [products, matchingCategories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { tags: { contains: q } },
            { material: { contains: q } },
            { sku: { contains: q } },
          ],
        },
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
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
            take: 1,
          },
        },
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: q },
        },
        select: {
          name: true,
          slug: true,
        },
        take: 5,
      }),
    ]);

    // Build unique search suggestions
    const suggestionSet = new Set<string>();

    for (const cat of matchingCategories) {
      suggestionSet.add(cat.name);
    }

    for (const prod of products) {
      suggestionSet.add(prod.name);
      if (prod.tags) {
        prod.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.toLowerCase().includes(q.toLowerCase()))
          .forEach((t) => suggestionSet.add(t));
      }
    }

    const suggestions = Array.from(suggestionSet).slice(0, 8);

    return NextResponse.json({
      success: true,
      query: q,
      suggestions,
      products,
      total: products.length,
    });
  } catch (error) {
    console.error('Error handling search request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process search query' },
      { status: 500 }
    );
  }
}
