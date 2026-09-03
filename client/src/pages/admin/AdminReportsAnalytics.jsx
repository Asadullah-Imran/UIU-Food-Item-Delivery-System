import React, { useState } from "react";
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
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminReportsAnalytics() {
  const navigate = useNavigate();

  const [range, setRange] = useState("Last 7 Days");
  const [page, setPage] = useState(1);

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

  const stats = [
    {
      label: "Total Orders",
      value: "1,284",
      icon: ShoppingCart,
      iconStyle: "bg-orange-100 text-orange-600",
      border: "border-l-[#b65a08]",
    },
    {
      label: "Total Revenue (BDT)",
      value: "452,900",
      icon: Banknote,
      iconStyle: "bg-blue-100 text-blue-600",
      border: "border-l-orange-400",
    },
    {
      label: "Completed Deliveries",
      value: "1,120",
      icon: CircleCheck,
      iconStyle: "bg-sky-100 text-sky-600",
      border: "border-l-sky-600",
    },
    {
      label: "Active Shops",
      value: "42",
      icon: Store,
      iconStyle: "bg-stone-100 text-slate-600",
      border: "border-l-slate-500",
    },
    {
      label: "Active Students",
      value: "3,450",
      icon: GraduationCap,
      iconStyle: "bg-orange-100 text-orange-600",
      border: "border-l-[#a44e07]",
    },
    {
      label: "Avg Platform Rating",
      value: "4.82",
      icon: Star,
      iconStyle: "bg-sky-100 text-sky-600",
      border: "border-l-sky-400",
    },
    {
      label: "Avg Delivery Time",
      value: "18m 42s",
      icon: Clock3,
      iconStyle: "bg-blue-100 text-blue-600",
      border: "border-l-slate-500",
    },
    {
      label: "Total Complaints",
      value: "24",
      icon: TriangleAlert,
      iconStyle: "bg-red-100 text-red-500",
      border: "border-l-red-500",
    },
  ];

  const orderedItems = [
    {
      item: "Beef Burger",
      shop: "Chef's Table",
      category: "Food",
      categoryStyle: "bg-orange-100 text-orange-600",
      qty: "1,240",
      revenue: "BDT 248,000",
      rating: "4.9",
      status: "In Stock",
      statusStyle: "text-green-600",
    },
    {
      item: "A4 Notebook Set",
      shop: "Pixels",
      category: "Supplies",
      categoryStyle: "bg-blue-100 text-blue-600",
      qty: "850",
      revenue: "BDT 42,500",
      rating: "4.7",
      status: "In Stock",
      statusStyle: "text-green-600",
    },
    {
      item: "Iced Americano",
      shop: "North End",
      category: "Beverage",
      categoryStyle: "bg-orange-100 text-orange-600",
      qty: "720",
      revenue: "BDT 57,600",
      rating: "4.5",
      status: "Low Stock",
      statusStyle: "text-orange-600",
    },
  ];

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
            onClick={() => navigate("/")}
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
              placeholder="Search reports, shops, or runners..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-4 border-l border-[#eee7df] pl-6">
            <span className="text-sm font-semibold">Admin Tonmoy</span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-100 text-xs font-bold text-orange-600">
              AT
            </div>
          </div>
        </header>

        <main className="px-8 py-7">
          {/* BREADCRUMB */}
          <div className="mb-3 text-sm text-[#655b54]">
            <button
              type="button"
              onClick={() => navigate("/admin-preview")}
              className="hover:text-orange-600"
            >
              Dashboard
            </button>

            <span className="mx-2">›</span>

            <span className="font-semibold text-[#ae520e]">
              Reports & Analytics
            </span>
          </div>

          {/* HEADING */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <h1 className="text-[20px] font-medium text-[#a9510c]">
                Reports & Analytics
              </h1>

              <p className="mt-1 max-w-[560px] text-sm leading-5 text-[#71665e]">
                Analyze platform performance, monitor trends, and generate
                downloadable reports for university stakeholders.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex h-[58px] w-[150px] items-center justify-center gap-2 rounded-xl border border-[#bd5b10] bg-white text-sm font-medium text-[#a34b09]"
              >
                <FileSpreadsheet size={19} />
                <span>
                  Export
                  <br />
                  Excel/CSV
                </span>
              </button>

              <button
                type="button"
                className="flex h-[58px] w-[175px] items-center justify-center gap-2 rounded-xl bg-[#a95205] text-sm font-medium text-white shadow-sm hover:bg-[#914600]"
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
                Jul 12, 2026 - Jul 19, 2026
              </div>

              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center text-orange-600"
              >
                <SlidersHorizontal size={18} />
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
                  className={`rounded-2xl border border-[#eee8e2] border-l-[3px] ${stat.border} bg-white p-5 shadow-sm`}
                >
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconStyle}`}
                  >
                    <Icon size={20} />
                  </div>

                  <p className="text-xs text-[#776b63]">{stat.label}</p>
                  <p className="mt-1 text-[23px] font-bold">{stat.value}</p>
                </div>
              );
            })}
          </section>

          {/* CATEGORY DONUT */}
          <section className="mx-auto mb-7 w-[300px] rounded-2xl border border-[#eee8e2] bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-sm font-medium">Orders by Category</h3>

            <div className="mx-auto flex h-[160px] w-[160px] items-center justify-center rounded-full bg-[conic-gradient(#4b6175_0deg_234deg,#007a9f_234deg_306deg,#ff7a18_306deg_360deg)]">
              <div className="flex h-[125px] w-[125px] flex-col items-center justify-center rounded-full bg-white">
                <strong className="text-xl">1.2k</strong>
                <span className="text-xs text-[#70665f]">Total</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Legend color="bg-orange-500" label="Food & Cafe" value="65%" />
              <Legend color="bg-[#4b6175]" label="Stationery" value="20%" />
              <Legend color="bg-[#007a9f]" label="Medicine" value="15%" />
            </div>
          </section>

          {/* TOP SHOPS + RUNNERS */}
          <section className="mb-5 grid grid-cols-2 gap-5">
            <RankingCard title="Top 5 Shops">
              <RankShop
                rank="01"
                name="Chef's table"
                subtitle="842 Orders"
                amount="BDT 124k"
                rating="4.9 ★"
              />

              <RankShop
                rank="02"
                name="Pizzaburg"
                subtitle="510 Orders"
                amount="BDT 45k"
                rating="4.7 ★"
              />

              <RankShop
                rank="03"
                name="Pixels"
                subtitle="420 Orders"
                amount="BDT 38k"
                rating="4.5 ★"
              />
            </RankingCard>

            <RankingCard title="Top 5 Runners">
              <RankRunner
                rank="01"
                initials="AA"
                name="Ahmed Ali"
                subtitle="154 Deliveries"
                performance="98% On-time"
                rating="5.0 ★"
                color="bg-orange-100 text-orange-600"
              />

              <RankRunner
                rank="02"
                initials="RK"
                name="Rahat Khan"
                subtitle="142 Deliveries"
                performance="95% On-time"
                rating="4.9 ★"
                color="bg-blue-100 text-blue-600"
              />

              <RankRunner
                rank="03"
                initials="JS"
                name="Jasim Sheikh"
                subtitle="128 Deliveries"
                performance="94% On-time"
                rating="4.8 ★"
                color="bg-sky-100 text-sky-600"
              />
            </RankingCard>
          </section>

          {/* INSIGHTS */}
          <section className="mb-5 grid grid-cols-3 gap-5">
            <InsightCard
              icon={Package}
              title="Delivery Performance"
              topColor="border-t-[#ad5207]"
            >
              <Metric label="Avg Delivery Time" value="18.5 mins" />

              <div className="my-4 h-2 overflow-hidden rounded-full bg-[#eee8e2]">
                <div className="h-full w-[94%] bg-[#ad5207]" />
              </div>

              <Metric
                label="On-time Rate"
                value="94.2%"
                valueClass="text-green-600"
              />

              <Metric label="Peak Hour" value="1:00 PM - 2:30 PM" />
            </InsightCard>

            <InsightCard
              icon={TrendingUp}
              title="Revenue Insights"
              topColor="border-t-slate-600"
            >
              <Metric label="Avg Order Value" value="BDT 350.50" />
              <Metric
                label="Highest Single Day"
                value="Oct 14 (BDT 82k)"
              />
            </InsightCard>

            <InsightCard
              icon={ChartNoAxesCombined}
              title="Complaint Insights"
              topColor="border-t-red-500"
            >
              <Metric
                label="Resolution Rate"
                value="98%"
                valueClass="text-green-600"
              />
              <Metric label="Avg Resolution Time" value="1.2 hours" />
              <Metric label="Most Common Issue" value="Item Mismatch" />
            </InsightCard>
          </section>

          {/* MOST ORDERED ITEMS */}
          <section className="overflow-hidden rounded-2xl border border-[#eee8e2] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#eee8e2] px-6 py-5">
              <h3 className="text-sm font-medium">Most Ordered Items</h3>

              <div className="flex items-center gap-3">
                <Filter size={16} />
                <MoreVertical size={17} />
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
                  {orderedItems.map((item) => (
                    <tr
                      key={item.item}
                      className="border-t border-[#eee8e2] text-xs"
                    >
                      <td className="px-6 py-5 font-semibold">{item.item}</td>
                      <td className="px-4 py-5">{item.shop}</td>

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
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#eee8e2] px-6 py-4">
              <span className="text-[11px] text-[#756a62]">
                Showing 1-10 of 124 items
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>

                {[1, 2].map((number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => setPage(number)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-xs ${
                      page === number
                        ? "bg-[#a65306] font-semibold text-white"
                        : "border border-[#eee3da]"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === 2}
                  onClick={() => setPage((p) => Math.min(2, p + 1))}
                  className="disabled:opacity-30"
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

function Legend({ color, label, value }) {
  return (
    <div className="flex items-center text-xs">
      <span className={`mr-2 h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
      <strong className="ml-auto">{value}</strong>
    </div>
  );
}

function RankingCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#eee8e2] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <button type="button" className="text-xs text-[#a84f0c]">
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

      <div className="h-9 w-9 rounded-lg bg-[#ece9e6]" />

      <div>
        <p className="text-xs font-semibold">{name}</p>
        <p className="mt-1 text-[10px] text-[#786d65]">{subtitle}</p>
      </div>

      <div className="text-right">
        <p className="text-xs font-semibold">{amount}</p>
        <p className="mt-1 text-[10px] font-semibold text-green-600">
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
        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${color}`}
      >
        {initials}
      </div>

      <div>
        <p className="text-xs font-semibold">{name}</p>
        <p className="mt-1 text-[10px] text-[#786d65]">{subtitle}</p>
      </div>

      <div className="text-right">
        <p className="text-xs font-semibold text-green-600">{performance}</p>
        <p className="mt-1 text-[10px]">{rating}</p>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, topColor, children }) {
  return (
    <div
      className={`min-h-[205px] rounded-2xl border border-[#eee8e2] border-t-[3px] ${topColor} bg-white p-6 shadow-sm`}
    >
      <div className="mb-5 flex items-center gap-2">
        <Icon size={17} className="text-[#a54e0b]" />
        <h3 className="text-xs font-semibold">{title}</h3>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Metric({ label, value, valueClass = "" }) {
  return (
    <div className="flex justify-between gap-4 text-[11px]">
      <span className="text-[#756a62]">{label}</span>
      <strong className={valueClass}>{value}</strong>
    </div>
  );
}