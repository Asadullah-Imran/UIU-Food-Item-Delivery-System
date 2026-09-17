import User from '../../models/User.js';
import Transaction from '../../models/Transaction.js';

// @desc    Get student wallet balance & recent transaction ledger
// @route   GET /api/student/wallet/balance
// @access  Private (Student)
export const getStudentWalletBalance = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found' });
    }

    const recentTransactions = await Transaction.find({ user: student._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('order', 'orderNumber status billing');

    res.status(200).json({
      success: true,
      walletBalance: student.walletBalance || 0,
      recentTransactions
    });
  } catch (error) {
    console.error('getStudentWalletBalance Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Top up student in-app wallet via simulated gateway (bKash/Nagad/Smart ID)
// @route   POST /api/student/wallet/topup
// @access  Private (Student)
export const topUpStudentWallet = async (req, res) => {
  try {
    const { amount, method = 'bKash In-App Simulator', sourcePhone } = req.body;
    const topUpAmount = Number(amount);

    if (!topUpAmount || topUpAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid top-up amount greater than 0'
      });
    }

    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found' });
    }

    const newBalance = (student.walletBalance || 0) + topUpAmount;
    student.walletBalance = newBalance;
    await student.save();

    const transactionId = `TXN-TOPUP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction = await Transaction.create({
      transactionId,
      user: student._id,
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
      message: `৳${topUpAmount} successfully credited to your Campus Wallet!`,
      walletBalance: newBalance,
      transaction
    });
  } catch (error) {
    console.error('topUpStudentWallet Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get complete student transaction ledger
// @route   GET /api/student/wallet/transactions
// @access  Private (Student)
export const getStudentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('order', 'orderNumber status billing')
      .populate('shop', 'name location');

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('getStudentTransactions Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
