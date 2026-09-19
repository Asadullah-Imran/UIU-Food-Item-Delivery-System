import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  AlertCircle,
  RotateCw,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrderChat } from '../../context/OrderChatContext';

export default function ShopPreparingOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { openOrderChat } = useOrderChat();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Fetch live order data ──────────────────────────────────────────────────
  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const authToken = token || localStorage.getItem('uiu_auth_token');
      if (!authToken) {
        setError('Authentication required. Please log in.');
        return;
      }

      const res = await fetch(`/api/shops/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Order not found');
      }

      setOrder(data.order);
    } catch (err) {
      console.error('ShopPreparingOrder fetch error:', err);
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId, fetchOrder]);

  // ── Mark Ready handler ─────────────────────────────────────────────────────
  const handleMarkReady = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      const authToken = token || localStorage.getItem('uiu_auth_token');
      const res = await fetch(`/api/shops/orders/${order._id || orderId}/ready`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to mark order ready');
      }

      setOrder(data.order);
      setToast({ type: 'success', message: `${data.order?.orderNumber || 'Order'} is ready for pickup! Runner has been notified.` });
      setTimeout(() => setToast(null), 4000);

      // Navigate to the ready-for-pickup view
      setTimeout(() => {
        navigate(`/dashboard/shop/orders/${order._id || orderId}/ready`);
      }, 1000);
    } catch (err) {
      console.error('Mark Ready Error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to mark order ready' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] py-20 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-bold text-slate-600 text-sm">Loading kitchen order...</p>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className="mx-auto max-w-[1400px] py-16 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Order Not Available</h2>
        <p className="text-slate-500 text-sm mb-6">{error || 'Could not retrieve this order.'}</p>
        <div className="flex justify-center gap-4">
          <Link
            to="/dashboard/shop/orders"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-sm hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
          </Link>
          <button
            onClick={fetchOrder}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Derived display values ─────────────────────────────────────────────────
  const displayOrderId = order.orderNumber || `#${orderId}`;

  // Timeline timestamps
  const placedEntry    = order.timeline?.find(t => t.status === 'PLACED');
  const confirmedEntry = order.timeline?.find(t => t.status === 'CONFIRMED');
  const preparingEntry = order.timeline?.find(t => t.status === 'PREPARING');

  const fmt = (d) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

  // Elapsed prep time
  const prepStart = preparingEntry?.time ? new Date(preparingEntry.time) : null;
  const elapsedMs = prepStart ? Date.now() - prepStart.getTime() : 0;
  const elapsedMin = Math.floor(elapsedMs / 60000);
  const elapsedSec = Math.floor((elapsedMs % 60000) / 1000);
  const elapsedLabel = prepStart
    ? `${elapsedMin}m ${elapsedSec}s ago`
    : '—';

  const isPreparingStage  = order.status === 'PREPARING';
  const isReadyStage      = order.status === 'READY_FOR_PICKUP';
  const isDeliveredStage  = order.status === 'DELIVERED';

  return (
    <div className="mx-auto max-w-[1400px] pb-12 pt-4">

      {/* Breadcrumb */}
      <div className="mb-2 flex items-center text-sm font-medium text-slate-500">
        <Link to="/dashboard/shop" className="transition-colors hover:text-slate-800">Dashboard</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <Link to="/dashboard/shop/orders" className="transition-colors hover:text-slate-800">Incoming Orders</Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="font-bold text-slate-800">Preparing — {displayOrderId}</span>
      </div>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Preparing Order</h1>
          <p className="mt-1 font-medium text-slate-500">
            Kitchen staff are preparing this order for pickup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrder}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="flex items-center gap-2 rounded-full border border-orange-500 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
            <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between border shadow-sm ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success'
              ? <CircleCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              : <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-xs font-bold underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_340px]">

        {/* LEFT COLUMN */}
        <div className="space-y-7">

          {/* Preparation Progress Card */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <CookingPot className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Order is Being Prepared</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {displayOrderId} • {order.student?.name || 'Student Pickup'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</p>
                <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-bold ${
                  isPreparingStage ? 'bg-orange-100 text-orange-700' :
                  isReadyStage ? 'bg-green-100 text-green-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {order.status?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Progress bar — animates based on elapsed time */}
            {isPreparingStage && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">Preparation Progress</span>
                  <span className="text-sm font-bold text-orange-700">Elapsed: {elapsedMin}m {elapsedSec}s</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-300 transition-all duration-1000"
                    style={{ width: `${Math.min(95, (elapsedMin / 15) * 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-xs font-medium italic text-slate-500">
                  Started at {fmt(preparingEntry?.time)} — estimated 15 min prep time
                </p>
              </div>
            )}

            {isReadyStage && (
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 p-4">
                <CircleCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
                <p className="font-bold text-green-800 text-sm">Order is ready for runner pickup!</p>
              </div>
            )}
          </section>

          {/* Customer + Timeline Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Customer */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <UserRound className="h-5 w-5 text-orange-700" />
                Customer Information
              </h3>
              <InfoRow label="Student Name" value={order.student?.name || '—'} />
              <InfoRow label="University ID" value={order.student?.universityId || '—'} />
              <InfoRow label="Phone" value={order.student?.phone || '—'} />
              <div>
                <p className="text-xs font-semibold text-slate-500">Drop-off Location</p>
                <p className="mt-1 font-medium text-slate-800">
                  {order.deliveryAddress?.building || 'Academic Building'}, {order.deliveryAddress?.room || '—'}
                </p>
              </div>
            </section>

            {/* Timeline */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <Clock3 className="h-5 w-5 text-orange-700" />
                Timeline
              </h3>
              <InfoRow label="Order Placed"      value={fmt(placedEntry?.time)} />
              <InfoRow label="Order Confirmed"   value={fmt(confirmedEntry?.time)} />
              <InfoRow label="Prep Started"      value={fmt(preparingEntry?.time)} />
              <InfoRow label="Elapsed Time"      value={prepStart ? elapsedLabel : '—'} />
            </section>
          </div>

          {/* Order Items */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-7">
              <h3 className="text-lg font-semibold text-slate-800">
                Order Items ({order.items?.length || 0})
              </h3>
            </div>

            {(order.items || []).map((item, idx) => {
              const img = item.menuItem?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80';
              const subtotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
              return (
                <div
                  key={item._id || idx}
                  className="flex items-center justify-between border-b border-slate-100 px-7 py-5 last:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img src={img} alt={item.name} className="h-14 w-14 rounded-xl object-cover border border-slate-100 shadow-sm" />
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">Qty: {String(item.quantity).padStart(2, '0')}</p>
                      {item.note && <p className="mt-0.5 text-xs italic text-orange-600">Note: {item.note}</p>}
                    </div>
                  </div>
                  <span className="font-bold text-orange-700">৳{subtotal}</span>
                </div>
              );
            })}

            {/* Billing summary */}
            <div className="p-6 bg-slate-50 flex justify-end">
              <div className="w-64 space-y-2 text-sm font-semibold text-slate-500">
                <div className="flex justify-between"><span>Subtotal</span><span>৳{order.billing?.subtotal || 0}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span>৳{order.billing?.deliveryFee || 0}</span></div>
                {order.billing?.discount > 0 && (
                  <div className="flex justify-between text-red-500"><span>Discount</span><span>-৳{order.billing.discount}</span></div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-extrabold text-slate-800">
                  <span>Grand Total</span>
                  <span className="text-orange-500">৳{order.billing?.grandTotal || 0}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <section className="flex gap-5 rounded-3xl border border-orange-200 bg-orange-50 p-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-orange-700 shadow-sm">
                <ListChecks className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-orange-700">Special Kitchen Instructions</h3>
                <p className="mt-2 max-w-2xl font-medium leading-7 text-slate-800">
                  "{order.specialInstructions}"
                </p>
              </div>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Status Checklist */}
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h3 className="mb-7 text-lg font-semibold text-slate-800">Live Status Checklist</h3>
            <div className="relative">
              <div className="absolute bottom-8 left-[13px] top-4 w-0.5 bg-slate-200" />
              <StatusItem
                icon={<Check className="h-4 w-4" />}
                iconClass="bg-green-500 text-white"
                title="Order Accepted"
                subtitle={`Confirmed at ${fmt(confirmedEntry?.time)}`}
              />
              <StatusItem
                icon={<Utensils className="h-4 w-4" />}
                iconClass={isPreparingStage ? 'bg-orange-700 text-white' : 'bg-green-500 text-white'}
                title="Food Being Prepared"
                subtitle={preparingEntry ? `Started ${elapsedLabel}` : 'Pending...'}
                active={isPreparingStage}
              />
              <StatusItem
                icon={<Package className="h-4 w-4" />}
                iconClass={isReadyStage || isDeliveredStage ? 'bg-green-500 text-white' : 'border border-slate-300 bg-white text-slate-400'}
                title="Ready for Pickup"
                subtitle={isReadyStage || isDeliveredStage ? 'Ready!' : 'Waiting...'}
                muted={!isReadyStage && !isDeliveredStage}
              />
              <StatusItem
                icon={<CircleCheck className="h-4 w-4" />}
                iconClass={isDeliveredStage ? 'bg-green-500 text-white' : 'border border-slate-300 bg-white text-slate-400'}
                title="Delivered"
                subtitle={isDeliveredStage ? 'Completed' : 'Pending'}
                muted={!isDeliveredStage}
                last
              />
            </div>
          </section>

          {/* Actions */}
          {isPreparingStage && (
            <button
              type="button"
              onClick={handleMarkReady}
              disabled={actionLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-orange-600 disabled:opacity-60"
            >
              <CircleCheck className="h-5 w-5" />
              {actionLoading ? 'Marking Ready...' : 'Mark Ready for Pickup'}
            </button>
          )}

          {isReadyStage && (
            <button
              type="button"
              onClick={() => navigate(`/dashboard/shop/orders/${order._id || orderId}/ready`)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-green-700"
            >
              <Package className="h-5 w-5" />
              View Pickup Details
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={fetchOrder}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => openOrderChat(order.orderNumber || orderId, 'student')}
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
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-800">{value || '—'}</p>
    </div>
  );
}

function StatusItem({ icon, iconClass, title, subtitle, active = false, muted = false, last = false }) {
  return (
    <div className={`relative flex gap-4 ${last ? '' : 'pb-8'}`}>
      <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
        {icon}
      </div>
      <div>
        <p className={`font-medium ${active ? 'font-bold text-orange-700' : muted ? 'text-slate-500' : 'text-slate-800'}`}>
          {title}
        </p>
        <p className={`mt-1 text-xs ${muted ? 'text-slate-400' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}