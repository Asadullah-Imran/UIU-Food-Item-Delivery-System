import React from 'react';
import { Link } from 'react-router-dom';
import RunnerLayout from '../components/RunnerLayout';
import { 
  Check, Truck, CheckCheck, MapPin, 
  Phone, MessageSquare, Store, CheckCircle2,
  Navigation, Star, CornerUpLeft, Gauge,
  Utensils
} from 'lucide-react';
import activeDeliveryData from '../data/activeDeliveryData.json';

export default function RunnerOrderTracking() {
  const { orderId, customer } = activeDeliveryData;

  const timelineSteps = [
    { label: "Accepted", time: "11:15 AM", status: "completed", icon: Check },
    { label: "Reached Shop", time: "11:22 AM", status: "completed", icon: Check },
    { label: "Picked Up", time: "11:30 AM", status: "completed", icon: Check },
    { label: "On the Way", time: "Active Now", status: "active", icon: Truck },
    { label: "Delivered", time: "ETA 11:40 AM", status: "pending", icon: CheckCheck }
  ];

  return (
    <RunnerLayout>
      <div className="max-w-[1200px] mx-auto pt-4 pb-12">
        
        {/* Header */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-slate-400 mb-1">
              Dashboard &gt; <span className="text-[#9B5110]">Active Delivery</span>
            </p>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Order Tracking
            </h1>
          </div>
        </div>

        {/* Top Timeline Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 flex justify-between items-center relative overflow-hidden">
          
          {/* Connecting Line (Background) */}
          <div className="absolute top-10 left-12 right-12 h-0.5 bg-slate-200 z-0"></div>
          {/* Active Line */}
          <div className="absolute top-10 left-12 w-[60%] h-0.5 bg-green-600 z-0"></div>

          {timelineSteps.map((step, idx) => {
            const Icon = step.icon;
            let bgColor = "bg-slate-200";
            let textColor = "text-slate-400";
            let borderColor = "border-white";
            
            if (step.status === 'completed') {
              bgColor = "bg-green-600";
              textColor = "text-white";
            } else if (step.status === 'active') {
              bgColor = "bg-[#F37623]";
              textColor = "text-white";
              borderColor = "border-orange-100";
            }

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${borderColor} ${bgColor} shadow-sm mb-2`}>
                  <Icon className={`w-5 h-5 ${textColor}`} />
                </div>
                <h4 className={`text-xs font-bold ${step.status === 'active' ? 'text-[#9B5110]' : 'text-slate-700'}`}>
                  {step.label}
                </h4>
                <p className={`text-[10px] font-bold ${step.status === 'active' ? 'text-[#9B5110]' : 'text-slate-400'}`}>
                  {step.time}
                </p>
              </div>
            );
          })}
        </div>

        {/* Two Columns */}
        <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
          
          {/* Left Column - Map Area */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Map Container */}
            <div className="bg-slate-200 rounded-3xl flex-1 relative overflow-hidden shadow-inner border border-slate-300">
              {/* Map Mock Background Image */}
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80" 
                alt="Map Background" 
                className="w-full h-full object-cover opacity-70"
              />
              {/* Overlay tint to match UI style */}
              <div className="absolute inset-0 bg-blue-50/40 mix-blend-multiply"></div>

              {/* Next Maneuver Tooltip */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white rounded-xl p-4 shadow-xl flex items-center gap-4 w-72 z-20 border border-slate-700">
                <div className="text-orange-400">
                  <CornerUpLeft className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Next Maneuver</p>
                  <p className="text-sm font-bold leading-tight">Turn left toward Academic Building</p>
                </div>
              </div>

              {/* Speed Widget */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-[#9B5110] flex items-center justify-center">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Current Speed</p>
                  <p className="text-lg font-extrabold text-slate-800 leading-none">12 <span className="text-xs font-bold text-slate-500">km/h</span></p>
                </div>
              </div>

              {/* Bottom White Overlay Panel */}
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl shadow-2xl p-6 flex items-center justify-between z-20 border border-slate-100">
                
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">
                    Estimated Delivery
                  </p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-extrabold text-[#9B5110]">6 mins</span>
                    <span className="text-xs font-bold text-slate-500">(0.8 km remaining)</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[75%] h-full bg-[#F37623] rounded-full"></div>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-extrabold text-slate-800 leading-none">75%</span>
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Completed</span>
                    </div>
                  </div>
                </div>

                <div className="ml-8 border-l border-slate-100 pl-8">
                  <button className="bg-[#9B5110] hover:bg-[#7a3f0c] text-white px-8 py-4 rounded-xl font-bold flex items-center transition-colors shadow-lg shadow-[#9B5110]/20 text-lg tracking-wide">
                    <Navigation className="w-6 h-6 mr-3 fill-current" /> NAVIGATE
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Action Grid */}
            <div className="grid grid-cols-4 gap-4 h-28">
              <button className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Phone className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xs font-bold text-slate-700">Call Student</span>
              </button>
              
              <button className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 relative">
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-[#F37623] rounded-full border-2 border-white"></div>
                </div>
                <span className="text-xs font-bold text-slate-700">Chat Student</span>
              </button>

              <button className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Store className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xs font-bold text-slate-700">Contact Shop</span>
              </button>

              <Link to="/dashboard/runner/active/completed" className="bg-green-600 hover:bg-green-700 rounded-2xl shadow-md flex flex-col items-center justify-center gap-2 transition-colors border border-green-500 text-decoration-none">
                <div className="w-10 h-10 rounded-full bg-green-500/50 flex items-center justify-center text-white border border-green-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold text-white tracking-widest text-center leading-tight">
                  MARK<br/>DELIVERED
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column - Order Info */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
            
            {/* Top Order Box */}
            <div className="bg-[#EAE1D9] rounded-2xl p-5 border border-[#D4C4B4] flex justify-between items-center shadow-inner">
              <div>
                <p className="text-[11px] font-extrabold text-[#7A5B42] uppercase tracking-widest mb-1">Order {orderId}</p>
                <p className="text-sm font-bold text-[#5C422E]">Value: ৳420.00</p>
              </div>
              <div className="bg-[#9B5110] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-sm">
                REWARD: ৳60
              </div>
            </div>

            {/* Customer Box */}
            <div className="bg-[#FEF8F3] rounded-2xl p-6 border border-[#F6E3CF] shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img src={customer.image} alt={customer.name} className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{customer.name}</h3>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5 mb-2">Student ID: {customer.studentId}</p>
              
              <div className="bg-white border border-slate-200 rounded-full px-2 py-0.5 flex items-center gap-1 mb-4 shadow-sm">
                <Star className="w-3 h-3 text-orange-400 fill-current" />
                <span className="text-[11px] font-bold text-slate-700">{customer.rating}</span>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-orange-100 text-orange-700 text-[9px] font-extrabold px-2 py-1 rounded uppercase tracking-wider">
                  On The Way
                </span>
                <span className="bg-red-100 text-red-600 text-[9px] font-extrabold px-2 py-1 rounded uppercase tracking-wider">
                  High Priority
                </span>
                <span className="bg-green-100 text-green-700 text-[9px] font-extrabold px-2 py-1 rounded uppercase tracking-wider">
                  Paid
                </span>
              </div>
            </div>

            {/* Route Locations Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex-1">
              
              <div className="relative pl-6 h-full flex flex-col justify-between pt-2 pb-2">
                
                {/* Connecting Line */}
                <div className="absolute left-[9px] top-8 bottom-8 w-[2px] border-l-2 border-dashed border-slate-200"></div>

                {/* Pickup */}
                <div className="relative mb-8">
                  <div className="absolute -left-[35px] w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 top-0">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pickup</h4>
                  <p className="text-sm font-bold text-slate-800">Chef's Table</p>
                </div>

                {/* Destination */}
                <div className="relative">
                  <div className="absolute -left-[35px] w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 top-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Destination</h4>
                  <p className="text-sm font-bold text-slate-800">UIU main gate</p>
                  
                  <div className="flex items-center gap-2 mt-3 text-slate-600">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">{customer.phone}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </RunnerLayout>
  );
}
