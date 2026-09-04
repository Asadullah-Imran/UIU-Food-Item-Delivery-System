import React from "react";
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
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

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

  const stats = [
    {
      label: "Students",
      value: "12,450",
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-700",
    },
    {
      label: "Active Shops",
      value: "42",
      icon: Store,
      bg: "bg-cyan-100",
      color: "text-cyan-700",
    },
    {
      label: "Runners",
      value: "156",
      icon: Bike,
      bg: "bg-orange-100",
      color: "text-orange-700",
    },
    {
      label: "Orders Today",
      value: "842",
      icon: ShoppingCart,
      bg: "bg-blue-100",
      color: "text-blue-700",
    },
    {
      label: "Daily Revenue",
      value: "৳142k",
      icon: Banknote,
      bg: "bg-green-100",
      color: "text-green-700",
    },
    {
      label: "Avg. Rating",
      value: "4.8",
      icon: Star,
      bg: "bg-yellow-100",
      color: "text-yellow-700",
    },
  ];

  const activities = [
    {
      title: "New Shop Registered",
      description: '"The Pizza Hub" has completed registration.',
      time: "2 mins ago",
      icon: Store,
      style: "bg-green-100 text-green-700",
    },
    {
      title: "Runner Approved",
      description: "Rahim Ahmed has been verified and active.",
      time: "15 mins ago",
      icon: UserCheck,
      style: "bg-blue-100 text-blue-700",
    },
    {
      title: "Order Completed",
      description: "Order #8291 delivered successfully to Hall B.",
      time: "42 mins ago",
      icon: CircleCheck,
      style: "bg-orange-100 text-orange-700",
    },
    {
      title: "Complaint Submitted",
      description: "Delayed Delivery reported for Order #8277.",
      time: "1 hour ago",
      icon: TriangleAlert,
      style: "bg-red-100 text-red-600",
    },
  ];

  const handleMenuClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

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
            onClick={() => navigate("/")}
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
              placeholder="Search orders, shops, or students..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-4 border-l border-[#eee7df] pl-6">
            <span className="text-sm font-semibold">Admin Tonmoy</span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-100 text-sm font-bold text-orange-600">
              AT
            </div>
          </div>
        </header>

        {/* DASHBOARD */}
        <main className="p-6">
          {/* WELCOME */}
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-[30px] font-bold tracking-tight">
                Welcome Back, Administrator 👋
              </h2>

              <p className="mt-1 max-w-[650px] text-[16px] leading-6 text-[#66584e]">
                Monitor platform activity and manage university food delivery
                operations efficiently.
              </p>
            </div>

            <button
              type="button"
              className="flex h-[60px] w-[255px] items-center justify-center gap-4 rounded-lg bg-[#ff7a18] font-semibold transition hover:bg-orange-600"
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
                  className="rounded-2xl border border-[#eee7df] bg-white p-5 shadow-sm"
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
                  >
                    <Icon size={21} className={stat.color} />
                  </div>

                  <p className="text-xs text-[#5e554e]">{stat.label}</p>

                  <p className="mt-1 text-[22px] font-bold">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* MAIN CONTENT */}
          <div className="grid grid-cols-[2fr_1fr] gap-5">
            {/* LEFT SIDE */}
            <div>
              {/* APPROVAL CARDS */}
              <div className="mb-5 grid grid-cols-2 gap-5">
                <ApprovalCard
                  icon={<Store size={22} />}
                  title="Shop Owner Requests"
                  pending="8 applications pending"
                  onClick={() => navigate("/admin-shop-preview")}
                />

                <ApprovalCard
  icon={<Bike size={22} />}
  title="Runner Applications"
  pending="24 applications pending"
  onClick={() => navigate("/admin-runner-preview")}
