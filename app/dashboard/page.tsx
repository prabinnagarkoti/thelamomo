"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  _id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d) => setOrders(d.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCount = orders.filter((o) => o.status === "In Process").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;
  const totalRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold font-display mb-2">Dashboard Overview</h1>
      <p className="text-sm text-slate-400 mb-8">
        Quick snapshot of your business performance.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="fa-solid fa-clock"
          label="Active Orders"
          value={String(activeCount)}
          color="amber"
        />
        <StatCard
          icon="fa-solid fa-circle-check"
          label="Delivered"
          value={String(deliveredCount)}
          color="emerald"
        />
        <StatCard
          icon="fa-solid fa-ban"
          label="Cancelled"
          value={String(cancelledCount)}
          color="rose"
        />
        <StatCard
          icon="fa-solid fa-dollar-sign"
          label="Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/dashboard/orders"
          className="glass rounded-2xl p-6 hover:border-amber-400/30 transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <i className="fa-solid fa-receipt text-amber-400 text-lg" />
            </div>
            <div>
              <p className="font-semibold group-hover:text-amber-200 transition">
                Order Management
              </p>
              <p className="text-xs text-slate-400">
                View, track, and manage all orders
              </p>
            </div>
            <i className="fa-solid fa-arrow-right text-slate-600 group-hover:text-amber-400 ml-auto transition" />
          </div>
        </Link>
        <Link
          href="/dashboard/menu"
          className="glass rounded-2xl p-6 hover:border-amber-400/30 transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <i className="fa-solid fa-utensils text-emerald-400 text-lg" />
            </div>
            <div>
              <p className="font-semibold group-hover:text-amber-200 transition">
                Menu Items
              </p>
              <p className="text-xs text-slate-400">
                Add, edit, and manage menu items
              </p>
            </div>
            <i className="fa-solid fa-arrow-right text-slate-600 group-hover:text-amber-400 ml-auto transition" />
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-amber-400" />
            Recent Orders
          </h2>
          <Link href="/dashboard/orders" className="text-xs text-amber-300 hover:text-amber-200 transition">
            View all →
          </Link>
        </div>
        {loading ? (
          <p className="text-slate-500 text-sm py-4 text-center">
            <i className="fa-solid fa-spinner fa-spin mr-2" /> Loading...
          </p>
        ) : orders.length === 0 ? (
          <p className="text-slate-500 text-sm py-4 text-center">
            No orders yet. They will appear here when customers place orders.
          </p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{order.customerName}</span>
                  <StatusDot status={order.status} />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-amber-300 font-medium">
                    ${order.total.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    amber: "bg-amber-500/10 text-amber-400 border-amber-400/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-400/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-400/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-400/20"
  };
  return (
    <div className={`rounded-2xl border p-4 ${colors[color]}`}>
      <i className={`${icon} text-lg mb-2 block`} />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-70 mt-1">{label}</p>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const config: Record<string, string> = {
    "In Process": "bg-amber-400",
    Delivered: "bg-emerald-400",
    Cancelled: "bg-rose-400"
  };
  return (
    <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
      <span className={`w-1.5 h-1.5 rounded-full ${config[status] || "bg-slate-500"}`} />
      {status}
    </span>
  );
}
