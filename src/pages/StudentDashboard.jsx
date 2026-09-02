import React from 'react';
import { 
  LayoutDashboard, Store, ClipboardList, MessageSquare, LogOut, 
  Search, Bell, Clock, Users, ChevronLeft, ChevronRight, Heart,
  Utensils, Coffee, Cookie, BookOpen, ShoppingCart, Cake, Plus, MapPin, HeadphonesIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Import JSON Data
import userData from '../data/user.json';
import categoriesData from '../data/categories.json';
import shopsData from '../data/shops.json';
import popularItemsData from '../data/popularItems.json';
import recentOrdersData from '../data/recentOrders.json';

// Map icon strings to components
const iconMap = {
  'utensils': <Utensils className="w-5 h-5 text-orange-500" />,
  'coffee': <Coffee className="w-5 h-5 text-orange-500" />,
  'cookie': <Cookie className="w-5 h-5 text-orange-500" />,
  'book': <BookOpen className="w-5 h-5 text-orange-500" />,
  'shopping-cart': <ShoppingCart className="w-5 h-5 text-orange-500" />,
  'cake': <Cake className="w-5 h-5 text-orange-500" />,
};

export default function StudentDashboard() {
  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
        <div className="p-6 border-b border-slate-100 text-center">
          <h1 className="text-xl font-bold text-orange-500 leading-tight">
            UIU Food & Items
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Official Portal</p>
        </div>

        <div className="p-6 flex flex-col items-center border-b border-slate-100">
          <div className="w-20 h-20 rounded-full border-4 border-orange-100 overflow-hidden mb-3">
            <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-bold text-slate-800 text-lg">{userData.name}</h2>
          <p className="text-sm text-slate-500">ID: {userData.id}</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <a href="#" className="flex items-center px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow-md shadow-orange-500/20">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-orange-500 rounded-xl font-medium transition-colors">
            <Store className="w-5 h-5 mr-3" /> Browse Shops
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-orange-500 rounded-xl font-medium transition-colors">
            <ClipboardList className="w-5 h-5 mr-3" /> My Orders
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-orange-500 rounded-xl font-medium transition-colors">
            <MessageSquare className="w-5 h-5 mr-3" /> Chat
          </a>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link to="/login" className="flex items-center justify-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-colors">
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 flex-shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search campus shops or foods..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative text-slate-400 hover:text-orange-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center pl-6 border-l border-slate-200">
              <div className="text-right mr-3 hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{userData.name}</p>
                <p className="text-xs text-slate-500 mt-1">{userData.department}</p>
              </div>
              <img src={userData.avatar} alt="User" className="w-9 h-9 rounded-full border border-slate-200" />
            </div>
          </div>
        </header>

        {/* Dashboard Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-8">
          
          <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-1">Good Afternoon, {userData.name} 👋</h2>
              <p className="text-slate-500">What would you like to order today?</p>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-6 min-w-[280px]">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 text-orange-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Peak Time Now</p>
                  <p className="text-sm font-bold text-slate-800">~15-20 min delivery</p>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Active Couriers</p>
                <p className="text-sm font-bold text-slate-800">24 Available</p>
              </div>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden mb-10 shadow-md">
            <img src="/bg.jpg" alt="Campus Banner" className="w-full h-48 lg:h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-8 lg:p-12">
              <div className="max-w-md">
                <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
                  Fast delivery from your favorite UIU campus vendors.
                </h3>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg">
                  Order Now
                </button>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xl font-bold text-slate-800">Quick Categories</h3>
              <a href="#" className="text-sm font-bold text-orange-500 hover:underline">View All</a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {categoriesData.map(cat => (
                <button key={cat.id} className="min-w-[100px] flex-shrink-0 bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all rounded-2xl p-4 flex flex-col items-center justify-center group">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {iconMap[cat.icon]}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nearby Shops */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xl font-bold text-slate-800">Nearby Campus Shops</h3>
              <div className="flex space-x-2">
                <button className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {shopsData.map(shop => (
                <div key={shop.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {shop.isOpen && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                        Open
                      </span>
                    )}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-slate-400 hover:text-red-500 transition-colors">
                      <Heart className={`w-4 h-4 ${shop.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-lg text-slate-800">{shop.name}</h4>
                      <div className="flex items-center text-sm font-bold text-slate-700">
                        <span className="text-orange-400 mr-1">★</span> {shop.rating}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 font-medium mb-4">
                      <Clock className="w-3.5 h-3.5 mr-1" /> {shop.deliveryTime}
                    </div>
                    <button className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold rounded-xl text-sm transition-colors">
                      Browse Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-10">
            {/* Popular Today */}
            <div className="xl:col-span-2">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-bold text-slate-800">Popular Today</h3>
                <a href="#" className="text-sm font-bold text-orange-500 hover:underline">See Menu</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularItemsData.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-3 flex items-center shadow-sm hover:border-orange-200 transition-colors">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="ml-4 flex-1">
                      <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">{item.shopName} • <span className="text-orange-400 font-bold">★ {item.rating}</span></p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-orange-600">৳{item.price}</span>
                        <button className="w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Orders</h3>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="space-y-4">
                  {recentOrdersData.map((order, i) => (
                    <div key={order.id} className={`flex justify-between items-center ${i !== recentOrdersData.length - 1 ? 'pb-4 border-b border-slate-100' : ''}`}>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{order.shopName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{order.date} • {order.status}</p>
                      </div>
                      <button className="px-4 py-1.5 border border-orange-200 text-orange-500 text-xs font-bold rounded-lg hover:bg-orange-50 transition-colors">
                        Reorder
                      </button>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-xl transition-colors">
                  View Full History
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Help Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-start">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-3">
                <Store className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Browse Shops</h4>
              <p className="text-xs text-slate-500">Explore all campus vendors</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Track Order</h4>
              <p className="text-xs text-slate-500">Real-time status updates</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-start">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
                <HeadphonesIcon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Help Center</h4>
              <p className="text-xs text-slate-500">Chat with support staff</p>
            </div>
          </div>

          {/* Footer */}
          <footer className="pt-6 border-t border-slate-200 mt-4 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-orange-500 text-sm block mb-1">UIU Food and Items Delivery</span>
              <p>Official logistics platform for United International University students and faculty. Fast, reliable, and campus-focused.</p>
              <p className="mt-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">© 2026 UIU Official</p>
            </div>
            <div className="flex space-x-12">
               <div>
                  <span className="font-bold text-slate-800 text-sm block mb-2">Support</span>
                  <ul className="space-y-1.5">
                    <li><a href="#" className="hover:text-orange-500">Help Center</a></li>
                    <li><a href="#" className="hover:text-orange-500">Refund Policy</a></li>
                    <li><a href="#" className="hover:text-orange-500">Report an Issue</a></li>
                    <li><a href="#" className="hover:text-orange-500">Contact Admin</a></li>
                  </ul>
               </div>
               <div>
                  <span className="font-bold text-orange-500 text-sm block mb-2">UIU Food and Items Delivery</span>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300"></div>
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300"></div>
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300"></div>
                  </div>
               </div>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
