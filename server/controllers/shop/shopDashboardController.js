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
      menuItems,
      nonCancelledOrders
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

      // Fetch all non-cancelled orders belonging strictly to this relevant shop
      Order.find({
        shop: shop._id,
        status: { $nin: ['CANCELLED', 'REJECTED', 'cancelled', 'rejected'] }
      }).select('items status')
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

    // Compute live average rating from DELIVERED orders (same source as getShopReviews)
    const ratedOrders = await Order.find({
      shop: shop._id,
      status: 'DELIVERED',
      'ratings.shopRating': { $exists: true, $ne: null }
    }).select('ratings');

    const reviewsCount = ratedOrders.length;
    const averageRating = reviewsCount > 0
      ? Number((ratedOrders.reduce((sum, o) => sum + Number(o.ratings.shopRating), 0) / reviewsCount).toFixed(1))
      : 0;

    // Aggregate item sales strictly for this relevant shop
    const itemSalesMap = {};
    for (const ord of (nonCancelledOrders || [])) {
      if (ord.items && Array.isArray(ord.items)) {
        for (const item of ord.items) {
          const key = item.menuItem ? item.menuItem.toString() : item.name?.trim();
          if (!key) continue;

          if (!itemSalesMap[key]) {
            itemSalesMap[key] = {
              menuItemId: item.menuItem || null,
              name: item.name || 'Unnamed Item',
              totalQuantity: 0,
              ordersCount: 0,
              totalRevenue: 0
            };
          }

          const qty = Number(item.quantity || 1);
          const price = Number(item.price || 0);

          itemSalesMap[key].totalQuantity += qty;
          itemSalesMap[key].ordersCount += 1;
          itemSalesMap[key].totalRevenue += price * qty;
        }
      }
    }

    const popularItems = Object.values(itemSalesMap).sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );

    let bestSellingItem = popularItems.length > 0 ? popularItems[0] : null;

    // Fallback: If no order sales recorded yet for this shop, check if a menu item is flagged popular or best seller
    if (!bestSellingItem && menuItems && menuItems.length > 0) {
      const featuredMenuItem = menuItems.find((i) => i.isPopular || i.isBestSeller);
      if (featuredMenuItem) {
        bestSellingItem = {
          menuItemId: featuredMenuItem._id,
          name: featuredMenuItem.name,
          totalQuantity: 0,
          ordersCount: 0,
          totalRevenue: 0,
          isMenuFeatured: true
        };
      }
    }

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
