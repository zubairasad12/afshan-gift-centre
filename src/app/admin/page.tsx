'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Package,
  TrendingUp,
  ArrowRight,
  Plus,
  Eye,
  CheckCircle2,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { CURRENCY_SYMBOL, CONTACT_PHONE_FORMATTED } from '@/lib/constants';

interface AnalyticsStats {
  totalRevenue: number;
  orderCount: number;
  productsCount: number;
  customersCount: number;
  ordersByStatus: Record<string, number>;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  shippingName?: string;
  email?: string;
  phone?: string;
  status: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  _count?: { items: number };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalSales = stats?.totalRevenue || 0;
  const totalOrders = stats?.orderCount || 0;
  const pendingOrders = stats?.ordersByStatus?.['PENDING'] || 0;
  const inStockProducts = stats?.productsCount || 0;

  const kpiMetrics = [
    {
      title: 'Total Sales',
      value: `${CURRENCY_SYMBOL} ${totalSales.toLocaleString()}`,
      change: totalSales > 0 ? 'Live store revenue' : 'Awaiting first sales',
      isPositive: totalSales > 0,
      icon: DollarSign,
      color: 'text-[#B8956A]',
      bg: 'bg-[#B8956A]/10',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: `${totalOrders} orders placed`,
      isPositive: true,
      icon: ShoppingBag,
      color: 'text-[#5A7A60]',
      bg: 'bg-[#5A7A60]/10',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.toString(),
      change: pendingOrders > 0 ? 'Requires confirmation' : 'All clear',
      isAlert: pendingOrders > 0,
      icon: Clock,
      color: 'text-[#C75050]',
      bg: 'bg-[#C75050]/10',
    },
    {
      title: 'Active Products',
      value: inStockProducts.toString(),
      change: 'Catalog items live',
      icon: Package,
      color: 'text-[#3D3229]',
      bg: 'bg-[#3D3229]/10',
    },
  ];

  const getStatusBadge = (status: string) => {
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#2C2C2C] to-[#3D3229] text-white p-6 sm:p-8 rounded-2xl shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#D8C3A8] font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-[#5A7A60] animate-pulse" />
            Vehari Showroom Store Manager
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Afshan Gift Centre Portal
          </h1>
          <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl">
            Live operations overview. Only genuine customer purchases and real products are tracked.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B8956A] hover:bg-[#A07F56] text-white text-xs font-semibold shadow-subtle transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpiMetrics.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EBE3D9] shadow-subtle hover:shadow-card transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#757575]">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2C] tracking-tight">
                {isLoading ? '...' : kpi.value}
              </div>

              <div className="mt-2 text-xs flex items-center gap-1.5 text-[#5E5E5E]">
                {kpi.isAlert ? (
                  <span className="text-[#C75050] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {kpi.change}
                  </span>
                ) : (
                  <span>{kpi.change}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table Section */}
      <div className="bg-white rounded-2xl border border-[#EBE3D9] shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-[#EBE3D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2C2C2C]">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-[#757575] mt-0.5">
              Live purchases from customers on your website
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6E48] hover:text-[#2C2C2C] transition-colors"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#DDD1C2] text-[11px] uppercase tracking-wider text-[#757575] bg-[#FAF7F4]">
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Items</th>
                <th className="py-3 px-6">Total (PKR)</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE3D9]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[#757575]">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#B8956A]" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F4]/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-[#2C2C2C]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#2C2C2C]">
                        {ord.shippingName || 'Customer'}
                      </div>
                      <div className="text-[11px] text-[#757575] font-mono">
                        {ord.phone || ord.email || ''}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#5E5E5E] whitespace-nowrap">
                      {new Date(ord.createdAt).toLocaleDateString('en-PK', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-6 text-xs text-[#5E5E5E]">
                      {ord._count?.items || 1} item(s)
                    </td>
                    <td className="py-4 px-6 font-bold text-[#2C2C2C]">
                      {CURRENCY_SYMBOL} {ord.total.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FAF7F4] hover:bg-[#F5F0EB] text-[#2C2C2C] border border-[#DDD1C2] text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3 h-3 text-[#B8956A]" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#757575]">
                    <ShoppingBag className="w-8 h-8 mx-auto text-[#DDD1C2] mb-2" />
                    <p className="font-medium text-xs text-[#2C2C2C]">No orders placed yet</p>
                    <p className="text-[11px] text-[#8C7E72] mt-0.5">
                      Customer checkouts on the store will reflect here live.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
