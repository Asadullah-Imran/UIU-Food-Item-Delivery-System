import React from 'react';
import { 
  Wallet, Clock, Star, CheckCircle2, Zap,
  Filter, Download, ChevronDown
} from 'lucide-react';
import runnerEarningsData from '../../data/runnerEarningsData.json';

export default function RunnerEarnings() {
  
  // Dummy chart data for Weekly Earnings Trend
  const chartData = [
    { day: 'Mon', height: 40, active: false },
    { day: 'Tue', height: 30, active: false },
    { day: 'Wed', height: 50, active: false },
    { day: 'Thu', height: 45, active: false },
    { day: 'Fri', height: 60, active: false },
    { day: 'Sat', height: 25, active: false },
    { day: 'Sun', height: 75, active: true }
  ];

  return (
    <>
      <div className="max-w-[1200px] mx-auto pt-4 pb-12 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
            Earnings & Wallet
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Track your delivery rewards, wallet balance, and performance insights.
          </p>
        </div>

        {/* Top Cards: Wallet & Performance */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Wallet Card */}
          <div className="flex-[2] rounded-[32px] p-8 sm:p-10 shadow-lg text-white relative overflow-hidden flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #F89849 0%, #EA6D17 100%)' }}>
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-sm font-semibold text-white/90 mb-1">Current Wallet Balance</p>
                <h2 className="text-5xl font-extrabold tracking-tight">৳1,250.00</h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Wallet className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold text-white/80 uppercase tracking-widest mb-1">Monthly Earnings</p>
                <p className="text-2xl font-extrabold">৳4,800</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white/80 uppercase tracking-widest mb-1">Lifetime Total</p>
                <p className="text-2xl font-extrabold">৳15,420</p>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="flex-[1] rounded-[32px] p-8 shadow-lg text-white relative overflow-hidden flex flex-col" style={{ backgroundColor: '#2A3F54' }}>
            <h3 className="text-lg font-bold mb-6 text-slate-100">Performance</h3>
            
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Avg Delivery Time</span>
                </div>
                <span className="font-bold text-white">18m</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Customer Rating</span>
                </div>
                <span className="font-bold text-white">4.9/5.0</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Acceptance Rate</span>
                </div>
                <span className="font-bold text-white">98%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">On-Time Rate</span>
                </div>
                <span className="font-bold text-white">99%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-500 mb-2">Today's Earnings</p>
            <h3 className="text-3xl font-extrabold text-slate-800">৳650.00</h3>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-500 mb-2">Weekly Earnings</p>
            <h3 className="text-3xl font-extrabold text-slate-800">৳2,120.00</h3>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-500 mb-2">Avg / Delivery</p>
            <h3 className="text-3xl font-extrabold text-slate-800">৳55.40</h3>
          </div>
        </div>

        {/* Middle Section: Chart & Achievements */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Chart Card */}
          <div className="flex-[2] bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-slate-800">Weekly Earnings Trend</h2>
              <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                Last 7 Days <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="h-48 flex items-end justify-between relative mt-12 pb-6">
              {/* Bars */}
              {chartData.map((data, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center justify-end group w-12 h-full">
                  <div 
                    className="w-full rounded-t-lg relative flex items-end overflow-hidden mb-4 transition-all duration-300"
                    style={{ 
                      height: `${data.height}%`,
                      backgroundColor: data.active ? '#F37623' : '#FCDCC3'
                    }}
                  >
                  </div>
                  <span className="absolute bottom-0 text-[11px] font-semibold text-slate-500">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Card */}
          <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Achievements</h2>
            
            <div className="space-y-4">
              
              {/* Fast Delivery Bonus */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className="flex gap-4 items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <h4 className="text-xs font-extrabold text-slate-800">Fast Delivery Bonus</h4>
                      <span className="text-[10px] font-bold text-[#F37623]">+৳50</span>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#9B5110] rounded-full w-[80%]"></div>
                </div>
              </div>

              {/* Perfect Rating Bonus */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 text-green-700">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">Perfect Rating Bonus</h4>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Unlocked: Weekly consistency</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          
          {/* Table Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Trans ID</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Date</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Shop Name</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Credits</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Bonus</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Final Amount</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {runnerEarningsData.map((trx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className="font-semibold text-slate-600 text-sm">{trx.transId}</span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className="font-semibold text-[#8B9BB4] text-[13px]">{trx.date}</span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className="font-extrabold text-slate-800 text-sm">{trx.shop}</span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className="font-semibold text-slate-600 text-[13px]">৳{trx.credits.toFixed(2)}</span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className={`font-semibold text-[13px] ${trx.bonus > 0 ? 'text-green-500' : 'text-slate-400'}`}>
                        {trx.bonus > 0 ? `+৳${trx.bonus.toFixed(2)}` : '—'}
                      </span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className="font-extrabold text-slate-800 text-sm">৳{trx.finalAmount.toFixed(2)}</span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      {trx.status === 'SETTLED' ? (
                        <span className="bg-[#EAF7EE] text-[#1E954B] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-green-100">
                          Settled
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-blue-100">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-slate-50/50 border-t border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button className="text-sm font-bold text-[#F37623] hover:text-[#d9671b] transition-colors">
              View All Transactions
            </button>
            <button className="bg-[#F37623] hover:bg-[#d9671b] text-white px-8 py-3.5 rounded-xl text-sm font-bold flex items-center transition-colors shadow-sm">
              <Wallet className="w-4 h-4 mr-2" /> Withdraw Cash
            </button>
          </div>

        </div>

      </div>
    </>
  );
}
