import React, { useState, useEffect } from 'react';
import { 
  Package, Calendar, CircleDollarSign, Heart, 
  Download, RotateCcw, ChefHat, Navigation, 
  ChevronLeft, ChevronRight, Clock, MessageSquare, 
  AlertTriangle, XCircle, CheckCircle2, Bike, 
  Store, MapPin, Eye, Star, AlertCircle, RefreshCw, X, ShieldCheck,
  LifeBuoy, HelpCircle, FileText, Send, Tag, Flag, ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StudentSidebarFix from './StudentSidebarFix';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { useOrderChat } from '../../context/OrderChatContext';
import { useAuth } from '../../context/AuthContext';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { user, token, updateUserWallet, refreshUser } = useAuth();
  const { favorites } = useFavorites();
  const { addToCart, setIsCartVisible } = useCart();
  const { openOrderChat } = useOrderChat();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Cancel Order Modal State
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Rating Modal State
  const [ratingModalOrder, setRatingModalOrder] = useState(null);
  const [shopRating, setShopRating] = useState(5);
  const [runnerRating, setRunnerRating] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Complaints / Dispute Ticket State
  const [complaints, setComplaints] = useState([]);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);
  const [complaintModalOrder, setComplaintModalOrder] = useState(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('Late Delivery');
  const [complaintPriority, setComplaintPriority] = useState('Medium');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [complaintOrderNumber, setComplaintOrderNumber] = useState('');
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  const tabs = ['All Orders', 'Active', 'Completed', 'Cancelled', 'Disputes & Tickets'];

  // Fetch Student Orders from Backend
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/student/orders', {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('uiu_auth_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.warn('Error fetching student orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Student Complaints / Tickets
  const fetchComplaints = async () => {
    setIsLoadingComplaints(true);
    try {
      const res = await fetch('/api/student/complaints', {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('uiu_auth_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch (e) {
      console.warn('Error fetching complaints:', e);
    } finally {
      setIsLoadingComplaints(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchComplaints();
  }, [token]);

  // Compute Statistics
  const totalOrdersCount = orders.length;
  const thisMonthOrdersCount = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const now = new Date();
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  }).length;
  const totalSpent = orders
    .filter(o => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
    .reduce((sum, o) => sum + (o.billing?.grandTotal || 0), 0);

  // Filter Orders
  const filteredOrders = orders.filter(order => {
    const isCompleted = order.status === 'DELIVERED';
    const isCancelled = order.status === 'CANCELLED' || order.status === 'REJECTED';
    const isActive = !isCompleted && !isCancelled;

    if (activeTab === 'All Orders') return true;
    if (activeTab === 'Active') return isActive;
    if (activeTab === 'Completed') return isCompleted;
    if (activeTab === 'Cancelled') return isCancelled;
    return true;
  });

  // Re-Order Flow
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item, idx) => {
      addToCart({
        id: item.menuItem || `reorder-${order._id}-${idx}`,
        _id: item.menuItem || `reorder-${order._id}-${idx}`,
        name: item.name,
        price: item.price,
        shopId: order.shop?._id || order.shop,
        shopName: order.shop?.name || "Campus Vendor"
      });
    });
    setIsCartVisible(true);
  };

  // Cancel Order Flow with 100% Refund
  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    setIsCancelling(true);

    try {
      const res = await fetch(`/api/student/orders/${cancelModalOrder._id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('uiu_auth_token')}`
        },
        body: JSON.stringify({ reason: cancelReason || 'Cancelled by student' })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to cancel order');
      }

      // Update student wallet
      if (data.remainingBalance !== undefined) {
        updateUserWallet(data.remainingBalance);
      }
      await refreshUser();

      setFeedbackMessage({
        type: 'success',
        text: `Order ${cancelModalOrder.orderNumber} successfully cancelled! ৳${cancelModalOrder.billing?.grandTotal || 0} has been refunded to your Campus Wallet.`
      });

      setCancelModalOrder(null);
      setCancelReason('');
      fetchOrders();
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Error cancelling order'
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Submit Rating Flow
  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!ratingModalOrder) return;
    setIsSubmittingRating(true);

    try {
      const res = await fetch(`/api/student/orders/${ratingModalOrder._id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('uiu_auth_token')}`
        },
        body: JSON.stringify({
          shopRating,
          runnerRating,
          feedback: ratingFeedback
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit rating');
      }

      setFeedbackMessage({
        type: 'success',
        text: `Thank you! Your ratings and feedback for order ${ratingModalOrder.orderNumber} have been saved.`
      });

      setRatingModalOrder(null);
      setRatingFeedback('');
      fetchOrders();
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Error submitting rating'
      });
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Open Complaint Modal
  const handleOpenComplaintModal = (order = null) => {
    setComplaintModalOrder(order);
    setComplaintOrderNumber(order ? order.orderNumber : (orders[0]?.orderNumber || ''));
    setComplaintSubject(order ? `Issue regarding order ${order.orderNumber}` : '');
    setComplaintCategory('Late Delivery');
    setComplaintPriority('Medium');
    setComplaintDescription('');
    setIsComplaintModalOpen(true);
  };

  // Submit Complaint Flow
  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintDescription.trim()) {
      setFeedbackMessage({
        type: 'error',
        text: 'Please provide a subject and description for the dispute ticket.'
      });
      return;
    }

    setIsSubmittingComplaint(true);
    try {
      const res = await fetch('/api/student/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('uiu_auth_token')}`
        },
        body: JSON.stringify({
          orderId: complaintModalOrder?._id || undefined,
          orderNumber: complaintOrderNumber || complaintModalOrder?.orderNumber || '#UIU-GENERAL',
          subject: complaintSubject.trim(),
          category: complaintCategory,
          priority: complaintPriority,
          description: complaintDescription.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit complaint');
      }

      setFeedbackMessage({
        type: 'success',
        text: data.message || `Dispute ticket ${data.complaint?.ticketId || ''} submitted successfully!`
      });

      setIsComplaintModalOpen(false);
      setComplaintModalOrder(null);
      setComplaintSubject('');
      setComplaintDescription('');
      fetchComplaints();
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Error submitting dispute ticket'
      });
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  return (
    <>
      <StudentSidebarFix />
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-sm font-medium text-slate-500 mb-1">
              <Link to="/dashboard/student" className="hover:text-orange-500 transition-colors">Dashboard</Link>
              <span className="mx-2">›</span>
              <span className="text-orange-600 font-bold">My Orders</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Orders & In-App Purchases</h1>
            <p className="text-slate-500 text-sm mt-0.5">Track active deliveries, view purchase receipts, and manage refunds.</p>
          </div>

          <button
            onClick={() => {
              fetchOrders();
              fetchComplaints();
            }}
            className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm flex items-center transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin text-orange-500' : ''}`} />
            Refresh Orders
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMessage && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between animate-fadeIn ${
            feedbackMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button 
              onClick={() => setFeedbackMessage(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Total Orders</p>
              <h3 className="text-3xl font-black text-slate-800">{totalOrdersCount}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">This Month</p>
              <h3 className="text-3xl font-black text-slate-800">{thisMonthOrdersCount}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Total Spent</p>
              <h3 className="text-3xl font-black text-slate-800">৳{totalSpent}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">Campus Wallet</p>
              <h3 className="text-3xl font-black text-orange-600">৳{user?.walletBalance || 0}</h3>
            </div>
          </div>
        </div>

        {/* Filters Tabs & Action Bar */}
        <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex overflow-x-auto w-full sm:w-auto no-scrollbar space-x-2 p-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
                {tab === 'Disputes & Tickets' && complaints.length > 0 && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    activeTab === tab ? 'bg-white/30 text-white' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {complaints.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pr-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-400 font-semibold">
              {activeTab === 'Disputes & Tickets' ? (
                <>Showing <strong className="text-slate-700">{complaints.length}</strong> tickets</>
              ) : (
                <>Showing <strong className="text-slate-700">{filteredOrders.length}</strong> orders</>
              )}
            </span>

            <button
              onClick={() => handleOpenComplaintModal(null)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm flex items-center transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
              File Dispute Ticket
            </button>
          </div>
        </div>

        {/* Dynamic Content: Orders List OR Disputes & Tickets View */}
        {activeTab === 'Disputes & Tickets' ? (
          <div className="space-y-4">
            {isLoadingComplaints ? (
              <div className="bg-white rounded-3xl p-16 text-center text-slate-400 border border-slate-100 shadow-sm">
                <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-orange-500" />
                <p className="text-sm font-semibold">Loading dispute tickets from campus administration...</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center text-slate-500 border border-slate-100 shadow-sm">
                <LifeBuoy className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-1">No dispute tickets filed</h3>
                <p className="text-sm text-slate-400 mb-6">Have an issue with delivery, missing items, or food quality? Open a dispute ticket anytime.</p>
                <button 
                  onClick={() => handleOpenComplaintModal(null)}
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all text-sm"
                >
                  <LifeBuoy className="w-4 h-4 mr-2" />
                  Open Campus Support Ticket
                </button>
              </div>
            ) : (
              complaints.map(ticket => {
                const isResolved = ticket.status === 'Resolved';
                const isInReview = ticket.status === 'In Review';
                const isEscalated = ticket.status === 'Escalated';

                return (
                  <div key={ticket._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                            {ticket.ticketId}
                          </span>
                          <span className="text-xs font-bold text-orange-600">
                            {ticket.orderNumber || '#UIU-GENERAL'}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">{ticket.subject}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          ticket.priority === 'High'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : ticket.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {ticket.priority} Priority
                        </span>

                        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : isInReview
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : isEscalated
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-700">Category:</span>
                        <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">{ticket.category}</span>
                      </div>
                      <p className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed">
                        {ticket.description}
                      </p>
                    </div>

                    {/* Admin Resolution Section */}
                    {ticket.adminResolution && (
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Campus Administration Resolution</span>
                        </div>
                        <p className="text-xs text-emerald-700 pl-5.5">
                          {ticket.adminResolution}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400">
                      <span>Submitted: {new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-slate-500 font-medium">UIU Support Desk Verification</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-5">
            {isLoading ? (
              <div className="bg-white rounded-3xl p-16 text-center text-slate-400 border border-slate-100 shadow-sm">
                <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-orange-500" />
                <p className="text-sm font-semibold">Loading orders from campus database...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center text-slate-500 border border-slate-100 shadow-sm">
                <Package className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-1">No orders in this view</h3>
                <p className="text-sm text-slate-400 mb-6">You currently have no {activeTab.toLowerCase()} orders.</p>
                <Link 
                  to="/dashboard/student/shops"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all text-sm"
                >
                  Browse Campus Shops
                </Link>
              </div>
            ) : (
              filteredOrders.map(order => {
                const isDelivered = order.status === 'DELIVERED';
                const isCancelled = order.status === 'CANCELLED' || order.status === 'REJECTED';
                const isActive = !isDelivered && !isCancelled;
                const shopImage = order.shop?.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80';
                const shopName = order.shop?.name || 'Campus Food Vendor';
                const grandTotal = order.billing?.grandTotal || 0;

                return (
                  <div 
                    key={order._id}
                    className={`bg-white rounded-3xl p-6 border shadow-sm transition-all flex flex-col gap-5 ${
                      isActive 
                        ? 'border-orange-500/80 shadow-orange-500/10 ring-1 ring-orange-500/20' 
                        : isCancelled
                        ? 'border-slate-100 bg-slate-50/50'
                        : 'border-slate-100'
                    }`}
                  >
                    
                    {/* Top Row: Shop, Status & Amount */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                          <img src={shopImage} alt={shopName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-extrabold text-slate-900">{shopName}</h3>
                            <span className="text-xs font-mono font-bold text-slate-400">{order.orderNumber}</span>
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                          isDelivered 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : isCancelled 
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-orange-100 text-orange-700 border border-orange-200 animate-pulse'
                        }`}>
                          {order.status}
                        </span>
                        <p className="text-2xl font-black text-slate-900 mt-1">৳{grandTotal}</p>
                      </div>
                    </div>

                    {/* Active Order 5-Step Tracker Progress */}
                    {isActive && (
                      <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold text-orange-900">
                          <span className="flex items-center gap-1.5">
                            <Bike className="w-4 h-4 text-orange-600 animate-bounce" /> Live Delivery Progression
                          </span>
                          <span className="text-slate-500 font-medium">
                            Drop-off: <strong className="text-slate-800">{order.deliveryAddress?.room || 'Room 412'}, {order.deliveryAddress?.building || 'Academic Bldg'}</strong>
                          </span>
                        </div>

                        {/* Timeline Step Circles */}
                        <div className="grid grid-cols-5 gap-2 text-center pt-2">
                          {[
                            { key: 'PLACED', label: 'Placed' },
                            { key: 'CONFIRMED', label: 'Confirmed' },
                            { key: 'PREPARING', label: 'Kitchen' },
                            { key: 'READY_FOR_PICKUP', label: 'Ready' },
                            { key: 'ON_THE_WAY', label: 'On Way' }
                          ].map((step, idx) => {
                            const statusOrder = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'ON_THE_WAY', 'DELIVERED'];
                            const currentIdx = statusOrder.indexOf(order.status);
                            const stepIdx = statusOrder.indexOf(step.key);
                            const isReached = currentIdx >= stepIdx;

                            return (
                              <div key={step.key} className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                                  isReached 
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' 
                                    : 'bg-white border-2 border-slate-200 text-slate-400'
                                }}`}>
                                  {isReached ? '✓' : idx + 1}
                                </div>
                                <span className={`text-[10px] font-bold ${isReached ? 'text-orange-700' : 'text-slate-400'}`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items List Chips */}
                    <div className="flex flex-wrap gap-2">
                      {order.items?.map((item, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                          <span className="text-orange-600">{item.quantity}x</span>
                          <span>{item.name}</span>
                          <span className="text-slate-400 font-normal">৳{item.price * item.quantity}</span>
                        </span>
                      ))}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openOrderChat(order.orderNumber)}
                          className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-xl text-xs flex items-center transition-colors border border-orange-200"
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Order Chat
                        </button>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> Receipt & Details
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Report Issue / Dispute Button */}
                        <button
                          onClick={() => handleOpenComplaintModal(order)}
                          className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-xs flex items-center transition-colors border border-slate-200"
                          title="Report missing item, late delivery or food issue"
                        >
                          <Flag className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Report Issue
                        </button>

                        {/* Active Order Cancel Button */}
                        {isActive && (
                          <button
                            onClick={() => {
                              setCancelModalOrder(order);
                              setCancelReason('');
                            }}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs flex items-center transition-colors border border-red-200"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel (100% Refund)
                          </button>
                        )}

                        {/* Delivered Order: Rate Shop & Runner */}
                        {isDelivered && (
                          <button
                            onClick={() => {
                              setRatingModalOrder(order);
                              setShopRating(order.ratings?.shopRating || 5);
                              setRunnerRating(order.ratings?.runnerRating || 5);
                              setRatingFeedback(order.ratings?.feedback || '');
                            }}
                            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl text-xs flex items-center transition-colors border border-amber-200"
                          >
                            <Star className="w-3.5 h-3.5 mr-1.5 fill-amber-500 text-amber-500" />
                            {order.ratings ? 'Update Rating' : 'Rate Food & Runner'}
                          </button>
                        )}

                        {/* Reorder Button */}
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center transition-all shadow-md shadow-orange-500/20 active:scale-95"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reorder
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* 1. ORDER DETAILS & RECEIPT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white relative">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Receipt #{selectedOrder.orderNumber}
              </span>
              <h3 className="text-xl font-black">{selectedOrder.shop?.name || 'Campus Food Order'}</h3>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600">
              
              {/* Delivery Information */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Delivery Details</h4>
                <p><strong>Building:</strong> {selectedOrder.deliveryAddress?.building || 'Academic Building'}</p>
                <p><strong>Room / Floor:</strong> {selectedOrder.deliveryAddress?.room || 'Room 412'}</p>
                {selectedOrder.deliveryAddress?.dropOffNote && (
                  <p><strong>Special Instructions:</strong> {selectedOrder.deliveryAddress.dropOffNote}</p>
                )}
                {selectedOrder.runner && (
                  <p><strong>Assigned Runner:</strong> {selectedOrder.runner.name} ({selectedOrder.runner.phone || '017XXXXXXXX'})</p>
                )}
              </div>

              {/* Itemized Breakdown */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2.5">Ordered Food Items</h4>
                <div className="space-y-2 border-y border-slate-100 py-3">
                  {selectedOrder.items?.map((i, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span>{i.quantity}x {i.name}</span>
                      <span className="font-bold text-slate-800">৳{i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Split */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span>Food Subtotal</span>
                  <span className="font-bold text-slate-800">৳{selectedOrder.billing?.subtotal || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Campus Delivery Fee</span>
                  <span className="font-bold text-slate-800">৳{selectedOrder.billing?.deliveryFee || 25}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-slate-900">
                  <span>Total Paid via Campus Wallet</span>
                  <span className="text-orange-600">৳{selectedOrder.billing?.grandTotal || 0}</span>
                </div>
              </div>

              {/* Timeline Log */}
              {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/60 space-y-2">
                  <h4 className="font-bold text-orange-900 uppercase tracking-wider text-[10px]">Order Timeline</h4>
                  <div className="space-y-1 text-[11px] text-slate-600">
                    {selectedOrder.timeline.map((t, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {t.note || t.status}</span>
                        <span className="text-slate-400 text-[10px]">{new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const orderToReport = selectedOrder;
                    setSelectedOrder(null);
                    handleOpenComplaintModal(orderToReport);
                  }}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Flag className="w-3.5 h-3.5 text-slate-500" /> Report Issue
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all"
                >
                  Close Receipt
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. CANCEL ORDER CONFIRMATION MODAL */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 space-y-5">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-black text-slate-800">Cancel Order {cancelModalOrder.orderNumber}?</h3>
              <p className="text-xs text-slate-500 mt-1">
                An instant 100% refund of <strong className="text-slate-800">৳{cancelModalOrder.billing?.grandTotal || 0}.00</strong> will be credited directly back into your Campus Digital Wallet.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Reason for Cancellation (Optional)</label>
              <textarea
                rows="2"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., Ordered wrong item, class moved to different room..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500 resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalOrder(null)}
                disabled={isCancelling}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-red-600/20 flex items-center justify-center"
              >
                {isCancelling ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Cancelling...
                  </>
                ) : (
                  'Confirm & Refund ৳' + (cancelModalOrder.billing?.grandTotal || 0)
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 5-STAR RATING & REVIEW MODAL */}
      {ratingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">Rate Order {ratingModalOrder.orderNumber}</h3>
              <button 
                onClick={() => setRatingModalOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-5">
              
              {/* Shop Food Rating */}
              <div className="space-y-2 text-center bg-orange-50/50 p-4 rounded-2xl border border-orange-100/60">
                <label className="text-xs font-bold text-slate-700 block">
                  How was the food from <strong className="text-orange-600">{ratingModalOrder.shop?.name || 'Shop'}</strong>?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setShopRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star className={`w-7 h-7 ${star <= shopRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Runner Delivery Rating */}
              <div className="space-y-2 text-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100/60">
                <label className="text-xs font-bold text-slate-700 block">
                  How was the runner's delivery speed & drop-off?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRunnerRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star className={`w-7 h-7 ${star <= runnerRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Comments & Feedback</label>
                <textarea
                  rows="2"
                  value={ratingFeedback}
                  onChange={(e) => setRatingFeedback(e.target.value)}
                  placeholder="e.g., Food was hot and delicious, runner delivered directly to lab 412!"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmittingRating}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-orange-500/20 flex items-center justify-center"
              >
                {isSubmittingRating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving Rating...
                  </>
                ) : (
                  'Submit Rating'
                )}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* 4. DISPUTE / COMPLAINT TICKET MODAL */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white relative">
              <button 
                onClick={() => setIsComplaintModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <LifeBuoy className="w-5 h-5 text-orange-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/30 text-orange-300 px-2.5 py-0.5 rounded-full">
                  Campus Support Ticket
                </span>
              </div>
              <h3 className="text-xl font-black">Report Order Issue or Dispute</h3>
              <p className="text-slate-400 text-xs mt-0.5">Directly escalates to UIU Campus Administration for review and compensation.</p>
            </div>

            <form onSubmit={handleCreateComplaint} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Target Order Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Associated Order (Optional)</label>
                <select
                  value={complaintOrderNumber}
                  onChange={(e) => setComplaintOrderNumber(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-bold"
                >
                  <option value="#UIU-GENERAL">General Inquiry / Campus Delivery Issue (#UIU-GENERAL)</option>
                  {orders.map(o => (
                    <option key={o._id} value={o.orderNumber}>
                      {o.orderNumber} — {o.shop?.name || 'Shop'} (৳{o.billing?.grandTotal || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category and Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Issue Category</label>
                  <select
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Late Delivery">Late Delivery</option>
                    <option value="Missing Food Item">Missing Food Item</option>
                    <option value="Wrong Food Items">Wrong Food Items</option>
                    <option value="Food Quality">Food Quality / Spoiled</option>
                    <option value="Spill / Damaged Item">Spill / Damaged Item</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority Level</label>
                  <select
                    value={complaintPriority}
                    onChange={(e) => setComplaintPriority(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Low">Low (General Feedback)</option>
                    <option value="Medium">Medium (Delivery Delay / Minor item)</option>
                    <option value="High">High (Food safety / Undelivered / Payment)</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Ticket Subject *</label>
                <input
                  type="text"
                  required
                  value={complaintSubject}
                  onChange={(e) => setComplaintSubject(e.target.value)}
                  placeholder="e.g., Cold food delivered 45 minutes late to Lab 412"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Description *</label>
                <textarea
                  rows="4"
                  required
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                  placeholder="Please describe the issue in detail, including room number, what happened, and any relevant details for admin resolution..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsComplaintModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingComplaint}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5"
                >
                  {isSubmittingComplaint ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Dispute Ticket
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </>
  );
}
