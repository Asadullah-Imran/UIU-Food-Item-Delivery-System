import React from 'react';
import SharedLayout from '../components/SharedLayout';
import { studentNavigation, studentUser } from '../config/navigation';

import CartSlideOut from '../components/CartSlideOut';

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
    </>
  );
}
