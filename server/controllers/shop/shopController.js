import Shop from '../../models/Shop.js';
import MenuItem from '../../models/MenuItem.js';
import cloudinary from '../../config/cloudinary.js';

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

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
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

    // Field-level validations
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Shop name cannot be empty'
      });
    }

    if (
      minOrder !== undefined &&
      (Number.isNaN(Number(minOrder)) || Number(minOrder) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Minimum order cannot be negative'
      });
    }

    if (
      phone !== undefined &&
      !/^\+?[0-9\s-]{10,20}$/.test(phone.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    if (name !== undefined) shop.name = name.trim();
    if (category !== undefined) shop.category = category.trim();
    if (deliveryTime !== undefined) shop.deliveryTime = deliveryTime.trim();
    if (minOrder !== undefined) shop.minOrder = Number(minOrder);
    if (image !== undefined) shop.image = image;
    if (banner !== undefined) shop.banner = banner;
    if (location !== undefined) shop.location = location.trim();
    if (phone !== undefined) shop.phone = phone.trim();
    if (isOpen !== undefined) shop.isOpen = Boolean(isOpen);
    if (openingHours !== undefined) shop.openingHours = openingHours;
    if (tags !== undefined) shop.tags = Array.isArray(tags) ? tags : [tags];

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
    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
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

// Helper: upload a buffer to Cloudinary with automatic compression and return the result object
const uploadBufferToCloudinary = (
  buffer,
  folder,
  options = {}
) => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: options.transformation || [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    stream.end(buffer);
  });
};

// @desc    Upload / replace shop profile image
// @route   PUT /api/shops/profile/image
// @access  Private (Shop owner)
export const updateShopProfileImage = async (
  req,
  res
) => {
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image'
      });
    }

    // Auto-compress and square-crop profile avatar
    const result =
      await uploadBufferToCloudinary(
        req.file.buffer,
        'uiu-delivery/shop-profile',
        {
          transformation: [
            { width: 600, height: 600, crop: 'fill', gravity: 'face' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        }
      );

    shop.image = result.secure_url;

    await shop.save();

    return res.status(200).json({
      success: true,
      message:
        'Shop profile image updated successfully',
      shop
    });
  } catch (error) {
    console.error(
      'updateShopProfileImage Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update shop profile image'
    });
  }
};

// Backwards compatibility alias
export const uploadShopImage = updateShopProfileImage;

// @desc    Upload / replace shop banner image
// @route   PUT /api/shops/profile/banner
// @access  Private (Shop owner)
export const updateShopBanner = async (
  req,
  res
) => {
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a banner image'
      });
    }

    // Auto-compress and limit banner dimensions to max 1600px width
    const result =
      await uploadBufferToCloudinary(
        req.file.buffer,
        'uiu-delivery/shop-banner',
        {
          transformation: [
            { width: 1600, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        }
      );

    shop.banner = result.secure_url;

    await shop.save();

    return res.status(200).json({
      success: true,
      message:
        'Shop banner updated successfully',
      shop
    });
  } catch (error) {
    console.error(
      'updateShopBanner Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update shop banner'
    });
  }
};

// Backwards compatibility alias
export const uploadShopBanner = updateShopBanner;


