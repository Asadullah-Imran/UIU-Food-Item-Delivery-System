import React, { useEffect, useState, useCallback } from "react";
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
  Users,
  ShoppingCart,
  Banknote,
  Star,
  Download,
  Gavel,
  ArrowRight,
  CircleCheck,
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard/admin",
      active: true,
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
    },
    {
      label: "Admin Profile",
      icon: CircleUserRound,
      path: "/dashboard/admin/profile",
    },
  ];

  const iconMap = {
    students: Users,
    shops: Store,
    runners: Bike,
    ordersToday: ShoppingCart,
    dailyRevenue: Banknote,
    rating: Star,
  };

  // ---------------------------------------------------------------------------
  // Fetch live dashboard metrics
  // ---------------------------------------------------------------------------
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/dashboard", {
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        navigate("/login");
        return;
      }

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to load dashboard metrics");
      }

      setDashboardData(result.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleMenuClick = (path) => {
    if (path) navigate(path);
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
  const stats = (dashboardData?.statCards || [
    { id: "students", label: "Students", value: "—", change: "Loading...", bg: "bg-blue-100", color: "text-blue-700" },
    { id: "shops", label: "Active Shops", value: "—", change: "Loading...", bg: "bg-cyan-100", color: "text-cyan-700" },
    { id: "runners", label: "Runners", value: "—", change: "Loading...", bg: "bg-orange-100", color: "text-orange-700" },
    { id: "ordersToday", label: "Orders Today", value: "—", change: "Loading...", bg: "bg-blue-100", color: "text-blue-700" },
    { id: "dailyRevenue", label: "Daily Revenue", value: "—", change: "Loading...", bg: "bg-green-100", color: "text-green-700" },
    { id: "rating", label: "Avg. Rating", value: "—", change: "Loading...", bg: "bg-yellow-100", color: "text-yellow-700" },
  ]).map((s) => ({
    ...s,
    icon: iconMap[s.id] || Store,
  }));

  // Approval Pipeline
  const pendingShopOwnersCount = dashboardData?.pipeline?.pendingShopOwners ?? 0;
  const pendingRunnersCount = dashboardData?.pipeline?.pendingRunners ?? 0;

  // Complaint overview
  const complaintOverview = dashboardData?.complaintOverview || {
    open: 0,
    resolved: 0,
    critical: 0,
  };

  // Activities
  const activities = (dashboardData?.recentActivities || []).map((a) => {
    let Icon = CircleCheck;
    if (a.type === "shop") Icon = Store;
    else if (a.type === "runner") Icon = Bike;
    else if (a.type === "complaint") Icon = TriangleAlert;
    else if (a.type === "order") Icon = ShoppingCart;

    return {
      ...a,
      icon: Icon,
    };
  });

  // Daily Order Volume (last 7 days)
  const dailyVolume = dashboardData?.dailyOrderVolume || [];

  // Monthly Revenue Growth
  const monthlyRevenue = dashboardData?.monthlyRevenue || [];

  // Popular Shops
  const popularShops = dashboardData?.popularShops || [];
  const topShop = popularShops[0];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#231f1c]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[250px] border-r border-[#ece6df] bg-white">
        <div className="px-6 py-7">
          <h1 className="text-xl font-bold text-orange-500">
            UIU Food and Items
          </h1>
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
                  ? "bg-[#ff7a18] font-semibold text-[#24170d]"
                  : "text-[#51463f] hover:bg-orange-50"
              } ${path ? "cursor-pointer" : "cursor-default"}`}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span className="max-w-[150px]">{label}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[15px] text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* RIGHT SIDE */}
      <div className="ml-[250px] min-h-screen">
        {/* HEADER */}
        <header className="flex h-[70px] items-center justify-between border-b border-[#eee8e2] bg-white px-6">
          <div className="flex w-[380px] items-center gap-3 rounded-full bg-[#f5f2ef] px-5 py-3">
            <Search size={20} className="text-[#433b35]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, shops, or students..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-4 border-l border-[#eee7df] pl-6">
            <span className="text-sm font-semibold">{adminName}</span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-100 text-sm font-bold text-orange-600">
              {adminInitials}
            </div>
          </div>
        </header>

        {/* DASHBOARD MAIN */}
        <main className="p-6">
          {/* ERROR BANNER */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                type="button"
                onClick={() => fetchDashboardData()}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}

          {/* WELCOME & ACTION BAR */}
          <div className="mb-7 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[30px] font-bold tracking-tight">
                  Welcome Back, {adminName} 👋
                </h2>
                <button
                  type="button"
                  title="Refresh Dashboard"
                  onClick={() => fetchDashboardData(true)}
                  disabled={refreshing}
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-orange-600"
                >
                  <RefreshCw
                    size={18}
                    className={refreshing ? "animate-spin text-orange-600" : ""}
                  />
                </button>
              </div>

              <p className="mt-1 max-w-[650px] text-[16px] leading-6 text-[#66584e]">
                Monitor real-time platform activity and university food delivery
                operations efficiently.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/reports")}
              className="flex h-[60px] w-[255px] items-center justify-center gap-4 rounded-lg bg-[#ff7a18] font-semibold text-[#24170d] transition hover:bg-orange-600"
            >
              <Download size={20} />
              <span>
                Generate Weekly
                <br />
                Report
              </span>
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="mb-8 grid grid-cols-6 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#eee7df] bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
                  >
                    <Icon size={21} className={stat.color} />
                  </div>

                  <p className="text-xs text-[#5e554e]">{stat.label}</p>

                  <p className="mt-1 text-[22px] font-bold">
                    {loading ? (
                      <span className="inline-block h-6 w-16 animate-pulse rounded bg-gray-200" />
                    ) : (
                      stat.value
                    )}
                  </p>

                  <p className="mt-1 text-[11px] text-[#8b776a] truncate">
                    {stat.change}
                  </p>
                </div>
              );
            })}
          </div>

          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-[2fr_1fr] gap-5">
            {/* LEFT SIDE */}
            <div>
              {/* APPROVAL PIPELINE CARDS */}
              <div className="mb-5 grid grid-cols-2 gap-5">
                <ApprovalCard
                  icon={<Store size={22} />}
                  title="Shop Owner Requests"
                  pending={
                    loading
                      ? "Loading..."
                      : `${pendingShopOwnersCount} application${pendingShopOwnersCount === 1 ? "" : "s"} pending`
                  }
                  badgeColor={pendingShopOwnersCount > 0 ? "text-orange-700 bg-orange-100" : "text-green-700 bg-green-100"}
                  onClick={() => navigate("/dashboard/admin/shop-owners")}
                />

                <ApprovalCard
                  icon={<Bike size={22} />}
                  title="Runner Applications"
                  pending={
                    loading
                      ? "Loading..."
                      : `${pendingRunnersCount} application${pendingRunnersCount === 1 ? "" : "s"} pending`
                  }
                  badgeColor={pendingRunnersCount > 0 ? "text-orange-700 bg-orange-100" : "text-green-700 bg-green-100"}
                  onClick={() => navigate("/dashboard/admin/runners")}
                />
              </div>

              {/* CHARTS */}
              <div className="mb-5 grid grid-cols-2 gap-5">
                {/* DAILY ORDER VOLUME */}
                <div className="h-[310px] rounded-2xl border border-[#eee7df] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Daily Order Volume</h3>

                    <span className="rounded bg-[#f3f0ed] px-2 py-1 text-xs text-[#655c55]">
                      Last 7 Days
                    </span>
                  </div>

                  {loading ? (
                    <div className="flex h-[210px] items-center justify-center">
                      <Loader2 size={24} className="animate-spin text-orange-500" />
                    </div>
                  ) : dailyVolume.length === 0 ? (
                    <div className="flex h-[210px] items-center justify-center text-xs text-gray-500">
                      No order data available yet.
                    </div>
                  ) : (
                    <div className="mt-6 flex h-[200px] flex-col justify-end">
                      <div className="flex h-[170px] items-end justify-between gap-2 px-2">
                        {dailyVolume.map((item) => (
                          <div
                            key={item.date}
                            className="group relative flex h-full flex-1 flex-col items-center justify-end"
                          >
                            {/* Tooltip */}
                            <div className="absolute -top-8 hidden rounded bg-gray-800 px-2 py-1 text-[10px] text-white group-hover:block whitespace-nowrap z-10">
                              {item.orders} orders (৳{item.platformFee})
                            </div>

                            <div
                              style={{ height: `${item.percentage || 15}%` }}
                              className={`w-full max-w-[28px] rounded-t transition-all ${
                                item.isToday
                                  ? "bg-orange-500"
                                  : "bg-orange-200 hover:bg-orange-300"
                              }`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Day Labels */}
                      <div className="mt-3 flex justify-between px-2 text-[10px] font-medium text-[#7d7168]">
                        {dailyVolume.map((item) => (
                          <span
                            key={item.date}
                            className={item.isToday ? "font-bold text-orange-600" : ""}
                          >
                            {item.day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* REVENUE GROWTH */}
                <div className="h-[310px] rounded-2xl border border-[#eee7df] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Revenue Growth</h3>

                    <span className="rounded bg-[#f3f0ed] px-2 py-1 text-xs text-[#655c55]">
                      Monthly
                    </span>
                  </div>

                  {loading ? (
                    <div className="flex h-[210px] items-center justify-center">
                      <Loader2 size={24} className="animate-spin text-orange-500" />
                    </div>
                  ) : (
                    <div className="mt-6 flex h-[200px] flex-col justify-between">
                      <div className="space-y-3 pt-2">
                        {monthlyRevenue.map((m) => (
                          <div key={m.key} className="flex items-center justify-between text-xs">
                            <span className={`font-medium ${m.isCurrent ? "text-orange-600 font-bold" : "text-[#655c55]"}`}>
                              {m.month} {m.year}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-[#8b776a]">{m.orders} orders</span>
                              <span className={`font-semibold ${m.isCurrent ? "text-orange-600" : "text-[#231f1c]"}`}>
                                ৳ {m.revenue?.toLocaleString() || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-end justify-around border-t border-[#eee7df] pt-3 text-[11px] text-[#665b53]">
                        {monthlyRevenue.map((m) => (
                          <span
                            key={m.key}
                            className={m.isCurrent ? "font-semibold text-orange-600" : ""}
                          >
                            {m.month}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* POPULAR SHOPS */}
              <div className="rounded-2xl border border-[#eee7df] bg-white p-7 shadow-sm">
                <h3 className="font-semibold">Most Popular Campus Shops</h3>

                {loading ? (
                  <div className="flex h-[170px] items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-orange-500" />
                  </div>
                ) : popularShops.length === 0 ? (
                  <div className="mt-6 py-8 text-center text-sm text-gray-500">
                    No completed shop orders recorded yet.
                  </div>
                ) : (
                  <div className="mt-6 flex items-center justify-around">
                    {/* Donut Visual */}
                    <div className="flex h-[170px] w-[170px] items-center justify-center rounded-full bg-[#4b6175] shadow-inner">
                      <div className="flex h-[140px] w-[140px] flex-col items-center justify-center rounded-full bg-white shadow-sm">
                        <span className="text-2xl font-bold text-[#231f1c]">
                          {topShop ? `${topShop.percentage}%` : "0%"}
                        </span>
                        <span className="text-xs text-[#665b53] max-w-[110px] truncate text-center px-1">
                          {topShop ? topShop.name : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      {popularShops.map((shop) => (
                        <Legend
                          key={shop.shopId || shop.name}
                          color={shop.color}
                          label={shop.name}
                          value={`${shop.percentage}%`}
                          orderCount={shop.orderCount}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-5">
              {/* COMPLAINTS OVERVIEW */}
              <div className="rounded-2xl border border-[#f3b17e] bg-[#ffd9c0] p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-[#3a1605]">
                  <Gavel size={20} />
                  <h3 className="font-semibold">Complaint Overview</h3>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <ComplaintBox
                    value={loading ? "…" : complaintOverview.open}
                    label="OPEN"
                  />

                  <ComplaintBox
                    value={loading ? "…" : complaintOverview.resolved}
                    label="SOLVED"
                    color="text-green-700"
                  />

                  <ComplaintBox
                    value={loading ? "…" : complaintOverview.critical}
                    label="CRITICAL"
                    color="text-red-700"
                    danger={complaintOverview.critical > 0}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/admin/complaints")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3a1605] py-3 font-semibold text-white transition hover:bg-[#522108]"
                >
                  View Complaints
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* RECENT ACTIVITIES */}
              <div className="rounded-2xl border border-[#eee7df] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-semibold">Recent Activities</h3>

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/admin/complaints")}
                    className="text-xs font-semibold text-orange-700 hover:underline"
                  >
                    View All
                  </button>
                </div>

                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-orange-500" />
                  </div>
                ) : activities.length === 0 ? (
                  <p className="text-center text-xs text-[#8b776a] py-6">
                    No recent activity recorded.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {activities.map((activity) => {
                      const Icon = activity.icon;

                      return (
                        <div key={activity.id} className="flex gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.style}`}
                          >
                            <Icon size={16} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate">
                              {activity.title}
                            </p>

                            <p className="mt-0.5 text-xs leading-5 text-[#594d45] line-clamp-2">
                              {activity.description}
                            </p>

                            <p className="mt-1 text-[11px] text-[#8b776a]">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable Subcomponents
