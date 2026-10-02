import mongoose from 'mongoose';
import Complaint from '../../models/Complaint.js';
import User from '../../models/User.js';
import Order from '../../models/Order.js';

// ---------------------------------------------------------------------------
// Constants & Allowed Values
// ---------------------------------------------------------------------------
const ALLOWED_SORT = {
  newest:   { createdAt: -1 },
  oldest:   { createdAt:  1 },
  priority: { priority: -1 }
};

const VALID_STATUSES = ['Open', 'In Review', 'Resolved', 'Escalated'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

/**
 * Case-insensitive normalizer for complaint status.
 */
const normalizeStatus = (val) => {
  if (!val || typeof val !== 'string') return null;
  const match = VALID_STATUSES.find(
    (s) => s.toLowerCase() === val.trim().toLowerCase()
  );
  return match || null;
};

/**
 * Case-insensitive normalizer for complaint priority.
 */
const normalizePriority = (val) => {
  if (!val || typeof val !== 'string') return null;
  const match = VALID_PRIORITIES.find(
    (p) => p.toLowerCase() === val.trim().toLowerCase()
  );
  return match || null;
};

/**
 * Helper to look up a complaint by MongoDB ObjectId or human-readable ticketId.
 */
const findComplaintByIdOrTicket = async (identifier) => {
  if (!identifier || typeof identifier !== 'string') return null;
  const cleanId = identifier.trim().replace(/^#/, '');

  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    const doc = await Complaint.findById(cleanId);
    if (doc) return doc;
  }

  return await Complaint.findOne({
    $or: [
      { ticketId: cleanId },
      { ticketId: `#${cleanId}` },
      { ticketId: { $regex: `^#?${cleanId}$`, $options: 'i' } }
    ]
  });
};

// ---------------------------------------------------------------------------
// GET /api/admin/complaints
// Query: search, category, status, priority, sort, page, limit
// ---------------------------------------------------------------------------
export const listComplaints = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      priority,
      sort  = 'newest',
      page  = 1,
      limit = 10
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip     = (pageNum - 1) * limitNum;

    const filter = {};

    // 1. Text search across ticketId, subject, orderNumber, description, submitter name/email
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      const cleanTicket = q.replace(/^#/, '');

      const matchingUsers = await User.find({
        $or: [
          { name:  { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = matchingUsers.map((u) => u._id);

      const searchConditions = [
        { ticketId:    { $regex: cleanTicket, $options: 'i' } },
        { subject:     { $regex: q, $options: 'i' } },
        { orderNumber: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];

      if (userIds.length > 0) {
        searchConditions.push({ submittedBy: { $in: userIds } });
      }

      filter.$or = searchConditions;
    }

    // 2. Category filter
    if (category && typeof category === 'string' && category.trim().toLowerCase() !== 'all') {
      filter.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    // 3. Status filter
    if (status && typeof status === 'string' && status.trim().toLowerCase() !== 'all') {
      const matched = normalizeStatus(status);
      if (matched) {
        filter.status = matched;
      }
    }

    // 4. Priority filter
    if (priority && typeof priority === 'string' && priority.trim().toLowerCase() !== 'all') {
      const matched = normalizePriority(priority);
      if (matched) {
        filter.priority = matched;
      }
    }

    const sortOption = ALLOWED_SORT[sort] || ALLOWED_SORT.newest;

    // Start of today for resolvedToday metric
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [total, complaints, allCounts, resolvedToday] = await Promise.all([
      Complaint.countDocuments(filter),
      Complaint.find(filter)
        .populate('submittedBy', 'name email role studentId phone avatar department')
        .populate('against', 'name email role shopDetails phone avatar')
        .populate('order', 'orderNumber totalAmount orderStatus paymentStatus createdAt')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Complaint.aggregate([
        {
          $group: {
            _id: null,
            total:        { $sum: 1 },
            open:         { $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] } },
            inReview:     { $sum: { $cond: [{ $eq: ['$status', 'In Review'] }, 1, 0] } },
            resolved:     { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
            escalated:    { $sum: { $cond: [{ $eq: ['$status', 'Escalated'] }, 1, 0] } },
            highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } }
          }
        }
      ]),
      Complaint.countDocuments({
        status: 'Resolved',
        updatedAt: { $gte: startOfToday }
      })
    ]);

    const rawStats = allCounts[0] || {};
    const stats = {
      total:        rawStats.total || 0,
      open:         rawStats.open || 0,
      inReview:     rawStats.inReview || 0,
      resolved:     rawStats.resolved || 0,
      escalated:    rawStats.escalated || 0,
      highPriority: rawStats.highPriority || 0,
      resolvedToday
    };

    // Format complaints with UI-friendly attributes while preserving raw data
    const formattedComplaints = complaints.map((c) => ({
      ...c,
      id: c.ticketId,
      submittedByName: c.submittedBy?.name || 'Unknown',
      email: c.submittedBy?.email || 'N/A',
      role:
        c.submittedBy?.role === 'shop'
          ? 'Vendor'
          : c.submittedBy?.role
          ? c.submittedBy.role.charAt(0).toUpperCase() + c.submittedBy.role.slice(1)
          : 'Student',
      roleStyle:
        c.submittedBy?.role === 'shop'
          ? 'bg-orange-100 text-orange-600'
          : c.submittedBy?.role === 'runner'
          ? 'bg-green-100 text-green-600'
          : 'bg-blue-100 text-blue-600',
      message: c.description
    }));

    return res.status(200).json({
      success: true,
      count: formattedComplaints.length,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        hasMore: pageNum * limitNum < total
      },
      stats,
      complaints: formattedComplaints
    });
  } catch (error) {
    console.error('listComplaints Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaints',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------------------
// GET /api/admin/complaints/:complaintId
// Retrieve complaint with populated context
// ---------------------------------------------------------------------------
export const getComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await findComplaintByIdOrTicket(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint ticket '${complaintId}' not found`
      });
    }

    await complaint.populate([
      { path: 'submittedBy', select: 'name email role studentId phone avatar department' },
      { path: 'against', select: 'name email role shopDetails phone avatar' },
      { path: 'order', select: 'orderNumber totalAmount orderStatus paymentStatus items deliveryAddress createdAt' }
    ]);

    const compObj = complaint.toObject();

    return res.status(200).json({
      success: true,
      complaint: {
        ...compObj,
        id: compObj.ticketId,
        submittedByName: compObj.submittedBy?.name || 'Unknown',
        email: compObj.submittedBy?.email || 'N/A',
        role:
          compObj.submittedBy?.role === 'shop'
            ? 'Vendor'
            : compObj.submittedBy?.role
            ? compObj.submittedBy.role.charAt(0).toUpperCase() + compObj.submittedBy.role.slice(1)
            : 'Student',
        roleStyle:
          compObj.submittedBy?.role === 'shop'
            ? 'bg-orange-100 text-orange-600'
            : compObj.submittedBy?.role === 'runner'
            ? 'bg-green-100 text-green-600'
            : 'bg-blue-100 text-blue-600',
        message: compObj.description
      }
    });
  } catch (error) {
    console.error('getComplaint Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint details',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/complaints/:complaintId/status
// Validated transitions: Open -> In Review -> Resolved / Escalated
// ---------------------------------------------------------------------------
export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, adminResolution } = req.body;

    const newStatus = normalizeStatus(status);
    if (!newStatus) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const complaint = await findComplaintByIdOrTicket(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint ticket '${complaintId}' not found`
      });
    }

    if (complaint.status === newStatus) {
      return res.status(409).json({
        success: false,
        message: `Complaint is already in '${newStatus}' status`
      });
    }

    complaint.status = newStatus;

    if (adminResolution && typeof adminResolution === 'string' && adminResolution.trim()) {
      complaint.adminResolution = adminResolution.trim();
    }

    await complaint.save();

    await complaint.populate([
      { path: 'submittedBy', select: 'name email role studentId phone avatar department' },
      { path: 'against', select: 'name email role shopDetails phone avatar' },
      { path: 'order', select: 'orderNumber totalAmount orderStatus paymentStatus createdAt' }
    ]);

    return res.status(200).json({
      success: true,
      message: `Complaint status updated to '${newStatus}'`,
      complaint
    });
  } catch (error) {
    console.error('updateComplaintStatus Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update complaint status',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/complaints/:complaintId/priority
// Update priority: Low, Medium, High
// ---------------------------------------------------------------------------
export const updateComplaintPriority = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { priority } = req.body;

    const newPriority = normalizePriority(priority);
    if (!newPriority) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`
      });
    }

    const complaint = await findComplaintByIdOrTicket(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint ticket '${complaintId}' not found`
      });
    }

    if (complaint.priority === newPriority) {
      return res.status(409).json({
        success: false,
        message: `Complaint is already at '${newPriority}' priority`
      });
    }

    complaint.priority = newPriority;
    await complaint.save();

    await complaint.populate([
      { path: 'submittedBy', select: 'name email role studentId phone avatar department' },
      { path: 'against', select: 'name email role shopDetails phone avatar' },
      { path: 'order', select: 'orderNumber totalAmount orderStatus paymentStatus createdAt' }
    ]);

    return res.status(200).json({
      success: true,
      message: `Complaint priority updated to '${newPriority}'`,
      complaint
    });
  } catch (error) {
    console.error('updateComplaintPriority Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update complaint priority',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/complaints/:complaintId/resolve
// Persist adminResolution and transition status to Resolved
// ---------------------------------------------------------------------------
export const resolveComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { adminResolution } = req.body;

    if (!adminResolution || typeof adminResolution !== 'string' || !adminResolution.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide admin resolution notes explaining how this complaint was resolved'
      });
    }

    const complaint = await findComplaintByIdOrTicket(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint ticket '${complaintId}' not found`
      });
    }

    const trimmedResolution = adminResolution.trim();

    if (complaint.status === 'Resolved' && complaint.adminResolution === trimmedResolution) {
      return res.status(409).json({
        success: false,
        message: 'Complaint is already resolved with this exact resolution note'
      });
    }

    complaint.status = 'Resolved';
    complaint.adminResolution = trimmedResolution;
    await complaint.save();

    await complaint.populate([
      { path: 'submittedBy', select: 'name email role studentId phone avatar department' },
      { path: 'against', select: 'name email role shopDetails phone avatar' },
      { path: 'order', select: 'orderNumber totalAmount orderStatus paymentStatus createdAt' }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Complaint marked as resolved successfully',
      complaint
    });
  } catch (error) {
    console.error('resolveComplaint Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve complaint',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/complaints/:complaintId/escalate
// Mark ticket as Escalated and set priority to High
// ---------------------------------------------------------------------------
export const escalateComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { adminResolution } = req.body;

    const complaint = await findComplaintByIdOrTicket(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint ticket '${complaintId}' not found`
      });
    }

    if (complaint.status === 'Escalated') {
      return res.status(409).json({
        success: false,
        message: 'Complaint is already marked as escalated'
      });
    }

    complaint.status = 'Escalated';
    complaint.priority = 'High';

    if (adminResolution && typeof adminResolution === 'string' && adminResolution.trim()) {
      complaint.adminResolution = adminResolution.trim();
    }

    await complaint.save();

    await complaint.populate([
      { path: 'submittedBy', select: 'name email role studentId phone avatar department' },
      { path: 'against', select: 'name email role shopDetails phone avatar' },
      { path: 'order', select: 'orderNumber totalAmount orderStatus paymentStatus createdAt' }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Complaint escalated successfully and priority set to High',
      complaint
    });
  } catch (error) {
    console.error('escalateComplaint Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to escalate complaint',
      error: error.message
    });
  }
};
