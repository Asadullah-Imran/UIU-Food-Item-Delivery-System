/**
 * requireApprovedShop middleware
 *
 * Blocks access to all shop-specific private routes if the user's shop
 * account has not yet been approved by an admin.
 *
 * Admins bypass this check entirely.
 */
import User from '../models/User.js';
import Shop from '../models/Shop.js';

export const requireApprovedShop = async (req, res, next) => {
  try {
    // Admins are always allowed through
    if (req.user.role === 'admin') return next();

    // Verify shop role
    if (req.user.role !== 'shop') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to approved Shop Owners only.'
      });
    }

    // Fetch fresh user record
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    // Rejected accounts — hard block
    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        accountStatus: 'rejected',
        message: 'Your shop application has been rejected by campus administration.'
      });
    }

    // Pending / unapproved accounts — block
    if (!user.isApproved || user.status === 'pending') {
      return res.status(403).json({
        success: false,
        isPendingApproval: true,
        message: 'Your shop owner account is pending admin approval. Please wait for an administrator to approve your application.'
      });
    }

    // Check linked shop record
    const shop = await Shop.findOne({ owner: req.user.id });
    if (shop && !shop.isApproved) {
      return res.status(403).json({
        success: false,
        isPendingApproval: true,
        message: 'Your shop is pending admin approval.'
      });
    }

    next();
  } catch (error) {
    console.error('requireApprovedShop error:', error);
    res.status(500).json({ success: false, message: 'Authorization check failed.' });
  }
};
