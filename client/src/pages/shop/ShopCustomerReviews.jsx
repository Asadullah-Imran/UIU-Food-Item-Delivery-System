import React, { useState } from 'react';
import { 
  Star, MessageSquare, Smile, ThumbsUp, ChevronDown, CheckCircle2,
  Search, Package, Clock, CornerDownRight, MoreVertical
} from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';
import { useEffect } from 'react';
import shopOrdersData from '../../data/shopOrdersData.json';

const ShopCustomerReviews = () => {
  const { reviewMetrics, ratingBreakdown, sentimentKeywords, mostPraisedItems, customerReviewsList } = shopOrdersData;
  const [searchTerm, setSearchTerm] = useState('');

  // Search Bar inside Header
  const headerActions = (
    <div className="hidden md:flex relative w-full max-w-md mr-4">
      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search reviews..."
        className="w-full bg-white border border-slate-200 text-slate-800 rounded-full py-2 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm font-semibold shadow-sm"
      />
    </div>
  );

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-orange-500 text-orange-500' : 'text-slate-300'}`} />
    ));
  };

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
      <div className="max-w-6xl mx-auto pb-10">
        
        {/* Page Header */}
        <div className="mb-6 mt-4">
          <h1 className="text-xl font-bold text-slate-700 mb-1">Customer Reviews</h1>
          <p className="text-sm font-semibold text-slate-500">Monitor customer feedback, improve service quality, and respond to reviews to build trust with your student base.</p>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mr-5">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">Overall Rating</p>
              <h3 className="text-2xl font-extrabold text-slate-800">{reviewMetrics.overallRating} <span className="text-sm text-slate-400 font-semibold">/ 5.0</span></h3>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center mr-5">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">Total Reviews</p>
              <h3 className="text-2xl font-extrabold text-slate-800">{reviewMetrics.totalReviews}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mr-5">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">Positive Reviews</p>
              <h3 className="text-2xl font-extrabold text-green-600">{reviewMetrics.positiveReviews}</h3>
            </div>
          </div>
        </div>

        {/* Detailed Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Rating Breakdown */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 mb-6">Rating Breakdown</h3>
            <div className="flex flex-col gap-4">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center text-sm font-semibold text-slate-600">
                  <span className="w-4">{item.stars}</span>
                  <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                  <span className="w-10 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Keywords */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-800 mb-6">Sentiment Keywords</h3>
            <div className="flex flex-wrap gap-3">
              {sentimentKeywords.positive.map(word => (
                <div key={word} className="px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100 flex items-center shadow-sm">
                  <ThumbsUp className="w-3 h-3 mr-1.5" /> {word}
                </div>
              ))}
              {sentimentKeywords.negative.map(word => (
                <div key={word} className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-500 text-xs font-bold border border-orange-100 flex items-center shadow-sm">
                  {word === 'Slow Service' ? <Clock className="w-3 h-3 mr-1.5" /> : <Package className="w-3 h-3 mr-1.5" />} {word}
                </div>
              ))}
            </div>
          </div>

          {/* Most Praised Items */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-800 mb-6">Most Praised Items</h3>
            <div className="flex flex-col gap-5">
              {mostPraisedItems.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover mr-3 shadow-sm" />
                    <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-extrabold text-orange-600">{item.praise} Praise</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by student name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-700 rounded-full py-2.5 pl-10 pr-4 outline-none focus:border-orange-500 text-sm font-semibold shadow-sm"
            />
          </div>
          
          <button className="bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-full text-sm flex items-center shadow-sm hover:bg-slate-50">
            Star Rating: All <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
          </button>
          
          <button className="bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-full text-sm flex items-center shadow-sm hover:bg-slate-50">
            Food Item: All <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
          </button>

          <button className="bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-full text-sm flex items-center shadow-sm hover:bg-slate-50">
            Sort by: Recent <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
          </button>
          
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full transition-colors shadow-sm text-sm">
            Apply Filters
          </button>
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-4">
          {customerReviewsList.map(review => (
            <div key={review.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <img src={review.avatar} alt={review.user} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-extrabold text-slate-800 mr-3">{review.user}</h4>
                      {review.verified && (
                        <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Purchase
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                      <span className="text-xs font-semibold text-slate-400">{review.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{review.item}</span>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-slate-700 font-medium leading-relaxed mb-4">{review.text}</p>
              
              <div className="flex items-center gap-6 text-sm font-bold text-slate-500 mb-2">
                <button className="flex items-center hover:text-orange-500 transition-colors">
                  <CornerDownRight className="w-4 h-4 mr-2" /> Reply to review
                </button>
                <button className="flex items-center hover:text-orange-500 transition-colors">
                  <ThumbsUp className="w-4 h-4 mr-2" /> Helpful ({review.helpful})
                </button>
              </div>

              {/* Shop Response */}
              {review.shopResponse && (
                <div className="mt-4 bg-slate-50 rounded-2xl p-5 border-l-4 border-slate-200">
                  <span className="text-[9px] font-extrabold text-orange-500 uppercase tracking-wider mb-2 block">Shop Response</span>
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 rounded-sm bg-orange-500 text-white flex items-center justify-center mr-2 text-[10px] font-bold">CT</div>
                    <span className="font-extrabold text-slate-800 text-sm mr-2">{review.shopResponse.responder}</span>
                    <span className="text-xs font-semibold text-slate-400">{review.shopResponse.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed mb-3">{review.shopResponse.text}</p>
                  <div className="flex gap-4">
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-700">Edit Response</button>
                    <button className="text-xs font-bold text-red-500 hover:text-red-600">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 bg-white p-4 rounded-full border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-4 md:mb-0 ml-4">
            Showing 1 - 10 of {reviewMetrics.totalReviews} reviews
          </p>
          <div className="flex space-x-2 mr-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 text-sm font-semibold">&lsaquo;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white shadow-sm text-sm font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-slate-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold">125</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold">&rsaquo;</button>
          </div>
        </div>

      </div>
    </>
  );
};


export default ShopCustomerReviews;
