import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Check, CheckCircle2, Store, User, Clock, 
  MapPin, Timer, Navigation, Hourglass, Wallet
} from 'lucide-react';
import activeDeliveryData from '../../data/activeDeliveryData.json';
import RunnerSidebarFix from './RunnerSidebarFix';
import { useAuth } from '../../context/AuthContext';

export default function RunnerDeliveryCompleted() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const completedOrder = location.state?.order;
  const payoutInfo = location.state?.payout;
  const [walletBalance, setWalletBalance] = useState(
    location.state?.runnerBalance ?? user?.runnerDetails?.walletBalance ?? user?.walletBalance ?? 2450
  );

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const authToken = token || localStorage.getItem('uiu_auth_token');
        const res = await fetch('/api/wallet/balance', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.walletBalance !== undefined) {
            setWalletBalance(data.walletBalance);
          }
        }
      } catch (e) {}
    };
    fetchBalance();
  }, [token]);

  const earnedReward = completedOrder?.billing?.runnerReward || payoutInfo?.runnerReward || 30;

  const displayData = {
    orderId: completedOrder?.orderNumber || activeDeliveryData.orderId,
    shop: {
      name: completedOrder?.shop?.name || activeDeliveryData.shop.name
    },
    customer: {
      name: completedOrder?.student?.name || activeDeliveryData.customer.name
    },
    distance: '180m',
    dropoff: completedOrder?.deliveryAddress?.room || activeDeliveryData.deliveryDetails.dropOffLocation
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <RunnerSidebarFix activeDelivery={false} />
      <div className="max-w-[1200px] mx-auto pt-4 pb-12">
        
        {/* Top Success Card */}
        <div className="bg-white rounded-[32px] shadow-sm p-10 flex flex-col items-center text-center mb-6 border border-slate-100 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-xs">
            <Check className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
            Delivery Completed Successfully! 🎉
          </h1>
          <p className="text-slate-500 font-medium max-w-lg text-sm sm:text-base leading-relaxed">
            Great job! The order has been verified and delivered to the student. Your campus delivery reward of <strong className="text-emerald-700">৳{earnedReward}</strong> has been credited to your wallet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Main content) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Delivery Summary */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-[#9B5110]">Delivery Summary</h2>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Payout Settled
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Store className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{displayData.orderId}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Store className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shop</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{displayData.shop.name}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <User className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{displayData.customer.name}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion Time</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{timeStr}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Timer className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">DELIVERED</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Navigation className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drop-off Point</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{displayData.dropoff}</p>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-[#9B5110] mb-8">Trip Milestones</h2>
              
              <div className="relative pl-3 space-y-6">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                <div className="relative flex justify-between items-center z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#9B5110] ring-4 ring-white shadow-sm border border-[#9B5110]"></div>
                    <span className="font-bold text-slate-800 text-sm">Order Accepted</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Completed</span>
                </div>

                <div className="relative flex justify-between items-center z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#9B5110] ring-4 ring-white shadow-sm border border-[#9B5110]"></div>
                    <span className="font-bold text-slate-800 text-sm">Picked Up at Counter</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Completed</span>
                </div>

                <div className="relative flex justify-between items-center z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm border border-emerald-500"></div>
                    <span className="font-bold text-emerald-600 text-sm">Delivered to Room</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">{timeStr}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="flex flex-col gap-6">
            
            {/* Earnings Card */}
            <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <span className="text-9xl font-black">৳</span>
              </div>
              
              <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-4">
                Earnings This Delivery
              </h3>
              <div className="flex items-end gap-3 mb-8">
                <span className="text-5xl font-extrabold leading-none tracking-tight text-white">৳{earnedReward}</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 mb-1">
                  ✓ Paid
                </span>
              </div>

              <div className="pt-6 border-t border-slate-700 space-y-3">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-300">Updated Wallet Balance</span>
                  <span className="font-extrabold text-lg text-amber-400">৳{walletBalance}</span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Delivery Performance
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#F8F7F5] rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Delivery</span>
                  <span className="font-extrabold text-slate-800 text-lg">14m</span>
                </div>
                <div className="bg-[#F8F7F5] rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</span>
                  <span className="font-extrabold text-slate-800 text-lg flex items-center">
                    4.9 <span className="text-orange-400 ml-1 text-sm">★</span>
                  </span>
                </div>
                <div className="bg-[#F8F7F5] rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">On-Time</span>
                  <span className="font-extrabold text-slate-800 text-lg">99%</span>
                </div>
                <div className="bg-[#F8F7F5] rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
                  <span className="font-extrabold text-emerald-600 text-sm">Available</span>
                </div>
              </div>

              <div className="border border-dashed border-slate-300 rounded-xl p-4 flex gap-3 items-center bg-slate-50/50">
                <div className="text-[#9B5110] flex-shrink-0">
                  <Hourglass className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-600 leading-tight">
                    Double-entry ledger recorded. Both student and shop accounts synchronized.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Bar Prompt */}
        <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-200/60 shadow-inner">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Ready for the next delivery?</h2>
            <p className="text-sm font-medium text-slate-500">Pick up another order nearby to keep earning rewards on campus.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link 
              to="/dashboard/runner/deliveries"
              className="w-full sm:w-auto bg-[#F37623] hover:bg-[#d9671b] text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm text-decoration-none"
            >
              <Navigation className="w-4 h-4 mr-2" /> Accept Another Delivery
            </Link>
            <div className="flex flex-1 sm:flex-none gap-2">
              <Link 
                to="/dashboard/runner/history" 
                className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3.5 rounded-xl text-sm font-bold transition-colors shadow-sm text-center text-decoration-none"
              >
                History
              </Link>
              <Link 
                to="/dashboard/runner/earnings" 
                className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3.5 rounded-xl text-sm font-bold transition-colors shadow-sm text-center text-decoration-none"
              >
                Earnings
              </Link>
              <Link 
                to="/dashboard/runner" 
                className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3.5 rounded-xl text-sm font-bold transition-colors shadow-sm text-center text-decoration-none hidden sm:block"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
