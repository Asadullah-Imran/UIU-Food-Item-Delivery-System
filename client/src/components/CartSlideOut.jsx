import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartSlideOut() {
  const { 
    cart, 
    cartTotal, 
    cartItemCount, 
    isCartVisible, 
    setIsCartVisible,
    updateQuantity,
    removeFromCart 
  } = useCart();
  const navigate = useNavigate();

  if (!isCartVisible) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartVisible(false)}
      />

      {/* Slide-out panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isCartVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mr-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-none">Your Cart</h2>
              <p className="text-sm font-semibold text-slate-500 mt-1">{cartItemCount} items</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCartVisible(false)}
            className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">Your cart is empty</h3>
              <p className="text-sm text-slate-500">Looks like you haven't added anything yet.</p>
              <button 
                onClick={() => setIsCartVisible(false)}
                className="mt-6 px-6 py-2.5 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-white border border-slate-100 p-3 rounded-2xl shadow-sm hover:border-orange-200 transition-colors">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-orange-500 mb-2">৳{item.price}</p>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-slate-100 p-6 bg-slate-50/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="font-bold text-slate-800">৳{cartTotal}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-sm">
              <span className="text-slate-500">Delivery Fee</span>
              <span className="font-semibold text-slate-700">Calculated at checkout</span>
            </div>
            
            <button 
              onClick={() => {
                setIsCartVisible(false);
                navigate('/checkout');
              }}
              className="w-full flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center">
                <span className="mr-2">৳{cartTotal}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
