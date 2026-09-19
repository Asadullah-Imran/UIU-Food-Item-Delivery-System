import Shop from '../../models/Shop.js';
import MenuItem from '../../models/MenuItem.js';
import Order from '../../models/Order.js';
import cloudinary from '../../config/cloudinary.js';
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary
} from '../../utils/cloudinaryUpload.js';

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

    const menuItems = await MenuItem.find({
      shop: shop._id,
      isAvailable: true
    }).sort({ isPopular: -1, createdAt: -1 });

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

// Helper: parse boolean values that may arrive as strings from FormData
const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined) {
    return defaultValue;
  }

  return value === true || value === 'true';
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
      discount,
      taxRate,
      stockQuantity,
      lowStockWarning,
      isAvailable,
      todaySpecial,
      featured,
      recommended
    } = req.body;

    // --- Field Validation ---

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Item name is required'
      });
    }

    const numericPrice = Number(price);
    if (price === undefined || Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    const numericStock = stockQuantity !== undefined ? Number(stockQuantity) : 50;
    if (Number.isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock quantity cannot be negative'
      });
    }

    const numericDiscount = discount !== undefined ? Number(discount) : 0;
    if (Number.isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
      return res.status(400).json({
        success: false,
        message: 'Discount must be between 0 and 100'
      });
    }

    const numericTaxRate = taxRate !== undefined ? Number(taxRate) : 5;
    if (Number.isNaN(numericTaxRate) || numericTaxRate < 0) {
      return res.status(400).json({
        success: false,
        message: 'Tax rate cannot be negative'
      });
    }

    const numericLowStock = lowStockWarning !== undefined ? Number(lowStockWarning) : 10;
    if (Number.isNaN(numericLowStock) || numericLowStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Low-stock warning cannot be negative'
      });
    }

    let imageUrl =
      (image && typeof image === 'string' && image.startsWith('http'))
        ? image
        : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80';

    let imagePublicId = '';

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    let parsedDietary = ['Halal'];
    if (dietary) {
      if (Array.isArray(dietary)) {
        parsedDietary = dietary;
      } else {
        try {
          parsedDietary = JSON.parse(dietary);
        } catch {
          parsedDietary = [dietary];
        }
      }
    }

    const menuItem = await MenuItem.create({
      shop: shop._id,

      name: name.trim(),
      description: description?.trim() || '',

      category: category || 'Meals',

      price: numericPrice,

      image: imageUrl,
      imagePublicId,

      preparationTime: preparationTime || '10-15 mins',

      stockQuantity: numericStock,

      lowStockWarning: numericLowStock,

      discount: numericDiscount,

      taxRate: numericTaxRate,

      dietary: parsedDietary,

      isAvailable: parseBoolean(isAvailable, true),

      todaySpecial: parseBoolean(todaySpecial),

      featured: parseBoolean(featured),

      recommended: parseBoolean(recommended, true)
    });

    return res.status(201).json({
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
    const shop = await Shop.findOne({
      owner: req.user._id
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const item = await MenuItem.findOne({
      _id: req.params.itemId,
      shop: shop._id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    if (req.body.name !== undefined) {
      const name = req.body.name.trim();

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Item name cannot be empty'
        });
      }

      item.name = name;
    }

    if (req.body.price !== undefined) {
      const price = Number(req.body.price);

      if (Number.isNaN(price) || price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be greater than 0'
        });
      }

      item.price = price;
    }

    if (req.body.stockQuantity !== undefined) {
      const stockQuantity = Number(req.body.stockQuantity);

      if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock quantity cannot be negative'
        });
      }

      item.stockQuantity = stockQuantity;
    }

    if (req.body.discount !== undefined) {
      const discount = Number(req.body.discount);

      if (Number.isNaN(discount) || discount < 0 || discount > 100) {
        return res.status(400).json({
          success: false,
          message: 'Discount must be between 0 and 100'
        });
      }

      item.discount = discount;
    }

    if (req.body.taxRate !== undefined) {
      const taxRate = Number(req.body.taxRate);

      if (Number.isNaN(taxRate) || taxRate < 0) {
        return res.status(400).json({
          success: false,
          message: 'Tax rate cannot be negative'
        });
      }

      item.taxRate = taxRate;
    }

    if (req.body.lowStockWarning !== undefined) {
      const lowStockWarning = Number(req.body.lowStockWarning);

      if (Number.isNaN(lowStockWarning) || lowStockWarning < 0) {
        return res.status(400).json({
          success: false,
          message: 'Low-stock warning cannot be negative'
        });
      }

      item.lowStockWarning = lowStockWarning;
    }

    if (req.body.description !== undefined) {
      item.description = req.body.description.trim();
    }

    if (req.body.category !== undefined) {
      item.category = req.body.category.trim();
    }

    if (req.body.preparationTime !== undefined) {
      item.preparationTime = req.body.preparationTime.trim();
    }

    if (req.body.dietary !== undefined) {
      if (Array.isArray(req.body.dietary)) {
        item.dietary = req.body.dietary;
      } else {
        try {
          const parsedDietary = JSON.parse(req.body.dietary);

          if (!Array.isArray(parsedDietary)) {
            return res.status(400).json({
              success: false,
              message: 'Dietary tags must be an array'
            });
          }

          item.dietary = parsedDietary;
        } catch {
          return res.status(400).json({
            success: false,
            message: 'Invalid dietary tags format'
          });
        }
      }
    }

    if (req.body.isAvailable !== undefined) {
      item.isAvailable = parseBoolean(req.body.isAvailable, item.isAvailable);
    }

    if (req.body.todaySpecial !== undefined) {
      item.todaySpecial = parseBoolean(req.body.todaySpecial, item.todaySpecial);
    }

    if (req.body.featured !== undefined) {
      item.featured = parseBoolean(req.body.featured, item.featured);
    }

    if (req.body.recommended !== undefined) {
      item.recommended = parseBoolean(req.body.recommended, item.recommended);
    }

    if (req.body.isPopular !== undefined) {
      item.isPopular = parseBoolean(req.body.isPopular, item.isPopular);
    }

    let oldImagePublicId = null;

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file.buffer);

      oldImagePublicId = item.imagePublicId;

      item.image = uploadResult.secure_url;
      item.imagePublicId = uploadResult.public_id;
    }

    await item.save();

    if (oldImagePublicId) {
      try {
        await deleteImageFromCloudinary(oldImagePublicId);
      } catch (error) {
        console.error('Failed to delete old Cloudinary image:', error);
      }
    }

    return res.status(200).json({
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
    const shop = await Shop.findOne({
      owner: req.user._id
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const item = await MenuItem.findOne({
      _id: req.params.itemId,
      shop: shop._id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    if (req.body && req.body.isAvailable !== undefined) {
      item.isAvailable =
        req.body.isAvailable === true ||
        req.body.isAvailable === 'true';
    } else {
      item.isAvailable = !item.isAvailable;
    }

    if (
      item.isAvailable &&
      item.stockQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot mark an item available when stock is 0'
      });
    }

    await item.save();

    return res.status(200).json({
      success: true,
      message: item.isAvailable
        ? 'Menu item is now available'
        : 'Menu item is now unavailable',
      menuItem: item
    });
  } catch (error) {
    console.error(
      'toggleItemAvailability Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update item availability'
    });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/shops/menu/:itemId
// @access  Private (Shop owner)
export const deleteMenuItem = async (req, res) => {
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

    const item = await MenuItem.findOne({
      _id: req.params.itemId,
      shop: shop._id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const imagePublicId = item.imagePublicId;

    await item.deleteOne();

    if (imagePublicId) {
      try {
        await deleteImageFromCloudinary(
          imagePublicId
        );
      } catch (error) {
        console.error(
          'Cloudinary image cleanup failed:',
          error
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    // Invalid MongoDB ObjectId (e.g. "abc123") → return 404 not 500
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    console.error(
      'deleteMenuItem Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to delete menu item'
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

// Shop Orders Controller exports
export {
  getShopOrders,
  getShopOrderById,
  acceptShopOrder,
  acceptOrder,
  rejectShopOrder,
  rejectOrder,
  startPreparingOrder,
  markOrderReady
} from './shopOrderController.js';


