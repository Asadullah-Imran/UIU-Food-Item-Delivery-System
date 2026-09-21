import Order from '../../models/Order.js';

// In-memory conversation store for active order threads
const activeOrderThreads = new Map();

// @desc    Get tri-party chat history for an order
// @route   GET /api/runner/chat/:orderNumber
// @access  Private (Runner)
export const getRunnerChat = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const cleanNum = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;

    const order = await Order.findOne({ orderNumber: cleanNum })
      .populate('shop', 'name location image phone')
      .populate('student', 'name phone universityId deliveryRoom')
      .populate('runner', 'name phone runnerDetails');

    let messages = activeOrderThreads.get(cleanNum);
    if (!messages) {
      messages = [
        {
          id: 'msg-system-1',
          sender: 'System',
          senderRole: 'system',
          text: `Order ${cleanNum} confirmed. Runner tri-party coordination active.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      activeOrderThreads.set(cleanNum, messages);
    }

    res.status(200).json({
      success: true,
      orderNumber: cleanNum,
      order,
      messages
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
    const { text } = req.body;
    const cleanNum = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
    }

    let messages = activeOrderThreads.get(cleanNum) || [];
    const newMsg = {
      id: `msg-run-${Date.now()}`,
      sender: req.user.name || 'Delivery Runner',
      senderRole: 'runner',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    messages.push(newMsg);
    activeOrderThreads.set(cleanNum, messages);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      newMessage: newMsg,
      totalMessages: messages.length
    });
  } catch (error) {
    console.error('sendRunnerMessage Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
