"use client";
import { IMenuItem } from "@/models/MenuItem";
import { useCart } from "./CartSheet";
import { useSession } from "next-auth/react";

export default function MenuCard({ item }: { item: IMenuItem }) {
  const { addToCart } = useCart();
  const { data: session } = useSession();

  return (
    <div className="menu-card bg-slate-900/80 border border-white/5 rounded-3xl overflow-hidden group">
      <div className="relative overflow-hidden h-48">
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <i className="fa-solid fa-utensils text-3xl text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <p className="font-semibold">{item.name}</p>
        <p className="text-xs text-slate-400 mb-3">
          {item.description || "Freshly prepared"}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-amber-300">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={() =>
              addToCart(
                { id: (item as any)._id, name: item.name, price: item.price, qty: 1 },
                !!session
              )
            }
            className="px-4 py-2 bg-slate-950 border border-amber-400/40 text-xs rounded-full hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 transition-all duration-200 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-plus text-[10px]" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
