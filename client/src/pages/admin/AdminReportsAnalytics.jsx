import React, { useState, useEffect, useCallback } from "react";
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
  FileSpreadsheet,
  Download,
  CalendarDays,
  SlidersHorizontal,
  ShoppingCart,
  Banknote,
  CircleCheck,
  GraduationCap,
  Star,
  Clock3,
  Package,
  TrendingUp,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ---------------------------------------------------------------------------
// Auth header helper
// ---------------------------------------------------------------------------
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("uiu_auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export default function AdminReportsAnalytics() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [range, setRange] = useState("Last 7 Days");
  const [page, setPage] = useState(1);
  const [itemSearch, setItemSearch] = useState("");
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const [overviewData, setOverviewData] = useState(null);
  const [itemsData, setItemsData] = useState([]);
  const [itemsPagination, setItemsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard/admin",
    },
    {
      label: "Approve Shop Owners",
      icon: UserCheck,
      path: "/dashboard/admin/shop-owners",
    },
    {
      label: "Approve Delivery Runners",
      icon: Bike,
      path: "/dashboard/admin/runners",
    },
    {
      label: "Manage Shops",
      icon: Store,
      path: "/dashboard/admin/shops",
    },
    {
      label: "Complaint Management",
      icon: TriangleAlert,
      path: "/dashboard/admin/complaints",
    },
    {
      label: "Reports & Analytics",
      icon: ChartNoAxesColumn,
      path: "/dashboard/admin/reports",
      active: true,
    },
    {
      label: "Admin Profile",
      icon: CircleUserRound,
      path: "/dashboard/admin/profile",
    },
  ];

  // ---------------------------------------------------------------------------
  // Fetch overview analytics
  // ---------------------------------------------------------------------------
  const fetchOverview = useCallback(async () => {
    setLoadingOverview(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reports/overview?range=${encodeURIComponent(range)}`, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        navigate("/login");
        return;
      }

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to load overview reports");
      }

      setOverviewData(result.data);
    } catch (err) {
      console.error("Overview reports error:", err);
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoadingOverview(false);
    }
  }, [range, navigate]);

  // ---------------------------------------------------------------------------
  // Fetch ordered items report
  // ---------------------------------------------------------------------------
  const fetchItemsReport = useCallback(async () => {
    setLoadingItems(true);
    try {
      const qs = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(itemSearch.trim() ? { search: itemSearch.trim() } : {}),
      }).toString();

      const res = await fetch(`/api/admin/reports/items?${qs}`, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        navigate("/login");
        return;
      }

      const result = await res.json();
      if (res.ok && result.success) {
        setItemsData(result.data.items || []);
        setItemsPagination(
          result.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }
        );
      }
    } catch (err) {
      console.error("Items report error:", err);
    } finally {
      setLoadingItems(false);
    }
  }, [page, itemSearch, navigate]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    fetchItemsReport();
  }, [fetchItemsReport]);

  // Handle Export CSV
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem("token") || localStorage.getItem("uiu_auth_token");
      const res = await fetch(
        `/api/admin/reports/export?format=csv&type=orders&range=${encodeURIComponent(range)}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) throw new Error("Failed to export report");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `uiu_orders_report_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export CSV: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem("token");
    localStorage.removeItem("uiu_auth_token");
    localStorage.removeItem("uiu_mock_user");
    navigate("/login");
  };

  // User details
  const adminName = user?.name || "Administrator";
  const adminInitials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AD";

  // Stat cards mapping
  const kpis = overviewData?.kpis;
  const financials = overviewData?.financials;

  const stats = [
    {
      label: "Total Orders",
      value: kpis ? kpis.totalOrders.toLocaleString() : "—",
      icon: ShoppingCart,
      iconStyle: "bg-orange-100 text-orange-600",
      border: "border-l-[#b65a08]",
    },
    {
      label: "Total Revenue (BDT)",
      value: financials ? financials.grossTotal.toLocaleString() : "—",
      icon: Banknote,
      iconStyle: "bg-blue-100 text-blue-600",
      border: "border-l-orange-400",
    },
    {
      label: "Completed Deliveries",
      value: kpis ? kpis.deliveredOrders.toLocaleString() : "—",
      icon: CircleCheck,
      iconStyle: "bg-sky-100 text-sky-600",
      border: "border-l-sky-600",
    },
    {
      label: "Active Shops",
      value: kpis ? kpis.activeShops.toString() : "—",
      icon: Store,
      iconStyle: "bg-stone-100 text-slate-600",
      border: "border-l-slate-500",
    },
    {
      label: "Active Students",
      value: kpis ? kpis.activeStudents.toLocaleString() : "—",
      icon: GraduationCap,
      iconStyle: "bg-orange-100 text-orange-600",
      border: "border-l-[#a44e07]",
    },
    {
      label: "Avg Platform Rating",
      value: kpis ? kpis.avgPlatformRating.toFixed(2) : "—",
      icon: Star,
      iconStyle: "bg-sky-100 text-sky-600",
      border: "border-l-sky-400",
    },
    {
      label: "Avg Delivery Time",
      value: kpis ? `${Math.round(kpis.avgDeliveryMinutes)}m 30s` : "—",
      icon: Clock3,
      iconStyle: "bg-blue-100 text-blue-600",
      border: "border-l-slate-500",
    },
    {
      label: "Total Complaints",
      value: kpis ? kpis.totalComplaints.toString() : "—",
      icon: TriangleAlert,
      iconStyle: "bg-red-100 text-red-500",
      border: "border-l-red-500",
    },
  ];

  // Category Distribution & Donut
  const categories = overviewData?.categoryDistribution || [];
  const topShops = overviewData?.topShops || [];
  const topRunners = overviewData?.topRunners || [];
  const insights = overviewData?.insights || {
    delivery: { avgDeliveryTime: "18.5 mins", onTimeRate: "94.2%", peakHour: "1:00 PM - 2:30 PM" },
    revenue: { avgOrderValue: "BDT 350.50", highestSingleDay: "N/A" },
    complaint: { resolutionRate: "98%", avgResolutionTime: "1.2 hours", mostCommonIssue: "Item Mismatch" },
  };

  // Build conic-gradient for category donut
  let currentAngle = 0;
  const gradientStops = categories.map((cat, idx) => {
    const start = currentAngle;
    const sliceAngle = (cat.percentage / 100) * 360;
    const end = Math.min(360, start + sliceAngle);
    currentAngle = end;
    const hex = idx === 0 ? "#ff7a18" : idx === 1 ? "#4b6175" : idx === 2 ? "#007a9f" : idx === 3 ? "#d97706" : "#64748b";
    return `${hex} ${start}deg ${end}deg`;
  });
  const conicStyle = gradientStops.length > 0
    ? `conic-gradient(${gradientStops.join(", ")})`
    : "conic-gradient(#ff7a18 0deg 360deg)";

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#29221d]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[250px] border-r border-[#eee7df] bg-white">
        <div className="px-6 py-7">
          <h1 className="text-xl font-bold text-orange-500">
            UIU Food and Items
          </h1>
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
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[15px] font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* PAGE */}
      <div className="ml-[250px] min-h-screen">
        {/* HEADER */}
        <header className="flex h-[70px] items-center justify-between border-b border-[#eee8e2] bg-white px-8">
          <div className="flex w-[420px] items-center gap-3 rounded-full bg-[#f3f0ed] px-5 py-3">
            <Search size={19} className="text-[#6f655e]" />
            <input
              type="text"
              value={itemSearch}
              onChange={(e) => {
                setItemSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search reports, items, or shops..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-4 border-l border-[#eee7df] pl-6">
            <span className="text-sm font-semibold">{adminName}</span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-100 text-xs font-bold text-orange-600">
              {adminInitials}
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

            <span className="font-semibold text-[#ae520e]">
              Reports & Analytics
            </span>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                type="button"
                onClick={fetchOverview}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}

          {/* HEADING */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <h1 className="text-[20px] font-medium text-[#a9510c]">
                Reports & Analytics
              </h1>

              <p className="mt-1 max-w-[560px] text-sm leading-5 text-[#71665e]">
                Analyze live platform performance, monitor trends, and generate
                downloadable reports for university stakeholders.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={exporting}
                className="flex h-[58px] w-[150px] items-center justify-center gap-2 rounded-xl border border-[#bd5b10] bg-white text-sm font-medium text-[#a34b09] transition hover:bg-orange-50 disabled:opacity-50"
              >
                {exporting ? <Loader2 size={19} className="animate-spin text-orange-600" /> : <FileSpreadsheet size={19} />}
                <span>
                  Export
                  <br />
                  Excel/CSV
                </span>
              </button>

              <button
                type="button"
                onClick={handlePrintPDF}
                className="flex h-[58px] w-[175px] items-center justify-center gap-2 rounded-xl bg-[#a95205] text-sm font-medium text-white shadow-sm transition hover:bg-[#914600]"
              >
                <Download size={18} />
                <span>
                  Download PDF
                  <br />
                  Report
                </span>
              </button>
            </div>
          </section>

          {/* DATE FILTER */}
          <section className="mb-7 flex items-center justify-between rounded-2xl border border-[#eee8e2] bg-white p-4 shadow-sm">
            <div className="flex gap-2">
              {["Today", "Last 7 Days", "Last 30 Days", "This Semester"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRange(item)}
                    className={`rounded-lg px-4 py-3 text-xs font-medium transition ${
                      range === item
                        ? "bg-[#ff7a18] text-white"
                        : "bg-[#f3f0ed] text-[#6b6058] hover:bg-orange-50"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 items-center gap-3 rounded-lg border border-orange-200 px-4 text-xs text-[#655b54]">
                <CalendarDays size={16} />
                {overviewData?.dateRange?.label || "Calculating range..."}
              </div>

              <button
                type="button"
                onClick={fetchOverview}
                title="Refresh Analytics"
                className="flex h-12 w-12 items-center justify-center text-orange-600 transition hover:bg-orange-50 rounded-lg"
              >
                <RefreshCw size={18} className={loadingOverview ? "animate-spin" : ""} />
              </button>
            </div>
          </section>

          {/* KPI CARDS */}
          <section className="mb-8 grid grid-cols-4 gap-5">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className={`rounded-2xl border border-[#eee8e2] border-l-[3px] ${stat.border} bg-white p-5 shadow-sm transition hover:shadow-md`}
                >
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconStyle}`}
                  >
                    <Icon size={20} />
                  </div>

                  <p className="text-xs text-[#776b63]">{stat.label}</p>
                  <p className="mt-1 text-[23px] font-bold">
                    {loadingOverview ? (
                      <span className="inline-block h-6 w-16 animate-pulse rounded bg-gray-200" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
              );
            })}
          </section>

          {/* CATEGORY DONUT */}
          <section className="mx-auto mb-7 w-[320px] rounded-2xl border border-[#eee8e2] bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-sm font-medium">Orders by Category</h3>

            {loadingOverview ? (
              <div className="flex h-[160px] items-center justify-center">
                <Loader2 size={24} className="animate-spin text-orange-500" />
              </div>
            ) : (
              <>
                <div
                  style={{ background: conicStyle }}
                  className="mx-auto flex h-[160px] w-[160px] items-center justify-center rounded-full shadow-inner"
                >
                  <div className="flex h-[125px] w-[125px] flex-col items-center justify-center rounded-full bg-white shadow-sm">
                    <strong className="text-xl font-bold">
                      {kpis?.totalOrders ? kpis.totalOrders.toLocaleString() : "0"}
                    </strong>
                    <span className="text-xs text-[#70665f]">Total</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {categories.map((cat) => (
                    <Legend
                      key={cat.category}
                      color={cat.color}
                      label={cat.category}
                      value={`${cat.percentage}%`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* TOP SHOPS + RUNNERS */}
          <section className="mb-5 grid grid-cols-2 gap-5">
            <RankingCard title="Top 5 Shops" onAction={() => navigate("/dashboard/admin/shops")}>
              {loadingOverview ? (
                <div className="py-8 text-center"><Loader2 size={20} className="animate-spin mx-auto text-orange-500" /></div>
              ) : topShops.length === 0 ? (
                <p className="py-6 text-center text-xs text-gray-500">No shop activity recorded in this period.</p>
              ) : (
                topShops.map((shop) => (
                  <RankShop
                    key={shop.shopId || shop.rank}
                    rank={shop.rank}
                    name={shop.name}
                    subtitle={shop.subtitle}
                    amount={shop.amount}
                    rating={shop.rating}
                  />
                ))
              )}
            </RankingCard>

            <RankingCard title="Top 5 Runners" onAction={() => navigate("/dashboard/admin/runners")}>
              {loadingOverview ? (
                <div className="py-8 text-center"><Loader2 size={20} className="animate-spin mx-auto text-orange-500" /></div>
              ) : topRunners.length === 0 ? (
                <p className="py-6 text-center text-xs text-gray-500">No runner activity recorded in this period.</p>
              ) : (
                topRunners.map((runner) => (
                  <RankRunner
                    key={runner.runnerId || runner.rank}
                    rank={runner.rank}
                    initials={runner.initials}
                    name={runner.name}
                    subtitle={runner.subtitle}
                    performance={runner.performance}
                    rating={runner.rating}
                    color={runner.color}
                  />
                ))
              )}
            </RankingCard>
          </section>

          {/* INSIGHTS */}
          <section className="mb-5 grid grid-cols-3 gap-5">
            <InsightCard
              icon={Package}
              title="Delivery Performance"
              topColor="border-t-[#ad5207]"
            >
              <Metric label="Avg Delivery Time" value={insights.delivery.avgDeliveryTime} />

              <div className="my-4 h-2 overflow-hidden rounded-full bg-[#eee8e2]">
                <div
                  style={{ width: insights.delivery.onTimeRate }}
                  className="h-full bg-[#ad5207]"
                />
              </div>

              <Metric
                label="On-time Rate"
                value={insights.delivery.onTimeRate}
                valueClass="text-green-600 font-semibold"
              />

              <Metric label="Peak Hour" value={insights.delivery.peakHour} />
            </InsightCard>

            <InsightCard
              icon={TrendingUp}
              title="Revenue Insights"
              topColor="border-t-slate-600"
            >
              <Metric label="Avg Order Value" value={insights.revenue.avgOrderValue} />
              <Metric
                label="Highest Single Day"
                value={insights.revenue.highestSingleDay}
              />
            </InsightCard>

            <InsightCard
              icon={ChartNoAxesCombined}
              title="Complaint Insights"
              topColor="border-t-red-500"
            >
              <Metric
                label="Resolution Rate"
                value={insights.complaint.resolutionRate}
                valueClass="text-green-600 font-semibold"
              />
              <Metric label="Avg Resolution Time" value={insights.complaint.avgResolutionTime} />
              <Metric label="Most Common Issue" value={insights.complaint.mostCommonIssue} />
            </InsightCard>
          </section>

          {/* MOST ORDERED ITEMS */}
          <section className="overflow-hidden rounded-2xl border border-[#eee8e2] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#eee8e2] px-6 py-5">
              <h3 className="text-sm font-medium">Most Ordered Items</h3>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={fetchItemsReport}
                  title="Reload Items"
                  className="text-xs text-orange-600 hover:underline"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-[#f7f4f1] text-left text-xs text-[#62574f]">
                  <tr>
                    <th className="w-[22%] px-6 py-4">Item Name</th>
                    <th className="w-[18%] px-4 py-4">Shop</th>
                    <th className="w-[15%] px-4 py-4">Category</th>
                    <th className="w-[11%] px-4 py-4">Qty Sold</th>
                    <th className="w-[16%] px-4 py-4">Total Revenue</th>
                    <th className="w-[9%] px-4 py-4">Rating</th>
                    <th className="w-[9%] px-4 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingItems ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center">
                        <Loader2 size={22} className="animate-spin mx-auto text-orange-500" />
                      </td>
                    </tr>
                  ) : itemsData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-gray-500">
                        No item records found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    itemsData.map((item) => (
                      <tr
                        key={item.item + item.shop}
                        className="border-t border-[#eee8e2] text-xs hover:bg-[#faf7f4] transition"
                      >
                        <td className="px-6 py-5 font-semibold truncate">{item.item}</td>
                        <td className="px-4 py-5 truncate">{item.shop}</td>

                        <td className="px-4 py-5">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-medium ${item.categoryStyle}`}
                          >
                            {item.category}
                          </span>
                        </td>

                        <td className="px-4 py-5">{item.qty}</td>

                        <td className="px-4 py-5 font-semibold">
                          {item.revenue}
                        </td>

                        <td className="px-4 py-5 font-semibold text-orange-600">
                          ★ {item.rating}
                        </td>

                        <td
                          className={`px-4 py-5 font-semibold ${item.statusStyle}`}
                        >
                          {item.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between border-t border-[#eee8e2] px-6 py-4">
              <span className="text-[11px] text-[#756a62]">
                Showing Page {itemsPagination.page} of {itemsPagination.totalPages} ({itemsPagination.total} total items)
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded border border-[#eee3da] p-1.5 disabled:opacity-30 hover:bg-orange-50"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(5, itemsPagination.totalPages) }, (_, i) => i + 1).map((number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => setPage(number)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-xs transition ${
                      page === number
                        ? "bg-[#a65306] font-semibold text-white"
                        : "border border-[#eee3da] hover:bg-orange-50"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page >= itemsPagination.totalPages}
                  onClick={() => setPage((p) => Math.min(itemsPagination.totalPages, p + 1))}
                  className="rounded border border-[#eee3da] p-1.5 disabled:opacity-30 hover:bg-orange-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable Presentational Components
// ---------------------------------------------------------------------------
function Legend({ color, label, value }) {
  return (
    <div className="flex items-center text-xs">
      <span className={`mr-2 h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-[#655a52]">{label}</span>
      <strong className="ml-auto font-semibold">{value}</strong>
    </div>
  );
}

function RankingCard({ title, children, onAction }) {
  return (
    <div className="rounded-2xl border border-[#eee8e2] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <button
          type="button"
          onClick={onAction}
          className="text-xs text-[#a84f0c] hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-5">{children}</div>
    </div>
  );
}

function RankShop({ rank, name, subtitle, amount, rating }) {
  return (
    <div className="grid grid-cols-[35px_40px_1fr_auto] items-center gap-3">
      <span className="text-xs font-semibold text-[#a6520d]">{rank}</span>

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 font-bold text-xs">
        {name.charAt(0)}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold truncate">{name}</p>
        <p className="mt-0.5 text-[10px] text-[#786d65]">{subtitle}</p>
      </div>

      <div className="text-right">
        <p className="text-xs font-semibold">{amount}</p>
        <p className="mt-0.5 text-[10px] font-semibold text-green-600">
          {rating}
        </p>
      </div>
    </div>
  );
}

function RankRunner({
  rank,
  initials,
  name,
  subtitle,
  performance,
  rating,
  color,
}) {
  return (
    <div className="grid grid-cols-[35px_40px_1fr_auto] items-center gap-3">
      <span className="text-xs font-semibold text-[#a6520d]">{rank}</span>

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${color}`}
      >
        {initials}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold truncate">{name}</p>
        <p className="mt-0.5 text-[10px] text-[#786d65]">
          {subtitle} • {performance}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs font-semibold text-orange-600">{rating}</p>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, topColor, children }) {
  return (
    <div
      className={`rounded-2xl border border-[#eee8e2] border-t-4 ${topColor} bg-white p-6 shadow-sm`}
    >
      <div className="mb-4 flex items-center gap-3 text-sm font-semibold">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-700">
          <Icon size={17} />
        </div>
        <span>{title}</span>
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Metric({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[#6d625a]">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}