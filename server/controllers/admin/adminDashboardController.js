import mongoose from 'mongoose';
import User from '../../models/User.js';
import Shop from '../../models/Shop.js';
import Order from '../../models/Order.js';
import Complaint from '../../models/Complaint.js';

/**
 * Helper to compute human-friendly relative time
 */
const formatRelativeTime = (date) => {
  if (!date) return 'Recently';
  const diffMs = Date.now() - new Date(date).getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

/**
 * GET /api/admin/dashboard
 * Protected by protect + authorizeRoles('admin')
 * Strictly read-only analytics endpoint. Never mutates database records.
 */
export const getDashboardOverview = async (req, res) => {
  try {
    // -------------------------------------------------------------------------
    // 1. Time Boundaries (Today and Past 7 Days)
    // -------------------------------------------------------------------------
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // -------------------------------------------------------------------------
    // 2. Parallel Core Aggregate Counts
    // -------------------------------------------------------------------------
    const [
      studentsCount,
      totalApprovedShops,
      activeShopsCount,
      activeRunnersCount,
      pendingShopOwnersCount,
      pendingRunnersCount,
      ordersTodayCount,
      totalOrdersCount,
      complaintsOpen,
      complaintsInReview,
      complaintsResolved,
      complaintsEscalated,
      complaintsHighPriority,
      totalComplaints
    ] = await Promise.all([
      // Users & Entities
      User.countDocuments({ role: 'student' }),
      Shop.countDocuments({ isApproved: true, isDeleted: { $ne: true } }),
      Shop.countDocuments({ isApproved: true, isOpen: true, isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'runner', status: 'active' }),

      // Approvals Pipeline
      User.countDocuments({
        role: { $in: ['shop', 'shop_owner'] },
        $or: [{ status: 'pending' }, { isApproved: false, status: { $ne: 'rejected' } }]
      }),
      User.countDocuments({
        role: 'runner',
        $or: [{ status: 'pending' }, { isApproved: false, status: { $ne: 'rejected' } }]
      }),

      // Orders
      Order.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),
      Order.countDocuments(),

      // Complaints
      Complaint.countDocuments({ status: 'Open' }),
      Complaint.countDocuments({ status: 'In Review' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Escalated' }),
      Complaint.countDocuments({ priority: 'High', status: { $ne: 'Resolved' } }),
      Complaint.countDocuments()
    ]);

    // -------------------------------------------------------------------------
    // 3. Financial Metrics (Today's Trusted Backend Revenue)
    // Rule 13: Trusted backend billing fields
    // -------------------------------------------------------------------------
    const revenueTodayAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
          status: { $nin: ['CANCELLED', 'REJECTED'] }
        }
      },
      {
        $group: {
          _id: null,
          platformRevenue: { $sum: { $ifNull: ['$billing.platformFee', 5] } },
          grossVolume: { $sum: { $ifNull: ['$billing.grandTotal', '$billing.subtotal'] } },
          deliveryFees: { $sum: { $ifNull: ['$billing.deliveryFee', 30] } }
        }
      }
    ]);

    const platformRevenueToday = revenueTodayAgg[0]?.platformRevenue || 0;
    const grossVolumeToday = revenueTodayAgg[0]?.grossVolume || 0;

    // -------------------------------------------------------------------------
    // 4. Order Breakdown by Status
    // -------------------------------------------------------------------------
    const orderStatusAgg = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const orderStatusCounts = {
      PLACED: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      READY_FOR_PICKUP: 0,
      HANDED_OVER: 0,
      ON_THE_WAY: 0,
      DELIVERED: 0,
      CANCELLED: 0,
      REJECTED: 0
    };

    orderStatusAgg.forEach((item) => {
      if (item._id && orderStatusCounts[item._id] !== undefined) {
        orderStatusCounts[item._id] = item.count;
      }
    });

    // -------------------------------------------------------------------------
    // 5. 7-Day Order Volume Trend
    // -------------------------------------------------------------------------
    const sevenDayOrderAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orderCount: { $sum: 1 },
          platformFee: { $sum: { $ifNull: ['$billing.platformFee', 5] } },
          totalAmount: { $sum: { $ifNull: ['$billing.grandTotal', '$billing.subtotal'] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dailyMap = new Map();
    sevenDayOrderAgg.forEach((row) => dailyMap.set(row._id, row));

    const dailyOrderVolume = [];
    let maxDailyCount = 1;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      const record = dailyMap.get(key) || { orderCount: 0, platformFee: 0, totalAmount: 0 };

      if (record.orderCount > maxDailyCount) {
        maxDailyCount = record.orderCount;
      }

      dailyOrderVolume.push({
        date: key,
        day: dayName,
        orders: record.orderCount,
        platformFee: record.platformFee,
        totalAmount: record.totalAmount
      });
    }

    // Add normalized percentage height for chart visualization
    const dailyVolumeFormatted = dailyOrderVolume.map((item, idx) => ({
      ...item,
      percentage: Math.max(15, Math.round((item.orders / maxDailyCount) * 100)),
      isToday: idx === 6
    }));

    // -------------------------------------------------------------------------
    // 6. Monthly Revenue Growth (Last 4 to 6 Months)
    // -------------------------------------------------------------------------
    const monthlyAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $nin: ['CANCELLED', 'REJECTED'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          revenue: { $sum: { $ifNull: ['$billing.platformFee', 5] } },
          grossTotal: { $sum: { $ifNull: ['$billing.grandTotal', '$billing.subtotal'] } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = [];

    for (let m = 3; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const found = monthlyAgg.find((entry) => entry._id === key);

      monthlyRevenue.push({
        key,
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        revenue: found ? found.revenue : 0,
        grossTotal: found ? found.grossTotal : 0,
        orders: found ? found.orders : 0,
        isCurrent: m === 0
      });
    }

    // -------------------------------------------------------------------------
    // 7. Most Popular Shops Breakdown
    // -------------------------------------------------------------------------
    const popularShopsAgg = await Order.aggregate([
      {
        $match: {
          status: { $nin: ['CANCELLED', 'REJECTED'] }
        }
      },
      {
        $group: {
          _id: '$shop',
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 4 }
    ]);

    const shopIds = popularShopsAgg.map((s) => s._id).filter(Boolean);
    const shopDocs = await Shop.find({ _id: { $in: shopIds } })
      .select('name category image rating')
      .lean();

    const shopDocMap = new Map();
    shopDocs.forEach((s) => shopDocMap.set(String(s._id), s));

    const totalPopularOrders = popularShopsAgg.reduce((acc, curr) => acc + curr.orderCount, 0) || 1;
    const popularColors = [
      { color: 'bg-amber-700', hex: '#b45309' },
      { color: 'bg-slate-500', hex: '#64748b' },
      { color: 'bg-blue-400',  hex: '#60a5fa' },
      { color: 'bg-orange-400', hex: '#fb923c' }
    ];

    const popularShops = popularShopsAgg.map((item, idx) => {
      const s = shopDocMap.get(String(item._id));
      const percentage = Math.round((item.orderCount / totalPopularOrders) * 100);
      return {
        shopId: item._id,
        name: s ? s.name : 'Unknown Shop',
        category: s ? s.category : 'General',
        rating: s ? s.rating : 4.8,
        orderCount: item.orderCount,
        percentage: percentage || 1,
        color: popularColors[idx]?.color || 'bg-gray-400'
      };
    });

    // Average platform rating across approved shops
    const avgRatingAgg = await Shop.aggregate([
      { $match: { isApproved: true, isDeleted: { $ne: true } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const platformAvgRating = avgRatingAgg[0]?.avgRating ? Number(avgRatingAgg[0].avgRating.toFixed(1)) : 4.8;

    // -------------------------------------------------------------------------
    // 8. Dynamic Recent Activity Feed (Operational Events)
    // -------------------------------------------------------------------------
    const [recentOrders, recentShops, recentRunners, recentComplaints] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('student', 'name')
        .populate('shop', 'name')
        .lean(),
      User.find({ role: { $in: ['shop', 'shop_owner'] } })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      User.find({ role: 'runner' })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      Complaint.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .lean()
    ]);

    const activityList = [];

    // Recent orders activities
    recentOrders.forEach((ord) => {
      const isDelivered = ord.status === 'DELIVERED';
      activityList.push({
        id: `act-order-${ord._id}`,
        title: isDelivered ? 'Order Delivered' : `Order #${ord.orderNumber} ${ord.status.replace(/_/g, ' ')}`,
        description: `Order #${ord.orderNumber} for ${ord.student?.name || 'Student'} from "${ord.shop?.name || 'Campus Shop'}".`,
        time: formatRelativeTime(ord.updatedAt || ord.createdAt),
        timestamp: new Date(ord.updatedAt || ord.createdAt).getTime(),
        type: 'order',
        style: isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
      });
    });

    // Recent shop owner registrations / status
    recentShops.forEach((user) => {
      const isApproved = user.isApproved || user.status === 'active';
      const shopTitle = user.shopDetails?.shopName ? `"${user.shopDetails.shopName}"` : `"${user.name}"`;
      activityList.push({
        id: `act-shop-${user._id}`,
        title: isApproved ? 'Shop Owner Active' : 'New Shop Application',
        description: `${shopTitle} registered by ${user.name} (${user.status}).`,
        time: formatRelativeTime(user.createdAt),
        timestamp: new Date(user.createdAt).getTime(),
        type: 'shop',
        style: isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
      });
    });

    // Recent runner applications / approvals
    recentRunners.forEach((user) => {
      const isApproved = user.isApproved || user.status === 'active';
      activityList.push({
        id: `act-runner-${user._id}`,
        title: isApproved ? 'Runner Active' : 'Runner Application',
        description: `${user.name} (${user.department || 'UIU'}) applied as delivery runner.`,
        time: formatRelativeTime(user.createdAt),
        timestamp: new Date(user.createdAt).getTime(),
        type: 'runner',
        style: isApproved ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
      });
    });

    // Recent complaints logged
    recentComplaints.forEach((comp) => {
      const isResolved = comp.status === 'Resolved';
      activityList.push({
        id: `act-comp-${comp._id}`,
        title: isResolved ? 'Complaint Resolved' : `Complaint: ${comp.ticketId}`,
        description: `Ticket #${comp.ticketId} [${comp.category}] — ${comp.subject}`,
        time: formatRelativeTime(comp.updatedAt || comp.createdAt),
        timestamp: new Date(comp.updatedAt || comp.createdAt).getTime(),
        type: 'complaint',
        style: isResolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      });
    });

    // Sort by timestamp desc and take top 8
    activityList.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivities = activityList.slice(0, 8);

    // -------------------------------------------------------------------------
    // 9. Pre-formatted Stat Cards (matching Admin UI structure)
    // -------------------------------------------------------------------------
    const statCards = [
      {
        id: 'students',
        label: 'Students',
        value: studentsCount.toLocaleString(),
        change: `${studentsCount} campus accounts`,
        bg: 'bg-blue-100',
        color: 'text-blue-700'
      },
      {
        id: 'shops',
        label: 'Active Shops',
        value: activeShopsCount.toString(),
        change: `${pendingShopOwnersCount} pending review`,
        bg: 'bg-cyan-100',
        color: 'text-cyan-700'
      },
      {
        id: 'runners',
        label: 'Runners',
        value: activeRunnersCount.toString(),
        change: `${pendingRunnersCount} waiting review`,
        bg: 'bg-orange-100',
        color: 'text-orange-700'
      },
      {
        id: 'ordersToday',
        label: 'Orders Today',
        value: ordersTodayCount.toLocaleString(),
        change: `${totalOrdersCount} all-time orders`,
        bg: 'bg-blue-100',
        color: 'text-blue-700'
      },
      {
        id: 'dailyRevenue',
        label: 'Daily Revenue',
        value: `৳ ${platformRevenueToday.toLocaleString()}`,
        change: `Gross ৳ ${grossVolumeToday.toLocaleString()}`,
        bg: 'bg-green-100',
        color: 'text-green-700'
      },
      {
        id: 'rating',
        label: 'Avg. Rating',
        value: platformAvgRating.toString(),
        change: `${totalApprovedShops} verified shops`,
        bg: 'bg-yellow-100',
        color: 'text-yellow-700'
      }
    ];

    // -------------------------------------------------------------------------
    // 10. Return Side-Effect Free Dashboard Response
    // -------------------------------------------------------------------------
    return res.status(200).json({
      success: true,
      message: 'Admin dashboard metrics retrieved successfully',
      data: {
        metrics: {
          students: studentsCount,
          totalApprovedShops,
          activeShops: activeShopsCount,
          activeRunners: activeRunnersCount,
          ordersToday: ordersTodayCount,
          totalOrders: totalOrdersCount,
          platformRevenueToday,
          grossVolumeToday,
          platformAvgRating
        },
        pipeline: {
          pendingShopOwners: pendingShopOwnersCount,
          pendingRunners: pendingRunnersCount
        },
        complaintOverview: {
          open: complaintsOpen,
          inReview: complaintsInReview,
          resolved: complaintsResolved,
          escalated: complaintsEscalated,
          critical: complaintsHighPriority,
          total: totalComplaints
        },
        orderStatusCounts,
        dailyOrderVolume: dailyVolumeFormatted,
        monthlyRevenue,
        popularShops,
        recentActivities,
        statCards
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard metrics'
    });
  }
};
