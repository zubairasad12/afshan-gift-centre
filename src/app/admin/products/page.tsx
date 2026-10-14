'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload,
  RefreshCw,
  ImageIcon,
  Eye,
  Check,
} from 'lucide-react';
import { CURRENCY_SYMBOL } from '@/lib/constants';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductVariant {
  id?: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
}

interface ProductImage {
  id?: string;
  url: string;
  alt?: string;
  position?: number;
  isPrimary?: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId?: string | null;
  category?: Category | null;
  stock?: number;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  material?: string | null;
  dimensions?: string | null;
  shortDescription?: string | null;
  description: string;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCompareAt, setFormCompareAt] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formStock, setFormStock] = useState('10');
  const [formMaterial, setFormMaterial] = useState('');
  const [formDimensions, setFormDimensions] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsOnSale, setFormIsOnSale] = useState(false);

  // Images state (URLs)
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Products & Categories from Database
  const fetchProducts = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/products?limit=100');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setErrorMsg(data.message || 'Failed to load products');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error connecting to database');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`AGC-${Date.now().toString().slice(-5)}`);
    setFormPrice('');
    setFormCompareAt('');
    setFormCategoryId(categories[0]?.id || '');
    setFormStock('15');
    setFormMaterial('');
    setFormDimensions('');
    setFormShortDesc('');
    setFormDesc('');
    setFormIsActive(true);
    setFormIsFeatured(false);
    setFormIsOnSale(false);
    setImageUrls([]);
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormPrice(String(p.price));
    setFormCompareAt(p.compareAtPrice ? String(p.compareAtPrice) : '');
    setFormCategoryId(p.categoryId || '');
    setFormStock(String(p.variants?.[0]?.stock ?? 10));
    setFormMaterial(p.material || '');
    setFormDimensions(p.dimensions || '');
    setFormShortDesc(p.shortDescription || '');
    setFormDesc(p.description || '');
    setFormIsActive(p.isActive);
    setFormIsFeatured(p.isFeatured);
    setFormIsOnSale(p.isOnSale);
    setImageUrls(p.images.map((img) => img.url));
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  // Upload Local Image File
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImageUrls((prev) => [...prev, data.url]);
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Upload failed. Please check network.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Image URL Manually
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImageUrls((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // Remove Image
  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save Product (Create or Update) to Database
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim() || !formPrice) {
      alert('Please fill product Name, SKU, and Price.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      name: formName.trim(),
      sku: formSku.trim(),
      price: parseFloat(formPrice),
      compareAtPrice: formCompareAt ? parseFloat(formCompareAt) : null,
      categoryId: formCategoryId || null,
      material: formMaterial.trim() || null,
      dimensions: formDimensions.trim() || null,
      shortDescription: formShortDesc.trim() || null,
      description: formDesc.trim() || formShortDesc.trim() || formName.trim(),
      isActive: formIsActive,
      isFeatured: formIsFeatured,
      isOnSale: formIsOnSale,
      images: imageUrls.map((url, idx) => ({
        url,
        alt: `${formName} photo ${idx + 1}`,
        position: idx,
        isPrimary: idx === 0,
      })),
      variants: [
        {
          name: 'Standard',
          sku: `${formSku.trim()}-STD`,
          price: parseFloat(formPrice),
          compareAtPrice: formCompareAt ? parseFloat(formCompareAt) : null,
          stock: parseInt(formStock || '0', 10),
          isActive: true,
        },
      ],
    };

    try {
      if (editingProduct) {
        // Update existing product
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg(`"${formName}" updated permanently in database!`);
          setIsModalOpen(false);
          fetchProducts();
        } else {
          alert(data.message || 'Failed to update product');
        }
      } else {
        // Create new product
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg(`"${formName}" saved to database and live on website!`);
          setIsModalOpen(false);
          fetchProducts();
        } else {
          alert(data.message || 'Failed to create product');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product to server');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Product Permanently
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`"${name}" deleted from database.`);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting product');
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category?.name && p.category.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || p.categoryId === selectedCategory;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.isActive) ||
        (statusFilter === 'inactive' && !p.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C]">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Add new gift products, upload photos, edit prices & stock. Saved items persist permanently in the database.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
            title="Refresh Catalog from Database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2C2C2C] hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
          </span>
          <button onClick={() => setSuccessMsg(null)}>
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> {errorMsg}
          </span>
          <button onClick={() => setErrorMsg(null)}>
            <X className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by title, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#B8956A]"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#B8956A] bg-white"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#B8956A] bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Visible)</option>
            <option value="inactive">Draft / Hidden</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F0EB] text-[#2C2C2C] uppercase font-semibold tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="px-4 py-3.5">Product & Photo</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Price (PKR)</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-stone-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B8956A]" />
                    Loading products from database...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-stone-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const primaryImg = p.images?.[0]?.url;
                  const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                            {primaryImg ? (
                              <Image
                                src={primaryImg}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-300">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 block line-clamp-1">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              Slug: /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
                          {p.category?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-stone-500">
                        {p.sku}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-stone-900">
                          {CURRENCY_SYMBOL} {p.price.toLocaleString()}
                        </span>
                        {p.compareAtPrice && (
                          <span className="block text-[10px] text-stone-400 line-through">
                            {CURRENCY_SYMBOL} {p.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            totalStock > 5
                              ? 'text-emerald-700'
                              : totalStock > 0
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {p.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={`/products/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-stone-400 hover:text-stone-700 rounded transition-colors"
                            title="View on Website"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 text-stone-500 text-[11px] flex justify-between items-center">
          <span>Total Products in Database: <strong>{products.length}</strong></span>
          <span>Showing: {filteredProducts.length}</span>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-stone-200 flex items-center justify-between z-10">
              <h2 className="font-serif text-lg font-bold text-[#2C2C2C]">
                {editingProduct ? 'Edit Product' : 'Add New Gift Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 text-xs">
              {/* Product Title */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Handcrafted Mother of Pearl Inlaid Tissue Box"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#B8956A]"
                />
              </div>

              {/* SKU & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. AGC-TB-001"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#B8956A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white focus:outline-none focus:border-[#B8956A]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Compare Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Selling Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="3450"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#B8956A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formCompareAt}
                    onChange={(e) => setFormCompareAt(e.target.value)}
                    placeholder="4200 (for discount badge)"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#B8956A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="15"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#B8956A]"
                  />
                </div>
              </div>

              {/* Photos Management */}
              <div className="p-4 bg-[#F5F0EB]/60 rounded-xl border border-stone-200 space-y-3">
                <label className="block font-semibold text-stone-800">
                  Product Photos (File Upload or Image URL)
                </label>
                
                {/* File Upload Trigger */}
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-300 rounded-lg hover:border-stone-400 font-medium text-stone-700 transition-colors shadow-xs"
                  >
                    <Upload className="w-4 h-4 text-[#B8956A]" />
                    {isUploading ? 'Uploading...' : 'Upload Photo from Computer'}
                  </button>

                  <span className="text-stone-400">or</span>

                  <div className="flex-1 flex gap-2 min-w-[240px]">
                    <input
                      type="url"
                      placeholder="Paste Image URL (https://...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 border border-stone-300 rounded-lg bg-white text-xs focus:outline-none focus:border-[#B8956A]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-[#2C2C2C] text-white rounded-lg hover:bg-black font-semibold shrink-0"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Previews Grid */}
                {imageUrls.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-lg bg-stone-200 overflow-hidden border border-stone-300"
                      >
                        <Image
                          src={url}
                          alt={`Upload ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-[#B8956A] text-white text-[9px] font-bold rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-400 italic">
                    No photos added yet. Upload files or paste links to display on the storefront.
                  </p>
                )}
              </div>

              {/* Material & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Material / Craftsmanship
                  </label>
                  <input
                    type="text"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    placeholder="e.g. Natural Wood, Mother-of-Pearl Inlay"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#B8956A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Dimensions & Size
                  </label>
                  <input
                    type="text"
                    value={formDimensions}
                    onChange={(e) => setFormDimensions(e.target.value)}
                    placeholder='e.g. 10" L x 5.5" W x 3.5" H'
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#B8956A]"
                  />
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Short Description (Summary)
                </label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="One sentence summary for product cards"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#B8956A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Full Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detailed product story, finish, packaging and gifting advice..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#B8956A]"
                />
              </div>

              {/* Status Toggles */}
              <div className="flex flex-wrap gap-6 pt-2 border-t border-stone-200">
                <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="rounded text-[#B8956A] focus:ring-[#B8956A]"
                  />
                  <span>Active on Storefront</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-[#B8956A] focus:ring-[#B8956A]"
                  />
                  <span>Featured (Homepage Best Sellers)</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formIsOnSale}
                    onChange={(e) => setFormIsOnSale(e.target.checked)}
                    className="rounded text-[#B8956A] focus:ring-[#B8956A]"
                  />
                  <span>Mark as Sale Item</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#2C2C2C] hover:bg-black text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
                >
                  {isSaving ? 'Saving to Database...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
