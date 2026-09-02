import React, { useState } from 'react';
import { 
  Package, Calendar, CircleDollarSign, Heart, 
  Calendar as CalendarIcon, Download, RotateCcw, 
  ChefHat, Navigation, ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import ordersData from '../data/myOrders.json';

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState('All Orders');
  const tabs = ['All Orders', 'Completed', 'Active', 'Cancelled'];

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumbs & Header */}
        <div className="mb-6">
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
            <Link to="/dashboard/student" className="hover:text-orange-500 transition-colors">Dashboard</Link>
            <span className="mx-2">›</span>
            <span className="text-orange-600 font-bold">My Orders</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Order History</h1>
          <p className="text-slate-500 text-sm mt-1">View, manage, and reorder your previous campus purchases.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Total Orders</p>
              <h3 className="text-3xl font-light text-slate-800">42</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#9B5110] flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Orders This Month</p>
              <h3 className="text-3xl font-light text-slate-800">12</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center mb-4">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Total Credits Spent</p>
              <h3 className="text-3xl font-light text-slate-800">৳8,450</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Favorite Shop</p>
              <h3 className="text-xl font-medium text-slate-800">Chef's Table</h3>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex overflow-x-auto w-full md:w-auto no-scrollbar space-x-2 p-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="w-full md:w-64 relative px-2 md:px-0">
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by date range" 
              className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-colors text-slate-600"
            />
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {ordersData.map(order => (
            <div 
              key={order.id} 
              className={`bg-white rounded-3xl p-5 border shadow-sm transition-all flex flex-col sm:flex-row gap-6 ${
                order.status === 'preparing' 
                  ? 'border-orange-500 shadow-orange-500/10' 
                  : order.status === 'cancelled'
                    ? 'border-slate-100 opacity-75 grayscale-[0.3]'
                    : 'border-slate-100'
              }`}
            >
              
              {/* Image Section */}
              <div className="w-full sm:w-48 h-48 sm:h-auto rounded-2xl overflow-hidden relative flex-shrink-0">
                <img src={order.image} alt={order.shopName} className="w-full h-full object-cover" />
                
                {order.imageBadge && (
                  <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded text-[10px] font-extrabold text-slate-800 tracking-wider">
                    {order.imageBadge}
                  </div>
                )}
                
                {order.imageBadgeIcon === 'chef-hat' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#9B5110]">
                    <ChefHat className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="flex-1 flex flex-col py-1">
                
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-800">{order.shopName}</h3>
                    {order.status === 'delivered' && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Delivered</span>}
                    {order.status === 'preparing' && <span className="bg-orange-100 text-orange-600 flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>Preparing</span>}
                    {order.status === 'cancelled' && <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Cancelled</span>}
                  </div>
                  <span className={`text-2xl font-light ${order.status === 'cancelled' ? 'text-slate-400' : 'text-[#9B5110]'}`}>
                    ৳{order.price}
                  </span>
                </div>
                
                <div className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-4">
                  <span>{order.id}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>{order.date}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 flex-1">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="bg-[#F9FAFB] text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-100">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-auto">
                  <Link to="#" className="text-sm font-semibold text-slate-500 hover:text-slate-800 px-4 py-2 transition-colors">
                    View Details
                  </Link>
                  
                  {order.status === 'delivered' && (
                    <>
                      <button className="flex items-center text-sm font-bold text-[#9B5110] border border-[#9B5110]/30 hover:bg-[#9B5110]/5 px-4 py-2.5 rounded-xl transition-colors">
                        <Download className="w-4 h-4 mr-2" /> Receipt
                      </button>
                      <button className="flex items-center text-sm font-bold text-white bg-[#9B5110] hover:bg-[#8A480E] px-6 py-2.5 rounded-xl transition-colors shadow-md">
                        <RotateCcw className="w-4 h-4 mr-2" /> Reorder
                      </button>
                    </>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button className="flex items-center text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-6 py-2.5 rounded-xl transition-colors shadow-md">
                      <Navigation className="w-4 h-4 mr-2" /> Track Order
                    </button>
                  )}
                  
                  {order.status === 'cancelled' && (
                    <button className="flex items-center text-sm font-bold text-[#9B5110] border border-[#9B5110]/30 hover:bg-[#9B5110]/5 px-6 py-2.5 rounded-xl transition-colors">
                      <RotateCcw className="w-4 h-4 mr-2" /> Reorder
                    </button>
                  )}
                </div>
                
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 pb-8 gap-4 text-sm text-slate-500">
          <p>Showing 1-3 of 42 orders</p>
          <div className="flex items-center gap-1.5">
            <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-[#9B5110] text-white font-bold flex items-center justify-center shadow-md">
              1
            </button>
            <button className="w-9 h-9 rounded-lg border border-slate-200 text-slate-700 font-medium flex items-center justify-center hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="w-9 h-9 rounded-lg border border-slate-200 text-slate-700 font-medium flex items-center justify-center hover:bg-slate-50 transition-colors">
              3
            </button>
            <div className="w-9 h-9 flex items-center justify-center text-slate-400">
              <MoreHorizontal className="w-4 h-4" />
            </div>
            <button className="w-9 h-9 rounded-lg border border-slate-200 text-slate-700 font-medium flex items-center justify-center hover:bg-slate-50 transition-colors">
              14
            </button>
            <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}

// Simple clock icon component to avoid adding more imports if not needed, but we can just import Clock from lucide. Let's fix that.
function ClockIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}
