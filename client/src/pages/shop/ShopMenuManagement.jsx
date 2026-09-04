import { useNavigate } from 'react-router-dom';
import React from 'react';
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
  TriangleAlert
} from 'lucide-react';
import shopOrdersData from '../../data/shopOrdersData.json';

const ShopMenuManagement = () => {
    const navigate = useNavigate();
  const { menuMetrics, inventoryAlerts, menuData } = shopOrdersData;

  return (
    <div className="max-w-7xl mx-auto pb-10">

      {/* PAGE HEADER */}
      <div className="mb-8 mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Menu Management
          </h1>

          <p className="text-slate-500 font-medium">
            Manage your menu, pricing, availability, and featured items.
          </p>
        </div>

        <button
  type="button"
  onClick={() => navigate('/dashboard/shop/menu/add')}
  className="self-start sm:self-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center shadow-sm"
>
  <Plus className="w-5 h-5 mr-2" />
  Add New Menu Item
</button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">

        {/* TOTAL ITEMS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
            <Package className="w-6 h-6" />
          </div>

          <div>
            <p className="text-slate-500 text-sm font-bold mb-1">
              Total Items
            </p>

            <h3 className="text-3xl font-extrabold text-slate-800">
              {menuMetrics.totalItems}
            </h3>
          </div>
        </div>

        {/* AVAILABLE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <p className="text-slate-500 text-sm font-bold mb-1">
              Available
            </p>

            <h3 className="text-3xl font-extrabold text-slate-800">
              {menuMetrics.available}
            </h3>
          </div>
        </div>

        {/* UNAVAILABLE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
            <XCircle className="w-6 h-6" />
          </div>

          <div>
            <p className="text-slate-500 text-sm font-bold mb-1">
              Unavailable
            </p>

            <h3 className="text-3xl font-extrabold text-slate-800">
              {menuMetrics.unavailable < 10
                ? `0${menuMetrics.unavailable}`
                : menuMetrics.unavailable}
            </h3>
          </div>
        </div>

        {/* BEST SELLER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="w-12 h-12 rounded-xl bg-[#8B4513] text-white flex items-center justify-center mb-4 shadow-md">
            <Star className="w-6 h-6 fill-current" />
          </div>

          <div>
            <p className="text-slate-500 text-sm font-bold mb-1">
              Best Seller
            </p>

            <h3
              className="text-xl font-extrabold text-slate-800 truncate"
              title={menuMetrics.bestSeller}
            >
              {menuMetrics.bestSeller}
            </h3>
          </div>
        </div>
      </div>

      {/* FILTERS AND SORTING */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

        {/* CATEGORY FILTER */}
        <div className="flex bg-white rounded-full p-1 shadow-sm border border-slate-100 overflow-x-auto w-full md:w-auto">
          <button
            type="button"
            className="px-6 py-2 rounded-full bg-[#8B4513] text-white font-bold text-sm whitespace-nowrap"
          >
            All
          </button>

          <button
            type="button"
            className="px-6 py-2 rounded-full text-slate-600 hover:bg-slate-50 font-bold text-sm whitespace-nowrap transition-colors"
          >
            Meals
          </button>

          <button
            type="button"
            className="px-6 py-2 rounded-full text-slate-600 hover:bg-slate-50 font-bold text-sm whitespace-nowrap transition-colors"
          >
            Snacks
          </button>

          <button
            type="button"
            className="px-6 py-2 rounded-full text-slate-600 hover:bg-slate-50 font-bold text-sm whitespace-nowrap transition-colors"
          >
            Drinks
          </button>

          <button
            type="button"
            className="px-6 py-2 rounded-full text-slate-600 hover:bg-slate-50 font-bold text-sm whitespace-nowrap transition-colors"
          >
            Desserts
          </button>
        </div>

        {/* STATUS / SORT */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            type="button"
            className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 font-bold py-2.5 px-5 rounded-full hover:bg-slate-50 transition-colors flex justify-between items-center shadow-sm"
          >
            Status: All
            <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
          </button>

          <button
            type="button"
            className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 font-bold py-2.5 px-5 rounded-full hover:bg-slate-50 transition-colors flex justify-between items-center shadow-sm"
          >
            Sort by: Name
            <ArrowDownUp className="w-4 h-4 ml-2 text-slate-400" />
          </button>
        </div>
      </div>

      {/* MENU + INVENTORY */}
      <div className="flex flex-col xl:flex-row gap-6">

        {/* MENU GRID */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          {menuData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col relative transition-transform hover:-translate-y-1 hover:shadow-md duration-300"
            >
              {/* IMAGE */}
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-full h-full object-cover ${
                    !item.available
                      ? 'opacity-40 grayscale'
                      : ''
                  }`}
                />

                {/* BEST SELLER */}
                {item.badge === 'BEST SELLER' && (
                  <div className="absolute top-4 right-4 bg-[#8B4513] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    {item.badge}
                  </div>
                )}

                {/* LOW STOCK */}
                {item.badge === 'LOW STOCK' && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    {item.badge}
                  </div>
                )}

                {/* OUT OF STOCK */}
                {item.badge === 'OUT OF STOCK' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white text-slate-800 text-xs font-extrabold px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">
                      {item.badge}
                    </div>
                  </div>
                )}
              </div>

              {/* CARD CONTENT */}
              <div className="p-6 flex-1 flex flex-col">

                {/* TITLE + PRICE */}
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3
                    className={`text-xl font-bold ${
                      item.available
                        ? 'text-slate-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.name}
                  </h3>

                  <span
                    className={`text-lg font-extrabold whitespace-nowrap ${
                      item.available
                        ? 'text-[#8B4513]'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.price} BDT
                  </span>
                </div>

                {/* DESCRIPTION */}
                {item.description && (
                  <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* INFORMATION */}
                <div className="flex items-center space-x-4 mb-6 mt-auto">
                  <span className="text-xs font-semibold text-slate-500 flex items-center">
                    <span className="mr-1.5">⏱</span>
                    {item.prepTime}
                  </span>

                  <span className="text-xs font-semibold text-slate-500 flex items-center">
                    <span className="mr-1.5">🍽</span>
                    {item.category}
                  </span>
                </div>

                {/* ACTION BAR */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-600">
                      Available
                    </span>

                    {/* AVAILABILITY TOGGLE */}
                    <button
                      type="button"
                      className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                        item.available
                          ? 'bg-[#8B4513]'
                          : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          item.available
                            ? 'translate-x-6'
                            : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* ITEM ACTIONS */}
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      title="Edit Item"
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      title="Delete Item"
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      title="View Item"
                      className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INVENTORY ALERTS */}
        <div className="w-full xl:w-80 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 sticky top-6">

            {/* ALERT HEADER */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center text-xs font-extrabold uppercase tracking-wider text-slate-800">
                <TriangleAlert className="w-4 h-4 text-red-500 mr-2" />
                Inventory Alerts
              </div>

              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-extrabold rounded-full">
                2 NEW
              </span>
            </div>

            {/* ALERTS */}
            <div className="p-5 space-y-4">
              {inventoryAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border ${
                    alert.type === 'critical'
                      ? 'bg-red-50 border-red-100'
                      : 'bg-orange-50 border-orange-100'
                  }`}
                >
                  <h4
                    className={`text-sm font-bold mb-1 ${
                      alert.type === 'critical'
                        ? 'text-red-600'
                        : 'text-[#8B4513]'
                    }`}
                  >
                    {alert.title}
                  </h4>

                  <p
                    className={`text-xs font-semibold mb-2 ${
                      alert.type === 'critical'
                        ? 'text-red-500'
                        : 'text-orange-600/80'
                    }`}
                  >
                    {alert.description}
                  </p>

                  {alert.actionText && (
                    <button
                      type="button"
                      className={`text-xs font-extrabold underline decoration-2 underline-offset-2 ${
                        alert.type === 'critical'
                          ? 'text-red-700'
                          : 'text-[#8B4513]'
                      }`}
                    >
                      {alert.actionText}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopMenuManagement;