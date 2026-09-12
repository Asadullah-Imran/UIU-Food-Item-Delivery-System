import React from 'react';
import SharedLayout from '../components/SharedLayout';
import { runnerNavigation, runnerUser } from '../config/navigation';
import OrderChatDrawer from '../components/chat/OrderChatDrawer';

export default function RunnerLayout() {
  return (
    <>
      <SharedLayout 
        navigation={runnerNavigation} 
        user={runnerUser} 
        switchRoleText="Switch to Student" 
        switchRolePath="/dashboard/student" 
      />
      <OrderChatDrawer />
    </>
  );
}
