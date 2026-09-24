import express from 'express';
import { protect } from '../../middlewares/auth.js';
import { authorizeRoles } from '../../middlewares/role.js';
import {
  getAdminProfile,
  updateAdminProfile
} from '../../controllers/admin/adminProfileController.js';

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

export default router;
