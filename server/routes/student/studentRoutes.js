import express from 'express';
import { protect, authorize } from '../../middlewares/auth.js';

import {
  getStudentShops,
  getStudentShopDetails
} from '../../controllers/student/studentShopController.js';

import {
  createStudentOrder,
  getStudentOrders,
  getStudentOrderById,
  cancelStudentOrder
} from '../../controllers/student/studentOrderController.js';

import {
  getStudentWalletBalance,
  topUpStudentWallet,
  getStudentTransactions
} from '../../controllers/student/studentWalletController.js';

import { rateOrderAndRunner } from '../../controllers/student/studentReviewController.js';
import {
  createStudentComplaint,
  getStudentComplaints
} from '../../controllers/student/studentComplaintController.js';

import {
  getStudentOrderChat,
  sendStudentChatMessage
} from '../../controllers/student/studentChatController.js';

const router = express.Router();

// Public / Protected Browsing
router.get('/shops', getStudentShops);
router.get('/shops/:shopId', getStudentShopDetails);

// Protected Student Routes
router.use(protect);

// Wallet & In-App Purchase
router.get('/wallet/balance', getStudentWalletBalance);
router.post('/wallet/topup', topUpStudentWallet);
router.get('/wallet/transactions', getStudentTransactions);

// Orders & Checkout
router.post('/orders', createStudentOrder);
router.get('/orders', getStudentOrders);
router.get('/orders/:orderId', getStudentOrderById);
router.post('/orders/:orderId/cancel', cancelStudentOrder);
router.post('/orders/:orderId/rate', rateOrderAndRunner);

// Complaints / Disputes
router.post('/complaints', createStudentComplaint);
router.get('/complaints', getStudentComplaints);

// Order-Scoped Chat
router.get('/chat/:orderNumber', getStudentOrderChat);
router.post('/chat/:orderNumber', sendStudentChatMessage);

export default router;
