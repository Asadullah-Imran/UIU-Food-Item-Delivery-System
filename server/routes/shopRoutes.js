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
  getShopTransactions,
  handoverOrder
} from '../controllers/shop/shopController.js';
import {
  getShopOrderChat,
  sendShopChatMessage
} from '../controllers/shop/shopChatController.js';
import { protect } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/role.js';
import { requireApprovedShop } from '../middlewares/shopAuth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getShops);

// Shop Owner Private routes (Must be placed before parameterized /:shopId route)
router.get('/dashboard', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, getShopDashboard);
router.get('/reports', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, getShopReports);
router.get('/transactions', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, getShopTransactions);
router.get('/reviews', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, getShopReviews);
router.get('/my-shop', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, getMyShop);
router.get('/orders', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, getShopOrders);
router.get('/orders/:orderId', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, getShopOrderById);
router.get('/chat/:orderNumber', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, getShopOrderChat);
router.post('/chat/:orderNumber', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, sendShopChatMessage);
router.patch('/orders/:orderId/accept', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, acceptShopOrder);
router.patch('/orders/:orderId/reject', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, rejectShopOrder);
router.patch('/orders/:orderId/preparing', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, startPreparingOrder);
router.patch('/orders/:orderId/ready', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, markOrderReady);
router.patch('/orders/:orderId/handover', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, handoverOrder);
router.put('/profile', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, updateShopProfile);
router.put('/profile/image', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, upload.single('image'), updateShopProfileImage);
router.put('/profile/banner', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, upload.single('banner'), updateShopBanner);
router.post('/menu', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, upload.single('image'), addMenuItem);
router.put('/menu/:itemId', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, upload.single('image'), updateMenuItem);
router.patch('/menu/:itemId/availability', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, toggleItemAvailability);
router.delete('/menu/:itemId', protect, authorizeRoles('shop', 'admin'), requireApprovedShop, deleteMenuItem);

// Public single shop view
router.get('/:shopId', getShopById);

export default router;
