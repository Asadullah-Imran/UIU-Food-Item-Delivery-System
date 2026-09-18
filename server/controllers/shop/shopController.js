import Shop from '../models/Shop.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Get all active campus shops
// @route   GET /api/shops
// @access  Public
export const getShops = async (req, res) => {
  try {
    const { search, category, isFeatured, isOpen } = req.query;
    const query = { isApproved: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (isOpen !== undefined) {
      query.isOpen = isOpen === 'true';
    }

    const shops = await Shop.find(query).sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shops.length,
      shops
    });
  } catch (error) {
    console.error('getShops Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching shops'
    });
  }
};

// @desc    Get single shop details and its menu items
// @route   GET /api/shops/:shopId
// @access  Public
export const getShopById = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId).populate('owner', 'name email phone');
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const menuItems = await MenuItem.find({ shop: shop._id }).sort({ isPopular: -1, createdAt: -1 });

    // Group items by category for easy frontend tab rendering
    const categories = ['All', ...new Set(menuItems.map((item) => item.category))];

    res.status(200).json({
      success: true,
      shop,
      menuItems,
      categories
    });
  } catch (error) {
    console.error('getShopById Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching shop details'
    });
  }
};

// @desc    Get logged-in shop owner's shop & full menu
// @route   GET /api/shops/my-shop
// @access  Private (Shop owner only)
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({
      owner: req.user._id
    });
  }

    if (!shop) {
    return res.status(404).json({
      success: false,
      message: 'No shop associated with this account'
    });
  }

  const menuItems = await MenuItem.find({ shop: shop._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    shop,
    menuItems
  });
} catch (error) {
  console.error('getMyShop Error:', error);
  res.status(500).json({
    success: false,
    message: error.message || 'Error fetching shop information'
  });
}
};

// @desc    Update shop profile
// @route   PUT /api/shops/profile
// @access  Private (Shop owner)
export const updateShopProfile = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const {
      name,
      category,
      deliveryTime,
      minOrder,
      image,
      banner,
      location,
      phone,
      isOpen,
      openingHours,
      tags
    } = req.body;

    if (name) shop.name = name;
    if (category) shop.category = category;
    if (deliveryTime) shop.deliveryTime = deliveryTime;
    if (minOrder !== undefined) shop.minOrder = minOrder;
    if (image) shop.image = image;
    if (banner) shop.banner = banner;
    if (location) shop.location = location;
    if (phone) shop.phone = phone;
    if (isOpen !== undefined) shop.isOpen = isOpen;
    if (openingHours) shop.openingHours = openingHours;
    if (tags) shop.tags = tags;

    await shop.save();

    res.status(200).json({
      success: true,
      message: 'Shop profile updated successfully',
      shop
    });
  } catch (error) {
    console.error('updateShopProfile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating shop profile'
    });
  }
};

// @desc    Add a new menu item
// @route   POST /api/shops/menu
// @access  Private (Shop owner)
export const addMenuItem = async (req, res) => {
  try {
    let shop = await Shop.findOne({ owner: req.user._id });

    if (!shop) {
      // Auto-create shop record if missing
      shop = await Shop.create({
        owner: req.user._id,
        name: req.user.name || 'Campus Food Shop',
        category: 'Food Court',
        location: 'UIU Food Court Counter #1'
      });
    }

    const {
      name,
      description,
      price,
      category = 'Meals',
      image,
      preparationTime = '10-15 mins',
      dietary = ['Halal'],
      discount = 0,
      taxRate = 5,
      stockQuantity = 50,
      lowStockWarning = 10,
      isAvailable = true,
      todaySpecial = false,
      featured = false,
      recommended = true
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item name and price are required'
      });
    }

    const menuItem = await MenuItem.create({
      shop: shop._id,
      name,
      description: description || '',
      price: Number(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
      preparationTime,
      dietary: Array.isArray(dietary) ? dietary : [dietary],
      discount: Number(discount) || 0,
      taxRate: Number(taxRate) || 5,
      stockQuantity: Number(stockQuantity) || 50,
      lowStockWarning: Number(lowStockWarning) || 10,
      isAvailable: Boolean(isAvailable),
      todaySpecial: Boolean(todaySpecial),
      featured: Boolean(featured),
      recommended: Boolean(recommended)
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    console.error('addMenuItem Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding menu item'
    });
  }
};

// @desc    Update a menu item
// @route   PUT /api/shops/menu/:itemId
// @access  Private (Shop owner)
export const updateMenuItem = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const item = await MenuItem.findOne({ _id: req.params.itemId, shop: shop._id });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found or does not belong to your shop'
      });
    }

    const allowedUpdates = [
      'name',
      'description',
      'price',
      'category',
      'image',
      'preparationTime',
      'dietary',
      'discount',
      'taxRate',
      'stockQuantity',
      'lowStockWarning',
      'isAvailable',
      'todaySpecial',
      'featured',
      'recommended',
      'isPopular'
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      menuItem: item
    });
  } catch (error) {
    console.error('updateMenuItem Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating menu item'
    });
  }
};

// @desc    Toggle item In-Stock / Out-of-Stock
// @route   PATCH /api/shops/menu/:itemId/availability
// @access  Private (Shop owner)
export const toggleItemAvailability = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const item = await MenuItem.findOne({ _id: req.params.itemId, shop: shop._id });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    if (req.body.isAvailable !== undefined) {
      item.isAvailable = Boolean(req.body.isAvailable);
    } else {
      item.isAvailable = !item.isAvailable;
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: `Item marked as ${item.isAvailable ? 'In Stock' : 'Out of Stock'}`,
      isAvailable: item.isAvailable,
      menuItem: item
    });
  } catch (error) {
    console.error('toggleItemAvailability Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating availability'
    });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/shops/menu/:itemId
// @access  Private (Shop owner)
export const deleteMenuItem = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const item = await MenuItem.findOneAndDelete({ _id: req.params.itemId, shop: shop._id });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found or does not belong to your shop'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('deleteMenuItem Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting menu item'
    });
  }
};
