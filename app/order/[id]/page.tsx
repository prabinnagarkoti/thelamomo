"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function OrderTrackingPage() {
  const { id } = useParams() as { id: string };
  const { data: session } = useSession();
  const [order, setOrder] = useState<any>(null);
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchOrder = () => {
    fetch(`/api/orders?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setOrder(data); })
      .catch(() => {});
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 8000);
    return () => clearInterval(interval);
  }, [id]);

  const sendMessage = async () => {
    if (!msgText.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          message: msgText,
          sender: "customer"
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) setOrder(data.order);
        setMsgText("");
      }
    } catch {}
    setSending(false);
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-amber-400" />
        <p className="text-sm text-slate-400 mt-3">Loading your order...</p>
      </div>
    );
  }

  const statusConfig: Record<string, { icon: string; color: string; bg: string; desc: string }> = {
    "In Process": {
      icon: "fa-solid fa-clock",
      color: "text-amber-300",
      bg: "bg-amber-500/10 border-amber-400/30",
      desc: "Your order is being prepared"
    },
    Delivered: {
      icon: "fa-solid fa-circle-check",
      color: "text-emerald-300",
      bg: "bg-emerald-500/10 border-emerald-400/30",
      desc: "Your order has been delivered!"
    },
    Cancelled: {
      icon: "fa-solid fa-ban",
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-400/30",
      desc: "This order was cancelled"
    }
  };

  const sc = statusConfig[order.status] || statusConfig["In Process"];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/" className="text-xs text-slate-500 hover:text-amber-300 transition mb-6 inline-flex items-center gap-1">
        <i className="fa-solid fa-arrow-left" /> Back to store
      </Link>

      {/* Status Hero */}
      <div className={`${sc.bg} border rounded-2xl p-6 text-center mb-6`}>
        <i className={`${sc.icon} text-4xl ${sc.color} mb-3`} />
        <h1 className="text-xl font-bold font-display mb-1">
          Order #{id.slice(-6)}
        </h1>
        <p className={`text-lg font-semibold ${sc.color}`}>{order.status}</p>
        <p className="text-sm text-slate-400 mt-1">{sc.desc}</p>
      </div>

      {/* Order Details */}
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <i className="fa-solid fa-bag-shopping text-amber-400" />
          Order Details
        </h2>
        <div className="space-y-2 mb-4">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-sm py-1.5">
              <span>{item.qty}× {item.name}</span>
              <span className="text-amber-300">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-semibold border-t border-white/5 pt-2">
          <span>Total</span>
          <span className="text-amber-300">${order.total.toFixed(2)}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-400">
          <div>
            <p className="text-slate-600">Payment</p>
            <p>💵 Cash on Delivery</p>
          </div>
          <div>
            <p className="text-slate-600">Placed</p>
            <p>{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {session && (
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <i className="fa-solid fa-comments text-amber-400" />
            Messages
          </h2>
          <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
            {(order.messages || []).length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">
                No messages yet. Contact the store if you have questions.
              </p>
            )}
            {(order.messages || []).map((msg: any, i: number) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-sm max-w-[80%] ${
                  msg.sender === "customer"
                    ? "bg-amber-500/10 border border-amber-400/20 text-amber-200 ml-auto"
                    : "bg-slate-800 border border-white/5 text-slate-300"
                }`}
              >
                <p className="text-[10px] text-slate-500 mb-1">
                  {msg.sender === "customer" ? "You" : "Store"} •{" "}
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Send a message to the store..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/40 focus:outline-none transition"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !msgText.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm hover:bg-amber-500/30 transition disabled:opacity-40"
            >
              {sending ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-paper-plane" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
