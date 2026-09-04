import React from "react";
import {Link,useNavigate,useParams,} from "react-router-dom";
import {
  ChevronRight,
  CookingPot,
  UserRound,
  Clock3,
  Check,
  Package,
  CircleCheck,
  Utensils,
  ListChecks,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

export default function ShopPreparingOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const displayOrderId = orderId
    ? `#${orderId.replace(/^#/, "")}`
    : "#UIU-88291";

  const orderItems = [
    {
      name: "Beef Kacchi Biryani (Full)",
      quantity: 1,
      price: "250.00",
      emoji: "🍛",
    },
    {
      name: "Fresh Lime Juice",
      quantity: 2,
      price: "80.00",
      emoji: "🥤",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] pb-12 pt-4">
      {/* Breadcrumb */}
      <div className="mb-2 flex items-center text-sm font-medium text-slate-500">
        <Link
          to="/dashboard/shop"
          className="transition-colors hover:text-slate-800"
        >
          Dashboard
        </Link>

        <ChevronRight className="mx-2 h-4 w-4" />

        <Link
          to="/dashboard/shop/orders"
          className="transition-colors hover:text-slate-800"
        >
          Incoming Orders
        </Link>

        <ChevronRight className="mx-2 h-4 w-4" />

        <span className="font-bold text-slate-800">
          Preparing Order
        </span>
      </div>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Preparing Order
          </h1>

          <p className="mt-1 font-medium text-slate-500">
            Kitchen staff are preparing this order for pickup.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-orange-500 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
          <span className="h-2 w-2 rounded-full bg-orange-600" />
          Live Update
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_340px]">
        {/* LEFT COLUMN */}
        <div className="space-y-7">
          {/* Preparation Progress */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <CookingPot className="h-7 w-7" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Order is Being Prepared
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    ID: {displayOrderId} • Student Pickup
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Estimated Ready
                </p>

                <p className="mt-1 text-2xl font-extrabold text-orange-700">
                  12:45 PM
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  Preparation Progress
                </span>

                <span className="text-sm font-bold text-slate-800">
                  60% Complete
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
              </div>

              <p className="mt-3 text-xs font-medium italic text-slate-500">
                Currently at: Chef is assembling the main course.
              </p>
            </div>
          </section>

          {/* Customer + Timeline */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Customer */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <UserRound className="h-5 w-5 text-orange-700" />
                Customer Information
              </h3>

              <InfoRow
                label="Student Name"
                value="Fahim Ahmed"
              />

              <InfoRow
                label="Department"
                value="Computer Science & Engineering"
              />

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Payment Status
                </p>

                <span className="mt-1 inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                  <CircleCheck className="h-3.5 w-3.5" />
                  PAID (bKash)
                </span>
              </div>
            </section>

            {/* Timeline */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <Clock3 className="h-5 w-5 text-orange-700" />
                Timeline
              </h3>

              <InfoRow
                label="Order Placed"
                value="12:30 PM"
              />

              <InfoRow
                label="Prep Started"
                value="12:35 PM (8m 45s ago)"
              />

              <InfoRow
                label="Total Prep Time Allotted"
                value="15 Minutes"
              />
            </section>
          </div>

          {/* Order Items */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-7">
              <h3 className="text-lg font-semibold text-slate-800">
                Order Items (3)
              </h3>
            </div>

            {orderItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between border-b border-slate-100 px-7 py-6 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-2xl">
                    {item.emoji}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Qty: {String(item.quantity).padStart(2, "0")}
                    </p>
                  </div>
                </div>

                <span className="font-medium text-orange-700">
                  ৳{item.price}
                </span>
              </div>
            ))}
          </section>

          {/* Special Instructions */}
          <section className="flex gap-5 rounded-3xl border border-orange-200 bg-orange-50 p-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-orange-700 shadow-sm">
              <ListChecks className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-medium text-orange-700">
                Special Kitchen Instructions
              </h3>

              <p className="mt-2 max-w-2xl font-medium leading-7 text-slate-800">
                "Please make the Biryani extra spicy. For the lime
                juice, one glass with no ice and the other with extra
                ice. Student ID needs to be verified at counter."
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Status Checklist */}
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h3 className="mb-7 text-lg font-semibold text-slate-800">
              Live Status Checklist
            </h3>

            <div className="relative">
              <div className="absolute bottom-8 left-[13px] top-4 w-0.5 bg-slate-200" />

              <StatusItem
                icon={<Check className="h-4 w-4" />}
                iconClass="bg-green-500 text-white"
                title="Order Accepted"
                subtitle="Confirmed at 12:31 PM"
              />

              <StatusItem
                icon={<Check className="h-4 w-4" />}
                iconClass="bg-green-500 text-white"
                title="Ingredients Collected"
                subtitle="Verified at 12:34 PM"
              />

              <StatusItem
                icon={<Utensils className="h-4 w-4" />}
                iconClass="bg-orange-700 text-white"
                title="Food Being Prepared"
                subtitle="Started 8 minutes ago"
                active
              />

              <StatusItem
                icon={<Package className="h-4 w-4" />}
                iconClass="border border-slate-300 bg-white text-slate-400"
                title="Packaging"
                subtitle="Waiting..."
                muted
              />

              <StatusItem
                icon={<CircleCheck className="h-4 w-4" />}
                iconClass="border border-slate-300 bg-white text-slate-400"
                title="Ready for Pickup"
                subtitle="Pending completion"
                muted
                last
              />
            </div>
          </section>

          {/* Queue Insight */}
          <section className="rounded-3xl border border-orange-200 bg-[#fffdf9] p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">
                Queue Insight
              </h3>

              <span className="rounded bg-orange-700 px-2 py-1 text-[10px] font-bold text-white">
                LIVE
              </span>
            </div>

            <QueueRow label="Orders in Queue" value="4 Active" />
            <QueueRow
              label="Workload"
              value="Medium"
              valueClass="text-sky-700"
            />
            <QueueRow label="Next Station Free" value="2 mins" />
          </section>

          {/* Actions */}
          <button
  type="button"
  onClick={() =>
    navigate(`/dashboard/shop/orders/${orderId}/ready`)
  }
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-orange-600"
>
  <CircleCheck className="h-5 w-5" />
  Mark Ready for Pickup
</button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Update
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              <MessageSquare className="h-4 w-4" />
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

function StatusItem({
  icon,
  iconClass,
  title,
  subtitle,
  active = false,
  muted = false,
  last = false,
}) {
  return (
    <div className={`relative flex gap-4 ${last ? "" : "pb-8"}`}>
      <div
        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconClass}`}
      >
        {icon}
      </div>

      <div>
        <p
          className={`font-medium ${
            active
              ? "font-bold text-orange-700"
              : muted
              ? "text-slate-500"
              : "text-slate-800"
          }`}
        >
          {title}
        </p>

        <p
          className={`mt-1 text-xs ${
            muted ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function QueueRow({ label, value, valueClass = "" }) {
  return (
    <div className="mb-4 flex items-center justify-between text-xs last:mb-0">
      <span className="font-medium text-slate-500">
        {label}
      </span>

      <strong className={valueClass}>
        {value}
      </strong>
    </div>
  );
}