import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SelectionPage from './pages/SelectionPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SelectionPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard/student" element={<StudentDashboard />} />
    </Routes>
  );
}
