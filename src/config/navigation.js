import { 
  LayoutDashboard, 
  Truck, 
  PackageCheck, 
  History, 
  Wallet, 
  MessageSquare, 
  User,
  Store,
  ClipboardList
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
