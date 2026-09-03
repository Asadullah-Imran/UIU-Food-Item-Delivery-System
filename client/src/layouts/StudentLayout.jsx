import React from 'react';
import SharedLayout from '../components/SharedLayout';
import { studentNavigation, studentUser } from '../config/navigation';

export default function StudentLayout() {
  return (
    <SharedLayout 
      navigation={studentNavigation} 
      user={studentUser} 
      switchRoleText="Switch to Runner" 
      switchRolePath="/dashboard/runner" 
    />
  );
}
