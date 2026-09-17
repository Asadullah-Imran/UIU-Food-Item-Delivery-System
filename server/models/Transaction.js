import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      default: null
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    type: {
      type: String,
      enum: [
        'TOPUP',            // Student tops up wallet balance
        'ORDER_PAYMENT',    // Student pays for food order
        'RUNNER_EARNING',   // Runner credited delivery fee
        'SHOP_EARNING',     // Shop credited food sale
        'REFUND',           // Student refunded for cancelled order
        'PLATFORM_FEE'      // Platform fee collected
      ],
      required: true
    },
    direction: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    paymentGateway: {
      type: String,
      default: 'In-App Campus Wallet'
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'PENDING', 'FAILED'],
      default: 'COMPLETED'
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
