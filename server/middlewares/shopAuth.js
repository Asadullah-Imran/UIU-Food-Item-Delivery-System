import Shop from '../models/Shop.js';

/**
 * Middleware: requireApprovedShop
 * Enforces that:
 * 1. The user is an authenticated Shop Owner (or Admin).
 * 2. The user account status is 'active' and isApproved is true.
 * 3. The linked Shop record exists and has isApproved: true.
 * Attaches the verified shop to req.shop.
 */
export const requireApprovedShop = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Admins have access to shop management
    if (req.user.role === 'admin') {
      return next();
    }

    if (req.user.role !== 'shop') {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to perform shop operations.`
      });
    }

    if (req.user.status === 'pending' || !req.user.isApproved) {
      return res.status(403).json({
        success: false,
        isPendingApproval: true,
        message: 'Your shop owner account is pending admin approval. Please wait for an administrator to approve your application.'
      });
    }

    if (req.user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        accountStatus: 'rejected',
        message: 'Your shop application was rejected by campus administration.'
      });
    }

    const shop = await Shop.findOne({ owner: req.user._id || req.user.id });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (!shop.isApproved) {
      return res.status(403).json({
        success: false,
        isPendingApproval: true,
        message: 'Your shop is currently pending admin approval.'
      });
    }

    req.shop = shop;
    next();
  } catch (error) {
    console.error('requireApprovedShop Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error verifying shop approval status.'
    });
  }
};
