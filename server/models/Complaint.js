import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true
    },
    orderNumber: String,
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    against: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    subject: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Late Delivery', 'Wrong Food Items', 'Missing Food Item', 'Food Quality', 'Spill / Damaged Item', 'Payment Issue', 'Other'],
      default: 'Other'
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In Review', 'Resolved', 'Escalated'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    adminResolution: String
  },
  {
    timestamps: true
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
