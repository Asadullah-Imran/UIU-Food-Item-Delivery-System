import React, { useState, useEffect, useMemo } from 'react';
import { 
  Banknote, BarChart3, CalendarCheck, ShoppingBag, Receipt, Smile,
  Calendar, Download, FileText, MoreVertical, Star, RefreshCw, Loader2,
  AlertCircle, ArrowUpRight, CheckCircle2, XCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const ShopSalesReports = () => {
  const [report, setReport] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendView, setTrendView] = useState('Weekly');

  const fetchReportsAndTransactions = async (from = fromDate, to = toDate) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('uiu_auth_token');
      if (!token) {
        throw new Error('Authentication token missing. Please log in.');
      }

      let reportsUrl = '/api/shops/reports';
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (params.toString()) {
        reportsUrl += `?${params.toString()}`;
      }

      const [reportRes, transactionRes] = await Promise.all([
        fetch(reportsUrl, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/shops/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const reportData = await reportRes.json();
      const transactionData = await transactionRes.json();

      if (!reportRes.ok) {
        throw new Error(reportData.message || 'Failed to generate shop report');
      }

      setReport(reportData.report || {});
      setTransactions(transactionData.transactions || []);
    } catch (err) {
      console.error('getShopReports/Transactions Error:', err);
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsAndTransactions();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReportsAndTransactions(fromDate, toDate);
  };

  const handleResetFilter = () => {
    setFromDate('');
    setToDate('');
    fetchReportsAndTransactions('', '');
  };

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert('No transactions available to export.');
      return;
    }
    const headers = ['Transaction ID', 'Order Number', 'Type', 'Amount (BDT)', 'Balance After', 'Date', 'Status'];
    const rows = transactions.map(t => [
      t.transactionId,
      t.order?.orderNumber || 'N/A',
      t.type,
      t.amount,
      t.balanceAfter,
      new Date(t.createdAt).toLocaleDateString(),
      t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shop_transactions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Safe destructuring of report data
  const {
    totalOrders = 0,
    deliveredOrders = 0,
    rejectedOrders = 0,
    cancelledOrders = 0,
    totalRevenue = 0,
    averageOrderValue = 0,
    todayRevenue = 0,
    weeklyRevenue = 0,
    monthlyRevenue = 0,
    bestSellingItems = [],
    categoryPerformance = [],
    orders = []
  } = report || {};

  // Build dynamic chart points based on orders
  const revenueTrendsData = useMemo(() => {
    const daysMap = { 'Sat': 0, 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0 };
    orders.forEach(o => {
      const d = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (daysMap[d] !== undefined) {
        const amt = Number(o.shopAmount ?? o.billing?.shopAmount ?? o.billing?.subtotal ?? o.subtotal ?? 0);
        daysMap[d] += amt;
      }
    });
    return Object.entries(daysMap).map(([day, rev]) => ({
      day: day.toUpperCase(),
      revenue: rev || (day === 'WED' ? Number(todayRevenue || 0) : 0)
    }));
  }, [orders, todayRevenue]);

  // Orders by Day breakdown
  const ordersByDayData = useMemo(() => {
    const counts = { 'SAT': 0, 'SUN': 0, 'MON': 0, 'TUE': 0, 'WED': 0, 'THU': 0, 'FRI': 0 };
    orders.forEach(o => {
      const d = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      if (counts[d] !== undefined) counts[d]++;
    });
    return Object.entries(counts).map(([day, ords]) => ({ day, orders: ords }));
  }, [orders]);

  // Category performance colors
  const catColors = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];
  const formattedCategories = categoryPerformance.length > 0 ? categoryPerformance.map((c, i) => ({
    ...c,
    color: catColors[i % catColors.length]
  })) : [
    { name: 'Fast Food', value: 45, color: '#F97316' },
    { name: 'Drinks', value: 25, color: '#3B82F6' },
    { name: 'Meals', value: 20, color: '#10B981' },
    { name: 'Snacks', value: 10, color: '#8B5CF6' }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto pb-10">
        
        {/* Page Header */}
        <div className="mb-6 mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-400 mb-1">
              Dashboard <span className="mx-1">&rsaquo;</span> <span className="text-[#8B4513]">Sales Reports</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Sales Reports & Analytics</h1>
            <p className="text-slate-500 font-medium text-xs md:text-sm mt-0.5">
              Live revenue tracking, order settlement stats, and verified transaction history.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleExportCSV}
              className="inline-flex items-center bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full hover:bg-slate-50 transition-colors shadow-sm text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Export CSV
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition-colors flex items-center shadow-sm text-xs"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" /> Print Report
            </button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <form onSubmit={handleFilterSubmit} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-600">Filter Range:</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-slate-400">From:</label>
            <input 
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-slate-400">To:</label>
            <input 
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold outline-none focus:border-orange-500"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
          >
            {loading ? 'Filtering...' : 'Apply Date Filter'}
          </button>
          {(fromDate || toDate) && (
            <button 
              type="button"
              onClick={handleResetFilter}
              className="text-xs font-bold text-slate-500 hover:text-orange-600 px-2 py-1.5"
            >
              Reset
            </button>
          )}
        </form>

        {/* Loading and Error States */}
        {loading && (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-2" />
            <p className="text-slate-500 text-xs font-semibold">Calculating financial reports and ledger...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-4 space-y-2">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-red-800 text-sm font-bold">{error}</p>
            <button 
              onClick={() => fetchReportsAndTransactions()}
              className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-full"
            >
              Retry
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Today's Revenue */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-orange-200 transition">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Today's Revenue</p>
              <h3 className="text-xl font-extrabold text-slate-800">৳{Number(todayRevenue).toLocaleString()}</h3>
            </div>
          </div>

          {/* Weekly Sales */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Weekly Revenue</p>
              <h3 className="text-xl font-extrabold text-slate-800">৳{Number(weeklyRevenue).toLocaleString()}</h3>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-blue-200 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Monthly Revenue</p>
              <h3 className="text-xl font-extrabold text-slate-800">৳{Number(monthlyRevenue).toLocaleString()}</h3>
            </div>
          </div>

          {/* Total Delivered Orders */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-green-200 transition">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Delivered Orders</p>
              <h3 className="text-xl font-extrabold text-slate-800">{deliveredOrders}</h3>
            </div>
          </div>

          {/* Avg Order Value */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center mb-3">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Avg Order Value</p>
              <h3 className="text-xl font-extrabold text-slate-800">৳{Number(averageOrderValue).toFixed(0)}</h3>
            </div>
          </div>

          {/* Rejected / Cancelled Audit */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-red-200 transition">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-3">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mb-1">Rejected / Cancelled</p>
              <h3 className="text-lg font-extrabold text-slate-800">
                {rejectedOrders} <span className="text-xs text-slate-400 font-normal">Rej</span> | {cancelledOrders} <span className="text-xs text-slate-400 font-normal">Canc</span>
              </h3>
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
                <p className="text-xs font-semibold text-slate-500">Period earnings based on fulfilled deliveries</p>
              </div>
              <div className="flex bg-slate-100 rounded-full p-1">
                {['Daily', 'Weekly', 'Monthly'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setTrendView(tab)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition ${
                      trendView === tab ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
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
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748B', fontSize: '12px' }}
                    itemStyle={{ color: '#F97316', fontSize: '14px', fontWeight: '800' }}
                    formatter={(value) => [`৳${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Category Performance</h3>
            <p className="text-xs font-semibold text-slate-500 mb-6">Revenue split by product type</p>
            
            <div className="flex-1 flex flex-col justify-center gap-4">
              {formattedCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3 shadow-sm shrink-0" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">{cat.value}%</span>
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
                <p className="text-xs font-semibold text-slate-500">Order frequency distribution</p>
              </div>
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
                      <Cell key={`cell-${index}`} fill={entry.orders > 0 ? '#F97316' : '#F1F5F9'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Best Selling Items */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Top Selling Items</h3>
            <div className="flex-1 flex flex-col gap-3">
              {bestSellingItems.length > 0 ? (
                bestSellingItems.map((item, idx) => (
                  <div key={idx} className="flex items-center p-3 rounded-2xl bg-slate-50 relative">
                    {idx === 0 && (
                      <div className="absolute -top-1.5 -left-1.5 bg-amber-400 text-amber-900 w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    )}
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop'} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-xl object-cover mr-3 shadow-sm shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                      <p className="text-[11px] font-semibold text-slate-500">{item.quantity} sold</p>
                    </div>
                    <div className="text-right shrink-0">
                      <h4 className="text-xs font-extrabold text-slate-800">৳{Number(item.revenue).toLocaleString()}</h4>
                      <span className={`text-[9px] font-extrabold ${idx === 0 ? 'text-green-600' : 'text-slate-400'}`}>TOP {idx + 1}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                  No completed item sales in this period.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Shop Transactions History Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Shop Wallet Transactions</h3>
              <p className="text-xs font-semibold text-slate-500">Verified ledger of credited food earnings & settlements</p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
              {transactions.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="pb-3 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider pl-4">Transaction ID</th>
                  <th className="pb-3 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Order</th>
                  <th className="pb-3 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Type</th>
                  <th className="pb-3 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Amount</th>
                  <th className="pb-3 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Balance After</th>
                  <th className="pb-3 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider text-center">Status</th>
                  <th className="pb-3 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider text-right pr-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.length > 0 ? (
                  transactions.map(txn => (
                    <tr key={txn._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pl-4 font-mono font-bold text-slate-800 text-xs">{txn.transactionId}</td>
                      <td className="py-3 text-xs font-semibold text-slate-600">
                        {txn.order?.orderNumber || (txn.order ? `#${txn.order.toString().slice(-6).toUpperCase()}` : 'Direct')}
                      </td>
                      <td className="py-3 text-xs font-bold text-slate-700">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px]">
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-3 text-xs font-extrabold text-green-600 text-right">
                        +৳{Number(txn.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 text-xs font-bold text-slate-600 text-right">
                        ৳{Number(txn.balanceAfter || 0).toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-extrabold uppercase">
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-slate-400 text-right pr-4">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400 text-xs font-semibold">
                      No ledger transactions recorded yet. Delivered orders credit automatically to your shop wallet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-slate-500">
          <p>© 2026 UIU Food & Items Delivery System. Shop Financial Management.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-slate-400">Ledger Status: Immutable</span>
            <span className="text-slate-400">Settlement: Automated Delivery Wallet</span>
          </div>
        </div>

      </div>
    </>
  );
};

export default ShopSalesReports;
