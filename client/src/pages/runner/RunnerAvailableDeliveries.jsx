import React, { useState, useMemo } from 'react';
import { 
  Package, Store, Banknote, Clock, MapPin, Check,
  Search, ChevronDown, SlidersHorizontal, Navigation,
  CheckCircle2, Sparkles, X, ArrowRight
} from 'lucide-react';
import availableDeliveriesData from '../../data/availableDeliveries.json';
import RunnerSidebarFix from './RunnerSidebarFix';
import { Link, useNavigate } from 'react-router-dom';

export default function RunnerAvailableDeliveries() {
  const navigate = useNavigate();
  const { stats, recommendedDelivery, queue } = availableDeliveriesData;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('All Buildings');
  const [detailsModalItem, setDetailsModalItem] = useState(null);

  const buildings = ['All Buildings', 'Academic Building', 'Library', 'Campus Main Gate', 'Cafeteria Wing'];

  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.shopName.toLowerCase().includes(q) ||
        item.pickup.toLowerCase().includes(q);

      const matchesBuilding =
        selectedBuilding === 'All Buildings' ||
        item.pickup.toLowerCase().includes(selectedBuilding.toLowerCase());

      return matchesSearch && matchesBuilding;
    });
  }, [queue, searchQuery, selectedBuilding]);

  return (
    <>
      <RunnerSidebarFix />
      <div className="max-w-[1200px] mx-auto space-y-8 pt-4 pb-12">
        
        {/* Header Section */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1 tracking-tight">
            Available Delivery Requests
          </h1>
          <p className="text-slate-500 font-medium">
            Browse nearby delivery requests and accept the ones that fit your route on campus.
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

        {/* Recommended Delivery Card */}
        <div className="bg-white rounded-3xl border border-[#F3E5D4] p-6 sm:p-8 shadow-sm">
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
            <div className="flex-1 bg-[#FAF7F2] rounded-2xl p-6 border border-[#F3E5D4]/60 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-[#9B5110] bg-orange-100/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {recommendedDelivery.tag}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 mt-2">{recommendedDelivery.shopName}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 block">Reward</span>
                    <span className="text-2xl font-black text-[#9B5110]">৳{recommendedDelivery.reward}</span>
                  </div>
                </div>

                <div className="relative pl-6 space-y-4 my-6 border-l-2 border-dashed border-orange-300 ml-2">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup</p>
                    <p className="text-sm font-bold text-slate-800">{recommendedDelivery.pickup}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drop-off</p>
                    <p className="text-sm font-bold text-slate-800">{recommendedDelivery.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-orange-200/50 pt-4 text-xs font-bold text-slate-600">
                <span>Distance: {recommendedDelivery.distance}</span>
                <span>Est. Time: {recommendedDelivery.estTime}</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Why Recommended?
                </h4>
                <ul className="space-y-3">
                  {recommendedDelivery.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/dashboard/runner/active/accepted"
                  className="flex items-center justify-center bg-[#F37623] hover:bg-[#d9671b] text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-orange-500/20 transition-all text-sm w-full sm:w-auto text-decoration-none"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Accept Delivery
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-transparent mt-6">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search other requests by shop or location..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold text-slate-700 placeholder-slate-400 shadow-sm"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              {buildings.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Nearby Delivery Queue */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 tracking-widest uppercase mb-4">
            Nearby Delivery Queue ({filteredQueue.length})
          </h3>
          
          <div className="space-y-3">
            {filteredQueue.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">
                No delivery requests match your search filter.
              </div>
            ) : (
              filteredQueue.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center border border-slate-100 shadow-sm hover:border-orange-200 transition-colors gap-4">
                  
                  {/* Left info */}
                  <div className="flex items-center w-full sm:w-auto">
                    <img src={item.image} alt={item.shopName} className="w-12 h-12 rounded-xl object-cover shadow-sm mr-4 flex-shrink-0" />
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
                      <button 
                        type="button"
                        onClick={() => setDetailsModalItem(item)}
                        className="px-4 py-2 rounded-xl font-bold text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        Details
                      </button>
                      <button 
                        type="button"
                        onClick={() => navigate('/dashboard/runner/active/accepted')}
                        className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#F37623] hover:bg-[#d9671b] shadow-sm shadow-orange-500/20 transition-colors"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                  
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* DELIVERY DETAILS MODAL */}
      {detailsModalItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <img src={detailsModalItem.image} alt={detailsModalItem.shopName} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{detailsModalItem.shopName}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{detailsModalItem.pickup}</p>
                </div>
              </div>
              <button onClick={() => setDetailsModalItem(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Pickup Point</span>
                  <span className="font-bold text-slate-800">{detailsModalItem.pickup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Distance from You</span>
                  <span className="font-bold text-slate-800">{detailsModalItem.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Estimated Delivery Time</span>
                  <span className="font-bold text-slate-800">12 - 15 mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Delivery Reward</span>
                  <span className="font-extrabold text-[#9B5110] text-sm">৳ {detailsModalItem.reward} BDT</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDetailsModalItem(null);
                  navigate('/dashboard/runner/active/accepted');
                }}
                className="flex-1 bg-[#F37623] hover:bg-[#d9671b] text-white font-bold py-3.5 rounded-2xl text-xs transition-colors shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> Accept This Task
              </button>
              <button
                type="button"
                onClick={() => setDetailsModalItem(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
