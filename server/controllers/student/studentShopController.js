import Shop from '../../models/Shop.js';
import MenuItem from '../../models/MenuItem.js';

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

// @desc    Get detailed shop info with categorized menu items
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

    res.status(200).json({
      success: true,
      shop,
      categories,
      menuItems
    });
  } catch (error) {
    console.error('getStudentShopDetails Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
