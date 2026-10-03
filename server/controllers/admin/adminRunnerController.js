import User from '../../models/User.js';

// ---------------------------------------------------------------------------
// Helper — valid status transitions per action
// ---------------------------------------------------------------------------
const VALID_TRANSITIONS = {
  approve:    { from: ['pending', 'rejected'] },
  reject:     { from: ['pending', 'active']   },
  suspend:    { from: ['active']              },
  reactivate: { from: ['suspended']           }
};

// ---------------------------------------------------------------------------
// GET /api/admin/runners
// Query params: status, department, search, sort, page, limit
// ---------------------------------------------------------------------------
export const listRunners = async (req, res) => {
  try {
    const {
      status,
      department,
      search,
      sort  = 'newest',
      page  = 1,
      limit = 20
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    // Build filter — canonical runner model uses role: 'runner' or isRunner flag
    const filter = { $or: [{ role: 'runner' }, { isRunner: true }] };

    const ALLOWED_STATUSES = ['active', 'pending', 'suspended', 'rejected'];
    if (status && ALLOWED_STATUSES.includes(status.toLowerCase())) {
      filter.status = status.toLowerCase();
    }

    if (department && typeof department === 'string' && department.trim()) {
      filter.department = { $regex: department.trim(), $options: 'i' };
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name:        { $regex: q, $options: 'i' } },
        { email:       { $regex: q, $options: 'i' } },
        { universityId:{ $regex: q, $options: 'i' } }
      ];
    }

    const sortField = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const total   = await User.countDocuments(filter);
    const runners = await User.find(filter)
      .select('-password')
      .sort(sortField)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const results = runners.map((u) => ({
      userId:        u._id,
      name:          u.name,
      email:         u.email,
      phone:         u.phone || '—',
      avatar:        u.avatar,
      universityId:  u.universityId || '—',
      department:    u.department   || '—',
      status:        u.status,
      isApproved:    u.isApproved,
      isRunner:      u.isRunner,
      runnerDetails: u.runnerDetails || {},
      appliedAt:     u.createdAt
    }));

    return res.status(200).json({
      success: true,
      data: results,
      pagination: {
        total,
        page:  pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('[listRunners]', err);
    return res.status(500).json({ success: false, message: 'Server error fetching runners.' });
  }
};

// ---------------------------------------------------------------------------
// GET /api/admin/runners/:userId
// ---------------------------------------------------------------------------
export const getRunner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user.role !== 'runner') {
      return res.status(400).json({ success: false, message: 'Target user is not a Runner.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        userId:        user._id,
        name:          user.name,
        email:         user.email,
        phone:         user.phone || '—',
        avatar:        user.avatar,
        universityId:  user.universityId || '—',
        department:    user.department   || '—',
        status:        user.status,
        isApproved:    user.isApproved,
        isRunner:      user.isRunner,
        runnerDetails: user.runnerDetails || {},
        appliedAt:     user.createdAt
      }
    });
  } catch (err) {
    console.error('[getRunner]', err);
    return res.status(500).json({ success: false, message: 'Server error fetching runner.' });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/runners/:userId/approve
// pending | rejected → active
// ---------------------------------------------------------------------------
export const approveRunner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role !== 'runner' && !user.isRunner) return res.status(400).json({ success: false, message: 'Target user is not a Runner applicant.' });

    const { from } = VALID_TRANSITIONS.approve;
    if (!from.includes(user.status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot approve: current status is '${user.status}'. Only ${from.join(' or ')} accounts may be approved.`
      });
    }

    user.status     = 'active';
    user.isApproved = true;
    user.isRunner   = true;
    user.role       = 'runner';
    // Mark runner as available once approved
    if (user.runnerDetails) {
      user.runnerDetails.isAvailable = true;
    }
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Runner '${user.name}' has been approved.`,
      data: { userId: user._id, status: user.status, isApproved: user.isApproved }
    });
  } catch (err) {
    console.error('[approveRunner]', err);
    return res.status(500).json({ success: false, message: 'Server error approving runner.' });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/runners/:userId/reject
// pending | active → rejected
// ---------------------------------------------------------------------------
export const rejectRunner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role !== 'runner' && !user.isRunner) return res.status(400).json({ success: false, message: 'Target user is not a Runner applicant.' });

    const { from } = VALID_TRANSITIONS.reject;
    if (!from.includes(user.status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot reject: current status is '${user.status}'. Only ${from.join(' or ')} accounts may be rejected.`
      });
    }

    user.status     = 'rejected';
    user.isApproved = false;
    if (user.runnerDetails) {
      user.runnerDetails.isAvailable = false;
    }
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Runner '${user.name}' application has been rejected.`,
      data: { userId: user._id, status: user.status, isApproved: user.isApproved }
    });
  } catch (err) {
    console.error('[rejectRunner]', err);
    return res.status(500).json({ success: false, message: 'Server error rejecting runner.' });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/admin/runners/:userId/suspend
// active → suspended  |  suspended → active  (toggle)
// ---------------------------------------------------------------------------
export const suspendRunner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role !== 'runner') return res.status(400).json({ success: false, message: 'Target user is not a Runner.' });

    let newStatus, newIsApproved, newIsAvailable;

    if (user.status === 'active') {
      newStatus      = 'suspended';
      newIsApproved  = false;
      newIsAvailable = false;
    } else if (user.status === 'suspended') {
      newStatus      = 'active';
      newIsApproved  = true;
      newIsAvailable = true;
    } else {
      return res.status(409).json({
        success: false,
        message: `Cannot suspend/reactivate: current status is '${user.status}'. Only active or suspended accounts support this transition.`
      });
    }

    user.status     = newStatus;
    user.isApproved = newIsApproved;
    if (user.runnerDetails) {
      user.runnerDetails.isAvailable = newIsAvailable;
    }
    await user.save();

    const action = newStatus === 'suspended' ? 'suspended' : 'reactivated';
    return res.status(200).json({
      success: true,
      message: `Runner '${user.name}' has been ${action}.`,
      data: { userId: user._id, status: user.status, isApproved: user.isApproved }
    });
  } catch (err) {
    console.error('[suspendRunner]', err);
    return res.status(500).json({ success: false, message: 'Server error updating runner status.' });
  }
};
