"use client";
import { useEffect, useState } from "react";
import MenuCard from "@/components/MenuCard";
import { IMenuItem } from "@/models/MenuItem";
import { useCart } from "@/components/CartSheet";

interface Config {
  restaurantName: string;
  tagline?: string;
  primaryColor: string;
  heroSubtitle?: string;
  aboutText?: string;
  address?: string;
  phone?: string;
  email?: string;
  operatingHours?: string;
  badge1?: string;
  badge2?: string;
  badge3?: string;
  logoUrl?: string;
}

export default function Home() {
  const [menu, setMenu] = useState<IMenuItem[]>([]);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [menuRes, configRes] = await Promise.all([
          fetch("/api/menu").then((r) => (r.ok ? r.json() : { menu: [] })),
          fetch("/api/menu/config").then((r) => (r.ok ? r.json() : { config: null }))
        ]);
        if (menuRes.menu) {
          setMenu(menuRes.menu.filter((i: IMenuItem) => i.available));
        }
        if (configRes.config) {
          setConfig(configRes.config);
        }
      } catch {
        // API unavailable — page renders with defaults
      }
    };
    loadData();
  }, []);

  const highlights = menu.slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="hero-bg min-h-[85vh] flex items-center relative overflow-hidden">
        {/* Animated floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400/30 rounded-full animate-float" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-rose-400/20 rounded-full animate-float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-amber-300/25 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-orange-400/30 rounded-full animate-float-delayed" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div className="animate-slide-up">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs uppercase tracking-[0.2em] text-amber-200">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Now Accepting Orders
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-6 leading-tight">
              {config?.restaurantName || "BizMenu Builder"} —{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                Delicious
              </span>{" "}
              Food, Delivered Fresh.
            </h1>
            <p className="mt-5 text-slate-200 text-sm md:text-base max-w-xl leading-relaxed">
              {config?.heroSubtitle ||
                "Fresh, handcrafted dishes made with love. Order online for pickup or delivery — quality food at your fingertips."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#menu-section"
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 px-7 py-3.5 rounded-full text-sm font-semibold shadow-lg shadow-amber-500/40 flex items-center gap-2 hover:brightness-110 hover:shadow-xl hover:shadow-amber-500/50 transition-all duration-300"
              >
                <i className="fa-solid fa-utensils" />
                Browse Menu
              </a>
              <button
                onClick={() => document.getElementById("cart-open-btn")?.click()}
                className="px-6 py-3.5 rounded-full border border-white/20 bg-black/40 text-sm flex items-center gap-2 hover:border-amber-300 hover:text-amber-200 hover:bg-black/60 transition-all duration-300"
              >
                <i className="fa-solid fa-bag-shopping" />
                View Cart
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-slate-300">
              <Badge
                icon="fa-solid fa-leaf"
                text={config?.badge1 || "Fresh Ingredients"}
              />
              <Badge
                icon="fa-solid fa-bolt"
                text={config?.badge2 || "Fast Preparation"}
              />
              <Badge
                icon="fa-solid fa-star"
                text={config?.badge3 || "Top Rated"}
              />
            </div>
          </div>
          <div className="hidden md:block animate-slide-up-delayed">
            <div className="glass rounded-3xl p-6 shadow-2xl border border-amber-400/20">
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-fire text-amber-400" />
                Popular Right Now
                <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Live
                </span>
              </h2>
              {highlights.length > 0 ? (
                highlights.map((item: any) => (
                  <HighlightRow
                    key={item._id}
                    item={item}
                  />
                ))
              ) : (
                <div className="py-8 text-center text-slate-500 text-sm">
                  <i className="fa-solid fa-utensils text-2xl mb-2 block" />
                  Menu items will appear here
                </div>
              )}
              <p className="mt-4 text-xs text-slate-400 flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-amber-300" />
                Order now — fast preparation guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu-section" className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 animate-fade-in">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-amber-300 mb-2">
              Our Menu
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Today&apos;s Selection
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Every dish is made to order with the freshest ingredients.
              Quality over quantity — always.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 flex items-center gap-2">
              <i className="fa-solid fa-check" /> Live availability
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {menu.map((item) => (
            <MenuCard key={(item as any)._id} item={item} />
          ))}
        </div>
        {menu.length === 0 && (
          <div className="text-center py-20">
            <i className="fa-solid fa-utensils text-4xl text-slate-800 mb-4" />
            <p className="text-slate-500">
              No menu items available yet. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="border-t border-white/5 bg-gradient-to-b from-slate-950 to-slate-900"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-amber-300 mb-2">
              Our Story
            </p>
            <h3 className="font-display text-3xl font-semibold mb-4">
              Crafted with passion, served with pride.
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {config?.aboutText ||
                "We are passionate about bringing you the best dining experience. Every dish is crafted with care using the freshest ingredients, honoring traditional recipes while embracing modern techniques."}
            </p>
            <ul className="text-sm text-slate-300 space-y-3">
              <li className="flex gap-3 items-start">
                <span className="text-emerald-400 mt-0.5">
                  <i className="fa-solid fa-circle-check" />
                </span>
                Fresh, locally sourced ingredients every day.
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-emerald-400 mt-0.5">
                  <i className="fa-solid fa-circle-check" />
                </span>
                Made to order — never pre-cooked or reheated.
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-emerald-400 mt-0.5">
                  <i className="fa-solid fa-circle-check" />
                </span>
                Dietary options available for all preferences.
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Placeholder cards instead of broken Unsplash images */}
            <div className="rounded-3xl overflow-hidden border border-white/10 h-72 bg-gradient-to-br from-amber-500/10 via-slate-900 to-rose-500/10 flex items-center justify-center">
              <div className="text-center">
                <i className="fa-solid fa-fire-burner text-4xl text-amber-400/40 mb-2" />
                <p className="text-xs text-slate-500">Fresh from our kitchen</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden border border-white/10 h-32 bg-gradient-to-br from-rose-500/10 via-slate-900 to-amber-500/10 flex items-center justify-center">
                <div className="text-center">
                  <i className="fa-solid fa-pepper-hot text-2xl text-rose-400/40 mb-1" />
                  <p className="text-[10px] text-slate-500">Bold flavors</p>
                </div>
              </div>
              <div className="glass rounded-3xl p-4 h-36 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-400">Featured Experience</p>
                  <p className="text-sm font-semibold mt-1">Chef&apos;s Special</p>
                  <p className="text-xs text-slate-400">
                    Ask about today&apos;s special selection
                  </p>
                </div>
                <p className="text-lg font-semibold text-amber-300">
                  <i className="fa-solid fa-sparkles text-sm" /> Daily
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-amber-300 mb-1">
                Testimonials
              </p>
              <h3 className="font-display text-2xl font-semibold">
                What our customers say
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-xs">
              We obsess over every detail so your experience is always
              exceptional.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 text-sm">
            <ReviewCard
              rating="5.0 • Verified"
              quote="Best food ordering experience I've had. The quality is consistently amazing and the interface makes ordering so easy!"
              author="Alex M."
            />
            <ReviewCard
              rating="4.9 • Regular"
              quote="We order every week. They always get it right and the food arrives fresh. Can't recommend enough!"
              author="Sarah & James"
            />
            <ReviewCard
              rating="4.8 • First Timer"
              quote="Pleasantly surprised by the quality. The menu is curated perfectly — every item is a winner."
              author="Michael R."
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-slate-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.25em] uppercase text-amber-300 mb-2">
              Get In Touch
            </p>
            <h3 className="font-display text-2xl font-semibold">
              Visit us or order ahead
            </h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <ContactCard
              icon="fa-solid fa-location-dot"
              title="Location"
              lines={[config?.address || "123 Main Street, Your City"]}
            />
            <ContactCard
              icon="fa-solid fa-clock"
              title="Hours"
              lines={[config?.operatingHours || "Mon–Sun: 11:00am – 10:00pm"]}
            />
            <ContactCard
              icon="fa-solid fa-phone"
              title="Contact"
              lines={[
                config?.phone || "+1 (555) 000-0000",
                config?.email || "hello@yourbusiness.com"
              ]}
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()}{" "}
            {config?.restaurantName || "BizMenu Builder"}. Powered by{" "}
            <span className="text-amber-400/60">BizMenu Builder</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Badge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-7 w-7 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-300 text-sm">
        <i className={icon} />
      </span>
      <span>{text}</span>
    </div>
  );
}

