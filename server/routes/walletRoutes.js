import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getWalletBalance,
  topUpWallet,
  getTransactions
} from '../controllers/walletController.js';

const router = express.Router();

router.use(protect);

router.get('/balance', getWalletBalance);
router.post('/topup', topUpWallet);
router.get('/transactions', getTransactions);

export default router;
