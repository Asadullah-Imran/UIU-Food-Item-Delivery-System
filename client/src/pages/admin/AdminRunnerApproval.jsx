import React, { useMemo, useState } from "react";
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
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  User,
  Phone,
  GraduationCap,
  Calendar,
  CheckCircle2
} from "lucide-react";
import adminData from "../../data/adminData.json";

export default function AdminRunnerApproval() {
  const navigate = useNavigate();

  const [runners, setRunners] = useState(adminData.runnerApplications || []);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const [reviewModal, setReviewModal] = useState(null);
  const [toast, setToast] = useState(null);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
    { label: "Approve Shop Owners", icon: UserCheck, path: "/dashboard/admin/shop-owners" },
    { label: "Approve Delivery Runners", icon: Bike, path: "/dashboard/admin/runners", active: true },
    { label: "Manage Shops", icon: Store, path: "/dashboard/admin/shops" },
    { label: "Complaint Management", icon: TriangleAlert, path: "/dashboard/admin/complaints" },
    { label: "Reports & Analytics", icon: ChartNoAxesColumn, path: "/dashboard/admin/reports" },
    { label: "Admin Profile", icon: CircleUserRound, path: "/dashboard/admin/profile" },
  ];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = (runnerId, newStatus) => {
    setRunners((prev) =>
      prev.map((r) => (r.id === runnerId ? { ...r, status: newStatus } : r))
    );
    showToast(
      `Runner ${runners.find((r) => r.id === runnerId)?.name} is now ${newStatus.toLowerCase()}!`,
      newStatus === "Approved" ? "success" : "warning"
    );
    setReviewModal(null);
  };

  const pendingCount = runners.filter((r) => r.status === "Pending").length;
  const approvedCount = runners.filter((r) => r.status === "Approved").length;
  const rejectedCount = runners.filter((r) => r.status === "Rejected").length;

  const filteredRunners = useMemo(() => {
    return runners.filter((runner) => {
      const keyword = search.trim().toLowerCase();
      const matchesSearch =
        !keyword ||
        runner.name.toLowerCase().includes(keyword) ||
        runner.id.toLowerCase().includes(keyword);

      const matchesDepartment =
        department === "All Departments" || runner.department === department;

      const matchesStatus =
        status === "All Statuses" || runner.status === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [runners, search, department, status]);

  const handleMenuClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#241c16]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-bold text-white ${
              toast.type === "success"
                ? "bg-emerald-600 border-emerald-500"
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
              onClick={() => handleMenuClick(path)}
              className={`mb-2 flex min-h-[50px] w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[15px] transition ${
                active
                  ? "bg-[#ff7a18] font-semibold text-white"
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or ID..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#96908c]"
            />
          </div>

          <div className="flex items-center gap-4 border-l border-[#eee7df] pl-6">
            <span className="text-sm font-semibold">Admin Tonmoy</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-100 text-xs font-bold text-orange-600">
              AT
            </div>
          </div>
        </header>

        {/* CONTENT */}
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
            <span className="font-semibold text-[#ae520e]">Delivery Runner Approval</span>
          </div>

          {/* TITLE */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-medium text-[#3d332d]">
                  Delivery Runner Approval
                </h2>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-500">
                  {pendingCount} Pending Applications
                </span>
              </div>
              <p className="mt-2 max-w-[690px] text-sm leading-5 text-[#71665e]">
                Verify UIU students applying to earn money as campus delivery runners. Review academic status and availability schedule.
              </p>
            </div>

            <button
              type="button"
              onClick={() => showToast("Exporting runner verification reports...", "success")}
              className="flex items-center gap-2 rounded-xl border border-[#b45907] px-4 py-3 text-xs font-semibold text-[#aa5308] transition hover:bg-orange-50"
            >
              <Download size={14} />
              Export List
            </button>
          </section>

          {/* STATS */}
          <section className="mb-8 grid grid-cols-3 gap-5">
            <StatCard
              icon={ClipboardList}
              label="Pending Applications"
              value={pendingCount < 10 ? `0${pendingCount}` : pendingCount}
              style="bg-orange-100 text-orange-600"
            />
            <StatCard
              icon={BadgeCheck}
              label="Active Approved Runners"
              value={approvedCount < 10 ? `0${approvedCount}` : approvedCount}
              style="bg-green-100 text-green-600"
            />
            <StatCard
              icon={Ban}
              label="Rejected / Suspended"
              value={rejectedCount < 10 ? `0${rejectedCount}` : rejectedCount}
              style="bg-red-100 text-red-600"
            />
          </section>

          {/* TABLE CONTAINER */}
          <div className="rounded-2xl border border-[#eee8e2] bg-white shadow-sm">
            {/* FILTERS */}
            <div className="flex items-center justify-between border-b border-[#eee8e2] p-5">
              <div className="flex items-center gap-4">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-lg border border-[#e2dad2] bg-white px-4 py-2.5 text-xs font-medium outline-none"
                >
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="rounded-lg border border-[#e2dad2] bg-white px-4 py-2.5 text-xs font-medium outline-none"
                >
                  <option>All Departments</option>
                  <option>CSE</option>
                  <option>BBA</option>
                  <option>EEE</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 font-semibold">
                Showing {filteredRunners.length} student runners
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-[#fcfaf8] text-[11px] font-semibold text-[#7c7169]">
                    <th className="px-6 py-4">Avatar</th>
                    <th className="px-4 py-4">Student Name & ID</th>
                    <th className="px-4 py-4">Department</th>
                    <th className="px-4 py-4">Availability</th>
                    <th className="px-4 py-4">Phone Number</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRunners.length > 0 ? (
                    filteredRunners.map((runner) => (
                      <tr key={runner.id} className="border-t border-[#f0ebe7] text-sm hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-xs">
                            <User size={18} />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-800">{runner.name}</p>
                          <p className="text-[11px] text-slate-400 font-semibold">ID: {runner.id}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-700">{runner.department}</span>
                          <span className="block text-[11px] text-slate-400">{runner.trimester}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                            <Clock3 size={12} /> {runner.availability}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-600 text-xs font-semibold">{runner.phone}</td>
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
                            {runner.status === "Pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(runner.id, "Approved")}
                                  title="Quick Approve"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(runner.id, "Rejected")}
                                  title="Quick Reject"
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                        No runner applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between border-t border-[#eee8e2] px-6 py-4 text-xs text-[#736860]">
              <span>Showing {filteredRunners.length} runners</span>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded hover:bg-slate-100"><ChevronLeft size={16} /></button>
                <span className="font-bold px-2">Page 1</span>
                <button className="p-1.5 rounded hover:bg-slate-100"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* RUNNER REVIEW MODAL */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{reviewModal.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">Student ID: {reviewModal.id}</p>
                </div>
              </div>
              <button onClick={() => setReviewModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-2.5 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><GraduationCap size={14} /> Department</span>
                  <span className="font-bold text-slate-800">{reviewModal.department} ({reviewModal.trimester})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Calendar size={14} /> Free Slots</span>
                  <span className="font-bold text-slate-800">{reviewModal.availability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Phone size={14} /> Contact Phone</span>
                  <span className="font-bold text-slate-800">{reviewModal.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Bike size={14} /> Vehicle</span>
                  <span className="font-bold text-slate-800">{reviewModal.vehicle}</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200/60 flex items-center justify-between">
                <span className="font-bold text-emerald-800">UIU Student Verification</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded text-[11px]">Active Enrolled</span>
              </div>

              <div className="flex justify-between items-center px-1">
                <span className="font-bold text-slate-600">Approval Status:</span>
                <StatusBadge status={reviewModal.status} />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleUpdateStatus(reviewModal.id, "Approved")}
                disabled={reviewModal.status === "Approved"}
                className={`flex-1 py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                  reviewModal.status === "Approved"
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                }`}
              >
                <Check size={16} /> Approve Runner
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(reviewModal.id, "Rejected")}
                disabled={reviewModal.status === "Rejected"}
                className={`flex-1 py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                  reviewModal.status === "Rejected"
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-rose-50 hover:bg-rose-100 text-rose-600"
                }`}
              >
                <X size={16} /> Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  if (status === "Approved") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-200">
        ● Approved
      </span>
    );
  }
  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600 border border-rose-200">
        ● Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
      ● Pending
    </span>
  );
}