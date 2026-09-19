import User from '../models/User.js';
import Shop from '../models/Shop.js';

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
      campusLocation
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

    if (role === 'runner' || role === 'shop') {
      // In production or demo, shops and runners can be active or pending approval
      isApproved = true; // Set active for seamless demo/testing or configurable
      status = 'active';
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
      userData.runnerDetails = {
        vehicleType: vehicleType || 'Bicycle',
        rating: 5.0,
        totalTrips: 0,
        walletBalance: 0,
        isAvailable: true
      };
    }

    if (role === 'shop') {
      userData.shopDetails = {
        shopName: shopName.trim(),
        campusLocation: campusLocation?.trim() || 'UIU Food Court Counter'
      };
    }

    const user = await User.create(userData);

    // If shop owner, also create a linked Shop record
    if (role === 'shop') {
      try {
        await Shop.create({
          owner: user._id,
          name: shopName.trim(),
          category: 'Food Court',
          location: campusLocation?.trim() || 'UIU Food Court Counter',
          phone: phone?.trim() || '',
          isApproved: true
        });
      } catch (shopErr) {
        await User.findByIdAndDelete(user._id);
        throw shopErr;
      }
    }

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
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
    res.status(200).json({
      success: true,
      user
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
    const { name, phone, avatar, deliveryRoom, runnerDetails } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (deliveryRoom) user.deliveryRoom = deliveryRoom;
    if (req.body.department) user.department = req.body.department;
    if (runnerDetails) {
      user.runnerDetails = { ...user.runnerDetails, ...runnerDetails };
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

    user.isRunner = true;
    user.runnerDetails = {
      vehicleType: vehicleType || 'Walking/Bicycle',
      rating: user.runnerDetails?.rating || 5.0,
      totalTrips: user.runnerDetails?.totalTrips || 0,
      walletBalance: user.runnerDetails?.walletBalance || 0,
      isAvailable: true
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Congratulations! You are now a registered UIU Delivery Runner.',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to activate runner mode'
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