function HighlightRow({
  item
}: {
  item: any;
}) {
  const { addToCart } = useCart();
  
  return (
    <div className="flex justify-between items-center text-sm py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition px-2 -mx-2 rounded-lg group">
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-bowl-food text-amber-400/50 text-sm" />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-medium truncate">{item.name}</p>
          <p className="text-xs text-slate-400 truncate">{item.description || "Freshly prepared"}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <p className="font-semibold text-amber-300">${item.price.toFixed(2)}</p>
        <button
          onClick={() => addToCart({ id: item._id, name: item.name, price: item.price, img: item.img })}
          className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center hover:bg-amber-400 hover:text-slate-900 transition-colors"
          title="Add to cart"
        >
          <i className="fa-solid fa-plus text-xs" />
        </button>
      </div>
    </div>
  );
}

function ReviewCard({
  rating,
  quote,
  author
}: {
  rating: string;
  quote: string;
  author: string;
}) {
  return (
    <div className="glass rounded-3xl p-6 hover:border-amber-400/20 transition-colors duration-300">
      <div className="flex items-center gap-1 text-amber-300 text-xs mb-3">
        {[...Array(5)].map((_, i) => (
          <i key={i} className="fa-solid fa-star" />
        ))}
        <span className="text-slate-400 ml-2">{rating}</span>
      </div>
      <p className="text-slate-200 mb-4 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <p className="text-xs text-slate-400 font-medium">— {author}</p>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  lines
}: {
  icon: string;
  title: string;
  lines: string[];
}) {
  return (
    <div className="glass rounded-3xl p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
        <i className={`${icon} text-amber-400`} />
      </div>
      <p className="font-medium text-sm mb-2">{title}</p>
      {lines.map((line) => (
        <p key={line} className="text-xs text-slate-400">
          {line}
        </p>
      ))}
    </div>
  );
}
