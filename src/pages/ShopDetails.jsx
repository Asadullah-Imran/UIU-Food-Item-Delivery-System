import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Clock, Truck, Plus, Minus, ChevronRight, ShoppingCart, ArrowRight } from 'lucide-react';
import StudentLayout from '../components/StudentLayout';

// Mock Data
import shopsData from '../data/shops.json';
import menuData from '../data/menu.json';
import reviewsData from '../data/reviews.json';

export default function ShopDetails() {
  const { shopId } = useParams();
  
  // Find shop, default to Chef's Table if not found
  const shop = shopsData.find(s => s.id === shopId) || shopsData[0];
  
  // Get menu items for this shop
  const popularItems = menuData.filter(item => item.shopId === shop.id && item.category === "Popular");
  const snacksItems = menuData.filter(item => item.shopId === shop.id && item.category === "Snacks & Sides");
  const reviews = reviewsData.filter(r => r.shopId === shop.id);

  const categories = ["Popular", "Meals", "Snacks", "Drinks", "Desserts"];

  // Cart State (mock)
  const [cart, setCart] = useState([
    { id: 'cart-1', name: 'Chicken Burger', price: 180, quantity: 1 },
    { id: 'cart-2', name: 'French Fries', price: 80, quantity: 1 }
  ]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = shop.deliveryFee || 25;
  const total = subtotal + deliveryFee;

  return (
    <StudentLayout>
      
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm font-medium text-slate-500 mb-6">
        <Link to="/dashboard/student" className="hover:text-orange-500 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to="/dashboard/student/shops" className="hover:text-orange-500 transition-colors">Browse Shops</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-orange-600 font-bold">{shop.name}</span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-8 pb-8">
        <div className="relative h-64 lg:h-72 w-full">
          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <button className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-slate-400 hover:text-red-500 hover:scale-110 transition-all z-10">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-8 flex flex-col md:flex-row relative">
          {/* Logo overlapping banner */}
          <div className="w-28 h-28 bg-orange-500 rounded-2xl shadow-xl border-4 border-white flex items-center justify-center text-white font-bold text-center leading-tight -mt-14 mb-4 md:mb-0 md:mr-6 flex-shrink-0 z-10">
            <span className="px-2">{shop.name}</span>
          </div>
          
          <div className="pt-2 md:pt-4 flex-1">
            <div className="flex items-center mb-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mr-4">{shop.name}</h1>
              {shop.isOpen && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Open
                </span>
              )}
            </div>
            
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mb-4 leading-relaxed">
              {shop.description || "The heart of campus dining. Fresh, healthy, and affordable meals served daily."}
            </p>
            
            <div className="flex items-center space-x-6 text-sm font-bold text-slate-700">
              <div className="flex items-center">
                <span className="text-orange-500 mr-1.5 text-lg">★</span> {shop.rating} <span className="text-slate-400 font-medium ml-1">(500+ reviews)</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-slate-400" /> {shop.deliveryTime}
              </div>
              <div className="flex items-center">
                <Truck className="w-4 h-4 mr-1.5 text-slate-400" /> ৳{shop.deliveryFee} fee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column - Menu & Reviews */}
        <div className="flex-1 min-w-0">
          
          {/* Category Filter Navigation */}
          <div className="sticky top-0 bg-[#F9FAFB]/90 backdrop-blur-md z-10 py-4 mb-4">
            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
              {categories.map((cat, idx) => (
                <button 
                  key={cat}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                    idx === 0 
                      ? 'bg-orange-800 text-white shadow-md' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Most Popular Section */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">Most Popular</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularItems.map(item => (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col relative">
                  
                  {item.isBestSeller && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-extrabold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm z-10 border border-orange-100">
                      Best Seller
                    </span>
                  )}
                  
                  <div className="h-48 overflow-hidden bg-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-slate-800">{item.name}</h4>
                      <span className="font-bold text-orange-600">৳{item.price}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">{item.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-slate-800">1</span>
                        <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors shadow-sm">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Snacks & Sides Section (Horizontal Cards) */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">Snacks & Sides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {snacksItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-3 flex items-center shadow-sm hover:border-orange-200 transition-colors group">
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-orange-600">৳{item.price}</span>
                      <button className="w-8 h-8 bg-orange-50 hover:bg-orange-100 text-orange-500 rounded-full flex items-center justify-center transition-colors shadow-sm border border-orange-100">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-2">
              <h3 className="text-lg font-bold text-slate-800">Student Reviews</h3>
              <button className="text-sm font-bold text-orange-600 hover:underline">Write a Review</button>
            </div>
            
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm mr-3">
                        {review.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-none mb-1">{review.studentName}</h4>
                        <div className="flex text-orange-400 text-xs">
                          {"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{review.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Sticky Cart */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-4 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            
            <div className="bg-orange-500 p-5 flex items-center text-white">
              <ShoppingCart className="w-5 h-5 mr-3" />
              <h3 className="font-bold text-lg">Your Order</h3>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-slate-400 text-center py-8 text-sm">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-slate-800">
                        <span className="bg-slate-100 text-slate-600 font-bold text-xs px-2 py-1 rounded mr-3">{item.quantity}x</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
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
                <span className="text-slate-800 font-bold">Total</span>
                <span className="text-2xl font-extrabold text-orange-600">৳{total}</span>
              </div>
              
              <Link to="/checkout" className="block w-full">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center group">
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
            
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
