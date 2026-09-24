import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Download,
  ClipboardList,
  BadgeCheck,
  Ban,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Loader2,
  PauseCircle,
  PlayCircle,
  RefreshCw
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map API status (lowercase) → display label */
const STATUS_LABEL = {
  pending:   "Pending",
  active:    "Approved",
  rejected:  "Rejected",
  suspended: "Suspended"
};

/** Map API category string → badge style */
function categoryStyle(cat = "") {
  const c = cat.toLowerCase();
  if (c.includes("cafe") || c.includes("food"))  return "bg-blue-50 text-blue-500";
  if (c.includes("fast"))                         return "bg-red-50 text-red-500";
  if (c.includes("stationery"))                   return "bg-purple-50 text-purple-600";
  return "bg-gray-100 text-gray-600";
}

/** Pick a deterministic emoji for a shop name */
const EMOJIS = ["🍜","🍕","☕","🍔","🥗","🍱","🧋","🍩","🥙","🍣","📦","🖊️"];
function shopEmoji(name = "") {
  let n = 0;
  for (let i = 0; i < name.length; i++) n += name.charCodeAt(i);
  return EMOJIS[n % EMOJIS.length];
}

/** Transform a single API record into the shape the UI consumes */
function mapRecord(r) {
  const shopName = r.shop?.name || r.shopDetails?.shopName || "—";
  const cat      = r.shop?.category || "—";
  const loc      = r.shop?.location || r.shopDetails?.campusLocation || "—";
  const license  = r.shopDetails?.tradeLicense || "N/A";

  return {
    // identity
    userId:       String(r.userId),
    id:           `#SO-${String(r.userId).slice(-4).toUpperCase()}`,
    // display
    shop:         shopName,
    owner:        r.name,
    email:        r.email,
    phone:        r.phone || "—",
    category:     cat,
    categoryStyle: categoryStyle(cat),
    location:     loc,
    tradeLicense: license,
    emoji:        shopEmoji(shopName),
    // status (always derived from API)
    status:       STATUS_LABEL[r.status] ?? r.status,
    _rawStatus:   r.status,     // lowercase DB value for API calls
    date:         r.appliedAt,
  };
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------
const API = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && qs.set(k, v));
    return fetch(`/api/admin/shop-owners?${qs}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then((r) => r.json());
  },
  patch: (userId, action) =>
    fetch(`/api/admin/shop-owners/${userId}/${action}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then((r) => r.json())
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AdminShopOwnerApproval() {
  const navigate = useNavigate();

  // --- Data state ---
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // userId being actioned

  // --- Filter / sort state ---
  const [statusFilter, setStatusFilter]     = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortOrder, setSortOrder]           = useState("newest");
  const [search, setSearch]                 = useState("");
  const [page, setPage]                     = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [totalCount, setTotalCount]         = useState(0);
  const LIMIT = 20;

  // --- UI state ---
  const [reviewModal, setReviewModal] = useState(null);
  const [toast, setToast]             = useState(null);

  const menuItems = [
    { label: "Dashboard",                icon: LayoutDashboard,   path: "/dashboard/admin" },
    { label: "Approve Shop Owners",      icon: UserCheck,         path: "/dashboard/admin/shop-owners", active: true },
    { label: "Approve Delivery Runners", icon: Bike,              path: "/dashboard/admin/runners" },
    { label: "Manage Shops",             icon: Store,             path: "/dashboard/admin/shops" },
    { label: "Complaint Management",     icon: TriangleAlert,     path: "/dashboard/admin/complaints" },
    { label: "Reports & Analytics",      icon: ChartNoAxesColumn, path: "/dashboard/admin/reports" },
    { label: "Admin Profile",            icon: CircleUserRound,   path: "/dashboard/admin/profile" },
  ];

  // ---------------------------------------------------------------------------
  // Fetch
  // ---------------------------------------------------------------------------
  const fetchApplications = useCallback(async (pageOverride) => {
    setLoading(true);
    setError(null);
    try {
      const apiStatus = {
        "Pending":   "pending",
        "Approved":  "active",
        "Rejected":  "rejected",
        "Suspended": "suspended"
      }[statusFilter] ?? "";

      const result = await API.list({
        status:   apiStatus,
        category: categoryFilter === "All Categories" ? "" : categoryFilter,
        search:   search.trim(),
        sort:     sortOrder,
        page:     pageOverride ?? page,
        limit:    LIMIT
      });

      if (!result.success) throw new Error(result.message || "Failed to load.");

      setApplications((result.data || []).map(mapRecord));
      setTotalPages(result.pagination?.pages  ?? 1);
      setTotalCount(result.pagination?.total  ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, search, sortOrder, page]);

  // Re-fetch whenever filters / page change
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ---------------------------------------------------------------------------
  // Toast helper
  // ---------------------------------------------------------------------------
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ---------------------------------------------------------------------------
  // Mutation handler
  // ---------------------------------------------------------------------------
  const handleAction = async (userId, action) => {
    setActionLoading(userId);
    try {
      const result = await API.patch(userId, action);
      if (!result.success) throw new Error(result.message || "Action failed.");

      const actionLabel = { approve: "Approved", reject: "Rejected", suspend: "updated" }[action] ?? action;
      const appName = applications.find((a) => a.userId === userId)?.shop ?? "Shop";
      showToast(`"${appName}" has been ${actionLabel}.`, action === "approve" ? "success" : "warning");

      setReviewModal(null);
      // Refresh current page data
      await fetchApplications();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Derived counts (from current page — for quick UI stats)
  // ---------------------------------------------------------------------------
  const pendingCount  = applications.filter((a) => a.status === "Pending").length;
  const approvedCount = applications.filter((a) => a.status === "Approved").length;
  const rejectedCount = applications.filter((a) => a._rawStatus === "rejected" || a._rawStatus === "suspended").length;

  // ---------------------------------------------------------------------------
  // Client-side filtering (search is server-side, but sort/filter already applied)
  // Keep useMemo in case user types mid-result (instant feedback before next fetch)
  // ---------------------------------------------------------------------------
  const filteredApplications = useMemo(() => applications, [applications]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#28211d]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-bold text-white ${
              toast.type === "success"
                ? "bg-emerald-600 border-emerald-500"
                : toast.type === "error"
                ? "bg-red-600 border-red-500"
                : "bg-amber-600 border-amber-500"
            }`}
          >
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
              } ${path ? "cursor-pointer" : "cursor-default"}`}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span className="max-w-[155px]">{label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-3 flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[15px] font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* RIGHT SIDE */}
      <div className="ml-[250px] min-h-screen">
        {/* HEADER */}
        <header className="flex h-[70px] items-center justify-between border-b border-[#eee8e2] bg-white px-8">
          <div className="flex w-[380px] items-center gap-3 rounded-full bg-[#f3f0ed] px-5 py-3">
            <Search size={19} className="text-[#6f655e]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by shop or owner name..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#96908c]"
            />
          </div>
          <div className="flex items-center gap-4 border-l border-[#eee7df] pl-6">
            <span className="text-sm font-semibold">Admin</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-100 text-xs font-bold text-orange-600">
              AD
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="px-8 py-7">
          {/* BREADCRUMB */}
          <div className="mb-3 text-sm text-[#655b54]">
            <button type="button" onClick={() => navigate("/dashboard/admin")} className="hover:text-orange-600">
              Dashboard
            </button>
            <span className="mx-2">›</span>
            <span className="font-semibold text-[#ae520e]">Shop Owner Approval</span>
          </div>

          {/* TITLE */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-medium text-[#3d332d]">Shop Owner Approval</h2>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-500">
                  {totalCount} Total Applications
                </span>
              </div>
              <p className="mt-2 max-w-[690px] text-sm leading-5 text-[#71665e]">
                Review new shop owner applications and verify eligibility before granting access to the campus food logistics network.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fetchApplications()}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-[#d1cbc5] px-4 py-3 text-xs font-semibold text-[#5c5049] transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => showToast("Exporting shop owner applications CSV...", "success")}
                className="flex items-center gap-2 rounded-xl border border-[#b45907] px-4 py-3 text-xs font-semibold text-[#aa5308] transition hover:bg-orange-50"
              >
                <Download size={14} />
                Export List
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className="mb-8 grid grid-cols-3 gap-5">
            <StatCard icon={ClipboardList} label="Pending Review"    value={pendingCount  < 10 ? `0${pendingCount}`  : pendingCount}  style="bg-orange-50 text-orange-600" />
            <StatCard icon={BadgeCheck}   label="Approved Shops"    value={approvedCount < 10 ? `0${approvedCount}` : approvedCount} style="bg-green-50 text-green-600" />
            <StatCard icon={Ban}          label="Rejected/Suspended" value={rejectedCount < 10 ? `0${rejectedCount}` : rejectedCount} style="bg-red-50 text-red-600" />
          </section>

          {/* TABLE CONTAINER */}
          <div className="rounded-2xl border border-[#eee8e2] bg-white shadow-sm">
            {/* FILTERS */}
            <div className="flex items-center justify-between border-b border-[#eee8e2] p-5">
              <div className="flex items-center gap-4">
                <select
                  value={statusFilter}
                  onChange={handleFilterChange(setStatusFilter)}
                  className="rounded-lg border border-[#e2dad2] bg-white px-4 py-2.5 text-xs font-medium outline-none"
                >
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Suspended</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={handleFilterChange(setCategoryFilter)}
                  className="rounded-lg border border-[#e2dad2] bg-white px-4 py-2.5 text-xs font-medium outline-none"
                >
                  <option>All Categories</option>
                  <option>FOOD & CAFE</option>
                  <option>FAST FOOD</option>
                  <option>STATIONERY</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#80756d]">Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={handleFilterChange(setSortOrder)}
                  className="rounded-lg border border-[#e2dad2] bg-white px-3 py-2 text-xs font-medium outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-20 gap-3 text-[#9d8f86]">
                  <Loader2 size={22} className="animate-spin" />
                  <span className="text-sm font-medium">Loading applications...</span>
                </div>
              ) : error ? (
                <div className="py-14 text-center">
                  <p className="text-sm text-red-500 font-medium mb-3">{error}</p>
                  <button
                    onClick={() => fetchApplications()}
                    className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-[#fcfaf8] text-[11px] font-semibold text-[#7c7169]">
                      <th className="px-7 py-4">ID</th>
                      <th className="px-4 py-4">Shop Name</th>
                      <th className="px-4 py-4">Owner Contact</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map((app) => (
                        <tr key={app.userId} className="border-t border-[#f1ece8] text-sm text-[#5d514a] hover:bg-slate-50 transition-colors">
                          <td className="px-7 py-4 font-bold text-[#ad530d]">{app.id}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e5ded8] bg-[#f8f7f5] text-lg">
                                {app.emoji}
                              </div>
                              <span className="font-bold text-[#4a403a]">{app.shop}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-[#4a403a]">{app.owner}</p>
                            <p className="text-xs text-[#70655e]">{app.email}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-block rounded px-2.5 py-1 text-[10px] font-bold ${app.categoryStyle}`}>
                              {app.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setReviewModal(app)}
                                className="px-3 py-1.5 rounded-lg bg-orange-50 text-[#aa550f] hover:bg-orange-100 font-bold text-xs transition-colors"
                              >
                                Review
                              </button>
                              {app._rawStatus === "pending" && (
                                <>
                                  <button
                                    type="button"
                                    disabled={actionLoading === app.userId}
                                    onClick={() => handleAction(app.userId, "approve")}
                                    title="Quick Approve"
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                  >
                                    {actionLoading === app.userId ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={actionLoading === app.userId}
                                    onClick={() => handleAction(app.userId, "reject")}
                                    title="Quick Reject"
                                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}
                              {app._rawStatus === "active" && (
                                <button
                                  type="button"
                                  disabled={actionLoading === app.userId}
                                  onClick={() => handleAction(app.userId, "suspend")}
                                  title="Suspend"
                                  className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50"
                                >
                                  <PauseCircle size={16} />
                                </button>
                              )}
                              {app._rawStatus === "suspended" && (
                                <button
                                  type="button"
                                  disabled={actionLoading === app.userId}
                                  onClick={() => handleAction(app.userId, "suspend")}
                                  title="Reactivate"
                                  className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                                >
                                  <PlayCircle size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                          No applications match your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between border-t border-[#eee8e2] px-6 py-4 text-xs text-[#736860]">
              <span>Showing {filteredApplications.length} of {totalCount} applications</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="font-bold px-2">Page {page} of {totalPages}</span>
                <button
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* REVIEW MODAL */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border flex items-center justify-center text-2xl">
                  {reviewModal.emoji}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{reviewModal.shop}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{reviewModal.id} • {reviewModal.category}</p>
                </div>
              </div>
              <button onClick={() => setReviewModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><UserCheck size={14} /> Owner Name</span>
                  <span className="font-bold text-slate-800">{reviewModal.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Mail size={14} /> Email Address</span>
                  <span className="font-bold text-slate-800">{reviewModal.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Phone size={14} /> Contact Phone</span>
                  <span className="font-bold text-slate-800">{reviewModal.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><MapPin size={14} /> Location</span>
                  <span className="font-bold text-slate-800">{reviewModal.location}</span>
                </div>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200/60">
                <p className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <FileText size={14} /> Trade License
                </p>
                <p className="text-amber-800 font-mono text-[11px]">{reviewModal.tradeLicense}</p>
              </div>

              <div className="flex justify-between items-center px-1">
                <span className="font-bold text-slate-600">Current Status:</span>
                <StatusBadge status={reviewModal.status} />
              </div>
            </div>

            {/* Modal action buttons */}
            <div className="flex gap-3">
              {/* Approve */}
              <button
                type="button"
                onClick={() => handleAction(reviewModal.userId, "approve")}
                disabled={reviewModal._rawStatus === "active" || actionLoading === reviewModal.userId}
                className={`flex-1 py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                  reviewModal._rawStatus === "active"
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                }`}
              >
                {actionLoading === reviewModal.userId ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                Approve Shop Owner
              </button>

              {/* Reject */}
              <button
                type="button"
                onClick={() => handleAction(reviewModal.userId, "reject")}
                disabled={reviewModal._rawStatus === "rejected" || actionLoading === reviewModal.userId}
                className={`flex-1 py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                  reviewModal._rawStatus === "rejected"
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-rose-50 hover:bg-rose-100 text-rose-600"
                }`}
              >
                <X size={15} /> Reject Application
              </button>
            </div>

            {/* Suspend / Reactivate */}
            {(reviewModal._rawStatus === "active" || reviewModal._rawStatus === "suspended") && (
              <button
                type="button"
                onClick={() => handleAction(reviewModal.userId, "suspend")}
                disabled={actionLoading === reviewModal.userId}
                className={`mt-3 w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                  reviewModal._rawStatus === "active"
                    ? "bg-amber-50 hover:bg-amber-100 text-amber-700"
                    : "bg-green-50 hover:bg-green-100 text-green-700"
                }`}
              >
                {reviewModal._rawStatus === "active"
                  ? <><PauseCircle size={14} /> Suspend Account</>
                  : <><PlayCircle size={14} /> Reactivate Account</>
                }
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function StatCard({ icon: Icon, label, value, style }) {
  return (
    <div className="rounded-2xl border border-[#eee8e2] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#8b8077]">{label}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-[#3a302a]">{value}</h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${style}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Approved:  "bg-emerald-50 text-emerald-600 border-emerald-200",
    Rejected:  "bg-rose-50 text-rose-600 border-rose-200",
    Suspended: "bg-amber-50 text-amber-700 border-amber-200",
    Pending:   "bg-amber-50 text-amber-700 border-amber-200"
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold border ${map[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
      ● {status}
    </span>
  );
}