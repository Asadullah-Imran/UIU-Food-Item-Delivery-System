import { 
  LayoutDashboard, 
  Truck, 
  PackageCheck, 
  History, 
  Wallet, 
  MessageSquare, 
  User,
  Store,
  ClipboardList,
  Inbox,
  UtensilsCrossed,
  BarChart3,
  MessageSquareHeart
} from 'lucide-react';

export const runnerNavigation = [
  { name: 'Dashboard', path: '/dashboard/runner', icon: LayoutDashboard },
  { name: 'Available Deliveries', path: '/dashboard/runner/deliveries', icon: Truck },
  { name: 'Active Deliveries', path: '/dashboard/runner/active/accepted', icon: PackageCheck },
  { name: 'Delivery History', path: '/dashboard/runner/history', icon: History },
  { name: 'Earnings', path: '/dashboard/runner/earnings', icon: Wallet },
  { name: 'Chat', path: '/dashboard/runner/chat', icon: MessageSquare },
  { name: 'Profile', path: '#', icon: User },
];

export const runnerUser = {
  name: 'Tanvir Ahmed',
  idLabel: 'Runner ID',
  idNumber: '#4092',
  avatar: 'https://i.pravatar.cc/150?u=runner'
};

export const studentNavigation = [
  { name: 'Dashboard', path: '/dashboard/student', icon: LayoutDashboard },
  { name: 'Browse Shops', path: '/dashboard/student/shops', icon: Store },
  { name: 'My Orders', path: '/dashboard/student/orders', icon: ClipboardList },
  { name: 'Chat', path: '/dashboard/student/chat', icon: MessageSquare },
];

export const studentUser = {
  name: 'Rafiqul Haque',
  idLabel: 'Student ID',
  idNumber: '011201124',
  avatar: 'https://i.pravatar.cc/150?u=student'
};

export const shopNavigation = [
  { name: 'Dashboard', path: '/dashboard/shop', icon: LayoutDashboard },
  { name: 'Incoming Orders', path: '/dashboard/shop/orders', icon: Inbox },
  { name: 'Menu Management', path: '/dashboard/shop/menu', icon: UtensilsCrossed },
  { name: 'Sales Reports', path: '/dashboard/shop/reports', icon: BarChart3 },
  { name: 'Customer Reviews', path: '/dashboard/shop/reviews', icon: MessageSquareHeart },
  { name: 'Shop Profile', path: '/dashboard/shop/profile', icon: Store },
];

export const shopUser = {
  name: "Chef's Table",
  idLabel: 'Owner',
  idNumber: '#5029',
  avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&h=150&fit=crop'
};
