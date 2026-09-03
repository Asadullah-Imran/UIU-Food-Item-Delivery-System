import React from 'react';
import { 
  Package, Store, Banknote, Clock, MapPin, Check,
  Search, ChevronDown, SlidersHorizontal, Navigation,
  CheckCircle2, Sparkles
} from 'lucide-react';
import availableDeliveriesData from '../../data/availableDeliveries.json';

export default function RunnerAvailableDeliveries() {
  const { stats, recommendedDelivery, queue } = availableDeliveriesData;

  return (
    <>
      <div className="max-w-[1200px] mx-auto space-y-8 pt-4">
        
        {/* Header Section */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-slate-800 mb-1 tracking-tight">
            Available Delivery Requests
          </h1>
          <p className="text-slate-500 font-medium">
            Browse nearby delivery requests and accept the ones that fit your route.
          </p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 border-l-[4px] border-l-[#9B5110] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">{stats.available.label}</span>
              <Package className="w-4 h-4 text-[#9B5110]" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {stats.available.value}
              </div>
              <div className="h-1 bg-[#9B5110] rounded-full w-3/4 mt-3"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">{stats.nearbyShops.label}</span>
              <Store className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="flex items-end">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight mr-2">{stats.nearbyShops.value}</span>
                <span className="text-[10px] font-bold text-slate-400 mb-1.5">{stats.nearbyShops.subtext}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full w-1/2 mt-3"></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">{stats.potentialEarnings.label}</span>
              <Banknote className="w-4 h-4 text-[#9B5110]" />
            </div>
            <div>
              <div className="flex items-end">
                <span className="text-3xl font-extrabold text-[#9B5110] tracking-tight mr-2">৳{stats.potentialEarnings.value}</span>
                <span className="text-[10px] font-bold text-slate-400 mb-1.5">{stats.potentialEarnings.subtext}</span>
              </div>
              <div className="h-1 bg-[#9B5110] rounded-full w-3/4 mt-3"></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">{stats.avgTime.label}</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
              {stats.avgTime.value}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#F3E5D4] p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex items-start mb-6">
            <div className="w-8 h-8 rounded-full bg-[#9B5110] text-white flex items-center justify-center mr-3 shadow-sm flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#9B5110] flex items-center">
                Best Delivery for You
              </h2>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                Recommended based on your current location and route history
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Box - Details */}
            <div className="bg-[#F8F7F5] rounded-2xl p-6 flex-1 shadow-sm">
              <div className="flex items-center mb-6">
                <img src={recommendedDelivery.image} alt="Shop" className="w-16 h-16 rounded-xl object-cover shadow-sm mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{recommendedDelivery.shopName}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    ORDER {recommendedDelivery.orderId} • {recommendedDelivery.itemsCount} items 
                    (৳{recommendedDelivery.price})
                  </p>
                </div>
              </div>

              {/* Map Pins */}
              <div className="relative pl-4 mb-6">
                <div className="absolute left-6 top-3 bottom-3 w-[2px] bg-slate-200"></div>
                
                <div className="relative flex items-start mb-5">
                  <div className="w-5 h-5 rounded-full bg-white border-[3px] border-slate-300 shadow-sm z-10 mr-4 flex-shrink-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  </div>
                  <div className="mt-[-2px]">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Pickup</span>
                    <span className="font-bold text-slate-800">{recommendedDelivery.pickup}</span>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="w-5 h-5 rounded-full bg-white border-[3px] border-[#9B5110] shadow-sm z-10 mr-4 flex-shrink-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9B5110]"></div>
                  </div>
                  <div className="mt-[-2px]">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Drop-off</span>
                    <span className="font-bold text-slate-800">{recommendedDelivery.dropoff}</span>
                  </div>
                </div>
              </div>

              {/* Dist/Time */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Distance</span>
                  <span className="text-lg font-bold text-slate-800">{recommendedDelivery.distance}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Est. Time</span>
                  <span className="text-lg font-bold text-slate-800">{recommendedDelivery.estTime}</span>
                </div>
              </div>
            </div>

            {/* Right Box - Reasons & Button */}
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <h3 className="text-sm font-bold text-slate-700 tracking-wider uppercase mb-5">
                  Why Recommended?
                </h3>
                <ul className="space-y-4">
                  {recommendedDelivery.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 leading-snug">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8">
                <button className="flex items-center justify-center bg-[#F37623] hover:bg-[#d9671b] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-orange-500/20 transition-all w-full sm:w-auto min-w-[200px]">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Accept Delivery
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-transparent mt-6">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search other requests..." 
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-bold text-slate-600 placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-between bg-slate-200/50 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors border border-slate-200">
              All Buildings <ChevronDown className="w-4 h-4 ml-2 text-slate-500" />
            </button>
            <button className="flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
            </button>
          </div>
        </div>

        {/* Nearby Delivery Queue */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 tracking-widest uppercase mb-4">
            Nearby Delivery Queue
          </h3>
          
          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center border border-slate-100 shadow-sm hover:border-orange-200 transition-colors gap-4">
                
                {/* Left info */}
                <div className="flex items-center w-full sm:w-auto">
                  <img src={item.image} alt={item.shopName} className="w-12 h-12 rounded-lg object-cover shadow-sm mr-4 flex-shrink-0" />
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-extrabold text-slate-800 text-[15px] mr-2">{item.shopName}</h4>
                      {item.isNew && (
                        <span className="bg-red-50 text-red-500 text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-widest flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span> NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" /> Pickup: {item.pickup} • {item.distance} away
                    </p>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:pl-4">
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Reward</span>
                    <span className="font-extrabold text-[17px] text-[#9B5110] leading-none">৳{item.reward}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg font-bold text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
                      Details
                    </button>
                    <button className="px-4 py-2 rounded-lg font-bold text-xs text-white bg-[#F37623] hover:bg-[#d9671b] shadow-sm shadow-orange-500/20 transition-colors">
                      Accept
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
