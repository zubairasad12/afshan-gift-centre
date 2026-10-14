'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import { CURRENCY_SYMBOL, CONTACT_PHONE_FORMATTED } from '@/lib/constants';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  date: string;
  notes?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const mapped: OrderRecord[] = data.orders.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber || o.id,
          customerName: o.shippingName || o.user?.name || 'Walk-in Customer',
          email: o.email || '',
          phone: o.phone || 'Not Provided',
          city: o.shippingCity || 'Vehari',
          address: o.shippingAddress || '',
          items: (o.items || []).map((it: any) => ({
            id: it.id,
            name: it.productName || it.name || 'Gift Item',
            quantity: it.quantity || 1,
            price: it.price || 0,
          })),
          subtotal: o.subtotal || o.total,
          shipping: o.shippingFee || 0,
          total: o.total || 0,
          status: o.status || 'PENDING',
          paymentMethod: o.paymentMethod || 'Cash On Delivery',
          paymentStatus: o.paymentStatus || 'Pending',
          trackingNumber: o.trackingNumber,
          date: new Date(o.createdAt).toLocaleString('en-PK', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
          notes: o.notes,
        }));
        setOrders(mapped);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching live orders:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchStatus =
        selectedStatus === 'ALL' || ord.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.city.toLowerCase().includes(q) ||
        ord.phone.includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, selectedStatus, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderRecord['status']
  ) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast(`Order status updated to ${newStatus}`);
      } else {
        showToast(data.message || 'Failed to update order');
      }
    } catch {
      showToast('Error updating status');
    }
  };

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-[#FBEBEB] text-[#C75050] border-[#C75050]/20';
      case 'CONFIRMED':
        return 'bg-[#F5F0EB] text-[#8C6E48] border-[#B8956A]/30';
      case 'PROCESSING':
        return 'bg-[#FFF8E7] text-[#975A16] border-[#D69E2E]/30';
      case 'SHIPPED':
        return 'bg-[#EBF8FF] text-[#2B6CB0] border-[#3182CE]/30';
      case 'DELIVERED':
        return 'bg-[#EFF5F1] text-[#5A7A60] border-[#5A7A60]/30';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-500 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3D3229] text-white px-5 py-3 rounded-xl shadow-card flex items-center gap-2.5 text-xs sm:text-sm animate-fade-in border border-[#DDD1C2]">
          <CheckCircle2 className="w-4 h-4 text-[#B8956A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C]">
            Live Orders
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] mt-1">
            Real customer purchases placed through the website or checkout desk.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#DDD1C2] hover:bg-[#FAF7F4] text-xs font-semibold text-[#3D3229] rounded-xl transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="text-xs font-mono bg-white px-3.5 py-2 rounded-xl border border-[#EBE3D9] text-[#5E5E5E]">
            Orders in Store: <strong className="text-[#2C2C2C]">{filteredOrders.length}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EBE3D9] shadow-subtle space-y-4">
        {/* Status Tab Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(
            (st) => {
              const isActive = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#3D3229] text-white shadow-subtle'
                      : 'bg-[#FAF7F4] text-[#5E5E5E] border border-[#DDD1C2] hover:bg-[#F5F0EB]'
                  }`}
                >
                  {st}
                </button>
              );
            }
          )}
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, phone number, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDD1C2] text-xs sm:text-sm bg-[#FAFAF7] focus:bg-white focus:outline-none focus:border-[#B8956A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#757575] hover:text-[#2C2C2C]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#EBE3D9] shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#DDD1C2] text-[11px] uppercase tracking-wider text-[#757575] bg-[#FAF7F4]">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total (PKR)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE3D9]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#757575]">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#B8956A]" />
                      Loading live orders...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F4]/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-medium text-[#2C2C2C]">
                      {ord.orderNumber}
                      <span className="block text-[11px] text-[#757575] font-sans">
                        {ord.date}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#2C2C2C]">{ord.customerName}</div>
                      <div className="text-[11px] text-[#757575] font-mono">{ord.phone}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs text-[#4D4D4D]">
                        <MapPin className="w-3 h-3 text-[#B8956A]" />
                        {ord.city}
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-[220px] truncate text-xs text-[#5E5E5E]">
                      {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ') || 'No items'}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#2C2C2C] whitespace-nowrap">
                      {CURRENCY_SYMBOL} {ord.total.toLocaleString()}
                      <span className="block text-[10px] text-[#757575] font-normal">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveOrder(ord)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3D3229] hover:bg-[#2A221B] text-white text-xs font-medium transition-colors shadow-subtle"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#B8956A]" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-[#757575]">
                    <ShoppingBag className="w-10 h-10 mx-auto text-[#DDD1C2] mb-3" />
                    <p className="font-medium text-sm text-[#2C2C2C]">No orders placed yet</p>
                    <p className="text-xs text-[#8C7E72] mt-1 max-w-sm mx-auto">
                      Whenever a customer completes checkout or places an order, it will appear here instantly.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#DDD1C2] shadow-card overflow-hidden my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 bg-[#FAF7F4] border-b border-[#EBE3D9] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl font-bold text-[#2C2C2C]">
                    Order: {activeOrder.orderNumber}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                      activeOrder.status
                    )}`}
                  >
                    {activeOrder.status}
                  </span>
                </div>
                <div className="text-xs text-[#757575] flex items-center gap-2 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-[#B8956A]" />
                  <span>Placed on {activeOrder.date}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-1 rounded-lg text-[#757575] hover:text-[#2C2C2C] hover:bg-[#EBE3D9]/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF7F4] p-4 rounded-xl border border-[#EBE3D9]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#757575] tracking-wider block mb-1">
                    Customer Info
                  </span>
                  <div className="font-semibold text-sm text-[#2C2C2C]">
                    {activeOrder.customerName}
                  </div>
                  <div className="text-xs text-[#5E5E5E] font-mono mt-0.5">
                    {activeOrder.phone}
                  </div>
                  {activeOrder.email && (
                    <div className="text-xs text-[#5E5E5E]">{activeOrder.email}</div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#757575] tracking-wider block mb-1">
                    Shipping Destination
                  </span>
                  <div className="text-xs text-[#2C2C2C] flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B8956A] shrink-0 mt-0.5" />
                    <span>
                      {activeOrder.address || 'Address not specified'}, {activeOrder.city}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#757575] mt-1.5 font-medium">
                    Method: {activeOrder.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Items Purchased */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#757575] tracking-wider block mb-2">
                  Purchased Items
                </span>
                <div className="border border-[#EBE3D9] rounded-xl overflow-hidden divide-y divide-[#EBE3D9]">
                  {activeOrder.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 flex items-center justify-between bg-white text-xs"
                    >
                      <div>
                        <div className="font-semibold text-[#2C2C2C]">{item.name}</div>
                        <div className="text-[11px] text-[#757575]">
                          Quantity: <strong>{item.quantity}</strong>
                        </div>
                      </div>
                      <div className="text-right font-mono font-semibold text-[#2C2C2C]">
                        {CURRENCY_SYMBOL} {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}

                  <div className="p-3.5 bg-[#FAF7F4] space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#757575]">
                      <span>Subtotal</span>
                      <span className="font-mono">
                        {CURRENCY_SYMBOL} {activeOrder.subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#757575]">
                      <span>Delivery Charges</span>
                      <span className="font-mono">
                        {activeOrder.shipping === 0 ? 'FREE' : `${CURRENCY_SYMBOL} ${activeOrder.shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-[#2C2C2C] pt-2 border-t border-[#DDD1C2]">
                      <span>Total Amount</span>
                      <span className="font-mono text-[#B8956A]">
                        {CURRENCY_SYMBOL} {activeOrder.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2 pt-2 border-t border-[#EBE3D9]">
                <span className="text-[10px] uppercase font-bold text-[#757575] tracking-wider block">
                  Update Order Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => updateOrderStatus(activeOrder.id, st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activeOrder.status === st
                            ? 'bg-[#B8956A] text-white shadow-subtle'
                            : 'bg-white border border-[#DDD1C2] text-[#4D4D4D] hover:bg-[#FAF7F4]'
                        }`}
                      >
                        Mark as {st}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF7F4] border-t border-[#EBE3D9] flex justify-between items-center">
              <a
                href={`tel:${activeOrder.phone}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6E48] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Customer ({activeOrder.phone})
              </a>

              <button
                onClick={() => setActiveOrder(null)}
                className="px-4 py-2 rounded-lg bg-[#3D3229] hover:bg-[#2A221B] text-white text-xs font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
