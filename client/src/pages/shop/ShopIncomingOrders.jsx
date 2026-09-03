import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, Utensils, ShoppingBag, CheckCircle2,
  BellRing, CheckCircle, Banknote, XCircle, 
  ChevronDown, Truck, FileText, Radio, Eye
} from 'lucide-react';
import shopOrdersData from '../../data/shopOrdersData.json';

export default function ShopIncomingOrders() {
  const { metrics, priorityOrder, ordersList, liveActivity } = shopOrdersData;

  return (
    <>
      <div className="max-w-[1400px] mx-auto space-y-8 pt-4">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Incoming Orders</h1>
          <p className="text-slate-500 font-medium mt-1">Review, accept, reject, and manage student food orders.</p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 border-l-4 border-l-orange-500">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">New Orders</p>
              <h3 className="text-4xl font-extrabold text-slate-800">{metrics.newOrders}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-blue-600">In Kitchen</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Preparing</p>
              <h3 className="text-4xl font-extrabold text-slate-800">{metrics.preparing < 10 ? `0${metrics.preparing}` : metrics.preparing}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 border-l-4 border-l-slate-400">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500">Waiting</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Ready for Pickup</p>
              <h3 className="text-4xl font-extrabold text-slate-800">{metrics.readyForPickup < 10 ? `0${metrics.readyForPickup}` : metrics.readyForPickup}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 border-l-4 border-l-slate-800">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Today</span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Completed Today</p>
              <h3 className="text-4xl font-extrabold text-slate-800">{metrics.completedToday}</h3>
            </div>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-6">Workflow Timeline</p>
          <div className="flex items-center justify-between relative max-w-4xl mx-auto">
            {/* Connecting lines */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center bg-white px-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white">
                {metrics.newOrders}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-3">New Orders</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center bg-white px-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white">
                0{metrics.preparing}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-3">Preparing</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center bg-white px-4">
              <div className="w-10 h-10 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold shadow-md ring-4 ring-white">
                0{metrics.readyForPickup}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-3">Ready for Pickup</span>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center bg-white px-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white">
                {metrics.completedToday}
              </div>
              <span className="text-sm font-bold text-slate-800 mt-3">Completed</span>
            </div>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Orders List */}
          <div className="flex-1 min-w-0 flex flex-col">
            
            {/* Priority Order Alert Card */}
            <div className="bg-[#FFF8F1] rounded-2xl border border-orange-200 p-6 flex flex-col xl:flex-row xl:items-center justify-between mb-6 shadow-sm">
              <div className="flex items-start mb-4 xl:mb-0">
                <div className="w-12 h-12 rounded-xl bg-white text-orange-500 flex items-center justify-center shadow-sm mr-4 flex-shrink-0">
                  <BellRing className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Order {priorityOrder.orderId}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-sm font-medium text-slate-600">Student: {priorityOrder.student} <span className="mx-1">•</span></span>
                    {priorityOrder.isAsap && (
                      <span className="bg-[#8A5A19] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider">ASAP</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8 bg-[#FFF1E0] sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none">
                <div className="text-center xl:text-right">
                  <h4 className="text-2xl font-extrabold text-orange-600">{priorityOrder.total} BDT</h4>
                  <p className="text-xs font-bold text-slate-500 w-32 truncate" title={priorityOrder.items}>{priorityOrder.items}</p>
                </div>
                <div className="flex space-x-3 w-full sm:w-auto">
                  <Link to={`/dashboard/shop/orders/${priorityOrder.orderId.replace('#', '')}`} className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm whitespace-nowrap text-center">
                    View Details
                  </Link>
                  <button className="flex-1 sm:flex-none bg-white text-red-600 border border-red-200 hover:bg-red-50 font-bold py-3 px-6 rounded-xl transition-colors shadow-sm whitespace-nowrap">
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
              
              {/* Filters Header */}
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex space-x-3">
                  <button className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center">
                    Status: All <ChevronDown className="w-3 h-3 ml-2" />
                  </button>
                  <button className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center">
                    Sort: Newest <ChevronDown className="w-3 h-3 ml-2" />
                  </button>
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Showing 12 active incoming orders
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b-2 border-slate-100 bg-[#F9FAFB]">
                      <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider pl-6">Order ID</th>
                      <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Student</th>
                      <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Items</th>
                      <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-right">Value</th>
                      <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-center">Payment</th>
                      <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-right">Placed</th>
                      <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-center">Status</th>
                      <th className="py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-center pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {ordersList.map((order, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-5 pl-6 font-bold text-slate-800 text-sm whitespace-nowrap">{order.orderId}</td>
                        <td className="py-5 whitespace-nowrap">
                          <p className="text-sm font-bold text-slate-700">{order.studentName}</p>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">ID: {order.studentId}</p>
                        </td>
                        <td className="py-5">
                          <p className="text-xs font-semibold text-slate-600 max-w-[120px] leading-tight">{order.items}</p>
                        </td>
                        <td className="py-5 text-right whitespace-nowrap">
                          <p className="text-sm font-extrabold text-slate-800">{order.value}</p>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase">BDT</p>
                        </td>
                        <td className="py-5 text-center whitespace-nowrap">
                          {order.payment === 'Paid' && (
                            <span className="inline-flex items-center text-xs font-bold text-cyan-600">
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Paid
                            </span>
                          )}
                          {order.payment === 'COD' && (
                            <span className="inline-flex items-center text-xs font-bold text-slate-600">
                              <Banknote className="w-3.5 h-3.5 mr-1.5" /> COD
                            </span>
                          )}
                          {order.payment === 'Failed' && (
                            <span className="inline-flex items-center text-xs font-bold text-red-500">
                              <XCircle className="w-3.5 h-3.5 mr-1.5" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="py-5 text-right whitespace-nowrap">
                          <p className="text-xs font-semibold text-slate-400">{order.placed}</p>
                        </td>
                        <td className="py-5 text-center whitespace-nowrap">
                          {order.status === 'NEW' && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-extrabold rounded-full uppercase tracking-wider">NEW</span>
                          )}
                          {order.status === 'PREPARING' && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-extrabold rounded-full uppercase tracking-wider">PREPARING</span>
                          )}
                          {order.status === 'READY' && (
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-500 text-[10px] font-extrabold rounded-full uppercase tracking-wider">READY</span>
                          )}
                          {order.status === 'COMPLETED' && (
                            <span className="px-3 py-1 bg-slate-700 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">COMPLETED</span>
                          )}
                          {order.status === 'REJECTED' && (
                            <span className="px-3 py-1 bg-red-100 text-red-500 text-[10px] font-extrabold rounded-full uppercase tracking-wider">REJECTED</span>
                          )}
                        </td>
                        <td className="py-5 pr-6 text-center whitespace-nowrap">
                          <Link to={`/dashboard/shop/orders/${order.orderId.replace('#', '')}`} className="text-orange-500 hover:text-orange-600 transition-colors inline-block">
                            <Eye className="w-5 h-5 mx-auto" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-[#F9FAFB] mt-auto">
                <button className="text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors">Previous</button>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 rounded-lg bg-orange-500 text-white font-bold text-sm shadow-sm">1</button>
                  <button className="w-8 h-8 rounded-lg bg-transparent text-slate-600 hover:bg-slate-200 font-bold text-sm transition-colors">2</button>
                  <button className="w-8 h-8 rounded-lg bg-transparent text-slate-600 hover:bg-slate-200 font-bold text-sm transition-colors">3</button>
                </div>
                <button className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">Next</button>
              </div>
            </div>

          </div>

          {/* Right Column - Live Activity */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl mb-6">
                <h2 className="text-sm font-bold text-slate-800 flex items-center">
                  <Radio className="w-4 h-4 mr-2 text-orange-500" /> Live Activity
                </h2>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              </div>

              <div className="space-y-6 relative">
                {/* Connecting Line for Timeline */}
                <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-100 z-0"></div>

                {liveActivity.map((activity, idx) => (
                  <div key={idx} className="flex relative z-10">
                    <div className="mr-4 flex-shrink-0">
                      {activity.type === 'new_order' && (
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center border-4 border-white shadow-sm">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      )}
                      {activity.type === 'runner' && (
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border-4 border-white shadow-sm">
                          <Truck className="w-4 h-4" />
                        </div>
                      )}
                      {activity.type === 'note' && (
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center border-4 border-white shadow-sm">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                      {activity.type === 'payment' && (
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center border-4 border-white shadow-sm">
                          <Banknote className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="pt-1 pb-2">
                      <h4 className="text-sm font-bold text-slate-800 mb-0.5">{activity.title}</h4>
                      <p className="text-xs font-semibold text-slate-500 mb-1">{activity.description}</p>
                      <p className="text-[9px] font-extrabold text-orange-500 uppercase tracking-wider">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
