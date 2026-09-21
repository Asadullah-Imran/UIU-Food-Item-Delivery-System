import User from '../../models/User.js';
import Order from '../../models/Order.js';
import Transaction from '../../models/Transaction.js';

// @desc    Get runner profile details & stats
// @route   GET /api/runner/profile
// @access  Private (Runner)
export const getRunnerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Runner user not found' });
    }

    res.status(200).json({
      success: true,
      runner: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        universityId: user.universityId,
        department: user.department,
        avatar: user.avatar,
        status: user.status,
        isApproved: user.isApproved,
        isRunner: user.isRunner || user.role === 'runner',
        vehicleType: user.runnerDetails?.vehicleType || 'Bicycle',
        rating: user.runnerDetails?.rating || 5.0,
        totalTrips: user.runnerDetails?.totalTrips || 0,
        walletBalance: user.runnerDetails?.walletBalance || user.walletBalance || 0,
        isAvailable: user.runnerDetails?.isAvailable !== false
      }
    });
  } catch (error) {
    console.error('getRunnerProfile Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update runner profile info (vehicle, phone, avatar)
// @route   PUT /api/runner/profile
// @access  Private (Runner)
export const updateRunnerProfile = async (req, res) => {
  try {
    const { name, phone, avatar, vehicleType } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Runner user not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (vehicleType) {
      if (!user.runnerDetails) user.runnerDetails = {};
      user.runnerDetails.vehicleType = vehicleType;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Runner profile updated successfully',
      runner: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        vehicleType: user.runnerDetails?.vehicleType || 'Bicycle'
      }
    });
  } catch (error) {
    console.error('updateRunnerProfile Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle runner online / offline availability
// @route   PATCH /api/runner/availability
// @access  Private (Runner)
export const toggleRunnerAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Runner user not found' });
    }

    if (!user.runnerDetails) user.runnerDetails = {};
    const newAvailability = req.body.isAvailable !== undefined 
      ? Boolean(req.body.isAvailable) 
      : !user.runnerDetails.isAvailable;

    user.runnerDetails.isAvailable = newAvailability;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Runner availability is now ${newAvailability ? 'ONLINE (Accepting Deliveries)' : 'OFFLINE'}`,
      isAvailable: newAvailability
    });
  } catch (error) {
    console.error('toggleRunnerAvailability Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get runner top summary metrics for dashboard
// @route   GET /api/runner/dashboard-metrics
// @access  Private (Runner)
export const getDashboardMetrics = async (req, res) => {
  try {
    const runnerId = req.user.id;
    const user = await User.findById(runnerId);

    // 1. Nearby / Available unassigned orders
    const nearbyRequestsCount = await Order.countDocuments({
      runner: null,
      status: { $in: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'] }
    });

    // 2. Active delivery for this runner
    const activeDelivery = await Order.findOne({
      runner: runnerId,
      status: { $in: ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'ON_THE_WAY'] }
    })
      .populate('shop', 'name location image phone')
      .populate('student', 'name phone universityId deliveryRoom');

    // 3. Completed today count
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const completedTodayCount = await Order.countDocuments({
      runner: runnerId,
      status: 'DELIVERED',
      updatedAt: { $gte: startOfToday }
    });

    // 4. Today's earnings from transactions
    const todayEarningsTransactions = await Transaction.find({
      user: runnerId,
      type: 'RUNNER_EARNING',
      status: 'COMPLETED',
      createdAt: { $gte: startOfToday }
    });

    const todayEarnings = todayEarningsTransactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    res.status(200).json({
      success: true,
      metrics: {
        nearbyRequests: nearbyRequestsCount,
        activeDeliveries: activeDelivery ? 1 : 0,
        completedToday: completedTodayCount,
        todayEarnings: todayEarnings || (completedTodayCount * 30),
        totalTrips: user?.runnerDetails?.totalTrips || 0,
        rating: user?.runnerDetails?.rating || 5.0,
        walletBalance: user?.runnerDetails?.walletBalance || user?.walletBalance || 0,
        isAvailable: user?.runnerDetails?.isAvailable !== false
      },
      activeDelivery
    });
  } catch (error) {
    console.error('getDashboardMetrics Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
