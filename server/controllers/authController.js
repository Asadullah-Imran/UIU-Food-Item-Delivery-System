import User from '../models/User.js';
import Shop from '../models/Shop.js';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Register a new user (Student, Runner, Shop Owner)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      universityId,
      phone,
      avatar,
      department,
      vehicleType,
      shopName,
      campusLocation,
      category
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    // Role-specific validation
    if (role === 'shop') {
      if (!shopName || !shopName.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Shop name is required'
        });
      }
    }

    // Role-based defaults
    let isApproved = true;
    let status = 'active';

    if (role === 'shop') {
      // Shop Owner applications require Admin review & approval
      isApproved = false;
      status = 'pending';
    } else if (role === 'runner') {
      // Runner applications require Admin review & approval
      isApproved = false;
      status = 'pending';
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      role,
      universityId: universityId || '',
      phone: phone || '',
      avatar: avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
      status,
      isApproved,
      department: department || 'CSE'
    };

    if (role === 'runner') {
      userData.isRunner = true;
      userData.runnerDetails = {
        vehicleType: vehicleType || 'Bicycle',
        rating: 5.0,
        totalTrips: 0,
        walletBalance: 0,
        isAvailable: false
      };
    }

    if (role === 'shop') {
      userData.shopDetails = {
        shopName: shopName.trim(),
        campusLocation: campusLocation?.trim() || 'UIU Food Court Counter',
        category: category?.trim() || 'Food Court'
      };
    }

    const user = await User.create(userData);

    // If shop owner, also create a linked Shop record in pending approval state
    if (role === 'shop') {
      try {
        await Shop.create({
          owner: user._id,
          name: shopName.trim(),
          category: category?.trim() || 'Food Court',
          location: campusLocation?.trim() || 'UIU Food Court Counter',
          phone: phone?.trim() || '',
          isApproved: false,
          isOpen: false
        });
      } catch (shopErr) {
        await User.findByIdAndDelete(user._id);
        throw shopErr;
      }
    }

    const isPendingApproval = role === 'shop' || role === 'runner';

    // Only issue active token for immediately active roles (student)
    const token = isPendingApproval ? null : user.generateAuthToken();

    res.status(201).json({
      success: true,
      requiresApproval: isPendingApproval,
      isPendingApproval,
      message: isPendingApproval
        ? `Your ${role === 'shop' ? 'Shop Owner' : 'Delivery Runner'} application has been submitted and is pending admin approval. You can log in once an administrator approves your account.`
        : 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        isApproved: user.isApproved,
        walletBalance: user.walletBalance || 0,
        runnerDetails: user.runnerDetails,
        shopDetails: user.shopDetails
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user (include password in select)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by campus administration.'
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        accountStatus: 'rejected',
        message: `Your ${user.role === 'shop' ? 'Shop Owner' : 'Delivery Runner'} application has been rejected by campus administration.`
      });
    }

    // Unapproved or pending shop / runner accounts must wait for admin approval
    if ((user.role === 'shop' || user.role === 'runner') && (user.status === 'pending' || !user.isApproved)) {
      return res.status(403).json({
        success: false,
        isPendingApproval: true,
        accountStatus: 'pending',
        role: user.role,
        name: user.name,
        email: user.email,
        message: `Your ${user.role === 'shop' ? 'Shop Owner' : 'Delivery Runner'} account is currently pending admin approval. Please wait for an administrator to approve your application before accessing the portal.`
      });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        isApproved: user.isApproved,
        walletBalance: user.walletBalance || 0,
        runnerDetails: user.runnerDetails,
        shopDetails: user.shopDetails
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    let shop = null;
    if (user.role === 'shop') {
      shop = await Shop.findOne({ owner: user._id });
    }
    res.status(200).json({
      success: true,
      user,
      shop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, deliveryRoom, runnerDetails } = req.body;
    let avatar = req.body.avatar;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file.buffer);
      avatar = uploadResult.secure_url;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (deliveryRoom) user.deliveryRoom = deliveryRoom;
    if (req.body.department) user.department = req.body.department;
    if (runnerDetails) {
      const parsedRunnerDetails = typeof runnerDetails === 'string' ? JSON.parse(runnerDetails) : runnerDetails;
      user.runnerDetails = { ...user.runnerDetails, ...parsedRunnerDetails };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload / update user avatar
// @route   PUT /api/auth/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    let avatarUrl = '';
    try {
      const uploadResult = await uploadImageToCloudinary(req.file.buffer, 'uiu-delivery/avatars');
      avatarUrl = uploadResult.secure_url;
    } catch (cloudErr) {
      console.warn('Cloudinary upload fallback to data URI:', cloudErr.message);
      avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      avatar: user.avatar,
      user
    });
  } catch (error) {
    console.error('Upload Avatar Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error updating avatar' });
  }
};

// @desc    Opt-in / Activate Runner role for an existing Student
// @route   POST /api/auth/become-runner
// @access  Private
export const becomeRunner = async (req, res) => {
  try {
    const { vehicleType } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Runner applications require Admin review — set to pending, not auto-activated
    user.isRunner = true;
    user.status = 'pending';
    user.isApproved = false;
    user.runnerDetails = {
      vehicleType: vehicleType || 'Walking/Bicycle',
      rating: user.runnerDetails?.rating || 5.0,
      totalTrips: user.runnerDetails?.totalTrips || 0,
      walletBalance: user.runnerDetails?.walletBalance || 0,
      isAvailable: false
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Runner application submitted successfully and is pending admin approval.',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit runner application'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error during logout'
    });
  }
};

// @desc    Change password for authenticated user (All roles: Student, Runner, Shop Owner, Admin)
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your current password and new password'
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation password do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from your current password'
      });
    }

    // Retrieve user including the hashed password
    const user = await User.findById(req.user._id || req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found'
      });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'The current password you entered is incorrect'
      });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    // Generate a fresh authentication token
    const token = user.generateAuthToken();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      token
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to change password. Please try again later.'
    });
  }
};

// @desc    Check account approval status by email (for pending approval page)
// @route   GET /api/auth/check-status
// @access  Public
export const checkApprovalStatus = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    let shopApproved = true;
    if (user.role === 'shop') {
      const shop = await Shop.findOne({ owner: user._id });
      shopApproved = shop ? shop.isApproved : false;
    }

    const isFullyApproved = user.isApproved && user.status === 'active' && shopApproved;

    return res.status(200).json({
      success: true,
      role: user.role,
      status: user.status,
      isApproved: user.isApproved,
      isFullyApproved,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Check Approval Status Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error checking approval status' });
  }
};

