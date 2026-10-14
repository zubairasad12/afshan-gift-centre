import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        _count: {
          select: {
            collectionProducts: true,
          },
        },
      },
    });

    const formattedCollections = collections.map((col) => ({
      id: col.id,
      name: col.name,
      slug: col.slug,
      description: col.description,
      image: col.image,
      productCount: col._count.collectionProducts,
      createdAt: col.createdAt,
      updatedAt: col.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      collections: formattedCollections,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}
