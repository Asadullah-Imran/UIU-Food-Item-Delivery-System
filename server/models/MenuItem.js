import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide an item name'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Please provide item price'],
      min: [1, 'Price must be greater than 0']
    },
    category: {
      type: String,
      required: true,
      default: 'Meals'
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80'
    },
    imagePublicId: {
      type: String,
      default: ''
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    preparationTime: {
      type: String,
      default: '10-15 mins'
    },
    dietary: {
      type: [String],
      default: ['Halal']
    },
    rating: {
      type: Number,
      default: 4.8
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100']
    },
    taxRate: {
      type: Number,
      default: 5,
      min: [0, 'Tax rate cannot be negative']
    },
    stockQuantity: {
      type: Number,
      default: 50,
      min: [0, 'Stock quantity cannot be negative']
    },
    lowStockWarning: {
      type: Number,
      default: 10,
      min: [0, 'Low-stock warning cannot be negative']
    },
    todaySpecial: {
      type: Boolean,
      default: false
    },
    featured: {
      type: Boolean,
      default: false
    },
    recommended: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }

);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
