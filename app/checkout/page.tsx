"use client";
import { useState, useRef } from "react";
import { useCart } from "@/components/CartSheet";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";

const CheckoutMap = dynamic(() => import("@/components/CheckoutMap"), {
  ssr: false,
  loading: () => <div className="h-56 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 text-xs shadow-inner mt-3"><i className="fa-solid fa-spinner fa-spin mr-2"/>Loading beautiful HD map...</div>
});

export default function CheckoutPage() {
  const { cart, clearCart, total } = useCart();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const onMapClick = async (lat: number, lng: number) => {
    setLocation({ lat, lng });
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch {
      // Silent fail
    }
  };

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchAddress = (query: string) => {
    setAddress(query);
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (query.length < 4) {
      setSearchResults([]);
      return;
    }
    
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=au&limit=4`);
        const data = await res.json();
        setSearchResults(data || []);
      } catch {
        // Silent fail
      } finally {
        setIsSearching(false);
      }
    }, 600);
  };

  const handleSelectResult = (result: any) => {
    setAddress(result.display_name);
    setLocation({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    setSearchResults([]);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, address: "Geolocation not supported" }));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
             setAddress(data.display_name);
             setErrors((prev) => ({ ...prev, address: "" }));
          }
        } catch {
          setErrors((prev) => ({ ...prev, address: "Location found, but couldn't get address name" }));
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setErrors((prev) => ({ ...prev, address: "Failed to get location. Check browser permissions." }));
      }
    );
  };

  // Require login to access checkout
  if (!session) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="glass rounded-3xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-user-lock text-2xl text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold font-display mb-3">
            Sign In Required
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            Please sign in or create an account to complete your order.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-xl text-sm font-semibold hover:brightness-110 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-amber-400/40 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="glass rounded-3xl p-8">
          <i className="fa-solid fa-cart-shopping text-4xl text-slate-700 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-sm text-slate-400 mb-6">
            Browse our menu to add some delicious items!
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-xl text-sm font-semibold hover:brightness-110 transition inline-block"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Invalid email";
    if (!phone.trim()) errs.phone = "Phone is required";
    if (!address.trim()) errs.address = "Delivery address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: (session.user as any)?.email || "guest",
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          customerAddress: address,
          customerLocation: location,
          items: cart,
          total,
          paymentMethod: "cod",
          notes
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.error || "Failed to place order. Please try again." });
        return;
      }
      clearCart();
      if (data.order?._id) {
        router.push(`/order/${data.order._id}`);
      } else {
        router.push("/");
      }
    } catch {
      setErrors({ submit: "Failed to place order. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold font-display mb-2">Checkout</h1>
      <p className="text-sm text-slate-400 mb-8">
        Review your order and complete your details.
      </p>

      {/* Order Summary */}
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <i className="fa-solid fa-bag-shopping text-amber-400" />
          Order Summary
        </h2>
        <div className="space-y-2 mb-4">
          {cart.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0"
            >
              <span>
                {item.qty}× {item.name}
              </span>
              <span className="text-amber-300">
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-amber-300">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Contact Details */}
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <i className="fa-solid fa-user text-amber-400" />
          Your Details
        </h2>
        <div className="space-y-3">
          <FormField value={name} onChange={setName} placeholder="Your name" error={errors.name} />
          <FormField value={email} onChange={setEmail} placeholder="Email" type="email" error={errors.email} />
          <FormField value={phone} onChange={setPhone} placeholder="Phone number" error={errors.phone} />
          
          <div className="relative">
            <div className="flex flex-col gap-2 mb-2">
              <div className="relative">
                <FormField value={address} onChange={searchAddress} placeholder="Search delivery address..." error={errors.address} icon="fa-solid fa-location-dot" />
                
                {/* Custom Autocomplete Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-100 mt-2 left-0 right-0 bg-slate-900 border border-white/10 shadow-2xl rounded-xl overflow-hidden z-20">
                    {searchResults.map((res: any, idx: number) => (
                      <div 
                        key={idx} 
                        onClick={() => handleSelectResult(res)}
                        className="px-4 py-3 text-xs border-b border-white/5 last:border-0 hover:bg-amber-500/10 cursor-pointer text-slate-300 transition"
                      >
                        <i className="fa-solid fa-location-dot text-amber-500/50 mr-2" />
                        {res.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                onClick={useCurrentLocation} 
                type="button"
                disabled={locating}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition disabled:opacity-50"
              >
                {locating ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-location-crosshairs" />}
                {locating ? "Locating..." : "Use Current Location"}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 ml-1 mb-2">Search for your address or move the pin exactly on your house.</p>
            <CheckoutMap location={location} onLocationSelect={onMapClick} />
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special instructions (optional)"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/40 focus:outline-none transition resize-none"
          />
        </div>
      </div>

      {/* Payment Method — COD Only */}
      <div className="glass rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <i className="fa-solid fa-money-bill-wave text-amber-400" />
          Payment Method
        </h2>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <span className="text-xl">💵</span>
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-200">Cash on Delivery (COD)</p>
            <p className="text-xs text-slate-400">Pay when your order arrives</p>
          </div>
          <i className="fa-solid fa-circle-check text-emerald-400 ml-auto" />
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-rose-300">
            <i className="fa-solid fa-circle-exclamation mr-2" />
            {errors.submit}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={placeOrder}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/30 hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-spinner fa-spin" /> Placing order...
          </span>
        ) : (
          `Place Order — $${total.toFixed(2)}`
        )}
      </button>
    </div>
  );
}

function FormField({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  icon
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
  icon?: string;
}) {
  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-sm focus:outline-none transition ${
          error
            ? "border-rose-500/50 focus:border-rose-400"
            : "border-white/10 focus:border-amber-400/40"
        }`}
      />
      {error && (
        <p className="text-xs text-rose-400 mt-1 ml-1">{error}</p>
      )}
    </div>
  );
}