// ---------------------------------------------------------------------------
function ApprovalCard({ icon, title, pending, badgeColor = "text-orange-700 bg-orange-100", onClick }) {
  return (
    <div className="rounded-2xl border border-[#eee7df] bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-5 flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${badgeColor}`}>
          {icon}
        </div>

        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-[#665b53]">{pending}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-lg border border-[#dfcec0] bg-[#faf8f5] py-3 font-semibold text-[#a4480a] transition hover:bg-orange-50"
      >
        Review Applications
      </button>
    </div>
  );
}

function ComplaintBox({ value, label, color = "", danger = false }) {
  return (
    <div
      className={`rounded-lg p-3 text-center transition ${
        danger ? "border border-red-300 bg-red-100" : "bg-white/70"
      }`}
    >
      <p className={`text-[22px] font-bold ${color}`}>{value}</p>
      <p className="text-[10px] font-semibold tracking-wider text-[#5a4f48]">{label}</p>
    </div>
  );
}

function Legend({ color, label, value, orderCount }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 shrink-0 rounded-full ${color}`} />
      <span className="text-[#66594f] max-w-[120px] truncate" title={label}>
        {label}
      </span>
      <strong className="text-xs">{value}</strong>
      {orderCount !== undefined && (
        <span className="text-[10px] text-[#938276]">({orderCount})</span>
      )}
    </div>
  );
}