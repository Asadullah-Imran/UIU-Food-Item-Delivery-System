import express from 'express';
import {
  getShops,
  getShopById,
  getMyShop,
  updateShopProfile,
  updateShopProfileImage,
  uploadShopBanner,
  addMenuItem,
  updateMenuItem,
  toggleItemAvailability,
  deleteMenuItem
} from '../controllers/shop/shopController.js';
import { protect } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/role.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getShops);

// Shop Owner Private routes (Must be placed before parameterized /:shopId route)
router.get('/my-shop', protect, authorizeRoles('shop', 'admin'), getMyShop);
router.put('/profile', protect, authorizeRoles('shop', 'admin'), updateShopProfile);
router.put('/profile/image', protect, authorizeRoles('shop', 'admin'), upload.single('image'), updateShopProfileImage);
router.put('/profile/banner', protect, authorizeRoles('shop', 'admin'), upload.single('banner'), uploadShopBanner);
router.post('/menu', protect, authorizeRoles('shop', 'admin'), addMenuItem);
router.put('/menu/:itemId', protect, authorizeRoles('shop', 'admin'), updateMenuItem);
router.patch('/menu/:itemId/availability', protect, authorizeRoles('shop', 'admin'), toggleItemAvailability);
router.delete('/menu/:itemId', protect, authorizeRoles('shop', 'admin'), deleteMenuItem);

// Public single shop view
router.get('/:shopId', getShopById);

export default router;
