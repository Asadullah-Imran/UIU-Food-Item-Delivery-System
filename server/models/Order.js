import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  note: String
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    runner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    items: [orderItemSchema],
    billing: {
      subtotal: { type: Number, required: true },
      deliveryFee: { type: Number, default: 30 },
      discount: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true }
    },
    payment: {
      method: {
        type: String,
        enum: ['wallet', 'bkash', 'cod'],
        default: 'wallet'
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'paid'
      },
      transactionId: String
    },
    deliveryAddress: {
      building: { type: String, default: 'Academic Building' },
      room: { type: String, default: 'Room 412' },
      dropOffNote: String
    },
    status: {
      type: String,
      enum: [
        'PLACED',
        'CONFIRMED',
        'PREPARING',
        'READY_FOR_PICKUP',
        'ON_THE_WAY',
        'DELIVERED',
        'CANCELLED',
        'REJECTED'
      ],
      default: 'PLACED'
    },
    runnerReward: {
      type: Number,
      default: 40
    },
    specialInstructions: String,
    eta: {
      type: String,
      default: '15-20 mins'
    },
    timeline: [
      {
        status: String,
        time: { type: Date, default: Date.now },
        note: String
      }
    ],
    ratings: {
      shopRating: Number,
      runnerRating: Number,
      feedback: String
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
