import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import { Product } from '@/types/product';
import { SITE_NAME } from '@/lib/constants';

interface ProductPageProps {
  params: {
    slug: string;
  };
}


export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const slug = params.slug.toLowerCase();

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { name: true, shortDescription: true, description: true },
    });

    if (product) {
      return {
        title: `${product.name} | ${SITE_NAME}`,
        description: product.shortDescription || product.description.slice(0, 160),
      };
    }
  } catch (err) {
    // continue to fallback
  }

  const formattedName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${formattedName} | ${SITE_NAME}`,
    description: `Shop ${formattedName} at Afshan Gift Centre Vehari. Premium furniture and home decor with nationwide delivery in Pakistan.`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const slug = params.slug.toLowerCase();

  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: { where: { isActive: true } },
        category: true,
      },
    });

    if (dbProduct) {
      product = {
        id: dbProduct.id,
        name: dbProduct.name,
        slug: dbProduct.slug,
        description: dbProduct.description,
        shortDescription: dbProduct.shortDescription || undefined,
        sku: dbProduct.sku,
        price: dbProduct.price,
        compareAtPrice: dbProduct.compareAtPrice,
        isFeatured: dbProduct.isFeatured,
        isActive: dbProduct.isActive,
        isOnSale: dbProduct.isOnSale,
        material: dbProduct.material || undefined,
        dimensions: dbProduct.dimensions || undefined,
        stock: 10,
        images: dbProduct.images.map((img) => ({
          id: img.id,
          url: img.url,
          altText: img.alt || dbProduct.name,
          isPrimary: img.isPrimary,
        })),
        variants: dbProduct.variants.map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
        })),
        category: dbProduct.category
          ? {
              id: dbProduct.category.id,
              name: dbProduct.category.name,
              slug: dbProduct.category.slug,
            }
          : undefined,
        createdAt: dbProduct.createdAt.toISOString(),
      };

      // Fetch related products in same category
      const rawRelated = await prisma.product.findMany({
        where: {
          isActive: true,
          id: { not: dbProduct.id },
          ...(dbProduct.categoryId ? { categoryId: dbProduct.categoryId } : {}),
        },
        take: 4,
        include: {
          images: { orderBy: { position: 'asc' } },
          category: true,
          variants: true,
        },
      });

      relatedProducts = rawRelated.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
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
          stock: v.stock,
        })),
        category: p.category
          ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
          : undefined,
        createdAt: p.createdAt.toISOString(),
      }));
    }
  } catch (error) {
    console.error('Error fetching product from Prisma:', error);
  }

  // If not found in DB, return 404
  if (!product) {
    notFound();
  }

  // If no related products, fetch any 4 general products
  if (relatedProducts.length === 0) {
    try {
      const fallbackRelated = await prisma.product.findMany({
        where: { isActive: true },
        take: 4,
        include: {
          images: { orderBy: { position: 'asc' } },
          category: true,
          variants: true,
        },
      });

      if (fallbackRelated.length > 0) {
        relatedProducts = fallbackRelated.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
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
            stock: v.stock,
          })),
          category: p.category
            ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
            : undefined,
          createdAt: p.createdAt.toISOString(),
        }));
      }
    } catch {
      // ignore
    }
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
