import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';import { 
  Check, Clock, MapPin, Phone, MessageSquare, PhoneCall,
  Info, FileText, ChevronRight, BellRing, ChefHat, Package, CheckCircle2, XCircle
} from 'lucide-react';
import shopOrdersData from '../../data/shopOrdersData.json';

const ShopOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = shopOrdersData.orderDetails;

  return (
    <>
      <div className="max-w-6xl mx-auto pb-10">
        
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
            <Link to="/dashboard/shop" className="hover:text-slate-800 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/dashboard/shop/orders" className="hover:text-slate-800 transition-colors">Incoming Orders</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-slate-800 font-bold">Order Details</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
          <p className="text-slate-500 font-medium">Review the student's order before confirming preparation.</p>
        </div>

        {/* Timeline Progress */}
        <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between relative">
            {/* Background Line */}
            <div className="absolute left-[10%] right-[10%] top-6 h-0.5 bg-slate-100 -z-10"></div>
            
            {/* Step 1: Placed */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm mb-3">
                <Check className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-700">Order Placed</span>
            </div>

            {/* Step 2: Confirmation */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shadow-[0_0_0_4px_white,0_0_0_5px_#f97316] mb-3">
                <BellRing className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-orange-500">Shop Confirmation</span>
            </div>

            {/* Step 3: Preparing */}
            <div className="flex flex-col items-center flex-1 opacity-40">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-500">Preparing</span>
            </div>

            {/* Step 4: Ready */}
            <div className="flex flex-col items-center flex-1 opacity-40">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-500">Ready for Pickup</span>
            </div>

            {/* Step 5: Delivered */}
            <div className="flex flex-col items-center flex-1 opacity-40">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-500">Delivered</span>
            </div>
          </div>
        </div>

        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Order Items & Summary */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Order Header Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 flex justify-between items-center border-l-[6px] border-l-orange-500">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h2 className="text-xl font-bold text-slate-800">Order ID {order.orderId}</h2>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-extrabold rounded-full uppercase tracking-wider">{order.status}</span>
                </div>
                <p className="text-sm font-semibold text-slate-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" /> Placed at {order.placedAt}
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-extrabold text-orange-500 mb-1">{order.billing.subtotal} BDT</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">{order.paymentStatus}</span>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 mb-6 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Ordered Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-4 px-6 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Item Name</th>
                      <th className="py-4 px-6 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-center">Quantity</th>
                      <th className="py-4 px-6 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">Unit Price</th>
                      <th className="py-4 px-6 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover mr-4 shadow-sm" />
                            <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-700">x{item.quantity}</td>
                        <td className="py-4 px-6 text-right font-semibold text-slate-600">{item.unitPrice} BDT</td>
                        <td className="py-4 px-6 text-right font-extrabold text-slate-800">{item.subtotal} BDT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Billing Summary */}
              <div className="p-6 bg-slate-50 flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Subtotal</span>
                    <span>{order.billing.subtotal} BDT</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Delivery Fee</span>
                    <span>{order.billing.deliveryFee} BDT</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Discount</span>
                    <span className="text-red-500">{order.billing.discount} BDT</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-800">
                    <span>Grand Total</span>
                    <span className="text-orange-500">{order.billing.grandTotal} BDT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-[#FFF8F1] rounded-2xl border-2 border-dashed border-orange-300 p-6 flex flex-col justify-center">
              <div className="flex items-center text-orange-500 font-bold mb-2">
                <FileText className="w-5 h-5 mr-2" />
                Special Instructions
              </div>
              <p className="text-orange-700 italic font-medium">{order.specialInstructions}</p>
            </div>

          </div>

          {/* Right Column - Student & Actions */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
            
            {/* Student Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-full text-left mb-6 font-bold text-slate-800 text-sm">Student Information</div>
              <img src={order.student.avatar} alt={order.student.name} className="w-24 h-24 rounded-full object-cover shadow-sm mb-4" />
              <h3 className="text-lg font-bold text-slate-800">{order.student.name}</h3>
              <p className="text-xs font-semibold text-slate-400 mb-6">ID: {order.student.id}</p>
              
              <div className="w-full bg-slate-50 rounded-2xl p-4 flex items-start mb-3 border border-slate-100">
                <MapPin className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-700">{order.student.location}</p>
                  <p className="text-xs font-semibold text-slate-500">{order.student.room}</p>
                </div>
              </div>
              
              <div className="w-full bg-slate-50 rounded-2xl p-4 flex items-center mb-6 border border-slate-100">
                <Phone className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                <p className="text-sm font-bold text-slate-700">{order.student.phone}</p>
              </div>

              <div className="w-full flex gap-3">
                <button className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center">
                  <MessageSquare className="w-4 h-4 mr-2" /> Chat
                </button>
                <button className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center">
                  <PhoneCall className="w-4 h-4 mr-2" /> Call
                </button>
              </div>
            </div>

            {/* Order Actions Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="font-bold text-slate-800 text-sm mb-4">Order Actions</div>
              
              <button
  onClick={() =>
    navigate(`/dashboard/shop/orders/${orderId}/preparing`)
  }
  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors mb-4 flex justify-center items-center shadow-sm"
>
  <CheckCircle2 className="w-5 h-5 mr-2" />
  Accept Order
</button>
              
              <button className="w-full bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold py-4 px-6 rounded-xl transition-colors mb-4 flex justify-center items-center shadow-sm">
                <XCircle className="w-5 h-5 mr-2" /> Reject Order
              </button>
              
              <button className="w-full bg-slate-100 text-slate-400 font-bold py-4 px-6 rounded-xl mb-6 flex justify-center items-center cursor-not-allowed">
                <ChefHat className="w-5 h-5 mr-2" /> Mark as Preparing
              </button>
              
              <div className="flex items-start text-xs font-semibold text-slate-500">
                <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <p>Accept order within 5 mins to maintain shop rating</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopOrderDetails;
