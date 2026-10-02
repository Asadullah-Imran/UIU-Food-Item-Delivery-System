import express from 'express';
import {
  getShops,
  getShopById,
  getMyShop,
  updateShopProfile,
  updateShopProfileImage,
  updateShopBanner,
  addMenuItem,
  updateMenuItem,
  toggleItemAvailability,
  deleteMenuItem,
  getShopOrders,
  getShopOrderById,
  acceptShopOrder,
  rejectShopOrder,
  startPreparingOrder,
  markOrderReady,
  getShopDashboard,
  getShopReviews,
  getShopReports,
  getShopTransactions
} from '../../controllers/shop/shopController.js';
import {
  getShopOrderChat,
  sendShopChatMessage
} from '../../controllers/shop/shopChatController.js';
import { protect } from '../../middlewares/auth.js';
import { authorizeRoles } from '../../middlewares/role.js';
import upload from '../../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getShops);

// Shop Owner Private routes (Must be placed before parameterized /:shopId route)
router.get('/dashboard', protect, authorizeRoles('shop', 'admin'), getShopDashboard);
router.get('/reports', protect, authorizeRoles('shop', 'admin'), getShopReports);
router.get('/transactions', protect, authorizeRoles('shop', 'admin'), getShopTransactions);
router.get('/reviews', protect, authorizeRoles('shop', 'admin'), getShopReviews);
router.get('/my-shop', protect, authorizeRoles('shop', 'admin'), getMyShop);
router.get('/orders', protect, authorizeRoles('shop', 'admin'), getShopOrders);
router.get('/orders/:orderId', protect, authorizeRoles('shop', 'admin'), getShopOrderById);
router.get('/chat/:orderNumber', protect, authorizeRoles('shop', 'admin'), getShopOrderChat);
router.post('/chat/:orderNumber', protect, authorizeRoles('shop', 'admin'), sendShopChatMessage);
router.patch('/orders/:orderId/accept', protect, authorizeRoles('shop', 'admin'), acceptShopOrder);
router.patch('/orders/:orderId/reject', protect, authorizeRoles('shop', 'admin'), rejectShopOrder);
router.patch('/orders/:orderId/preparing', protect, authorizeRoles('shop', 'admin'), startPreparingOrder);
router.patch('/orders/:orderId/ready', protect, authorizeRoles('shop', 'admin'), markOrderReady);
router.put('/profile', protect, authorizeRoles('shop', 'admin'), updateShopProfile);
router.put('/profile/image', protect, authorizeRoles('shop', 'admin'), upload.single('image'), updateShopProfileImage);
router.put('/profile/banner', protect, authorizeRoles('shop', 'admin'), upload.single('banner'), updateShopBanner);
router.post('/menu', protect, authorizeRoles('shop', 'admin'), upload.single('image'), addMenuItem);
router.put('/menu/:itemId', protect, authorizeRoles('shop', 'admin'), upload.single('image'), updateMenuItem);
router.patch('/menu/:itemId/availability', protect, authorizeRoles('shop', 'admin'), toggleItemAvailability);
router.delete('/menu/:itemId', protect, authorizeRoles('shop', 'admin'), deleteMenuItem);

// Public single shop view
router.get('/:shopId', getShopById);

export default router;
