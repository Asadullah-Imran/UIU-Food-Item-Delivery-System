import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import OrderChat from '../models/OrderChat.js';
import Complaint from '../models/Complaint.js';
import Transaction from '../models/Transaction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    // Fix querySrv ECONNREFUSED issues commonly encountered on Windows / ISP routers
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for Seeding');

    // Clear existing data
    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Shop.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    await OrderChat.deleteMany();
    await Complaint.deleteMany();
    await Transaction.deleteMany();

    console.log('🌱 Seeding Users...');
    // 1. Seed Users
    const adminUser = await User.create({
      name: 'Campus Super Admin',
      email: 'admin@uiu.ac.bd',
      password: 'password123',
      role: 'admin',
      universityId: 'ADMIN-001',
      phone: '+880 1900-UIUADMIN',
      avatar: 'https://i.pravatar.cc/150?u=admin',
      status: 'active',
      isApproved: true,
      walletBalance: 1500
    });

    const studentUser = await User.create({
      name: 'Rafiqul Haque',
      email: 'student@uiu.ac.bd',
      password: 'password123',
      role: 'student',
      universityId: '011201124',
      phone: '+880 1712-987654',
      avatar: 'https://i.pravatar.cc/150?u=student',
      status: 'active',
      isApproved: true,
      department: 'CSE',
      deliveryRoom: 'Room 412, Academic Building',
      walletBalance: 650
    });

    const runnerUser = await User.create({
      name: 'Tanvir Ahmed',
      email: 'runner@uiu.ac.bd',
      password: 'password123',
      role: 'runner',
      universityId: '011201045',
      phone: '+880 1712-345678',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      status: 'active',
      isApproved: true,
      department: 'CSE',
      runnerDetails: {
        vehicleType: 'Bicycle',
        rating: 4.9,
        totalTrips: 42,
        walletBalance: 2450,
        isAvailable: true
      }
    });

    const shopOwnerUser = await User.create({
      name: "Chef's Table Owner",
      email: 'shop@uiu.ac.bd',
      password: 'password123',
      role: 'shop',
      universityId: 'SHOP-5029',
      phone: '+880 1819-876543',
      avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&h=150&fit=crop',
      status: 'active',
      isApproved: true,
      shopDetails: {
        shopName: "Chef's Table",
        tradeLicense: 'TR-UIU-8821',
        campusLocation: 'UIU Food Court Counter #2'
      }
    });

    const chilloxOwner = await User.create({
      name: 'Chillox Manager',
      email: 'chillox@uiu.ac.bd',
      password: 'password123',
      role: 'shop',
      universityId: 'SHOP-3392',
      phone: '+880 1812-998877',
      avatar: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80',
      status: 'active',
      isApproved: true,
      shopDetails: {
        shopName: 'Chillox UIU',
        tradeLicense: 'TR-UIU-9941',
        campusLocation: 'UIU Cafeteria Annex (North)'
      }
    });

    console.log('🌱 Seeding Shops...');
    // 2. Seed Shops
    const chefsTableShop = await Shop.create({
      owner: shopOwnerUser._id,
      name: "Chef's Table",
      category: 'Food Court',
      rating: 4.9,
      reviewsCount: 142,
      deliveryTime: '15-20 min',
      minOrder: 50,
      walletBalance: 4250,
      totalEarnings: 14800,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
      banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
      location: 'UIU Food Court Counter #2',
      phone: '+880 1819-876543',
      isOpen: true,
      isFeatured: true,
      isApproved: true,
      tags: ['Burgers', 'Platters', 'Coffee', 'Fast Food'],
      openingHours: { open: '08:30 AM', close: '08:00 PM' }
    });

    const chilloxShop = await Shop.create({
      owner: chilloxOwner._id,
      name: 'Chillox UIU',
      category: 'Fast Food',
      rating: 4.8,
      reviewsCount: 98,
      deliveryTime: '10-15 min',
      minOrder: 80,
      walletBalance: 2900,
      totalEarnings: 9400,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80',
      banner: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80',
      location: 'UIU Cafeteria Annex (North)',
      phone: '+880 1812-998877',
      isOpen: true,
      isFeatured: true,
      isApproved: true,
      tags: ['Burgers', 'Fries', 'Shakes'],
      openingHours: { open: '09:00 AM', close: '09:00 PM' }
    });

    const stationeryShop = await Shop.create({
      owner: adminUser._id,
      name: 'UIU Stationery & Print Hub',
      category: 'Stationery',
      rating: 4.7,
      reviewsCount: 64,
      deliveryTime: '5-10 min',
      minOrder: 20,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80',
      banner: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80',
      location: 'Academic Building Ground Floor (Opposite Library)',
      phone: '+880 1611-334455',
      isOpen: true,
      isFeatured: false,
      isApproved: true,
      tags: ['Notebooks', 'Calculators', 'Photocopy', 'Pens'],
      openingHours: { open: '08:00 AM', close: '07:00 PM' }
    });

    console.log('🌱 Seeding Menu Items...');
    // 3. Seed Menu Items
    const burgerItem = await MenuItem.create({
      shop: chefsTableShop._id,
      name: 'Chicken Cheese Burger',
      description: 'Grilled chicken patty with melted cheddar, crisp lettuce, and signature garlic mayo sauce.',
      price: 180,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
      isAvailable: true,
      isPopular: true,
      preparationTime: '12 mins',
      dietary: ['Halal', 'Spicy'],
      rating: 4.9
    });

    const platterItem = await MenuItem.create({
      shop: chefsTableShop._id,
      name: 'Beef Platter Deluxe',
      description: 'Tender spiced beef chunks served with fragrant butter rice, grilled vegetables, and mint chutney.',
      price: 320,
      category: 'Meals',
      image: 'https://images.unsplash.com/photo-1629814545084-3c66f77893a7?w=400&q=80',
      isAvailable: true,
      isPopular: true,
      preparationTime: '15 mins',
      dietary: ['Halal'],
      rating: 4.8
    });

    const coffeeItem = await MenuItem.create({
      shop: chefsTableShop._id,
      name: 'Chilled Cold Coffee',
      description: 'Rich blended espresso, full cream milk, and chocolate drizzle.',
      price: 65,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80',
      isAvailable: true,
      isPopular: true,
      preparationTime: '5 mins',
      dietary: ['Veg'],
      rating: 4.9
    });

    const chilloxBurger = await MenuItem.create({
      shop: chilloxShop._id,
      name: 'Classic Smokey Beef Burger',
      description: 'Smoked beef patty with BBQ sauce and caramelized onions.',
      price: 240,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80',
      isAvailable: true,
      isPopular: true,
      preparationTime: '10 mins',
      dietary: ['Halal'],
      rating: 4.8
    });

    const friesItem = await MenuItem.create({
      shop: chilloxShop._id,
      name: 'Peri Peri Crispy Fries',
      description: 'Crispy golden potato fries seasoned with peri-peri herbs.',
      price: 90,
      category: 'Snacks',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
      isAvailable: true,
      isPopular: true,
      preparationTime: '8 mins',
      dietary: ['Veg'],
      rating: 4.7
    });

    console.log('🌱 Seeding Orders...');
    // 4. Seed Orders
    const order1 = await Order.create({
      orderNumber: '#UIU-2026-1030',
      student: studentUser._id,
      shop: chefsTableShop._id,
      runner: runnerUser._id,
      items: [
        {
          menuItem: platterItem._id,
          name: platterItem.name,
          price: 320,
          quantity: 1,
          note: 'Medium spicy'
        }
      ],
      billing: {
        subtotal: 320,
        deliveryFee: 30,
        discount: 0,
        grandTotal: 350
      },
      payment: {
        method: 'wallet',
        status: 'paid',
        transactionId: 'TXN-UIU-8829'
      },
      deliveryAddress: {
        building: 'Academic Building',
        room: 'Room 412',
        dropOffNote: 'Please call when at 4th floor stairs'
      },
      status: 'PREPARING',
      runnerReward: 45,
      specialInstructions: 'Medium spicy please, not too oily.',
      eta: '10-15 mins',
      timeline: [
        { status: 'PLACED', time: new Date(Date.now() - 25 * 60000), note: 'Order placed by student' },
        { status: 'CONFIRMED', time: new Date(Date.now() - 20 * 60000), note: "Confirmed by Chef's Table" },
        { status: 'PREPARING', time: new Date(Date.now() - 15 * 60000), note: 'Kitchen preparing platter' }
      ]
    });

    const order2 = await Order.create({
      orderNumber: '#3392',
      student: studentUser._id,
      shop: chilloxShop._id,
      runner: runnerUser._id,
      items: [
        {
          menuItem: chilloxBurger._id,
          name: chilloxBurger.name,
          price: 240,
          quantity: 1,
          note: 'Extra cheese'
        },
        {
          menuItem: friesItem._id,
          name: friesItem.name,
          price: 90,
          quantity: 1,
          note: 'Crispy'
        }
      ],
      billing: {
        subtotal: 330,
        deliveryFee: 30,
        discount: 0,
        grandTotal: 360
      },
      payment: {
        method: 'wallet',
        status: 'paid',
        transactionId: 'TXN-UIU-9912'
      },
      deliveryAddress: {
        building: 'Library Annex',
        room: '3rd Floor Study Room',
        dropOffNote: 'Waiting near stairs'
      },
      status: 'ON_THE_WAY',
      runnerReward: 50,
      specialInstructions: 'Bring extra napkins and ketchup packets.',
      eta: '4 mins',
      timeline: [
        { status: 'PLACED', time: new Date(Date.now() - 35 * 60000) },
        { status: 'CONFIRMED', time: new Date(Date.now() - 30 * 60000) },
        { status: 'READY_FOR_PICKUP', time: new Date(Date.now() - 15 * 60000) },
        { status: 'ON_THE_WAY', time: new Date(Date.now() - 5 * 60000) }
      ]
    });

    const order3 = await Order.create({
      orderNumber: '#UIU-2026-1035',
      student: studentUser._id,
      shop: chefsTableShop._id,
      runner: runnerUser._id,
      items: [
        {
          menuItem: burgerItem._id,
          name: burgerItem.name,
          price: 180,
          quantity: 1
        },
        {
          menuItem: coffeeItem._id,
          name: coffeeItem.name,
          price: 65,
          quantity: 1
        }
      ],
      billing: {
        subtotal: 245,
        deliveryFee: 30,
        discount: 0,
        grandTotal: 275
      },
      payment: {
        method: 'wallet',
        status: 'paid',
        transactionId: 'TXN-UIU-7712'
      },
      deliveryAddress: {
        building: 'Academic Building',
        room: 'Room 502'
      },
      status: 'DELIVERED',
      runnerReward: 40,
      eta: 'Delivered',
      ratings: {
        shopRating: 5,
        runnerRating: 5,
        feedback: 'Super fast delivery and delicious burger!'
      }
    });

    console.log('🌱 Seeding Order-Scoped Chats...');
    // 5. Seed Order Chats
    await OrderChat.create({
      orderNumber: '#UIU-2026-1030',
      order: order1._id,
      messages: [
        {
          sender: studentUser._id,
          senderRole: 'student',
          senderName: studentUser.name,
          avatar: studentUser.avatar,
          target: 'all',
          text: 'Hi! Could you make the beef platter medium spicy please? Not too hot.',
          createdAt: new Date(Date.now() - 14 * 60000),
          status: 'read'
        },
        {
          sender: shopOwnerUser._id,
          senderRole: 'shop',
          senderName: "Chef's Table",
          avatar: chefsTableShop.image,
          target: 'all',
          text: 'Sure thing! Chef has noted medium spice for your platter. Preparing it fresh now.',
          createdAt: new Date(Date.now() - 12 * 60000),
          status: 'read'
        },
        {
          sender: runnerUser._id,
          senderRole: 'runner',
          senderName: runnerUser.name,
          avatar: runnerUser.avatar,
          target: 'all',
          text: "Hello! I have accepted this delivery task. I'm nearby and will pick it up as soon as Chef's Table marks it ready.",
          createdAt: new Date(Date.now() - 10 * 60000),
          status: 'read'
        }
      ]
    });

    await OrderChat.create({
      orderNumber: '#3392',
      order: order2._id,
      messages: [
        {
          sender: chilloxOwner._id,
          senderRole: 'shop',
          senderName: 'Chillox UIU',
          avatar: chilloxShop.image,
          target: 'all',
          text: 'Order #3392 is prepared and freshly packed in bag #4.',
          createdAt: new Date(Date.now() - 15 * 60000),
          status: 'read'
        },
        {
          sender: runnerUser._id,
          senderRole: 'runner',
          senderName: runnerUser.name,
          avatar: runnerUser.avatar,
          target: 'all',
          text: 'Picked up from Counter #3. Heading to UIU Main Gate & Library area.',
          createdAt: new Date(Date.now() - 10 * 60000),
          status: 'read'
        },
        {
          sender: studentUser._id,
          senderRole: 'student',
          senderName: studentUser.name,
          avatar: studentUser.avatar,
          target: 'all',
          text: 'Great! Did you get the extra garlic mayo sauce?',
          createdAt: new Date(Date.now() - 8 * 60000),
          status: 'read'
        },
        {
          sender: runnerUser._id,
          senderRole: 'runner',
          senderName: runnerUser.name,
          avatar: runnerUser.avatar,
          target: 'all',
          text: 'Yes, 2 sauce cups are inside the bag. I am crossing the main gate now.',
          createdAt: new Date(Date.now() - 6 * 60000),
          status: 'read'
        }
      ]
    });

    console.log('🌱 Seeding Complaints...');
    // 6. Seed Complaints
    await Complaint.create({
      ticketId: 'TKT-1042',
      orderNumber: '#UIU-2026-1022',
      submittedBy: studentUser._id,
      against: runnerUser._id,
      subject: 'Late Delivery Report',
      category: 'Late Delivery',
      description: 'Delivery took more than 40 minutes due to confusion near Annex building.',
      status: 'Resolved',
      priority: 'Low',
      adminResolution: 'Resolved by customer credit compensation of ৳ 50.'
    });

    console.log('🌱 Seeding Wallet Transactions...');
    // 7. Seed Initial Transactions
    await Transaction.create([
      {
        transactionId: 'TXN-TOPUP-1001',
        user: studentUser._id,
        type: 'TOPUP',
        direction: 'CREDIT',
        amount: 1000,
        balanceAfter: 1000,
        paymentGateway: 'bKash In-App Simulator',
        description: 'Initial Wallet Top-Up via bKash (01712-987654)',
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 24 * 3600000)
      },
      {
        transactionId: 'TXN-ORD-1002',
        user: studentUser._id,
        shop: chefsTableShop._id,
        type: 'ORDER_PAYMENT',
        direction: 'DEBIT',
        amount: 350,
        balanceAfter: 650,
        paymentGateway: 'In-App Campus Wallet',
        description: 'Payment for order #UIU-2026-1022 at Chef\'s Table',
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 2 * 3600000)
      },
      {
        transactionId: 'TXN-RUNNER-1003',
        user: runnerUser._id,
        type: 'RUNNER_EARNING',
        direction: 'CREDIT',
        amount: 40,
        balanceAfter: 2450,
        description: 'Delivery trip payout for order #UIU-2026-1022',
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 1 * 3600000)
      }
    ]);

    console.log('\n========================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('========================================');
    console.log('Demo Accounts for Testing:');
    console.log('  👑 Admin:      admin@uiu.ac.bd    / password123');
    console.log('  🎓 Student:    student@uiu.ac.bd  / password123');
    console.log('  🛵 Runner:     runner@uiu.ac.bd   / password123');
    console.log('  🏪 Shop Owner: shop@uiu.ac.bd     / password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedDatabase();
