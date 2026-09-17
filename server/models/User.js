import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'runner', 'shop', 'admin'],
      default: 'student'
    },
    universityId: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: 'https://i.pravatar.cc/150?u=uiu_user'
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended', 'rejected'],
      default: function () {
        return this.role === 'student' || this.role === 'admin' ? 'active' : 'pending';
      }
    },
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role === 'student' || this.role === 'admin';
      }
    },
    walletBalance: {
      type: Number,
      default: 0
    },
    // Student specific details
    department: {
      type: String,
      default: 'CSE'
    },
    deliveryRoom: {
      type: String,
      default: 'Room 412, Academic Building'
    },
    // Runner specific details
    runnerDetails: {
      vehicleType: {
        type: String,
        default: 'Bicycle'
      },
      studentIdCardUrl: String,
      rating: {
        type: Number,
        default: 5.0
      },
      totalTrips: {
        type: Number,
        default: 0
      },
      walletBalance: {
        type: Number,
        default: 0
      },
      isAvailable: {
        type: Boolean,
        default: true
      }
    },
    // Shop owner specific details
    shopDetails: {
      shopName: String,
      tradeLicense: String,
      campusLocation: String
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET || 'uiu_food_delivery_secret_key_2026',
    { expiresIn: '7d' }
  );
};

const User = mongoose.model('User', userSchema);
export default User;
