import React from 'react';
import { 
  Truck, Banknote, Star, Clock, Award, Zap, CheckCircle2,
  Search, Calendar, ChevronDown, Download, Wallet, Rocket,
  Circle
} from 'lucide-react';
import deliveryHistoryData from '../../data/deliveryHistoryData.json';
import { Link } from 'react-router-dom';

export default function RunnerDeliveryHistory() {
  
  // Dummy chart data
  const chartData = [
    { day: 'Mon', height: 40, activeHeight: 15 },
    { day: 'Tue', height: 60, activeHeight: 35 },
    { day: 'Wed', height: 50, activeHeight: 25 },
    { day: 'Thu', height: 75, activeHeight: 50 },
    { day: 'Fri', height: 35, activeHeight: 15 },
    { day: 'Sat', height: 30, activeHeight: 10 },
    { day: 'Sun', height: 55, activeHeight: 40 }
  ];

  return (
    <>
      <div className="max-w-[1200px] mx-auto pt-4 pb-12 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
            Delivery History
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Review your completed campus deliveries, earnings, and performance over time.
          </p>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-[#9B5110] border border-orange-100">
              <Truck className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Deliveries</p>
            <h3 className="text-3xl font-extrabold text-slate-800">142</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-[#9B5110] border border-orange-100">
              <Banknote className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Credits Earned</p>
            <h3 className="text-3xl font-extrabold text-slate-800">৳8,520</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-[#9B5110] border border-orange-100">
              <Star className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Average Rating</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-slate-800">4.9</h3>
              <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-[#9B5110] border border-orange-100">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">On-Time Rate</p>
            <h3 className="text-3xl font-extrabold text-slate-800">98%</h3>
          </div>

        </div>

        {/* Middle Section: Chart & Milestones */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Chart Card */}
          <div className="flex-[2] bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-slate-800">Delivery Performance</h2>
              <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1 border border-slate-200/60">
                <button className="bg-white text-[#9B5110] text-[11px] font-extrabold px-4 py-1.5 rounded-full shadow-sm">Week</button>
                <button className="text-slate-500 hover:text-slate-700 text-[11px] font-extrabold px-4 py-1.5 rounded-full transition-colors">Month</button>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between relative mt-12 pb-6 border-b border-slate-100">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
              </div>

              {/* Bars */}
              {chartData.map((data, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center justify-end group w-10 h-full">
                  <div className="w-6 bg-[#FEF0E6] rounded-t-lg relative flex items-end overflow-hidden mb-6" style={{ height: `${data.height}%` }}>
                    <div className="w-full bg-[#F37623] rounded-t-md" style={{ height: `${(data.activeHeight / data.height) * 100}%` }}></div>
                  </div>
                  <span className="absolute bottom-0 text-[10px] font-bold text-slate-500">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones Card */}
          <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-6">Milestones</h2>
              
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-yellow-600">
                      <Award className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">100 Deliveries</h4>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Completed Jul 12, 2026</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-500">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Fast Delivery Award</h4>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Top 5% speed this week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <div className="flex justify-between items-end mb-2">
                <h4 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-widest">Weekly Goal</h4>
                <span className="text-sm font-extrabold text-[#9B5110]">85%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#F37623] rounded-full w-[85%]"></div>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 italic">
                15 more to reach 100 bonus credits!
              </p>
            </div>
          </div>

        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
          
          <div className="flex-1 min-w-[280px] relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search Order ID or Student Name..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#9B5110]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-4 py-3 rounded-xl text-xs font-bold transition-colors">
              <Calendar className="w-4 h-4" /> Jul 1, 2026 - Jul 31, 2026
            </button>
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-4 py-3 rounded-xl text-xs font-bold transition-colors">
              All Statuses <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-4 py-3 rounded-xl text-xs font-bold transition-colors">
              Sort by: Newest <ChevronDown className="w-4 h-4" />
            </button>
            <button className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm">
              Apply
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Order ID</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Shop & Student</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Route</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Date & Time</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Metrics</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Credits</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Rating</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveryHistoryData.map((order, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className="font-extrabold text-[#9B5110]">{order.orderId}</span>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-bold text-slate-800">{order.shop}</p>
                      <p className="text-[11px] font-semibold text-slate-500">{order.student}</p>
                    </td>
                    <td className="py-5 px-6 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#F37623]"></div>
                        <p className="text-xs font-bold text-slate-600 truncate">
                          {order.route.from} &rarr; {order.route.to}
                        </p>
                      </div>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <p className="text-xs font-bold text-slate-800">{order.date},</p>
                      <p className="text-[11px] font-semibold text-slate-500">{order.time}</p>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <p className="text-xs font-bold text-slate-600">{order.metrics.time} • {order.metrics.distance}</p>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className="text-base font-extrabold text-slate-800">৳{order.credits}</span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <div className="flex text-[#F37623]">
                        {[...Array(order.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap text-right">
                      <button className="text-xs font-bold text-[#F37623] hover:text-[#d9671b] transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-slate-50/50 border-t border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[11px] font-bold text-slate-500">
              Showing 1-10 of 142 deliveries
            </p>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors">
                &lt;
              </button>
              <button className="w-8 h-8 rounded-lg bg-[#F37623] text-white font-bold flex items-center justify-center shadow-sm">
                1
              </button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 font-bold flex items-center justify-center hover:bg-slate-50 transition-colors">
                2
              </button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 font-bold flex items-center justify-center hover:bg-slate-50 transition-colors">
                3
              </button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-colors">
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 mt-8">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3.5 rounded-xl text-sm font-bold flex items-center transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export Delivery History (PDF)
          </button>
          <button className="bg-[#FEF8F3] border border-[#F6E3CF] hover:bg-[#FDF0E3] text-[#9B5110] px-6 py-3.5 rounded-xl text-sm font-bold flex items-center transition-colors shadow-sm">
            <Wallet className="w-4 h-4 mr-2" /> View Earnings
          </button>
          <Link 
            to="/dashboard/runner/deliveries"
            className="bg-[#F37623] hover:bg-[#d9671b] text-white px-8 py-3.5 rounded-xl text-sm font-bold flex items-center transition-colors shadow-sm"
          >
            <Rocket className="w-4 h-4 mr-2" /> Accept New Delivery
          </Link>
        </div>

      </div>
    </>
  );
}
