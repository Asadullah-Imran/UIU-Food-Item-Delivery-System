import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide a shop name'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      default: 'Food Court'
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    deliveryTime: {
      type: String,
      default: '15-20 min'
    },
    minOrder: {
      type: Number,
      default: 50
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80'
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80'
    },
    location: {
      type: String,
      required: true,
      default: 'UIU Food Court Counter #2'
    },
    phone: {
      type: String,
      default: '+880 1819-876543'
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isApproved: {
      type: Boolean,
      default: true
    },
    tags: [String],
    openingHours: {
      open: { type: String, default: '08:30 AM' },
      close: { type: String, default: '08:00 PM' }
    }
  },
  {
    timestamps: true
  }
);

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
