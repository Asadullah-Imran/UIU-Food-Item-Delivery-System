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
  SlidersHorizontal,
  Shapes,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminShopOwnerApproval() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortOrder, setSortOrder] = useState("newest");
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
    active: true,

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

  const applications = [
    {
      id: "#SO-9921",
      shop: "The Brew Station",
      owner: "Rakib Ahmed",
      email: "rakib@gmail.com",
      category: "FOOD & CAFE",
      categoryStyle: "bg-blue-50 text-blue-500",
      status: "Pending",
      date: "2026-09-03",
      emoji: "☕",
    },
    {
      id: "#SO-9922",
      shop: "Stationery Hub",
      owner: "Fatima Zaman",
      email: "fzaman@gmail.com",
      category: "STATIONERY",
      categoryStyle: "bg-purple-50 text-purple-500",
      status: "Pending",
      date: "2026-09-02",
      emoji: "🗃️",
    },
    {
      id: "#SO-9918",
      shop: "Quick Bites Express",
      owner: "Sohail Kabir",
      email: "skabir@gmail.com",
      category: "FAST FOOD",
      categoryStyle: "bg-blue-50 text-blue-500",
      status: "Approved",
      date: "2026-08-31",
      emoji: "🍜",
    },
  ];

  const filteredApplications = useMemo(() => {
    let result = [...applications];

    if (statusFilter !== "All Statuses") {
      result = result.filter(
        (item) =>
          item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (categoryFilter !== "All Categories") {
      result = result.filter(
        (item) => item.category === categoryFilter
      );
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      }

      return new Date(a.date) - new Date(b.date);
    });

    return result;
  }, [statusFilter, categoryFilter, sortOrder]);

  const handleMenuClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#28211d]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[250px] border-r border-[#eee7df] bg-white">
        <div className="px-6 py-7">
          <h1 className="text-xl font-bold text-orange-500">
            UIU Food and Items
          </h1>

          <p className="mt-1 text-sm text-[#5f554e]">
            Official Portal
          </p>
        </div>

        <nav className="mt-3 px-3">
          {menuItems.map(
            ({ label, icon: Icon, active, path }) => (
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

                <span className="max-w-[155px]">
                  {label}
                </span>
              </button>
            )
          )}

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
              placeholder="Search by shop or owner name..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#96908c]"
            />
          </div>

          <div className="flex items-center gap-4 border-l border-[#eee7df] pl-6">
            <span className="text-sm font-semibold">
              Admin Tonmoy
            </span>

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
              onClick={() => navigate("/admin-preview")}
              className="hover:text-orange-600"
            >
              Dashboard
            </button>

            <span className="mx-2">›</span>

            <span className="font-semibold text-[#ae520e]">
              Shop Owner Approval
            </span>
          </div>

          {/* TITLE */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-medium text-[#3d332d]">
                  Shop Owner Approval
                </h2>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-500">
                  12 Pending Applications
                </span>
              </div>

              <p className="mt-2 max-w-[690px] text-sm leading-5 text-[#71665e]">
                Review new shop owner applications and verify
                eligibility before granting access to the campus
                logistics network.
              </p>
            </div>

            <button
              type="button"
              className="flex h-[58px] w-[180px] items-center justify-center gap-3 rounded-xl bg-[#ff7a18] text-sm font-medium text-white shadow-sm transition hover:bg-orange-600"
            >
              <Download size={18} />

              <span>
                Export
                <br />
                Applications
              </span>
            </button>
          </section>

          {/* STATS */}
          <section className="mb-7 grid grid-cols-4 gap-5">
            <StatCard
              icon={ClipboardList}
              value="12"
              label="Pending Applications"
              iconStyle="bg-orange-100 text-orange-500"
            />

            <StatCard
              icon={BadgeCheck}
              value="08"
              label="Approved This Week"
              iconStyle="bg-green-100 text-green-600"
            />

            <StatCard
              icon={Ban}
              value="02"
              label="Rejected Applications"
              iconStyle="bg-red-100 text-red-500"
            />

            <StatCard
              icon={Store}
              value="42"
              label="Total Registered Shops"
              iconStyle="bg-sky-100 text-sky-600"
            />
          </section>

          {/* FILTERS */}
          <section className="mb-4 flex items-center justify-between rounded-2xl border border-[#eee8e2] bg-white px-6 py-4 shadow-sm">
            <div className="flex gap-4">
              {/* STATUS */}
              <div className="relative">
                <SlidersHorizontal
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#655b54]"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 w-[270px] appearance-none rounded-md bg-[#f4f1ee] pl-10 pr-10 text-sm text-[#544a43] outline-none"
                >
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>Approved</option>
                </select>
              </div>

              {/* CATEGORY */}
              <div className="relative">
                <Shapes
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#655b54]"
                />

                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 w-[270px] appearance-none rounded-md bg-[#f4f1ee] pl-10 pr-10 text-sm text-[#544a43] outline-none"
                >
                  <option>All Categories</option>
                  <option>FOOD & CAFE</option>
                  <option>STATIONERY</option>
                  <option>FAST FOOD</option>
                </select>
              </div>
            </div>

            {/* SORT */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#716860]">
                SORT BY:
              </span>

              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value)
                }
                className="bg-transparent font-medium text-[#b85a13] outline-none"
              >
                <option value="newest">
                  Date Submitted
                </option>
                <option value="oldest">
                  Oldest First
                </option>
              </select>
            </div>
          </section>

          {/* TABLE */}
          <section className="overflow-hidden rounded-2xl border border-[#eee8e2] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-[#f7f5f3] text-left text-xs font-semibold text-[#655b54]">
                  <tr>
                    <th className="w-[10%] px-7 py-5">
                      App ID
                    </th>

                    <th className="w-[17%] px-4 py-5">
                      Shop Details
                    </th>

                    <th className="w-[27%] px-4 py-5">
                      Owner
                    </th>

                    <th className="w-[16%] px-4 py-5">
                      Category
                    </th>

                    <th className="w-[15%] px-4 py-5">
                      Status
                    </th>

                    <th className="w-[15%] px-4 py-5">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map(
                      (application) => (
                        <tr
                          key={application.id}
                          className="h-[125px] border-t border-[#f1ece8] text-sm text-[#5d514a]"
                        >
                          <td className="px-7 py-5">
                            {application.id}
                          </td>

                          <td className="px-4 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e5ded8] bg-[#f8f7f5]">
                                {application.emoji}
                              </div>

                              <span className="max-w-[105px] font-medium text-[#4a403a]">
                                {application.shop}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-5">
                            <p className="font-medium text-[#4a403a]">
                              {application.owner}
                            </p>

                            <p className="mt-1 text-xs text-[#70655e]">
                              {application.email}
                            </p>
                          </td>

                          <td className="px-4 py-5">
                            <span
                              className={`inline-block rounded px-2 py-1 text-[9px] font-bold ${application.categoryStyle}`}
                            >
                              {application.category}
                            </span>
                          </td>

                          <td className="px-4 py-5">
                            <StatusBadge
                              status={application.status}
                            />
                          </td>

                          <td className="px-4 py-5">
                            <button
                              type="button"
                              className="text-xs font-medium text-[#aa550f] hover:underline"
                            >
                              {application.status ===
                              "Pending"
                                ? "Review"
                                : "Details"}
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-16 text-center text-sm text-[#82776f]"
                      >
                        No applications match the
                        selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between border-t border-[#f1ece8] px-7 py-5 text-xs text-[#70665f]">
              <span>
                Showing{" "}
                {filteredApplications.length === 0 ? 0 : 1}{" "}
                to {filteredApplications.length} of 12
                applications
              </span>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  className="text-[#8a817b] disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>

                {[1, 2, 3].map((number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => setPage(number)}
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${
                      page === number
                        ? "bg-[#a8540c] font-semibold text-white"
                        : "text-[#615750] hover:bg-orange-50"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === 3}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(3, current + 1)
                    )
                  }
                  className="text-[#574e48] disabled:opacity-30"
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

function StatCard({
  icon: Icon,
  value,
  label,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-[#eee8e2] bg-white p-5 shadow-sm">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${iconStyle}`}
      >
        <Icon size={20} />
      </div>

      <p className="text-[24px] font-bold leading-none text-[#2b2420]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#6d625b]">
        {label}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const approved = status === "Approved";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        approved
          ? "bg-green-50 text-green-600"
          : "bg-orange-50 text-orange-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          approved
            ? "bg-green-500"
            : "bg-orange-500"
        }`}
      />

      {status}
    </span>
  );
}