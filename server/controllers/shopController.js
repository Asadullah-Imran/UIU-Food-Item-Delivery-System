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
      todayDeliveredOrders,
      allDeliveredOrders,
      recentOrders,
      menuItems,
      popularItems
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
        shop: shop._id,
        status: 'DELIVERED',
        createdAt: {
          $gte: startOfDay
        }
      }),

      Order.find({
        shop: shop._id,
        status: 'DELIVERED'
      }),

      Order.find({
        shop: shop._id
      })
        .populate('student', 'name email phone studentId')
        .sort({
          createdAt: -1
        })
        .limit(5),

      MenuItem.find({
        shop: shop._id
      }),

      // Aggregate top-selling items from DELIVERED orders
      Order.aggregate([
        {
          $match: {
            shop: shop._id,
            status: 'DELIVERED'
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: { $ifNull: ['$items.menuItem', '$items.name'] },
            menuItemId: { $first: '$items.menuItem' },
            name: { $first: '$items.name' },
            totalQuantity: { $sum: '$items.quantity' },
            ordersCount: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $multiply: [
                  { $ifNull: ['$items.price', 0] },
                  { $ifNull: ['$items.quantity', 1] }
                ]
              }
            }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            menuItemId: '$_id',
            name: 1,
            totalQuantity: 1,
            ordersCount: 1,
            totalRevenue: 1
          }
        }
      ])
    ]);

    const todayRevenue = todayDeliveredOrders.reduce(
      (total, order) =>
        total +
        Number(
          order.shopAmount ??
          order.billing?.shopAmount ??
          order.billing?.subtotal ??
          order.subtotal ??
          0
        ),
      0
    );

    const totalRevenue = allDeliveredOrders.reduce(
      (total, order) =>
        total +
        Number(
          order.shopAmount ??
          order.billing?.shopAmount ??
          order.billing?.subtotal ??
          order.subtotal ??
          0
        ),
      0
    );

    const lowStockItems = menuItems.filter(
      (item) => Number(item.stockQuantity ?? 0) <= Number(item.lowStockWarning ?? 10)
    );

    const lowStockCount = lowStockItems.length;

    const averageRating = shop.rating || 0;
    const reviewsCount = shop.reviewsCount || 0;
    const bestSellingItem = popularItems && popularItems.length > 0 ? popularItems[0] : null;

    return res.status(200).json({
      success: true,

      dashboard: {
        todayOrders,
        incomingOrders,
        preparingOrders,
        readyOrders,
        completedOrders,
        todayRevenue,
        totalRevenue,
        lowStockItems,
        lowStockCount,
        averageRating,
        reviewsCount,
        popularItems,
        bestSellingItem,
        recentOrders,
        menuItems,
        shop: {
          _id: shop._id,
          name: shop.name,
          image: shop.image,
          rating: shop.rating,
          reviewsCount: shop.reviewsCount,
          isOpen: shop.isOpen
        }
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
export { getShopReviews } from './shop/shopReviewController.js';
