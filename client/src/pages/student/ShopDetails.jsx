import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Clock, Truck, Plus, Minus, ChevronRight, ShoppingCart, ArrowRight, Check, Star, Loader2, AlertCircle } from 'lucide-react';
import StudentSidebarFix from './StudentSidebarFix';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';

export default function ShopDetails() {
  const { shopId } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { cart, addToCart, cartTotal, setIsCartVisible } = useCart();

  const [shop, setShop] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [activeCategory, setActiveCategory] = useState("All");
  const [itemQuantities, setItemQuantities] = useState({});
  const [addedAnimation, setAddedAnimation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/student/shops/${shopId}/reviews`);
      const data = await res.json();
      if (res.ok && data.reviews) {
        setReviews(data.reviews);
        if (data.averageRating !== undefined) {
          setShop(prev => prev ? { ...prev, rating: data.averageRating, reviewsCount: data.reviewsCount } : prev);
        }
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        const res = await fetch(`/api/student/shops/${shopId}`);
        const data = await res.json();
        if (res.ok && data.shop) {
          setShop({
            ...data.shop,
            id: data.shop._id,
            deliveryFee: data.shop.deliveryFee || 30
          });
          const normalized = (data.menuItems || []).map(item => ({
            ...item,
            id: item._id,
            shopId: data.shop._id,
            shopName: data.shop.name
          }));
          setMenuItems(normalized);
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          if (data.reviews) {
            setReviews(data.reviews);
          }
        } else {
          setFetchError(data.message || 'Shop not found.');
        }
      } catch (err) {
        console.error('Failed to fetch shop details:', err);
        setFetchError('Unable to load shop. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId]);

  // Filtered menu items — live data only
  const itemsToDisplay = menuItems.filter(item => {
    if (activeCategory === "All") return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase() ||
           (activeCategory === "Popular" && (item.isPopular || item.isBestSeller));
  });

  const deliveryFee = shop?.deliveryFee || 30;
  const totalWithDelivery = cart.length > 0 ? cartTotal + deliveryFee : 0;

  const handleQuantityChange = (itemId, change) => {
    setItemQuantities(prev => {
      const current = prev[itemId] || 1;
      const next = Math.max(1, current + change);
      return { ...prev, [itemId]: next };
    });
  };

  const handleAddItem = (item) => {
    const targetId = item._id || item.id;
    const qty = itemQuantities[targetId] || 1;
    for (let i = 0; i < qty; i++) {
      addToCart({
        ...item,
        id: targetId,
        _id: targetId,
        shopId: shop?._id || shop?.id,
        shopName: shop?.name
      });
    }
    setAddedAnimation(targetId);
    setTimeout(() => setAddedAnimation(null), 1500);
  };

  // --- Loading skeleton ---
  if (isLoading) {
    return (
      <>
        <StudentSidebarFix isShops />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-slate-200 rounded-3xl" />
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-2xl" />)}
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- Error / not found state ---
  if (fetchError || !shop) {
    return (
      <>
        <StudentSidebarFix isShops />
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Shop Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">{fetchError || 'This shop could not be loaded.'}</p>
          <Link
            to="/dashboard/student/shops"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Browse All Shops
          </Link>
        </div>
      </>
    );
  }


  return (
    <>
      <StudentSidebarFix isShops />
      
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm font-medium text-slate-500 mb-6">
        <Link to="/dashboard/student" className="hover:text-orange-500 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to="/dashboard/student/shops" className="hover:text-orange-500 transition-colors">Browse Shops</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-orange-600 font-bold">{shop.name}</span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-8 pb-8">
        <div className="relative h-64 lg:h-72 w-full">
          <img
            src={shop.banner || shop.image}
            alt={`${shop.name} cover`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <button 
            onClick={() => toggleFavorite(shop.id)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all z-10"
            aria-label="Toggle favorite"
          >
            <Heart className={`w-5 h-5 transition-colors duration-200 ${isFavorite(shop.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
        
        <div className="px-8 flex flex-col md:flex-row relative">
          {/* Shop profile picture overlapping banner */}
          <div className="w-28 h-28 rounded-2xl shadow-xl border-4 border-white -mt-14 mb-4 md:mb-0 md:mr-6 flex-shrink-0 z-10 overflow-hidden bg-orange-50">
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=F37623&color=fff&size=112&bold=true`;
              }}
            />
          </div>
          
          <div className="pt-2 md:pt-4 flex-1">
            <div className="flex items-center mb-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mr-4">{shop.name}</h1>
              {shop.isOpen && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Open
                </span>
              )}
            </div>
            
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mb-4 leading-relaxed">
              {shop.description || "The heart of campus dining. Fresh, healthy, and affordable meals served daily."}
            </p>
            
            <div className="flex items-center space-x-6 text-sm font-bold text-slate-700">
              <div className="flex items-center">
                <span className="text-orange-500 mr-1.5 text-lg">★</span> {shop.rating} <span className="text-slate-400 font-medium ml-1">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-slate-400" /> {shop.deliveryTime}
              </div>
              <div className="flex items-center">
                <Truck className="w-4 h-4 mr-1.5 text-slate-400" /> ৳{shop.deliveryFee} fee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column - Menu & Reviews */}
        <div className="flex-1 min-w-0">
          
          {/* Category Filter Navigation */}
          <div className="sticky top-0 bg-[#F9FAFB]/90 backdrop-blur-md z-10 py-4 mb-4">
            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-105' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-2">
              <h3 className="text-lg font-bold text-slate-800">
                {activeCategory === "All" ? "Full Menu" : activeCategory} ({itemsToDisplay.length})
              </h3>
            </div>
            
            {itemsToDisplay.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-100">
                <p>No items found in this category for {shop.name}.</p>
                <button 
                  onClick={() => setActiveCategory("All")}
                  className="mt-3 text-orange-500 font-bold hover:underline text-sm"
                >
                  View All Items
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {itemsToDisplay.map(item => {
                  const qty = itemQuantities[item.id] || 1;
                  const isAdded = addedAnimation === item.id;
                  
                  return (
                    <div key={item.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col relative group">
                      
                      {item.isBestSeller && (
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-extrabold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm z-10 border border-orange-100">
                          Best Seller
                        </span>
                      )}
                      
                      <div className="h-48 overflow-hidden bg-slate-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg text-slate-800">{item.name}</h4>
                          <span className="font-bold text-orange-600">৳{item.price}</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                          {item.description && item.description.length > 150
                            ? item.description.slice(0, 150).trimEnd() + '...'
                            : item.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                          <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            <button 
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-sm text-slate-800">{qty}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => handleAddItem(item)}
                            className={`font-bold py-2 px-5 rounded-xl text-sm transition-all flex items-center shadow-sm active:scale-95 ${
                              isAdded 
                                ? 'bg-green-500 text-white' 
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-4 h-4 mr-1.5" /> Added
                              </>
                            ) : (
                              'Add to Cart'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-800">Student Reviews</h3>
                <span className="text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                  {reviews.length}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowReviewModal(true);
                  setReviewRating(0);
                  setReviewComment('');
                  setReviewError(null);
                  setReviewSuccess(false);
                }}
                className="text-sm font-bold text-orange-600 hover:underline cursor-pointer"
              >
                Write a Review
              </button>
            </div>

            {reviewSuccess && (
              <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                Thank you! Your review has been submitted successfully.
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-sm">
                  <Star className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  No reviews yet for this shop. Be the first student to review!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id || rev._id || rev.orderId}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.user}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.user || 'Student')}&background=F37623&color=fff&bold=true`;
                          }}
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">{rev.user}</h4>
                          <span className="text-[11px] font-medium text-slate-400">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Student'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= (Number(rev.rating) || 5)
                                ? 'fill-orange-400 text-orange-400'
                                : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-sm text-slate-600 pl-13 mt-1 leading-relaxed">
                        {rev.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* REVIEW MODAL */}
          {showReviewModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">

                {/* Modal Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-extrabold">Write a Review</h3>
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      aria-label="Close"
                    >
                      <span className="text-white text-lg leading-none">&times;</span>
                    </button>
                  </div>
                  <p className="text-orange-100 text-sm font-medium">{shop.name}</p>
                </div>

                <div className="p-6 space-y-5">
                  {reviewError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {/* Star Rating Picker */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Your Rating</p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setReviewHover(star)}
                          onMouseLeave={() => setReviewHover(0)}
                          className="transition-transform hover:scale-125 active:scale-110"
                          aria-label={`${star} star`}
                        >
                          <Star
                            className={`w-9 h-9 transition-colors ${
                              star <= (reviewHover || reviewRating)
                                ? 'fill-orange-400 text-orange-400'
                                : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-bold text-slate-500">
                        {(reviewHover || reviewRating) > 0 && [
                          '', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'
                        ][reviewHover || reviewRating]}
                      </span>
                    </div>
                  </div>

                  {/* Comment Textarea */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Comment</p>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value.slice(0, 500))}
                      placeholder="Tell other students about your experience — food quality, service, packaging..."
                      rows={4}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none transition-all"
                    />
                    <p className="text-right text-[10px] text-slate-400 font-semibold mt-1">{reviewComment.length}/500</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={reviewRating === 0 || reviewSubmitting}
                      onClick={async () => {
                        if (reviewRating === 0) return;
                        setReviewSubmitting(true);
                        setReviewError(null);

                        try {
                          const token = localStorage.getItem('uiu_auth_token');
                          if (!token) {
                            setReviewError('Please log in as a student to write a review.');
                            setReviewSubmitting(false);
                            return;
                          }

                          const res = await fetch(`/api/student/shops/${shop._id || shop.id || shopId}/review`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              rating: reviewRating,
                              comment: reviewComment
                            })
                          });

                          const data = await res.json();
                          if (!res.ok) {
                            throw new Error(data.message || 'Failed to submit review');
                          }

                          setShowReviewModal(false);
                          setReviewSuccess(true);
                          setReviewRating(0);
                          setReviewComment('');
                          setTimeout(() => setReviewSuccess(false), 4000);

                          // Fetch reviews immediately so newly posted review shows up
                          await fetchReviews();
                        } catch (err) {
                          console.error('Submit review error:', err);
                          setReviewError(err.message || 'Failed to submit review. Please try again.');
                        } finally {
                          setReviewSubmitting(false);
                        }
                      }}
                      className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
                    >
                      {reviewSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                      ) : (
                        <>Submit Review</>
                      )}
                    </button>
                  </div>

                  {reviewRating === 0 && (
                    <p className="text-center text-xs text-slate-400 font-semibold -mt-2">Please select a star rating to submit</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column - Sticky Cart */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-4 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            
            <div 
              onClick={() => setIsCartVisible(true)}
              className="bg-orange-500 p-5 flex items-center justify-between text-white cursor-pointer hover:bg-orange-600 transition-colors"
            >
              <div className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-3" />
                <h3 className="font-bold text-lg">Your Order</h3>
              </div>
              <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">{cart.length} items</span>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto max-h-[320px]">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm mb-2">Your cart is empty.</p>
                  <p className="text-xs text-slate-400">Select items from the menu to build your order.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                      <div className="flex items-center text-slate-800">
                        <span className="bg-slate-100 text-slate-600 font-bold text-xs px-2 py-1 rounded mr-3">{item.quantity}x</span>
                        <span className="font-medium truncate max-w-[130px]">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-5 bg-slate-50 border-t border-slate-100">
                <div className="space-y-2 text-sm text-slate-500 font-medium border-b border-slate-200 border-dashed pb-4 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-800">৳{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-slate-800">৳{deliveryFee}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-6">
                  <span className="text-slate-800 font-bold">Total</span>
                  <span className="text-2xl font-extrabold text-orange-600">৳{totalWithDelivery}</span>
                </div>
                
                <Link to="/checkout" className="block w-full">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center group active:scale-95">
                    Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </>
  );
}

