import Shop from '../../models/Shop.js';
import Order from '../../models/Order.js';
import MenuItem from '../../models/MenuItem.js';

// @desc    Get shop dashboard metrics and recent activity foundation
// @route   GET /api/shops/dashboard or GET /api/shop/dashboard
// @access  Private (Shop Owner / Admin)
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
        .sort({
          createdAt: -1
        })
        .limit(5),

      MenuItem.find({
        shop: shop._id
      })
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
