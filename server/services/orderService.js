import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

/**
 * Refunds student wallet for a cancelled or rejected order and records the REFUND transaction.
 * @param {Object} order - The mongoose order document
 * @param {string} reason - Description/reason for the refund
 * @returns {Promise<{ refunded: boolean, refundAmount: number, newBalance: number, refundTxn: Object }>}
 */
export const refundOrderToStudent = async (order, reason = 'Order rejected by shop', session = null) => {
  const refundAmount = Number(order.billing?.grandTotal || order.grandTotal || 0);
  if (!order.student || refundAmount <= 0) {
    return { refunded: false, refundAmount: 0, newBalance: 0, refundTxn: null };
  }

  const studentId = order.student._id || order.student;
  const student = session
    ? await User.findById(studentId).session(session)
    : await User.findById(studentId);

  if (!student) {
    return { refunded: false, refundAmount: 0, newBalance: 0, refundTxn: null };
  }

  const currentBalance = student.walletBalance || 0;
  const newBalance = currentBalance + refundAmount;
  student.walletBalance = newBalance;
  if (session) {
    await student.save({ session });
  } else {
    await student.save();
  }

  const transactionId = `TXN-REFUND-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const description = reason
    ? `Full refund: ${reason} (${order.orderNumber})`
    : `Full refund for ${order.status.toLowerCase()} order ${order.orderNumber}`;

  const txnDoc = {
    transactionId,
    user: student._id,
    shop: order.shop?._id || order.shop || null,
    order: order._id,
    type: 'REFUND',
    direction: 'CREDIT',
    amount: refundAmount,
    balanceAfter: newBalance,
    paymentGateway: 'In-App Campus Wallet',
    description,
    status: 'COMPLETED'
  };

  const refundTxn = session
    ? (await Transaction.create([txnDoc], { session }))[0]
    : await Transaction.create(txnDoc);

  return {
    refunded: true,
    refundAmount,
    newBalance,
    refundTxn
  };
};
