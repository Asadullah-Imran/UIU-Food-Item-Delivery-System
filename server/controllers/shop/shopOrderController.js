import mongoose from 'mongoose';
import Shop from '../../models/Shop.js';
import Order from '../../models/Order.js';
import { refundOrderToStudent } from '../../services/orderService.js';

// @desc    Get all orders belonging to authenticated shop owner (with optional status filtering)
// @route   GET /api/shops/orders
// @access  Private (Shop owner, Admin)
export const getShopOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({
      owner: req.user._id
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const filter = {
      shop: shop._id
    };

    if (req.query.status) {
      if (req.query.status.includes(',')) {
        filter.status = { $in: req.query.status.split(',').map((s) => s.trim()) };
      } else {
        filter.status = req.query.status;
      }
    }

    const orders = await Order.find(filter)
      .populate('student', 'name email phone universityId')
      .populate('runner', 'name phone')
      .populate('shop', 'name location phone image')
      .populate('items.menuItem', 'name image price category')
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('getShopOrders Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch shop orders'
    });
  }
};

// @desc    Get single order details for authenticated shop owner
// @route   GET /api/shops/orders/:orderId
// @access  Private (Shop owner, Admin)
export const getShopOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const shop = await Shop.findOne({
      owner: req.user._id
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(orderId);
    const query = isObjectId
      ? { _id: orderId, shop: shop._id }
      : { orderNumber: orderId, shop: shop._id };

    const order = await Order.findOne(query)
      .populate('student', 'name email phone universityId')
      .populate('runner', 'name phone')
      .populate('shop', 'name location phone image')
      .populate('items.menuItem', 'name image price category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('getShopOrderById Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
};

// @desc    Accept order (Transition: PLACED -> CONFIRMED)
// @route   PATCH /api/shops/orders/:orderId/accept
// @access  Private (Shop owner, Admin)
export const acceptShopOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const shop = await Shop.findOne({
      owner: req.user._id
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(orderId);
    const query = isObjectId
      ? { _id: orderId, shop: shop._id }
      : { orderNumber: orderId, shop: shop._id };

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'PLACED') {
      return res.status(400).json({
        success: false,
        message: 'Only placed orders can be accepted'
      });
    }

    order.status = 'CONFIRMED';

    if (!Array.isArray(order.timeline)) {
      order.timeline = [];
    }

    if (!order.timeline.some((t) => t.status === 'CONFIRMED')) {
      order.timeline.push({
        status: 'CONFIRMED',
        time: new Date(),
        note: req.body?.note || 'Order accepted and confirmed by shop'
      });
    }

    await order.save();

    await order.populate([
      { path: 'student', select: 'name email phone universityId' },
      { path: 'runner', select: 'name phone' },
      { path: 'items.menuItem', select: 'name image price category' }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Order accepted successfully',
      order
    });
  } catch (error) {
    console.error('acceptShopOrder Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to accept order'
    });
  }
};

export const acceptOrder = acceptShopOrder;

// @desc    Reject order (Transition: PLACED -> REJECTED with automated student refund)
// @route   PATCH /api/shops/orders/:orderId/reject
// @access  Private (Shop owner, Admin)
export const rejectShopOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const shop = await Shop.findOne({
      owner: req.user._id
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(orderId);
    const query = isObjectId
      ? { _id: orderId, shop: shop._id }
      : { orderNumber: orderId, shop: shop._id };

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'PLACED') {
      return res.status(400).json({
        success: false,
        message: 'Only placed orders can be rejected'
      });
    }

    const rejectionReason = req.body?.reason || req.body?.note || 'Order rejected by shop';

    let session = null;
    let refundResult;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      order.status = 'REJECTED';
      order.timeline.push({
        status: 'REJECTED',
        time: new Date(),
        note: rejectionReason
      });

      await order.save({ session });
      refundResult = await refundOrderToStudent(order, rejectionReason, session);

      await session.commitTransaction();
    } catch (atomicErr) {
      if (session) {
        try { await session.abortTransaction(); } catch (e) { /* ignore */ }
      }

      // Standalone MongoDB fallback if replica sets are not enabled locally
      if (atomicErr.message && atomicErr.message.includes('replica set')) {
        order.status = 'REJECTED';
        order.timeline.push({
          status: 'REJECTED',
          time: new Date(),
          note: rejectionReason
        });
        await order.save();
        refundResult = await refundOrderToStudent(order, rejectionReason);
      } else {
        throw atomicErr;
      }
    } finally {
      if (session) {
        session.endSession();
      }
    }

    await order.populate([
      { path: 'student', select: 'name email phone universityId' },
      { path: 'runner', select: 'name phone' },
      { path: 'items.menuItem', select: 'name image price category' }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Order rejected successfully',
      order,
      refund: refundResult
    });
  } catch (error) {
    console.error('rejectShopOrder Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to reject order'
    });
  }
};

export const rejectOrder = rejectShopOrder;

// @desc    Mark order as PREPARING (Transition: CONFIRMED -> PREPARING)
// @route   PATCH /api/shops/orders/:orderId/preparing
// @access  Private (Shop owner, Admin)
export const startPreparingOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const shop = await Shop.findOne({
      owner: req.user._id
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(orderId);
    const query = isObjectId
      ? { _id: orderId, shop: shop._id }
      : { orderNumber: orderId, shop: shop._id };

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'CONFIRMED') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed orders can start preparing'
      });
    }

    order.status = 'PREPARING';

    if (!Array.isArray(order.timeline)) {
      order.timeline = [];
    }

    if (!order.timeline.some((t) => t.status === 'PREPARING')) {
      order.timeline.push({
        status: 'PREPARING',
        time: new Date(),
        note: req.body?.note || 'Kitchen started preparing the order'
      });
    }

    await order.save();

    await order.populate([
      { path: 'student', select: 'name email phone universityId' },
      { path: 'runner', select: 'name phone' },
      { path: 'items.menuItem', select: 'name image price category' }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Order is now being prepared',
      order
    });
  } catch (error) {
    console.error('startPreparingOrder Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// @desc    Mark order as READY_FOR_PICKUP (Transition: PREPARING -> READY_FOR_PICKUP)
// @route   PATCH /api/shops/orders/:orderId/ready
// @access  Private (Shop owner, Admin)
export const markOrderReady = async (req, res) => {
  try {
    const { orderId } = req.params;

    const shop = await Shop.findOne({
      owner: req.user._id
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(orderId);
    const query = isObjectId
      ? { _id: orderId, shop: shop._id }
      : { orderNumber: orderId, shop: shop._id };

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'PREPARING') {
      return res.status(400).json({
        success: false,
        message: 'Only preparing orders can be marked ready'
      });
    }

    order.status = 'READY_FOR_PICKUP';

    if (!Array.isArray(order.timeline)) {
      order.timeline = [];
    }

    if (!order.timeline.some((t) => t.status === 'READY_FOR_PICKUP')) {
      order.timeline.push({
        status: 'READY_FOR_PICKUP',
        time: new Date(),
        note: req.body?.note || 'Order is ready for runner pickup'
      });
    }

    await order.save();

    await order.populate([
      { path: 'student', select: 'name email phone universityId' },
      { path: 'runner', select: 'name phone' },
      { path: 'items.menuItem', select: 'name image price category' }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Order is ready for pickup',
      order
    });
  } catch (error) {
    console.error('markOrderReady Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};
