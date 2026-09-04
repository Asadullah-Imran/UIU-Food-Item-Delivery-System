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
  Camera,
  Pencil,
  LockKeyhole,
  ShieldCheck,
  Bell,
  Moon,
  ClipboardCheck,
  Download,
  CheckCircle2,
} from "lucide-react";

export default function AdminProfile() {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [internalMessages, setInternalMessages] = useState(false);
  const [appearance, setAppearance] = useState("light");
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "Dr. Admin User",
    email: "admin@uiu.ac.bd",
    phone: "+880 17XXXXXXXX",
    role: "Director, IT Services",
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
  },
  {
    label: "Admin Profile",
    icon: CircleUserRound,
    path: "/dashboard/admin/profile",
        active: true,

  },
];

  const activities = [
    {
      description: "Resolved Complaint #TK-8815",
      detail: "Student: Rahat Kabir",
      timestamp: "Jul 24, 2026 • 10:30 AM",
      icon: ClipboardCheck,
      iconStyle: "bg-red-100 text-red-500",
    },
    {
      description: "Approved Vendor: Cafe 24",
      detail: "Category: Food & Beverage",
      timestamp: "Jul 23, 2026 • 04:15 PM",
      icon: Store,
      iconStyle: "bg-orange-100 text-orange-600",
    },
    {
      description: "Exported Analytics Report",
      detail: "Monthly Logistics Summary [Sep]",
      timestamp: "Jun 22, 2026 • 09:00 AM",
      icon: Download,
      iconStyle: "bg-blue-100 text-blue-600",
    },
  ];

  const handleChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setEditMode(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f1] text-[#29221d]">
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
          {menuItems.map(({ label, icon: Icon, path, active }) => (
            <button
              key={label}
              type="button"
              onClick={() => path && navigate(path)}
              className={`mb-2 flex min-h-[50px] w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[15px] transition ${
                active
                  ? "bg-[#ff7a18] font-semibold text-[#24170d]"
                  : "text-[#51463f] hover:bg-orange-50"
              }`}
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
        {/* TOP BAR */}
        <header className="flex h-[60px] items-center justify-between border-b border-[#eee7df] bg-white px-7">
          <div className="text-xs text-[#655b54]">
            <button
              type="button"
              onClick={() => navigate("/admin-preview")}
              className="hover:text-orange-600"
            >
              Dashboard
            </button>

            <span className="mx-2">›</span>

            <span className="font-semibold text-[#a9510c]">
              Admin Profile
            </span>
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

        <main className="px-7 py-6">
          {/* PROFILE HEADER */}
          <section className="mb-6 flex items-center justify-between rounded-2xl border border-[#eee7df] bg-white px-8 py-7 shadow-sm">
            <div className="flex items-center gap-7">
              <div className="relative">
                <div className="h-[100px] w-[100px] rounded-full border-[3px] border-[#f0e7df] bg-white" />

                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#a75208] text-white shadow"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-[22px] font-semibold">
                    Tonmot
                  </h1>

                  <span className="rounded-full bg-[#ff7a18] px-3 py-1 text-[10px] font-semibold text-white">
                    System Superuser
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm text-[#74675f]">
                  <CircleUserRound size={16} className="text-orange-600" />
                  Admin ID: ADM-2024-001
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditMode((current) => !current)}
              className="rounded-lg bg-[#546b80] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#43596d]"
            >
              {editMode ? "Cancel Edit" : "Edit Profile"}
            </button>
          </section>

          {/* INFO + SECURITY */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            {/* PERSONAL INFORMATION */}
            <section className="rounded-2xl border border-[#eee7df] bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[20px] font-semibold">
                  Personal Information
                </h2>

                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="text-[#a8520b]"
                >
                  <Pencil size={18} />
                </button>
              </div>

              <ProfileField
                label="Full Name"
                value={profile.name}
                editing={editMode}
                onChange={(value) => handleChange("name", value)}
              />

              <ProfileField
                label="Email Address"
                value={profile.email}
                editing={editMode}
                type="email"
                onChange={(value) => handleChange("email", value)}
              />

              <ProfileField
                label="Phone Number"
                value={profile.phone}
                editing={editMode}
                onChange={(value) => handleChange("phone", value)}
              />

              <ProfileField
                label="Departmental Role"
                value={profile.role}
                editing={editMode}
                onChange={(value) => handleChange("role", value)}
                last
              />
            </section>

            {/* SECURITY */}
            <section className="rounded-2xl border border-[#eee7df] bg-white p-7 shadow-sm">
              <h2 className="mb-6 text-[20px] font-semibold">
                Security & Settings
              </h2>

              {/* PASSWORD */}
              <div className="flex items-start justify-between border-b border-[#eee9e4] pb-5">
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="mt-1 text-[10px] text-[#8b8179]">
                    Last changed 3 months ago
                  </p>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-orange-400 px-4 py-2 text-xs font-medium text-[#a4510d]"
                >
                  <LockKeyhole size={14} />
                  Change Password
                </button>
              </div>

              {/* 2FA */}
              <div className="flex items-center justify-between border-b border-[#eee9e4] py-5">
                <div>
                  <p className="text-sm font-medium">
                    Two-Factor Authentication
                  </p>

                  <p className="mt-1 text-[10px] text-[#8b8179]">
                    Extra security via SMS/Email
                  </p>
                </div>

                <Toggle
                  enabled={twoFactor}
                  onClick={() => setTwoFactor(!twoFactor)}
                />
              </div>

              {/* NOTIFICATIONS */}
              <div className="border-b border-[#eee9e4] py-5">
                <p className="mb-4 flex items-center gap-2 text-sm font-medium">
                  <Bell size={15} />
                  Notification Preferences
                </p>

                <CheckSetting
                  label="Email Notifications"
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />

                <CheckSetting
                  label="Push Notifications"
                  checked={pushNotifications}
                  onChange={setPushNotifications}
                />

                <CheckSetting
                  label="System Internal Messages"
                  checked={internalMessages}
                  onChange={setInternalMessages}
                />
              </div>

              {/* APPEARANCE */}
              <div className="flex items-center justify-between pt-5">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Moon size={16} className="text-[#a8520b]" />
                  Appearance Mode
                </p>

                <div className="flex rounded-full bg-[#eeeae6] p-1">
                  <button
                    type="button"
                    onClick={() => setAppearance("light")}
                    className={`rounded-full px-4 py-1.5 text-xs ${
                      appearance === "light"
                        ? "bg-white font-medium text-[#a5510c] shadow-sm"
                        : "text-[#71675f]"
                    }`}
                  >
                    Light
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppearance("dark")}
                    className={`rounded-full px-4 py-1.5 text-xs ${
                      appearance === "dark"
                        ? "bg-[#4b443f] font-medium text-white"
                        : "text-[#71675f]"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* ACTIVITY LOG */}
          <section className="overflow-hidden rounded-2xl border border-[#eee7df] bg-white shadow-sm">
            <div className="flex items-center justify-between px-7 py-6">
              <h2 className="text-[20px] font-semibold">
                Recent Activity Log
              </h2>

              <button
                type="button"
                className="text-xs font-medium text-[#a6510c]"
              >
                View All Logs
              </button>
            </div>

            <table className="w-full table-fixed">
              <thead className="bg-[#f7f4f1] text-left text-xs text-[#655b54]">
                <tr>
                  <th className="w-[48%] px-7 py-4">
                    Action Description
                  </th>

                  <th className="w-[35%] px-5 py-4">
                    Timestamp
                  </th>

                  <th className="w-[17%] px-5 py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <tr
                      key={activity.description}
                      className="border-t border-[#eee9e4]"
                    >
                      <td className="px-7 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${activity.iconStyle}`}
                          >
                            <Icon size={14} />
                          </div>

                          <div>
                            <p className="text-xs font-medium">
                              {activity.description}
                            </p>

                            <p className="mt-1 text-[9px] text-[#81766e]">
                              {activity.detail}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs text-[#61574f]">
                        {activity.timestamp}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-[9px] font-semibold text-green-600">
                          SUCCESS
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {/* BOTTOM BUTTONS */}
          <div className="mt-6 flex items-center justify-end gap-4">
            {saved && (
              <div className="mr-2 flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle2 size={17} />
                Changes saved
              </div>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-[#a95205] px-8 py-3 text-sm font-medium text-white shadow-md transition hover:bg-[#914600]"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  editing,
  onChange,
  type = "text",
  last = false,
}) {
  return (
    <div className={`${last ? "" : "border-b border-[#eee9e4]"} py-4`}>
      <p className="mb-1 text-[10px] text-[#756b63]">
        {label}
      </p>

      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-orange-200 bg-[#fffaf6] px-3 py-2 text-sm font-medium outline-none focus:border-orange-400"
        />
      ) : (
        <p className="text-sm font-medium">
          {value}
        </p>
      )}
    </div>
  );
}

function Toggle({ enabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition ${
        enabled ? "bg-[#a95205]" : "bg-[#d8d3cf]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function CheckSetting({ label, checked, onChange }) {
  return (
    <label className="mb-3 flex cursor-pointer items-center gap-3 text-xs text-[#554b44]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[#a95205]"
      />

      {label}
    </label>
  );
}