import Order from '../../models/Order.js';
import User from '../../models/User.js';
import Shop from '../../models/Shop.js';
import Transaction from '../../models/Transaction.js';

// @desc    Get runner's current active delivery
// @route   GET /api/runner/orders/active
// @access  Private (Runner)
export const getActiveDelivery = async (req, res) => {
  try {
    const order = await Order.findOne({
      runner: req.user.id,
      status: { $in: ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'ON_THE_WAY'] }
    })
      .populate('shop', 'name location image phone category')
      .populate('student', 'name phone universityId deliveryRoom')
      .sort({ updatedAt: -1 });

    if (!order) {
      return res.status(200).json({
        success: true,
        message: 'No active delivery at this time.',
        order: null
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('getActiveDelivery Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark order as picked up from shop counter (Status -> ON_THE_WAY)
// @route   PATCH /api/runner/orders/:orderId/pickup
// @access  Private (Runner)
export const pickupOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const runnerId = req.user.id;

    const order = await Order.findOne({ _id: orderId, runner: runnerId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Active order not found for this runner' });
    }

    if (order.status === 'ON_THE_WAY') {
      return res.status(200).json({ success: true, message: 'Order is already on the way', order });
    }

    order.status = 'ON_THE_WAY';
    order.timeline.push({
      status: 'ON_THE_WAY',
      time: new Date(),
      note: 'Runner picked up order from shop counter and is heading to delivery location'
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('shop', 'name location image phone')
      .populate('student', 'name phone universityId deliveryRoom');

    res.status(200).json({
      success: true,
      message: 'Order pickup confirmed! Head to the student delivery drop-off room.',
      order: populatedOrder
    });
  } catch (error) {
    console.error('pickupOrder Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete order delivery & trigger automated multi-party financial payout
// @route   POST /api/runner/orders/:orderId/complete
// @access  Private (Runner)
export const completeDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const runnerId = req.user.id;
    const { dropOffNote } = req.body;

    const order = await Order.findOne({ _id: orderId, runner: runnerId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Active delivery order not found' });
    }

    if (order.status === 'DELIVERED') {
      return res.status(200).json({ success: true, message: 'Order was already marked delivered', order });
    }

    order.status = 'DELIVERED';
    order.timeline.push({
      status: 'DELIVERED',
      time: new Date(),
      note: dropOffNote || `Delivered to student at ${order.deliveryAddress?.room || 'campus location'}`
    });

    await order.save();

    // ==========================================
    // AUTOMATED FINANCIAL PAYOUT ENGINE
    // ==========================================
    const runnerRewardAmount = order.billing?.runnerReward || 30;
    const shopRevenueAmount = order.billing?.shopAmount || order.billing?.subtotal || 0;

    // 1. Credit Runner Wallet
    const runner = await User.findById(runnerId);
    let newRunnerBalance = 0;
    if (runner) {
      if (!runner.runnerDetails) runner.runnerDetails = {};
      const currentRunnerBal = runner.runnerDetails.walletBalance || runner.walletBalance || 0;
      newRunnerBalance = currentRunnerBal + runnerRewardAmount;
      
      runner.runnerDetails.walletBalance = newRunnerBalance;
      runner.walletBalance = newRunnerBalance;
      runner.runnerDetails.totalTrips = (runner.runnerDetails.totalTrips || 0) + 1;
      await runner.save();

      // Log Runner Credit Transaction
      await Transaction.create({
        transactionId: `TXN-RUN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        user: runner._id,
        order: order._id,
        type: 'RUNNER_EARNING',
        direction: 'CREDIT',
        amount: runnerRewardAmount,
        balanceAfter: newRunnerBalance,
        paymentGateway: 'Campus Closed-Loop Wallet',
        description: `Delivery reward payout for order ${order.orderNumber} to ${order.deliveryAddress?.room}`,
        status: 'COMPLETED'
      });
    }

    // 2. Credit Shop Owner Wallet
    const shop = await Shop.findById(order.shop);
    if (shop) {
      shop.walletBalance = (shop.walletBalance || 0) + shopRevenueAmount;
      shop.totalEarnings = (shop.totalEarnings || 0) + shopRevenueAmount;
      await shop.save();

      // Log Shop Revenue Credit Transaction
      await Transaction.create({
        transactionId: `TXN-SHP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        user: shop.owner,
        shop: shop._id,
        order: order._id,
        type: 'SHOP_EARNING',
        direction: 'CREDIT',
        amount: shopRevenueAmount,
        balanceAfter: shop.walletBalance,
        paymentGateway: 'Campus Closed-Loop Wallet',
        description: `Food sales revenue payout for order ${order.orderNumber}`,
        status: 'COMPLETED'
      });
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('shop', 'name location image phone')
      .populate('student', 'name phone universityId deliveryRoom');

    res.status(200).json({
      success: true,
      message: `Delivery successfully completed! ৳${runnerRewardAmount} credited to your Campus Wallet.`,
      order: populatedOrder,
      payout: {
        runnerReward: runnerRewardAmount,
        newRunnerWalletBalance: newRunnerBalance,
        shopCredited: shopRevenueAmount
      }
    });
  } catch (error) {
    console.error('completeDelivery Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
