"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  _id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
  messages?: any[];
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
    .reduce((s, o) => s + (o.total || 0), 0);

  const recentMessages = orders
    .filter((o) => o.status === "In Process")
    .flatMap((o) => (o.messages || []).map((m: any) => ({ ...m, orderId: o._id, customerName: o.customerName })))
    .filter((m) => m.sender === "customer")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="glass rounded-2xl p-5 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-amber-400" />
              Recent Orders
            </h2>
            <Link href="/dashboard/orders" className="text-xs text-amber-300 hover:text-amber-200 transition">
              View all →
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <p className="text-slate-500 text-sm py-4 text-center">
                <i className="fa-solid fa-spinner fa-spin mr-2" /> Loading...
              </p>
            ) : orders.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">
                No orders yet.
              </p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-semibold text-slate-200">{order.customerName}</span>
                      <span className="text-amber-300 font-bold">${(order.total || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusDot status={order.status} />
                      <span className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="glass rounded-2xl p-5 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <i className="fa-solid fa-envelope text-amber-400" />
              New Messages
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <p className="text-slate-500 text-sm py-4 text-center">
                <i className="fa-solid fa-spinner fa-spin mr-2" /> Loading...
              </p>
            ) : recentMessages.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                <i className="fa-solid fa-inbox text-3xl mb-3 opacity-20 block" />
                <p className="text-sm">No new messages</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg: any, i) => (
                  <Link href={`/dashboard/orders?id=${msg.orderId}`} key={i} className="block p-3 bg-slate-900/60 rounded-xl border border-white/5 hover:border-amber-400/30 transition group">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px]">
                          <i className="fa-solid fa-user" />
                        </div>
                        <span className="text-xs font-semibold text-slate-200">{msg.customerName}</span>
                        {!msg.readByOwner && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 pl-7 line-clamp-2">{msg.text}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
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
