import Order from '../../models/Order.js';
import User from '../../models/User.js';
import Shop from '../../models/Shop.js';
import Transaction from '../../models/Transaction.js';
import { refundOrderToStudent } from '../../services/orderService.js';

// @desc    Create new order using In-App Campus Wallet
// @route   POST /api/student/orders
// @access  Private (Student)
export const createStudentOrder = async (req, res) => {
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
    const runnerReward = 20;
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
    console.error('createStudentOrder Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's active and historical orders
// @route   GET /api/student/orders
// @access  Private (Student)
export const getStudentOrders = async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user.id })
      .populate('shop', 'name location image phone category')
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
// @route   GET /api/student/orders/:orderId
// @access  Private (Student)
export const getStudentOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      student: req.user.id
    })
      .populate('shop', 'name location image phone category')
      .populate('runner', 'name phone runnerDetails');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('getStudentOrderById Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order and get 100% refund into wallet
// @route   POST /api/student/orders/:orderId/cancel
// @access  Private (Student)
export const cancelStudentOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({
      _id: req.params.orderId,
      student: req.user.id
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED' || order.status === 'REJECTED') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status ${order.status}`
      });
    }

    order.status = 'CANCELLED';
    order.timeline.push({
      status: 'CANCELLED',
      time: new Date(),
      note: reason || 'Order cancelled by student. Full refund issued.'
    });

    await order.save();

    // Issue 100% Refund via shared service
    const refundInfo = await refundOrderToStudent(
      order,
      reason || 'Order cancelled by student. Full refund issued.'
    );

    res.status(200).json({
      success: true,
      message: `Order cancelled. ৳${refundInfo.refundAmount} refunded to your Campus Wallet!`,
      order,
      remainingBalance: refundInfo.newBalance,
      refundTxn: refundInfo.refundTxn
    });
  } catch (error) {
    console.error('cancelStudentOrder Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
