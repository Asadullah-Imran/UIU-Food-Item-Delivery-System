import React, { useState } from 'react';
import { 
  LayoutDashboard, Truck, PackageCheck, History, 
  Wallet, MessageSquare, User, LogOut, Search, Bell, Menu, X, ArrowLeftRight
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import runnerData from '../data/runner.json';
import RoleTransitionOverlay from './RoleTransitionOverlay';

export default function RunnerLayout({ children, noPadding = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { profile } = runnerData;

  const handleSwitchRole = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/dashboard/student');
    }, 1200);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard/runner', icon: LayoutDashboard },
    { name: 'Available Deliveries', path: '/dashboard/runner/deliveries', icon: Truck },
    { name: 'Active Deliveries', path: '/dashboard/runner/active/accepted', icon: PackageCheck },
    { name: 'Delivery History', path: '/dashboard/runner/history', icon: History },
    { name: 'Earnings', path: '/dashboard/runner/earnings', icon: Wallet },
    { name: 'Chat', path: '/dashboard/runner/chat', icon: MessageSquare },
    { name: 'Profile', path: '#', icon: User },
  ];

  return (
    <>
    <RoleTransitionOverlay isVisible={isTransitioning} toRole="student" />
    <div className="flex h-screen bg-[#F0F2F5] font-sans text-slate-800 overflow-hidden relative animate-page-transition">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 w-64 bg-[#F9FAFB] border-r border-slate-200 flex flex-col h-full flex-shrink-0 z-30 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none`}>
        
        <div className="p-6 flex items-center justify-between lg:block text-center border-b border-slate-200/60">
          <div>
            <h1 className="text-xl font-bold text-orange-500 leading-tight">
              UIU Food & Items
            </h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold lg:text-center text-left">Official Portal</p>
          </div>
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <Link 
                key={link.name}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all ${isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-100 hover:text-orange-500'}`}
              >
                <Icon className="w-5 h-5 mr-3" /> {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200/60 space-y-2">
          <button 
            onClick={handleSwitchRole}
            className="w-full flex items-center justify-center px-4 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" /> Switch to Student
          </button>
          <Link to="/login" className="flex items-center justify-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors">
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">
        
        {/* Top Header */}
        <header className="bg-[#F0F2F5] h-20 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-10">
          <div className="flex items-center flex-1">
            <button 
              className="lg:hidden p-2 mr-3 text-slate-500 hover:text-orange-500 bg-white shadow-sm rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search orders, transactions..."
                className="w-full pl-11 pr-4 py-3 bg-white/60 focus:bg-white border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center bg-white p-2 pr-4 rounded-full shadow-sm border border-slate-100">
              <div className="text-right mr-3 pl-3">
                <p className="text-sm font-bold text-slate-800 leading-none">{profile.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-semibold">Runner ID: {profile.runnerId}</p>
              </div>
              <img src={profile.avatar} alt="Runner" className="w-10 h-10 rounded-full object-cover shadow-sm" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className={`flex-1 overflow-y-auto bg-[#F0F2F5] ${noPadding ? 'p-0' : 'px-4 sm:px-8 pb-8'}`}>
          {children}
        </main>
      </div>
    </div>
    </>
  );
}
