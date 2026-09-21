import Transaction from '../../models/Transaction.js';
import User from '../../models/User.js';

// @desc    Get runner earnings breakdown & transaction ledger
// @route   GET /api/runner/earnings
// @access  Private (Runner)
export const getRunnerEarnings = async (req, res) => {
  try {
    const runnerId = req.user.id;
    const user = await User.findById(runnerId);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday or Monday start
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all earnings transactions
    const transactions = await Transaction.find({
      user: runnerId,
      type: 'RUNNER_EARNING',
      status: 'COMPLETED'
    })
      .populate('order', 'orderNumber deliveryAddress billing items')
      .sort({ createdAt: -1 });

    let todayEarnings = 0;
    let weeklyEarnings = 0;
    let monthlyEarnings = 0;
    let totalLifetimeEarnings = 0;

    transactions.forEach((txn) => {
      const amt = txn.amount || 0;
      totalLifetimeEarnings += amt;

      const txnDate = new Date(txn.createdAt);
      if (txnDate >= startOfToday) todayEarnings += amt;
      if (txnDate >= startOfWeek) weeklyEarnings += amt;
      if (txnDate >= startOfMonth) monthlyEarnings += amt;
    });

    res.status(200).json({
      success: true,
      earnings: {
        currentBalance: user?.runnerDetails?.walletBalance || user?.walletBalance || 0,
        today: todayEarnings,
        thisWeek: weeklyEarnings,
        thisMonth: monthlyEarnings,
        lifetimeTotal: totalLifetimeEarnings,
        totalDeliveries: transactions.length || user?.runnerDetails?.totalTrips || 0
      },
      transactions
    });
  } catch (error) {
    console.error('getRunnerEarnings Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
