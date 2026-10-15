import React from 'react';
import Link from 'next/link';
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
  } catch {
    // ignore
  }

  return {
    title: `Product Details | ${SITE_NAME}`,
    description: 'Explore handcrafted luxury gift items at Afshan Gift Centre Vehari.',
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
        images: {
          orderBy: { position: 'asc' },
        },
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
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

      // 1. Fetch related products in the same category
      if (dbProduct.categoryId) {
        const rawRelated = await prisma.product.findMany({
          where: {
            isActive: true,
            id: { not: dbProduct.id },
            categoryId: dbProduct.categoryId,
          },
          take: 4,
          orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
          include: {
            images: { orderBy: { position: 'asc' } },
            category: true,
            variants: { where: { isActive: true } },
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

      // 2. If fewer than 4 related in same category, supplement with featured gift items from catalogue
      if (relatedProducts.length < 4) {
        const excludeIds = [dbProduct.id, ...relatedProducts.map((p) => p.id)];
        const needed = 4 - relatedProducts.length;

        const extraProducts = await prisma.product.findMany({
          where: {
            isActive: true,
            id: { notIn: excludeIds },
          },
          take: needed,
          orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
          include: {
            images: { orderBy: { position: 'asc' } },
            category: true,
            variants: { where: { isActive: true } },
          },
        });

        const mappedExtra: Product[] = extraProducts.map((p) => ({
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

        relatedProducts = [...relatedProducts, ...mappedExtra];
      }
    }
  } catch (error) {
    console.error('Error fetching product from Prisma:', error);
  }

  // If not found in DB, return 404
  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