/>
              </div>

              {/* CHARTS */}
              <div className="mb-5 grid grid-cols-2 gap-5">
                {/* DAILY ORDER VOLUME */}
                <div className="h-[300px] rounded-2xl border border-[#eee7df] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Daily Order Volume</h3>

                    <span className="rounded bg-[#f3f0ed] px-2 py-1 text-xs text-[#655c55]">
                      Last 7 Days
                    </span>
                  </div>

                  <div className="mt-8 flex h-[190px] items-end justify-center gap-2">
                    <div className="h-[45%] w-8 rounded-t bg-orange-200" />
                    <div className="h-[70%] w-8 rounded-t bg-orange-200" />
                    <div className="h-[58%] w-8 rounded-t bg-orange-200" />
                    <div className="h-[88%] w-8 rounded-t bg-orange-200" />
                    <div className="h-[75%] w-8 rounded-t bg-orange-200" />
                    <div className="h-full w-8 rounded-t bg-orange-200" />
                    <div className="h-[62%] w-8 rounded-t bg-orange-500" />
                  </div>
                </div>

                {/* REVENUE */}
                <div className="h-[300px] rounded-2xl border border-[#eee7df] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Revenue Growth</h3>

                    <span className="rounded bg-[#f3f0ed] px-2 py-1 text-xs text-[#655c55]">
                      Monthly
                    </span>
                  </div>

                  <div className="flex h-[215px] items-end justify-around pb-3 text-[10px] text-[#665b53]">
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span className="font-semibold text-orange-600">Dec</span>
                  </div>
                </div>
              </div>

              {/* POPULAR SHOPS */}
              <div className="rounded-2xl border border-[#eee7df] bg-white p-7 shadow-sm">
                <h3 className="font-semibold">Most Popular Shops</h3>

                <div className="mt-6 flex items-center justify-around">
                  <div className="flex h-[170px] w-[170px] items-center justify-center rounded-full bg-[#4b6175]">
                    <div className="flex h-[145px] w-[145px] flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-2xl font-bold">42%</span>
                      <span className="text-xs">Pizza Hub</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
                    <Legend
                      color="bg-amber-700"
                      label="The Pizza Hub"
                      value="42%"
                    />

                    <Legend
                      color="bg-slate-500"
                      label="Student Cafeteria"
                      value="28%"
                    />

                    <Legend
                      color="bg-blue-200"
                      label="Green Deli"
                      value="15%"
                    />

                    <Legend
                      color="bg-orange-200"
                      label="Others"
                      value="15%"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-5">
              {/* COMPLAINT */}
              <div className="rounded-2xl border border-[#f3b17e] bg-[#ffd9c0] p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Gavel size={20} />
                  <h3 className="font-semibold">Complaint Overview</h3>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <ComplaintBox value="12" label="OPEN" />

                  <ComplaintBox
                    value="45"
                    label="SOLVED"
                    color="text-green-700"
                  />

                  <ComplaintBox
                    value="3"
                    label="CRITICAL"
                    color="text-red-700"
                    danger
                  />
                </div>

                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3a1605] py-3 font-semibold text-white"
                >
                  View Complaints
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* ACTIVITIES */}
              <div className="rounded-2xl border border-[#eee7df] bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-semibold">Recent Activities</h3>

                  <button
                    type="button"
                    className="text-xs font-semibold text-orange-700"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-5">
                  {activities.map((activity) => {
                    const Icon = activity.icon;

                    return (
                      <div key={activity.title} className="flex gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.style}`}
                        >
                          <Icon size={16} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            {activity.title}
                          </p>

                          <p className="mt-1 text-sm leading-5 text-[#594d45]">
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ApprovalCard({ icon, title, pending, onClick }) {
  return (
    <div className="rounded-2xl border border-[#eee7df] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-700">
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
      className={`rounded-lg p-3 text-center ${
        danger ? "border border-red-300 bg-red-200" : "bg-white/60"
      }`}
    >
      <p className={`text-[22px] font-bold ${color}`}>{value}</p>
      <p className="text-[10px] font-semibold">{label}</p>
    </div>
  );
}

function Legend({ color, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 shrink-0 rounded-full ${color}`} />
      <span className="text-[#66594f]">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}