import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AdminProfile() {
  const navigate = useNavigate();
  const { user, token, logout, updateUserData } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [internalMessages, setInternalMessages] = useState(false);
  const [appearance, setAppearance] = useState("light");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [profile, setProfile] = useState({
    name: user?.name || "Campus Super Admin",
    email: user?.email || "admin@uiu.ac.bd",
    phone: user?.phone || "+880 1900-UIUADMIN",
    department: user?.department || "Director, IT Services",
    avatar: user?.avatar || "",
    role: user?.role || "admin",
    universityId: user?.universityId || "ADMIN-001",
  });

  // Fetch live Admin profile on mount or token update
  useEffect(() => {
    let isMounted = true;
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const authToken = token || localStorage.getItem("uiu_auth_token");
        if (!authToken) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/admin/profile", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const json = await res.json();
        if (isMounted && res.ok && json.success && json.data) {
          setProfile({
            name: json.data.name || "",
            email: json.data.email || "",
            phone: json.data.phone || "",
            department: json.data.department || "Director, IT Services",
            avatar: json.data.avatar || "",
            role: json.data.role || "admin",
            universityId: json.data.universityId || user?.universityId || "ADMIN-001",
          });
        }
      } catch (err) {
        console.error("Failed to load admin profile:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdminProfile();
    return () => {
      isMounted = false;
    };
  }, [token]);

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
    setErrorMessage("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage("");
      const authToken = token || localStorage.getItem("uiu_auth_token");

      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          department: profile.department,
          avatar: profile.avatar,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update profile");
      }

      // Update shared user session context
      if (updateUserData) {
        updateUserData({
          name: json.data.name,
          phone: json.data.phone,
          department: json.data.department,
          avatar: json.data.avatar,
        });
      }

      setEditMode(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
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
        {/* TOP BAR */}
        <header className="flex h-[60px] items-center justify-between border-b border-[#eee7df] bg-white px-7">
          <div className="text-xs text-[#655b54]">
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin")}
              className="hover:text-orange-600 font-medium"
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
              {profile.name || "Campus Admin"}
            </span>

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-orange-500 bg-orange-100 text-xs font-bold text-orange-600">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(profile.name)
              )}
            </div>
          </div>
        </header>

        <main className="px-7 py-6">
          {/* PROFILE HEADER */}
          <section className="mb-6 flex items-center justify-between rounded-2xl border border-[#eee7df] bg-white px-8 py-7 shadow-sm">
            <div className="flex items-center gap-7">
              <div className="relative">
                <div className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full border-[3px] border-[#f0e7df] bg-orange-50">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-orange-600">
                      {getInitials(profile.name)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  title="Upload profile photo"
                  onClick={() => setEditMode(true)}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#a75208] text-white shadow hover:bg-[#8f4404] transition"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-[22px] font-semibold">
                    {profile.name || "Admin User"}
                  </h1>

                  <span className="rounded-full bg-[#ff7a18] px-3 py-1 text-[10px] font-semibold text-white uppercase tracking-wider">
                    {profile.role === "admin" ? "System Superuser" : profile.role}
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm text-[#74675f]">
                  <CircleUserRound size={16} className="text-orange-600" />
                  Admin ID: {profile.universityId || "ADMIN-001"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditMode((current) => !current);
                setErrorMessage("");
              }}
              className="rounded-lg bg-[#546b80] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#43596d]"
            >
              {editMode ? "Cancel Edit" : "Edit Profile"}
            </button>
          </section>

          {/* ERROR ALERT */}
          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* INFO + SECURITY */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PERSONAL INFORMATION */}
            <section className="rounded-2xl border border-[#eee7df] bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[20px] font-semibold">
                  Personal Information
                </h2>

                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="text-[#a8520b] hover:text-[#8f4404]"
                  title="Edit details"
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
                disabled={true}
                note="Email is tied to official UIU portal and cannot be modified."
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
                value={profile.department}
                editing={editMode}
                onChange={(value) => handleChange("department", value)}
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
                    Managed via UIU Authentication Service
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Password reset link will be sent to your official UIU email.")}
                  className="flex items-center gap-2 rounded-lg border border-orange-400 px-4 py-2 text-xs font-medium text-[#a4510d] hover:bg-orange-50 transition"
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
                className="text-xs font-medium text-[#a6510c] hover:underline"
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
              <div className="mr-2 flex items-center gap-2 text-sm font-medium text-green-600 animate-fadeIn">
                <CheckCircle2 size={17} />
                Changes saved successfully
              </div>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-[#a95205] px-8 py-3 text-sm font-medium text-white shadow-md transition hover:bg-[#914600] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer transition"
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
  disabled = false,
  note = null,
  last = false,
}) {
  return (
    <div className={`${last ? "" : "border-b border-[#eee9e4]"} py-4`}>
      <p className="mb-1 text-[10px] text-[#756b63]">
        {label}
      </p>

      {editing && !disabled ? (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-orange-200 bg-[#fffaf6] px-3 py-2 text-sm font-medium outline-none focus:border-orange-400"
        />
      ) : (
        <div>
          <p className="text-sm font-medium text-[#29221d]">
            {value || "—"}
          </p>
          {note && editing && (
            <p className="mt-1 text-[10px] text-[#93877f] italic">
              {note}
            </p>
          )}
        </div>
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