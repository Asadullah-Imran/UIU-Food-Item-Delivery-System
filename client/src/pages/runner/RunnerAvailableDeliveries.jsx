import React, { useState, useMemo, useEffect } from 'react';
import { 
  Package, Store, Banknote, Clock, MapPin, Check,
  Search, ChevronDown, SlidersHorizontal, Navigation,
  CheckCircle2, Sparkles, X, ArrowRight, Loader2, AlertCircle
} from 'lucide-react';
import availableDeliveriesData from '../../data/availableDeliveries.json';
import RunnerSidebarFix from './RunnerSidebarFix';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RunnerAvailableDeliveries() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { stats: defaultStats, recommendedDelivery: defaultRecommended, queue: defaultQueue } = availableDeliveriesData;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('All Buildings');
  const [detailsModalItem, setDetailsModalItem] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const buildings = ['All Buildings', 'Academic Building', 'Library', 'Campus Main Gate', 'Cafeteria Wing'];

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('uiu_auth_token');
      const res = await fetch('/api/runner/deliveries/available', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.deliveries)) {
          setLiveOrders(data.deliveries);
        }
      }
    } catch (err) {
      console.warn('Could not fetch available runner deliveries:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // Combine live orders mapped to queue format with fallback if none
  const mappedLiveQueue = useMemo(() => {
    if (!liveOrders || liveOrders.length === 0) return [];
    return liveOrders.map((order) => ({
      id: order._id,
      orderNumber: order.orderNumber,
      shopName: order.shop?.name || 'Campus Food Stall',
      pickup: order.shop?.location || 'Cafeteria Ground Floor',
      dropoff: order.deliveryAddress?.room || 'Academic Building',
      distance: '180m',
      estTime: '10-15 mins',
      reward: order.billing?.runnerReward || 30,
      tag: order.status === 'READY_FOR_PICKUP' ? 'READY NOW' : 'NEW ORDER',
      image: order.shop?.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
      isNew: true,
      rawOrder: order,
      reasons: [
        `Pickup at ${order.shop?.name || 'Shop Counter'}`,
        `Drop-off at ${order.deliveryAddress?.room || 'Academic Building'}`,
        `Earn guaranteed ৳${order.billing?.runnerReward || 30} delivery reward`
      ]
    }));
  }, [liveOrders]);

  const activeQueue = mappedLiveQueue.length > 0 ? mappedLiveQueue : defaultQueue;

  const activeRecommended = useMemo(() => {
    if (mappedLiveQueue.length > 0) {
      return mappedLiveQueue[0];
    }
    return defaultRecommended;
  }, [mappedLiveQueue, defaultRecommended]);

  const handleAcceptOrder = async (item) => {
    setActionError(null);
    setAcceptingId(item.id);

    try {
      const authToken = token || localStorage.getItem('uiu_auth_token');
      
      // If it's a real live MongoDB order (24-character hex ID)
      if (item.id && /^[0-9a-fA-F]{24}$/.test(item.id)) {
        const res = await fetch(`/api/runner/deliveries/${item.id}/accept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to accept order');
        }
        localStorage.setItem('uiu_active_delivery', JSON.stringify(data.order));
        navigate('/dashboard/runner/active/accepted', { state: { order: data.order } });
      } else {
        // Fallback demo order
        navigate('/dashboard/runner/active/accepted');
      }
    } catch (err) {
      console.error('Accept delivery error:', err);
      setActionError(err.message || 'Could not claim delivery request. Please try again.');
    } finally {
      setAcceptingId(null);
    }
  };

  const filteredQueue = useMemo(() => {
    return activeQueue.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.shopName && item.shopName.toLowerCase().includes(q)) ||
        (item.pickup && item.pickup.toLowerCase().includes(q)) ||
        (item.dropoff && item.dropoff.toLowerCase().includes(q));

      const matchesBuilding =
        selectedBuilding === 'All Buildings' ||
        (item.pickup && item.pickup.toLowerCase().includes(selectedBuilding.toLowerCase())) ||
        (item.dropoff && item.dropoff.toLowerCase().includes(selectedBuilding.toLowerCase()));

      return matchesSearch && matchesBuilding;
    });
  }, [activeQueue, searchQuery, selectedBuilding]);

  const potentialTotalReward = useMemo(() => {
    return activeQueue.reduce((acc, curr) => acc + (curr.reward || 0), 0);
  }, [activeQueue]);

  return (
    <>
      <RunnerSidebarFix />
      <div className="max-w-[1200px] mx-auto space-y-8 pt-4 pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1 tracking-tight">
              Available Delivery Requests
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Browse nearby delivery requests on campus and claim orders to earn cash rewards.
            </p>
          </div>
          {mappedLiveQueue.length > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full border border-emerald-200 text-xs font-bold self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {mappedLiveQueue.length} Live Orders Available
            </div>
          )}
        </div>

        {actionError && (
          <div className="fixed top-24 right-6 z-50 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-3 shadow-xl animate-bounce">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span className="font-semibold">{actionError}</span>
            <button onClick={() => setActionError(null)} className="ml-2 text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 border-l-[4px] border-l-[#9B5110] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Available Deliveries</span>
              <Package className="w-4 h-4 text-[#9B5110]" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {activeQueue.length}
              </div>
              <div className="h-1 bg-[#9B5110] rounded-full w-3/4 mt-3"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Active Shops</span>
              <Store className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="flex items-end">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight mr-2">{defaultStats.nearbyShops.value}</span>
                <span className="text-[10px] font-bold text-slate-400 mb-1.5">{defaultStats.nearbyShops.subtext}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full w-1/2 mt-3"></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Potential Earnings</span>
              <Banknote className="w-4 h-4 text-[#9B5110]" />
            </div>
            <div>
              <div className="flex items-end">
                <span className="text-3xl font-extrabold text-[#9B5110] tracking-tight mr-2">৳{potentialTotalReward || defaultStats.potentialEarnings.value}</span>
                <span className="text-[10px] font-bold text-slate-400 mb-1.5">in queue</span>
              </div>
              <div className="h-1 bg-[#9B5110] rounded-full w-3/4 mt-3"></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Avg Delivery Time</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
              {defaultStats.avgTime.value}
            </div>
          </div>
        </div>

        {/* Recommended Delivery Card */}
        {activeRecommended && (
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
                  Recommended order with highest payout and optimal route on campus
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 bg-[#FAF7F2] rounded-2xl p-6 border border-[#F3E5D4]/60 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-[#9B5110] bg-orange-100/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {activeRecommended.tag || 'TOP PICK'}
                      </span>
                      <h3 className="text-xl font-bold text-slate-800 mt-2">{activeRecommended.shopName}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 block">Reward</span>
                      <span className="text-2xl font-black text-[#9B5110]">৳{activeRecommended.reward}</span>
                    </div>
                  </div>

                  <div className="relative pl-6 space-y-4 my-6 border-l-2 border-dashed border-orange-300 ml-2">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup</p>
                      <p className="text-sm font-bold text-slate-800">{activeRecommended.pickup}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drop-off</p>
                      <p className="text-sm font-bold text-slate-800">{activeRecommended.dropoff}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-orange-200/50 pt-4 text-xs font-bold text-slate-600">
                  <span>Distance: {activeRecommended.distance || '200m'}</span>
                  <span>Est. Time: {activeRecommended.estTime || '10-15 mins'}</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Why Recommended?
                  </h4>
                  <ul className="space-y-3">
                    {(activeRecommended.reasons || []).map((reason, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    disabled={acceptingId === activeRecommended.id}
                    onClick={() => handleAcceptOrder(activeRecommended)}
                    className="flex items-center justify-center bg-[#F37623] hover:bg-[#d9671b] disabled:opacity-50 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-orange-500/20 transition-all text-sm w-full sm:w-auto cursor-pointer"
                  >
                    {acceptingId === activeRecommended.id ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                    )}
                    Accept Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-transparent mt-6">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests by shop, room or building..." 
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
          <h3 className="text-sm font-bold text-slate-700 tracking-widest uppercase mb-4 flex items-center justify-between">
            <span>Nearby Delivery Queue ({filteredQueue.length})</span>
            {loading && <span className="text-xs text-orange-500 font-normal">Refreshing queue...</span>}
          </h3>
          
          <div className="space-y-3">
            {filteredQueue.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">
                No delivery requests match your search filter right now.
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
                          <span className="bg-orange-50 text-orange-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-widest flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1 animate-ping"></span> NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-orange-500" /> Pickup: {item.pickup} ➔ Drop-off: {item.dropoff}
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
                        className="px-4 py-2 rounded-xl font-bold text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                      >
                        Details
                      </button>
                      <button 
                        type="button"
                        disabled={acceptingId === item.id}
                        onClick={() => handleAcceptOrder(item)}
                        className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#F37623] hover:bg-[#d9671b] shadow-sm shadow-orange-500/20 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {acceptingId === item.id && <Loader2 className="w-3 h-3 animate-spin" />}
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
              <button onClick={() => setDetailsModalItem(null)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
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
                  <span className="text-slate-500 font-medium">Drop-off Destination</span>
                  <span className="font-bold text-slate-800">{detailsModalItem.dropoff}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Estimated Time</span>
                  <span className="font-bold text-slate-800">{detailsModalItem.estTime || '12 - 15 mins'}</span>
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
                disabled={acceptingId === detailsModalItem.id}
                onClick={() => {
                  const target = detailsModalItem;
                  setDetailsModalItem(null);
                  handleAcceptOrder(target);
                }}
                className="flex-1 bg-[#F37623] hover:bg-[#d9671b] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs transition-colors shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={16} /> Accept This Task
              </button>
              <button
                type="button"
                onClick={() => setDetailsModalItem(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer"
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
