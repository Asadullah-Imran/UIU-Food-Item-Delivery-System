import Shop from '../../models/Shop.js';
import User from '../../models/User.js';

// ---------------------------------------------------------------------------
// Allowed sort keys (prevent arbitrary MongoDB injection)
// ---------------------------------------------------------------------------
const ALLOWED_SORT = {
  newest:  { createdAt: -1 },
  oldest:  { createdAt:  1 },
  name:    { name:       1 },
  rating:  { rating:    -1 }
};

// ---------------------------------------------------------------------------
// Allowed mutable fields for PUT (allowlist — never spread req.body)
// ---------------------------------------------------------------------------
const MUTABLE_FIELDS = [
  'name', 'category', 'location', 'phone', 'image', 'banner',
  'tags', 'openingHours', 'deliveryTime', 'minOrder', 'isOpen'
];

// ---------------------------------------------------------------------------
// GET /api/admin/shops
// Query: search, category, status (open|closed|featured|unapproved), sort, page, limit
// ---------------------------------------------------------------------------
export const listShops = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      sort  = 'newest',
      page  = 1,
      limit = 20
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const filter = {};

    if (search && typeof search === 'string' && search.trim()) {
      filter.$or = [
        { name:     { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && typeof category === 'string' && category.trim()) {
      filter.category = { $regex: category.trim(), $options: 'i' };
    }

    if (status) {
      if (status === 'open')       filter.isOpen     = true;
      if (status === 'closed')     filter.isOpen     = false;
      if (status === 'featured')   filter.isFeatured = true;
      if (status === 'unapproved') filter.isApproved = false;
      if (status === 'approved')   filter.isApproved = true;
    }

    const sortField = ALLOWED_SORT[sort] || ALLOWED_SORT.newest;

    const total = await Shop.countDocuments(filter);
    const shops = await Shop.find(filter)
      .select('-walletBalance -totalEarnings')
      .populate('owner', 'name email phone status isApproved')
      .sort(sortField)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      success: true,
      data: shops,
      pagination: {
        total,
        page:  pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('[listShops]', err);
    return res.status(500).json({ success: false, message: 'Server error fetching shops.' });
  }
};

// ---------------------------------------------------------------------------
// GET /api/admin/shops/:shopId
// ---------------------------------------------------------------------------
export const getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId)
      .populate('owner', 'name email phone status isApproved universityId')
      .lean();

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found.' });
    }

    return res.status(200).json({ success: true, data: shop });
  } catch (err) {
    console.error('[getShop]', err);
    return res.status(500).json({ success: false, message: 'Server error fetching shop.' });
  }
};

// ---------------------------------------------------------------------------
// PUT /api/admin/shops/:shopId
// Edit shop profile / operational data
// ---------------------------------------------------------------------------
export const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found.' });
    }

    // Apply only allowed fields
    MUTABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        shop[field] = req.body[field];
      }
    });

    await shop.save();

    return res.status(200).json({
      success: true,
      message: `Shop '${shop.name}' has been updated.`,
      data: shop
    });
  } catch (err) {
    console.error('[updateShop]', err);
    return res.status(500).json({ success: false, message: 'Server error updating shop.' });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/shops/:shopId/status
// Set isOpen: true|false
// ---------------------------------------------------------------------------
export const setShopOpenStatus = async (req, res) => {
  try {
    const { isOpen } = req.body;
    if (typeof isOpen !== 'boolean') {
      return res.status(400).json({ success: false, message: '`isOpen` must be a boolean.' });
    }

    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' });

    shop.isOpen = isOpen;
    await shop.save();

    return res.status(200).json({
      success: true,
      message: `Shop '${shop.name}' is now ${isOpen ? 'open' : 'closed'}.`,
      data: { shopId: shop._id, isOpen: shop.isOpen }
    });
  } catch (err) {
    console.error('[setShopOpenStatus]', err);
    return res.status(500).json({ success: false, message: 'Server error updating shop status.' });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/shops/:shopId/featured
// Toggle isFeatured
// ---------------------------------------------------------------------------
export const toggleFeatured = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' });

    shop.isFeatured = !shop.isFeatured;
    await shop.save();

    const action = shop.isFeatured ? 'featured' : 'unfeatured';
    return res.status(200).json({
      success: true,
      message: `Shop '${shop.name}' has been ${action}.`,
      data: { shopId: shop._id, isFeatured: shop.isFeatured }
    });
  } catch (err) {
    console.error('[toggleFeatured]', err);
    return res.status(500).json({ success: false, message: 'Server error updating featured state.' });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/shops/:shopId/disable
// Soft-disable: sets isApproved=false, isOpen=false
// Preserves all historical order/transaction data.
// ---------------------------------------------------------------------------
export const disableShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' });

    if (!shop.isApproved) {
      return res.status(409).json({ success: false, message: 'Shop is already disabled.' });
    }

    shop.isApproved = false;
    shop.isOpen     = false;
    await shop.save();

    // Also reflect on owner account
    await User.updateOne(
      { _id: shop.owner },
      { $set: { isApproved: false, status: 'suspended' } }
    );

    return res.status(200).json({
      success: true,
      message: `Shop '${shop.name}' has been disabled. Historical data preserved.`,
      data: { shopId: shop._id, isApproved: false, isOpen: false }
    });
  } catch (err) {
    console.error('[disableShop]', err);
    return res.status(500).json({ success: false, message: 'Server error disabling shop.' });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/shops/:shopId/enable
// Re-enable a disabled shop: sets isApproved=true, syncs owner status
// ---------------------------------------------------------------------------
export const enableShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' });

    if (shop.isApproved) {
      return res.status(409).json({ success: false, message: 'Shop is already active.' });
    }

    shop.isApproved = true;
    await shop.save();

    await User.updateOne(
      { _id: shop.owner },
      { $set: { isApproved: true, status: 'active' } }
    );

    return res.status(200).json({
      success: true,
      message: `Shop '${shop.name}' has been re-enabled.`,
      data: { shopId: shop._id, isApproved: true }
    });
  } catch (err) {
    console.error('[enableShop]', err);
    return res.status(500).json({ success: false, message: 'Server error enabling shop.' });
  }
};
