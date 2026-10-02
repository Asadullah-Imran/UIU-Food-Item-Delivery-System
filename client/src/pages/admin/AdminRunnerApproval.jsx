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
  Clock3,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  User,
  Phone,
  GraduationCap,
  Mail,
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

/** Transform a single API record into the shape the UI consumes */
function mapRecord(r) {
  return {
    userId:       String(r.userId),
    id:           `#RN-${String(r.userId).slice(-4).toUpperCase()}`,
    name:         r.name,
    email:        r.email,
    phone:        r.phone || "—",
    universityId: r.universityId || "—",
    department:   r.department   || "—",
    vehicle:      r.runnerDetails?.vehicleType || "—",
    rating:       r.runnerDetails?.rating      ?? 5.0,
    totalTrips:   r.runnerDetails?.totalTrips  ?? 0,
    status:       STATUS_LABEL[r.status] ?? r.status,
    _rawStatus:   r.status,
    appliedAt:    r.appliedAt
  };
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------
const API = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && qs.set(k, v));
    return fetch(`/api/admin/runners?${qs}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then((r) => r.json());
  },
  patch: (userId, action) =>
    fetch(`/api/admin/runners/${userId}/${action}`, {
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
export default function AdminRunnerApproval() {
  const navigate = useNavigate();

  // --- Data state ---
  const [runners, setRunners]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [actionLoading, setActionLoading]   = useState(null);

  // --- Filter state ---
  const [statusFilter, setStatusFilter]         = useState("All Statuses");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [sortOrder, setSortOrder]               = useState("newest");
  const [search, setSearch]                     = useState("");
  const [page, setPage]                         = useState(1);
  const [totalPages, setTotalPages]             = useState(1);
  const [totalCount, setTotalCount]             = useState(0);
  const LIMIT = 20;

  // --- UI state ---
  const [reviewModal, setReviewModal] = useState(null);
  const [toast, setToast]             = useState(null);

  const menuItems = [
    { label: "Dashboard",                icon: LayoutDashboard,   path: "/dashboard/admin" },
    { label: "Approve Shop Owners",      icon: UserCheck,         path: "/dashboard/admin/shop-owners" },
    { label: "Approve Delivery Runners", icon: Bike,              path: "/dashboard/admin/runners", active: true },
    { label: "Manage Shops",             icon: Store,             path: "/dashboard/admin/shops" },
    { label: "Complaint Management",     icon: TriangleAlert,     path: "/dashboard/admin/complaints" },
    { label: "Reports & Analytics",      icon: ChartNoAxesColumn, path: "/dashboard/admin/reports" },
    { label: "Admin Profile",            icon: CircleUserRound,   path: "/dashboard/admin/profile" },
  ];

  // ---------------------------------------------------------------------------
  // Fetch
  // ---------------------------------------------------------------------------
  const fetchRunners = useCallback(async () => {
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
        status:     apiStatus,
        department: departmentFilter === "All Departments" ? "" : departmentFilter,
        search:     search.trim(),
        sort:       sortOrder,
        page,
        limit: LIMIT
      });

      if (!result.success) throw new Error(result.message || "Failed to load.");

      setRunners((result.data || []).map(mapRecord));
      setTotalPages(result.pagination?.pages ?? 1);
      setTotalCount(result.pagination?.total ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, departmentFilter, search, sortOrder, page]);

  useEffect(() => {
    fetchRunners();
  }, [fetchRunners]);

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

      const label   = { approve: "Approved", reject: "Rejected", suspend: "updated" }[action] ?? action;
      const runName = runners.find((r) => r.userId === userId)?.name ?? "Runner";
      showToast(`"${runName}" has been ${label}.`, action === "approve" ? "success" : "warning");

      setReviewModal(null);
      await fetchRunners();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Derived counts (page-level stats)
  // ---------------------------------------------------------------------------
  const pendingCount  = runners.filter((r) => r._rawStatus === "pending").length;
  const approvedCount = runners.filter((r) => r._rawStatus === "active").length;
  const rejectedCount = runners.filter((r) => r._rawStatus === "rejected" || r._rawStatus === "suspended").length;

  const filteredRunners = useMemo(() => runners, [runners]);

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
              placeholder="Search by name, email or student ID..."
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
            <span className="font-semibold text-[#ae520e]">Delivery Runner Approval</span>
          </div>

          {/* TITLE */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-medium text-[#3d332d]">Delivery Runner Approval</h2>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-500">
                  {totalCount} Total Applications
                </span>
              </div>
              <p className="mt-2 max-w-[690px] text-sm leading-5 text-[#71665e]">
                Verify UIU students applying to earn money as campus delivery runners. Review academic status and availability.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fetchRunners()}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-[#d1cbc5] px-4 py-3 text-xs font-semibold text-[#5c5049] transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => showToast("Exporting runner applications CSV...", "success")}
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
            <StatCard icon={BadgeCheck}   label="Approved Runners"   value={approvedCount < 10 ? `0${approvedCount}` : approvedCount} style="bg-green-50 text-green-600" />
            <StatCard icon={Ban}          label="Rejected/Suspended"  value={rejectedCount < 10 ? `0${rejectedCount}` : rejectedCount} style="bg-red-50 text-red-600" />
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
                  value={departmentFilter}
                  onChange={handleFilterChange(setDepartmentFilter)}
                  className="rounded-lg border border-[#e2dad2] bg-white px-4 py-2.5 text-xs font-medium outline-none"
                >
                  <option>All Departments</option>
                  <option>CSE</option>
                  <option>BBA</option>
                  <option>EEE</option>
                  <option>Civil</option>
                  <option>MBA</option>
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
                  <span className="text-sm font-medium">Loading runner applications...</span>
                </div>
              ) : error ? (
                <div className="py-14 text-center">
                  <p className="text-sm text-red-500 font-medium mb-3">{error}</p>
                  <button
                    onClick={() => fetchRunners()}
                    className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[#fcfaf8] text-[11px] font-semibold text-[#7c7169]">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-4 py-4">Runner Name</th>
                      <th className="px-4 py-4">Contact</th>
                      <th className="px-4 py-4">Department</th>
                      <th className="px-4 py-4">Vehicle</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRunners.length > 0 ? (
                      filteredRunners.map((runner) => (
                        <tr key={runner.userId} className="border-t border-[#f1ece8] text-sm text-[#5d514a] hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-[#ad530d]">{runner.id}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600">
                                <User size={18} />
                              </div>
                              <div>
                                <p className="font-bold text-[#4a403a]">{runner.name}</p>
                                <p className="text-[11px] text-[#80756d]">UID: {runner.universityId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-xs font-semibold text-[#4a403a]">{runner.email}</p>
                            <p className="text-[11px] text-[#80756d]">{runner.phone}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-semibold text-[#4a403a]">{runner.department}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                              <Bike size={11} /> {runner.vehicle}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={runner.status} />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setReviewModal(runner)}
                                className="px-3 py-1.5 rounded-lg bg-orange-50 text-[#aa550f] hover:bg-orange-100 font-bold text-xs transition-colors"
                              >
                                Review
                              </button>
                              {runner._rawStatus === "pending" && (
                                <>
                                  <button
                                    type="button"
                                    disabled={actionLoading === runner.userId}
                                    onClick={() => handleAction(runner.userId, "approve")}
                                    title="Quick Approve"
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                  >
                                    {actionLoading === runner.userId ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={actionLoading === runner.userId}
                                    onClick={() => handleAction(runner.userId, "reject")}
                                    title="Quick Reject"
                                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}
                              {runner._rawStatus === "active" && (
                                <button
                                  type="button"
                                  disabled={actionLoading === runner.userId}
                                  onClick={() => handleAction(runner.userId, "suspend")}
                                  title="Suspend"
                                  className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50"
                                >
                                  <PauseCircle size={16} />
                                </button>
                              )}
                              {runner._rawStatus === "suspended" && (
                                <button
                                  type="button"
                                  disabled={actionLoading === runner.userId}
                                  onClick={() => handleAction(runner.userId, "suspend")}
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
                        <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                          No runner applications match your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between border-t border-[#eee8e2] px-6 py-4 text-xs text-[#736860]">
              <span>Showing {filteredRunners.length} of {totalCount} applications</span>
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
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{reviewModal.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{reviewModal.id} • {reviewModal.department}</p>
                </div>
              </div>
              <button onClick={() => setReviewModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-2.5 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Mail size={14} /> Email</span>
                  <span className="font-bold text-slate-800">{reviewModal.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Phone size={14} /> Phone</span>
                  <span className="font-bold text-slate-800">{reviewModal.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><GraduationCap size={14} /> University ID</span>
                  <span className="font-bold text-slate-800">{reviewModal.universityId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Bike size={14} /> Vehicle Type</span>
                  <span className="font-bold text-slate-800">{reviewModal.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Clock3 size={14} /> Total Trips</span>
                  <span className="font-bold text-slate-800">{reviewModal.totalTrips}</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200/60 flex items-center justify-between">
                <span className="font-bold text-emerald-800">UIU Student Verification</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded text-[11px]">Enrolled</span>
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
                Approve Runner
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