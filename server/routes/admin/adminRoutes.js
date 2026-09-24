import express from 'express';
import { protect } from '../../middlewares/auth.js';
import { authorizeRoles } from '../../middlewares/role.js';
import {
  getAdminProfile,
  updateAdminProfile
} from '../../controllers/admin/adminProfileController.js';
import {
  listShopOwners,
  getShopOwner,
  approveShopOwner,
  rejectShopOwner,
  suspendShopOwner
} from '../../controllers/admin/adminShopOwnerController.js';

const router = express.Router();

/**
 * MANDATORY SECURITY GUARD
 * Every /api/admin/* endpoint strictly requires:
 * 1. Valid JWT authentication via protect
 * 2. Strict Admin role authorization via authorizeRoles('admin')
 */
router.use(protect);
router.use(authorizeRoles('admin'));

// --- Admin Profile Routes (Phase 1) ---
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

// --- Shop Owner Approval Routes (Phase 2) ---
router.get('/shop-owners',                        listShopOwners);
router.get('/shop-owners/:userId',                getShopOwner);
router.patch('/shop-owners/:userId/approve',      approveShopOwner);
router.patch('/shop-owners/:userId/reject',       rejectShopOwner);
router.patch('/shop-owners/:userId/suspend',      suspendShopOwner);

export default router;
