import React, { useState, useEffect } from 'react';
import { Heart, Clock, Truck, ChevronDown, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import shopsData from '../../data/shops.json';
import { useFavorites } from '../../context/FavoritesContext';

import StudentSidebarFix from './StudentSidebarFix';

export default function BrowseShops() {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState(() => {
    return location.state?.category || "All";
  });

  useEffect(() => {
    if (location.state?.category) {
      setActiveFilter(location.state.category);
    }
  }, [location.state]);

  const { isFavorite, toggleFavorite, favoriteCount } = useFavorites();
  const filters = ["All", "Favorites", "Food", "Café", "Snacks", "Stationery", "Grocery"];

  const filteredShops = shopsData.filter(shop => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Favorites") return isFavorite(shop.id);
    return shop.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <>
      <StudentSidebarFix isShops />
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-1">Browse Campus Shops</h2>
          <p className="text-slate-500">Find food, drinks, and campus essentials from trusted UIU vendors.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="bg-white p-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start min-w-[120px]">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Shops</p>
            <p className="text-2xl font-bold text-orange-600 leading-none">{shopsData.length}</p>
          </div>
          <div className="bg-white p-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start min-w-[120px]">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Favorites</p>
            <p className="text-2xl font-bold text-red-500 leading-none">{favoriteCount}</p>
          </div>
          <div className="bg-white p-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start min-w-[140px]">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Avg. Delivery</p>
            <p className="text-2xl font-bold text-slate-700 leading-none">15-20 min</p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-[2rem] overflow-hidden mb-8 shadow-sm">
        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80" alt="Chef's Table" className="w-full h-64 lg:h-72 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-8 lg:p-12">
          <div className="max-w-lg">
            <span className="inline-block px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full mb-4">
              15% off for first-year students
            </span>
            <h3 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 tracking-tight">
              Chef's Table
            </h3>
            <p className="text-slate-200 text-lg mb-6 leading-relaxed max-w-sm">
              The heart of campus dining. Fresh, healthy, and affordable meals served daily.
            </p>
            <Link to="/dashboard/student/shops/1">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg">
                Order Now →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isSelected = activeFilter === filter;
            const isFavTab = filter === "Favorites";
            return (
              <button 
                key={filter} 
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border flex items-center gap-1.5 ${
                  isSelected 
                    ? isFavTab 
                      ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20 scale-105' 
                      : 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-500 shadow-sm'
                }`}
              >
                {isFavTab && <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-white text-white' : 'text-red-500'}`} />}
                {filter}
                {isFavTab && favoriteCount > 0 && (
                  <span className={`text-xs ml-1 px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white text-red-500' : 'bg-red-100 text-red-600'}`}>
                    {favoriteCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center space-x-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort by:</span>
          <button className="flex items-center text-sm font-bold text-slate-700 hover:text-orange-500">
            Highest Rated <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Shop Grid */}
      {filteredShops.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center my-8 shadow-sm flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-400 mb-4">
            <Heart className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Favorite Shops Yet</h3>
          <p className="text-slate-500 text-sm max-w-md mb-6">
            Click the heart icon on any shop to add them to your favorites for instant access.
          </p>
          <button 
            onClick={() => setActiveFilter("All")}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-orange-500/20"
          >
            Explore All Shops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10 relative">
          {filteredShops.map(shop => (
            <div key={shop.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col relative">
              
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden flex-shrink-0 bg-slate-100">
                <img 
                  src={shop.image} 
                  alt={shop.name} 
                  className={`w-full h-full object-cover transition-transform duration-700 ${shop.isOpen ? 'group-hover:scale-110' : 'grayscale'}`} 
                />
                
                {/* Status Badge */}
                <div className={`absolute top-4 left-4 flex items-center px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md backdrop-blur-sm ${
                  shop.isOpen ? 'bg-white/90 text-slate-800' : 'bg-red-500/90 text-white'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${shop.isOpen ? 'bg-green-500' : 'bg-white'}`}></span>
                  {shop.isOpen ? 'Open' : 'Closed'}
                </div>
                
                {/* Favorite Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(shop.id);
                  }}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all z-10"
                  aria-label="Toggle favorite"
                >
                  <Heart className={`w-4 h-4 transition-colors duration-200 ${isFavorite(shop.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
              
              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-extrabold text-2xl text-slate-800 tracking-tight">{shop.name}</h4>
                  <div className="flex items-center text-sm font-bold text-slate-700 bg-orange-50 px-2 py-1 rounded-lg text-orange-700 border border-orange-100 shadow-sm">
                    <span className="text-orange-400 mr-1">★</span> {shop.rating}
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2">
                  {shop.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs font-semibold text-slate-600 mb-6 mt-auto">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-slate-400" /> 
                    {shop.deliveryTime}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-1.5 text-slate-400" /> 
                    ৳ {shop.deliveryFee}
                  </div>
                </div>
                
                {shop.isOpen ? (
                  <Link to={`/dashboard/student/shops/${shop.id}`} className="w-full">
                    <button className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-sm transition-colors shadow-md shadow-orange-500/20">
                      {shop.id === "5" ? "Browse Items" : "Browse Menu"}
                    </button>
                  </Link>
                ) : (
                  <button disabled className="w-full py-3.5 bg-slate-100 text-slate-400 font-bold rounded-2xl text-sm cursor-not-allowed">
                    Opens Tomorrow
                  </button>
                )}
              </div>
              
              {/* Floating Action Button for closed shop (as seen in design) */}
              {!shop.isOpen && (
                <button className="absolute -bottom-6 -right-6 w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-20" style={{ right: '1.5rem', bottom: '-1.5rem' }}>
                  <ShoppingBag className="w-6 h-6" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

