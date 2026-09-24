import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, ChevronRight, MapPin, Clock, 
  MessageSquare, Phone, Store, Navigation,
  FileText, Check, Package, Loader2, AlertCircle
} from 'lucide-react';
import RunnerSidebarFix from './RunnerSidebarFix';
import { useOrderChat } from '../../context/OrderChatContext';
import { useAuth } from '../../context/AuthContext';

export default function RunnerOrderAccepted() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();
  const { openOrderChat } = useOrderChat();

  const [activeOrder, setActiveOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch active order from backend if not passed in state
  useEffect(() => {
    const fetchActiveOrder = async () => {
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem('uiu_auth_token');
        const res = await fetch('/api/runner/orders/active', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order) {
            setActiveOrder(data.order);
            localStorage.setItem('uiu_active_delivery', JSON.stringify(data.order));
          }
        }
      } catch (err) {
        console.warn('Failed to fetch active order from API:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!activeOrder) {
      const cached = localStorage.getItem('uiu_active_delivery');
      if (cached) {
        try {
          setActiveOrder(JSON.parse(cached));
        } catch (e) {}
      }
      fetchActiveOrder();
    }
  }, [token]);

  const handleConfirmPickup = async () => {
    setErrorMsg(null);
    setIsConfirming(true);

    try {
      const authToken = token || localStorage.getItem('uiu_auth_token');
      const orderId = activeOrder?._id;

      if (orderId && /^[0-9a-fA-F]{24}$/.test(orderId)) {
        const res = await fetch(`/api/runner/orders/${orderId}/pickup`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to confirm pickup');
        }
        localStorage.setItem('uiu_active_delivery', JSON.stringify(data.order));
        navigate('/dashboard/runner/active/tracking', { state: { order: data.order } });
      } else {
        navigate('/dashboard/runner/active/tracking');
      }
    } catch (err) {
      console.error('Pickup confirmation error:', err);
      setErrorMsg(err.message || 'Could not confirm pickup. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  if (loading) {
    return (
      <>
        <RunnerSidebarFix />
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  if (!activeOrder) {
    return (
      <>
        <RunnerSidebarFix />
        <div className="max-w-[1200px] mx-auto pt-16 pb-12 text-center">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-md mx-auto">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">No Active Delivery</h2>
            <p className="text-slate-500 mb-6 text-sm">You currently don't have any ongoing deliveries. Browse available requests to start earning.</p>
            <Link to="/dashboard/runner/deliveries" className="bg-[#F37623] hover:bg-[#d9671b] text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all inline-flex items-center">
              Find Deliveries
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Use dynamic order data
  const displayData = {
    orderId: activeOrder.orderNumber,
    mongoId: activeOrder._id,
    shop: {
      name: activeOrder.shop?.name || 'Campus Shop',
      location: activeOrder.shop?.location || 'Unknown Location',
      image: activeOrder.shop?.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&h=150&fit=crop',
      phone: activeOrder.shop?.phone || '+880 1711-000000'
    },
    customer: {
      name: activeOrder.student?.name || 'Student',
      department: activeOrder.student?.department || 'Unknown',
      phone: activeOrder.deliveryAddress?.phone || activeOrder.student?.phone || 'N/A',
      image: 'https://i.pravatar.cc/150?u=student'
    },
    deliveryDetails: {
      reward: activeOrder.billing?.runnerReward || 30,
      distance: '180m', // Calculate actual if coords exist
      dropOffLocation: activeOrder.deliveryAddress?.room || 'Unknown Room',
      expectedDelivery: '10-15 mins'
    },
    orderItems: activeOrder.items && activeOrder.items.length > 0 
      ? activeOrder.items.map(i => ({
          qty: i.quantity || 1,
          name: i.name || i.foodItem?.name || 'Food Item',
          note: i.note || ''
        }))
      : [],
    studentNote: activeOrder.deliveryAddress?.instructions || ''
  };

  return (
    <>
      <RunnerSidebarFix activeDelivery />
      <div className="max-w-[1200px] mx-auto pt-4 pb-12">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#9B5110] mb-2 tracking-tight">
            Delivery Accepted
          </h1>
          <p className="text-slate-600 font-medium text-sm">
            The delivery has been assigned to you. Proceed to the campus pickup location.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            
            {/* Success Banner */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex relative border border-slate-100">
              <div className="w-2 bg-green-500 absolute left-0 top-0 bottom-0"></div>
              <div className="p-6 pl-8 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    Delivery Claimed Successfully! 🎉
                  </h3>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {displayData.shop.name} has been notified of your arrival. They are preparing the food items now. Please arrive at the shop counter for collection.
                  </p>
                </div>
              </div>
            </div>

            {/* Two Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Shop Info Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <img src={displayData.shop.image} alt={displayData.shop.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" />
                    <span className="text-sm font-bold text-[#9B5110] bg-[#FFF9F2] px-3 py-1 rounded-full">
                      Order {displayData.orderId}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{displayData.shop.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 flex items-center mt-2">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-orange-500" /> {displayData.shop.location}
                  </p>
                </div>
                <div className="flex gap-3 mt-6">
                  <div className="bg-[#F8F7F5] rounded-xl p-3 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Reward</span>
                    <span className="font-extrabold text-[#9B5110] text-lg">৳{displayData.deliveryDetails.reward}</span>
                  </div>
                  <div className="bg-[#F8F7F5] rounded-xl p-3 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Distance</span>
                    <span className="font-extrabold text-slate-800 text-lg">{displayData.deliveryDetails.distance}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-1 bg-[#9B5110] rounded-bl-full"></div>
                <div className="flex items-center gap-3 mb-6">
                  <img src={displayData.customer.image} alt={displayData.customer.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800 leading-tight">{displayData.customer.name}</h3>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">Student Customer</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Navigation className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Drop-off Location</span>
                      <p className="text-sm font-bold text-slate-800">{displayData.deliveryDetails.dropOffLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Expected Delivery</span>
                      <p className="text-sm font-bold text-slate-800">{displayData.deliveryDetails.expectedDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Order Items Box */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 relative">
              <div className="flex items-center gap-2 mb-6 text-slate-700">
                <FileText className="w-5 h-5" />
                <h3 className="text-sm font-bold">Order Items</h3>
              </div>

              <div className="space-y-5">
                {displayData.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <span className="bg-[#FEF8F3] text-[#9B5110] font-extrabold text-xs px-2 py-1 rounded shadow-sm">
                        {item.qty}x
                      </span>
                      <span className="font-bold text-slate-800 text-[15px]">{item.name}</span>
                    </div>
                    {item.note && (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded">
                        {item.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Student Note */}
              <div className="bg-[#FFF9F2] rounded-xl p-5 mt-6 border border-[#F6E3CF]">
                <h4 className="text-[11px] font-bold text-[#9B5110] uppercase tracking-widest mb-1">
                  Student Delivery Note
                </h4>
                <p className="text-sm font-medium text-[#9B5110] italic">
                  "{displayData.studentNote || 'Please deliver directly to the room specified.'}"
                </p>
              </div>

              {/* Bottom Right Confirm Button */}
              <div className="mt-8 flex justify-end">
                {activeOrder.status === 'READY_FOR_PICKUP' ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 px-6 py-3.5 rounded-xl font-bold flex items-center shadow-sm w-full sm:w-auto">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-amber-500" />
                    Waiting for Shop Handover...
                  </div>
                ) : (
                  <button 
                    type="button"
                    disabled={isConfirming || activeOrder.status !== 'HANDED_OVER'}
                    onClick={handleConfirmPickup}
                    className="bg-[#9B5110] hover:bg-[#7a3f0c] disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-bold flex items-center transition-colors shadow-lg shadow-[#9B5110]/20 cursor-pointer"
                  >
                    {isConfirming ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : null}
                    Confirm Arrival at Pickup <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-6">
                Live Progress
              </h3>

              {/* Vertical Timeline */}
              <div className="relative pl-4 space-y-8 mb-8 border-l-2 border-slate-100 ml-3">
                
                {/* Step 1: Accepted */}
                <div className="relative">
                  <div className="absolute -left-[27px] w-6 h-6 bg-[#9B5110] rounded-full flex items-center justify-center border-4 border-white shadow-sm top-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Delivery Accepted</h4>
                    <p className="text-[11px] font-semibold text-slate-500">Order Assigned</p>
                  </div>
                </div>

                {/* Step 2: Heading to Pickup */}
                <div className="relative">
                  <div className="absolute -left-[27px] w-6 h-6 bg-white rounded-full flex items-center justify-center border-[4px] border-[#9B5110] shadow-sm top-0">
                    <div className="w-1.5 h-1.5 bg-[#9B5110] rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">Heading to Pickup</h4>
                    <p className="text-[11px] font-bold text-[#9B5110]">In Progress</p>
                  </div>
                </div>

                {/* Step 3: Order Collection */}
                <div className="relative opacity-40">
                  <div className="absolute -left-[27px] w-6 h-6 bg-slate-200 rounded-full border-4 border-white top-0"></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Order Collection</h4>
                    <p className="text-[11px] font-semibold text-slate-500">Verify at shop counter</p>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className="relative opacity-40">
                  <div className="absolute -left-[27px] w-6 h-6 bg-slate-200 rounded-full border-4 border-white top-0"></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Delivered</h4>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons Box */}
            <div className="space-y-3">
              <button 
                onClick={() => alert(`Starting GPS route navigation to ${displayData.shop.name} at ${displayData.shop.location}`)}
                className="w-full bg-[#475569] hover:bg-slate-700 text-white rounded-xl py-3.5 font-bold flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              >
                <Navigation className="w-4 h-4 mr-2" /> Start Navigation
              </button>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => openOrderChat(displayData.orderId, 'student')}
                  className="flex-1 bg-white border border-slate-200 hover:bg-orange-50/50 hover:border-orange-200 rounded-xl py-3 font-bold text-sm text-[#9B5110] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-[#9B5110]" /> Chat Student
                </button>
                <button 
                  onClick={() => alert(`Calling student ${displayData.customer.name} at ${displayData.customer.phone}`)}
                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl py-3 font-bold text-sm text-slate-700 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <Phone className="w-4 h-4 mr-2 text-green-600" /> Call
                </button>
              </div>

              <button 
                onClick={() => openOrderChat(displayData.orderId, 'shop')}
                className="w-full bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-[#9B5110] py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-colors cursor-pointer border border-slate-200/60"
              >
                <Store className="w-4 h-4 mr-2 text-orange-500" /> Contact Shop
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
