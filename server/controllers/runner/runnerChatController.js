import Order from '../../models/Order.js';
import OrderChat from '../../models/OrderChat.js';

// @desc    Get tri-party chat history for an order
// @route   GET /api/runner/chat/:orderNumber
// @access  Private (Runner)
export const getRunnerChat = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const cleanNum = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;

    const order = await Order.findOne({ orderNumber: cleanNum })
      .populate('shop', 'name location image phone')
      .populate('student', 'name phone universityId deliveryRoom avatar')
      .populate('runner', 'name phone runnerDetails avatar');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.runner) {
      return res.status(403).json({ success: false, message: 'No runner has accepted this order yet' });
    }

    const runnerId = req.user._id?.toString() || req.user.id;
    if (order.runner._id?.toString() !== runnerId && order.runner.toString() !== runnerId) {
      return res.status(403).json({ success: false, message: 'This order is not assigned to your runner account' });
    }

    let chat = await OrderChat.findOne({ orderNumber: cleanNum });

    if (!chat) {
      const participants = [];
      if (order?.student) participants.push(order.student._id);
      if (order?.runner) participants.push(order.runner._id);
      if (order?.shop) participants.push(order.shop._id);

      chat = await OrderChat.create({
        orderNumber: cleanNum,
        order: order?._id,
        participants,
        messages: [
          {
            sender: req.user.id,
            senderRole: 'system',
            senderName: 'UIU Campus Support',
            avatar: req.user.avatar || 'https://i.pravatar.cc/150?u=support',
            target: 'all',
            text: `Order ${cleanNum} confirmed. You can now message the ordering student directly.`,
            status: 'read',
            createdAt: new Date()
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      orderNumber: cleanNum,
      order,
      chat
    });
  } catch (error) {
    console.error('getRunnerChat Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send instant message as runner in order thread
// @route   POST /api/runner/chat/:orderNumber
// @access  Private (Runner)
export const sendRunnerMessage = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { text, target = 'student' } = req.body;
    const cleanNum = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
    }

    const order = await Order.findOne({ orderNumber: cleanNum });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.runner) {
      return res.status(403).json({ success: false, message: 'No runner has accepted this order yet' });
    }

    const runnerId = req.user._id?.toString() || req.user.id;
    if (order.runner.toString() !== runnerId) {
      return res.status(403).json({ success: false, message: 'This order is not assigned to your runner account' });
    }

    if (target !== 'student') {
      return res.status(400).json({ success: false, message: 'Runner chat is only allowed with the ordering student' });
    }

    let chat = await OrderChat.findOne({ orderNumber: cleanNum });
    if (!chat) {
      const participants = [];
      if (order?.student) participants.push(order.student);
      if (order?.runner) participants.push(order.runner);
      if (order?.shop) participants.push(order.shop);

      chat = await OrderChat.create({
        orderNumber: cleanNum,
        order: order?._id,
        participants,
        messages: []
      });
    }

    const newMsg = {
      sender: req.user.id,
      senderRole: 'runner',
      senderName: req.user.name || 'Delivery Runner',
      avatar: req.user.avatar || 'https://i.pravatar.cc/150?u=runner',
      target,
      text: text.trim(),
      status: 'sent',
      createdAt: new Date()
    };

    chat.messages.push(newMsg);
    chat.lastMessage = text.trim();
    chat.lastMessageAt = new Date();
    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      newMessage: newMsg,
      totalMessages: chat.messages.length
    });
  } catch (error) {
    console.error('sendRunnerMessage Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
