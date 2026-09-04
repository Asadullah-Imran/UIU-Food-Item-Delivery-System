import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  Check,
  CheckCircle2,
  Bell,
  Send,
  ReceiptText,
  BadgeCheck,
  UserRound,
  Package,
  Home,
  RefreshCw,
} from "lucide-react";

export default function ShopReadyForPickup() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [refreshing, setRefreshing] = useState(false);

  const displayOrderId = orderId
    ? `#${orderId.replace(/^#/, "")}`
    : "#ORD-9025";

  const refreshStatus = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-[1400px] pb-14 pt-4">
      {/* Breadcrumb */}
      <div className="mb-7 flex items-center text-sm font-medium text-slate-500">
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

        <span className="font-bold text-orange-700">
          Ready for Pickup
        </span>
      </div>

      {/* SUCCESS BANNER */}
      <section className="mb-8 flex items-center gap-7 rounded-3xl border border-green-100 bg-gradient-to-r from-white to-green-50 p-8 shadow-sm">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-green-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
            <Check className="h-7 w-7" strokeWidth={3} />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-medium text-slate-800">
            🎉 Order Ready for Pickup
          </h1>

          <p className="mt-3 max-w-4xl text-sm font-medium leading-6 text-slate-600">
            The order has been prepared successfully. Delivery runners have
            been notified and the system is now waiting for a runner to accept
            the pickup request.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-[900px] space-y-7">
        {/* RUNNER STATUS */}
        <section className="rounded-3xl border border-slate-200 border-l-4 border-l-orange-500 bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Runner Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />

                <span className="text-lg font-bold text-orange-500">
                  ⏳ Waiting for Runner
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-500">
                Est. Acceptance
              </p>

              <p className="mt-2 font-bold text-slate-800">
                3m 59s
              </p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl bg-[#f7f4f1] p-5">
              <Bell className="h-6 w-6 shrink-0 text-green-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Push Status
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  Notification Sent Successfully
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-[#f7f4f1] p-5">
              <Send className="h-6 w-6 shrink-0 text-orange-700" />

              <div>
                <p className="text-sm text-slate-500">
                  Coverage
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  5 Nearby Runners Available
                </p>
              </div>
            </div>
          </div>

          {/* Optional refresh, replacing separate Quick Actions */}
          <button
            type="button"
            onClick={refreshStatus}
            className="mt-5 flex items-center gap-2 text-xs font-bold text-orange-600 transition hover:text-orange-700"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            {refreshing ? "Refreshing..." : "Refresh runner status"}
          </button>
        </section>

        {/* ORDER DETAILS */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-[#f8f5f2] px-7 py-5">
            <h2 className="flex items-center gap-2 font-bold text-slate-800">
              <ReceiptText className="h-5 w-5" />
              Order Details
            </h2>

            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold text-green-700">
              <BadgeCheck className="h-4 w-4" />
              Ready for Pickup
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 p-7 sm:grid-cols-4">
            <Detail
              label="ORDER ID"
              value={displayOrderId}
            />

            <Detail
              label="STUDENT NAME"
              value="Sifat Ullah"
            />

            <Detail
              label="SHOP NAME"
              value="Chef’s Table"
            />

            <Detail
              label="PICKUP COUNTER"
              value="Main Counter"
            />

            <Detail
              label="TOTAL ITEMS"
              value="2 Items"
            />

            <Detail
              label="TOTAL AMOUNT"
              value="320 BDT"
              valueClass="text-orange-700"
            />

            <Detail
              label="READY TIME"
              value="12:45 PM"
            />

            <Detail
              label="PAYMENT"
              value="Paid (bKash)"
              valueClass="text-green-600"
            />
          </div>
        </section>

        {/* PROCESS TIMELINE */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-8 font-bold text-slate-800">
            Process Timeline
          </h2>

          <div className="flex items-start justify-between">
            <TimelineStep
              icon={<Check className="h-4 w-4" />}
              label="PLACED"
              state="complete"
            />

            <TimelineLine active />

            <TimelineStep
              icon={<Check className="h-4 w-4" />}
              label="ACCEPTED"
              state="complete"
            />

            <TimelineLine active />

            <TimelineStep
              icon={<Check className="h-4 w-4" />}
              label="PREPARING"
              state="complete"
            />

            <TimelineLine active />

            <TimelineStep
              icon={<span className="h-2 w-2 rounded-full bg-green-500" />}
              label="READY"
              state="current"
            />

            <TimelineLine />

            <TimelineStep
              icon={<UserRound className="h-4 w-4" />}
              label="RUNNER"
            />

            <TimelineLine />

            <TimelineStep
              icon={<Package className="h-4 w-4" />}
              label="PICKED UP"
            />

            <TimelineLine />

            <TimelineStep
              icon={<Home className="h-4 w-4" />}
              label="DELIVERED"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  valueClass = "text-slate-900",
}) {
  return (
    <div>
      <p className="text-xs font-medium text-[#8a7468]">
        {label}
      </p>

      <p className={`mt-1 text-sm font-bold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function TimelineStep({
  icon,
  label,
  state = "inactive",
}) {
  const circleStyle =
    state === "complete"
      ? "bg-green-500 text-white"
      : state === "current"
      ? "border-[3px] border-green-500 bg-white text-green-500"
      : "bg-slate-100 text-slate-300";

  const labelStyle =
    state === "complete" || state === "current"
      ? "text-green-600"
      : "text-slate-300";

  return (
    <div className="flex min-w-[65px] flex-col items-center">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${circleStyle}`}
      >
        {icon}
      </div>

      <span
        className={`mt-3 whitespace-nowrap text-[9px] font-extrabold ${labelStyle}`}
      >
        {label}
      </span>
    </div>
  );
}

function TimelineLine({ active = false }) {
  return (
    <div
      className={`mt-4 h-0.5 flex-1 ${
        active ? "bg-green-500" : "bg-slate-100"
      }`}
    />
  );
}