import OrderChat from '../../models/OrderChat.js';
import Order from '../../models/Order.js';

// @desc    Get order chat message history for student
// @route   GET /api/student/chat/:orderNumber
// @access  Private (Student)
export const getStudentOrderChat = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    let chat = await OrderChat.findOne({ orderNumber })
      .populate('messages.sender', 'name avatar role');

    if (!chat) {
      // Find order to extract participants
      const order = await Order.findOne({ orderNumber });
      const participants = [req.user.id];
      if (order?.runner) participants.push(order.runner);
      if (order?.shop) participants.push(order.shop);

      chat = await OrderChat.create({
        orderNumber,
        participants,
        messages: [
          {
            sender: req.user.id,
            senderRole: 'system',
            senderName: 'UIU Campus Support',
            text: `Order chat initiated for ${orderNumber}. You can communicate directly with your assigned runner and shop.`,
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
    console.error('getStudentOrderChat Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message in order chat
// @route   POST /api/student/chat/:orderNumber
// @access  Private (Student)
export const sendStudentChatMessage = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { text, target = 'all' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    let chat = await OrderChat.findOne({ orderNumber });
    if (!chat) {
      chat = await OrderChat.create({
        orderNumber,
        participants: [req.user.id],
        messages: []
      });
    }

    const newMessage = {
      sender: req.user.id,
      senderRole: 'student',
      senderName: req.user.name,
      avatar: req.user.avatar || 'https://i.pravatar.cc/150?u=student',
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
    console.error('sendStudentChatMessage Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
