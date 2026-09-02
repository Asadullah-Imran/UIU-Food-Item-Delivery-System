import React from 'react';
import { 
  Banknote, BarChart3, CalendarCheck, ShoppingBag, Receipt, Smile,
  Calendar, Download, FileText, MoreVertical, Star
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import SharedLayout from '../components/SharedLayout';
import { shopNavigation, shopUser } from '../config/navigation';
import shopOrdersData from '../data/shopOrdersData.json';

const ShopSalesReports = () => {
  const { salesMetrics, revenueTrendsData, categoryPerformanceData, ordersByDayData, bestSellingItems } = shopOrdersData;

  const headerActions = (
    <>
      <button className="hidden lg:flex items-center bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full hover:bg-slate-50 transition-colors shadow-sm text-sm">
        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
        Jul 1, 2026 - Jul 31, 2026
      </button>
      <button className="hidden lg:flex items-center bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full hover:bg-slate-50 transition-colors shadow-sm text-sm">
        <Download className="w-4 h-4 mr-2 text-slate-400" />
        CSV
      </button>
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition-colors flex items-center shadow-sm text-sm">
        <FileText className="w-4 h-4 mr-2" /> Export PDF
      </button>
    </>
  );

  return (
    <SharedLayout navigation={shopNavigation} user={shopUser} headerActions={headerActions}>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Page Header */}
        <div className="mb-8 mt-4">
          <div className="text-sm font-bold text-slate-400 mb-1">
            Dashboard <span className="mx-2">&rsaquo;</span> <span className="text-[#8B4513]">Sales Reports</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Sales Reports & Analytics</h1>
          <p className="text-slate-500 font-medium">Monitor revenue, orders, customer activity, and business performance across your university shop ecosystem.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Today's Revenue</p>
              <h3 className="text-xl font-extrabold text-slate-800">৳{salesMetrics.todayRevenue}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Weekly Sales</p>
              <h3 className="text-xl font-extrabold text-slate-800">৳{salesMetrics.weeklySales}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Monthly Revenue</p>
              <h3 className="text-xl font-extrabold text-slate-800">৳{salesMetrics.monthlyRevenue}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Total Orders</p>
              <h3 className="text-xl font-extrabold text-slate-800">{salesMetrics.totalOrders}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center mb-3">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Avg Order Value</p>
              <h3 className="text-xl font-extrabold text-slate-800">৳{salesMetrics.avgOrderValue}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-3">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Satisfaction</p>
              <h3 className="text-xl font-extrabold text-slate-800">{salesMetrics.satisfaction}</h3>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Trends */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Revenue Trends</h3>
                <p className="text-xs font-semibold text-slate-500">Daily earnings for the current month</p>
              </div>
              <div className="flex bg-slate-100 rounded-full p-1">
                <button className="px-4 py-1.5 rounded-full text-[10px] font-extrabold text-slate-500 hover:text-slate-700">Daily</button>
                <button className="px-4 py-1.5 rounded-full text-[10px] font-extrabold bg-orange-500 text-white shadow-sm">Weekly</button>
                <button className="px-4 py-1.5 rounded-full text-[10px] font-extrabold text-slate-500 hover:text-slate-700">Monthly</button>
              </div>
            </div>
            <div className="flex-1 h-64 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }} dy={10} />
                  <YAxis hide={true} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748B', fontSize: '12px' }}
                    itemStyle={{ color: '#F97316', fontSize: '16px', fontWeight: '800' }}
                    formatter={(value) => [`৳${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Category Performance</h3>
            <p className="text-xs font-semibold text-slate-500 mb-8">Revenue split by product type</p>
            
            <div className="flex-1 flex flex-col justify-center gap-6">
              {categoryPerformanceData.reduce((result, value, index, array) => {
                if (index % 2 === 0)
                  result.push(array.slice(index, index + 2));
                return result;
              }, []).map((pair, rowIndex) => (
                <div key={rowIndex} className="flex justify-between items-center">
                  {pair.map((cat, idx) => (
                    <div key={idx} className="flex items-center w-1/2">
                      <div className="w-3 h-3 rounded-full mr-3 shadow-sm" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-sm font-bold text-slate-700">{cat.name} <span className="text-slate-400 font-semibold text-xs ml-1">({cat.value}%)</span></span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders by Day */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Orders by Day</h3>
                <p className="text-xs font-semibold text-slate-500">Peak order frequency analysis</p>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 h-64 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersByDayData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barSize={16}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }} dy={10} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', padding: '4px 8px' }}
                    itemStyle={{ display: 'none' }}
                    labelStyle={{ display: 'none' }}
                    formatter={(value) => [`${value}`, 'Orders']}
                  />
                  <Bar dataKey="orders" radius={[8, 8, 8, 8]}>
                    {ordersByDayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.day === 'MON' || entry.day === 'FRI' ? '#1E293B' : '#F1F5F9'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Best Selling Items */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Best Selling Items</h3>
            <div className="flex-1 flex flex-col gap-4">
              {bestSellingItems.map((item, idx) => (
                <div key={item.id} className="flex items-center p-3 rounded-2xl bg-slate-50 relative">
                  {idx === 0 && (
                    <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover mr-4 shadow-sm" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-500">{item.orders} orders sold</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-extrabold text-slate-800">৳{item.revenue}</h4>
                    <span className={`text-[10px] font-extrabold ${idx === 0 ? 'text-green-500' : 'text-slate-400'}`}>TOP {idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Detailed Reports */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Generate Detailed Reports</h3>
          <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto mb-8">Download comprehensive performance breakdowns in high-fidelity PDF format for your quarterly reviews and tax filling.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Daily Report</h4>
              <p className="text-[11px] font-semibold text-slate-500 mb-6">Full audit trail of today's sales</p>
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors text-sm">Download PDF</button>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Weekly Summary</h4>
              <p className="text-[11px] font-semibold text-slate-500 mb-6">Growth trends & category split</p>
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors text-sm">Download PDF</button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Monthly Analytics</h4>
              <p className="text-[11px] font-semibold text-slate-500 mb-6">Complete business performance</p>
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors text-sm">Download PDF</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-slate-500">
          <p>© 2023 UIU Delivery Portal. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Support</a>
          </div>
        </div>

      </div>
    </SharedLayout>
  );
};

export default ShopSalesReports;
