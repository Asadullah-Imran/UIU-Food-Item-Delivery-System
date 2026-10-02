import Order from '../../models/Order.js';
import User from '../../models/User.js';

// @desc    Get all available delivery requests on campus
// @route   GET /api/runner/deliveries/available
// @access  Private (Runner)
export const getAvailableDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({
      runner: null,
      status: 'READY_FOR_PICKUP'
    })
      .populate('shop', 'name location image phone category')
      .populate('student', 'name phone universityId deliveryRoom')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      deliveries: orders
    });
  } catch (error) {
    console.error('getAvailableDeliveries Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept / Claim an available delivery order
// @route   POST /api/runner/deliveries/:orderId/accept
// @access  Private (Runner)
export const acceptDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const runnerId = req.user.id;

    const runner = await User.findById(runnerId);
    if (!runner) {
      return res.status(404).json({ success: false, message: 'Runner not found' });
    }

    // Check if runner already has an active ongoing delivery
    const existingActive = await Order.findOne({
      runner: runnerId,
      status: { $in: ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'HANDED_OVER', 'ON_THE_WAY'] }
    });

    if (existingActive && existingActive._id.toString() !== orderId) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active ongoing delivery! Complete it before claiming another order.'
      });
    }

    // Atomic find and claim to prevent race condition
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        runner: null,
        status: 'READY_FOR_PICKUP'
      },
      {
        $set: {
          runner: runnerId,
        },
        $push: {
          timeline: {
            status: 'RUNNER_ASSIGNED',
            time: new Date(),
            note: `Runner ${runner.name} accepted the delivery order`
          }
        }
      },
      { new: true }
    )
      .populate('shop', 'name location image phone')
      .populate('student', 'name phone universityId deliveryRoom');

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Order is no longer available or was already accepted by another runner!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Delivery accepted successfully! Head to the campus shop counter for pickup.',
      order
    });
  } catch (error) {
    console.error('acceptDelivery Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
