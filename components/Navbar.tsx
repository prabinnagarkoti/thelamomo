"use client";
import Link from "next/link";
import { useCart } from "./CartSheet";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { cart, setOpen } = useCart();
  const { data: session } = useSession();
  const isOwner = (session?.user as any)?.role === "owner";
  const count = cart.reduce((s: number, i: any) => s + i.qty, 0);
  const [config, setConfig] = useState<{
    restaurantName: string;
    tagline?: string;
    logoUrl?: string;
  } | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/menu/config")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.config) setConfig(d.config); })
      .catch(() => {})
      .finally(() => setLoadingConfig(false));
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`backdrop-blur-md border-b sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 border-white/10 shadow-lg shadow-black/20"
          : "bg-slate-950/70 border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {loadingConfig ? (
            <div className="h-11 w-11 rounded-2xl bg-white/5 animate-pulse" />
          ) : config?.logoUrl ? (
            <img
              src={config.logoUrl}
              alt="Logo"
              className="h-11 w-11 rounded-2xl object-cover shadow-lg"
            />
          ) : (
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/40">
              🍽️
            </div>
          )}
          <div>
            {loadingConfig ? (
               <div className="h-6 w-32 bg-white/5 rounded animate-pulse mb-1" />
            ) : (
              <Link href="/" className="font-display text-2xl font-semibold tracking-tight hover:text-amber-200 transition">
                {config?.restaurantName || "BizMenu Builder"}
              </Link>
            )}
            {loadingConfig ? (
               <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
            ) : (
              <p className="text-xs text-slate-400">
                {config?.tagline || "Your Digital Menu, Your Rules"}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-4 items-center text-sm">
          {!isOwner && (
            <>
              <Link href="#menu-section" className="hidden md:inline hover:text-amber-300 transition">
                Menu
              </Link>
              <Link href="#about" className="hidden md:inline hover:text-amber-300 transition">
                About
              </Link>
              <Link href="#contact" className="hidden md:inline hover:text-amber-300 transition">
                Visit
              </Link>
            </>
          )}

          {session ? (
            <>
              {(session.user as any)?.role === "owner" && (
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 px-4 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-amber-500/40 hover:brightness-110 transition"
                >
                  Dashboard
                </Link>
              )}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-slate-500">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-amber-300 border border-white/10 rounded-full hover:border-amber-400/30 transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2.5 border border-white/10 rounded-full text-sm hover:border-amber-400/40 hover:text-amber-200 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-full text-sm font-semibold shadow-lg shadow-amber-500/30 hover:brightness-110 transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {!isOwner && (
            <button
              id="cart-open-btn"
              onClick={() => setOpen(true)}
              className="relative px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-full flex items-center gap-2 text-sm hover:border-amber-400 hover:text-amber-200 transition"
            >
              <span className="text-lg">🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="ml-1 text-xs bg-amber-500 text-slate-950 rounded-full px-2 py-0.5 font-semibold">
                  {count}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
