import React from 'react';
import { prisma } from '@/lib/prisma';
import HomePageClient from './HomePageClient';
import { Product } from '@/types/product';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let bestSellers: Product[] = [];
  let newArrivals: Product[] = [];

  try {
    // 1. Fetch live products from database
    const dbFeatured = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 8,
      include: {
        images: { orderBy: { position: 'asc' } },
        category: true,
        variants: { where: { isActive: true } },
      },
    });

    if (dbFeatured.length > 0) {
      bestSellers = dbFeatured.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription || undefined,
        sku: p.sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        isFeatured: p.isFeatured,
        isActive: p.isActive,
        isOnSale: p.isOnSale,
        material: p.material || undefined,
        dimensions: p.dimensions || undefined,
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          altText: img.alt || p.name,
          isPrimary: img.isPrimary,
        })),
        variants: p.variants.map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
        })),
        category: p.category
          ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
          : undefined,
        createdAt: p.createdAt.toISOString(),
      }));
    }

    // 2. Fetch new arrivals (latest created)
    const dbNew = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: {
        images: { orderBy: { position: 'asc' } },
        category: true,
        variants: { where: { isActive: true } },
      },
    });

    if (dbNew.length > 0) {
      newArrivals = dbNew.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription || undefined,
        sku: p.sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        isFeatured: p.isFeatured,
        isActive: p.isActive,
        isOnSale: p.isOnSale,
        material: p.material || undefined,
        dimensions: p.dimensions || undefined,
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          altText: img.alt || p.name,
          isPrimary: img.isPrimary,
        })),
        variants: p.variants.map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
        })),
        category: p.category
          ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
          : undefined,
        createdAt: p.createdAt.toISOString(),
      }));
    }
  } catch (err) {
    console.error('Error fetching live products for homepage:', err);
  }

  return (
    <HomePageClient
      bestSellers={bestSellers}
      newArrivals={newArrivals}
    />
  );
}
