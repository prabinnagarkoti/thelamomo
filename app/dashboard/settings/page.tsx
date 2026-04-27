"use client";
import { useEffect, useState, useRef } from "react";

interface Config {
  restaurantName: string;
  themeMode: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  tagline: string;
  heroSubtitle: string;
  aboutText: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  badge1: string;
  badge2: string;
  badge3: string;
  logoUrl: string;
}

const THEME_PRESETS = [
  { id: "midnight", name: "Midnight Orange", primary: "#f59e0b", secondary: "#e11d48", background: "#020617", fontFamily: "inter" },
  { id: "ocean", name: "Ocean Glow", primary: "#0ea5e9", secondary: "#8b5cf6", background: "#082f49", fontFamily: "inter" },
  { id: "forest", name: "Deep Forest", primary: "#10b981", secondary: "#f59e0b", background: "#064e3b", fontFamily: "mono" },
  { id: "sunset", name: "Sunset Rose", primary: "#f43f5e", secondary: "#f97316", background: "#2a1525", fontFamily: "playfair" },
  { id: "carbon", name: "Sleek Carbon", primary: "#f8fafc", secondary: "#94a3b8", background: "#0f172a", fontFamily: "inter" }
];

export default function SettingsPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/menu/config")
      .then((res) => res.json())
      .then((data) => setConfig(data.config));
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setConfig((prev) => (prev ? { ...prev, logoUrl: data.url } : prev));
        showToast("Logo uploaded!", "success");
      }
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await fetch("/api/menu/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      showToast("Settings saved successfully!", "success");
    } catch {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!config)
    return (
      <div className="flex items-center gap-3 text-slate-400">
        <i className="fa-solid fa-spinner fa-spin" /> Loading settings...
      </div>
    );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Restaurant Settings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize your storefront — every change is updated in real time.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/30 hover:brightness-110 transition disabled:opacity-60"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-spinner fa-spin" /> Saving...
            </span>
          ) : (
            "Save Settings"
          )}
        </button>
      </div>

      <div className="space-y-8">
        {/* Logo Upload */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-image text-amber-400" />
            Logo
          </h2>
          <div className="flex items-center gap-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/20 hover:border-amber-400/50 transition cursor-pointer overflow-hidden flex items-center justify-center bg-slate-900/60"
            >
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <i className="fa-solid fa-cloud-arrow-up text-xl text-slate-600" />
                  <p className="text-[9px] text-slate-600 mt-1">Upload</p>
                </div>
              )}
            </div>
            <div className="text-sm">
              <p className="text-slate-300 mb-1">Upload your restaurant logo</p>
              <p className="text-xs text-slate-500">
                PNG, JPG, or SVG. Recommended 200×200px.
              </p>
              {uploading && (
                <p className="text-xs text-amber-300 mt-2">
                  <i className="fa-solid fa-spinner fa-spin mr-1" />
                  Uploading...
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Branding */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-store text-amber-400" />
            Branding
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Restaurant Name"
              value={config.restaurantName}
              onChange={(v) => setConfig({ ...config, restaurantName: v })}
            />
            <Field
              label="Tagline"
              value={config.tagline}
              onChange={(v) => setConfig({ ...config, tagline: v })}
            />
          </div>
          <div className="mt-4">
            <Field
              label="Hero Subtitle"
              value={config.heroSubtitle}
              onChange={(v) => setConfig({ ...config, heroSubtitle: v })}
              textarea
            />
          </div>
        </div>

        {/* Display & Typography */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-desktop text-amber-400" />
            Display Modes & Typography
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-slate-400 mb-2">Lighting Engine</label>
              <div className="flex bg-slate-900/50 rounded-xl p-1 gap-1 border border-white/5">
                <button 
                  onClick={() => setConfig({ ...config, themeMode: 'dark' })} 
                  className={`flex-1 flex items-center justify-center gap-2 text-xs py-2 rounded-lg transition-all ${config.themeMode !== 'light' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  <i className="fa-solid fa-moon" /> System Dark
                </button>
                <button 
                  onClick={() => setConfig({ ...config, themeMode: 'light' })} 
                  className={`flex-1 flex items-center justify-center gap-2 text-xs py-2 rounded-lg transition-all ${config.themeMode === 'light' ? 'bg-slate-200 text-slate-900 shadow font-semibold' : 'text-slate-400 hover:text-white'}`}
                >
                  <i className="fa-solid fa-sun" /> Projector (Light)
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Activate projector mode when presenting on ultra-bright screens or whiteboards.</p>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2">Global Font Configuration</label>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => setConfig({ ...config, fontFamily: 'inter' })} className={`flex items-center justify-between px-4 py-2 border rounded-lg text-xs ${config.fontFamily === 'inter' || !config.fontFamily ? 'border-amber-400 bg-amber-400/10 text-white' : 'border-white/10 hover:border-white/30 text-slate-300'} transition-all`} style={{ fontFamily: 'system-ui' }}>
                  Modern Sans (Inter) {(!config.fontFamily || config.fontFamily === 'inter') && <i className="fa-solid fa-check text-amber-400" />}
                </button>
                <button onClick={() => setConfig({ ...config, fontFamily: 'playfair' })} className={`flex items-center justify-between px-4 py-2 border rounded-lg text-xs ${config.fontFamily === 'playfair' ? 'border-amber-400 bg-amber-400/10 text-white' : 'border-white/10 hover:border-white/30 text-slate-300'} transition-all`} style={{ fontFamily: 'var(--font-display), serif' }}>
                  Elegant Serif (Playfair) {config.fontFamily === 'playfair' && <i className="fa-solid fa-check text-amber-400" />}
                </button>
                <button onClick={() => setConfig({ ...config, fontFamily: 'mono' })} className={`flex items-center justify-between px-4 py-2 border rounded-lg text-xs ${config.fontFamily === 'mono' ? 'border-amber-400 bg-amber-400/10 text-white' : 'border-white/10 hover:border-white/30 text-slate-300'} transition-all`} style={{ fontFamily: 'monospace' }}>
                  System Minimal (Mono) {config.fontFamily === 'mono' && <i className="fa-solid fa-check text-amber-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Themes */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-palette text-amber-400" />
            Website Theme Overrides
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {THEME_PRESETS.map((theme) => {
              const isActive = 
                config.primaryColor === theme.primary && 
                config.secondaryColor === theme.secondary && 
                config.backgroundColor === theme.background;

              return (
                <div 
                  key={theme.id}
                  onClick={() => setConfig({ ...config, primaryColor: theme.primary, secondaryColor: theme.secondary, backgroundColor: theme.background, fontFamily: theme.fontFamily })}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}
                >
                  <div className="h-20 w-full relative" style={{ backgroundColor: theme.background }}>
                    <div className="absolute inset-0 opacity-50 bg-gradient-to-tr" style={{ backgroundImage: `linear-gradient(to top right, ${theme.secondary}, transparent)` }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: theme.primary, border: `1px solid ${theme.primary}` }}>
                      Preview
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{theme.name}</p>
                      <div className="flex gap-1 mt-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.secondary }} />
                        <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: theme.background }} />
                      </div>
                    </div>
                    {isActive && <i className="fa-solid fa-circle-check text-amber-400" />}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-xs text-slate-400 mb-3 block">Or set advanced custom hex values:</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Primary Color</label>
                <div className="flex bg-slate-950/80 rounded-lg border border-white/10 overflow-hidden h-9">
                  <input type="color" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="w-9 h-full cursor-pointer bg-transparent border-0 p-0" />
                  <input value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="w-full bg-transparent text-xs px-2 focus:outline-none text-slate-300" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Secondary Color</label>
                <div className="flex bg-slate-950/80 rounded-lg border border-white/10 overflow-hidden h-9">
                  <input type="color" value={config.secondaryColor} onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })} className="w-9 h-full cursor-pointer bg-transparent border-0 p-0" />
                  <input value={config.secondaryColor} onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })} className="w-full bg-transparent text-xs px-2 focus:outline-none text-slate-300" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Background Color</label>
                <div className="flex bg-slate-950/80 rounded-lg border border-white/10 overflow-hidden h-9">
                  <input type="color" value={config.backgroundColor || "#020617"} onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })} className="w-9 h-full cursor-pointer bg-transparent border-0 p-0" />
                  <input value={config.backgroundColor || "#020617"} onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })} className="w-full bg-transparent text-xs px-2 focus:outline-none text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-certificate text-amber-400" />
            Hero Badges
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Field
              label="Badge 1"
              value={config.badge1}
              onChange={(v) => setConfig({ ...config, badge1: v })}
            />
            <Field
              label="Badge 2"
              value={config.badge2}
              onChange={(v) => setConfig({ ...config, badge2: v })}
            />
            <Field
              label="Badge 3"
              value={config.badge3}
              onChange={(v) => setConfig({ ...config, badge3: v })}
            />
          </div>
        </div>

        {/* About */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-book-open text-amber-400" />
            About Section
          </h2>
          <Field
            label="About Text"
            value={config.aboutText}
            onChange={(v) => setConfig({ ...config, aboutText: v })}
            textarea
          />
        </div>

        {/* Contact Info */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-address-card text-amber-400" />
            Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Address"
              value={config.address}
              onChange={(v) => setConfig({ ...config, address: v })}
            />
            <Field
              label="Phone"
              value={config.phone}
              onChange={(v) => setConfig({ ...config, phone: v })}
            />
            <Field
              label="Email"
              value={config.email}
              onChange={(v) => setConfig({ ...config, email: v })}
            />
            <Field
              label="Operating Hours"
              value={config.operatingHours}
              onChange={(v) => setConfig({ ...config, operatingHours: v })}
            />
          </div>
        </div>
      </div>

      <MaintenancePanel showToast={showToast} />

      {/* Toast */}
      {toast && (
        <div
          className={`toast ${
            toast.type === "success" ? "toast-success" : "toast-error"
          }`}
        >
          <i
            className={`fa-solid ${
              toast.type === "success" ? "fa-circle-check" : "fa-circle-xmark"
            } mr-2`}
          />
          {toast.message}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-sm resize-none focus:border-amber-400/40 focus:outline-none transition"
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/40 focus:outline-none transition"
        />
      )}
    </div>
  );
}

function MaintenancePanel({ showToast }: { showToast: (msg: string, type: "success" | "error") => void }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "0000") {
      setUnlocked(true);
      fetchUsers();
    } else {
      showToast("Incorrect PIN", "error");
      setPin("");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (user: any) => {
    if (!confirm(`Are you sure you want to PERMANENTLY DELETE the account for ${user.email}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/users?userId=${user._id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showToast(`Account permanently deleted!`, "success");
        fetchUsers();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete user", "error");
      }
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return showToast("Min 6 characters required", "error");
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser._id, action: "change_password", newPassword })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Password changed!", "success");
        setSelectedUser(null);
        setNewPassword("");
      } else {
        showToast(data.error || "Failed", "error");
      }
    } catch {
      showToast("Failed to change password", "error");
    }
  };

  if (!unlocked) {
    return (
      <div className="glass rounded-2xl p-6 border-rose-500/20 mt-8 mb-16 max-w-lg mx-auto md:mx-0">
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-2 text-rose-400">
          <i className="fa-solid fa-triangle-exclamation" /> Maintenance Mode & User Accounts
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Enter the master PIN to manage customer accounts, reset passwords, and permanently delete accounts.
        </p>
        <form onSubmit={handleUnlock} className="flex gap-2 max-w-xs">
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-sm focus:border-rose-400/40 focus:outline-none transition"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-400/30 text-sm font-semibold hover:bg-rose-500/30 transition shadow-lg shadow-rose-500/10"
          >
            Unlock <i className="fa-solid fa-lock-open ml-1" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 border-rose-500/40 mt-8 mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-rose-400">
          <i className="fa-solid fa-users-gear" /> User Management
        </h2>
        <button onClick={() => setUnlocked(false)} className="text-xs text-slate-400 hover:text-white transition">
           Lock Panel <i className="fa-solid fa-lock ml-1" />
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400"><i className="fa-solid fa-spinner fa-spin mr-2" /> Loading accounts...</div>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <div key={u._id} className="p-4 rounded-xl border bg-slate-900/60 border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold flex items-center gap-2">
                  {u.name || "Unknown"}
                  {u.role === "owner" && <span className="text-[9px] uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-sm">Owner</span>}
                </p>
                <p className="text-xs text-slate-400">{u.email}</p>
                <p className="text-[10px] text-slate-500 mt-1">Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUser(selectedUser?._id === u._id ? null : u)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-xs hover:bg-slate-800 transition"
                >
                  Change Password
                </button>
                {u.role !== "owner" && (
                  <button
                    onClick={() => deleteAccount(u)}
                    className="px-3 py-1.5 rounded-lg text-xs transition border bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white"
                  >
                    Delete Account
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <form onSubmit={changePassword} className="mt-6 p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row gap-3 items-end animate-fade-in">
          <div className="flex-1 w-full">
            <label className="text-xs text-slate-400 mb-1.5 block">New Password for {selectedUser.email}</label>
            <input
              type="text"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-sm focus:border-amber-400/50"
            />
          </div>
          <button type="submit" className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm hover:brightness-110">
            Save Password
          </button>
          <button type="button" onClick={() => setSelectedUser(null)} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-slate-800">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
