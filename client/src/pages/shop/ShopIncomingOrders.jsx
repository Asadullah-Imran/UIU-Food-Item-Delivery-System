import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, Utensils, ShoppingBag, CheckCircle2,
  BellRing, CheckCircle, Banknote, XCircle, 
  ChevronDown, Truck, FileText, Radio, Eye, RotateCw, AlertCircle, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ShopIncomingOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PLACED');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  // Reject modal state
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const authToken = token || localStorage.getItem('uiu_auth_token');
      if (!authToken) {
        setError('Authentication token missing. Please log in.');
        setLoading(false);
        return;
      }

      const queryUrl = statusFilter === 'ALL'
        ? '/api/shops/orders'
        : `/api/shops/orders?status=${statusFilter}`;

      const [filteredRes, allRes] = await Promise.all([
        fetch(queryUrl, {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        fetch('/api/shops/orders', {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ]);

      const filteredData = await filteredRes.json();
      const allData = await allRes.json();

      if (filteredData.success) {
        setOrders(filteredData.orders || []);
      } else {
        setError(filteredData.message || 'Failed to fetch incoming orders');
      }

      if (allData.success) {
        setAllOrders(allData.orders || []);
      }
    } catch (err) {
      console.error('Error fetching shop orders:', err);
      setError('Unable to reach server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, statusFilter]);

  // Dynamic metrics computed from real database orders
  const metrics = useMemo(() => {
    const newOrders = allOrders.filter((o) => o.status === 'PLACED').length;
    const preparing = allOrders.filter((o) => o.status === 'PREPARING' || o.status === 'CONFIRMED').length;
    const readyForPickup = allOrders.filter((o) => o.status === 'READY_FOR_PICKUP').length;
    const completedToday = allOrders.filter((o) => o.status === 'DELIVERED').length;

    return {
      newOrders,
      preparing,
      readyForPickup,
      completedToday
    };
  }, [allOrders]);

  // Priority order: latest PLACED order
  const priorityOrder = useMemo(() => {
    const placed = allOrders.filter((o) => o.status === 'PLACED');
    return placed.length > 0 ? placed[0] : null;
  }, [allOrders]);

  const handleAcceptOrder = async (orderId) => {
    try {
      setActionLoading(orderId);
      const authToken = token || localStorage.getItem('uiu_auth_token');
      const res = await fetch(`/api/shops/orders/${orderId}/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to accept order');
      }

      setToast({
        type: 'success',
        message: `Order ${data.order?.orderNumber || ''} accepted successfully!`
      });
      setTimeout(() => setToast(null), 4000);
      await fetchOrders();
    } catch (err) {
      console.error('Accept Order Error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to accept order' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalOrder) return;
    const orderId = rejectModalOrder._id;
    try {
      setActionLoading(orderId);
      const authToken = token || localStorage.getItem('uiu_auth_token');
      const res = await fetch(`/api/shops/orders/${orderId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          reason: rejectReason.trim() || 'Item unavailable / Shop capacity reached'
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reject order');
      }

      setToast({
        type: 'success',
        message: `Order ${data.order?.orderNumber || ''} rejected. Student refunded 100% via Campus Wallet.`
      });
      setTimeout(() => setToast(null), 5000);
      setRejectModalOrder(null);
      setRejectReason('');
      await fetchOrders();
    } catch (err) {
      console.error('Reject Order Error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to reject order' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto space-y-8 pt-4 pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Incoming Orders</h1>
            <p className="text-slate-500 font-medium mt-1">Review, accept, reject, and manage live student orders.</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin text-orange-500' : 'text-slate-500'}`} />
            Refresh Orders
          </button>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`p-4 rounded-2xl flex items-center justify-between border shadow-sm transition-all ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex items-center">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-3 text-rose-500 flex-shrink-0" />
              )}
              <span className="font-semibold text-sm">{toast.message}</span>
            </div>
            <button onClick={() => setToast(null)} className="text-xs font-bold underline ml-4">Dismiss</button>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 border-l-4 border-l-orange-500">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">Live</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">New Orders</p>
              <h3 className="text-4xl font-extrabold text-slate-800">{metrics.newOrders}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-blue-600">In Kitchen</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Preparing</p>
              <h3 className="text-4xl font-extrabold text-slate-800">
                {metrics.preparing < 10 ? `0${metrics.preparing}` : metrics.preparing}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 border-l-4 border-l-indigo-400">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-indigo-500">Waiting</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Ready for Pickup</p>
              <h3 className="text-4xl font-extrabold text-slate-800">
                {metrics.readyForPickup < 10 ? `0${metrics.readyForPickup}` : metrics.readyForPickup}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 border-l-4 border-l-slate-800">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Total Delivered</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Completed</p>
              <h3 className="text-4xl font-extrabold text-slate-800">{metrics.completedToday}</h3>
            </div>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-6">Workflow Status Progression</p>
          <div className="flex items-center justify-between relative max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center bg-white px-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white">
                {metrics.newOrders}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-3">New (PLACED)</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center bg-white px-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white">
                {metrics.preparing}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-3">Preparing</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center bg-white px-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white">
                {metrics.readyForPickup}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-3">Ready for Pickup</span>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center bg-white px-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white">
                {metrics.completedToday}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-3">Delivered</span>
            </div>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Orders List */}
          <div className="flex-1 min-w-0 flex flex-col">
            
            {/* Priority Order Alert Card (Shows top pending order if present) */}
            {priorityOrder && (
              <div className="bg-[#FFF8F1] rounded-2xl border border-orange-200 p-6 flex flex-col xl:flex-row xl:items-center justify-between mb-6 shadow-sm">
                <div className="flex items-start mb-4 xl:mb-0">
                  <div className="w-12 h-12 rounded-xl bg-white text-orange-500 flex items-center justify-center shadow-sm mr-4 flex-shrink-0">
                    <BellRing className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-slate-800">{priorityOrder.orderNumber}</h3>
                      <span className="bg-orange-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase">
                        Action Required
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-sm font-medium text-slate-600">
                      <span>Student: {priorityOrder.student?.name || 'UIU Student'}</span>
                      {priorityOrder.student?.universityId && (
                        <span className="ml-1 text-xs text-slate-400">({priorityOrder.student.universityId})</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8 bg-[#FFF1E0] sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none">
                  <div className="text-center xl:text-right">
                    <h4 className="text-2xl font-extrabold text-orange-600">
                      {priorityOrder.billing?.grandTotal || 0} BDT
                    </h4>
                    <p className="text-xs font-bold text-slate-500 w-36 truncate" title={priorityOrder.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}>
                      {priorityOrder.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}
                    </p>
                  </div>
                  <div className="flex space-x-3 w-full sm:w-auto">
                    <Link
                      to={`/dashboard/shop/orders/${priorityOrder._id}`}
                      className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-xl transition-colors shadow-sm whitespace-nowrap text-center text-sm"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAcceptOrder(priorityOrder._id)}
                      disabled={actionLoading === priorityOrder._id}
                      className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-5 rounded-xl transition-colors shadow-sm whitespace-nowrap text-sm disabled:opacity-50"
                    >
                      {actionLoading === priorityOrder._id ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => setRejectModalOrder(priorityOrder)}
                      disabled={actionLoading === priorityOrder._id}
                      className="flex-1 sm:flex-none bg-white text-red-600 border border-red-200 hover:bg-red-50 font-bold py-3 px-5 rounded-xl transition-colors shadow-sm whitespace-nowrap text-sm disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Table Container */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
              
              {/* Filters Header */}
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {['PLACED', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'DELIVERED', 'REJECTED', 'ALL'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                        statusFilter === st
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'ALL' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Showing {orders.length} order{orders.length === 1 ? '' : 's'}
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto flex-1">
                {loading ? (
                  <div className="p-16 text-center">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-slate-500">Loading incoming orders...</p>
                  </div>
                ) : error ? (
                  <div className="p-12 text-center text-red-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                    <p className="font-bold text-sm">{error}</p>
                    <button
                      onClick={fetchOrders}
                      className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                    >
                      Try Again
                    </button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Inbox className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-slate-700">No {statusFilter === 'ALL' ? '' : statusFilter} orders</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-1 max-w-sm mx-auto">
                      {statusFilter === 'PLACED' 
                        ? 'There are currently no new student orders waiting for shop confirmation.' 
                        : 'No orders found matching the selected status filter.'}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b-2 border-slate-100 bg-[#F9FAFB]">
                        <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider pl-6">Order ID</th>
                        <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Student</th>
                        <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Items</th>
                        <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-right">Value</th>
                        <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-center">Payment</th>
                        <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-right">Placed At</th>
                        <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-center">Status</th>
                        <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-center pr-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map((ord) => {
                        const itemsSummary = ord.items?.map((i) => `${i.name} x${i.quantity}`).join(', ') || 'No items';
                        const timeStr = ord.createdAt 
                          ? new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '—';

                        return (
                          <tr key={ord._id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-5 pl-6 font-bold text-slate-800 text-sm whitespace-nowrap">
                              <Link to={`/dashboard/shop/orders/${ord._id}`} className="hover:text-orange-600 transition-colors">
                                {ord.orderNumber}
                              </Link>
                            </td>
                            <td className="py-5 whitespace-nowrap">
                              <p className="text-sm font-bold text-slate-700">{ord.student?.name || 'Student'}</p>
                              {ord.student?.universityId && (
                                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">ID: {ord.student.universityId}</p>
                              )}
                            </td>
                            <td className="py-5">
                              <p className="text-xs font-semibold text-slate-600 max-w-[150px] truncate" title={itemsSummary}>
                                {itemsSummary}
                              </p>
                            </td>
                            <td className="py-5 text-right whitespace-nowrap">
                              <p className="text-sm font-extrabold text-slate-800">{ord.billing?.grandTotal || 0}</p>
                              <p className="text-[10px] font-extrabold text-slate-400 uppercase">BDT</p>
                            </td>
                            <td className="py-5 text-center whitespace-nowrap">
                              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Paid
                              </span>
                            </td>
                            <td className="py-5 text-right whitespace-nowrap">
                              <p className="text-xs font-semibold text-slate-500">{timeStr}</p>
                            </td>
                            <td className="py-5 text-center whitespace-nowrap">
                              {ord.status === 'PLACED' && (
                                <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                  PLACED
                                </span>
                              )}
                              {ord.status === 'CONFIRMED' && (
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                  CONFIRMED
                                </span>
                              )}
                              {ord.status === 'PREPARING' && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                  PREPARING
                                </span>
                              )}
                              {ord.status === 'READY_FOR_PICKUP' && (
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                  READY
                                </span>
                              )}
                              {ord.status === 'DELIVERED' && (
                                <span className="px-3 py-1 bg-slate-800 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                  DELIVERED
                                </span>
                              )}
                              {ord.status === 'REJECTED' && (
                                <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                  REJECTED
                                </span>
                              )}
                            </td>
                            <td className="py-5 pr-6 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center space-x-2">
                                <Link
                                  to={`/dashboard/shop/orders/${ord._id}`}
                                  className="p-1.5 text-slate-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                  title="View Order Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                {ord.status === 'PLACED' && (
                                  <>
                                    <button
                                      onClick={() => handleAcceptOrder(ord._id)}
                                      disabled={actionLoading === ord._id}
                                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                                      title="Accept Order"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setRejectModalOrder(ord)}
                                      disabled={actionLoading === ord._id}
                                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                      title="Reject Order"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

            </div>

          </div>

          {/* Right Column - Live Activity from Timeline */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl mb-6 border border-slate-100">
                <h2 className="text-sm font-bold text-slate-800 flex items-center">
                  <Radio className="w-4 h-4 mr-2 text-orange-500" /> Live Updates
                </h2>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>

              <div className="space-y-5 relative">
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>

                {allOrders.slice(0, 5).map((ord, idx) => (
                  <div key={ord._id || idx} className="flex relative z-10">
                    <div className="mr-3.5 flex-shrink-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                        ord.status === 'PLACED' ? 'bg-orange-50 text-orange-500' :
                        ord.status === 'CONFIRMED' ? 'bg-amber-50 text-amber-600' :
                        ord.status === 'REJECTED' ? 'bg-red-50 text-red-500' :
                        'bg-blue-50 text-blue-500'
                      }`}>
                        {ord.status === 'PLACED' && <BellRing className="w-4 h-4" />}
                        {ord.status === 'CONFIRMED' && <CheckCircle className="w-4 h-4" />}
                        {ord.status === 'REJECTED' && <XCircle className="w-4 h-4" />}
                        {ord.status !== 'PLACED' && ord.status !== 'CONFIRMED' && ord.status !== 'REJECTED' && (
                          <Utensils className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    <div className="pt-0.5 pb-1 flex-1">
                      <Link to={`/dashboard/shop/orders/${ord._id}`} className="text-xs font-bold text-slate-800 hover:text-orange-500 transition-colors block">
                        {ord.orderNumber}
                      </Link>
                      <p className="text-[11px] font-semibold text-slate-500">
                        {ord.status === 'PLACED' ? 'New order received' :
                         ord.status === 'CONFIRMED' ? 'Order confirmed by kitchen' :
                         ord.status === 'REJECTED' ? 'Order rejected & refunded' :
                         `Status: ${ord.status}`}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </p>
                    </div>
                  </div>
                ))}

                {allOrders.length === 0 && (
                  <p className="text-xs font-semibold text-slate-400 text-center py-6">
                    No recent activity recorded yet.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Rejection Modal */}
      {rejectModalOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Reject Order {rejectModalOrder.orderNumber}?</h3>
                <p className="text-xs text-slate-500">Student will receive an immediate 100% refund.</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Reason for Rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Item out of stock, kitchen at peak capacity..."
                rows={3}
                className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setRejectModalOrder(null);
                  setRejectReason('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={actionLoading === rejectModalOrder._id}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {actionLoading === rejectModalOrder._id ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
