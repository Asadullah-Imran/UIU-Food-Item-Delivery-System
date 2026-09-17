import Order from '../../models/Order.js';
import Shop from '../../models/Shop.js';
import User from '../../models/User.js';

// @desc    Submit 5-star rating and review for shop & runner
// @route   POST /api/student/orders/:orderId/rate
// @access  Private (Student)
export const rateOrderAndRunner = async (req, res) => {
  try {
    const { shopRating, runnerRating, feedback } = req.body;

    const order = await Order.findOne({
      _id: req.params.orderId,
      student: req.user.id
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'DELIVERED') {
      return res.status(400).json({
        success: false,
        message: 'Only delivered orders can be rated'
      });
    }

    order.ratings = {
      shopRating: Number(shopRating) || 5,
      runnerRating: Number(runnerRating) || 5,
      feedback: feedback || ''
    };

    await order.save();

    // Update Shop Average Rating
    if (shopRating) {
      const shop = await Shop.findById(order.shop);
      if (shop) {
        const totalReviews = (shop.reviewsCount || 0) + 1;
        const currentTotal = (shop.rating || 4.8) * (shop.reviewsCount || 1);
        const newAvg = (currentTotal + Number(shopRating)) / totalReviews;
        shop.rating = Number(newAvg.toFixed(1));
        shop.reviewsCount = totalReviews;
        await shop.save();
      }
    }

    // Update Runner Average Rating
    if (runnerRating && order.runner) {
      const runner = await User.findById(order.runner);
      if (runner && runner.runnerDetails) {
        const trips = runner.runnerDetails.totalTrips || 1;
        const currentRating = runner.runnerDetails.rating || 5.0;
        const newRating = (currentRating * (trips - 1) + Number(runnerRating)) / trips;
        runner.runnerDetails.rating = Number(newRating.toFixed(1));
        await runner.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Thank you for your rating and feedback!',
      ratings: order.ratings
    });
  } catch (error) {
    console.error('rateOrderAndRunner Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
