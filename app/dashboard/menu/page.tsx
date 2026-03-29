"use client";
import { useEffect, useState, useRef } from "react";
import { IMenuItem } from "@/models/MenuItem";

export default function MenuPage() {
  const [items, setItems] = useState<IMenuItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setItems(data.menu);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addItem = async () => {
    if (!name || !price) {
      showToast("Name and price are required", "error");
      return;
    }

    setAdding(true);
    try {
      let imgUrl = "";

      // Upload image if provided
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          imgUrl = uploadData.url;
        }
      }

      await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          img: imgUrl,
          description
        })
      });

      setName("");
      setPrice("");
      setDescription("");
      setImageFile(null);
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchItems();
      showToast("Menu item added!", "success");
    } catch {
      showToast("Failed to add item", "error");
    } finally {
      setAdding(false);
    }
  };

  const toggle = async (id: string, available: boolean) => {
    await fetch("/api/menu", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, available: !available })
    });
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await fetch("/api/menu", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchItems();
    showToast("Item deleted", "success");
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold font-display mb-2">Menu Manager</h1>
      <p className="text-sm text-slate-400 mb-8">
        Add, edit, and manage your menu items. Upload images locally for each
        dish.
      </p>

      {/* Add Item Form */}
      <div className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-plus text-amber-400" />
          Add New Item
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Dish Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grilled Chicken Bowl"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/40 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Price ($)
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              type="number"
              step="0.01"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/40 focus:outline-none transition"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs text-slate-400 mb-1.5">
            Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of the dish"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/40 focus:outline-none transition"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs text-slate-400 mb-1.5">
            Dish Image
          </label>
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 hover:border-amber-400/50 transition cursor-pointer overflow-hidden flex items-center justify-center bg-slate-900/60"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <i className="fa-solid fa-camera text-lg text-slate-600" />
                  <p className="text-[8px] text-slate-600 mt-0.5">Photo</p>
                </div>
              )}
            </div>
            <div className="text-xs text-slate-500">
              <p>Click to upload a dish photo</p>
              <p>PNG, JPG — max 5MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
        <button
          onClick={addItem}
          disabled={adding}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/30 hover:brightness-110 transition disabled:opacity-60"
        >
          {adding ? (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-spinner fa-spin" /> Adding...
            </span>
          ) : (
            "Add to Menu"
          )}
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item: any) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-slate-900/80 border border-white/5 p-4 rounded-xl text-sm hover:border-white/10 transition"
          >
            <div className="flex items-center gap-4">
              {item.img ? (
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center">
                  <i className="fa-solid fa-utensils text-slate-600" />
                </div>
              )}
              <div>
                <p className="font-semibold">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-slate-500">{item.description}</p>
                )}
                <p className="text-xs text-amber-300 font-medium">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggle(item._id, item.available)}
                className={`px-3 py-1.5 rounded-full text-xs transition ${
                  item.available
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    : "bg-slate-700/50 text-slate-400 border border-slate-600/30"
                }`}
              >
                {item.available ? (
                  <>
                    <i className="fa-solid fa-eye mr-1" /> Visible
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-eye-slash mr-1" /> Hidden
                  </>
                )}
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                className="px-3 py-1.5 rounded-full text-xs bg-rose-500/10 text-rose-400 border border-rose-400/20 hover:bg-rose-500/20 transition"
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <i className="fa-solid fa-bowl-food text-3xl mb-3 block" />
            <p>No menu items yet. Add your first dish above!</p>
          </div>
        )}
      </div>

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
