import OrderChat from '../../models/OrderChat.js';
import Order from '../../models/Order.js';

// @desc    Get order chat message history for shop owner
// @route   GET /api/shop/chat/:orderNumber
// @access  Private (Shop)
export const getShopOrderChat = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    let chat = await OrderChat.findOne({ orderNumber })
      .populate('messages.sender', 'name avatar role');

    if (!chat) {
      const order = await Order.findOne({ orderNumber })
        .populate('student', 'name avatar')
        .populate('runner', 'name avatar')
        .populate('shop', 'name avatar');

      const participants = [];
      if (order?.student) participants.push(order.student._id);
      if (order?.runner) participants.push(order.runner._id);
      if (order?.shop) participants.push(order.shop._id);

      chat = await OrderChat.create({
        orderNumber,
        participants,
        messages: [
          {
            sender: req.user.id,
            senderRole: 'system',
            senderName: 'UIU Campus Support',
            avatar: req.user.avatar || 'https://i.pravatar.cc/150?u=shop',
            target: 'all',
            text: `Order chat initiated for ${orderNumber}. You can now message the ordering student directly.`,
            status: 'read',
            createdAt: new Date()
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('getShopOrderChat Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message in order chat as shop
// @route   POST /api/shop/chat/:orderNumber
// @access  Private (Shop)
export const sendShopChatMessage = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { text, target = 'student' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    let chat = await OrderChat.findOne({ orderNumber });
    if (!chat) {
      const order = await Order.findOne({ orderNumber });
      const participants = [];
      if (order?.student) participants.push(order.student);
      if (order?.runner) participants.push(order.runner);
      if (order?.shop) participants.push(order.shop);

      chat = await OrderChat.create({
        orderNumber,
        participants,
        messages: []
      });
    }

    const shopName = req.user.shopDetails?.shopName || req.user.name || 'Shop Owner';
    const newMessage = {
      sender: req.user.id,
      senderRole: 'shop',
      senderName: shopName,
      avatar: req.user.avatar || 'https://i.pravatar.cc/150?u=shop',
      target,
      text: text.trim(),
      status: 'sent',
      createdAt: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = text.trim();
    chat.lastMessageAt = new Date();
    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Message sent',
      chatMessage: newMessage
    });
  } catch (error) {
    console.error('sendShopChatMessage Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
