"use client";
import { useEffect, useState } from "react";

interface Order {
  _id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  items: Array<{ name: string; price: number; qty: number }>;
  total: number;
  paymentMethod: string;
  status: "In Process" | "Delivered" | "Cancelled";
  notes?: string;
  messages?: Array<{ sender: string; text: string; createdAt: string; readByOwner?: boolean }>;
  createdAt: string;
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"active" | "history">("active");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = orders.filter((o) => o.status === "In Process");
  const historyOrders = orders.filter((o) => o.status === "Delivered" || o.status === "Cancelled");
  const displayOrders = tab === "active" ? activeOrders : historyOrders;

  const updateStatus = async (id: string, status: Order["status"]) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, status })
    });
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status } : o))
    );
    if (selectedOrder?._id === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleSelectOrder = async (order: Order) => {
    setSelectedOrder(order);
    const hasUnread = order.messages?.some((m) => m.sender === "customer" && !m.readByOwner);
    if (hasUnread) {
      try {
        await fetch("/api/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order._id, markMessagesRead: true })
        });
        const updatedMessages = order.messages?.map(m => ({ ...m, readByOwner: true }));
        setOrders(prev => prev.map(o => o._id === order._id ? { ...o, messages: updatedMessages } : o));
        setSelectedOrder(prev => prev ? { ...prev, messages: updatedMessages } : null);
      } catch {}
    }
  };

  const sendMessage = async () => {
    if (!msgText.trim() || !selectedOrder) return;
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          message: msgText,
          sender: "owner"
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setSelectedOrder(data.order);
          setOrders((prev) =>
            prev.map((o) => (o._id === data.order._id ? data.order : o))
          );
        }
        setMsgText("");
      }
    } catch {}
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-slate-400">
        <i className="fa-solid fa-spinner fa-spin" /> Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Order Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track, manage, and communicate with customers about their orders.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300">
            {activeOrders.length} Active
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-700/50 border border-slate-600/30 text-slate-400">
            {historyOrders.length} History
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setTab("active"); setSelectedOrder(null); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
            tab === "active"
              ? "bg-amber-500/20 border border-amber-400/40 text-amber-200"
              : "bg-slate-900 border border-white/5 text-slate-400 hover:border-white/20"
          }`}
        >
          <i className="fa-solid fa-clock mr-2" />
          Active Orders
        </button>
        <button
          onClick={() => { setTab("history"); setSelectedOrder(null); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
            tab === "history"
              ? "bg-slate-600/30 border border-slate-500/40 text-slate-200"
              : "bg-slate-900 border border-white/5 text-slate-400 hover:border-white/20"
          }`}
        >
          <i className="fa-solid fa-clock-rotate-left mr-2" />
          Order History
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Orders List */}
        <div className={`space-y-3 ${selectedOrder ? "lg:col-span-2" : "lg:col-span-5"}`}>
          {displayOrders.map((order) => (
            <div
              key={order._id}
              onClick={() => handleSelectOrder(order)}
              className={`bg-slate-900/80 border rounded-xl p-4 cursor-pointer transition hover:border-amber-400/30 ${
                selectedOrder?._id === order._id
                  ? "border-amber-400/50 bg-slate-900"
                  : "border-white/5"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{order.customerName}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-slate-400">{order.customerPhone}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-300">
                    ${(order.total || 0).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {tab === "active" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); updateStatus(order._id, "Delivered"); }}
                    className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full hover:bg-emerald-500/30 transition"
                  >
                    <i className="fa-solid fa-check mr-1" /> Mark Delivered
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); updateStatus(order._id, "Cancelled"); }}
                    className="px-3 py-1.5 text-xs bg-rose-500/10 text-rose-400 border border-rose-400/20 rounded-full hover:bg-rose-500/20 transition"
                  >
                    <i className="fa-solid fa-xmark mr-1" /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
          {displayOrders.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <i className={`fa-solid ${tab === "active" ? "fa-inbox" : "fa-clock-rotate-left"} text-3xl mb-3 block`} />
              <p>{tab === "active" ? "No active orders" : "No order history yet"}</p>
            </div>
          )}
        </div>

        {/* Order Detail Panel */}
        {selectedOrder && (
          <div className="lg:col-span-3 space-y-4">
            {/* Order Info */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold font-display flex items-center gap-2">
                  <i className="fa-solid fa-receipt text-amber-400" />
                  Order #{selectedOrder._id.slice(-6)}
                </h2>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                  <p>{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <p>{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Payment</p>
                  <p className="text-emerald-300">💵 Cash on Delivery</p>
                </div>
                {selectedOrder.customerAddress && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-0.5">Delivery Address</p>
                    <p className="flex items-start gap-1.5">
                      <i className="fa-solid fa-location-dot text-amber-400 mt-0.5" />
                      {selectedOrder.customerAddress}
                    </p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="border-t border-white/5 pt-3">
                <p className="text-xs text-slate-500 mb-2">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1.5">
                    <span>{item.qty}× {item.name}</span>
                    <span className="text-amber-300">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-sm pt-2 border-t border-white/5 mt-2">
                  <span>Total</span>
                  <span className="text-amber-300">${(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-3 p-3 rounded-lg bg-slate-800/50 text-xs">
                  <p className="text-slate-500 mb-1">Customer Notes</p>
                  <p className="text-slate-300">{selectedOrder.notes}</p>
                </div>
              )}

              <p className="text-[10px] text-slate-600 mt-3">
                Placed: {new Date(selectedOrder.createdAt).toLocaleString()} • ID: {selectedOrder._id}
              </p>
            </div>

            {/* Owner Actions */}
            {selectedOrder.status === "In Process" && (
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-sliders text-amber-400" />
                  Actions
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedOrder._id, "Delivered")}
                    className="flex-1 py-3 rounded-xl text-sm font-medium bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 transition flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-circle-check" /> Mark as Delivered
                  </button>
                  <button
                    onClick={() => updateStatus(selectedOrder._id, "Cancelled")}
                    className="py-3 px-5 rounded-xl text-sm bg-rose-500/10 border border-rose-400/20 text-rose-400 hover:bg-rose-500/20 transition flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-ban" /> Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Google Maps Embed */}
            {selectedOrder.customerAddress && (
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-map-location-dot text-amber-400" />
                  Delivery Location
                </h3>
                <div className="rounded-xl overflow-hidden border border-white/10 h-48">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(selectedOrder.customerAddress)}`}
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedOrder.customerAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs hover:bg-blue-500/20 transition"
                >
                  <i className="fa-solid fa-diamond-turn-right" />
                  Open in Google Maps (Directions)
                </a>
              </div>
            )}

            {/* Messaging */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <i className="fa-solid fa-comments text-amber-400" />
                Messages
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
                {(selectedOrder.messages || []).length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">
                    No messages yet. Send a message to the customer.
                  </p>
                )}
                {(selectedOrder.messages || []).map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-sm max-w-[80%] ${
                      msg.sender === "owner"
                        ? "bg-amber-500/10 border border-amber-400/20 text-amber-200 ml-auto"
                        : "bg-slate-800 border border-white/5 text-slate-300"
                    }`}
                  >
                    <p className="text-[10px] text-slate-500 mb-1">
                      {msg.sender === "owner" ? "You" : selectedOrder.customerName} •{" "}
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
                  placeholder="Type a message to the customer..."
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
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    "In Process": {
      bg: "bg-amber-500/15 border-amber-400/30",
      text: "text-amber-300",
      icon: "fa-solid fa-clock"
    },
    Delivered: {
      bg: "bg-emerald-500/15 border-emerald-400/30",
      text: "text-emerald-300",
      icon: "fa-solid fa-circle-check"
    },
    Cancelled: {
      bg: "bg-rose-500/15 border-rose-400/30",
      text: "text-rose-400",
      icon: "fa-solid fa-ban"
    }
  };
  const c = config[status] || config["In Process"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${c.bg} ${c.text}`}>
      <i className={c.icon} style={{ fontSize: "8px" }} />
      {status}
    </span>
  );
}
