import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Package,
  CheckCircle2,
  XCircle,
  Star,
  ChevronDown,
  ArrowDownUp,
  Edit3,
  Trash2,
  Eye,
  TriangleAlert,
  Search,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import shopOrdersData from '../../data/shopOrdersData.json';

const defaultMenuItems = [
  {
    id: "item1",
    name: "Chicken Curry Meal Bowl",
    price: 250,
    prepTime: "15-20 min",
    category: "Meals",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Tender chicken cooked in aromatic spices served with fragrant steamed rice and fresh cucumber salad.",
    available: true,
    badge: "BEST SELLER"
  },
  {
    id: "item2",
    name: "Crispy Fried Chicken Combo",
    price: 245,
    prepTime: "10-15 min",
    category: "Meals",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Two pieces of golden crispy fried chicken with seasoned french fries and garlic dip.",
    available: true,
    badge: "LOW STOCK"
  },
  {
    id: "item3",
    name: "Classic Cheese Beef Burger",
    price: 350,
    prepTime: "20-25 min",
    category: "Meals",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "100% seasoned beef patty layered with melted cheddar cheese, fresh lettuce, and house sauce.",
    available: true,
    badge: null
  },
  {
    id: "item4",
    name: "Cold Coffee with Ice Cream",
    price: 120,
    prepTime: "5-8 min",
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Rich and creamy iced espresso blended with vanilla ice cream and chocolate drizzle.",
    available: false,
    badge: "OUT OF STOCK"
  },
  {
    id: "item5",
    name: "Spicy French Fries (Large)",
    price: 110,
    prepTime: "8-10 min",
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Crispy hand-cut potatoes tossed in spicy peri-peri seasoning.",
    available: true,
    badge: null
  },
  {
    id: "item6",
    name: "Chocolate Lava Cake",
    price: 180,
    prepTime: "12-15 min",
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Warm chocolate sponge cake with a molten fudge core, served with dark cocoa dust.",
    available: true,
    badge: null
  }
];

