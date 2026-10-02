import User from '../../models/User.js';
import Shop from '../../models/Shop.js';

// ---------------------------------------------------------------------------
// Helper — valid status transitions per action
// ---------------------------------------------------------------------------
const VALID_STATUS_TRANSITIONS = {
  approve:    { from: ['pending', 'rejected'] },
  reject:     { from: ['pending', 'active']   },
  suspend:    { from: ['active']              },
  reactivate: { from: ['suspended']           }
};

// ---------------------------------------------------------------------------
// GET /api/admin/shop-owners
// Query params: status, category, search, sort, page, limit
// ---------------------------------------------------------------------------
export const listShopOwners = async (req, res) => {
  try {
    const {
      status,
      category,
      search,
      sort = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page, 10)  || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    // --- Build User filter ---
    const userFilter = { role: 'shop' };

    const ALLOWED_STATUSES = ['active', 'pending', 'suspended', 'rejected'];
    if (status && ALLOWED_STATUSES.includes(status.toLowerCase())) {
      userFilter.status = status.toLowerCase();
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      userFilter.$or = [
        { name:  { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { 'shopDetails.shopName': { $regex: q, $options: 'i' } }
      ];
    }

    // --- Sort ---
    const sortField = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    // --- Fetch Users ---
    const total = await User.countDocuments(userFilter);
    const users = await User.find(userFilter)
      .select('-password')
      .sort(sortField)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: { total: 0, page: pageNum, limit: limitNum, pages: 0 }
      });
    }

    // --- Attach linked Shop records ---
    const ownerIds = users.map((u) => u._id);
    const shopFilter = { owner: { $in: ownerIds } };
    if (category && typeof category === 'string' && category.trim()) {
      shopFilter.category = { $regex: category.trim(), $options: 'i' };
    }

    const shops = await Shop.find(shopFilter)
      .select('owner name category location phone isApproved isOpen image createdAt')
      .lean();

    const shopMap = {};
    shops.forEach((s) => { shopMap[s.owner.toString()] = s; });

    // --- Build results, filtering by category if provided ---
    let results = users.map((u) => ({
      userId:      u._id,
      name:        u.name,
      email:       u.email,
      phone:       u.phone,
      avatar:      u.avatar,
      status:      u.status,
      isApproved:  u.isApproved,
      shopDetails: u.shopDetails,
      appliedAt:   u.createdAt,
      shop:        shopMap[u._id.toString()] || null
    }));

    if (category && typeof category === 'string' && category.trim()) {
      results = results.filter((r) => r.shop !== null);
    }

    return res.status(200).json({
      success: true,
      data: results,
      pagination: {
        total,
        page:  pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('[listShopOwners]', err);
    return res.status(500).json({ success: false, message: 'Server error fetching shop owners.' });
  }
};

// ---------------------------------------------------------------------------
// GET /api/admin/shop-owners/:userId
// ---------------------------------------------------------------------------
export const getShopOwner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user.role !== 'shop') {
      return res.status(400).json({ success: false, message: 'Target user is not a Shop Owner.' });
    }

    const shop = await Shop.findOne({ owner: userId }).lean();

    return res.status(200).json({
      success: true,
      data: {
        userId:      user._id,
        name:        user.name,
        email:       user.email,
        phone:       user.phone,
        avatar:      user.avatar,
        status:      user.status,
        isApproved:  user.isApproved,
        shopDetails: user.shopDetails,
        appliedAt:   user.createdAt,
        shop:        shop || null
      }
    });
  } catch (err) {
    console.error('[getShopOwner]', err);
    return res.status(500).json({ success: false, message: 'Server error fetching shop owner.' });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/shop-owners/:userId/approve
// pending | rejected → active  |  Shop.isApproved = true
// ---------------------------------------------------------------------------
export const approveShopOwner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role !== 'shop') return res.status(400).json({ success: false, message: 'Target user is not a Shop Owner.' });

    const { from } = VALID_STATUS_TRANSITIONS.approve;
    if (!from.includes(user.status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot approve: current status is '${user.status}'. Only ${from.join(' or ')} accounts may be approved.`
      });
    }

    user.status     = 'active';
    user.isApproved = true;
    await user.save();

    await Shop.updateOne({ owner: userId }, { $set: { isApproved: true } });

    return res.status(200).json({
      success: true,
      message: `Shop Owner '${user.name}' has been approved.`,
      data: { userId: user._id, status: user.status, isApproved: user.isApproved }
    });
  } catch (err) {
    console.error('[approveShopOwner]', err);
    return res.status(500).json({ success: false, message: 'Server error approving shop owner.' });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/shop-owners/:userId/reject
// pending | active → rejected  |  Shop.isApproved = false
// ---------------------------------------------------------------------------
export const rejectShopOwner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role !== 'shop') return res.status(400).json({ success: false, message: 'Target user is not a Shop Owner.' });

    const { from } = VALID_STATUS_TRANSITIONS.reject;
    if (!from.includes(user.status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot reject: current status is '${user.status}'. Only ${from.join(' or ')} accounts may be rejected.`
      });
    }

    user.status     = 'rejected';
    user.isApproved = false;
    await user.save();

    await Shop.updateOne({ owner: userId }, { $set: { isApproved: false } });

    return res.status(200).json({
      success: true,
      message: `Shop Owner '${user.name}' application has been rejected.`,
      data: { userId: user._id, status: user.status, isApproved: user.isApproved }
    });
  } catch (err) {
    console.error('[rejectShopOwner]', err);
    return res.status(500).json({ success: false, message: 'Server error rejecting shop owner.' });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/shop-owners/:userId/suspend
// active → suspended   |   suspended → active (reactivate)
// Toggles based on current status.
// ---------------------------------------------------------------------------
export const suspendShopOwner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role !== 'shop') return res.status(400).json({ success: false, message: 'Target user is not a Shop Owner.' });

    let newStatus, newIsApproved, shopIsApproved;

    if (user.status === 'active') {
      newStatus      = 'suspended';
      newIsApproved  = false;
      shopIsApproved = false;
    } else if (user.status === 'suspended') {
      newStatus      = 'active';
      newIsApproved  = true;
      shopIsApproved = true;
    } else {
      return res.status(409).json({
        success: false,
        message: `Cannot suspend/reactivate: current status is '${user.status}'. Only active or suspended accounts support this transition.`
      });
    }

    user.status     = newStatus;
    user.isApproved = newIsApproved;
    await user.save();

    await Shop.updateOne({ owner: userId }, { $set: { isApproved: shopIsApproved } });

    const action = newStatus === 'suspended' ? 'suspended' : 'reactivated';
    return res.status(200).json({
      success: true,
      message: `Shop Owner '${user.name}' has been ${action}.`,
      data: { userId: user._id, status: user.status, isApproved: user.isApproved }
    });
  } catch (err) {
    console.error('[suspendShopOwner]', err);
    return res.status(500).json({ success: false, message: 'Server error updating shop owner status.' });
  }
};
