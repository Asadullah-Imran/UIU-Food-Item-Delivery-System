import React, { useState } from 'react';
import { 
  Search, Bell, Settings, User, Edit2, Camera, Star, ShoppingBag, 
  Wallet, Flame, CheckCircle2, Eye, Save, Lock, Shield, LogOut, ChevronRight
} from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';
import { useEffect } from 'react';

const ShopProfile = () => {
  // State for toggles
  const [liveStatus, setLiveStatus] = useState(true);
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);

  // State for operating hours
  const [hours, setHours] = useState({
    weekday: { start: '08:00 AM', end: '08:00 PM', closed: false },
    saturday: { start: '09:00 AM', end: '04:00 PM', closed: false },
    sunday: { start: '12:00 AM', end: '12:00 AM', closed: true },
  });

  const headerActions = (
    <div className="flex items-center gap-4 mr-4 w-full justify-between sm:justify-end">
      {/* Replacement Search Bar */}
      <div className="relative w-full max-w-xs hidden sm:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search setting..."
          className="w-full pl-11 pr-4 py-2 bg-slate-100/80 border-none rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all text-slate-700 placeholder-slate-400"
        />
      </div>
      
      {/* Icon Group */}
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const { setHeaderActions, setHideGlobalSearch } = useLayout();

  useEffect(() => {
    setHeaderActions(headerActions);
    setHideGlobalSearch(true);
    return () => {
      setHeaderActions(null);
      setHideGlobalSearch(false);
    };
  }, [setHeaderActions, setHideGlobalSearch]);

  return (
    <>
      <div className="max-w-5xl mx-auto pb-10">
        
        {/* Page Header */}
        <div className="mb-6 mt-4">
          <h1 className="text-lg font-semibold text-slate-700 mb-1">Shop Profile</h1>
          <p className="text-sm font-medium text-slate-500">Manage your shop information, branding, contact details, and operational settings.</p>
        </div>

        {/* Banner Section */}
        <div className="bg-white rounded-[32px] p-2 mb-6 border border-slate-100 shadow-sm relative">
          <div className="relative h-64 rounded-[28px] overflow-hidden">
            {/* Banner Image */}
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Shop Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Change Cover Button */}
            <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-slate-700 flex items-center shadow-sm hover:bg-white transition-colors">
              <Edit2 className="w-3.5 h-3.5 mr-2" /> Change Cover
            </button>
          </div>
          
          {/* Profile Picture & Info */}
          <div className="absolute -bottom-6 left-8 flex items-end">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-white p-1.5 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-orange-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="ml-5 pb-6">
              <h2 className="text-xl font-bold text-slate-800">UIU Cafeteria</h2>
              <p className="text-sm font-semibold text-slate-500">Main Campus &bull; Building A, Level 1</p>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14 mb-6">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              </div>
              <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider mb-1">AVG RATING</p>
            <h3 className="text-xl font-extrabold text-slate-800">4.8 <span className="text-sm font-semibold text-slate-400">/ 5.0</span></h3>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider mb-1">TOTAL ORDERS</p>
            <h3 className="text-xl font-extrabold text-slate-800">1,248</h3>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-sky-500" />
              </div>
            </div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider mb-1">TOTAL REVENUE</p>
            <h3 className="text-xl font-extrabold text-slate-800">৳380,500</h3>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
            </div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider mb-1">BEST SELLER</p>
            <h3 className="text-lg font-extrabold text-slate-800">Beef Burger</h3>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 bg-white/50 py-2 rounded-xl">
          <div className="flex items-center text-sm font-semibold text-slate-500 mb-4 md:mb-0">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> All changes are currently auto-drafted
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors">
              Reset Changes
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard/shop/preview/1'}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold flex items-center hover:bg-slate-200 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" /> Preview Shop
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold flex items-center shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-colors">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </button>
          </div>
        </div>

        {/* Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Primary Settings) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Basic Information</h3>
              <div className="border-t border-slate-200 mb-6"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Shop Name</label>
                  <input type="text" defaultValue="Chef's Table" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Category</label>
                  <select className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500 appearance-none bg-white">
                    <option>Food & Beverages</option>
                    <option>Stationery</option>
                    <option>Groceries</option>
                  </select>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-500 mb-2">Description</label>
                <textarea 
                  rows="3"
                  defaultValue="Official university cafeteria serving a variety of hot meals, snacks, and beverages to students and faculty. Known for fresh quality and student-friendly prices."
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Campus Building</label>
                  <input type="text" defaultValue="Main Academic Building" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Location Detail</label>
                  <input type="text" defaultValue="100 feet road Madani Ave" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500" />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Contact Information</h3>
              <div className="border-t border-slate-200 mb-6"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Public Email</label>
                  <input type="email" defaultValue="chefstable@gmail.com" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Phone Number</label>
                  <input type="text" defaultValue="+880 1712-345678" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Emergency Contact</label>
                  <input type="text" defaultValue="+880 1912-888999" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Support WhatsApp</label>
                  <input type="text" defaultValue="+880 1712-345678" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500" />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Operating Hours</h3>
              <div className="border-t border-slate-200 mb-6"></div>
              
              <div className="space-y-4">
                {/* Mon - Fri */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="w-24 text-sm font-bold text-slate-800">Mon - Fri</div>
                  <div className="flex flex-1 items-center gap-3">
                    <input 
                      type="text" 
                      value={hours.weekday.start} 
                      disabled={hours.weekday.closed}
                      onChange={(e) => setHours({...hours, weekday: {...hours.weekday, start: e.target.value}})}
                      className="flex-1 max-w-[120px] border border-slate-300 rounded-lg px-3 py-2 text-sm text-center font-medium disabled:opacity-50" 
                    />
                    <span className="text-xs font-medium text-slate-400">to</span>
                    <input 
                      type="text" 
                      value={hours.weekday.end} 
                      disabled={hours.weekday.closed}
                      onChange={(e) => setHours({...hours, weekday: {...hours.weekday, end: e.target.value}})}
                      className="flex-1 max-w-[120px] border border-slate-300 rounded-lg px-3 py-2 text-sm text-center font-medium disabled:opacity-50" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${hours.weekday.closed ? 'text-red-500' : 'text-slate-500'}`}>Closed</span>
                    <input 
                      type="checkbox" 
                      checked={hours.weekday.closed}
                      onChange={() => setHours({...hours, weekday: {...hours.weekday, closed: !hours.weekday.closed}})}
                      className="w-4 h-4 accent-red-500 rounded border-slate-300"
                    />
                  </div>
                </div>

                {/* Saturday */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="w-24 text-sm font-bold text-orange-700">Saturday</div>
                  <div className="flex flex-1 items-center gap-3">
                    <input 
                      type="text" 
                      value={hours.saturday.start} 
                      disabled={hours.saturday.closed}
                      onChange={(e) => setHours({...hours, saturday: {...hours.saturday, start: e.target.value}})}
                      className="flex-1 max-w-[120px] border border-slate-300 rounded-lg px-3 py-2 text-sm text-center font-medium disabled:opacity-50" 
                    />
                    <span className="text-xs font-medium text-slate-400">to</span>
                    <input 
                      type="text" 
                      value={hours.saturday.end} 
                      disabled={hours.saturday.closed}
                      onChange={(e) => setHours({...hours, saturday: {...hours.saturday, end: e.target.value}})}
                      className="flex-1 max-w-[120px] border border-slate-300 rounded-lg px-3 py-2 text-sm text-center font-medium disabled:opacity-50" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${hours.saturday.closed ? 'text-red-500' : 'text-slate-500'}`}>Closed</span>
                    <input 
                      type="checkbox" 
                      checked={hours.saturday.closed}
                      onChange={() => setHours({...hours, saturday: {...hours.saturday, closed: !hours.saturday.closed}})}
                      className="w-4 h-4 accent-red-500 rounded border-slate-300"
                    />
                  </div>
                </div>

                {/* Sunday */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="w-24 text-sm font-bold text-slate-800">Sunday</div>
                  <div className="flex flex-1 items-center gap-3">
                    <input 
                      type="text" 
                      value={hours.sunday.start} 
                      disabled={hours.sunday.closed}
                      onChange={(e) => setHours({...hours, sunday: {...hours.sunday, start: e.target.value}})}
                      className="flex-1 max-w-[120px] border border-slate-300 rounded-lg px-3 py-2 text-sm text-center font-medium disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400" 
                    />
                    <span className="text-xs font-medium text-slate-400">to</span>
                    <input 
                      type="text" 
                      value={hours.sunday.end} 
                      disabled={hours.sunday.closed}
                      onChange={(e) => setHours({...hours, sunday: {...hours.sunday, end: e.target.value}})}
                      className="flex-1 max-w-[120px] border border-slate-300 rounded-lg px-3 py-2 text-sm text-center font-medium disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${hours.sunday.closed ? 'text-red-600' : 'text-slate-500'}`}>Closed</span>
                    <input 
                      type="checkbox" 
                      checked={hours.sunday.closed}
                      onChange={() => setHours({...hours, sunday: {...hours.sunday, closed: !hours.sunday.closed}})}
                      className="w-4 h-4 accent-red-600 rounded border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar Settings) */}
          <div className="space-y-6">
            
            {/* Live Status */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center mb-6">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
                <h3 className="text-sm font-semibold text-slate-700">Live Status</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Shop Open</p>
                    <p className="text-[10px] font-semibold text-slate-400">Visible to all users</p>
                  </div>
                  <button 
                    onClick={() => setLiveStatus(!liveStatus)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${liveStatus ? 'bg-orange-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${liveStatus ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Accepting Orders</p>
                    <p className="text-[10px] font-semibold text-slate-400">Students can place orders</p>
                  </div>
                  <button 
                    onClick={() => setAcceptingOrders(!acceptingOrders)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${acceptingOrders ? 'bg-orange-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${acceptingOrders ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Auto Accept</p>
                    <p className="text-[10px] font-semibold text-slate-400">Instant order processing</p>
                  </div>
                  <button 
                    onClick={() => setAutoAccept(!autoAccept)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${autoAccept ? 'bg-orange-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoAccept ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Security & Access */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 p-2 mb-2">Security & Access</h3>
              
              <div className="space-y-1">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 text-slate-400 mr-3" />
                    <span className="text-sm font-semibold text-slate-700">Change Password</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-slate-400 mr-3" />
                    <div className="text-left">
                      <span className="block text-sm font-semibold text-slate-700">Notification Preferences</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-slate-400 mr-3" />
                    <span className="text-sm font-semibold text-slate-700">Privacy Policy</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </button>

                <button className="w-full flex items-center p-3 rounded-xl hover:bg-red-50 transition-colors group mt-2">
                  <LogOut className="w-5 h-5 text-red-500 mr-3" />
                  <span className="text-sm font-semibold text-red-500 group-hover:text-red-600">Logout Session</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default ShopProfile;
