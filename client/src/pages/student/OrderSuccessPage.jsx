import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, Utensils, User, Bike, MapPin, 
  RefreshCcw, LayoutDashboard, Download,
  FileText, MapPin as MapPinIcon, Banknote,
  Plus, ArrowRight
} from 'lucide-react';
import popularItemsData from '../../data/popularItems.json';

export default function OrderSuccessPage() {
  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Card: Status & Tracker */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          
          <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Placed Successfully! 🎉</h1>
          <p className="text-slate-500 mb-12 max-w-md">
            Your order has been received and is now being prepared by the shop.
          </p>

          {/* Progress Tracker */}
          <div className="w-full max-w-3xl relative mb-12">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full z-0"></div>
            {/* Active Line */}
            <div className="absolute top-1/2 left-0 w-[35%] h-1 bg-orange-500 -translate-y-1/2 rounded-full z-0"></div>
            
            <div className="relative z-10 flex justify-between">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center mb-2 shadow-md">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-orange-600">Order Placed</span>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#9B5110] text-white flex items-center justify-center mb-2 shadow-md">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#9B5110]">Preparing</span>
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
            <Link 
              to="/dashboard/student/orders"
              className="bg-[#9B5110] hover:bg-[#7A3F0C] text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center text-sm shadow-md"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Track Order
            </Link>
            <Link to="/dashboard/student" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-colors flex items-center text-sm">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3 px-6 rounded-xl transition-colors flex items-center text-sm">
              <Download className="w-4 h-4 mr-2" /> Download Receipt
            </button>
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
              Order Details
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Shop</span>
                <span className="font-bold text-slate-800">Chef's Table</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Estimated Delivery</span>
                <span className="font-bold text-[#9B5110]">18 Minutes</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-bold text-slate-800 flex items-center">
                  <Banknote className="w-4 h-4 mr-1.5 text-slate-400" /> Cash on delivery
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
                <p className="text-slate-400 mb-1">Delivery Address</p>
                <p className="font-bold text-slate-800">UIU main building, Gate 2</p>
              </div>
            </div>
            
            <div className="flex justify-between items-end mt-8 border-t border-slate-100 pt-6">
              <span className="text-xl font-bold text-slate-800">Total Paid</span>
              <span className="text-4xl font-extrabold text-[#9B5110]">৳740</span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Recommendations */}
        <div className="pt-6">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Students also ordered</h3>
            <a href="#" className="text-sm font-bold text-[#9B5110] hover:underline flex items-center">
              See all <ArrowRight className="w-4 h-4 ml-1" />
            </a>
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
                    <span className="font-bold text-[#9B5110] text-lg">৳{item.price}</span>
                    <button className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-sm shadow-orange-500/30">
                      <Plus className="w-5 h-5" />
                    </button>
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
