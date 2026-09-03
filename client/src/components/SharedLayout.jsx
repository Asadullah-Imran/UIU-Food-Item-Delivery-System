import React, { useState } from 'react';
import { 
  LogOut, Search, Menu, X, ArrowLeftRight
} from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import RoleTransitionOverlay from './RoleTransitionOverlay';
import { useAuth } from '../context/AuthContext';
import { useLayout } from '../context/LayoutContext';

export default function SharedLayout({ 
  children, // Kept for backwards compatibility during migration
  navigation = [], 
  user = {}, 
  switchRoleText, 
  switchRolePath
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { logout } = useAuth();
  const { headerActions, hideGlobalSearch, noPadding } = useLayout();

  const handleSwitchRole = (e) => {
    e.preventDefault();
    if (!switchRolePath) return;
    setIsMobileMenuOpen(false);
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(switchRolePath);
    }, 1200);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  // Default user if not provided fully
  const displayUser = {
    name: user.name || 'User',
    idLabel: user.idLabel || 'ID',
    idNumber: user.idNumber || '#0000',
    avatar: user.avatar || 'https://i.pravatar.cc/150'
  };

  return (
    <>
    {isTransitioning && switchRolePath && (
      <RoleTransitionOverlay 
        isVisible={isTransitioning} 
        toRole={switchRolePath.split('/').pop()} 
      />
    )}
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
          {navigation.map((link) => {
            const Icon = link.icon;
            // Precise active state matching
            const isActive = currentPath === link.path || (link.path !== '/dashboard/shop' && currentPath.startsWith(link.path));
            
            return (
              <Link 
                key={link.name}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all ${isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-100 hover:text-orange-500'}`}
              >
                {Icon && <Icon className="w-5 h-5 mr-3" />} {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200/60 space-y-2">
          {switchRoleText && switchRolePath && (
            <button 
              onClick={handleSwitchRole}
              className="w-full flex items-center justify-center px-4 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" /> {switchRoleText}
            </button>
          )}
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </button>
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
            {!hideGlobalSearch && (
              <div className="relative w-full max-w-md hidden sm:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search orders, transactions..."
                  className="w-full pl-11 pr-4 py-3 bg-white/60 focus:bg-white border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all shadow-sm"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {headerActions && (
              <div className="flex items-center space-x-3">
                {headerActions}
              </div>
            )}
            <div className="flex items-center bg-white p-2 pr-4 rounded-full shadow-sm border border-slate-100">
              <div className="text-right mr-3 pl-3">
                <p className="text-sm font-bold text-slate-800 leading-none">{displayUser.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-semibold">{displayUser.idLabel}: {displayUser.idNumber}</p>
              </div>
              <img src={displayUser.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-sm" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className={`flex-1 overflow-y-auto bg-[#F0F2F5] ${noPadding ? 'p-0' : 'px-4 sm:px-8 pb-8'}`}>
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
    </>
  );
}
