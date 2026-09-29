import React, { useCallback, useEffect, useRef, useState } from "react";
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
  MessagesSquare,
  TicketCheck,
  RefreshCw,
  CircleCheck,
  BadgeAlert,
  Timer,
  Mail,
  ClipboardList,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  ShieldAlert,
  ArrowUpDown,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------
const API = {
  list: (params) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== "All"))
    ).toString();
    return fetch(`/api/admin/complaints${qs ? `?${qs}` : ""}`, {
      headers: authHeaders(),
    });
  },
  get: (id) =>
    fetch(`/api/admin/complaints/${encodeURIComponent(id)}`, {
      headers: authHeaders(),
    }),
  status: (id, status) =>
    fetch(`/api/admin/complaints/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    }),
  priority: (id, priority) =>
    fetch(`/api/admin/complaints/${encodeURIComponent(id)}/priority`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ priority }),
    }),
  resolve: (id, adminResolution) =>
    fetch(`/api/admin/complaints/${encodeURIComponent(id)}/resolve`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ adminResolution }),
    }),
  escalate: (id, adminResolution) =>
    fetch(`/api/admin/complaints/${encodeURIComponent(id)}/escalate`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ adminResolution }),
    }),
};

// ---------------------------------------------------------------------------
// Sidebar menu
// ---------------------------------------------------------------------------
const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
  { label: "Approve Shop Owners", icon: UserCheck, path: "/dashboard/admin/shop-owners" },
  { label: "Approve Delivery Runners", icon: Bike, path: "/dashboard/admin/runners" },
  { label: "Manage Shops", icon: Store, path: "/dashboard/admin/shops" },
  { label: "Complaint Management", icon: TriangleAlert, path: "/dashboard/admin/complaints", active: true },
  { label: "Reports & Analytics", icon: ChartNoAxesColumn, path: "/dashboard/admin/reports" },
  { label: "Admin Profile", icon: CircleUserRound, path: "/dashboard/admin/profile" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function roleStyle(role) {
  if (role === "shop" || role === "Vendor") return "bg-orange-100 text-orange-600";
  if (role === "runner" || role === "Runner") return "bg-green-100 text-green-600";
  return "bg-blue-100 text-blue-600";
}

function roleLabel(role) {
  if (!role) return "Student";
  if (role === "shop") return "Vendor";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-green-50 border-green-200 text-green-700";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-3 shadow-lg text-sm ${colors}`}
    >
      {type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PriorityBadge
// ---------------------------------------------------------------------------
function PriorityBadge({ priority }) {
  const styles = {
    High:   "bg-red-100 text-red-600",
    Medium: "bg-orange-100 text-orange-600",
    Low:    "bg-[#eeece9] text-[#746a62]",
    HIGH:   "bg-red-100 text-red-600",
    MEDIUM: "bg-orange-100 text-orange-600",
    LOW:    "bg-[#eeece9] text-[#746a62]",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-[9px] font-semibold ${styles[priority] || "bg-gray-100 text-gray-600"}`}>
      {priority}
    </span>
  );
}

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------
function StatusBadge({ status }) {
  const styles = {
    Open:        "bg-blue-50 text-blue-600",
    "In Review": "bg-orange-50 text-orange-500",
    Resolved:    "bg-green-50 text-green-600",
    Escalated:   "bg-red-50 text-red-600",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// TicketDetails panel
// ---------------------------------------------------------------------------
function TicketDetails({ ticket, onAction, actionLoading }) {
  const [resolutionNote, setResolutionNote] = useState("");
  const [localStatus, setLocalStatus]       = useState(ticket?.status || "Open");
  const [localPriority, setLocalPriority]   = useState(ticket?.priority || "Medium");

  useEffect(() => {
    if (ticket) {
      setLocalStatus(ticket.status);
      setLocalPriority(ticket.priority);
      setResolutionNote(ticket.adminResolution || "");
    }
  }, [ticket?._id, ticket?.ticketId]);

  if (!ticket) {
    return (
      <aside className="flex items-center justify-center rounded-2xl border border-[#eee8e2] bg-white p-10 shadow-sm text-sm text-[#80756d]">
        Select a complaint to view details.
      </aside>
    );
  }

  const isResolved  = localStatus === "Resolved";
  const isEscalated = localStatus === "Escalated";
  const isMutable   = !isResolved && !isEscalated;

  const submitterName  = ticket.submittedBy?.name  || ticket.submittedByName || "Unknown";
  const submitterEmail = ticket.submittedBy?.email || ticket.email           || "—";
  const submitterRole  = ticket.submittedBy?.role  || ticket.role            || "student";
  const orderRef       = ticket.order?.orderNumber  || ticket.orderNumber    || "—";

  return (
    <aside className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-[#f8f5f1] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#a65414]">TICKET DETAILS</p>
            <h3 className="mt-1 text-sm font-bold">{ticket.ticketId || ticket.id}</h3>
          </div>
          <StatusBadge status={localStatus} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-[9px] font-bold text-[#7a7068]">SUBMITTED BY</p>
            <p className="mt-1 font-semibold">{submitterName}</p>
            <span className={`mt-1 inline-block rounded px-2 py-0.5 text-[9px] ${roleStyle(submitterRole)}`}>
              {roleLabel(submitterRole)}
            </span>
          </div>
          <div>
            <p className="text-[9px] font-bold text-[#7a7068]">CATEGORY</p>
            <p className="mt-1 font-semibold">{ticket.category}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Meta */}
        <div className="space-y-3 text-xs text-[#5e544c]">
          <p className="flex items-center gap-2">
            <Mail size={15} />
            {submitterEmail}
          </p>
          <p className="flex items-center gap-2">
            <ClipboardList size={15} />
            Order: <strong className="text-[#a6520d]">{orderRef}</strong>
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={15} />
            {formatDate(ticket.createdAt)}
          </p>
        </div>

        {/* Message */}
        <div className="mt-6 rounded-lg border border-orange-200 bg-[#fffaf6] p-4">
          <p className="text-[9px] font-bold text-[#a75313]">COMPLAINT MESSAGE</p>
          <p className="mt-3 text-xs italic leading-6 text-[#6b5f56]">
            &ldquo;{ticket.description || ticket.message}&rdquo;
          </p>
        </div>

        {/* Status + Priority controls */}
        {isMutable && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-[9px] font-bold text-[#6f655e]">STATUS</p>
              <select
                value={localStatus}
                onChange={(e) => {
                  setLocalStatus(e.target.value);
                  onAction("status", ticket, e.target.value);
                }}
                disabled={actionLoading}
                className="w-full rounded-lg border border-[#eee8e2] px-2 py-1.5 text-xs outline-none"
                id="detail-status-select"
              >
                <option value="Open">Open</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>
            <div>
              <p className="mb-1 text-[9px] font-bold text-[#6f655e]">PRIORITY</p>
              <select
                value={localPriority}
                onChange={(e) => {
                  setLocalPriority(e.target.value);
                  onAction("priority", ticket, e.target.value);
                }}
                disabled={actionLoading}
                className="w-full rounded-lg border border-[#eee8e2] px-2 py-1.5 text-xs outline-none"
                id="detail-priority-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        )}

        {/* Resolution note */}
        <div className="mt-5">
          <p className="text-[9px] font-bold text-[#6f655e]">
            {isResolved ? "RESOLUTION NOTE" : "INTERNAL INVESTIGATION NOTES"}
          </p>
          <textarea
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            disabled={isResolved || isEscalated || actionLoading}
            placeholder={
              isResolved
                ? ticket.adminResolution || "No resolution note recorded."
                : "Enter resolution details or investigation notes…"
            }
            rows={3}
            className="mt-2 w-full resize-none rounded-lg border border-[#eee8e2] px-3 py-2 text-xs text-[#5e544c] outline-none placeholder:text-[#b0a99f] disabled:bg-[#faf8f5] disabled:cursor-default"
            id="detail-resolution-textarea"
          />
        </div>

        {/* Action buttons */}
        {!isResolved && !isEscalated && (
          <>
            <button
              type="button"
              id="detail-resolve-btn"
              onClick={() => onAction("resolve", ticket, resolutionNote)}
              disabled={actionLoading || !resolutionNote.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#a95306] py-3 text-sm font-semibold text-white hover:bg-[#934805] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={17} />}
              Mark as Resolved
            </button>

            <button
              type="button"
              id="detail-escalate-btn"
              onClick={() => onAction("escalate", ticket, resolutionNote)}
              disabled={actionLoading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-3 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
              Escalate
            </button>
          </>
        )}

        {isResolved && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-xs text-green-700">
            <CheckCircle2 size={15} />
            This complaint has been resolved.
          </div>
        )}

        {isEscalated && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700">
            <ShieldAlert size={15} />
            This complaint has been escalated.
          </div>
        )}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function AdminComplaintManagement() {
  const navigate = useNavigate();

  // Filter / pagination state
  const [search, setSearch]                     = useState("");
  const [debouncedSearch, setDebouncedSearch]   = useState("");
  const [category, setCategory]                 = useState("All");
  const [statusFilter, setStatusFilter]         = useState("All");
  const [priorityFilter, setPriorityFilter]     = useState("All");
  const [sort, setSort]                         = useState("newest");
  const [page, setPage]                         = useState(1);
  const LIMIT = 10;

  // Data state
  const [complaints, setComplaints]     = useState([]);
  const [pagination, setPagination]     = useState({ total: 0, totalPages: 1 });
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  // Detail state
  const [selectedId, setSelectedId]           = useState(null);
  const [detailTicket, setDetailTicket]       = useState(null);
  const [detailLoading, setDetailLoading]     = useState(false);
  const [actionLoading, setActionLoading]     = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // Debounced search
  const debounceRef = useRef(null);
  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  // ---------------------------------------------------------------------------
  // Fetch list
  // ---------------------------------------------------------------------------
  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.list({
        search: debouncedSearch,
        category,
        status: statusFilter,
        priority: priorityFilter,
        sort,
        page,
        limit: LIMIT,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load complaints");
      setComplaints(data.complaints || []);
      setPagination(data.pagination || { total: 0, totalPages: 1 });
      setStats(data.stats || null);
      // Auto-select first if nothing selected
      if (!selectedId && data.complaints?.length > 0) {
        const first = data.complaints[0];
        setSelectedId(first._id || first.ticketId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, statusFilter, priorityFilter, sort, page]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // ---------------------------------------------------------------------------
  // Fetch detail on selection
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!selectedId) return;
    setDetailLoading(true);
    setDetailTicket(null);
    API.get(selectedId)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setDetailTicket(data.complaint);
      })
      .catch(() => {})
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const handleAction = useCallback(
    async (type, ticket, value) => {
      const id = ticket._id || ticket.ticketId;
      setActionLoading(true);
      try {
        let res;
        if (type === "resolve")       res = await API.resolve(id, value);
        else if (type === "escalate") res = await API.escalate(id, value || "");
        else if (type === "status")   res = await API.status(id, value);
        else if (type === "priority") res = await API.priority(id, value);

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Action failed");
        showToast(data.message || "Updated successfully");
        if (data.complaint) setDetailTicket(data.complaint);
        await fetchComplaints();
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setActionLoading(false);
      }
    },
    [fetchComplaints, showToast]
  );

  // ---------------------------------------------------------------------------
  // Stat cards
  // ---------------------------------------------------------------------------
  const statCards = [
    { label: "Total Complaints", key: "total",         icon: MessagesSquare, style: "bg-orange-100 text-orange-600" },
    { label: "Open Tickets",     key: "open",          icon: TicketCheck,    style: "bg-blue-100 text-blue-600" },
    { label: "In Progress",      key: "inReview",      icon: RefreshCw,      style: "bg-orange-50 text-orange-500" },
    { label: "Resolved Today",   key: "resolvedToday", icon: CircleCheck,    style: "bg-green-100 text-green-600" },
    { label: "High Priority",    key: "highPriority",  icon: BadgeAlert,     style: "bg-red-100 text-red-500" },
    { label: "Escalated",        key: "escalated",     icon: Timer,          style: "bg-purple-100 text-purple-600" },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2b241f]">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[250px] border-r border-[#eee7df] bg-white">
        <div className="px-6 py-7">
          <h1 className="text-xl font-bold text-orange-500">UIU Food and Items</h1>
          <p className="mt-1 text-sm text-[#5f554e]">Official Portal</p>
        </div>
        <nav className="mt-3 px-3">
          {menuItems.map(({ label, icon: Icon, path, active }) => (
            <button
              key={label}
              type="button"
              onClick={() => path && navigate(path)}
              className={`mb-2 flex min-h-[50px] w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[15px] transition ${
                active
                  ? "bg-[#ff7a18] font-semibold text-[#24170d]"
                  : "text-[#51463f] hover:bg-orange-50"
              } ${path ? "cursor-pointer" : "cursor-default"}`}
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

      {/* MAIN */}
      <div className="ml-[250px] min-h-screen">
        {/* HEADER */}
        <header className="flex h-[70px] items-center justify-between border-b border-[#eee8e2] bg-white px-8">
          <div className="flex w-[380px] items-center gap-3 rounded-full bg-[#f3f0ed] px-5 py-3">
            <Search size={19} className="text-[#6f655e]" />
            <input
              type="text"
              placeholder="Search for tickets, users…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#96908c]"
            />
          </div>
          <div className="flex items-center gap-4 border-l border-[#eee7df] pl-6">
            <span className="text-sm font-semibold">Admin</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-100 text-xs font-bold text-orange-600">
              A
            </div>
          </div>
        </header>

        <main className="px-8 py-7">
          {/* BREADCRUMB */}
          <div className="mb-3 text-sm text-[#655b54]">
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin")}
              className="hover:text-orange-600"
            >
              Dashboard
            </button>
            <span className="mx-2">›</span>
            <span className="font-semibold text-[#ae520e]">Complaint Management</span>
          </div>

          {/* HEADING */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <h1 className="text-[20px] font-medium">Complaint Management</h1>
              <p className="mt-1 text-sm text-[#71665e]">
                Review, investigate, and resolve complaints submitted across the platform.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="complaints-refresh-btn"
                onClick={fetchComplaints}
                disabled={loading}
                className="flex h-[50px] items-center gap-2 rounded-lg border border-[#eee8e2] bg-white px-4 text-sm text-[#62574f] shadow-sm hover:bg-orange-50 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                type="button"
                className="flex h-[50px] items-center gap-2 rounded-lg bg-[#ff7a18] px-6 text-sm font-medium text-[#3c250f] shadow-sm hover:bg-orange-600"
              >
                <Download size={17} />
                Export Report
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className="mb-7 grid grid-cols-6 gap-4">
            {statCards.map(({ label, key, icon: Icon, style }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#eee8e2] bg-white p-5 shadow-sm"
              >
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${style}`}>
                  <Icon size={19} />
                </div>
                <p className="text-[10px] text-[#786e66]">{label}</p>
                <p className="mt-1 text-[22px] font-bold">
                  {stats ? (stats[key] ?? 0) : (
                    <span className="text-base text-[#bbb]">—</span>
                  )}
                </p>
              </div>
            ))}
          </section>

          {/* ERROR */}
          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
              <AlertCircle size={16} />
              {error}
              <button onClick={fetchComplaints} className="ml-auto text-xs underline hover:no-underline">
                Retry
              </button>
            </div>
          )}

          {/* MAIN AREA */}
          <div className="grid grid-cols-[1.4fr_1fr] items-start gap-5">
            <div>
              {/* FILTERS */}
              <section className="mb-4 rounded-2xl border border-[#eee8e2] bg-white p-4 shadow-sm">
                <div className="mb-3 flex gap-3">
                  <div className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-[#eee8e2] px-4">
                    <Search size={17} className="text-[#766b63]" />
                    <input
                      id="complaint-search"
                      value={search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search by ticket ID, name, subject…"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                    {search && (
                      <button onClick={() => { setSearch(""); setDebouncedSearch(""); setPage(1); }}>
                        <X size={14} className="text-[#a09690]" />
                      </button>
                    )}
                  </div>

                  <select
                    id="complaint-category-filter"
                    value={category}
                    onChange={handleFilterChange(setCategory)}
                    className="rounded-lg border border-[#eee8e2] px-3 text-xs outline-none"
                  >
                    <option value="All">Category: All</option>
                    <option value="Late Delivery">Late Delivery</option>
                    <option value="Wrong Food Items">Wrong Food Items</option>
                    <option value="Spill / Damaged Item">Spill / Damaged Item</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Payment Sync">Payment Sync</option>
                    <option value="Food Quality">Food Quality</option>
                    <option value="App Technical">App Technical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    id="complaint-status-filter"
                    value={statusFilter}
                    onChange={handleFilterChange(setStatusFilter)}
                    className="h-9 rounded-lg border border-[#eee8e2] px-3 text-xs outline-none"
                  >
                    <option value="All">Status: All</option>
                    <option value="Open">Open</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Escalated">Escalated</option>
                  </select>

                  <select
                    id="complaint-priority-filter"
                    value={priorityFilter}
                    onChange={handleFilterChange(setPriorityFilter)}
                    className="h-9 rounded-lg border border-[#eee8e2] px-3 text-xs outline-none"
                  >
                    <option value="All">Priority: All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  <div className="ml-auto flex items-center gap-2 text-[11px]">
                    <ArrowUpDown size={12} className="text-[#a09690]" />
                    <span className="text-[#7a7068]">Sort:</span>
                    {["newest", "oldest"].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSort(s); setPage(1); }}
                        className={`capitalize font-semibold ${sort === s ? "text-[#a54d0b]" : "text-[#7a7068] hover:text-[#a54d0b]"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* TABLE */}
              <section className="overflow-hidden rounded-2xl border border-[#eee8e2] bg-white shadow-sm">
                <table className="w-full table-fixed">
                  <thead className="bg-[#f6f2ee] text-left text-xs text-[#62574f]">
                    <tr>
                      <th className="w-[15%] px-5 py-5">ID</th>
                      <th className="w-[22%] px-4 py-5">Submitted By</th>
                      <th className="w-[20%] px-4 py-5">Category</th>
                      <th className="w-[17%] px-4 py-5">Date</th>
                      <th className="w-[13%] px-4 py-5">Priority</th>
                      <th className="w-[13%] px-4 py-5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="py-14 text-center">
                          <Loader2 size={22} className="mx-auto animate-spin text-orange-400" />
                        </td>
                      </tr>
                    ) : complaints.length > 0 ? (
                      complaints.map((ticket) => {
                        const tid = ticket._id || ticket.ticketId;
                        const name = ticket.submittedBy?.name || ticket.submittedByName || "Unknown";
                        const role = ticket.submittedBy?.role || ticket.role || "student";
                        return (
                          <tr
                            key={tid}
                            onClick={() => setSelectedId(tid)}
                            className={`cursor-pointer border-t border-[#f0ebe7] text-xs transition hover:bg-orange-50 ${
                              selectedId === tid ? "bg-[#fffaf5]" : ""
                            }`}
                          >
                            <td className="px-5 py-4 font-bold text-[#ad530d]">
                              {ticket.ticketId}
                            </td>
                            <td className="px-4 py-4">
                              <p className="font-semibold text-[#453b34]">{name}</p>
                              <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] ${roleStyle(role)}`}>
                                {roleLabel(role)}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-[#62574f]">{ticket.category}</td>
                            <td className="px-4 py-4 text-[#62574f]">{formatDate(ticket.createdAt)}</td>
                            <td className="px-4 py-4"><PriorityBadge priority={ticket.priority} /></td>
                            <td className="px-4 py-4"><StatusBadge status={ticket.status} /></td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-14 text-center text-sm text-[#80756d]">
                          No complaints found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* PAGINATION */}
                <div className="flex items-center justify-between border-t border-[#eee8e2] px-5 py-4">
                  <span className="text-[11px] text-[#71665e]">
                    {pagination.total > 0
                      ? `Showing ${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, pagination.total)} of ${pagination.total} tickets`
                      : "No tickets"}
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      id="complaints-prev-page"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="disabled:opacity-30"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <span className="text-[#62574f]">
                      Page {page} of {pagination.totalPages || 1}
                    </span>
                    <button
                      id="complaints-next-page"
                      disabled={page >= (pagination.totalPages || 1)}
                      onClick={() => setPage((p) => p + 1)}
                      className="disabled:opacity-30"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* DETAIL PANEL */}
            <div>
              {detailLoading ? (
                <div className="flex items-center justify-center rounded-2xl border border-[#eee8e2] bg-white p-16 shadow-sm">
                  <Loader2 size={22} className="animate-spin text-orange-400" />
                </div>
              ) : (
                <TicketDetails
                  ticket={detailTicket}
                  onAction={handleAction}
                  actionLoading={actionLoading}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}