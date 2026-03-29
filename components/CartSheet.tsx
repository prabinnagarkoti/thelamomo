"use client";
import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Item = { id: string; name: string; price: number; qty: number };

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [authPrompt, setAuthPrompt] = useState(false);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (item: Item, isLoggedIn: boolean) => {
    if (!isLoggedIn) {
      setAuthPrompt(true);
      setOpen(true);
      return;
    }
    setAuthPrompt(false);
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, item];
    });
    setOpen(true);
  };
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const changeQty = (id: string, d: number) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + d) } : i))
        .filter((i) => i.qty > 0)
    );
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, changeQty, open, setOpen, total, clearCart, authPrompt, setAuthPrompt }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

export default function CartSheet() {
  const { cart, open, setOpen, total, removeFromCart, changeQty, authPrompt, setAuthPrompt } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-end z-50">
      <div className="bg-slate-950 h-full w-full max-w-md border-l border-white/5 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold font-display">Your Cart</h2>
          <button onClick={() => { setOpen(false); setAuthPrompt(false); }} className="text-sm text-slate-400 hover:text-white transition">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Auth Required Prompt */}
        {authPrompt && !session && (
          <div className="mb-4 bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <i className="fa-solid fa-user-lock text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-200">Sign in required</p>
                <p className="text-xs text-slate-400">Please sign in or register to add items to your cart</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setOpen(false); setAuthPrompt(false); router.push("/login"); }}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-xl text-sm font-semibold hover:brightness-110 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => { setOpen(false); setAuthPrompt(false); router.push("/register"); }}
                className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm hover:border-amber-400/40 transition"
              >
                Register
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto flex-1">
          {cart.map((item: Item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-slate-900 border border-white/5 p-3 rounded-xl text-sm"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-slate-400">
                  ${item.price.toFixed(2)} × {item.qty}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQty(item.id, -1)}
                  className="w-7 h-7 border border-slate-600 rounded-full flex items-center justify-center hover:border-amber-400 hover:text-amber-300 transition"
                >
                  -
                </button>
                <span className="text-xs w-4 text-center">{item.qty}</span>
                <button
                  onClick={() => changeQty(item.id, 1)}
                  className="w-7 h-7 border border-slate-600 rounded-full flex items-center justify-center hover:border-amber-400 hover:text-amber-300 transition"
                >
                  +
                </button>
                <button onClick={() => removeFromCart(item.id)} className="text-rose-400 text-xs ml-2 hover:text-rose-300 transition">
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && !authPrompt && (
            <div className="text-center py-12">
              <i className="fa-solid fa-cart-shopping text-3xl text-slate-700 mb-3" />
              <p className="text-slate-500 text-sm">Your cart is empty</p>
              <p className="text-slate-600 text-xs mt-1">Browse the menu to add items</p>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-white/5 pt-4">
            <div className="text-sm flex justify-between mb-4">
              <span className="text-slate-400">Total</span>
              <span className="font-semibold text-amber-300 text-lg">${total.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="block w-full text-center py-3.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-xl font-semibold shadow-lg shadow-amber-500/30 hover:brightness-110 transition"
              onClick={() => setOpen(false)}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
