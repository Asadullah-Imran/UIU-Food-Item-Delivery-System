import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import User from './models/User.js';

dotenv.config();

async function clean() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://developerimran01_db_user:KxWzN48a8x8qN490@cluster0.ruh5jxj.mongodb.net/uiu_food_delivery?retryWrites=true&w=majority');
  console.log('Connected to DB');

  const runner = await User.findOne({ email: 'runner@uiu.ac.bd' });
  if (runner) {
    const res = await Order.updateMany(
      { runner: runner._id, status: { $ne: 'DELIVERED' } },
      { $set: { status: 'DELIVERED' } }
    );
    console.log(`Updated ${res.modifiedCount} stale orders for runner.`);
  }

  await mongoose.disconnect();
}

clean();
