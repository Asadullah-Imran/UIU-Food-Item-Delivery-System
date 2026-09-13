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
      required: [true, 'Please provide item price']
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
    }
  },
  {
    timestamps: true
  }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
