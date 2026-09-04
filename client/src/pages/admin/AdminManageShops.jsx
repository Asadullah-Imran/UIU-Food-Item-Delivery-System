import React, { useRef, useState } from "react";
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
  Bell,
  Settings,
  Pencil,
  Camera,
  Image,
  Info,
  UserRoundSearch,
  Contact,
  MapPin,
  Clock3,
  Truck,
  SlidersHorizontal,
  CheckCircle2,
  PauseCircle,
  Wrench,
  Star,
  Save,
  Eye,
} from "lucide-react";

export default function AdminManageShops() {
  const navigate = useNavigate();
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [shop, setShop] = useState({
    name: "",
    category: "",
    description: "",
    email: "chefsTable@gmail.com",
    phone: "+880",
    building: "100 feet",
    floor: "",
    counter: "C-04",
    prepTime: "15",
    maxOrders: "20",
  });

  const [owner, setOwner] = useState({
    name: "Rahat Khan",
    email: "rahat@gmail.com",
    phone: "+880 1712-XXXXXX",
  });

  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [shopStatus, setShopStatus] = useState("Active");
  const [saved, setSaved] = useState(false);

  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [hours, setHours] = useState({
    Monday: {
      open: "08:00 AM",
      close: "08:00 PM",
      closed: false,
    },
    Tuesday: {
      open: "08:00 AM",
      close: "08:00 PM",
      closed: false,
    },
    Friday: {
      open: "12:00 AM",
      close: "12:00 AM",
      closed: true,
    },
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
    active: true,

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

  const updateShop = (field, value) => {
    setShop((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
  };

  const updateHours = (day, field, value) => {
    setHours((current) => ({
      ...current,
      [day]: {
        ...current[day],
        [field]: value,
      },
    }));
  };

  const handleImage = (event, setter) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setter(URL.createObjectURL(file));
  };

  const handleReset = () => {
    setShop({
      name: "",
      category: "",
      description: "",
      email: "chefsTable@gmail.com",
      phone: "+880",
      building: "100 feet",
      floor: "",
      counter: "C-04",
      prepTime: "15",
      maxOrders: "20",
    });

    setLogoPreview(null);
    setBannerPreview(null);
    setDeliveryEnabled(true);
    setShopStatus("Active");
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#322a24]">
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

      {/* RIGHT */}
      <div className="ml-[250px] min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-[#eee8e2] bg-white px-8">
          <div className="flex w-[380px] items-center gap-3 rounded-full bg-[#f3f0ed] px-5 py-3">
            <Search size={19} className="text-[#6f655e]" />

            <input
              placeholder="Search orders, shops, users..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-5">
            <Bell size={18} />
            <Settings size={18} />

            <div className="h-10 w-10 rounded-full border border-[#ded8d2] bg-white" />
          </div>
        </header>

        {/* MAIN */}
        <main className="px-8 py-7">
          {/* BREADCRUMB */}
          <div className="mb-7 text-sm text-[#6e635c]">
            <button
              type="button"
              onClick={() => navigate("/admin-preview")}
              className="hover:text-orange-600"
            >
              Dashboard
            </button>

            <span className="mx-2">›</span>

            <span>Manage Shops</span>

            <span className="mx-2">›</span>

            <strong className="text-[#a8510b]">
              Create / Edit Shop
            </strong>
          </div>

          {/* TITLE */}
          <section className="mb-7 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                Create / Edit Shop
              </h1>

              <p className="mt-1 text-sm text-[#756a62]">
                Register a new campus shop or update an existing shop's
                information.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-[#9c7960] bg-white px-6 py-3 text-sm font-semibold"
              >
                Reset
              </button>

              <button
                type="button"
                className="rounded-xl border border-red-500 bg-white px-6 py-3 text-sm font-semibold text-red-600"
              >
                Delete Shop
              </button>
            </div>
          </section>

          <div className="grid grid-cols-[minmax(0,1fr)_290px] items-start gap-7">
            {/* LEFT FORM */}
            <div className="space-y-7">
              {/* BRANDING */}
              <Card>
                <SectionTitle icon={Pencil} title="Shop Branding" />

                <div className="mt-7 grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-3 text-sm">Shop Logo</p>

                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={(event) =>
                        handleImage(event, setLogoPreview)
                      }
                    />

                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="flex h-[190px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-[#fffdfb]"
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Shop logo preview"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow">
                            <Camera
                              size={28}
                              className="text-[#917561]"
                            />
                          </div>

                          <p className="mt-4 text-xs text-[#655950]">
                            Drag & drop or{" "}
                            <span className="text-[#a7520c]">
                              Browse
                            </span>
                          </p>

                          <p className="mt-1 text-[10px] text-[#867b73]">
                            PNG, JPG up to 5MB
                          </p>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <p className="mb-3 text-sm">Cover Banner</p>

                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={(event) =>
                        handleImage(event, setBannerPreview)
                      }
                    />

                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="flex h-[190px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-orange-200 bg-[#fffdfb]"
                    >
                      {bannerPreview ? (
                        <img
                          src={bannerPreview}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="flex h-16 w-[190px] items-center justify-center rounded-lg bg-white shadow">
                            <Image
                              size={28}
                              className="text-[#917561]"
                            />
                          </div>

                          <p className="mt-4 text-xs text-[#655950]">
                            Drag & drop or{" "}
                            <span className="text-[#a7520c]">
                              Browse
                            </span>
                          </p>

                          <p className="mt-1 text-[10px] text-[#867b73]">
                            Recommended: 1200×400px
                          </p>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Card>

              {/* BASIC INFO */}
              <Card>
                <SectionTitle icon={Info} title="Basic Information" />

                <div className="mt-7 grid grid-cols-2 gap-6">
                  <FormField label="Shop Name">
                    <input
                      value={shop.name}
                      onChange={(e) =>
                        updateShop("name", e.target.value)
                      }
                      placeholder="e.g. Campus Bites"
                      className={inputStyle}
                    />
                  </FormField>

                  <FormField label="Category">
                    <select
                      value={shop.category}
                      onChange={(e) =>
                        updateShop("category", e.target.value)
                      }
                      className={inputStyle}
                    >
                      <option value="">Select Category</option>
                      <option>Fast Food & Snacks</option>
                      <option>Food & Cafe</option>
                      <option>Stationery</option>
                      <option>Medicine</option>
                    </select>
                  </FormField>
                </div>

                <div className="mt-6">
                  <FormField label="Description">
                    <textarea
                      value={shop.description}
                      onChange={(e) =>
                        updateShop("description", e.target.value)
                      }
                      placeholder="Describe the shop's offerings..."
                      className={`${inputStyle} h-[110px] resize-none`}
                    />
                  </FormField>
                </div>
              </Card>

              {/* OWNER */}
              <Card>
                <SectionTitle
                  icon={UserRoundSearch}
                  title="Shop Owner Assignment"
                />

                <div className="relative mt-7">
                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#786d65]"
                  />

                  <input
                    placeholder="Search approved vendors by name or email..."
                    className={`${inputStyle} pl-11`}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-orange-200 bg-[#f4efeb] p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white font-semibold text-[#a8520c] shadow-sm">
                      RK
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {owner.name}
                      </p>

                      <p className="mt-1 text-[10px] text-[#756a62]">
                        {owner.email} • {owner.phone}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-[#a9530c]"
                  >
                    <Pencil size={19} />
                  </button>
                </div>
              </Card>

              {/* CONTACT AND LOCATION */}
              <div className="grid grid-cols-2 gap-7">
                <Card>
                  <SectionTitle icon={Contact} title="Contact Info" />

                  <div className="mt-7 space-y-5">
                    <FormField label="SHOP EMAIL" small>
                      <input
                        value={shop.email}
                        onChange={(e) =>
                          updateShop("email", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </FormField>

                    <FormField label="PHONE NUMBER" small>
                      <input
                        value={shop.phone}
                        onChange={(e) =>
                          updateShop("phone", e.target.value)
                        }
                        className={inputStyle}
                      />
                    </FormField>
                  </div>
                </Card>

                <Card>
                  <SectionTitle icon={MapPin} title="Location" />

                  <div className="mt-7">
                    <FormField label="BUILDING" small>
                      <select
                        value={shop.building}
                        onChange={(e) =>
                          updateShop("building", e.target.value)
                        }
                        className={inputStyle}
                      >
                        <option>100 feet</option>
                        <option>Main Campus Building</option>
                        <option>UIU Food Court</option>
                      </select>
                    </FormField>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <FormField label="FLOOR" small>
                        <input
                          value={shop.floor}
                          onChange={(e) =>
                            updateShop("floor", e.target.value)
                          }
                          placeholder="e.g. 2nd"
                          className={inputStyle}
                        />
                      </FormField>

                      <FormField label="COUNTER NO." small>
                        <input
                          value={shop.counter}
                          onChange={(e) =>
                            updateShop("counter", e.target.value)
                          }
                          className={inputStyle}
                        />
                      </FormField>
                    </div>
                  </div>
                </Card>
              </div>

              {/* OPERATING HOURS */}
              <Card>
                <div className="flex items-center justify-between">
                  <SectionTitle icon={Clock3} title="Operating Hours" />

                  <button
                    type="button"
                    onClick={() => {
                      setHours((current) => ({
                        Monday: current.Monday,
                        Tuesday: { ...current.Monday },
                        Friday: { ...current.Monday },
                      }));
                    }}
                    className="text-xs font-semibold text-[#a8520b]"
                  >
                    Apply to all days
                  </button>
                </div>

                <div className="mt-7 space-y-4">
                  {Object.entries(hours).map(([day, values]) => (
                    <div
                      key={day}
                      className={`grid grid-cols-[110px_130px_25px_130px_90px] items-center gap-4 rounded-lg p-3 ${
                        values.closed ? "bg-red-50" : ""
                      }`}
                    >
                      <strong className="text-sm">{day}</strong>

                      <input
                        value={values.open}
                        disabled={values.closed}
                        onChange={(e) =>
                          updateHours(day, "open", e.target.value)
                        }
                        className={smallInputStyle}
                      />

                      <span className="text-center text-sm text-[#756a62]">
                        to
                      </span>

                      <input
                        value={values.close}
                        disabled={values.closed}
                        onChange={(e) =>
                          updateHours(day, "close", e.target.value)
                        }
                        className={smallInputStyle}
                      />

                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={values.closed}
                          onChange={(e) =>
                            updateHours(
                              day,
                              "closed",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 accent-red-600"
                        />

                        <span
                          className={
                            values.closed
                              ? "font-semibold text-red-600"
                              : ""
                          }
                        >
                          Closed
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>

              {/* DELIVERY */}
              <Card>
                <SectionTitle
                  icon={Truck}
                  title="Delivery & Performance"
                />

                <div className="mt-7 grid grid-cols-[160px_1fr_1fr] items-center gap-7">
                  <div className="flex items-center justify-between rounded-xl bg-[#f3f0ed] p-4">
                    <div>
                      <p className="text-sm font-semibold">Delivery</p>
                      <p className="mt-1 text-[10px] text-[#766b63]">
                        Runner pickup enabled
                      </p>
                    </div>

                    <Toggle
                      enabled={deliveryEnabled}
                      onClick={() =>
                        setDeliveryEnabled(!deliveryEnabled)
                      }
                    />
                  </div>

                  <FormField label="AVG. PREP TIME (MIN)" small>
                    <input
                      value={shop.prepTime}
                      onChange={(e) =>
                        updateShop("prepTime", e.target.value)
                      }
                      className={inputStyle}
                    />
                  </FormField>

                  <FormField label="MAX ORDERS / HOUR" small>
                    <input
                      value={shop.maxOrders}
                      onChange={(e) =>
                        updateShop("maxOrders", e.target.value)
                      }
                      className={inputStyle}
                    />
                  </FormField>
                </div>
              </Card>

              {/* STATUS */}
              <Card>
                <SectionTitle
                  icon={SlidersHorizontal}
                  title="Shop Status"
                />

                <div className="mt-7 grid grid-cols-4 gap-4">
                  <StatusButton
                    icon={CheckCircle2}
                    label="Active"
                    active={shopStatus === "Active"}
                    onClick={() => setShopStatus("Active")}
                  />

                  <StatusButton
                    icon={PauseCircle}
                    label="Temp. Closed"
                    active={shopStatus === "Temp. Closed"}
                    onClick={() => setShopStatus("Temp. Closed")}
                  />

                  <StatusButton
                    icon={Wrench}
                    label="Maintenance"
                    active={shopStatus === "Maintenance"}
                    onClick={() => setShopStatus("Maintenance")}
                  />

                  <StatusButton
                    icon={Star}
                    label="Featured"
                    active={shopStatus === "Featured"}
                    onClick={() => setShopStatus("Featured")}
                  />
                </div>
              </Card>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="sticky top-[95px] space-y-6">
              {/* LIVE PREVIEW */}
              <section className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-orange-200 bg-[#faf7f4] px-5 py-4">
                  <strong className="text-xs tracking-wide text-[#75665c]">
                    LIVE PREVIEW
                  </strong>

                  <div className="flex gap-1">
                    <span className="h-3 w-3 rounded-full bg-red-300" />
                    <span className="h-3 w-3 rounded-full bg-orange-300" />
                    <span className="h-3 w-3 rounded-full bg-[#d7af7e]" />
                  </div>
                </div>

                <div>
                  <div className="h-[150px] overflow-hidden bg-[#fffdfb]">
                    {bannerPreview && (
                      <img
                        src={bannerPreview}
                        alt="Banner"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="px-5 pb-5">
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="-mt-8 mb-3 h-16 w-16 rounded-full border-4 border-white object-cover shadow"
                      />
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">
                          {shop.name || "Chef’s Table"}
                        </h3>

                        <p className="text-xs text-[#746a62]">
                          {shop.category || "Fast Food & Snacks"}
                        </p>
                      </div>

                      <span className="rounded bg-orange-50 px-2 py-1 text-[9px] font-semibold text-orange-600">
                        {shopStatus === "Active"
                          ? "OPEN"
                          : shopStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-4 text-[10px]">
                      <span>⭐ 4.8 (120+)</span>
                      <span>◷ 15-20 min</span>
                      <span>♧ Free</span>
                    </div>

                    <div className="mt-5 flex gap-3 rounded-xl bg-[#f5f2ef] p-4">
                      <MapPin
                        size={18}
                        className="text-orange-600"
                      />

                      <div>
                        <p className="text-xs font-semibold">
                          {shop.building || "Main Campus Building"}
                        </p>

                        <p className="mt-1 text-[10px] text-[#776b63]">
                          {shop.floor || "2nd Floor"}, Counter{" "}
                          {shop.counter}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SAVE CARD */}
              <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff7a18] py-4 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  <Save size={18} />
                  Save Shop Changes
                </button>

                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-orange-500 py-4 text-sm font-semibold text-orange-600"
                >
                  <Eye size={18} />
                  Preview Full Shop
                </button>

                {saved ? (
                  <p className="mt-4 text-center text-[10px] font-medium text-green-600">
                    ✓ Shop changes saved successfully
                  </p>
                ) : (
                  <p className="mt-4 text-center text-[9px] text-[#867a71]">
                    Last updated: Today at 09:42 AM by Admin
                  </p>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const inputStyle =
  "h-12 w-full rounded-lg border border-orange-200 bg-white px-4 text-sm text-[#51473f] outline-none transition placeholder:text-[#a09892] focus:border-orange-400";

const smallInputStyle =
  "h-10 w-full rounded-lg border border-orange-200 bg-white px-3 text-sm outline-none disabled:bg-[#f8f5f2] disabled:text-[#bbb2ab]";

function Card({ children }) {
  return (
    <section className="rounded-2xl border border-[#eee8e2] bg-white p-7 shadow-sm">
      {children}
    </section>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-[#a8520b]" />
      <h2 className="text-sm font-medium">{title}</h2>
    </div>
  );
}

function FormField({ label, children, small = false }) {
  return (
    <label className="block">
      <span
        className={`mb-2 block font-medium ${
          small
            ? "text-[10px] text-[#685d55]"
            : "text-sm text-[#554b44]"
        }`}
      >
        {label}
      </span>

      {children}
    </label>
  );
}

function Toggle({ enabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-7 w-12 rounded-full transition ${
        enabled ? "bg-[#a85308]" : "bg-[#d8d2cd]"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function StatusButton({
  icon: Icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[95px] flex-col items-center justify-center gap-2 rounded-xl border-2 text-xs font-semibold transition ${
        active
          ? "border-[#b45a0b] bg-orange-50 text-[#a6530b]"
          : "border-[#e1d5ca] bg-white text-[#685e56] hover:border-orange-300"
      }`}
    >
      <Icon size={19} />
      {label}
    </button>
  );
}