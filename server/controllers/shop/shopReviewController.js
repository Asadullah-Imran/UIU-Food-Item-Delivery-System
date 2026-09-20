import Shop from '../../models/Shop.js';
import Order from '../../models/Order.js';

/**
 * @desc    Get all reviews and ratings for the authenticated shop
 * @route   GET /api/shops/reviews
 * @access  Private (Shop Owner, Admin)
 */
export const getShopReviews = async (req, res) => {
  try {
    const shop = await Shop.findOne({
      owner: req.user._id
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const filter = {
      shop: shop._id,
      status: 'DELIVERED',
      'ratings.shopRating': {
        $exists: true,
        $ne: null
      }
    };

    if (req.query.rating) {
      const rating = Number(req.query.rating);

      if (
        Number.isNaN(rating) ||
        rating < 1 ||
        rating > 5
      ) {
        return res.status(400).json({
          success: false,
          message: 'Rating filter must be between 1 and 5'
        });
      }

      filter['ratings.shopRating'] = rating;
    }

    // Retrieve all rated orders for overall stats and rating distribution
    const allShopRatedOrders = await Order.find({
      shop: shop._id,
      status: 'DELIVERED',
      'ratings.shopRating': {
        $exists: true,
        $ne: null
      }
    }).select('ratings');

    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    let totalRatingSum = 0;
    for (const ord of allShopRatedOrders) {
      const r = Number(ord.ratings?.shopRating);
      if (r >= 1 && r <= 5) {
        distribution[r]++;
        totalRatingSum += r;
      }
    }

    const overallAverageRating = allShopRatedOrders.length > 0
      ? Number((totalRatingSum / allShopRatedOrders.length).toFixed(1))
      : Number((shop.rating || 0).toFixed(1));

    const orders = await Order.find(filter)
      .populate('student', 'name universityId email avatar')
      .sort({
        updatedAt: -1,
        createdAt: -1
      });

    const reviews = orders.map((order) => {
      const itemsSummary = order.items && order.items.length > 0
        ? order.items.map((i) => `${i.name}${i.quantity > 1 ? ` (x${i.quantity})` : ''}`).join(', ')
        : 'Delivered Order';

      return {
        id: order._id,
        orderId: order._id,
        orderNumber: order.orderNumber,
        student: order.student ? {
          _id: order.student._id,
          name: order.student.name,
          universityId: order.student.universityId,
          email: order.student.email,
          avatar: order.student.avatar
        } : null,
        user: order.student?.name || 'UIU Student',
        avatar: order.student?.avatar || 'https://i.pravatar.cc/150?u=' + order.student?._id,
        rating: order.ratings?.shopRating ?? 5,
        shopRating: order.ratings?.shopRating ?? null,
        runnerRating: order.ratings?.runnerRating ?? null,
        comment: order.ratings?.feedback || '',
        feedback: order.ratings?.feedback || '',
        text: order.ratings?.feedback || '',
        item: order.items?.[0]?.name || itemsSummary,
        items: itemsSummary,
        createdAt: order.updatedAt || order.createdAt,
        time: order.updatedAt ? new Date(order.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
        verified: true
      };
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      totalReviews: allShopRatedOrders.length,
      averageRating: overallAverageRating,
      distribution,
      reviews
    });
  } catch (error) {
    console.error('getShopReviews Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch shop reviews'
    });
  }
};
