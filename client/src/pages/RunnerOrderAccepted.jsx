import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, ChevronRight, MapPin, Clock, 
  MessageSquare, Phone, Store, Navigation,
  FileText, Check, CircleDot
} from 'lucide-react';
import activeDeliveryData from '../data/activeDeliveryData.json';

export default function RunnerOrderAccepted() {
  const { orderId, shop, customer, deliveryDetails, orderItems, studentNote } = activeDeliveryData;

  return (
    <>
      <div className="max-w-[1200px] mx-auto pt-4 pb-12">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#9B5110] mb-2 tracking-tight">
            Delivery Accepted
          </h1>
          <p className="text-slate-600 font-medium text-sm">
            Delivery Accepted<br/>
            The delivery has been assigned to you. Proceed to the pickup location.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            
            {/* Success Banner */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex relative">
              <div className="w-2 bg-green-500 absolute left-0 top-0 bottom-0"></div>
              <div className="p-6 pl-8 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    Delivery Accepted Successfully! 🎉
                  </h3>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {shop.name} has been notified of your arrival. They are preparing the order now. Please aim to arrive at the pickup point within the next 10 minutes.
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
                    <img src={shop.image} alt={shop.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" />
                    <span className="text-sm font-bold text-[#9B5110] bg-[#FFF9F2] px-3 py-1 rounded-full">
                      Order {orderId}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{shop.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 flex items-center mt-2">
                    <MapPin className="w-3.5 h-3.5 mr-1" /> {shop.location}
                  </p>
                </div>
                <div className="flex gap-3 mt-6">
                  <div className="bg-[#F8F7F5] rounded-xl p-3 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Reward</span>
                    <span className="font-extrabold text-[#9B5110] text-lg">৳{deliveryDetails.reward}</span>
                  </div>
                  <div className="bg-[#F8F7F5] rounded-xl p-3 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Distance</span>
                    <span className="font-extrabold text-slate-800 text-lg">{deliveryDetails.distance}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-1 bg-[#9B5110] rounded-bl-full"></div>
                <div className="flex items-center gap-3 mb-6">
                  <img src={customer.image} alt={customer.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800 leading-tight">{customer.name}</h3>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">Student • {customer.department}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Navigation className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Drop-off Location</span>
                      <p className="text-sm font-bold text-slate-800">{deliveryDetails.dropOffLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Expected Delivery</span>
                      <p className="text-sm font-bold text-slate-800">{deliveryDetails.expectedDelivery}</p>
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
                {orderItems.map((item, idx) => (
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
                  Student Note
                </h4>
                <p className="text-sm font-medium text-[#9B5110] italic">
                  "{studentNote}"
                </p>
              </div>

              {/* Bottom Right Confirm Button */}
              <div className="mt-8 flex justify-end">
                <Link 
                  to="/dashboard/runner/active/tracking"
                  className="bg-[#9B5110] hover:bg-[#7a3f0c] text-white px-8 py-3.5 rounded-xl font-bold flex items-center transition-colors shadow-lg shadow-[#9B5110]/20"
                >
                  Confirm Arrival at Pickup <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
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
                    <p className="text-[11px] font-semibold text-slate-500">Confirmed at 12:45 PM</p>
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
                    <p className="text-[11px] font-semibold text-slate-500">Verify with shop staff</p>
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
              <button className="w-full bg-[#475569] hover:bg-slate-700 text-white rounded-xl py-3.5 font-bold flex items-center justify-center transition-colors shadow-sm">
                <Navigation className="w-4 h-4 mr-2" /> Start Navigation
              </button>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl py-3 font-bold text-sm text-slate-700 flex items-center justify-center transition-colors shadow-sm">
                  <MessageSquare className="w-4 h-4 mr-2" /> Chat
                </button>
                <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl py-3 font-bold text-sm text-slate-700 flex items-center justify-center transition-colors shadow-sm">
                  <Phone className="w-4 h-4 mr-2" /> Call
                </button>
              </div>

              <button className="w-full text-slate-500 hover:text-slate-700 py-3 font-bold text-sm flex items-center justify-center transition-colors">
                <Store className="w-4 h-4 mr-2" /> Contact Shop
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
