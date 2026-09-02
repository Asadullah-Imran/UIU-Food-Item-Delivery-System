import React, { useState } from 'react';
import { 
  LayoutDashboard, Store, ClipboardList, MessageSquare, LogOut, 
  Search, Bell, Menu, X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import userData from '../data/user.json';

export default function StudentLayout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-slate-800 overflow-hidden relative">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0 z-30 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none`}>
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between lg:block text-center">
          <div>
            <h1 className="text-xl font-bold text-orange-500 leading-tight">
              UIU Food & Items
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold lg:text-center text-left">Official Portal</p>
          </div>
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center border-b border-slate-100">
          <div className="w-20 h-20 rounded-full border-4 border-orange-100 overflow-hidden mb-3 shadow-sm">
            <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-bold text-slate-800 text-lg">{userData.name}</h2>
          <p className="text-sm text-slate-500">ID: {userData.id}</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link 
            to="/dashboard/student" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all ${currentPath === '/dashboard/student' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-50 hover:text-orange-500'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link 
            to="/dashboard/student/shops" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all ${currentPath === '/dashboard/student/shops' || currentPath.includes('/shops/') ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-50 hover:text-orange-500'}`}
          >
            <Store className="w-5 h-5 mr-3" /> Browse Shops
          </Link>
          <Link 
            to="#" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-orange-500 rounded-xl font-medium transition-colors"
          >
            <ClipboardList className="w-5 h-5 mr-3" /> My Orders
          </Link>
          <Link 
            to="#" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-orange-500 rounded-xl font-medium transition-colors"
          >
            <MessageSquare className="w-5 h-5 mr-3" /> Chat
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link to="/login" className="flex items-center justify-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-colors">
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">
        
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center flex-1">
            <button 
              className="lg:hidden p-2 mr-3 text-slate-500 hover:text-orange-500 bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search campus shops or foods..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-shadow"
              />
            </div>
            {/* Mobile Search Icon Only */}
            <button className="sm:hidden p-2 text-slate-400 hover:text-orange-500 bg-slate-50 rounded-lg ml-auto mr-4">
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button className="relative text-slate-400 hover:text-orange-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center pl-4 sm:pl-6 border-l border-slate-200">
              <div className="text-right mr-3 hidden lg:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{userData.name}</p>
                <p className="text-xs text-slate-500 mt-1">{userData.department}</p>
              </div>
              <img src={userData.avatar} alt="User" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F9FAFB]">
          {children}
        </main>
      </div>
    </div>
  );
}
