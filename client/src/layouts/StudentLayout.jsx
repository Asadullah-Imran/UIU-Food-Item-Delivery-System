import React from 'react';
import SharedLayout from '../components/SharedLayout';
import { studentNavigation, studentUser } from '../config/navigation';
import CartSlideOut from '../components/CartSlideOut';
import OrderChatDrawer from '../components/chat/OrderChatDrawer';

export default function StudentLayout() {
  return (
    <>
      <SharedLayout 
        navigation={studentNavigation} 
        user={studentUser} 
        switchRoleText="Switch to Runner" 
        switchRolePath="/dashboard/runner" 
      />
      <CartSlideOut />
      <OrderChatDrawer />
    </>
  );
}
