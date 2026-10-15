'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  PhoneCall,
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  Info,
} from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';
import { useToast } from '@/components/ui/Toast';
import ProductCard from '@/components/product/ProductCard';
import Badge from '@/components/ui/Badge';
import { CONTACT_PHONE_FORMATTED } from '@/lib/constants';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { success } = useToast();

  const isFavorited = isInWishlist(product.id);

  // Gallery state
  const images = product.images && product.images.length > 0
    ? product.images
    : [
        {
          id: 'default-img',
          url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
          altText: product.name,
          isPrimary: true,
        },
      ];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant state
  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );

  // Quantity state
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'dimensions' | 'delivery'>('details');

  // Compute active price & compare price based on variant or base product
  const activePrice = selectedVariant?.price ?? product.price;
  const activeCompareAt = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const activeSku = selectedVariant?.sku || product.sku;
  const discountPercent =
    activeCompareAt && activeCompareAt > activePrice
      ? getDiscountPercentage(activePrice, activeCompareAt)
      : 0;

  const currentStock = selectedVariant?.stock ?? product.stock ?? 15;
  const isOutOfStock = currentStock <= 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const updated = prev + delta;
      if (updated < 1) return 1;
      if (updated > currentStock) return currentStock;
      return updated;
    });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const cartId = selectedVariant
      ? `${product.id}-${selectedVariant.id}`
      : `${product.id}-default`;

    addItem(
      {
        id: cartId,
        productId: product.id,
        variantId: selectedVariant?.id,
        name: product.name,
        slug: product.slug,
        price: activePrice,
        compareAtPrice: activeCompareAt,
        image: images[selectedImageIndex]?.url || images[0].url,
        variantName: selectedVariant?.name,
        material: product.material,
        maxStock: currentStock,
      },
      quantity
    );

    success(`Added ${quantity} × "${product.name}" to cart`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    handleAddToCart();
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Afshan Gift Centre`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-stone-200/80 bg-white py-3">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap">
            <li>
              <Link href="/" className="hover:text-[#B8956A] transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <li>
              <Link href="/collections" className="hover:text-[#B8956A] transition-colors">
                Collections
              </Link>
            </li>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <li>
                  <Link
                    href={`/collections/${product.category.slug}`}
                    className="hover:text-[#B8956A] transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <li className="font-semibold text-[#2C2C2C] truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main PDP Content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[580px] shrink-0 pb-2 md:pb-0 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 md:w-24 md:h-28 bg-stone-100 border-2 transition-all shrink-0 overflow-hidden ${
                      selectedImageIndex === idx
                        ? 'border-[#B8956A] ring-1 ring-[#B8956A]'
                        : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.altText || `${product.name} thumbnail ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'; }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Primary Image */}
            <div className="relative flex-1 aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] bg-stone-100 overflow-hidden border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedImageIndex]?.url || images[0].url}
                alt={images[selectedImageIndex]?.altText || product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'; }}
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isOnSale && discountPercent > 0 && (
                  <Badge variant="sale">-{discountPercent}% OFF</Badge>
                )}
                {product.isFeatured && <Badge variant="accent">FEATURED</Badge>}
                {isOutOfStock && <Badge variant="sold-out">OUT OF STOCK</Badge>}
              </div>

              {/* Wishlist & Share buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  type="button"
                  onClick={() => toggleItem(product)}
                  aria-label="Save to Wishlist"
                  className="p-3 bg-white/90 backdrop-blur-xs text-[#2C2C2C] hover:text-[#C75050] shadow-sm transition-all rounded-full hover:scale-105"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorited ? 'fill-[#C75050] text-[#C75050]' : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  className="p-3 bg-white/90 backdrop-blur-xs text-[#2C2C2C] hover:text-[#B8956A] shadow-sm transition-all rounded-full hover:scale-105"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Purchase Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Category & Title */}
            {product.category && (
              <Link
                href={`/collections/${product.category.slug}`}
                className="text-xs uppercase tracking-widest text-[#B8956A] font-semibold hover:underline mb-2 inline-block"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2C2C2C] tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* SKU and In Stock status */}
            <div className="flex items-center gap-4 text-xs text-stone-500 mt-2.5">
              <span>SKU: <strong className="text-stone-700">{activeSku}</strong></span>
              <span className="w-1 h-1 bg-stone-300 rounded-full" />
              <span className="flex items-center gap-1 font-medium text-[#5A7A60]">
                <Check className="w-3.5 h-3.5" />
                {currentStock > 5 ? 'In Stock (Vehari Warehouse)' : `Only ${currentStock} left in stock`}
              </span>
            </div>

            {/* Price section */}
            <div className="mt-5 p-4 bg-[#F5F0EB]/60 border border-stone-200/60 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#2C2C2C]">
                {formatPrice(activePrice)}
              </span>
              {activeCompareAt && activeCompareAt > activePrice && (
                <span className="text-base text-stone-400 line-through">
                  {formatPrice(activeCompareAt)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-semibold text-[#C75050] bg-white px-2 py-0.5 border border-[#C75050]/20 ml-auto">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="mt-4 text-stone-600 text-sm leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Variant Selector (if available) */}
            {variants.length > 0 && (
              <div className="mt-6 border-t border-stone-200 pt-5">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#2C2C2C] mb-2.5">
                  Select Finish / Option: <span className="text-[#B8956A] font-normal">{selectedVariant?.name}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 text-xs font-medium border transition-all ${
                          isSelected
                            ? 'border-[#2C2C2C] bg-[#2C2C2C] text-white ring-1 ring-[#2C2C2C]'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="mt-6 border-t border-stone-200 pt-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#2C2C2C] shrink-0">
                  Quantity:
                </label>
                <div className="inline-flex items-center border border-stone-300 bg-white">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || isOutOfStock}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-stone-600 hover:text-black hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-[#2C2C2C] select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= currentStock || isOutOfStock}
                    aria-label="Increase quantity"
                    className="p-2.5 text-stone-600 hover:text-black hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#2C2C2C] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-[#B8956A]" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#B8956A] hover:bg-[#A07F56] text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Direct WhatsApp Inquiry */}
              <a
                href={`https://wa.me/923001005861?text=Hi%20Afshan%20Gift%20Centre,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20(SKU:%20${activeSku})`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] text-xs font-semibold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Inquire on WhatsApp (0300 1005861)</span>
              </a>
            </div>

            {/* Delivery & Assurance Guarantees */}
            <div className="mt-8 bg-white border border-stone-200/80 p-5 space-y-4 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#B8956A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#2C2C2C]">Vehari Local & Nationwide Delivery</h4>
                  <p className="mt-0.5 text-stone-500 leading-relaxed">
                    Same-day / 24-hr delivery in Vehari city. Safely crated insured shipping across all cities in Pakistan. Free shipping on orders over Rs. 10,000.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#B8956A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#2C2C2C]">Authentic Quality Guarantee</h4>
                  <p className="mt-0.5 text-stone-500 leading-relaxed">
                    Every item is crafted from genuine premium materials — from hand-hammered brass and kiln-fired ceramics to mother-of-pearl inlays and fluted glass. Backed by Afshan Gift Centre quality assurance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-[#B8956A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#2C2C2C]">Cash on Delivery Available</h4>
                  <p className="mt-0.5 text-stone-500 leading-relaxed">
                    Inspect your package at doorstep in Vehari, Lahore, Karachi, Islamabad & nationwide with hassle-free COD.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications & Tabs */}
        <div className="mt-16 border-t border-stone-200 pt-10">
          <div className="flex border-b border-stone-200 gap-8">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-colors border-b-2 ${
                activeTab === 'details'
                  ? 'border-[#B8956A] text-[#2C2C2C]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Description & Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dimensions')}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-colors border-b-2 ${
                activeTab === 'dimensions'
                  ? 'border-[#B8956A] text-[#2C2C2C]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Dimensions & Materials
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('delivery')}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-colors border-b-2 ${
                activeTab === 'delivery'
                  ? 'border-[#B8956A] text-[#2C2C2C]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Delivery & Care Policy
            </button>
          </div>

          <div className="py-6 text-sm text-stone-600 leading-relaxed">
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-4xl">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 bg-white p-6 border border-stone-200/80">
                  <div>
                    <span className="text-xs uppercase text-stone-400 tracking-wider block">SKU Code</span>
                    <span className="font-semibold text-[#2C2C2C]">{activeSku}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-stone-400 tracking-wider block">Origin</span>
                    <span className="font-semibold text-[#2C2C2C]">Handcrafted in Vehari, Punjab</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-stone-400 tracking-wider block">Primary Material</span>
                    <span className="font-semibold text-[#2C2C2C]">{product.material || 'Premium Artisan Materials'}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-stone-400 tracking-wider block">Packaging</span>
                    <span className="font-semibold text-[#2C2C2C]">Gift-ready with fragile-safe cushioning</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dimensions' && (
              <div className="max-w-2xl bg-white p-6 border border-stone-200/80">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="py-2.5 font-semibold text-stone-700 w-1/3">Dimensions</td>
                      <td className="py-2.5 text-[#2C2C2C]">{product.dimensions || 'Custom standard specifications'}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-stone-700">Material & Finish</td>
                      <td className="py-2.5 text-[#2C2C2C]">{product.material || 'Premium artisan materials — see product description'}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-stone-700">Care Instructions</td>
                      <td className="py-2.5 text-stone-600">Wipe clean with a dry microfibre cloth. Avoid direct sunlight and harsh chemical sprays.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-3 max-w-3xl">
                <p>
                  <strong>Vehari City Orders:</strong> Free store pickup or same-day express local delivery from our Club Road showroom.
                </p>
                <p>
                  <strong>Nationwide Shipments:</strong> Dispatched within 24–48 hours via registered cargo/couriers (TCS / Leopard). Deliveries to Lahore, Multan, Faisalabad, and Islamabad typically take 2–3 business days. Karachi and other regional zones take 3–5 business days.
                </p>
                <p>
                  <strong>Questions?</strong> Call our helpline directly at <strong>0300 1005861</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-stone-200 pt-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[#B8956A] text-xs uppercase tracking-widest font-semibold block mb-2">
                Curated Additions
              </span>
              <h2 className="font-serif text-3xl font-semibold text-[#2C2C2C] tracking-tight">
                You May Also Like
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
