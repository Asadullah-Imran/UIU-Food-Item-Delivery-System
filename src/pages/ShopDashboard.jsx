import React from 'react';
import { 
  ShoppingBag, Timer, Utensils, CheckCircle2, Banknote, Star,
  ArrowRight, Plus, FileEdit, TrendingUp, ListOrdered, Eye, AlertTriangle, ChevronDown
} from 'lucide-react';
import SharedLayout from '../components/SharedLayout';
import { shopNavigation, shopUser } from '../config/navigation';
import shopData from '../data/shopDashboardData.json';

export default function ShopDashboard() {
  const { metrics, revenueTrend, topSelling, recentOrders, lowStock, popularToday } = shopData;

  return (
    <SharedLayout navigation={shopNavigation} user={shopUser} switchRoleText="Switch to Student" switchRolePath="/dashboard/student">
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
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Good Morning, Chef's Table <span className="text-4xl">👋</span>
            </h1>
            <p className="text-slate-200 text-lg md:text-xl font-medium mb-8">
              You have 18 new orders waiting to be prepared. Your shop performance is up by 12% today.
            </p>
            <button className="bg-white text-slate-800 hover:bg-slate-50 font-bold py-3.5 px-8 rounded-full transition-colors flex items-center shadow-md">
              View Incoming Orders <ArrowRight className="w-5 h-5 ml-2 text-orange-500" />
            </button>
          </div>
        </div>

        {/* 6 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Today's Orders */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Today's Orders</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{metrics.todaysOrders}</h3>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-2">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Pending</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{metrics.pending}</h3>
            </div>
          </div>

          {/* Preparing */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center mb-2">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Preparing</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{metrics.preparing}</h3>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Completed</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{metrics.completed}</h3>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Revenue (৳)</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{metrics.revenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Avg Rating */}
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">Avg. Rating</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{metrics.avgRating}</h3>
            </div>
          </div>
          
        </div>

        {/* Middle Section (Charts & Quick Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Trend */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800">Revenue Trend</h2>
              <div className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 px-3 py-1.5 rounded-lg flex items-center cursor-pointer">
                Weekly <ChevronDown className="w-3 h-3 ml-1" />
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 h-40">
              {revenueTrend.map((data, idx) => (
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
            <div className="flex-1 flex flex-col justify-center space-y-6">
              {topSelling.map((item, idx) => {
                const max = topSelling[0].count;
                const percent = (item.count / max) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                      <span>{item.name}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#F9FAFB] rounded-[2rem] border border-slate-200 shadow-sm p-6 flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <button className="bg-white border border-slate-200 hover:border-orange-200 hover:shadow-md rounded-2xl p-4 flex flex-col items-center justify-center transition-all group">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">Add Item</span>
              </button>
              
              <button className="bg-white border border-slate-200 hover:border-orange-200 hover:shadow-md rounded-2xl p-4 flex flex-col items-center justify-center transition-all group">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileEdit className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">Update Menu</span>
              </button>

              <button className="bg-white border border-slate-200 hover:border-orange-200 hover:shadow-md rounded-2xl p-4 flex flex-col items-center justify-center transition-all group">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">Reports</span>
              </button>

              <button className="bg-white border border-slate-200 hover:border-orange-200 hover:shadow-md rounded-2xl p-4 flex flex-col items-center justify-center transition-all group">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">Orders</span>
              </button>
            </div>
          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Orders (takes 2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
              <button className="text-sm font-bold text-orange-500 flex items-center hover:underline">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </button>
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
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 pl-4 font-extrabold text-slate-800 text-sm whitespace-nowrap">{order.orderId}</td>
                      <td className="py-4 text-sm font-bold text-slate-600 whitespace-nowrap">
                        {order.student.split(' ').map((n, i) => <div key={i}>{n}</div>)}
                      </td>
                      <td className="py-4 text-sm font-semibold text-slate-500 max-w-[150px]">{order.items}</td>
                      <td className="py-4 text-sm font-extrabold text-slate-800 text-right pr-8 whitespace-nowrap">৳ {order.total}</td>
                      <td className="py-4 text-center">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap ${
                          order.status === 'PREPARING' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'NEW ORDER' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-4">
                        <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
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
                <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">3 Items</span>
              </div>
              
              <div className="space-y-3">
                {lowStock.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 border border-red-100 flex justify-between items-center shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{item.item}</h4>
                      <p className="text-xs font-semibold text-slate-500">{item.status}</p>
                    </div>
                    <button className="text-xs font-extrabold text-orange-500 hover:text-orange-600 uppercase tracking-wider">
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Today */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Popular Today</h2>
              
              <div className="space-y-4">
                {popularToday.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm mr-4" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h4>
                      <p className="text-xs font-semibold text-slate-500">
                        {item.orders} Orders <span className="text-orange-500 mx-1">|</span> ৳{item.revenue}
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-bold text-amber-500">
                      <Star className="w-3 h-3 mr-1 fill-amber-500" /> {item.rating}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </SharedLayout>
  );
}
