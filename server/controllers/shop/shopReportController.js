import Shop from '../../models/Shop.js';
import Order from '../../models/Order.js';
import Transaction from '../../models/Transaction.js';

/**
 * @desc    Generate sales reports & revenue analytics for authenticated shop
 * @route   GET /api/shops/reports
 * @access  Private (Shop Owner, Admin)
 */
export const getShopReports = async (req, res) => {
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

    const baseFilter = {
      shop: shop._id
    };

    if (req.query.from || req.query.to) {
      baseFilter.createdAt = {};

      if (req.query.from) {
        const fromDate = new Date(req.query.from);

        if (Number.isNaN(fromDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid from date'
          });
        }

        baseFilter.createdAt.$gte = fromDate;
      }

      if (req.query.to) {
        const toDate = new Date(req.query.to);

        if (Number.isNaN(toDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid to date'
          });
        }

        toDate.setHours(23, 59, 59, 999);
        baseFilter.createdAt.$lte = toDate;
      }
    }

    const deliveredFilter = {
      ...baseFilter,
      status: 'DELIVERED'
    };

    // Parallel queries for status counts and delivered orders
    const [
      deliveredOrders,
      deliveredCount,
      rejectedCount,
      cancelledCount,
      allOrdersCount
    ] = await Promise.all([
      Order.find(deliveredFilter)
        .populate('student', 'name email phone universityId')
        .populate('items.menuItem', 'name price image category')
        .sort({ createdAt: -1 }),

      Order.countDocuments({
        ...baseFilter,
        status: 'DELIVERED'
      }),

      Order.countDocuments({
        ...baseFilter,
        status: 'REJECTED'
      }),

      Order.countDocuments({
        ...baseFilter,
        status: 'CANCELLED'
      }),

      Order.countDocuments(baseFilter)
    ]);

    const totalOrders = deliveredOrders.length;

    // Sum revenue strictly using shopAmount or subtotal (never grandTotal)
    const totalRevenue = deliveredOrders.reduce(
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

    const averageOrderValue =
      totalOrders > 0
        ? totalRevenue / totalOrders
        : 0;

    // Aggregate best-selling items from delivered orders
    const itemSales = {};
    const categoryTotals = {};

    for (const order of deliveredOrders) {
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          const key = item.menuItem?._id?.toString() || item.menuItem?.toString() || item.name;

          if (!itemSales[key]) {
            itemSales[key] = {
              name: item.name || 'Unknown Item',
              quantity: 0,
              revenue: 0,
              image: item.menuItem?.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop'
            };
          }

          const qty = Number(item.quantity || 1);
          const price = Number(item.price || 0);

          itemSales[key].quantity += qty;
          itemSales[key].revenue += price * qty;

          // Category attribution
          const cat = item.menuItem?.category || 'Meals';
          categoryTotals[cat] = (categoryTotals[cat] || 0) + (price * qty);
        }
      }
    }

    const bestSellingItems = Object.values(itemSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Calculate periodic revenue bounds
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayOrders, weekOrders, monthOrders] = await Promise.all([
      Order.find({ shop: shop._id, status: 'DELIVERED', createdAt: { $gte: startOfToday } }),
      Order.find({ shop: shop._id, status: 'DELIVERED', createdAt: { $gte: startOfWeek } }),
      Order.find({ shop: shop._id, status: 'DELIVERED', createdAt: { $gte: startOfMonth } })
    ]);

    const sumRevenue = (ordersList) =>
      ordersList.reduce((sum, ord) => sum + Number(
        ord.shopAmount ??
        ord.billing?.shopAmount ??
        ord.billing?.subtotal ??
        ord.subtotal ??
        0
      ), 0);

    const todayRevenue = sumRevenue(todayOrders);
    const weeklyRevenue = sumRevenue(weekOrders);
    const monthlyRevenue = sumRevenue(monthOrders);

    // Category percentage breakdown
    const catRevenueSum = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    const categoryPerformance = Object.entries(categoryTotals).map(([name, val]) => ({
      name,
      amount: val,
      value: catRevenueSum > 0 ? Math.round((val / catRevenueSum) * 100) : 0
    }));

    return res.status(200).json({
      success: true,

      report: {
        totalOrders,
        allOrdersCount,
        deliveredOrders: deliveredCount,
        rejectedOrders: rejectedCount,
        cancelledOrders: cancelledCount,

        totalRevenue: Number(totalRevenue.toFixed(2)),
        averageOrderValue: Number(averageOrderValue.toFixed(2)),

        todayRevenue: Number(todayRevenue.toFixed(2)),
        weeklyRevenue: Number(weeklyRevenue.toFixed(2)),
        monthlyRevenue: Number(monthlyRevenue.toFixed(2)),

        bestSellingItems,
        categoryPerformance,
        orders: deliveredOrders
      }
    });

  } catch (error) {
    console.error('getShopReports Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to generate shop report'
    });
  }
};

/**
 * @desc    Get ledger transactions for authenticated shop
 * @route   GET /api/shops/transactions
 * @access  Private (Shop Owner, Admin)
 */
export const getShopTransactions = async (req, res) => {
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

    const transactions = await Transaction.find({
      $or: [
        { shop: shop._id },
        { user: req.user._id, type: 'SHOP_EARNING' }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('order', 'orderNumber status billing createdAt');

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error('getShopTransactions Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch shop transactions'
    });
  }
};
