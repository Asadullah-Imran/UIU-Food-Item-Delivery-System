import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  CloudUpload,
  Image as ImageIcon,
} from "lucide-react";

export default function ShopAddMenuItem() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    itemName: "",
    category: "Fast Food",
    shortDescription: "",
    fullDescription: "",
    price: "",
    prepTime: "15",
    discount: "0",
    taxRate: "5",
    available: true,
    todaySpecial: false,
    featured: false,
    recommended: true,
    stockQuantity: "50",
    lowStockWarning: "10",
  });

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    console.log("Menu item:", form);

    // Frontend-only for now.
    // Backend/API integration can be added later.
    navigate("/dashboard/shop/menu");
  };

  return (
    <div className="mx-auto max-w-[1100px] pb-16 pt-4">
      {/* BREADCRUMB */}
      <div className="mb-7 flex items-center text-sm font-medium text-slate-500">
        <Link
          to="/dashboard/shop"
          className="transition-colors hover:text-slate-800"
        >
          Dashboard
        </Link>

        <ChevronRight className="mx-2 h-4 w-4" />

        <Link
          to="/dashboard/shop/menu"
          className="transition-colors hover:text-slate-800"
        >
          Menu Management
        </Link>

        <ChevronRight className="mx-2 h-4 w-4" />

        <span className="font-bold text-orange-600">
          Add Menu Item
        </span>
      </div>

      {/* PAGE TITLE */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Add New Menu Item
        </h1>

        <p className="mt-2 font-medium text-slate-500">
          Create a new menu item or update an existing one for students to
          order.
        </p>
      </div>

      {/* FORM */}
      <div className="max-w-[760px] space-y-7">
        {/* FOOD IMAGE */}
        <Card>
          <h2 className="mb-6 text-lg font-medium text-slate-800">
            Food Image
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-orange-200 bg-[#fffdfb] transition hover:bg-orange-50/40"
          >
            {imagePreview ? (
              <div className="relative h-[300px] w-full">
                <img
                  src={imagePreview}
                  alt="Food preview"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex items-end justify-center bg-black/10 pb-5 opacity-0 transition hover:opacity-100">
                  <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-orange-600 shadow">
                    Change Image
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <CloudUpload className="h-7 w-7" />
                </div>

                <p className="mt-5 font-medium text-slate-700">
                  Drag and drop your food photo here
                </p>

                <p className="mt-2 text-sm text-[#967c6c]">
                  PNG, JPG up to 10MB (Recommended: 1200×800px)
                </p>

                <span className="mt-5 rounded-lg bg-orange-500 px-7 py-3 text-sm font-bold text-white">
                  Upload Image
                </span>
              </>
            )}
          </button>
        </Card>

        {/* BASIC INFORMATION */}
        <Card>
          <h2 className="mb-6 text-lg font-medium text-slate-800">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Item Name">
              <input
                value={form.itemName}
                onChange={(event) =>
                  updateField("itemName", event.target.value)
                }
                placeholder="e.g. Spicy Chicken Burger"
                className={inputStyle}
              />
            </FormField>

            <FormField label="Category">
              <select
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                className={inputStyle}
              >
                <option>Fast Food</option>
                <option>Meals</option>
                <option>Snacks</option>
                <option>Drinks</option>
                <option>Desserts</option>
              </select>
            </FormField>
          </div>

          <div className="mt-5">
            <FormField label="Short Description">
              <input
                value={form.shortDescription}
                maxLength={60}
                onChange={(event) =>
                  updateField(
                    "shortDescription",
                    event.target.value
                  )
                }
                placeholder="A brief hook for the student (Max 60 chars)"
                className={inputStyle}
              />
            </FormField>
          </div>

          <div className="mt-5">
            <FormField label="Full Description">
              <textarea
                value={form.fullDescription}
                onChange={(event) =>
                  updateField(
                    "fullDescription",
                    event.target.value
                  )
                }
                placeholder="Detailed ingredients, taste profile, and allergen info..."
                className={`${inputStyle} min-h-[140px] resize-none py-4`}
              />
            </FormField>
          </div>
        </Card>

        {/* PRICING */}
        <Card>
          <h2 className="mb-6 text-lg font-medium text-slate-800">
            Pricing & Preparation
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Price (BDT)">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  ৳
                </span>

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) =>
                    updateField("price", event.target.value)
                  }
                  placeholder="0.00"
                  className={`${inputStyle} pl-9`}
                />
              </div>
            </FormField>

            <FormField label="Est. Prep Time (min)">
              <input
                type="number"
                min="1"
                value={form.prepTime}
                onChange={(event) =>
                  updateField("prepTime", event.target.value)
                }
                className={inputStyle}
              />
            </FormField>

            <FormField label="Discount (%)">
              <input
                type="number"
                min="0"
                max="100"
                value={form.discount}
                onChange={(event) =>
                  updateField("discount", event.target.value)
                }
                className={inputStyle}
              />
            </FormField>

            <FormField label="Tax Rate (%)">
              <input
                type="number"
                min="0"
                value={form.taxRate}
                onChange={(event) =>
                  updateField("taxRate", event.target.value)
                }
                className={inputStyle}
              />
            </FormField>
          </div>
        </Card>

        {/* AVAILABILITY */}
        <Card>
          <h2 className="mb-6 text-lg font-medium text-slate-800">
            Availability & Inventory
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ToggleSetting
              label="Available for Order"
              enabled={form.available}
              onClick={() =>
                updateField("available", !form.available)
              }
            />

            <ToggleSetting
              label="Today's Special"
              enabled={form.todaySpecial}
              onClick={() =>
                updateField("todaySpecial", !form.todaySpecial)
              }
            />

            <ToggleSetting
              label="Featured Item"
              enabled={form.featured}
              onClick={() =>
                updateField("featured", !form.featured)
              }
            />

            <ToggleSetting
              label="Recommended"
              enabled={form.recommended}
              onClick={() =>
                updateField(
                  "recommended",
                  !form.recommended
                )
              }
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Stock Quantity">
              <input
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(event) =>
                  updateField(
                    "stockQuantity",
                    event.target.value
                  )
                }
                className={inputStyle}
              />
            </FormField>

            <FormField label="Low Stock Warning">
              <input
                type="number"
                min="0"
                value={form.lowStockWarning}
                onChange={(event) =>
                  updateField(
                    "lowStockWarning",
                    event.target.value
                  )
                }
                className={inputStyle}
              />
            </FormField>
          </div>
        </Card>

        {/* ACTIONS */}
        <div className="flex flex-col justify-between gap-4 border-t border-orange-200 pt-6 sm:flex-row">
          <button
            type="button"
            className="rounded-xl border border-red-400 px-6 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            Delete Item
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/shop/menu")}
              className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-orange-500 bg-white px-7 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
            >
              <ImageIcon className="h-4 w-4" />
              Preview
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              Save Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle =
  "h-12 w-full rounded-xl border border-orange-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

function Card({ children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      {children}
    </section>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#634b3d]">
        {label}
      </span>

      {children}
    </label>
  );
}

function ToggleSetting({
  label,
  enabled,
  onClick,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f5f2ee] px-4 py-3">
      <span className="text-sm font-medium text-slate-800">
        {label}
      </span>

      <button
        type="button"
        onClick={onClick}
        aria-pressed={enabled}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-orange-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}