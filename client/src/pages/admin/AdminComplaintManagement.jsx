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
  Contact,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";

export default function AdminComplaintManagement() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState("#TK-8815");
  const [resolvedTickets, setResolvedTickets] = useState(["#TK-8815"]);

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
    active: true,
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
      label: "Total Complaints",
      value: "1,284",
      icon: MessagesSquare,
      style: "bg-orange-100 text-orange-600",
    },
    {
      label: "Open Tickets",
      value: "42",
      icon: TicketCheck,
      style: "bg-blue-100 text-blue-600",
    },
    {
      label: "In Progress",
      value: "18",
      icon: RefreshCw,
      style: "bg-orange-50 text-orange-500",
    },
    {
      label: "Resolved Today",
      value: "36",
      icon: CircleCheck,
      style: "bg-green-100 text-green-600",
    },
    {
      label: "High Priority",
      value: "08",
      icon: BadgeAlert,
      style: "bg-red-100 text-red-500",
    },
    {
      label: "Avg Res. Time",
      value: "4.2h",
      icon: Timer,
      style: "bg-blue-100 text-blue-600",
    },
  ];

  const tickets = [
    {
      id: "#TK-8821",
      submittedBy: "Anika Rahman",
      role: "Student",
      roleStyle: "bg-blue-100 text-blue-600",
      category: "Food Quality",
      date: "Oct 12, 10:45 AM",
      priority: "HIGH",
      email: "anika@uiu.ac.bd",
      order: "#ORD-4510",
      message:
        "The food quality did not meet expectations and the item arrived in poor condition.",
    },
    {
      id: "#TK-8819",
      submittedBy: "Mr. Zaman",
      role: "Faculty",
      roleStyle: "bg-purple-100 text-purple-600",
      category: "App Technical",
      date: "Oct 12, 09:30 AM",
      priority: "MEDIUM",
      email: "zaman@uiu.ac.bd",
      order: "#ORD-4502",
      message:
        "I experienced an application issue while trying to track the status of my order.",
    },
    {
      id: "#TK-8815",
      submittedBy: "Cafe 24",
      role: "Vendor",
      roleStyle: "bg-orange-100 text-orange-600",
      category: "Payment Sync",
      date: "Oct 11, 04:15 PM",
      priority: "LOW",
      email: "contact@cafe24.uiu.edu",
      order: "#ORD-4492",
      message:
        'The payment for Order #ORD-4492 has not been reflected in our shop wallet after successful delivery. Please investigate the sync issue.',
    },
  ];

  const filteredTickets = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !keyword ||
        ticket.id.toLowerCase().includes(keyword) ||
        ticket.submittedBy.toLowerCase().includes(keyword);

      const matchesCategory =
        category === "All" || ticket.category === category;

      const matchesPriority =
        priorityFilter === "All" || ticket.priority === priorityFilter;

      const isResolved = resolvedTickets.includes(ticket.id);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Resolved" && isResolved) ||
        (statusFilter === "Open" && !isResolved);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [search, category, statusFilter, priorityFilter, resolvedTickets]);

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) || tickets[2];

  const selectedResolved = resolvedTickets.includes(selectedTicket.id);

  const markResolved = () => {
    setResolvedTickets((current) =>
      current.includes(selectedTicket.id)
        ? current
        : [...current, selectedTicket.id]
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2b241f]">
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

      {/* RIGHT SIDE */}
      <div className="ml-[250px] min-h-screen">
        {/* HEADER */}
        <header className="flex h-[70px] items-center justify-between border-b border-[#eee8e2] bg-white px-8">
          <div className="flex w-[380px] items-center gap-3 rounded-full bg-[#f3f0ed] px-5 py-3">
            <Search size={19} className="text-[#6f655e]" />
            <input
              type="text"
              placeholder="Search for tickets, users..."
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
              Complaint Management
            </span>
          </div>

          {/* HEADING */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <h1 className="text-[20px] font-medium">
                Complaint Management
              </h1>
              <p className="mt-1 text-sm text-[#71665e]">
                Review, investigate, and resolve complaints submitted across the
                platform.
              </p>
            </div>

            <button
              type="button"
              className="flex h-[50px] items-center gap-2 rounded-lg bg-[#ff7a18] px-6 text-sm font-medium text-[#3c250f] shadow-sm hover:bg-orange-600"
            >
              <Download size={17} />
              Export Complaint Report
            </button>
          </section>

          {/* STATS */}
          <section className="mb-7 grid grid-cols-6 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#eee8e2] bg-white p-5 shadow-sm"
                >
                  <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${stat.style}`}
                  >
                    <Icon size={19} />
                  </div>

                  <p className="text-[10px] text-[#786e66]">{stat.label}</p>
                  <p className="mt-1 text-[22px] font-bold">{stat.value}</p>
                </div>
              );
            })}
          </section>

          {/* MAIN COMPLAINT AREA */}
          <div className="grid grid-cols-[1.4fr_1fr] items-start gap-5">
            <div>
              {/* FILTERS */}
              <section className="mb-4 rounded-2xl border border-[#eee8e2] bg-white p-4 shadow-sm">
                <div className="mb-3 flex gap-3">
                  <div className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-[#eee8e2] px-4">
                    <Search size={17} className="text-[#766b63]" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by ID or Name..."
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-lg border border-[#eee8e2] px-3 text-xs outline-none"
                  >
                    <option value="All">Category: All</option>
                    <option value="Food Quality">Food Quality</option>
                    <option value="App Technical">App Technical</option>
                    <option value="Payment Sync">Payment Sync</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-9 rounded-lg border border-[#eee8e2] px-3 text-xs outline-none"
                  >
                    <option value="All">Status: All</option>
                    <option value="Open">Status: Open</option>
                    <option value="Resolved">Status: Resolved</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="h-9 rounded-lg border border-[#eee8e2] px-3 text-xs outline-none"
                  >
                    <option value="All">Priority: All</option>
                    <option value="HIGH">Priority: High</option>
                    <option value="MEDIUM">Priority: Medium</option>
                    <option value="LOW">Priority: Low</option>
                  </select>

                  <div className="ml-auto flex items-center gap-5 text-[11px]">
                    <span className="text-[#7a7068]">Sort by:</span>
                    <button className="font-semibold text-[#a54d0b]">
                      Newest
                    </button>
                  </div>
                </div>
              </section>

              {/* TABLE */}
              <section className="overflow-hidden rounded-2xl border border-[#eee8e2] bg-white shadow-sm">
                <table className="w-full table-fixed">
                  <thead className="bg-[#f6f2ee] text-left text-xs text-[#62574f]">
                    <tr>
                      <th className="w-[15%] px-5 py-5">ID</th>
                      <th className="w-[23%] px-4 py-5">Submitted By</th>
                      <th className="w-[22%] px-4 py-5">Category</th>
                      <th className="w-[18%] px-4 py-5">Date</th>
                      <th className="w-[22%] px-4 py-5">Priority</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className={`cursor-pointer border-t border-[#f0ebe7] text-xs transition hover:bg-orange-50 ${
                            selectedTicketId === ticket.id ? "bg-[#fffaf5]" : ""
                          }`}
                        >
                          <td className="px-5 py-5 font-bold text-[#ad530d]">
                            {ticket.id}
                          </td>

                          <td className="px-4 py-5">
                            <p className="font-semibold text-[#453b34]">
                              {ticket.submittedBy}
                            </p>
                            <span
                              className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] ${ticket.roleStyle}`}
                            >
                              {ticket.role}
                            </span>
                          </td>

                          <td className="px-4 py-5">{ticket.category}</td>

                          <td className="px-4 py-5">
                            {ticket.date.split(",")[0]}
                            <br />
                            {ticket.date.substring(ticket.date.indexOf(",") + 1)}
                          </td>

                          <td className="px-4 py-5">
                            <PriorityBadge priority={ticket.priority} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-14 text-center text-sm text-[#80756d]"
                        >
                          No complaints found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* PAGINATION */}
                <div className="flex items-center justify-between border-t border-[#eee8e2] px-5 py-4">
                  <span className="text-[11px] text-[#71665e]">
                    Showing 1 to {filteredTickets.length} of 42 tickets
                  </span>

                  <div className="flex items-center gap-4 text-xs">
                    <button
                      disabled={page === 1}
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                      className="disabled:opacity-30"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    {[1, 2, 3].map((number) => (
                      <button
                        key={number}
                        onClick={() => setPage(number)}
                        className={`flex h-7 w-7 items-center justify-center rounded ${
                          page === number
                            ? "bg-[#a6530b] text-white"
                            : "text-[#62574f]"
                        }`}
                      >
                        {number}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setPage((current) => Math.min(3, current + 1))
                      }
                      disabled={page === 3}
                      className="disabled:opacity-30"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </section>

              {/* LOWER CARDS */}
              <div className="mt-5 grid grid-cols-2 gap-5">
                <ComplaintAnalytics />
                <RecentActivity />
              </div>
            </div>

            {/* DETAILS */}
            <TicketDetails
              ticket={selectedTicket}
              resolved={selectedResolved}
              onResolve={markResolved}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    HIGH: "bg-red-100 text-red-600",
    MEDIUM: "bg-orange-100 text-orange-600",
    LOW: "bg-[#eeece9] text-[#746a62]",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[9px] font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function TicketDetails({ ticket, resolved, onResolve }) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
      <div className="bg-[#f8f5f1] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#a65414]">
              TICKET DETAILS
            </p>
            <h3 className="mt-1 text-sm font-bold">{ticket.id}</h3>
          </div>

          {resolved && (
            <span className="rounded-full bg-green-50 px-2 py-1 text-[9px] font-semibold text-green-600">
              ● Resolved
            </span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-[9px] font-bold text-[#7a7068]">
              SUBMITTED BY
            </p>
            <p className="mt-1 font-semibold">{ticket.submittedBy}</p>
            <span className="mt-1 inline-block rounded bg-orange-100 px-2 py-0.5 text-[9px] text-orange-600">
              {ticket.role}
            </span>
          </div>

          <div>
            <p className="text-[9px] font-bold text-[#7a7068]">CATEGORY</p>
            <p className="mt-1 font-semibold">{ticket.category}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3 text-xs text-[#5e544c]">
          <p className="flex items-center gap-2">
            <Mail size={15} />
            {ticket.email}
          </p>

          <p className="flex items-center gap-2">
            <ClipboardList size={15} />
            Order ID:
            <strong className="text-[#a6520d]">{ticket.order}</strong>
          </p>

          <p className="flex items-center gap-2">
            <CalendarDays size={15} />
            {ticket.date}
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-orange-200 bg-[#fffaf6] p-4">
          <p className="text-[9px] font-bold text-[#a75313]">
            COMPLAINT MESSAGE
          </p>

          <p className="mt-3 text-xs italic leading-6 text-[#6b5f56]">
            "{ticket.message}"
          </p>
        </div>

        <div className="mt-5">
          <p className="text-[9px] font-bold text-[#6f655e]">
            INTERNAL INVESTIGATION NOTES
          </p>
          <div className="mt-3 h-px bg-[#eee8e2]" />
        </div>

        <button
          type="button"
          onClick={onResolve}
          disabled={resolved}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold ${
            resolved
              ? "cursor-default bg-green-100 text-green-700"
              : "bg-[#a95306] text-white hover:bg-[#934805]"
          }`}
        >
          <CheckCircle2 size={17} />
          {resolved ? "Resolved" : "Mark as Resolved"}
        </button>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-lg border border-[#e8e2dd] py-3 text-xs">
            <Contact size={14} />
            Contact
          </button>

          <button className="flex items-center justify-center gap-2 rounded-lg border border-red-200 py-3 text-xs font-medium text-red-600">
            <AlertCircle size={14} />
            Escalate
          </button>
        </div>
      </div>
    </aside>
  );
}

function ComplaintAnalytics() {
  return (
    <div className="rounded-2xl border border-[#eee8e2] bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium">Complaint Analytics</h3>

      <AnalyticsBar
        label="Food Quality & Safety"
        value="45%"
        width="45%"
        color="bg-[#a95306]"
      />

      <AnalyticsBar
        label="Delivery Delays"
        value="30%"
        width="30%"
        color="bg-slate-600"
      />

      <AnalyticsBar
        label="Technical & Billing"
        value="25%"
        width="25%"
        color="bg-sky-700"
      />
    </div>
  );
}

function AnalyticsBar({ label, value, width, color }) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex justify-between text-[10px]">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-2 rounded-full bg-[#eeeae6]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width }}
        />
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="rounded-2xl border border-[#eee8e2] bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium">Recent Activity</h3>

      <div className="mt-5 space-y-5">
        <Activity
          icon={CheckCircle2}
          iconStyle="bg-green-100 text-green-600"
          title="Ticket #TK-8815 Resolved"
          text="By Admin Sarah • 12 mins ago"
        />

        <Activity
          icon={Pencil}
          iconStyle="bg-blue-100 text-blue-600"
          title="Note added to #TK-8821"
          text="Investigation started • 45 mins ago"
        />

        <Activity
          icon={AlertCircle}
          iconStyle="bg-orange-100 text-orange-600"
          title="New complaint submitted"
          text="High priority ticket received"
        />
      </div>
    </div>
  );
}

function Activity({ icon: Icon, iconStyle, title, text }) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconStyle}`}
      >
        <Icon size={15} />
      </div>

      <div>
        <p className="text-xs font-semibold">{title}</p>
        <p className="mt-1 text-[9px] text-[#82776f]">{text}</p>
      </div>
    </div>
  );
}