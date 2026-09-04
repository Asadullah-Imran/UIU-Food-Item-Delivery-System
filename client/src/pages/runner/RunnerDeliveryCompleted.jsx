import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, CheckCircle2, Store, User, Clock, 
  MapPin, Timer, Navigation, Hourglass
} from 'lucide-react';
import activeDeliveryData from '../../data/activeDeliveryData.json';
import RunnerSidebarFix from './RunnerSidebarFix';

export default function RunnerDeliveryCompleted() {
  const { orderId, shop, customer, deliveryDetails } = activeDeliveryData;

  return (
    <>
      <RunnerSidebarFix activeDelivery />
      <div className="max-w-[1200px] mx-auto pt-4 pb-12">
        
        {/* Top Success Card */}
        <div className="bg-white rounded-[32px] shadow-sm p-10 flex flex-col items-center text-center mb-6 border border-slate-100 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
            Delivery Completed Successfully! 🎉
          </h1>
          <p className="text-slate-500 font-medium max-w-lg text-sm sm:text-base leading-relaxed">
            Great job! The order has been successfully delivered to the student and your wallet has been updated.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Main content) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Delivery Summary */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-[#9B5110]">Delivery Summary</h2>
                <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Store className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{orderId}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Store className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shop</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{shop.name}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <User className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{customer.name}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion Time</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">11:42 AM</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Timer className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Duration</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">22 mins</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Navigation className="w-4 h-4 text-[#F37623]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance Covered</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{deliveryDetails.distance}</p>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-[#9B5110] mb-8">Activity Timeline</h2>
              
              <div className="relative pl-3 space-y-6">
                {/* Connecting Line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                <div className="relative flex justify-between items-center z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#9B5110] ring-4 ring-white shadow-sm border border-[#9B5110]"></div>
                    <span className="font-bold text-slate-800 text-sm">Accepted</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">11:15 AM</span>
                </div>

                <div className="relative flex justify-between items-center z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#9B5110] ring-4 ring-white shadow-sm border border-[#9B5110]"></div>
                    <span className="font-bold text-slate-800 text-sm">Reached Shop</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">11:22 AM</span>
                </div>

                <div className="relative flex justify-between items-center z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#9B5110] ring-4 ring-white shadow-sm border border-[#9B5110]"></div>
                    <span className="font-bold text-slate-800 text-sm">Picked Up</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">11:30 AM</span>
                </div>

                <div className="relative flex justify-between items-center z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-white shadow-sm border border-green-500"></div>
                    <span className="font-bold text-green-600 text-sm">Delivered</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">11:42 AM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="flex flex-col gap-6">
            
            {/* Earnings Card */}
            <div className="bg-slate-700 rounded-3xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <span className="text-9xl font-black">৳</span>
              </div>
              
              <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-4">
                Earnings This Delivery
              </h3>
              <div className="flex items-end gap-3 mb-10">
                <span className="text-5xl font-extrabold leading-none tracking-tight">৳60</span>
                <span className="bg-slate-600/50 text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-500/50 mb-1">
                  ⚡ +৳10 Bonus
                </span>
              </div>

              <div className="pt-6 border-t border-slate-600/50 space-y-3">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-300">Today's Total</span>
                  <span className="font-extrabold">৳600</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Goal Progress</span>
                    <span className="text-[10px] font-bold text-slate-300">12/20</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-[60%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Performance Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#F8F7F5] rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Delivery</span>
                  <span className="font-extrabold text-slate-800 text-lg">18m</span>
                </div>
                <div className="bg-[#F8F7F5] rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</span>
                  <span className="font-extrabold text-slate-800 text-lg flex items-center">
                    4.9 <span className="text-orange-400 ml-1 text-sm">★</span>
                  </span>
                </div>
                <div className="bg-[#F8F7F5] rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">On-Time</span>
                  <span className="font-extrabold text-slate-800 text-lg">98%</span>
                </div>
                <div className="bg-[#F8F7F5] rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</span>
                  <span className="font-extrabold text-slate-800 text-lg">142</span>
                </div>
              </div>

              <div className="border border-dashed border-slate-300 rounded-xl p-4 flex gap-3 items-center bg-slate-50/50">
                <div className="text-[#9B5110] flex-shrink-0">
                  <Hourglass className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-600 leading-tight italic">
                    Customer Rating (Pending) - You'll receive the student's review shortly.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Bar Prompt */}
        <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-200/60 shadow-inner">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Ready for the next one?</h2>
            <p className="text-sm font-medium text-slate-500">Earn more by completing deliveries during peak hours.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link 
              to="/dashboard/runner/deliveries"
              className="w-full sm:w-auto bg-[#F37623] hover:bg-[#d9671b] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm"
            >
              <Navigation className="w-4 h-4 mr-2" /> Accept Another Delivery
            </Link>
            <div className="flex flex-1 sm:flex-none gap-2">
              <button className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm">
                History
              </button>
              <button className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm">
                Dashboard
              </button>
              <button className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm hidden sm:block">
                Earnings
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
