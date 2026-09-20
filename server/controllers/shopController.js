import mongoose from 'mongoose';
import Shop from '../models/Shop.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { refundOrderToStudent } from '../services/orderService.js';

import MenuItem from '../models/MenuItem.js';

// Export everything from the modular shop controller
export * from './shop/shopController.js';

// Get Shop Dashboard metrics foundation
export const getShopDashboard = async (req, res) => {
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

    const startOfDay = new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const [
      todayOrders,
      incomingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      recentOrders,
      menuItems
    ] = await Promise.all([
      Order.countDocuments({
        shop: shop._id,
        createdAt: {
          $gte: startOfDay
        }
      }),

      Order.countDocuments({
        shop: shop._id,
        status: 'PLACED'
      }),

      Order.countDocuments({
        shop: shop._id,
        status: 'PREPARING'
      }),

      Order.countDocuments({
        shop: shop._id,
        status: 'READY_FOR_PICKUP'
      }),

      Order.countDocuments({
        shop: shop._id,
        status: 'DELIVERED'
      }),

      Order.find({
        shop: shop._id
      })
        .sort({
          createdAt: -1
        })
        .limit(5),

      MenuItem.find({
        shop: shop._id
      })
    ]);

    return res.status(200).json({
      success: true,

      dashboard: {
        todayOrders,
        incomingOrders,
        preparingOrders,
        readyOrders,
        completedOrders,
        recentOrders,
        menuItems
      }
    });

  } catch (error) {
    console.error(
      'getShopDashboard Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to load shop dashboard'
    });
  }
};

// Explicitly provide rejectShopOrder matching the exact schema requirements
export const rejectShopOrder = async (req, res) => {
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

    const order = await Order.findOne({
      _id: req.params.orderId,
      shop: shop._id
    });

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

    const student = await User.findById(order.student);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const rejectionReason = req.body?.reason || req.body?.note || 'Order rejected by shop';

    let session = null;
    let refundResult;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      order.status = 'REJECTED';

      if (Array.isArray(order.timeline)) {
        order.timeline.push({
          status: 'REJECTED',
          time: new Date(),
          note: rejectionReason
        });
      }

      await order.save({ session });
      refundResult = await refundOrderToStudent(order, rejectionReason, session);

      await session.commitTransaction();
    } catch (atomicErr) {
      if (session) {
        try { await session.abortTransaction(); } catch (e) { /* ignore */ }
      }

      if (atomicErr.message && atomicErr.message.includes('replica set')) {
        order.status = 'REJECTED';
        if (Array.isArray(order.timeline)) {
          order.timeline.push({
            status: 'REJECTED',
            time: new Date(),
            note: rejectionReason
          });
        }
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
      message: 'Order rejected and student refunded successfully',
      order,
      refundAmount: refundResult?.refundAmount || 0,
      refundTxn: refundResult?.refundTxn || null
    });
  } catch (error) {
    console.error('rejectShopOrder Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to reject order'
    });
  }
};

export { Order, Shop, User, Transaction, MenuItem, refundOrderToStudent };
