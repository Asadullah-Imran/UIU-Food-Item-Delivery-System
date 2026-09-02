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
import MyOrdersPage from './pages/MyOrdersPage';
import ChatPage from './pages/ChatPage';
import RunnerDashboard from './pages/RunnerDashboard';
import RunnerAvailableDeliveries from './pages/RunnerAvailableDeliveries';
import RunnerOrderAccepted from './pages/RunnerOrderAccepted';
import RunnerOrderTracking from './pages/RunnerOrderTracking';
import RunnerDeliveryCompleted from './pages/RunnerDeliveryCompleted';
import RunnerDeliveryHistory from './pages/RunnerDeliveryHistory';
import RunnerEarnings from './pages/RunnerEarnings';
import SharedChat from './pages/SharedChat';
import ShopDashboard from './pages/ShopDashboard';
import ShopIncomingOrders from './pages/ShopIncomingOrders';
import ShopOrderDetails from './pages/ShopOrderDetails';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SelectionPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Student Routes */}
        <Route path="/dashboard/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/student/shops" element={
          <ProtectedRoute allowedRoles={['student']}>
            <BrowseShops />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/student/shops/:shopId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ShopDetails />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['student']}>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/order-success" element={
          <ProtectedRoute allowedRoles={['student']}>
            <OrderSuccessPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/student/orders" element={
          <ProtectedRoute allowedRoles={['student']}>
            <MyOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/student/chat" element={
          <ProtectedRoute allowedRoles={['student', 'runner', 'shop']}>
            <ChatPage />
          </ProtectedRoute>
        } />
        
        {/* Runner Routes */}
        <Route path="/dashboard/runner" element={
          <ProtectedRoute allowedRoles={['runner']}>
            <RunnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/runner/deliveries" element={
          <ProtectedRoute allowedRoles={['runner']}>
            <RunnerAvailableDeliveries />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/runner/active/accepted" element={
          <ProtectedRoute allowedRoles={['runner']}>
            <RunnerOrderAccepted />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/runner/active/tracking" element={
          <ProtectedRoute allowedRoles={['runner']}>
            <RunnerOrderTracking />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/runner/active/completed" element={
          <ProtectedRoute allowedRoles={['runner']}>
            <RunnerDeliveryCompleted />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/runner/history" element={
          <ProtectedRoute allowedRoles={['runner']}>
            <RunnerDeliveryHistory />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/runner/earnings" element={
          <ProtectedRoute allowedRoles={['runner']}>
            <RunnerEarnings />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/runner/chat" element={
          <ProtectedRoute allowedRoles={['runner']}>
            <SharedChat />
          </ProtectedRoute>
        } />
        
        {/* Shop Routes */}
        <Route path="/dashboard/shop" element={
          <ProtectedRoute allowedRoles={['shop']}>
            <ShopDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/shop/orders" element={
          <ProtectedRoute allowedRoles={['shop']}>
            <ShopIncomingOrders />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/shop/orders/:orderId" element={
          <ProtectedRoute allowedRoles={['shop']}>
            <ShopOrderDetails />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/shop/menu" element={
          <ProtectedRoute allowedRoles={['shop']}>
            <ShopMenuManagement />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}
