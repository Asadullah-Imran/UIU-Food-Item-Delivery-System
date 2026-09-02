import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SelectionPage from './pages/SelectionPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import BrowseShops from './pages/BrowseShops';
import ShopDetails from './pages/ShopDetails';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SelectionPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard/student" element={<StudentDashboard />} />
      <Route path="/dashboard/student/shops" element={<BrowseShops />} />
      <Route path="/dashboard/student/shops/:shopId" element={<ShopDetails />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
    </Routes>
  );
}
