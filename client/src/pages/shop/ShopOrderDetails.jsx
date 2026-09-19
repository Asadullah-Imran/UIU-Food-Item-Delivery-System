import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Check, Clock, MapPin, Phone, MessageSquare, PhoneCall,
  Info, FileText, ChevronRight, BellRing, ChefHat, Package, CheckCircle2, XCircle,
  AlertCircle, RotateCw, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrderChat } from '../../context/OrderChatContext';

const ShopOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { openOrderChat } = useOrderChat();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const authToken = token || localStorage.getItem('uiu_auth_token');
      if (!authToken) {
        setError('Authentication missing. Please log in.');
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/shops/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Order not found');
      }

      setOrder(data.order);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, token]);

  const handleAcceptOrder = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      const authToken = token || localStorage.getItem('uiu_auth_token');
      const res = await fetch(`/api/shops/orders/${order._id || orderId}/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to accept order');
      }

      setOrder(data.order);
      setToast({
        type: 'success',
        message: 'Order accepted successfully! You can now start kitchen preparation.'
      });
      setTimeout(() => setToast(null), 5000);
    } catch (err) {
      console.error('Accept Order Error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to accept order' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOrder = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      const authToken = token || localStorage.getItem('uiu_auth_token');
      const res = await fetch(`/api/shops/orders/${order._id || orderId}/reject`, {
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

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to reject order');
      }

      setOrder(data.order);
      setShowRejectModal(false);
      setRejectReason('');
      setToast({
        type: 'success',
        message: 'Order rejected. 100% of payment has been refunded to student wallet.'
      });
      setTimeout(() => setToast(null), 6000);
    } catch (err) {
      console.error('Reject Order Error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to reject order' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold text-slate-600 text-sm">Loading order specifications...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Order Not Available</h2>
        <p className="text-slate-500 text-sm mb-6">{error || 'Could not retrieve this order.'}</p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/dashboard/shop/orders"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-sm hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Incoming Orders
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

  // Determine timeline progress indicators
  const isPlaced = true;
  const isConfirmed = order.status === 'CONFIRMED' || order.status === 'PREPARING' || order.status === 'READY_FOR_PICKUP' || order.status === 'DELIVERED';
  const isPreparing = order.status === 'PREPARING' || order.status === 'READY_FOR_PICKUP' || order.status === 'DELIVERED';
  const isReady = order.status === 'READY_FOR_PICKUP' || order.status === 'DELIVERED';
  const isDelivered = order.status === 'DELIVERED';
  const isRejected = order.status === 'REJECTED';

  const placedDateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    : 'Recently';

  return (
    <>
      <div className="max-w-6xl mx-auto pb-12 pt-4">
        
        {/* Breadcrumbs & Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
              <Link to="/dashboard/shop" className="hover:text-slate-800 transition-colors">Dashboard</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link to="/dashboard/shop/orders" className="hover:text-slate-800 transition-colors">Incoming Orders</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-slate-800 font-bold">{order.orderNumber}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
            <p className="text-slate-500 font-medium text-sm">Review student order information and manage preparation workflow.</p>
          </div>
          <button
            onClick={fetchOrder}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between border shadow-sm ${
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

        {/* Rejection Alert Banner */}
        {isRejected && (
          <div className="mb-6 p-5 rounded-2xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800">
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Order Status: REJECTED</h4>
              <p className="text-xs mt-0.5 text-red-700">
                This order was rejected. The student has received a 100% full refund of ৳{order.billing?.grandTotal || 0} into their Campus Wallet.
              </p>
            </div>
          </div>
        )}

        {/* Timeline Progress */}
        {!isRejected && (
          <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-[10%] right-[10%] top-6 h-0.5 bg-slate-100 -z-10"></div>
              
              {/* Step 1: Placed */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm mb-3 ring-4 ring-white">
                  <Check className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-700">Order Placed</span>
              </div>

              {/* Step 2: Confirmation */}
              <div className={`flex flex-col items-center flex-1 ${!isConfirmed ? 'opacity-50' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm mb-3 ring-4 ring-white ${
                  isConfirmed ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <BellRing className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${isConfirmed ? 'text-orange-600' : 'text-slate-500'}`}>
                  Shop Confirmation
                </span>
              </div>

              {/* Step 3: Preparing */}
              <div className={`flex flex-col items-center flex-1 ${!isPreparing ? 'opacity-40' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ring-4 ring-white ${
                  isPreparing ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <ChefHat className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${isPreparing ? 'text-blue-600' : 'text-slate-500'}`}>Preparing</span>
              </div>

              {/* Step 4: Ready */}
              <div className={`flex flex-col items-center flex-1 ${!isReady ? 'opacity-40' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ring-4 ring-white ${
                  isReady ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Package className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${isReady ? 'text-indigo-600' : 'text-slate-500'}`}>Ready for Pickup</span>
              </div>

              {/* Step 5: Delivered */}
              <div className={`flex flex-col items-center flex-1 ${!isDelivered ? 'opacity-40' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ring-4 ring-white ${
                  isDelivered ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${isDelivered ? 'text-emerald-600' : 'text-slate-500'}`}>Delivered</span>
              </div>
            </div>
          </div>
        )}

        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Order Items & Summary */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Order Header Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 flex justify-between items-center border-l-[6px] border-l-orange-500">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h2 className="text-xl font-bold text-slate-800">{order.orderNumber}</h2>
                  <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-wider ${
                    order.status === 'PLACED' ? 'bg-orange-100 text-orange-600' :
                    order.status === 'CONFIRMED' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5" /> Placed at {placedDateStr}
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-extrabold text-orange-500 mb-1">{order.billing?.grandTotal || 0} BDT</h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                  Paid via Wallet
                </span>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 mb-6 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Ordered Items ({order.items?.length || 0})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-4 px-6 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Item Name</th>
                      <th className="py-4 px-6 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-center">Quantity</th>
                      <th className="py-4 px-6 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">Unit Price</th>
                      <th className="py-4 px-6 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {order.items?.map((item, idx) => {
                      const itemSubtotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                      const itemImg = item.menuItem?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80';

                      return (
                        <tr key={item._id || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <img src={itemImg} alt={item.name} className="w-12 h-12 rounded-xl object-cover mr-4 shadow-sm border border-slate-100" />
                              <div>
                                <span className="font-bold text-slate-800 text-sm block">{item.name}</span>
                                {item.note && (
                                  <span className="text-[11px] text-orange-600 italic">Note: {item.note}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-slate-700">x{item.quantity}</td>
                          <td className="py-4 px-6 text-right font-semibold text-slate-600">{item.price} BDT</td>
                          <td className="py-4 px-6 text-right font-extrabold text-slate-800">{itemSubtotal} BDT</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Billing Summary */}
              <div className="p-6 bg-slate-50 flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Subtotal</span>
                    <span>{order.billing?.subtotal || 0} BDT</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Delivery Fee</span>
                    <span>{order.billing?.deliveryFee || 0} BDT</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Discount</span>
                    <span className="text-red-500">-{order.billing?.discount || 0} BDT</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-800">
                    <span>Grand Total</span>
                    <span className="text-orange-500">{order.billing?.grandTotal || 0} BDT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-[#FFF8F1] rounded-2xl border-2 border-dashed border-orange-300 p-6 flex flex-col justify-center">
              <div className="flex items-center text-orange-500 font-bold mb-2 text-sm">
                <FileText className="w-4 h-4 mr-2" />
                Special Instructions
              </div>
              <p className="text-orange-800 italic font-medium text-sm">
                {order.specialInstructions || 'No special preparation instructions provided by student.'}
              </p>
            </div>

          </div>

          {/* Right Column - Student & Actions */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
            
            {/* Student Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-full text-left mb-6 font-bold text-slate-800 text-sm">Student Information</div>
              <img
                src={order.student?.avatar || 'https://i.pravatar.cc/150?u=' + (order.student?._id || 'uiu_student')}
                alt={order.student?.name || 'Student'}
                className="w-20 h-20 rounded-full object-cover shadow-sm mb-3 border-2 border-orange-100"
              />
              <h3 className="text-base font-bold text-slate-800">{order.student?.name || 'UIU Student'}</h3>
              {order.student?.universityId && (
                <p className="text-xs font-semibold text-slate-400 mb-5">ID: {order.student.universityId}</p>
              )}
              
              <div className="w-full bg-slate-50 rounded-2xl p-4 flex items-start mb-3 border border-slate-100">
                <MapPin className="w-4 h-4 text-orange-500 mr-2.5 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-700">{order.deliveryAddress?.building || 'Academic Building'}</p>
                  <p className="text-xs font-semibold text-slate-500">{order.deliveryAddress?.room || 'Campus Room'}</p>
                </div>
              </div>
              
              <div className="w-full bg-slate-50 rounded-2xl p-4 flex items-center mb-5 border border-slate-100">
                <Phone className="w-4 h-4 text-orange-500 mr-2.5 flex-shrink-0" />
                <p className="text-xs font-bold text-slate-700">{order.student?.phone || 'No phone provided'}</p>
              </div>

              <div className="w-full flex gap-3">
                <button 
                  onClick={() => openOrderChat(order.orderNumber || orderId, 'student')}
                  className="flex-1 bg-orange-50 hover:bg-orange-100 text-[#9B5110] font-bold py-2.5 px-3 rounded-xl transition-colors flex justify-center items-center text-xs border border-orange-200"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Chat
                </button>
                {order.student?.phone && (
                  <a 
                    href={`tel:${order.student.phone}`}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl transition-colors flex justify-center items-center text-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5 mr-1.5" /> Call
                  </a>
                )}
              </div>
            </div>

            {/* Order Actions Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="font-bold text-slate-800 text-sm mb-4">Order Actions</div>
              
              {/* Accept Order Button */}
              {order.status === 'PLACED' && (
                <button
                  onClick={handleAcceptOrder}
                  disabled={actionLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl transition-colors mb-3 flex justify-center items-center shadow-sm disabled:opacity-50 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {actionLoading ? 'Accepting...' : 'Accept Order'}
                </button>
              )}
              
              {/* Reject Order Button */}
              {order.status === 'PLACED' && (
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                  className="w-full bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold py-3 px-6 rounded-xl transition-colors mb-4 flex justify-center items-center text-sm disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Reject Order
                </button>
              )}

              {/* Preparing progression button */}
              {(order.status === 'CONFIRMED' || order.status === 'PREPARING') && (
                <button
                  onClick={() => navigate(`/dashboard/shop/orders/${order._id || orderId}/preparing`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors mb-4 flex justify-center items-center shadow-sm text-sm"
                >
                  <ChefHat className="w-4 h-4 mr-2" />
                  {order.status === 'CONFIRMED' ? 'Start Preparing Food' : 'View Kitchen Queue'}
                </button>
              )}

              {order.status === 'READY_FOR_PICKUP' && (
                <button
                  onClick={() => navigate(`/dashboard/shop/orders/${order._id || orderId}/ready`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors mb-4 flex justify-center items-center shadow-sm text-sm"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Ready For Pickup
                </button>
              )}

              <div className="flex items-start text-[11px] font-semibold text-slate-500">
                <Info className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5 text-slate-400" />
                <p>
                  {order.status === 'PLACED'
                    ? 'Accepting order notifies student and runner immediately.'
                    : `Current order status: ${order.status}.`}
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Reject Order Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Reject {order.orderNumber}?</h3>
                <p className="text-xs text-slate-500">Student will receive an automatic 100% wallet refund.</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Reason for Rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Sold out, kitchen closing..."
                rows={3}
                className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopOrderDetails;
