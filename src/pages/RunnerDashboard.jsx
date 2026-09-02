import React, { useState } from 'react';
import { 
  Sun, Clock, CheckCircle2, ChevronDown, ListOrdered, Truck,
  CheckCircle, Banknote, MapPin, Phone, MessageSquare,
  Navigation, Star, Send, Store
} from 'lucide-react';
import RunnerLayout from '../components/RunnerLayout';
import runnerData from '../data/runner.json';

export default function RunnerDashboard() {
  const { profile, metrics, activeDelivery, nearbyRequests, earnings, performance } = runnerData;
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

  return (
    <RunnerLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 pt-4">
        
        {/* Top Header Row (Weather, Greeting, Status Toggle) */}
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4 text-xs font-bold text-slate-500 bg-white inline-flex px-3 py-1.5 rounded-full shadow-sm">
              <div className="flex items-center text-orange-500">
                <Sun className="w-4 h-4 mr-1.5 fill-orange-500" /> 28°C, Clear
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" /> 02:45 PM
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-orange-500 mb-2 tracking-tight">
              Good Afternoon, {profile.name.split(' ')[0]} <span className="text-4xl">👋</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl">
              You have {metrics.nearbyRequests} nearby delivery requests and {metrics.activeDeliveries} active delivery. Estimated earnings today: {metrics.todaysEarnings} tk
            </p>
          </div>

          {/* Accepting Orders Toggle Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center min-w-[300px]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center font-bold text-slate-800 text-lg">
                <span className={`w-3 h-3 rounded-full mr-3 shadow-sm ${isAcceptingOrders ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                {isAcceptingOrders ? 'Accepting Orders' : 'Offline'}
              </div>
              
              {/* Custom Toggle */}
              <button 
                onClick={() => setIsAcceptingOrders(!isAcceptingOrders)}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isAcceptingOrders ? 'bg-orange-500' : 'bg-slate-300'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAcceptingOrders ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="flex items-center text-xs font-bold text-slate-500">
              Online duration: {profile.onlineDuration} <CheckCircle2 className="w-4 h-4 ml-1.5 text-orange-500" />
            </div>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 group hover:border-orange-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ListOrdered className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold mb-1">Nearby Requests</p>
              <h3 className="text-4xl font-light text-slate-800">{metrics.nearbyRequests}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 relative group hover:border-orange-200 transition-colors">
            <div className="absolute top-6 right-6 text-orange-500 text-sm font-bold flex items-center bg-orange-50 px-2 py-1 rounded-md">
              Live
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold mb-1">Active Deliveries</p>
              <h3 className="text-4xl font-light text-slate-800">{metrics.activeDeliveries}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 group hover:border-orange-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold mb-2">Completed Today</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-light text-slate-800 leading-none">
                  {metrics.completedToday.current}<span className="text-xl text-slate-400">/{metrics.completedToday.target}</span>
                </h3>
                <div className="w-1/2 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full" 
                    style={{width: `${(metrics.completedToday.current / metrics.completedToday.target) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 group hover:border-orange-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold mb-1">Today's Earnings</p>
              <h3 className="text-4xl font-light text-slate-800">৳{metrics.todaysEarnings}</h3>
            </div>
          </div>
        </div>

        {/* Middle Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column (Deliveries) */}
          <div className="flex-1 space-y-6 min-w-0">
            
            {/* Current Active Delivery */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Current Active Delivery</h2>
                <span className="bg-orange-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm flex items-center tracking-wider">
                  <Truck className="w-3 h-3 mr-1.5" /> LIVE UPDATE
                </span>
              </div>
              
              <div className="bg-white rounded-[2rem] border border-orange-200 shadow-sm shadow-orange-500/10 overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500"></div>
                
                <div className="p-8">
                  {/* Shop Info & ETA */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center">
                      <img src={activeDelivery.image} alt={activeDelivery.shopName} className="w-16 h-16 rounded-2xl object-cover shadow-sm mr-4" />
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">{activeDelivery.shopName}</h3>
                        <p className="text-sm font-medium text-slate-500">Order {activeDelivery.orderId} • {activeDelivery.itemsCount} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h4 className="text-2xl font-extrabold text-orange-500">{activeDelivery.eta}</h4>
                      <p className="text-xs font-bold text-slate-400">Distance: {activeDelivery.distance}</p>
                    </div>
                  </div>
                  
                  {/* Customer Card */}
                  <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between mb-8 border border-slate-100">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-lg shadow-inner mr-4">
                        {activeDelivery.customer.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{activeDelivery.customer.name}</h4>
                        <p className="text-xs font-semibold text-slate-500">{activeDelivery.customer.phone}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="w-10 h-10 rounded-xl border-2 border-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-50 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-xl border-2 border-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-50 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Timeline & Progress */}
                  <div className="relative pl-4 mb-8">
                    <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                    
                    <div className="relative flex items-center mb-6">
                      <div className="w-5 h-5 rounded-full bg-orange-500 border-4 border-white shadow-sm z-10 mr-4"></div>
                      <span className="font-bold text-slate-800 text-sm">Pickup: <span className="font-extrabold">{activeDelivery.timeline.pickup}</span></span>
                    </div>
                    
                    <div className="relative flex items-center">
                      <div className="w-5 h-5 rounded-full bg-slate-200 border-4 border-white shadow-sm z-10 mr-4"></div>
                      <span className="font-bold text-slate-500 text-sm">Dropoff: {activeDelivery.timeline.dropoff}</span>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                      <span className="text-orange-500">Status: {activeDelivery.progress.status}</span>
                      <span className="text-slate-400">{activeDelivery.progress.percentage}% Complete</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{width: `${activeDelivery.progress.percentage}%`}}></div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Update Status
                    </button>
                    <button className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center">
                      <Navigation className="w-5 h-5 mr-2" /> Navigate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Delivery Requests */}
            <div className="pt-4">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-slate-800">Nearby Delivery Requests</h2>
                <button className="text-sm font-bold text-orange-500 hover:underline">See All</button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nearbyRequests.map((req, idx) => (
                  <div key={req.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-orange-200 transition-colors">
                    <div>
                      <div className="flex items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-sm ${idx === 0 ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}>
                          <Store className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-bold text-slate-800 mr-2">{req.shopName}</h4>
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center"><Star className="w-3 h-3 mr-0.5 fill-yellow-700" />{req.rating}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 font-medium">{req.location}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-slate-100 pt-3 pb-4">
                        <div className="flex items-center text-xs font-bold text-slate-500">
                          <Send className="w-3 h-3 mr-1.5" /> {req.distance} • {req.time}
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm">
                      Accept Order
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Earnings & Performance) */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            
            {/* Earnings Card */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">Earnings</h2>
                <div className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 px-3 py-1.5 rounded-lg flex items-center cursor-pointer">
                  Today <ChevronDown className="w-3 h-3 ml-1" />
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-500">Today</span>
                  <span className="font-bold text-slate-800">৳{earnings.today}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-500">This Week</span>
                  <span className="font-bold text-slate-800">৳{earnings.thisWeek.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-500">This Month</span>
                  <span className="font-bold text-slate-800">৳{earnings.thisMonth.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-6 mb-6">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Available to Withdraw</span>
                  <span className="text-2xl font-extrabold text-orange-500">৳{earnings.availableToWithdraw.toLocaleString()}</span>
                </div>
                <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center">
                  <Banknote className="w-5 h-5 mr-2" /> Withdraw Cash
                </button>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Your Performance</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F9FAFB] rounded-2xl p-4 text-center border border-slate-100 flex flex-col justify-center">
                  <div className="flex items-center justify-center mb-1 text-orange-500">
                    <Star className="w-5 h-5 mr-1 fill-orange-500" />
                    <span className="text-2xl font-extrabold text-slate-800">{performance.rating}</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Rating</span>
                </div>
                
                <div className="bg-[#F9FAFB] rounded-2xl p-4 text-center border border-slate-100 flex flex-col justify-center">
                  <div className="text-2xl font-extrabold text-slate-800 mb-1">{performance.deliveries}</div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Deliveries</span>
                </div>
                
                <div className="bg-[#F0F7FF] rounded-2xl p-4 text-center border border-blue-50 flex flex-col justify-center">
                  <div className="text-2xl font-extrabold text-blue-600 mb-1">{performance.onTimePercent}%</div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">On-Time %</span>
                </div>
                
                <div className="bg-[#FFF4ED] rounded-2xl p-4 text-center border border-orange-50 flex flex-col justify-center">
                  <div className="text-2xl font-extrabold text-orange-500 mb-1">{performance.acceptancePercent}%</div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Acceptance</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </RunnerLayout>
  );
}
