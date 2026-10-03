import Order from '../../models/Order.js';
import Shop from '../../models/Shop.js';
import User from '../../models/User.js';

// @desc    Submit 5-star rating and review for shop & runner
// @route   POST /api/student/orders/:orderId/rate
// @access  Private (Student)
export const rateOrderAndRunner = async (req, res) => {
  try {
    const { shopRating, runnerRating, feedback } = req.body;

    const order = await Order.findOne({
      _id: req.params.orderId,
      student: req.user.id
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'DELIVERED') {
      return res.status(400).json({
        success: false,
        message: 'Only delivered orders can be rated'
      });
    }

    order.ratings = {
      shopRating: Number(shopRating) || 5,
      runnerRating: Number(runnerRating) || 5,
      feedback: feedback || ''
    };

    await order.save();

    // Update Shop Average Rating
    if (shopRating) {
      const shop = await Shop.findById(order.shop);
      if (shop) {
        const totalReviews = (shop.reviewsCount || 0) + 1;
        const currentTotal = (shop.rating || 4.8) * (shop.reviewsCount || 1);
        const newAvg = (currentTotal + Number(shopRating)) / totalReviews;
        shop.rating = Number(newAvg.toFixed(1));
        shop.reviewsCount = totalReviews;
        await shop.save();
      }
    }

    // Update Runner Average Rating
    if (runnerRating && order.runner) {
      const runner = await User.findById(order.runner);
      if (runner && runner.runnerDetails) {
        const trips = runner.runnerDetails.totalTrips || 1;
        const currentRating = runner.runnerDetails.rating || 5.0;
        const newRating = (currentRating * (trips - 1) + Number(runnerRating)) / trips;
        runner.runnerDetails.rating = Number(newRating.toFixed(1));
        await runner.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Thank you for your rating and feedback!',
      ratings: order.ratings
    });
  } catch (error) {
    console.error('rateOrderAndRunner Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews for a specific shop (student browsing view)
// @route   GET /api/student/shops/:shopId/reviews
// @access  Public / Student
export const getStudentShopReviews = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const ratedOrders = await Order.find({
      shop: shop._id,
      status: 'DELIVERED',
      'ratings.shopRating': { $exists: true, $ne: null }
    })
      .populate('student', 'name email avatar universityId')
      .sort({ updatedAt: -1, createdAt: -1 });

    const reviews = ratedOrders.map((order) => ({
      id: order._id,
      orderId: order._id,
      user: order.student?.name || 'UIU Student',
      avatar: order.student?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.student?.name || 'Student')}&background=F37623&color=fff`,
      rating: order.ratings?.shopRating || 5,
      comment: order.ratings?.feedback || '',
      createdAt: order.updatedAt || order.createdAt
    }));

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: shop.rating || 5,
      reviewsCount: shop.reviewsCount || reviews.length,
      reviews
    });
  } catch (error) {
    console.error('getStudentShopReviews Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit a review and rating for a shop directly from shop page
// @route   POST /api/student/shops/:shopId/review
// @access  Private (Student)
export const submitStudentShopReview = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { rating, comment } = req.body;

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5'
      });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const studentId = req.user.id || req.user._id;

    // Check if the student has a delivered order for this shop
    let order = await Order.findOne({
      shop: shop._id,
      student: studentId,
      status: 'DELIVERED'
    }).sort({ createdAt: -1 });

    if (order) {
      // Update existing order rating
      order.ratings = {
        shopRating: numericRating,
        runnerRating: order.ratings?.runnerRating || 5,
        feedback: comment ? comment.trim() : ''
      };
      await order.save();
    } else {
      // Create a delivered order entry for verified rating record
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      order = await Order.create({
        orderNumber: `REV-${Date.now().toString().slice(-6)}-${randomCode}`,
        student: studentId,
        shop: shop._id,
        items: [{ name: 'Direct Campus Review', price: 0, quantity: 1 }],
        billing: {
          subtotal: 0,
          deliveryFee: 0,
          platformFee: 0,
          runnerReward: 0,
          shopAmount: 0,
          discount: 0,
          grandTotal: 0
        },
        payment: {
          method: 'wallet',
          status: 'paid'
        },
        status: 'DELIVERED',
        ratings: {
          shopRating: numericRating,
          runnerRating: 5,
          feedback: comment ? comment.trim() : ''
        }
      });
    }

    // Recalculate shop average rating and count accurately from all rated orders
    const allRatedOrders = await Order.find({
      shop: shop._id,
      status: 'DELIVERED',
      'ratings.shopRating': { $exists: true, $ne: null }
    });

    const totalRatings = allRatedOrders.length;
    const sumRatings = allRatedOrders.reduce(
      (acc, curr) => acc + (Number(curr.ratings?.shopRating) || 0),
      0
    );
    const newAverage = totalRatings > 0 ? Number((sumRatings / totalRatings).toFixed(1)) : numericRating;

    shop.rating = newAverage;
    shop.reviewsCount = totalRatings;
    await shop.save();

    const studentUser = await User.findById(studentId);

    const formattedReview = {
      id: order._id,
      orderId: order._id,
      user: studentUser?.name || 'UIU Student',
      avatar: studentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentUser?.name || 'Student')}&background=F37623&color=fff`,
      rating: numericRating,
      comment: comment ? comment.trim() : '',
      createdAt: order.updatedAt || order.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Review submitted successfully!',
      review: formattedReview,
      shopRating: newAverage,
      reviewsCount: totalRatings
    });
  } catch (error) {
    console.error('submitStudentShopReview Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

