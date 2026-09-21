import express from 'express';
import { protect, authorizeRoles } from '../../middlewares/auth.js';
import {
  getRunnerProfile,
  updateRunnerProfile,
  toggleRunnerAvailability,
  getDashboardMetrics
} from '../../controllers/runner/runnerProfileController.js';
import {
  getAvailableDeliveries,
  acceptDelivery
} from '../../controllers/runner/runnerOrderController.js';
import {
  getActiveDelivery,
  pickupOrder,
  completeDelivery
} from '../../controllers/runner/runnerDeliveryController.js';
import {
  getRunnerEarnings
} from '../../controllers/runner/runnerEarningsController.js';
import {
  getDeliveryHistory,
  getRunnerPerformance
} from '../../controllers/runner/runnerHistoryController.js';
import {
  getRunnerChat,
  sendRunnerMessage
} from '../../controllers/runner/runnerChatController.js';

const router = express.Router();

// Runner protection middleware (allow runner or student with active runner capability)
router.use(protect);
router.use(authorizeRoles('runner', 'student', 'admin'));

// 1. Profile, Availability & Dashboard Metrics
router.get('/profile', getRunnerProfile);
router.put('/profile', updateRunnerProfile);
router.patch('/availability', toggleRunnerAvailability);
router.get('/dashboard-metrics', getDashboardMetrics);

// 2. Deliveries Discovery & Acceptance
router.get('/deliveries/available', getAvailableDeliveries);
router.post('/deliveries/:orderId/accept', acceptDelivery);

// 3. Active Delivery Lifecycle (Pickup -> Drop-off -> Complete)
router.get('/orders/active', getActiveDelivery);
router.patch('/orders/:orderId/pickup', pickupOrder);
router.post('/orders/:orderId/complete', completeDelivery);

// 4. Earnings & Payout Ledger
router.get('/earnings', getRunnerEarnings);

// 5. History & Performance
router.get('/history', getDeliveryHistory);
router.get('/performance', getRunnerPerformance);

// 6. Tri-Party Order Chat
router.get('/chat/:orderNumber', getRunnerChat);
router.post('/chat/:orderNumber', sendRunnerMessage);

export default router;
