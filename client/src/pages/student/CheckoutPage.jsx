import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, MapPin, Phone, Clock, Wallet, 
  ShoppingCart, ArrowRight, ShoppingBag, AlertTriangle, 
  Plus, CheckCircle2, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import TopUpModal from '../../components/wallet/TopUpModal';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, token, updateUserWallet, refreshUser } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  
  const [building, setBuilding] = useState('Academic Building');
  const [room, setRoom] = useState('Room 412, 4th Floor');
  const [phone, setPhone] = useState(user?.phone || '01712987654');
  const [instructions, setInstructions] = useState('');
  
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const deliveryFee = cart.length > 0 ? 25 : 0;
  const total = cartTotal + deliveryFee;
  const walletBalance = user?.walletBalance || 0;
  const hasSufficientFunds = walletBalance >= total;
  const shortageAmount = total - walletBalance;

  useEffect(() => {
    // Refresh user balance on page load to ensure accuracy
    refreshUser();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (!hasSufficientFunds) {
      setCheckoutError(`Insufficient Campus Wallet balance! Please top up at least ৳${shortageAmount} to proceed.`);
      setIsTopUpOpen(true);
      return;
    }

    if (cart.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine Shop ID from cart items
      let shopId = cart[0]?.shopId || cart[0]?.shop;
      
      // If shopId is missing or not a 24-char hex MongoDB ID, query the first campus shop
      if (!shopId || !/^[0-9a-fA-F]{24}$/.test(String(shopId))) {
        try {
          const shopsRes = await fetch('/api/shops');
          const shopsData = await shopsRes.json();
          if (shopsData.shops && shopsData.shops.length > 0) {
            shopId = shopsData.shops[0]._id;
          }
        } catch (e) {
          console.warn('Failed to resolve shopId:', e);
        }
      }

      const orderPayload = {
        shopId,
        items: cart.map(item => ({
          menuItem: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          note: item.note || ''
        })),
        deliveryAddress: {
          building,
          room,
          dropOffNote: instructions
        },
        specialInstructions: instructions
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('uiu_auth_token')}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to complete in-app purchase');
      }

      // Update local wallet balance in context
      if (data.remainingBalance !== undefined) {
        updateUserWallet(data.remainingBalance);
      }
      await refreshUser();

      clearCart();
      navigate('/order-success', { 
        state: { 
          order: data.order,
          remainingBalance: data.remainingBalance 
        } 
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'An error occurred during in-app purchase. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-6">Add delicious food items from campus shops before proceeding to checkout.</p>
        <Link 
          to="/dashboard/student/shops"
          className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-md shadow-orange-500/20"
        >
          Browse Campus Shops
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm font-medium text-slate-500 mb-6">
        <Link to="/dashboard/student" className="hover:text-orange-500 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to="/dashboard/student/shops" className="hover:text-orange-500 transition-colors">Browse Shops</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-orange-600 font-bold">In-App Checkout</span>
      </div>

      {checkoutError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span className="font-medium">{checkoutError}</span>
          </div>
          {!hasSufficientFunds && (
            <button
              onClick={() => setIsTopUpOpen(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors ml-4 flex-shrink-0"
            >
              + Top Up ৳{shortageAmount}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column - Forms */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Checkout Details</h2>
            <span className="text-xs bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Campus In-App Purchase
            </span>
          </div>
          
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
                  <select 
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 font-medium appearance-none bg-white"
                  >
                    <option value="Academic Building">Academic Building</option>
                    <option value="Admin Block">Admin Block</option>
                    <option value="Library">Library</option>
                    <option value="Cafeteria Area">Cafeteria Area</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Room / Floor <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g., Room 402, 4th Floor" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Student Contact Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g., Call me when you reach the elevator..." 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 font-medium resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Exclusive Payment Method - In-App Campus Wallet */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                    <Wallet className="w-4 h-4" />
                  </div>
                  Payment Method
                </h3>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                  Direct In-App Wallet
                </span>
              </div>
              
              {/* Campus Wallet Card */}
              <div className={`p-5 rounded-2xl border-2 transition-all ${
                hasSufficientFunds 
                  ? 'border-orange-500/80 bg-gradient-to-br from-orange-50/60 to-amber-50/40' 
                  : 'border-red-300 bg-red-50/40'
              }`}>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/60">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 mr-3.5 flex-shrink-0">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">UIU Campus Digital Wallet</h4>
                      <p className="text-xs text-slate-500">In-App Purchase Balance (Instant Settlement)</p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right w-full sm:w-auto">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Balance</p>
                    <p className={`text-xl font-black ${hasSufficientFunds ? 'text-slate-900' : 'text-red-600'}`}>
                      ৳ {walletBalance}.00
                    </p>
                  </div>
                </div>

                {/* Status Evaluation */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  {hasSufficientFunds ? (
                    <div className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 flex-shrink-0" />
                      Sufficient funds! ৳{walletBalance - total}.00 will remain after purchase.
                    </div>
                  ) : (
                    <div className="flex items-center text-xs font-semibold text-red-700 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                      <AlertTriangle className="w-4 h-4 mr-1.5 text-red-500 flex-shrink-0" />
                      Insufficient balance! Short by ৳{shortageAmount}.00
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsTopUpOpen(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Top Up Wallet
                  </button>
                </div>

              </div>

              <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Closed-Loop Campus Safety:</strong> Food subtotal goes directly to the shop vendor, delivery reward (৳20) is credited to the student runner upon completion, and ৳5 platform fee is collected by UIU portal.
                </span>
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
            
            <div className="p-5 flex-1 overflow-y-auto max-h-60">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Selected Items</h4>
              <div className="space-y-4 mb-2">
                {cart.map(item => (
                  <div key={item.id || item._id} className="flex justify-between items-start text-sm">
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
                  <span>Food Subtotal</span>
                  <span className="text-slate-800">৳{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Campus Delivery Fee</span>
                  <span className="text-slate-800">৳{deliveryFee}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-slate-500 text-xs font-semibold block">Total In-App Deducted</span>
                  <span className="text-slate-800 font-bold text-base">Grand Total</span>
                </div>
                <span className="text-2xl font-extrabold text-orange-600">৳{total}</span>
              </div>
              
              <button 
                type="submit" 
                form="checkout-form"
                disabled={isSubmitting || !hasSufficientFunds}
                className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center group ${
                  hasSufficientFunds && !isSubmitting
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing Purchase...
                  </>
                ) : hasSufficientFunds ? (
                  <>
                    Pay ৳{total} via Wallet <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    Insufficient Balance (Need +৳{shortageAmount})
                  </>
                )}
              </button>

              {!hasSufficientFunds && (
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(true)}
                  className="w-full mt-3 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs rounded-xl border border-orange-200 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Top Up ৳{shortageAmount} to Enable Checkout
                </button>
              )}
            </div>
            
          </div>
        </div>

      </div>

      {/* Top Up Modal */}
      <TopUpModal 
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={() => setCheckoutError('')}
      />
    </>
  );
}
