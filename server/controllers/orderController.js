import Order from '../models/Order.js';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Transaction from '../models/Transaction.js';

// @desc    Create new order using In-App Campus Wallet
// @route   POST /api/orders
// @access  Private (Student)
export const createOrder = async (req, res) => {
  try {
    const { shopId, items, deliveryAddress, specialInstructions } = req.body;

    if (!shopId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain a valid shop and at least one item'
      });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Campus shop not found'
      });
    }

    // Calculate billing
    let subtotal = 0;
    const formattedItems = items.map((item) => {
      const qty = item.quantity || 1;
      const price = Number(item.price) || 0;
      subtotal += price * qty;
      return {
        menuItem: item.id || item._id || null,
        name: item.name,
        price,
        quantity: qty,
        note: item.note || ''
      };
    });

    const deliveryFee = 25;
    const platformFee = 5;
    const runnerReward = 20; // ৳20 runner delivery reward + ৳5 platform fee = ৳25 delivery fee
    const shopAmount = subtotal;
    const grandTotal = subtotal + deliveryFee;

    // Check Student Wallet Balance
    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found' });
    }

    const currentBalance = student.walletBalance || 0;
    if (currentBalance < grandTotal) {
      return res.status(400).json({
        success: false,
        message: `Insufficient Campus Wallet balance! Total is ৳${grandTotal}, but your available balance is ৳${currentBalance}. Please top up your wallet.`,
        required: grandTotal,
        available: currentBalance,
        deficit: grandTotal - currentBalance
      });
    }

    // Deduct from Student Wallet
    const newStudentBalance = currentBalance - grandTotal;
    student.walletBalance = newStudentBalance;
    await student.save();

    // Unique order number
    const orderNumber = `#UIU-${Math.floor(1000 + Math.random() * 9000)}`;
    const transactionRef = `TXN-ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // Create Order
    const order = await Order.create({
      orderNumber,
      student: student._id,
      shop: shop._id,
      items: formattedItems,
      billing: {
        subtotal,
        deliveryFee,
        platformFee,
        runnerReward,
        shopAmount,
        discount: 0,
        grandTotal
      },
      payment: {
        method: 'wallet',
        status: 'paid',
        transactionId: transactionRef
      },
      deliveryAddress: {
        building: deliveryAddress?.building || 'Academic Building',
        room: deliveryAddress?.room || 'Room 412',
        dropOffNote: deliveryAddress?.dropOffNote || ''
      },
      specialInstructions: specialInstructions || '',
      status: 'PLACED',
      runnerReward,
      timeline: [
        {
          status: 'PLACED',
          time: new Date(),
          note: `Order placed & ৳${grandTotal} paid via In-App Campus Wallet`
        }
      ]
    });

    // Record Debit Transaction
    await Transaction.create({
      transactionId: transactionRef,
      user: student._id,
      shop: shop._id,
      order: order._id,
      type: 'ORDER_PAYMENT',
      direction: 'DEBIT',
      amount: grandTotal,
      balanceAfter: newStudentBalance,
      paymentGateway: 'In-App Campus Wallet',
      description: `Payment for food order ${orderNumber} at ${shop.name}`,
      status: 'COMPLETED'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed and paid successfully via Campus Wallet!',
      order,
      remainingBalance: newStudentBalance
    });
  } catch (error) {
    console.error('createOrder Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's active & past orders
// @route   GET /api/orders/student
// @access  Private (Student)
export const getStudentOrders = async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user.id })
      .populate('shop', 'name location image phone')
      .populate('runner', 'name phone runnerDetails')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('getStudentOrders Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order details by ID
// @route   GET /api/orders/:orderId
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('student', 'name email phone universityId')
      .populate('shop', 'name location image phone')
      .populate('runner', 'name phone runnerDetails');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('getOrderById Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status and trigger multi-party financial payout upon DELIVERED or refund upon CANCELLED
// @route   PATCH /api/orders/:orderId/status
// @access  Private
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = status;
    order.timeline.push({
      status,
      time: new Date(),
      note: note || `Order status updated to ${status}`
    });

    await order.save();

    // 1. AUTOMATED SETTLEMENT ON DELIVERY
    if (status === 'DELIVERED' && previousStatus !== 'DELIVERED') {
      // Credit Runner delivery reward
      if (order.runner) {
        const runner = await User.findById(order.runner);
        if (runner) {
          const runnerCut = order.billing?.runnerReward || 20;
          const currentRunnerBal = runner.runnerDetails?.walletBalance || 0;
          const newRunnerBal = currentRunnerBal + runnerCut;
          
          if (!runner.runnerDetails) runner.runnerDetails = {};
          runner.runnerDetails.walletBalance = newRunnerBal;
          runner.runnerDetails.totalTrips = (runner.runnerDetails.totalTrips || 0) + 1;
          await runner.save();

          await Transaction.create({
            transactionId: `TXN-RUNNER-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            user: runner._id,
            order: order._id,
            type: 'RUNNER_EARNING',
            direction: 'CREDIT',
            amount: runnerCut,
            balanceAfter: newRunnerBal,
            description: `Delivery payout for order ${order.orderNumber}`,
            status: 'COMPLETED'
          });
        }
      }

      // Credit Shop vendor balance
      const shop = await Shop.findById(order.shop);
      if (shop) {
        const shopCut = order.billing?.shopAmount || order.billing?.subtotal || 0;
        shop.walletBalance = (shop.walletBalance || 0) + shopCut;
        shop.totalEarnings = (shop.totalEarnings || 0) + shopCut;
        await shop.save();

        await Transaction.create({
          transactionId: `TXN-SHOP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          user: shop.owner,
          shop: shop._id,
          order: order._id,
          type: 'SHOP_EARNING',
          direction: 'CREDIT',
          amount: shopCut,
          balanceAfter: shop.walletBalance,
          description: `Food sales revenue for order ${order.orderNumber}`,
          status: 'COMPLETED'
        });
      }
    }

    // 2. AUTOMATED REFUND ON CANCELLATION OR REJECTION
    if ((status === 'CANCELLED' || status === 'REJECTED') && previousStatus !== 'CANCELLED' && previousStatus !== 'REJECTED') {
      const student = await User.findById(order.student);
      if (student) {
        const refundAmount = order.billing?.grandTotal || 0;
        const newStudentBal = (student.walletBalance || 0) + refundAmount;
        student.walletBalance = newStudentBal;
        await student.save();

        await Transaction.create({
          transactionId: `TXN-REFUND-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          user: student._id,
          order: order._id,
          type: 'REFUND',
          direction: 'CREDIT',
          amount: refundAmount,
          balanceAfter: newStudentBal,
          description: `Full refund for ${status.toLowerCase()} order ${order.orderNumber}`,
          status: 'COMPLETED'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    console.error('updateOrderStatus Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
