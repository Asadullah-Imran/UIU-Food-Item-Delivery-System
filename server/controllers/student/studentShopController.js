import Shop from '../../models/Shop.js';
import MenuItem from '../../models/MenuItem.js';
import Order from '../../models/Order.js';

// @desc    Get all active & approved campus shops for student browsing
// @route   GET /api/student/shops
// @access  Public / Student
export const getStudentShops = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { isApproved: true };

    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const shops = await Shop.find(query).sort({ isOpen: -1, rating: -1 });

    res.status(200).json({
      success: true,
      count: shops.length,
      shops
    });
  } catch (error) {
    console.error('getStudentShops Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get detailed shop info with categorized menu items and customer reviews
// @route   GET /api/student/shops/:shopId
// @access  Public / Student
export const getStudentShopDetails = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Campus shop not found' });
    }

    // Retrieve menu items for this shop
    const menuItems = await MenuItem.find({ shop: shop._id, isAvailable: true }).sort({ category: 1 });

    // Extract unique categories
    const categories = ['All', ...new Set(menuItems.map((item) => item.category).filter(Boolean))];

    // Retrieve verified customer reviews for this shop
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
      shop,
      categories,
      menuItems,
      reviews
    });
  } catch (error) {
    console.error('getStudentShopDetails Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
