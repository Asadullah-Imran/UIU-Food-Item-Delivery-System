import React from 'react';
import { 
  Wallet, Clock, Star, CheckCircle2, Zap,
  Filter, Download, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RunnerSidebarFix from './RunnerSidebarFix';

export default function RunnerEarnings() {
  const { user, token } = useAuth();
  const [balance, setBalance] = React.useState(user?.runnerDetails?.walletBalance || 0);
  const [summary, setSummary] = React.useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    lifetimeTotal: 0,
    totalDeliveries: 0,
    currentBalance: 0
  });
  const [transactions, setTransactions] = React.useState([]);
  const [performance, setPerformance] = React.useState({
    rating: 5,
    avgDeliveryTime: '18m',
    acceptanceRate: '98%',
    onTimeRate: '99%'
  });

  React.useEffect(() => {
    const fetchRunnerEarnings = async () => {
      if (!token) return;

      try {
        const [earningsRes, performanceRes, walletRes] = await Promise.all([
          fetch('/api/runner/earnings', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/runner/performance', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/wallet/balance', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const earningsData = earningsRes.ok ? await earningsRes.json() : null;
        const performanceData = performanceRes.ok ? await performanceRes.json() : null;
        const walletData = walletRes.ok ? await walletRes.json() : null;

        if (earningsData?.success) {
          const nextSummary = earningsData.earnings || {};
          setSummary({
            today: Number(nextSummary.today || 0),
            thisWeek: Number(nextSummary.thisWeek || 0),
            thisMonth: Number(nextSummary.thisMonth || 0),
            lifetimeTotal: Number(nextSummary.lifetimeTotal || 0),
            totalDeliveries: Number(nextSummary.totalDeliveries || 0),
            currentBalance: Number(nextSummary.currentBalance || walletData?.walletBalance || 0)
          });
          setBalance(Number(nextSummary.currentBalance || walletData?.walletBalance || 0));
          setTransactions(earningsData.transactions || []);
        } else if (walletData?.walletBalance !== undefined) {
          setBalance(Number(walletData.walletBalance));
        }

        if (performanceData?.success) {
          setPerformance({
            rating: Number(performanceData.performance?.rating || 5),
            avgDeliveryTime: performanceData.performance?.avgDeliveryTime || '18m',
            acceptanceRate: performanceData.performance?.acceptanceRate || '98%',
            onTimeRate: performanceData.performance?.onTimeRate || '99%'
          });
        }
      } catch (e) {
        console.warn('Could not load runner earnings:', e.message);
      }
    };

    fetchRunnerEarnings();
  }, [token]);

  const chartData = Array.from({ length: 7 }, (_, index) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const base = transactions.filter((txn) => {
      if (!txn?.createdAt) return false;
      const day = new Date(txn.createdAt);
      const now = new Date();
      const diff = Math.floor((now - day) / (1000 * 60 * 60 * 24));
      return diff >= index && diff < index + 1;
    });
    const sum = base.reduce((acc, txn) => acc + (Number(txn.amount) || 0), 0);
    return { day: dayNames[index], height: sum ? Math.min((sum / Math.max(summary.thisWeek || 1, 1)) * 100, 100) : 8, active: index === 6 };
  });

  return (
    <>
      <RunnerSidebarFix />
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
                <p className="text-sm font-semibold text-white/90 mb-1">Current Runner Balance</p>
                <h2 className="text-5xl font-extrabold tracking-tight">৳{Number(balance || 0).toFixed(2)}</h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Wallet className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold text-white/80 uppercase tracking-widest mb-1">Monthly Earnings</p>
                <p className="text-2xl font-extrabold">৳{Number(summary.thisMonth || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white/80 uppercase tracking-widest mb-1">Lifetime Total</p>
                <p className="text-2xl font-extrabold">৳{Number(summary.lifetimeTotal || 0).toLocaleString()}</p>
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
                <span className="font-bold text-white">{Number(performance.rating || 0).toFixed(1)}/5.0</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Acceptance Rate</span>
                </div>
                <span className="font-bold text-white">{performance.acceptanceRate}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">On-Time Rate</span>
                </div>
                <span className="font-bold text-white">{performance.onTimeRate}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-500 mb-2">Today's Earnings</p>
            <h3 className="text-3xl font-extrabold text-slate-800">৳{Number(summary.today || 0).toFixed(2)}</h3>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-500 mb-2">Weekly Earnings</p>
            <h3 className="text-3xl font-extrabold text-slate-800">৳{Number(summary.thisWeek || 0).toFixed(2)}</h3>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-500 mb-2">Avg / Delivery</p>
            <h3 className="text-3xl font-extrabold text-slate-800">৳{summary.totalDeliveries ? (Number(summary.lifetimeTotal || 0) / Number(summary.totalDeliveries)).toFixed(2) : '0.00'}</h3>
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
                {transactions.length > 0 ? transactions.map((trx, idx) => {
                  const date = trx.createdAt ? new Date(trx.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A';
                  const amount = Number(trx.amount || 0);
                  const title = trx.order?.orderNumber || trx.description || `Delivery ${idx + 1}`;

                  return (
                    <tr key={trx._id || idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className="font-semibold text-slate-600 text-sm">{title}</span>
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className="font-semibold text-[#8B9BB4] text-[13px]">{date}</span>
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className="font-extrabold text-slate-800 text-sm">{trx.order?.shop?.name || trx.shop?.name || 'Campus Delivery'}</span>
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className="font-semibold text-slate-600 text-[13px]">৳{amount.toFixed(2)}</span>
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className="font-semibold text-[13px] text-slate-400">—</span>
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className="font-extrabold text-slate-800 text-sm">৳{amount.toFixed(2)}</span>
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        {trx.status === 'COMPLETED' ? (
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
                  );
                }) : (
                  <tr>
                    <td colSpan="7" className="py-10 px-6 text-center text-slate-500 text-sm">
                      No earning transactions yet for this runner account.
                    </td>
                  </tr>
                )}
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
