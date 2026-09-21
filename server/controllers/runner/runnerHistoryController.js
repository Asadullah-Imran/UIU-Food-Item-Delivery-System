import Order from '../../models/Order.js';
import User from '../../models/User.js';

// @desc    Get completed delivery history for runner
// @route   GET /api/runner/history
// @access  Private (Runner)
export const getDeliveryHistory = async (req, res) => {
  try {
    const runnerId = req.user.id;

    const completedOrders = await Order.find({
      runner: runnerId,
      status: 'DELIVERED'
    })
      .populate('shop', 'name location image phone category')
      .populate('student', 'name phone universityId deliveryRoom')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: completedOrders.length,
      history: completedOrders
    });
  } catch (error) {
    console.error('getDeliveryHistory Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get runner performance, rating and badges
// @route   GET /api/runner/performance
// @access  Private (Runner)
export const getRunnerPerformance = async (req, res) => {
  try {
    const runnerId = req.user.id;
    const user = await User.findById(runnerId);

    const completedOrders = await Order.find({
      runner: runnerId,
      status: 'DELIVERED'
    });

    const totalDeliveries = completedOrders.length || user?.runnerDetails?.totalTrips || 0;
    const avgRating = user?.runnerDetails?.rating || 5.0;

    res.status(200).json({
      success: true,
      performance: {
        rating: avgRating,
        totalDeliveries,
        onTimeRate: '98%',
        acceptanceRate: '96%',
        achievements: [
          { name: 'Fast Delivery', progress: '12/15', pct: 80, badge: 'Zap' },
          { name: '100 Deliveries', progress: `${Math.min(totalDeliveries, 100)}/100`, pct: Math.min(Math.round((totalDeliveries / 100) * 100), 100), badge: 'Package' },
          { name: 'Top Rated', progress: `${avgRating}/5.0`, pct: 98, badge: 'Star' },
          { name: 'Campus Legend', progress: 'Gold Runner', pct: 100, badge: 'Award' }
        ]
      }
    });
  } catch (error) {
    console.error('getRunnerPerformance Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
