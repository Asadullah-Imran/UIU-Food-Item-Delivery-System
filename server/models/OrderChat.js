import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  senderRole: {
    type: String,
    enum: ['student', 'shop', 'runner', 'admin', 'system'],
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  avatar: String,
  target: {
    type: String,
    enum: ['all', 'shop', 'runner', 'student'],
    default: 'all'
  },
  text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const orderChatSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    lastMessage: {
      type: String,
      default: ''
    },
    lastMessageAt: {
      type: Date,
      default: Date.now
    },
    messages: [messageSchema]
  },
  {
    timestamps: true
  }
);

const OrderChat = mongoose.model('OrderChat', orderChatSchema);
export default OrderChat;
