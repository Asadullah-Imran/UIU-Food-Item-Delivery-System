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
import {
  listRunners,
  getRunner,
  approveRunner,
  rejectRunner,
  suspendRunner
} from '../../controllers/admin/adminRunnerController.js';
import {
  listShops,
  getShop,
  updateShop,
  setShopOpenStatus,
  toggleFeatured,
  disableShop,
  enableShop
} from '../../controllers/admin/adminShopController.js';

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

// --- Runner Approval Routes (Phase 3) ---
router.get('/runners',                        listRunners);
router.get('/runners/:userId',                getRunner);
router.patch('/runners/:userId/approve',      approveRunner);
router.patch('/runners/:userId/reject',       rejectRunner);
router.patch('/runners/:userId/suspend',      suspendRunner);

// --- Shop Administration Routes (Phase 4) ---
router.get('/shops',                      listShops);
router.get('/shops/:shopId',              getShop);
router.put('/shops/:shopId',              updateShop);
router.patch('/shops/:shopId/status',     setShopOpenStatus);
router.patch('/shops/:shopId/featured',   toggleFeatured);
router.patch('/shops/:shopId/disable',    disableShop);
router.patch('/shops/:shopId/enable',     enableShop);

export default router;
