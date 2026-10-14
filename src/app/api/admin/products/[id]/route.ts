import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const {
      name,
      description,
      shortDescription,
      sku,
      price,
      compareAtPrice,
      categoryId,
      isFeatured,
      isActive,
      isOnSale,
      material,
      dimensions,
      weight,
      tags,
      images,
      variants,
    } = body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Update basic fields
      const p = await tx.product.update({
        where: { id },
        data: {
          name: name ?? existing.name,
          description: description !== undefined ? description : existing.description,
          shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
          sku: sku ?? existing.sku,
          price: price !== undefined ? parseFloat(String(price)) : existing.price,
          compareAtPrice: compareAtPrice ? parseFloat(String(compareAtPrice)) : null,
          categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
          isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
          isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
          isOnSale: isOnSale !== undefined ? Boolean(isOnSale) : existing.isOnSale,
          material: material !== undefined ? material : existing.material,
          dimensions: dimensions !== undefined ? dimensions : existing.dimensions,
          weight: weight !== undefined ? weight : existing.weight,
          tags: tags !== undefined ? tags : existing.tags,
        },
      });

      // If images provided, replace
      if (Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img: { url: string; alt?: string; position?: number; isPrimary?: boolean }, index: number) => ({
              productId: id,
              url: img.url,
              alt: img.alt || p.name,
              position: img.position ?? index,
              isPrimary: img.isPrimary ?? index === 0,
            })),
          });
        }
      }

      // If variants provided, replace
      if (Array.isArray(variants)) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((v: { name: string; sku?: string; price?: number; compareAtPrice?: number; stock?: number; isActive?: boolean }, idx: number) => ({
              productId: id,
              name: v.name,
              sku: v.sku || `${p.sku}-V${idx + 1}`,
              price: v.price ? parseFloat(String(v.price)) : p.price,
              compareAtPrice: v.compareAtPrice ? parseFloat(String(v.compareAtPrice)) : null,
              stock: v.stock !== undefined ? parseInt(String(v.stock), 10) : 0,
              isActive: v.isActive ?? true,
            })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: { orderBy: { position: 'asc' } },
          variants: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully in database',
      product: updated,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted permanently from database',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
