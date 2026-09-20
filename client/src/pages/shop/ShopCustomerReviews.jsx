import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, MessageSquare, Smile, ThumbsUp, ChevronDown, CheckCircle2,
  Search, Package, Clock, CornerDownRight, MoreVertical, RefreshCw, Loader2, AlertCircle
} from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';

const ShopCustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [distribution, setDistribution] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async (ratingFilter) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('uiu_auth_token');
      if (!token) {
        throw new Error('Authentication token missing. Please log in.');
      }

      const activeRating = ratingFilter !== undefined ? ratingFilter : selectedRating;
      const url = activeRating && activeRating !== 'ALL'
        ? `/api/shops/reviews?rating=${activeRating}`
        : '/api/shops/reviews';

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch reviews');
      }

      setReviews(data.reviews || []);
      if (data.averageRating !== undefined) setAverageRating(data.averageRating);
      if (data.totalReviews !== undefined) setTotalReviews(data.totalReviews);
      if (data.distribution) setDistribution(data.distribution);
    } catch (err) {
      console.error('getShopReviews Error:', err);
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(selectedRating);
  }, [selectedRating]);

  // Search Bar inside Header
  const headerActions = (
    <div className="hidden md:flex relative w-full max-w-md mr-4">
      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search reviews..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-white border border-slate-200 text-slate-800 rounded-full py-2 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm font-semibold shadow-sm"
      />
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
  }, [setHeaderActions, setHideGlobalSearch, searchTerm]);

  const renderStars = (rating) => {
    const starCount = Math.round(Number(rating) || 5);
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-3.5 h-3.5 ${i < starCount ? 'fill-orange-500 text-orange-500' : 'text-slate-300'}`} 
      />
    ));
  };

  // Filter reviews by search term locally
  const filteredReviews = useMemo(() => {
    if (!searchTerm.trim()) return reviews;
    const term = searchTerm.toLowerCase();
    return reviews.filter(rev => {
      const studentName = rev.user || rev.student?.name || '';
      const commentText = rev.comment || rev.feedback || rev.text || '';
      const itemName = rev.item || rev.items || '';
      return studentName.toLowerCase().includes(term) ||
             commentText.toLowerCase().includes(term) ||
             itemName.toLowerCase().includes(term);
    });
  }, [reviews, searchTerm]);

  // Distribution calculations
  const totalCountAll = (
    (distribution[1] || 0) +
    (distribution[2] || 0) +
    (distribution[3] || 0) +
    (distribution[4] || 0) +
    (distribution[5] || 0)
  ) || totalReviews || 1;

  const positiveReviewsCount = (distribution[4] || 0) + (distribution[5] || 0);

  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = distribution[stars] || 0;
    const percentage = totalCountAll > 0 ? Math.round((count / totalCountAll) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <>
      <div className="max-w-6xl mx-auto pb-10">
        
        {/* Page Header */}
        <div className="mb-6 mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-700 mb-1">Customer Reviews</h1>
            <p className="text-sm font-semibold text-slate-500">
              Real-time student ratings and feedback verified from completed deliveries.
            </p>
          </div>
          <button 
            onClick={() => fetchReviews(selectedRating)}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center px-4 py-2 bg-white border border-slate-200 hover:border-orange-300 text-slate-700 font-bold rounded-full text-xs shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin text-orange-500' : 'text-slate-400'}`} />
            Refresh Reviews
          </button>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mr-5">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">Overall Rating</p>
              <h3 className="text-2xl font-extrabold text-slate-800">
                {averageRating ? Number(averageRating).toFixed(1) : '5.0'} <span className="text-sm text-slate-400 font-semibold">/ 5.0</span>
              </h3>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center mr-5">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">Total Reviews</p>
              <h3 className="text-2xl font-extrabold text-slate-800">{totalReviews}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mr-5">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold mb-1">Positive Ratings (4-5★)</p>
              <h3 className="text-2xl font-extrabold text-green-600">{positiveReviewsCount}</h3>
            </div>
          </div>
        </div>

        {/* Detailed Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Rating Breakdown */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 mb-6">Rating Breakdown</h3>
            <div className="flex flex-col gap-3">
              {ratingBreakdown.map((item) => (
                <button
                  key={item.stars}
                  onClick={() => setSelectedRating(selectedRating === String(item.stars) ? 'ALL' : String(item.stars))}
                  className={`flex items-center text-sm font-semibold p-1.5 rounded-xl transition text-left ${
                    selectedRating === String(item.stars) ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-6 flex items-center">{item.stars}★</span>
                  <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                  <span className="w-16 text-right text-xs font-bold text-slate-400">
                    {item.count} ({item.percentage}%)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sentiment Highlights */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-800 mb-6">Student Sentiment</h3>
            <div className="flex flex-wrap gap-2.5">
              <div className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100 flex items-center shadow-sm">
                <ThumbsUp className="w-3 h-3 mr-1.5" /> Delicious Food
              </div>
              <div className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100 flex items-center shadow-sm">
                <ThumbsUp className="w-3 h-3 mr-1.5" /> Fresh & Hot
              </div>
              <div className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100 flex items-center shadow-sm">
                <ThumbsUp className="w-3 h-3 mr-1.5" /> Quick Preparation
              </div>
              <div className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 flex items-center shadow-sm">
                <CheckCircle2 className="w-3 h-3 mr-1.5" /> Generous Portions
              </div>
              <div className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100 flex items-center shadow-sm">
                <Clock className="w-3 h-3 mr-1.5" /> Peak Hour Delivery
              </div>
            </div>
          </div>

          {/* Quick Quality Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4">Shop Performance</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Satisfaction Rate</p>
                <p className="text-2xl font-black text-slate-800">
                  {totalReviews > 0 ? Math.round((positiveReviewsCount / totalReviews) * 100) : 100}%
                </p>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Based on student-completed delivery reviews</p>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">Review Ownership</p>
                <p className="text-xs font-semibold text-slate-600">
                  Student reviews are immutable read-only records linked to fulfilled orders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Row: All, 5★, 4★, 3★, 2★, 1★ */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All Reviews', val: 'ALL' },
              { label: '5 Stars ★', val: '5' },
              { label: '4 Stars ★', val: '4' },
              { label: '3 Stars ★', val: '3' },
              { label: '2 Stars ★', val: '2' },
              { label: '1 Star ★', val: '1' }
            ].map(filterBtn => (
              <button
                key={filterBtn.val}
                onClick={() => setSelectedRating(filterBtn.val)}
                className={`py-2 px-4 rounded-full text-xs font-extrabold transition shadow-sm ${
                  selectedRating === filterBtn.val
                    ? 'bg-orange-500 text-white shadow-orange-200'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {filterBtn.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px] flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by student name or item..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-700 rounded-full py-2 pl-9 pr-4 outline-none focus:border-orange-500 text-xs font-semibold shadow-sm"
            />
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-semibold">Loading student reviews...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-4 space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-red-800 text-sm font-bold">{error}</p>
            <button
              onClick={() => fetchReviews(selectedRating)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-full transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Reviews List */}
        {!loading && !error && (
          <div className="flex flex-col gap-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => {
                const studentName = review.user || review.student?.name || 'UIU Student';
                const studentAvatar = review.avatar || review.student?.avatar || `https://i.pravatar.cc/150?u=${studentName}`;
                const commentText = review.comment || review.feedback || review.text || 'No written comment provided.';
                const starRating = review.shopRating || review.rating || 5;

                return (
                  <div key={review.id || review.orderId} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <img 
                          src={studentAvatar} 
                          alt={studentName} 
                          className="w-12 h-12 rounded-full mr-4 object-cover border border-slate-100" 
                        />
                        <div>
                          <div className="flex items-center mb-1">
                            <h4 className="font-extrabold text-slate-800 mr-3">{studentName}</h4>
                            {review.student?.universityId && (
                              <span className="text-[10px] font-mono text-slate-400 mr-2">
                                ID: {review.student.universityId}
                              </span>
                            )}
                            <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Order
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-0.5">{renderStars(starRating)}</div>
                            <span className="text-xs font-semibold text-slate-400">{review.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold max-w-[220px] truncate" title={review.items || review.item}>
                          {review.items || review.item || 'Ordered Items'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-700 font-medium leading-relaxed mb-3">
                      "{commentText}"
                    </p>
                    
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2 border-t border-slate-50">
                      <span>Order Ref: {review.orderNumber || `#${review.orderId?.slice(-6).toUpperCase()}`}</span>
                      {review.runnerRating && (
                        <span className="text-slate-500">
                          Runner Delivery Rating: {review.runnerRating} ★
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">No Reviews Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {selectedRating !== 'ALL'
                    ? `No ${selectedRating}-star reviews match your current filter. Try selecting "All Reviews".`
                    : 'No customer reviews have been submitted yet. Reviews left on delivered orders will appear here automatically.'}
                </p>
                {selectedRating !== 'ALL' && (
                  <button
                    onClick={() => setSelectedRating('ALL')}
                    className="px-4 py-2 bg-orange-50 text-orange-600 text-xs font-bold rounded-full hover:bg-orange-100 transition"
                  >
                    View All Reviews
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Summary */}
        {!loading && !error && filteredReviews.length > 0 && (
          <div className="mt-8 text-center text-xs font-bold text-slate-400">
            Showing {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
            {selectedRating !== 'ALL' ? ` with ${selectedRating} Star rating` : ''}
          </div>
        )}

      </div>
    </>
  );
};

export default ShopCustomerReviews;
