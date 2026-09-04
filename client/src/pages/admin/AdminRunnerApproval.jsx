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
  CircleX,
  Users,
  Radio,
  Star,
  SlidersHorizontal,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminRunnerApproval() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("Pending");
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
        active: true,

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

  const runners = [
    {
      name: "Zubair Ahmed",
      id: "011211045",
      department: "CSE",
      trimester: "4th Trimester",
      availability: "2PM - 6PM",
      phone: "01712345678",
      status: "Pending",
    },
    {
      name: "Sumaiya Islam",
      id: "021201092",
      department: "BBA",
      trimester: "6th Trimester",
      availability: "8AM - 11AM",
      phone: "01887654321",
      status: "Pending",
    },
    {
      name: "Tanvir Ahmed",
      id: "011211045",
      department: "EEE",
      trimester: "9th Trimester",
      availability: "10AM - 2PM",
      phone: "01912345678",
      status: "Pending",
    },
    {
      name: "Nusrat Jahan",
      id: "021212088",
      department: "CSE",
      trimester: "11th Trimester",
      availability: "4PM - 8PM",
      phone: "01512345678",
      status: "Pending",
    },
  ];

  const filteredRunners = useMemo(() => {
    return runners.filter((runner) => {
      const keyword = search.trim().toLowerCase();

      const matchesSearch =
        !keyword ||
        runner.name.toLowerCase().includes(keyword) ||
        runner.id.toLowerCase().includes(keyword);

      const matchesDepartment =
        department === "All Departments" ||
        runner.department === department;

      const matchesStatus =
        status === "All Statuses" ||
        runner.status === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [search, department, status]);

  const stats = [
    {
      label: "Pending",
      value: "08",
      icon: ClipboardList,
      style: "bg-orange-100 text-orange-600",
    },
    {
      label: "Approved/Week",
      value: "24",
      icon: BadgeCheck,
      style: "bg-green-100 text-green-600",
    },
    {
      label: "Rejected",
      value: "03",
      icon: CircleX,
      style: "bg-red-100 text-red-500",
    },
    {
      label: "Active Runners",
      value: "142",
      icon: Users,
      style: "bg-sky-100 text-sky-600",
    },
    {
      label: "Online Now",
      value: "56",
      icon: Radio,
      style: "bg-blue-100 text-blue-600",
    },
    {
      label: "Avg Rating",
      value: "4.9",
      icon: Star,
      style: "bg-orange-100 text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c251f]">
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
            ({ label, icon: Icon, path, active }) => (
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

      {/* PAGE */}
      <div className="ml-[250px] min-h-screen">
        {/* HEADER */}
        <header className="flex h-[70px] items-center justify-between border-b border-[#eee8e2] bg-white px-8">
          <div className="flex w-[650px] items-center gap-3 rounded-full border border-orange-400 bg-[#faf9f7] px-5 py-2.5">
            <Search size={19} className="text-[#6e625a]" />

            <input
              type="text"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-4 border-l border-[#eee7df] pl-6">
            <span className="text-sm font-semibold">
              Admin Tonmoy
            </span>

            <div className="h-10 w-10 rounded-full border-2 border-orange-500 bg-orange-50" />
          </div>
        </header>

        <main className="px-8 py-7">
          {/* HEADING */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[27px] font-semibold tracking-tight">
                  Delivery Runner Approval
                </h1>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#a6500d]">
                  8 Pending Applications
                </span>
              </div>

              <p className="mt-1 text-sm text-[#74685f]">
                Review and verify student applications before granting
                delivery runner access.
              </p>
            </div>

            <button
              type="button"
              className="flex h-[50px] items-center gap-2 rounded-xl bg-[#ff7a18] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
            >
              <Download size={18} />
              Export Applications
            </button>
          </section>

          {/* STATS */}
          <section className="mb-8 grid grid-cols-6 gap-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#eee8e2] bg-white p-5 shadow-sm"
                >
                  <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${item.style}`}
                  >
                    <Icon size={20} />
                  </div>

                  <p className="text-xs text-[#6e625b]">
                    {item.label}
                  </p>

                  <p className="mt-1 text-[22px] font-bold">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </section>

          {/* FILTER SECTION */}
          <section className="mb-7 flex items-center gap-4 rounded-2xl border border-[#eee8e2] bg-white p-4 shadow-sm">
            <div className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-[#eee7e2] px-4">
              <Search size={18} className="text-[#776b63]" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Name, ID or Batch"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#968c85]"
              />
            </div>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-11 rounded-lg border border-[#eee7e2] bg-white px-4 text-sm text-[#554b44] outline-none"
            >
              <option>All Departments</option>
              <option>CSE</option>
              <option>BBA</option>
              <option>EEE</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-lg border border-[#eee7e2] bg-white px-4 text-sm text-[#554b44] outline-none"
            >
              <option>Pending</option>
              <option>All Statuses</option>
            </select>

            <button
              type="button"
              className="flex h-11 items-center gap-2 px-3 text-sm font-medium text-[#51473f]"
            >
              <SlidersHorizontal size={18} />
              More Filters
            </button>
          </section>

          {/* TABLE */}
          <section className="overflow-hidden rounded-2xl border border-[#eee7df] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-[#f5f1ed] text-left text-xs font-semibold text-[#60544b]">
                  <tr>
                    <th className="w-[10%] px-6 py-5">Photo</th>
                    <th className="w-[18%] px-4 py-5">Name & ID</th>
                    <th className="w-[16%] px-4 py-5">
                      Dept/Trimester
                    </th>
                    <th className="w-[17%] px-4 py-5">
                      Availability
                    </th>
                    <th className="w-[16%] px-4 py-5">Phone</th>
                    <th className="w-[13%] px-4 py-5">Status</th>
                    <th className="w-[10%] px-4 py-5">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRunners.length > 0 ? (
                    filteredRunners.map((runner) => (
                      <tr
                        key={`${runner.name}-${runner.id}`}
                        className="h-[84px] border-t border-[#f0ebe7]"
                      >
                        <td className="px-6 py-4">
                          <div className="h-10 w-10 rounded-lg bg-[#efedea]" />
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold">
                            {runner.name}
                          </p>
                          <p className="mt-1 text-[10px] text-[#786c64]">
                            ID: {runner.id}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-sm">
                            {runner.department}
                          </p>
                          <p className="mt-1 text-[10px] text-[#786c64]">
                            {runner.trimester}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 rounded bg-[#f0efed] px-2 py-1 text-[10px] font-semibold">
                            <Clock3 size={11} />
                            {runner.availability}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-[#71655d]">
                          {runner.phone}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 text-[10px] font-semibold text-[#ad7200]">
                            {runner.status}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            className="rounded-lg bg-orange-50 px-4 py-2 text-xs font-semibold text-[#a94d0a] transition hover:bg-orange-100"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-14 text-center text-sm text-[#80756d]"
                      >
                        No runner applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between border-t border-[#eee8e2] bg-[#fcfaf8] px-6 py-5">
              <p className="text-xs text-[#71665e]">
                Showing 1-{filteredRunners.length} of 8 applications
              </p>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  className="disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>

                {[1, 2].map((number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => setPage(number)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs ${
                      page === number
                        ? "bg-[#ff7a18] font-semibold text-white"
                        : "text-[#645950]"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === 2}
                  onClick={() =>
                    setPage((current) => Math.min(2, current + 1))
                  }
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