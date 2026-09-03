import React from 'react';
import SharedLayout from '../components/SharedLayout';
import { runnerNavigation, runnerUser } from '../config/navigation';

export default function RunnerLayout() {
  return (
    <SharedLayout 
      navigation={runnerNavigation} 
      user={runnerUser} 
      switchRoleText="Switch to Student" 
      switchRolePath="/dashboard/student" 
    />
  );
}
