/**
 * requireApprovedRunner middleware
 *
 * Blocks access to all runner-specific routes if the user's runner
 * account has not yet been approved by an admin.
 *
 * Expected call chain:
 *   router.use(protect)
 *   router.use(authorizeRoles('runner', ...))
 *   router.use(requireApprovedRunner)   ← insert here
 *
 * Admins bypass this check entirely.
 */

import User from '../models/User.js';

export const requireApprovedRunner = async (req, res, next) => {
  try {
    // Admins are always allowed through
    if (req.user.role === 'admin') return next();

    // Only applies to users acting as runners
    const isRunnerRole = req.user.role === 'runner' || req.user.isRunner;
    if (!isRunnerRole) {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to approved Delivery Runners only.'
      });
    }

    // Fetch the fresh user record to get the live status
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    // Rejected accounts — hard block
    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        accountStatus: 'rejected',
        message: 'Your runner application has been rejected by campus administration.'
      });
    }

    // Pending / unapproved accounts — soft block with polling flag
    if (!user.isApproved || user.status === 'pending') {
      return res.status(403).json({
        success: false,
        isPendingApproval: true,
        message: 'Your runner account is pending admin approval. Please check back later.'
      });
    }

    next();
  } catch (error) {
    console.error('requireApprovedRunner error:', error);
    res.status(500).json({ success: false, message: 'Authorization check failed.' });
  }
};
