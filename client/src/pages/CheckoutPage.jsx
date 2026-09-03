import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, MapPin, Phone, Clock, CreditCard, Wallet, 
  Banknote, ShoppingCart, ArrowRight 
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // Mock Cart Data
  const cart = [
    { id: 'cart-1', name: 'Chicken Burger', price: 180, quantity: 1 },
    { id: 'cart-2', name: 'French Fries', price: 80, quantity: 1 }
  ];
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 25;
  const total = subtotal + deliveryFee;

  const handleCheckout = (e) => {
    e.preventDefault();
    // In a real app, process payment and send order here
    navigate('/order-success');
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm font-medium text-slate-500 mb-6">
        <Link to="/dashboard/student" className="hover:text-orange-500 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to="/dashboard/student/shops" className="hover:text-orange-500 transition-colors">Browse Shops</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-orange-600 font-bold">Checkout</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column - Forms */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6 tracking-tight">Checkout Details</h2>
          
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
            
            {/* Delivery Details */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4" />
                </div>
                Delivery Address
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Campus Building <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 font-medium appearance-none bg-white">
                    <option value="">Select Building</option>
                    <option value="main">Main Building</option>
                    <option value="admin">Admin Block</option>
                    <option value="library">Library</option>
                    <option value="cafe">Cafeteria Area</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Room / Floor <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g., Room 402, 4th Floor" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Contact Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="01XXXXXXXXX" 
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Delivery Instructions (Optional)</label>
                  <textarea 
                    rows="2"
                    placeholder="e.g., Call me when you reach the elevator..." 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 font-medium resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-3">
                  <Clock className="w-4 h-4" />
                </div>
                Delivery Time
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'asap' ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}>
                  <div className="flex items-center">
                    <input type="radio" name="deliveryTime" defaultChecked className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300" />
                    <span className="ml-3 font-bold text-slate-800">Deliver Now</span>
                  </div>
                  <p className="mt-1 ml-7 text-xs text-slate-500">Usually 15-20 minutes</p>
                </label>
                
                <label className="border-2 border-slate-100 rounded-2xl p-4 cursor-pointer hover:border-orange-200 transition-all opacity-60">
                  <div className="flex items-center">
                    <input type="radio" name="deliveryTime" disabled className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300" />
                    <span className="ml-3 font-bold text-slate-800">Schedule (Unavailable)</span>
                  </div>
                  <p className="mt-1 ml-7 text-xs text-slate-500">Pick a specific time</p>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                  <Wallet className="w-4 h-4" />
                </div>
                Payment Method
              </h3>
              
              <div className="space-y-4">
                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300" />
                  <Banknote className="w-6 h-6 ml-4 text-slate-500" />
                  <div className="ml-3">
                    <p className="font-bold text-slate-800 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-slate-500">Pay when you receive your order</p>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'bkash' ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300" />
                  {/* Fake bKash icon with Tailwind */}
                  <div className="ml-4 w-6 h-6 rounded-md bg-pink-600 text-white font-bold text-[10px] flex items-center justify-center">bK</div>
                  <div className="ml-3">
                    <p className="font-bold text-slate-800 text-sm">bKash</p>
                    <p className="text-xs text-slate-500">Pay securely via mobile banking</p>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300" />
                  <CreditCard className="w-6 h-6 ml-4 text-slate-500" />
                  <div className="ml-3">
                    <p className="font-bold text-slate-800 text-sm">Credit / Debit Card</p>
                    <p className="text-xs text-slate-500">Visa, MasterCard, Amex</p>
                  </div>
                </label>
              </div>
            </div>

          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-4 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            
            <div className="bg-orange-500 p-5 flex items-center text-white">
              <ShoppingCart className="w-5 h-5 mr-3" />
              <h3 className="font-bold text-lg">Order Summary</h3>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Chef's Table</h4>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex items-start text-slate-800">
                      <span className="bg-slate-100 text-slate-600 font-bold text-xs px-2 py-1 rounded mr-3">{item.quantity}x</span>
                      <span className="font-medium leading-tight">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-5 bg-slate-50 border-t border-slate-100">
              <div className="space-y-2 text-sm text-slate-500 font-medium border-b border-slate-200 border-dashed pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-slate-800">৳{deliveryFee}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-6">
                <span className="text-slate-800 font-bold">Total to Pay</span>
                <span className="text-2xl font-extrabold text-orange-600">৳{total}</span>
              </div>
              
              <button 
                type="submit" 
                form="checkout-form"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center group"
              >
                Confirm Order <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </>
  );
}
