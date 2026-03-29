"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationBell() {
  const [unreadMsg, setUnreadMsg] = useState(0);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.orders) {
          const active = data.orders.filter((o: any) => o.status === "In Process");
          setNewOrders(active.length);

          let msgs = 0;
          active.forEach((o: any) => {
            msgs += (o.messages || []).filter(
              (m: any) => m.sender === "customer" && !m.readByOwner
            ).length;
          });
          setUnreadMsg(msgs);
        }
      } catch {}
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const total = unreadMsg + newOrders;

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard/orders"
        className="relative p-2.5 text-slate-400 hover:text-amber-300 transition group rounded-xl hover:bg-slate-800/50 flex items-center justify-center"
      >
        <i className="fa-solid fa-bell text-lg group-hover:-rotate-12 transition transform origin-top" />
        {total > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] items-center justify-center font-bold text-white border border-slate-900 leading-none">
              {total > 9 ? "9+" : total}
            </span>
          </span>
        )}
      </Link>
    </div>
  );
}
