import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Transaction from '../models/Transaction.js';

// @desc    Get current user's wallet balance and summary
// @route   GET /api/wallet/balance
// @access  Private
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let walletBalance = user.walletBalance || 0;
    let extraData = {};

    if (user.role === 'runner') {
      walletBalance = user.runnerDetails?.walletBalance || 0;
      extraData = {
        totalTrips: user.runnerDetails?.totalTrips || 0,
        rating: user.runnerDetails?.rating || 5.0
      };
    } else if (user.role === 'shop') {
      const shop = await Shop.findOne({ owner: user._id });
      if (shop) {
        walletBalance = shop.walletBalance || 0;
        extraData = {
          shopId: shop._id,
          shopName: shop.name,
          totalEarnings: shop.totalEarnings || 0
        };
      }
    }

    // Retrieve recent transactions
    const recentTransactions = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(15);

    res.status(200).json({
      success: true,
      role: user.role,
      walletBalance,
      ...extraData,
      recentTransactions
    });
  } catch (error) {
    console.error('getWalletBalance Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate In-App Wallet Top-Up (bKash/Nagad/Card simulation)
// @route   POST /api/wallet/topup
// @access  Private
export const topUpWallet = async (req, res) => {
  try {
    const { amount, method = 'bKash Simulation', sourcePhone } = req.body;
    const topUpAmount = Number(amount);

    if (!topUpAmount || topUpAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid top-up amount greater than 0'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentBalance = user.walletBalance || 0;
    const newBalance = currentBalance + topUpAmount;
    user.walletBalance = newBalance;
    await user.save();

    const transactionId = `TXN-TOPUP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction = await Transaction.create({
      transactionId,
      user: user._id,
      type: 'TOPUP',
      direction: 'CREDIT',
      amount: topUpAmount,
      balanceAfter: newBalance,
      paymentGateway: method,
      description: `In-App Wallet Top-Up via ${method}${sourcePhone ? ` (${sourcePhone})` : ''}`,
      status: 'COMPLETED'
    });

    res.status(200).json({
      success: true,
      message: `৳${topUpAmount} successfully added to your Campus Wallet!`,
      walletBalance: newBalance,
      transaction
    });
  } catch (error) {
    console.error('topUpWallet Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's transaction ledger history
// @route   GET /api/wallet/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('order', 'orderNumber status billing');

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('getTransactions Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
