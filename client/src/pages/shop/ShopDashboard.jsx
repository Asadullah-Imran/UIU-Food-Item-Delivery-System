import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Timer, Utensils, CheckCircle2, Banknote, Star,
  ArrowRight, Plus, FileEdit, TrendingUp, ListOrdered, Eye, AlertTriangle, ChevronDown,
  RefreshCw, Loader2, PackageCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ShopDashboard() {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const authToken = token || localStorage.getItem('uiu_auth_token');
      if (!authToken) {
        throw new Error('Authentication token missing. Please log in.');
      }

      const res = await fetch('/api/shops/dashboard', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to load dashboard');
      }

      setDashboard(data.dashboard);
    } catch (err) {
      console.error('getShopDashboard error:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-semibold">Loading real-time shop dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto py-16 px-4">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-bold text-red-800">Dashboard Unavailable</h3>
          <p className="text-slate-600 text-sm">{error}</p>
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition shadow"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    todayOrders = 0,
    incomingOrders = 0,
    preparingOrders = 0,
    readyOrders = 0,
    completedOrders = 0,
    todayRevenue = 0,
    totalRevenue = 0,
    lowStockItems = [],
    lowStockCount = 0,
    averageRating = 0,
    reviewsCount = 0,
    popularItems = [],
    recentOrders = [],
    shop = {}
  } = dashboard || {};

  const shopName = shop?.name || user?.name || "Shop Owner";

  // Compute percentage for popular items bar visualization
  const topPopularItemMax = popularItems.length > 0 ? (popularItems[0].totalQuantity || 1) : 1;

  // Day-of-week visualization fallback (sample active ratio based on todayRevenue)
  const revenueTrendData = [
    { day: 'SAT', value: 35 },
    { day: 'SUN', value: 45 },
    { day: 'MON', value: 60 },
    { day: 'TUE', value: 75 },
    { day: 'WED', value: Math.min(100, Math.max(20, Math.round((todayRevenue / (todayRevenue + 500 || 1000)) * 100))) },
    { day: 'THU', value: 50 },
    { day: 'FRI', value: 40 }
  ];

  return (
    <>
      <div className="max-w-[1400px] mx-auto space-y-6 pt-4">
        
        {/* Top Hero Banner */}
        <div 
          className="rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-lg"
          style={{ background: 'linear-gradient(to right, #475569, #64748b)' }}
        >
          {/* Subtle background graphic (Hamburger SVG) */}
          <svg className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-64 h-64 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-orange-500/30 text-orange-200 text-xs font-bold px-3 py-1 rounded-full border border-orange-400/40">
                Live Kitchen Operations
              </span>
              <button 
                onClick={fetchDashboard} 
                title="Refresh real-time data"
                className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Good Day, {shopName} <span className="text-4xl">👋</span>
            </h1>
            <p className="text-slate-200 text-lg md:text-xl font-medium mb-8">
              You have <span className="text-orange-400 font-extrabold">{incomingOrders}</span> incoming {incomingOrders === 1 ? 'order' : 'orders'} waiting and <span className="text-orange-400 font-extrabold">{preparingOrders}</span> in preparation.
            </p>
            <Link 
              to="/dashboard/shop/orders"
              className="inline-flex items-center bg-white text-slate-800 hover:bg-slate-50 font-bold py-3.5 px-8 rounded-full transition-colors shadow-md group"
            >
              View Incoming Orders <ArrowRight className="w-5 h-5 ml-2 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 6 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Today's Orders */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36 hover:border-blue-200 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Today's Orders</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{todayOrders}</h3>
            </div>
          </div>

          {/* Pending / Incoming */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36 hover:border-orange-200 transition">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-2">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Incoming</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{incomingOrders}</h3>
            </div>
          </div>

          {/* Preparing */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36 hover:border-yellow-200 transition">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center mb-2">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Preparing</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{preparingOrders}</h3>
            </div>
          </div>

          {/* Completed (Delivered) */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36 hover:border-green-200 transition">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Completed</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{completedOrders}</h3>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36 hover:border-emerald-200 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Today's (৳)</p>
              <h3 className="text-2xl font-extrabold text-slate-800">৳{Number(todayRevenue).toLocaleString()}</h3>
            </div>
          </div>

          {/* Avg Rating */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36 hover:border-amber-200 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Avg. Rating</p>
              <h3 className="text-2xl font-extrabold text-slate-800">
                {averageRating ? Number(averageRating).toFixed(1) : '5.0'}
                <span className="text-xs font-normal text-slate-400 ml-1">({reviewsCount})</span>
              </h3>
            </div>
          </div>
          
        </div>

        {/* Middle Section (Charts & Quick Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Trend */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Revenue Trend</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Total Lifetime: ৳{Number(totalRevenue).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 px-3 py-1.5 rounded-lg flex items-center">
                Weekly <ChevronDown className="w-3 h-3 ml-1" />
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 h-40">
              {revenueTrendData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className="w-full relative group flex justify-center h-32 items-end">
                    <div 
                      className="w-full rounded-md transition-all duration-300"
                      style={{ 
                        height: `${data.value}%`,
                        backgroundColor: data.day === 'WED' ? '#f97316' : '#E5D5C5'
                      }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-3">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Top Selling Items</h2>
            <div className="flex-1 flex flex-col justify-center space-y-5">
              {popularItems.length > 0 ? (
                popularItems.slice(0, 4).map((item, idx) => {
                  const percent = Math.min(100, Math.max(15, Math.round(((item.totalQuantity || 1) / topPopularItemMax) * 100)));
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5">
                        <span className="truncate pr-2">{item.name}</span>
                        <span className="text-orange-600 shrink-0">{item.totalQuantity} sold</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">
                  <PackageCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No items delivered yet today. Delivered orders will rank here!
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#F9FAFB] rounded-[2rem] border border-slate-200 shadow-sm p-6 flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <Link 
                to="/dashboard/shop/menu/add" 
                className="bg-white border border-slate-200 hover:border-orange-200 hover:shadow-md rounded-2xl p-4 flex flex-col items-center justify-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">Add Item</span>
              </Link>
              
              <Link 
                to="/dashboard/shop/menu" 
                className="bg-white border border-slate-200 hover:border-orange-200 hover:shadow-md rounded-2xl p-4 flex flex-col items-center justify-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileEdit className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">Update Menu</span>
              </Link>

              <Link 
                to="/dashboard/shop/reports" 
                className="bg-white border border-slate-200 hover:border-orange-200 hover:shadow-md rounded-2xl p-4 flex flex-col items-center justify-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">Reports</span>
              </Link>

              <Link 
                to="/dashboard/shop/orders" 
                className="bg-white border border-slate-200 hover:border-orange-200 hover:shadow-md rounded-2xl p-4 flex flex-col items-center justify-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">Orders ({incomingOrders})</span>
              </Link>
            </div>
          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Orders (takes 2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
              <Link to="/dashboard/shop/orders" className="text-sm font-bold text-orange-500 flex items-center hover:underline">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider pl-4">Order ID</th>
                    <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Student</th>
                    <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Items</th>
                    <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider text-right pr-8">Total (৳)</th>
                    <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider text-center">Status</th>
                    <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, idx) => {
                      const orderNum = order.orderNumber || `#ORD-${order._id?.slice(-4).toUpperCase()}`;
                      const studentName = order.student?.name || 'UIU Student';
                      const itemsText = order.items && order.items.length > 0
                        ? order.items.map(i => `${i.name}${i.quantity > 1 ? ` (x${i.quantity})` : ''}`).join(', ')
                        : 'Order Item';
                      const grandTotal = order.billing?.grandTotal ?? order.billing?.subtotal ?? order.total ?? 0;
                      
                      return (
                        <tr key={order._id || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 pl-4 font-extrabold text-slate-800 text-sm whitespace-nowrap">{orderNum}</td>
                          <td className="py-4 text-sm font-bold text-slate-600 whitespace-nowrap">
                            {studentName}
                          </td>
                          <td className="py-4 text-sm font-semibold text-slate-500 max-w-[180px] truncate" title={itemsText}>
                            {itemsText}
                          </td>
                          <td className="py-4 text-sm font-extrabold text-slate-800 text-right pr-8 whitespace-nowrap">৳ {grandTotal}</td>
                          <td className="py-4 text-center">
                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap ${
                              order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'PLACED' ? 'bg-orange-100 text-orange-800' :
                              order.status === 'READY_FOR_PICKUP' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-right pr-4">
                            <Link 
                              to={`/dashboard/shop/orders/${order._id}`} 
                              className="inline-flex p-2 text-slate-400 hover:text-orange-600 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">
                        No orders recorded yet. Incoming orders will show up immediately.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Low Stock & Popular */}
          <div className="space-y-6">
            
            {/* Low Stock Alert */}
            <div className="bg-red-50 border-l-4 border-l-red-500 rounded-r-[2rem] rounded-l-none border-y border-r border-red-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-red-700 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Low Stock Alert
                </h2>
                <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {lowStockCount} Items
                </span>
              </div>
              
              <div className="space-y-3">
                {lowStockItems.length > 0 ? (
                  lowStockItems.slice(0, 3).map((item, idx) => (
                    <div key={item._id || idx} className="bg-white rounded-2xl p-4 border border-red-100 flex justify-between items-center shadow-sm">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h4>
                        <p className="text-xs font-semibold text-slate-500">
                          Only {item.stockQuantity ?? 0} left (Threshold: {item.lowStockWarning ?? 10})
                        </p>
                      </div>
                      <Link 
                        to="/dashboard/shop/menu"
                        className="text-xs font-extrabold text-orange-500 hover:text-orange-600 uppercase tracking-wider"
                      >
                        Restock
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/80 rounded-2xl p-4 text-center text-xs font-semibold text-slate-500">
                    All inventory levels are healthy!
                  </div>
                )}
              </div>
            </div>

            {/* Popular Today */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Popular Today</h2>
              
              <div className="space-y-4">
                {popularItems.length > 0 ? (
                  popularItems.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop'} 
                        alt={item.name} 
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm mr-4" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{item.name}</h4>
                        <p className="text-xs font-semibold text-slate-500">
                          {item.totalQuantity} Orders {item.totalRevenue ? <><span className="text-orange-500 mx-1">|</span> ৳{Number(item.totalRevenue).toLocaleString()}</> : ''}
                        </p>
                      </div>
                      <div className="flex items-center text-xs font-bold text-amber-500 shrink-0">
                        <Star className="w-3 h-3 mr-1 fill-amber-500" /> {averageRating ? Number(averageRating).toFixed(1) : '4.8'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs font-medium">
                    No items sold today yet.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}
