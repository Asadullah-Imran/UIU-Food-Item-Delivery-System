import Complaint from '../../models/Complaint.js';
import Order from '../../models/Order.js';

// @desc    File a new complaint / dispute ticket for an order
// @route   POST /api/student/complaints
// @access  Private (Student)
export const createStudentComplaint = async (req, res) => {
  try {
    const { orderId, orderNumber, subject, category, description, priority = 'Medium' } = req.body;

    if (!subject || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, category, and description for the complaint'
      });
    }

    let againstUser = null;
    let validOrderNumber = orderNumber;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        validOrderNumber = order.orderNumber;
        againstUser = order.runner || order.shop;
      }
    }

    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const complaint = await Complaint.create({
      ticketId,
      orderNumber: validOrderNumber || '#UIU-GENERAL',
      submittedBy: req.user.id,
      against: againstUser,
      subject,
      category,
      description,
      priority,
      status: 'Open'
    });

    res.status(201).json({
      success: true,
      message: `Complaint ticket ${ticketId} registered successfully. Campus administration has been notified.`,
      complaint
    });
  } catch (error) {
    console.error('createStudentComplaint Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's submitted complaints
// @route   GET /api/student/complaints
// @access  Private (Student)
export const getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ submittedBy: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    console.error('getStudentComplaints Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
