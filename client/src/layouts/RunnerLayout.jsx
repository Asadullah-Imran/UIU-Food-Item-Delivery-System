import React from 'react';
import SharedLayout from '../components/SharedLayout';
import { runnerNavigation } from '../config/navigation';
import { useAuth } from '../context/AuthContext';
import OrderChatDrawer from '../components/chat/OrderChatDrawer';

export default function RunnerLayout() {
  const { user } = useAuth();

  const currentUser = {
    name: user?.name || 'UIU Runner',
    idLabel: 'Runner ID',
    idNumber: user?.universityId || 'N/A',
    avatar: user?.avatar || 'https://i.pravatar.cc/150?u=runner'
  };

  return (
    <>
      <SharedLayout 
        navigation={runnerNavigation} 
        user={currentUser} 
        switchRoleText="Switch to Student" 
        switchRolePath="/dashboard/student" 
      />
      <OrderChatDrawer />
    </>
  );
}
