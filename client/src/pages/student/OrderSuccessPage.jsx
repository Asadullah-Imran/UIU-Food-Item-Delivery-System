import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Check, Utensils, User, Bike, MapPin, 
  RefreshCcw, LayoutDashboard, Download,
  FileText, MapPin as MapPinIcon, Wallet,
  Plus, ArrowRight, MessageSquare, ShieldCheck
} from 'lucide-react';
import popularItemsData from '../../data/popularItems.json';
import { useOrderChat } from '../../context/OrderChatContext';
import { useAuth } from '../../context/AuthContext';

export default function OrderSuccessPage() {
  const location = useLocation();
  const { user } = useAuth();
  const { openOrderChat } = useOrderChat();
  
  const order = location.state?.order;
  const remainingBalance = location.state?.remainingBalance ?? user?.walletBalance ?? 0;
  const orderNumber = order?.orderNumber || '#UIU-2026-1030';
  const totalPaid = order?.billing?.grandTotal || 275;
  const shopName = order?.shop?.name || "Chef's Table";
  const addressText = order?.deliveryAddress?.room 
    ? `${order.deliveryAddress.room}, ${order.deliveryAddress.building}`
    : 'Room 412, Academic Building';

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Card: Status & Tracker */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          
          <div className="w-20 h-20 rounded-full border-4 border-emerald-500 bg-emerald-50 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
            <Check className="w-10 h-10 text-emerald-600" strokeWidth={3} />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-3 border border-emerald-200">
            <ShieldCheck className="w-4 h-4" /> In-App Payment Confirmed
          </div>

          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Order Placed & Paid! 🎉</h1>
          <p className="text-slate-500 mb-2 max-w-md text-sm">
            Order <span className="font-bold text-slate-800">{orderNumber}</span> has been deducted from your Campus Wallet and sent to the shop kitchen.
          </p>

          <div className="mb-10 px-4 py-2 bg-orange-50 border border-orange-200/80 rounded-2xl inline-flex items-center gap-2 text-xs font-bold text-orange-800">
            <Wallet className="w-4 h-4 text-orange-500" />
            Remaining Campus Wallet Balance: <span className="text-orange-600 font-extrabold text-sm">৳{remainingBalance}.00</span>
          </div>

          {/* Progress Tracker */}
          <div className="w-full max-w-3xl relative mb-12">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full z-0"></div>
            {/* Active Line */}
            <div className="absolute top-1/2 left-0 w-[30%] h-1 bg-orange-500 -translate-y-1/2 rounded-full z-0"></div>
            
            <div className="relative z-10 flex justify-between">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center mb-2 shadow-md">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-orange-600">Paid & Placed</span>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center mb-2 shadow-md">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-700">Kitchen Prep</span>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-500">Runner Assigned</span>
              </div>
              
              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                  <Bike className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-500">On The Way</span>
              </div>
              
              {/* Step 5 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-500">Delivered</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => openOrderChat(orderNumber)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center text-sm cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Live Order Chat
            </button>
            <Link 
              to="/dashboard/student/orders"
              className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center text-sm shadow-md"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> View My Orders
            </Link>
            <Link to="/dashboard/student" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-colors flex items-center text-sm">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Middle Section: Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Order Details */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mr-3">
                <FileText className="w-5 h-5" />
              </div>
              Order & Payment Details
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Order Number</span>
                <span className="font-mono font-bold text-slate-800">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Campus Shop</span>
                <span className="font-bold text-slate-800">{shopName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Estimated Delivery</span>
                <span className="font-bold text-orange-600">15-20 Minutes</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">Payment Channel</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center text-xs">
                  <Wallet className="w-3.5 h-3.5 mr-1 text-emerald-600" /> In-App Campus Wallet
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mr-3">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                Delivery Info
              </h3>
              
              <div className="text-sm">
                <p className="text-slate-400 mb-1">Campus Drop-off Location</p>
                <p className="font-bold text-slate-800">{addressText}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-end mt-8 border-t border-slate-100 pt-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Deducted from Wallet</span>
                <span className="text-xl font-bold text-slate-800">Total Paid</span>
              </div>
              <span className="text-3xl font-black text-orange-600">৳{totalPaid}</span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Recommendations */}
        <div className="pt-6">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Students also ordered</h3>
            <Link to="/dashboard/student/shops" className="text-sm font-bold text-orange-600 hover:underline flex items-center">
              See all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularItemsData.slice(0, 3).map(item => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-40">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm flex items-center">
                    <span className="text-orange-500 mr-1">★</span> {item.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-slate-800 mb-4">{item.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-600 text-lg">৳{item.price}</span>
                    <Link to="/dashboard/student/shops" className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-sm shadow-orange-500/30">
                      <Plus className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
