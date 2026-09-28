import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  Bike,
  Store,
  TriangleAlert,
  ChartNoAxesColumn,
  CircleUserRound,
  LogOut,
  Search,
  Pencil,
  Info,
  MapPin,
  Clock3,
  SlidersHorizontal,
  CheckCircle2,
  PauseCircle,
  Star,
  Save,
  X,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  ShieldOff,
  ShieldCheck,
  Sparkles
} from "lucide-react";

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------
const token = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`
});

const API = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && v !== "" && qs.set(k, v));
    return fetch(`/api/admin/shops?${qs}`, { headers: authHeaders() }).then(r => r.json());
  },
  get: (shopId) =>
    fetch(`/api/admin/shops/${shopId}`, { headers: authHeaders() }).then(r => r.json()),
  update: (shopId, body) =>
    fetch(`/api/admin/shops/${shopId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body)
    }).then(r => r.json()),
  status: (shopId, isOpen) =>
    fetch(`/api/admin/shops/${shopId}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ isOpen })
    }).then(r => r.json()),
  featured: (shopId) =>
    fetch(`/api/admin/shops/${shopId}/featured`, {
      method: "PATCH",
      headers: authHeaders()
    }).then(r => r.json()),
  disable: (shopId) =>
    fetch(`/api/admin/shops/${shopId}/disable`, {
      method: "PATCH",
      headers: authHeaders()
    }).then(r => r.json()),
  enable: (shopId) =>
    fetch(`/api/admin/shops/${shopId}/enable`, {
      method: "PATCH",
      headers: authHeaders()
    }).then(r => r.json())
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AdminManageShops() {
  const navigate = useNavigate();

  // List state
  const [shops, setShops]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [categoryFilter, setCategory] = useState("");
  const [statusFilter, setStatus]   = useState("");
  const [sortOrder, setSort]        = useState("newest");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 20;

  // Edit drawer state
  const [editing, setEditing]         = useState(null); // shop object being edited
  const [editForm, setEditForm]       = useState({});
  const [saving, setSaving]           = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // shopId

  // Toast
  const [toast, setToast] = useState(null);

  const menuItems = [
    { label: "Dashboard",                icon: LayoutDashboard,   path: "/dashboard/admin" },
    { label: "Approve Shop Owners",      icon: UserCheck,         path: "/dashboard/admin/shop-owners" },
    { label: "Approve Delivery Runners", icon: Bike,              path: "/dashboard/admin/runners" },
    { label: "Manage Shops",             icon: Store,             path: "/dashboard/admin/shops", active: true },
    { label: "Complaint Management",     icon: TriangleAlert,     path: "/dashboard/admin/complaints" },
    { label: "Reports & Analytics",      icon: ChartNoAxesColumn, path: "/dashboard/admin/reports" },
    { label: "Admin Profile",            icon: CircleUserRound,   path: "/dashboard/admin/profile" },
  ];

  // ---------------------------------------------------------------------------
  // Fetch list
  // ---------------------------------------------------------------------------
  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await API.list({ search, category: categoryFilter, status: statusFilter, sort: sortOrder, page, limit: LIMIT });
      if (!result.success) throw new Error(result.message || "Failed to load shops.");
      setShops(result.data || []);
      setTotalPages(result.pagination?.pages ?? 1);
      setTotalCount(result.pagination?.total ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter, sortOrder, page]);

  useEffect(() => { fetchShops(); }, [fetchShops]);

  // ---------------------------------------------------------------------------
  // Toast
  // ---------------------------------------------------------------------------
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ---------------------------------------------------------------------------
  // Open edit drawer
  // ---------------------------------------------------------------------------
  const openEdit = (shop) => {
    setEditing(shop);
    setEditForm({
      name:          shop.name         || "",
      category:      shop.category     || "",
      location:      shop.location     || "",
      phone:         shop.phone        || "",
      deliveryTime:  shop.deliveryTime || "",
      minOrder:      shop.minOrder     ?? 50,
      tags:          (shop.tags || []).join(", "),
      openHour:      shop.openingHours?.open  || "08:30 AM",
      closeHour:     shop.openingHours?.close || "08:00 PM"
    });
  };

  const handleEditChange = (field, value) => setEditForm(f => ({ ...f, [field]: value }));

  const handleSaveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const body = {
        name:          editForm.name,
        category:      editForm.category,
        location:      editForm.location,
        phone:         editForm.phone,
        deliveryTime:  editForm.deliveryTime,
        minOrder:      Number(editForm.minOrder) || 50,
        tags:          editForm.tags.split(",").map(t => t.trim()).filter(Boolean),
        openingHours:  { open: editForm.openHour, close: editForm.closeHour }
      };
      const result = await API.update(editing._id, body);
      if (!result.success) throw new Error(result.message);
      showToast(`"${editForm.name}" updated successfully.`);
      setEditing(null);
      fetchShops();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Quick actions
  // ---------------------------------------------------------------------------
  const quickAction = async (shopId, action, arg) => {
    setActionLoading(shopId);
    try {
      let result;
      if (action === "status")   result = await API.status(shopId, arg);
      if (action === "featured") result = await API.featured(shopId);
      if (action === "disable")  result = await API.disable(shopId);
      if (action === "enable")   result = await API.enable(shopId);
      if (!result.success) throw new Error(result.message);
      showToast(result.message);
      fetchShops();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (setter) => (e) => { setter(e.target.value); setPage(1); };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#28211d]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-bold text-white ${
            toast.type === "success" ? "bg-emerald-600 border-emerald-500"
            : toast.type === "error" ? "bg-red-600 border-red-500"
            : "bg-amber-600 border-amber-500"
          }`}>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[250px] border-r border-[#eee7df] bg-white">
        <div className="px-6 py-7">
          <h1 className="text-xl font-bold text-orange-500">UIU Food and Items</h1>
          <p className="mt-1 text-sm text-[#5f554e]">Official Portal</p>
        </div>
        <nav className="mt-3 px-3">
          {menuItems.map(({ label, icon: Icon, active, path }) => (
            <button
              key={label}
              type="button"
              onClick={() => path && navigate(path)}
              className={`mb-2 flex min-h-[50px] w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[15px] transition ${
                active ? "bg-[#ff7a18] font-semibold text-white" : "text-[#51463f] hover:bg-orange-50"
              }`}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span className="max-w-[155px]">{label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-3 flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[15px] font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* RIGHT */}
      <div className="ml-[250px] min-h-screen">
        {/* HEADER */}
        <header className="flex h-[70px] items-center justify-between border-b border-[#eee8e2] bg-white px-8">
          <div className="flex w-[380px] items-center gap-3 rounded-full bg-[#f3f0ed] px-5 py-3">
            <Search size={19} className="text-[#6f655e]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search shops by name or location..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#96908c]"
            />
          </div>
          <div className="flex items-center gap-4 border-l border-[#eee7df] pl-6">
            <span className="text-sm font-semibold">Admin</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-100 text-xs font-bold text-orange-600">AD</div>
          </div>
        </header>

        {/* MAIN */}
        <main className="px-8 py-7">
          {/* Breadcrumb */}
          <div className="mb-3 text-sm text-[#655b54]">
            <button type="button" onClick={() => navigate("/dashboard/admin")} className="hover:text-orange-600">Dashboard</button>
            <span className="mx-2">›</span>
            <span className="font-semibold text-[#ae520e]">Manage Shops</span>
          </div>

          {/* Title row */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-medium text-[#3d332d]">Campus Shop Administration</h2>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-500">{totalCount} Shops</span>
              </div>
              <p className="mt-2 max-w-[640px] text-sm leading-5 text-[#71665e]">
                View, edit, open/close, feature, and disable campus shops. Disabling a shop preserves all historical order data.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fetchShops()}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-[#d1cbc5] px-4 py-3 text-xs font-semibold text-[#5c5049] hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </section>

          {/* Filters */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <select value={categoryFilter} onChange={handleFilterChange(setCategory)}
              className="rounded-lg border border-[#e2dad2] bg-white px-4 py-2.5 text-xs font-medium outline-none">
              <option value="">All Categories</option>
              <option value="Food Court">Food Court</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Cafe">Cafe</option>
              <option value="Stationery">Stationery</option>
              <option value="Medicine">Medicine</option>
            </select>
            <select value={statusFilter} onChange={handleFilterChange(setStatus)}
              className="rounded-lg border border-[#e2dad2] bg-white px-4 py-2.5 text-xs font-medium outline-none">
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="featured">Featured</option>
              <option value="approved">Approved</option>
              <option value="unapproved">Disabled</option>
            </select>
            <select value={sortOrder} onChange={handleFilterChange(setSort)}
              className="rounded-lg border border-[#e2dad2] bg-white px-4 py-2.5 text-xs font-medium outline-none">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A–Z</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-[#eee8e2] bg-white shadow-sm">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-20 gap-3 text-[#9d8f86]">
                  <Loader2 size={22} className="animate-spin" />
                  <span className="text-sm font-medium">Loading shops...</span>
                </div>
              ) : error ? (
                <div className="py-14 text-center">
                  <p className="text-sm text-red-500 font-medium mb-3">{error}</p>
                  <button onClick={() => fetchShops()} className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100">Retry</button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-[#fcfaf8] text-[11px] font-semibold text-[#7c7169]">
                      <th className="px-6 py-4">Shop</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Location</th>
                      <th className="px-4 py-4">Owner</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shops.length > 0 ? shops.map((shop) => (
                      <tr key={shop._id} className="border-t border-[#f1ece8] text-sm text-[#5d514a] hover:bg-slate-50 transition-colors">
                        {/* Shop name + image */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={shop.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&q=80"}
                              alt={shop.name}
                              className="h-10 w-10 rounded-xl object-cover border border-[#e5ded8] flex-shrink-0"
                            />
                            <div>
                              <p className="font-bold text-[#4a403a]">{shop.name}</p>
                              <p className="text-[11px] text-[#80756d]">⭐ {shop.rating?.toFixed(1) ?? "—"}</p>
                            </div>
                          </div>
                        </td>
                        {/* Category */}
                        <td className="px-4 py-4">
                          <span className="inline-block rounded px-2.5 py-1 text-[10px] font-bold bg-blue-50 text-blue-600">{shop.category || "—"}</span>
                        </td>
                        {/* Location */}
                        <td className="px-4 py-4">
                          <span className="flex items-center gap-1 text-xs text-[#5d514a]">
                            <MapPin size={12} className="text-orange-400" />{shop.location || "—"}
                          </span>
                        </td>
                        {/* Owner */}
                        <td className="px-4 py-4">
                          <p className="font-semibold text-[#4a403a] text-xs">{shop.owner?.name || "—"}</p>
                          <p className="text-[11px] text-[#80756d]">{shop.owner?.email || ""}</p>
                        </td>
                        {/* Status badges */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${shop.isApproved ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                              {shop.isApproved ? "Active" : "Disabled"}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${shop.isOpen ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                              {shop.isOpen ? "Open" : "Closed"}
                            </span>
                            {shop.isFeatured && (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                                ★ Featured
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            {/* Edit */}
                            <button
                              type="button"
                              title="Edit"
                              onClick={() => openEdit(shop)}
                              className="p-1.5 rounded-lg bg-orange-50 text-[#aa550f] hover:bg-orange-100 transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                            {/* Toggle open/close */}
                            <button
                              type="button"
                              title={shop.isOpen ? "Close Shop" : "Open Shop"}
                              disabled={actionLoading === shop._id || !shop.isApproved}
                              onClick={() => quickAction(shop._id, "status", !shop.isOpen)}
                              className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
                            >
                              {actionLoading === shop._id ? <Loader2 size={15} className="animate-spin" /> : shop.isOpen ? <ToggleRight size={15} className="text-green-600" /> : <ToggleLeft size={15} />}
                            </button>
                            {/* Feature toggle */}
                            <button
                              type="button"
                              title={shop.isFeatured ? "Unfeature" : "Feature"}
                              disabled={actionLoading === shop._id}
                              onClick={() => quickAction(shop._id, "featured")}
                              className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${shop.isFeatured ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                            >
                              <Sparkles size={15} />
                            </button>
                            {/* Disable / Enable */}
                            {shop.isApproved ? (
                              <button
                                type="button"
                                title="Disable Shop"
                                disabled={actionLoading === shop._id}
                                onClick={() => quickAction(shop._id, "disable")}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-40"
                              >
                                <ShieldOff size={15} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                title="Re-enable Shop"
                                disabled={actionLoading === shop._id}
                                onClick={() => quickAction(shop._id, "enable")}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-40"
                              >
                                <ShieldCheck size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">No shops match your filter criteria.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-[#eee8e2] px-6 py-4 text-xs text-[#736860]">
              <span>Showing {shops.length} of {totalCount} shops</span>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                <span className="font-bold px-2">Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages || loading} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* EDIT DRAWER / MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={editing.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&q=80"}
                  alt={editing.name}
                  className="h-10 w-10 rounded-xl object-cover border"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-800">Edit Shop</h3>
                  <p className="text-xs text-slate-500">ID: {String(editing._id).slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Form body */}
            <div className="px-7 py-6 space-y-5">
              {/* Name + Category */}
              <div className="grid grid-cols-2 gap-5">
                <Field label="Shop Name">
                  <input value={editForm.name} onChange={e => handleEditChange("name", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Category">
                  <select value={editForm.category} onChange={e => handleEditChange("category", e.target.value)} className={inputCls}>
                    <option value="">Select</option>
                    <option>Food Court</option>
                    <option>Fast Food & Snacks</option>
                    <option>Food & Cafe</option>
                    <option>Stationery</option>
                    <option>Medicine</option>
                  </select>
                </Field>
              </div>

              {/* Location + Phone */}
              <div className="grid grid-cols-2 gap-5">
                <Field label="Location">
                  <input value={editForm.location} onChange={e => handleEditChange("location", e.target.value)} className={inputCls} placeholder="e.g. UIU Food Court Counter #2" />
                </Field>
                <Field label="Phone">
                  <input value={editForm.phone} onChange={e => handleEditChange("phone", e.target.value)} className={inputCls} />
                </Field>
              </div>

              {/* Delivery time + Min order */}
              <div className="grid grid-cols-2 gap-5">
                <Field label="Delivery Time">
                  <input value={editForm.deliveryTime} onChange={e => handleEditChange("deliveryTime", e.target.value)} className={inputCls} placeholder="e.g. 15-20 min" />
                </Field>
                <Field label="Min Order (৳)">
                  <input type="number" value={editForm.minOrder} onChange={e => handleEditChange("minOrder", e.target.value)} className={inputCls} min={0} />
                </Field>
              </div>

              {/* Opening hours */}
              <div className="grid grid-cols-2 gap-5">
                <Field label="Opening Time">
                  <input value={editForm.openHour} onChange={e => handleEditChange("openHour", e.target.value)} className={inputCls} placeholder="08:30 AM" />
                </Field>
                <Field label="Closing Time">
                  <input value={editForm.closeHour} onChange={e => handleEditChange("closeHour", e.target.value)} className={inputCls} placeholder="08:00 PM" />
                </Field>
              </div>

              {/* Tags */}
              <Field label="Tags (comma separated)">
                <input value={editForm.tags} onChange={e => handleEditChange("tags", e.target.value)} className={inputCls} placeholder="e.g. halal, vegan, fast food" />
              </Field>

              {/* Info note */}
              <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs text-slate-500">
                <Info size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <span>Shop images must be updated by the Shop Owner. To change open/closed state or featured status, use the quick-action buttons on the list.</span>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex gap-3 px-7 pb-7">
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#ff7a18] py-3.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border-2 border-slate-200 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
const inputCls = "h-11 w-full rounded-lg border border-orange-200 bg-white px-4 text-sm text-[#51473f] outline-none transition placeholder:text-[#a09892] focus:border-orange-400";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[#685d55]">{label}</span>
      {children}
    </label>
  );
}