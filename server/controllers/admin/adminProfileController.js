import User from '../../models/User.js';

// @desc    Get authenticated Admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin only)
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Admin profile retrieved successfully',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department || 'Administration & IT Services',
        phone: admin.phone || '',
        avatar: admin.avatar,
        status: admin.status,
        isApproved: admin.isApproved,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });
  } catch (error) {
    console.error('getAdminProfile Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching admin profile'
    });
  }
};

// @desc    Update authenticated Admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin only)
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Allowlist only permitted mutable fields
    const { name, phone, department, avatar } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty'
        });
      }
      admin.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Phone must be a string'
        });
      }
      admin.phone = phone.trim();
    }

    if (department !== undefined) {
      if (typeof department !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Department must be a string'
        });
      }
      admin.department = department.trim();
    }

    if (avatar !== undefined) {
      if (typeof avatar !== 'string' || avatar.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Avatar must be a valid string URL'
        });
      }
      admin.avatar = avatar.trim();
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
        phone: admin.phone,
        avatar: admin.avatar,
        status: admin.status,
        isApproved: admin.isApproved,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });
  } catch (error) {
    console.error('updateAdminProfile Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating admin profile'
    });
  }
};
