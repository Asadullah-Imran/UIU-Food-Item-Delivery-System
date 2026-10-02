import React from 'react';
import SharedLayout from '../components/SharedLayout';
import { studentNavigation } from '../config/navigation';
import { useAuth } from '../context/AuthContext';
import CartSlideOut from '../components/CartSlideOut';
import OrderChatDrawer from '../components/chat/OrderChatDrawer';

export default function StudentLayout() {
  const { user } = useAuth();

  const currentUser = {
    name: user?.name || 'UIU Student',
    idLabel: 'Student ID',
    idNumber: user?.universityId || 'N/A',
    avatar: user?.avatar || 'https://i.pravatar.cc/150?u=student'
  };

  return (
    <>
      <SharedLayout 
        navigation={studentNavigation} 
        user={currentUser} 
        switchRoleText={(user?.isRunner || user?.role === 'runner') ? "Switch to Runner" : ""} 
        switchRolePath={(user?.isRunner || user?.role === 'runner') ? "/dashboard/runner" : ""} 
      />
      <CartSlideOut />
      <OrderChatDrawer />
    </>
  );
}
