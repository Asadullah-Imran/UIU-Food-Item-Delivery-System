import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  PackageCheck,
  Home,
  RefreshCw,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrderChat } from '../../context/OrderChatContext';

export default function ShopReadyForPickup() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { token } = useAuth();
  const { openOrderChat } = useOrderChat();

  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(orderId || null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isHandedOver, setIsHandedOver] = useState(false);

  // ── Fetch all orders with status READY_FOR_PICKUP ───────────────────────────
  const fetchReadyOrders = useCallback(async (isSilentRefresh = false) => {
    try {
      if (isSilentRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const authToken = token || localStorage.getItem('uiu_auth_token');
      if (!authToken) {
        setError('Authentication required. Please log in.');
        return;
      }

      const res = await fetch('/api/shops/orders?status=READY_FOR_PICKUP', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch ready-for-pickup orders');
      }

      const readyList = data.orders || [];
      setOrders(readyList);

      // If an orderId param exists or we already have a selection, keep it if valid;
      // otherwise default to the first order in the queue.
      if (orderId) {
        setSelectedOrderId(orderId);
      } else if (!selectedOrderId && readyList.length > 0) {
        setSelectedOrderId(readyList[0]._id || readyList[0].orderNumber);
      }
    } catch (err) {
      console.error('ShopReadyForPickup fetch error:', err);
      setError(err.message || 'Unable to load ready-for-pickup orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, orderId, selectedOrderId]);

  useEffect(() => {
    fetchReadyOrders();
  }, [fetchReadyOrders]);

  // Keep selectedOrderId in sync with route params if route changes
  useEffect(() => {
    if (orderId) {
      setSelectedOrderId(orderId);
    }
  }, [orderId]);

  // Find active order from fetched list
  const activeOrder = orders.find(
    (o) => o._id === selectedOrderId || o.orderNumber === selectedOrderId
  ) || (orders.length > 0 ? orders[0] : null);

  // Derive pickup verification code (last 4 numeric digits or order ID fragment)
  const pickupCode = activeOrder
    ? `#${(activeOrder.orderNumber || '').replace(/[^0-9]/g, '').slice(-4) || '9821'}`
    : '#9821';

  // Format ready timestamp from timeline or updatedAt
  const getReadyTimeFormatted = (ord) => {
    if (!ord) return 'Just now';
    const readyEvent = Array.isArray(ord.timeline)
      ? ord.timeline.find((t) => t.status === 'READY_FOR_PICKUP')
      : null;
    const dateObj = readyEvent?.time ? new Date(readyEvent.time) : new Date(ord.updatedAt || ord.createdAt);
    if (isNaN(dateObj.getTime())) return 'Recently';
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleConfirmHandover = async () => {
    try {
      if (!activeOrder || !activeOrder.runner) {
        setError('Cannot handover without a runner assigned.');
        return;
      }
      const authToken = token || localStorage.getItem('uiu_auth_token');
      const res = await fetch(`/api/shops/orders/${activeOrder._id}/handover`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to handover order');
      }
      setIsHandedOver(true);
    } catch (err) {
      console.error('Handover error:', err);
      setError(err.message || 'Could not complete handover');
    }
  };

  // ── LOADING STATE ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-16 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-4 animate-spin">
          <RefreshCw className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Loading Ready-for-Pickup Queue...</h2>
        <p className="mt-1 text-sm text-slate-500">Fetching handoff orders from server</p>
      </div>
    );
  }

  // ── ERROR STATE ─────────────────────────────────────────────────────────────
  if (error && orders.length === 0) {
    return (
      <div className="mx-auto max-w-[900px] px-4 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50/70 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
          <h2 className="text-lg font-bold text-red-800">Error Loading Handoff Queue</h2>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            onClick={() => fetchReadyOrders(false)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-14 pt-4">
      {/* Breadcrumb Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center text-sm font-medium text-slate-500">
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
            Orders Queue
          </Link>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="font-bold text-orange-700">
            Ready for Pickup ({orders.length})
          </span>
        </div>

        {/* Live Refresh Button */}
        <button
          type="button"
          onClick={() => fetchReadyOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm hover:border-slate-300 hover:text-slate-900 transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-orange-500 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing Queue...' : 'Refresh Handoff Queue'}
        </button>
      </div>

      {/* EMPTY QUEUE STATE */}
      {orders.length === 0 ? (
        <div className="mx-auto max-w-[800px] rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 mb-5">
            <PackageCheck className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Ready-for-Pickup Queue is Empty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500 leading-relaxed">
            All prepared orders have either been collected by delivery runners or there are no food items currently awaiting pickup.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard/shop/orders"
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-all"
            >
              <ShoppingBag className="h-4 w-4" /> View Incoming & Preparing Orders
            </Link>
            <button
              onClick={() => fetchReadyOrders(false)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <RefreshCw className="h-4 w-4" /> Check for New Ready Orders
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: QUEUE LIST (WHEN MULTIPLE ORDERS ARE READY) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Package className="h-4 w-4 text-orange-500" />
                Handoff Queue ({orders.length})
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Ready for Runners
              </span>
            </div>

            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {orders.map((ord) => {
                const isSelected = activeOrder && (activeOrder._id === ord._id);
                return (
                  <div
                    key={ord._id}
                    onClick={() => setSelectedOrderId(ord._id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 shadow-sm ring-2 ring-orange-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-black text-slate-800">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        READY
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-bold text-slate-700">
                      {ord.student?.name || 'Student Order'}
                    </p>

                    <div className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                      {ord.items?.map((it) => `${it.quantity}x ${it.name}`).join(', ') || 'Food items'}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-orange-600">
                        ৳{ord.billing?.grandTotal || ord.totalAmount || 0}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {getReadyTimeFormatted(ord)}
                      </div>
                    </div>

                    {ord.runner ? (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <UserRound className="h-3 w-3" />
                        Runner: {ord.runner.name}
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] font-medium text-amber-600">
                        ⏳ Awaiting runner pickup
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: SELECTED ORDER HANDOFF DETAILS & ACTIONS */}
          <div className="lg:col-span-8 space-y-7">
            {/* SUCCESS / READY BANNER */}
            <section className="flex items-center gap-6 rounded-3xl border border-emerald-100 bg-gradient-to-r from-white via-emerald-50/40 to-emerald-50 p-7 shadow-sm">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
                  <Check className="h-6 w-6" strokeWidth={3} />
                </div>
              </div>

              <div>
                <h1 className="text-xl font-black text-slate-800">
                  {isHandedOver ? '🎉 Handover Complete!' : '🎉 Food Preparation Complete — Ready for Pickup'}
                </h1>

                <p className="mt-1 max-w-3xl text-xs sm:text-sm font-medium leading-relaxed text-slate-600">
                  {isHandedOver
                    ? `Package for ${activeOrder?.orderNumber} has been handed over to delivery runner. The student will receive live transit updates.`
                    : `Order ${activeOrder?.orderNumber} is prepared and packed at the counter. Food preparation responsibility is complete! Delivery runners have been notified for counter collection.`}
                </p>
              </div>
            </section>

            {/* RUNNER STATUS & PICKUP VERIFICATION CARD */}
            <section className="rounded-3xl border border-slate-200 border-l-4 border-l-orange-500 bg-white p-7 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Delivery Runner Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        activeOrder?.runner ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`}
                    />
                    <span className="text-lg font-black text-slate-800">
                      {activeOrder?.runner
                        ? `${activeOrder.runner.name} (Assigned & En Route)`
                        : 'Waiting for Campus Runner Assignment'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Counter Pickup Code
                  </p>
                  <p className="mt-1 font-mono text-2xl font-black text-orange-600">
                    {pickupCode}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl bg-[#f8f6f3] p-4 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Runner Contact</p>
                    <p className="text-sm font-bold text-slate-800">
                      {activeOrder?.runner?.phone || 'Assigned automatically upon pickup'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-[#f8f6f3] p-4 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Verification at Counter</p>
                    <p className="text-sm font-bold text-slate-800">
                      Match Code {pickupCode} with Runner
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS & COMMUNICATION */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                {!isHandedOver ? (
                  <div className="w-full flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={!activeOrder?.runner}
                      onClick={handleConfirmHandover}
                      className={`flex-1 font-bold py-3 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-xs ${activeOrder?.runner ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'}`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Package Handover
                    </button>

                    {activeOrder && (
                      <button
                        type="button"
                        onClick={() => openOrderChat(activeOrder._id)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-2xl transition-colors flex items-center justify-center gap-2 text-xs"
                      >
                        <MessageSquare className="w-4 h-4 text-orange-400" />
                        Chat (Student / Runner)
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Package handed over to runner successfully!
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/shop/orders')}
                      className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 text-xs"
                    >
                      Back to Orders Queue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* ORDER DETAILS SUMMARY */}
            {activeOrder && (
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between bg-[#f8f5f2] px-7 py-4 border-b border-slate-200/60">
                  <h2 className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                    <ReceiptText className="h-4 w-4 text-orange-600" />
                    Order Summary — {activeOrder.orderNumber}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold text-emerald-700">
                    <BadgeCheck className="h-4 w-4" />
                    {isHandedOver ? 'In Delivery Transit' : 'Packed & Ready at Counter'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-7 sm:grid-cols-4">
                  <Detail label="ORDER ID" value={activeOrder.orderNumber} />
                  <Detail label="STUDENT NAME" value={activeOrder.student?.name || 'Student'} />
                  <Detail label="STUDENT PHONE" value={activeOrder.student?.phone || 'N/A'} />
                  <Detail label="PICKUP COUNTER" value={activeOrder.shop?.location || 'Food Court Counter'} />
                  <Detail
                    label="TOTAL ITEMS"
                    value={`${activeOrder.items?.length || 0} Items (${activeOrder.items?.map((it) => it.name).join(', ') || ''})`}
                  />
                  <Detail
                    label="TOTAL AMOUNT"
                    value={`৳${activeOrder.billing?.grandTotal || activeOrder.totalAmount || 0}`}
                    valueClass="text-orange-600 font-black text-base"
                  />
                  <Detail label="READY TIME" value={getReadyTimeFormatted(activeOrder)} />
                  <Detail
                    label="PAYMENT STATUS"
                    value={`Paid (${activeOrder.payment?.method || 'wallet'})`}
                    valueClass="text-emerald-600 font-bold"
                  />
                </div>

                {/* ITEM BREAKDOWN */}
                <div className="px-7 pb-7">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    Prepared Items Checklist
                  </p>
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-[#fbf9f7] overflow-hidden">
                    {activeOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 text-xs font-semibold">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 font-black text-orange-600 text-[11px]">
                            {item.quantity}x
                          </span>
                          <span className="text-slate-800 font-bold">{item.name}</span>
                          {item.note && (
                            <span className="text-[10px] text-slate-400 italic">({item.note})</span>
                          )}
                        </div>
                        <span className="text-slate-600 font-bold">
                          ৳{(item.price || 0) * (item.quantity || 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* PROCESS TIMELINE */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-800 text-sm">
                  Order Lifecycle Progression
                </h2>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Shop Preparation Stage Complete ✅
                </span>
              </div>

              <div className="flex items-start justify-between">
                <TimelineStep
                  icon={<Check className="h-4 w-4" />}
                  label="PLACED"
                  state="complete"
                />
                <TimelineLine active />
                <TimelineStep
                  icon={<Check className="h-4 w-4" />}
                  label="CONFIRMED"
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
                  icon={<Check className="h-4 w-4" />}
                  label="READY"
                  state="complete"
                />
                <TimelineLine active={isHandedOver} />
                <TimelineStep
                  icon={isHandedOver ? <Check className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                  label="PICKED UP"
                  state={isHandedOver ? 'complete' : 'current'}
                />
                <TimelineLine active={false} />
                <TimelineStep
                  icon={<Home className="h-4 w-4" />}
                  label="DELIVERED"
                  state="inactive"
                />
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, valueClass = 'text-slate-900' }) {
  return (
    <div>
      <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
        {label}
      </p>
      <p className={`mt-1 text-xs font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function TimelineStep({ icon, label, state = 'inactive' }) {
  const circleStyle =
    state === 'complete'
      ? 'bg-emerald-500 text-white shadow-sm'
      : state === 'current'
      ? 'border-[3px] border-orange-500 bg-white text-orange-500'
      : 'bg-slate-100 text-slate-400';

  const labelStyle =
    state === 'complete'
      ? 'text-emerald-600 font-bold'
      : state === 'current'
      ? 'text-orange-600 font-bold'
      : 'text-slate-400';

  return (
    <div className="flex min-w-[55px] flex-col items-center">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${circleStyle}`}>
        {icon}
      </div>
      <span className={`mt-2 whitespace-nowrap text-[9px] font-black ${labelStyle}`}>
        {label}
      </span>
    </div>
  );
}

function TimelineLine({ active = false }) {
  return (
    <div
      className={`mt-4 h-0.5 flex-1 ${
        active ? 'bg-emerald-500' : 'bg-slate-200'
      }`}
    />
  );
}