export default function ShopMenuManagement() {
  const navigate = useNavigate();

  // Load items from localStorage if available, or fallback to default
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('uiu_shop_menu_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved menu items", e);
      }
    }
    return defaultMenuItems;
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Available' | 'Unavailable'
  const [sortBy, setSortBy] = useState('name-asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Modals state
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('uiu_shop_menu_items', JSON.stringify(items));
  }, [items]);

  // Toast auto dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Toggle item availability
  const toggleAvailability = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newStatus = !item.available;
          showToast(
            `"${item.name}" is now marked as ${newStatus ? 'Available' : 'Unavailable'}`,
            newStatus ? 'success' : 'warning'
          );
          return {
            ...item,
            available: newStatus,
            badge: !newStatus
              ? 'OUT OF STOCK'
              : item.badge === 'OUT OF STOCK'
              ? null
              : item.badge
          };
        }
        return item;
      })
    );
  };

  // Delete item handler
  const handleDeleteItem = (id) => {
    const itemToDelete = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteConfirmId(null);
    showToast(`"${itemToDelete?.name || 'Item'}" was removed from menu`, 'info');
  };

  // Save edited item
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editItem) return;

    setItems((prev) =>
      prev.map((item) => (item.id === editItem.id ? editItem : item))
    );
    showToast(`Updated "${editItem.name}" successfully!`, 'success');
    setEditItem(null);
  };

  // Dynamic calculated metrics
  const totalItemsCount = items.length;
  const availableCount = items.filter((i) => i.available).length;
  const unavailableCount = items.filter((i) => !i.available).length;
  const bestSellerName =
    items.find((i) => i.badge === 'BEST SELLER')?.name || 'Chicken Curry Meal Bowl';

  // Filter & Sort items
  const filteredItems = items
    .filter((item) => {
      // Category filter
      if (selectedCategory !== 'All') {
        const cat = item.category?.toLowerCase() || '';
        const selected = selectedCategory.toLowerCase();
        if (selected === 'meals' && !cat.includes('meal')) return false;
        if (selected === 'snacks' && !cat.includes('snack')) return false;
        if (selected === 'drinks' && !cat.includes('drink')) return false;
        if (selected === 'desserts' && !cat.includes('dessert')) return false;
      }
      // Status filter
      if (statusFilter === 'Available' && !item.available) return false;
      if (statusFilter === 'Unavailable' && item.available) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  const categories = ['All', 'Meals', 'Snacks', 'Drinks', 'Desserts'];

  return (
    <div className="max-w-7xl mx-auto pb-12 pt-2">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-bold text-white ${
              toast.type === 'success'
                ? 'bg-emerald-600 border-emerald-500'
                : toast.type === 'warning'
                ? 'bg-amber-600 border-amber-500'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'warning' && <XCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'info' && <TriangleAlert className="w-5 h-5 flex-shrink-0" />}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-75 p-1 text-white/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="mb-8 mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">
            Menu Management
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Control food availability in real-time, update prices, and organize categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard/shop/menu/add')}
          className="self-start sm:self-auto bg-[#F37623] hover:bg-[#d9671b] text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-md shadow-orange-500/20 flex items-center cursor-pointer active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Menu Item
        </button>
      </div>

      {/* LIVE METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        
        {/* TOTAL ITEMS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F37623] flex items-center justify-center mb-4">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              Total Items
            </p>
            <h3 className="text-3xl font-extrabold text-slate-800">
              {totalItemsCount < 10 ? `0${totalItemsCount}` : totalItemsCount}
            </h3>
          </div>
        </div>

        {/* AVAILABLE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              Available
            </p>
            <h3 className="text-3xl font-extrabold text-emerald-600">
              {availableCount < 10 ? `0${availableCount}` : availableCount}
            </h3>
          </div>
        </div>

        {/* UNAVAILABLE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              Unavailable
            </p>
            <h3 className="text-3xl font-extrabold text-rose-500">
              {unavailableCount < 10 ? `0${unavailableCount}` : unavailableCount}
            </h3>
          </div>
        </div>

        {/* BEST SELLER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-[#9B5110] text-white flex items-center justify-center mb-4 shadow-sm">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              Best Seller
            </p>
            <h3 className="text-base font-extrabold text-slate-800 truncate" title={bestSellerName}>
              {bestSellerName}
            </h3>
          </div>
        </div>
      </div>

      {/* SEARCH, FILTERS & CONTROLS */}
      <div className="bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        
        {/* CATEGORY FILTER CHIPS */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-bold text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#9B5110] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SEARCH & STATUS DROPDOWNS */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          
          {/* SEARCH BOX */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F37623]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* STATUS FILTER */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2 px-4 pr-8 rounded-full text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F37623]/20"
            >
              <option value="All">Status: All</option>
              <option value="Available">Status: Available</option>
              <option value="Unavailable">Status: Unavailable</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* SORT BY */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2 px-4 pr-8 rounded-full text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F37623]/20"
            >
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="price-asc">Sort: Price (Low → High)</option>
              <option value="price-desc">Sort: Price (High → Low)</option>
            </select>
            <ArrowDownUp className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* MAIN CONTENT: MENU GRID + INVENTORY ALERTS */}
      <div className="flex flex-col xl:flex-row gap-6">

        {/* MENU ITEMS GRID */}
        <div className="flex-1 min-w-0">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">No Menu Items Found</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                No items match your current search and filter criteria. Try resetting filters or adding new dishes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setStatusFilter('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl shadow-sm border overflow-hidden flex flex-col relative transition-all duration-300 hover:shadow-md ${
                    item.available
                      ? 'border-slate-100 hover:-translate-y-1'
                      : 'border-slate-200/80 bg-slate-50/50 opacity-90'
                  }`}
                >
                  {/* IMAGE & BADGES */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        !item.available ? 'opacity-40 grayscale scale-100' : 'hover:scale-105'
                      }`}
                    />

                    {/* STATUS PILL OVERLAY */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-sm ${
                          item.available
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {item.available ? 'In Stock' : 'Out of Stock'}
                      </span>

                      {item.badge && item.badge !== 'OUT OF STOCK' && (
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-sm ${
                            item.badge === 'BEST SELLER'
                              ? 'bg-[#9B5110] text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* QUICK AVAILABILITY TOGGLE BUTTON ON IMAGE */}
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(item.id)}
                        title={`Click to mark ${item.available ? 'Unavailable' : 'Available'}`}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                          item.available
                            ? 'bg-white/95 text-slate-800 hover:bg-white hover:text-rose-600'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.available ? 'bg-emerald-500' : 'bg-rose-400'
                          }`}
                        ></span>
                        <span>{item.available ? 'Mark Unavailable' : 'Mark Available'}</span>
                      </button>
                    </div>

                    {!item.available && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-900/10">
                        <div className="bg-white/95 backdrop-blur-xs text-rose-600 text-xs font-extrabold px-5 py-2 rounded-full uppercase tracking-widest shadow-lg border border-rose-100">
                          Unavailable
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CARD BODY */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* TITLE & PRICE */}
                      <div className="flex justify-between items-start mb-2 gap-3">
                        <h3
                          className={`text-lg font-bold leading-snug ${
                            item.available ? 'text-slate-800' : 'text-slate-500 line-through decoration-slate-300'
                          }`}
                        >
                          {item.name}
                        </h3>

                        <span
                          className={`text-lg font-extrabold whitespace-nowrap ${
                            item.available ? 'text-[#9B5110]' : 'text-slate-400'
                          }`}
                        >
                          ৳ {item.price}
                        </span>
                      </div>

                      {/* DESCRIPTION */}
                      {item.description && (
                        <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* META TAGS */}
                      <div className="flex items-center space-x-4 mb-5 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <span>⏱</span>
                          <span>{item.prepTime}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🍽</span>
                          <span>{item.category}</span>
                        </span>
                      </div>
                    </div>

                    {/* CARD FOOTER & CONTROLS */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      
                      {/* SWITCH TOGGLE */}
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-600">
                          Availability:
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleAvailability(item.id)}
                          role="switch"
                          aria-checked={item.available}
                          title={`Toggle ${item.name} ${item.available ? 'Unavailable' : 'Available'}`}
                          className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center cursor-pointer shadow-inner ${
                            item.available ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm flex items-center justify-center ${
                              item.available ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          >
                            {item.available ? (
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                            ) : (
                              <X className="w-2.5 h-2.5 text-slate-400" />
                            )}
                          </div>
                        </button>

                        <span
                          className={`text-xs font-bold ${
                            item.available ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          {item.available ? 'Active' : 'Hidden'}
                        </span>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => setEditItem(item)}
                          title="Edit Item Details"
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          title="Delete Item"
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setViewItem(item)}
                          title="Preview Item"
                          className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INVENTORY ALERTS & STATS */}
        <div className="w-full xl:w-80 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 sticky top-6 space-y-6 p-5">
            
            {/* ALERT HEADER */}
            <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
              <div className="flex items-center text-xs font-extrabold uppercase tracking-wider text-slate-800">
                <TriangleAlert className="w-4 h-4 text-rose-500 mr-2" />
                Live Stock Status
              </div>

              <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[10px] font-extrabold rounded-full">
                {unavailableCount} OUT
              </span>
            </div>

            {/* QUICK TOGGLE HELP BANNER */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/70 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Instant Menu Sync
              </div>
              <p className="leading-relaxed text-amber-800/90 font-medium">
                Toggling an item's availability switch immediately hides or shows the dish to students browsing the campus portal.
              </p>
            </div>

            {/* ALERTS LIST */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <h4 className="text-xs font-bold text-rose-700 mb-1">
                  Item Out of Stock
                </h4>
                <p className="text-[11px] font-semibold text-rose-600 mb-2">
                  Cold Coffee is currently marked unavailable to students.
                </p>
                <button
                  type="button"
                  onClick={() => toggleAvailability('item4')}
                  className="text-xs font-extrabold text-rose-800 hover:underline"
                >
                  Restock Item →
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                <h4 className="text-xs font-bold text-[#9B5110] mb-1">
                  Low Stock Warning
                </h4>
                <p className="text-[11px] font-semibold text-orange-700 mb-2">
                  Crispy Fried Chicken stock predicted to end during peak lunch hours.
                </p>
                <button
                  type="button"
                  onClick={() => showToast("Stock alert updated. Supplier notified.", "success")}
                  className="text-xs font-extrabold text-[#9B5110] hover:underline"
                >
                  Confirm Inventory →
                </button>
              </div>
            </div>

            {/* PREVIEW STORE BUTTON */}
            <button
              type="button"
              onClick={() => navigate('/dashboard/student/shops/1')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> Preview Live Student Menu
            </button>

          </div>
        </div>

      </div>

      {/* VIEW ITEM MODAL */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-100">
              <img
                src={viewItem.image}
                alt={viewItem.name}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                  viewItem.available ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              >
                {viewItem.available ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-1">{viewItem.name}</h3>
            <p className="text-xs font-bold text-[#9B5110] mb-3">৳ {viewItem.price} BDT</p>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{viewItem.description}</p>

            <div className="flex gap-3 mb-6">
              <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Category</span>
                <span className="text-xs font-bold text-slate-700">{viewItem.category}</span>
              </div>
              <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Prep Time</span>
                <span className="text-xs font-bold text-slate-700">{viewItem.prepTime}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  toggleAvailability(viewItem.id);
                  setViewItem((prev) => ({ ...prev, available: !prev.available }));
                }}
                className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-colors ${
                  viewItem.available
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {viewItem.available ? 'Mark Unavailable' : 'Mark Available'}
              </button>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Edit Menu Item</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Item Name</label>
                <input
                  type="text"
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F37623]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Price (BDT)</label>
                  <input
                    type="number"
                    value={editItem.price}
                    onChange={(e) => setEditItem({ ...editItem, price: Number(e.target.value) })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F37623]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                  <select
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F37623]/20"
                  >
                    <option value="Meals">Meals</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={editItem.description || ''}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F37623]/20"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">Availability Status</span>
                <button
                  type="button"
                  onClick={() => setEditItem({ ...editItem, available: !editItem.available })}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    editItem.available ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {editItem.available ? 'In Stock (Available)' : 'Out of Stock (Hidden)'}
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#F37623] hover:bg-[#d9671b] text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Delete Menu Item?</h3>
            <p className="text-xs text-slate-500 mb-6">
              This will remove this dish from your shop menu. You can re-add it anytime.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDeleteItem(deleteConfirmId)}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}