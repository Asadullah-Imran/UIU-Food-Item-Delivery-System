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
import ShopMenuManagement from './pages/ShopMenuManagement';
import ShopSalesReports from './pages/ShopSalesReports';
import ShopCustomerReviews from './pages/ShopCustomerReviews';
import ShopProfile from './pages/ShopProfile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import { LayoutProvider } from './context/LayoutContext';
import StudentLayout from './layouts/StudentLayout';
import RunnerLayout from './layouts/RunnerLayout';
import ShopLayout from './layouts/ShopLayout';

export default function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <Routes>
          <Route path="/" element={<SelectionPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Student Routes */}
          <Route path="/dashboard/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="shops" element={<BrowseShops />} />
            <Route path="shops/:shopId" element={<ShopDetails />} />
            <Route path="orders" element={<MyOrdersPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
          
          {/* Checkout & Order Success don't use the sidebar layout */}
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
          
          {/* Runner Routes */}
          <Route path="/dashboard/runner" element={
            <ProtectedRoute allowedRoles={['runner']}>
              <RunnerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<RunnerDashboard />} />
            <Route path="deliveries" element={<RunnerAvailableDeliveries />} />
            <Route path="active/accepted" element={<RunnerOrderAccepted />} />
            <Route path="active/tracking" element={<RunnerOrderTracking />} />
            <Route path="active/completed" element={<RunnerDeliveryCompleted />} />
            <Route path="history" element={<RunnerDeliveryHistory />} />
            <Route path="earnings" element={<RunnerEarnings />} />
            <Route path="chat" element={<SharedChat />} />
          </Route>
          
          {/* Shop Routes */}
          <Route path="/dashboard/shop" element={
            <ProtectedRoute allowedRoles={['shop']}>
              <ShopLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ShopDashboard />} />
            <Route path="orders" element={<ShopIncomingOrders />} />
            <Route path="orders/:orderId" element={<ShopOrderDetails />} />
            <Route path="menu" element={<ShopMenuManagement />} />
            <Route path="reports" element={<ShopSalesReports />} />
            <Route path="reviews" element={<ShopCustomerReviews />} />
            <Route path="profile" element={<ShopProfile />} />
            <Route path="preview/:shopId" element={<ShopDetails />} />
          </Route>

        </Routes>
      </LayoutProvider>
    </AuthProvider>
  );
}
