import React from 'react';
import SharedLayout from '../components/SharedLayout';
import { shopNavigation } from '../config/navigation';
import { useAuth } from '../context/AuthContext';
import OrderChatDrawer from '../components/chat/OrderChatDrawer';

export default function ShopLayout() {
  const { user } = useAuth();

  const currentUser = {
    name: user?.shopDetails?.shopName || user?.name || "UIU Shop",
    idLabel: 'Owner',
    idNumber: user?.phone || 'N/A',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&h=150&fit=crop'
  };

  return (
    <>
      <SharedLayout navigation={shopNavigation} user={currentUser} />
      <OrderChatDrawer />
    </>
  );
}
