import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SelectionPage from './pages/auth/SelectionPage';
import RegistrationPage from './pages/auth/RegistrationPage';
import LoginPage from './pages/auth/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseShops from './pages/student/BrowseShops';
import ShopDetails from './pages/student/ShopDetails';
import CheckoutPage from './pages/student/CheckoutPage';
import OrderSuccessPage from './pages/student/OrderSuccessPage';
import MyOrdersPage from './pages/student/MyOrdersPage';
import ChatPage from './pages/student/ChatPage';
import RunnerDashboard from './pages/runner/RunnerDashboard';
import RunnerAvailableDeliveries from './pages/runner/RunnerAvailableDeliveries';
import RunnerOrderAccepted from './pages/runner/RunnerOrderAccepted';
import RunnerOrderTracking from './pages/runner/RunnerOrderTracking';
import RunnerDeliveryCompleted from './pages/runner/RunnerDeliveryCompleted';
import RunnerDeliveryHistory from './pages/runner/RunnerDeliveryHistory';
import RunnerEarnings from './pages/runner/RunnerEarnings';
import SharedChat from './pages/runner/SharedChat';
import RunnerProfile from './pages/runner/RunnerProfile';
import ShopDashboard from './pages/shop/ShopDashboard';
import ShopIncomingOrders from './pages/shop/ShopIncomingOrders';
import ShopOrderDetails from './pages/shop/ShopOrderDetails';
import ShopPreparingOrder from './pages/shop/ShopPreparingOrder';
import ShopReadyForPickup from './pages/shop/ShopReadyForPickup';
import ShopMenuManagement from './pages/shop/ShopMenuManagement';
import ShopAddMenuItem from './pages/shop/ShopAddMenuItem';
import ShopSalesReports from './pages/shop/ShopSalesReports';
import ShopCustomerReviews from './pages/shop/ShopCustomerReviews';
import ShopProfile from './pages/shop/ShopProfile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminShopOwnerApproval from './pages/admin/AdminShopOwnerApproval';
import AdminRunnerApproval from './pages/admin/AdminRunnerApproval';
import AdminComplaintManagement from './pages/admin/AdminComplaintManagement';
import AdminReportsAnalytics from './pages/admin/AdminReportsAnalytics';
import AdminProfile from './pages/admin/AdminProfile';
import AdminManageShops from './pages/admin/AdminManageShops';


// Layouts
import { LayoutProvider } from './context/LayoutContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import StudentLayout from './layouts/StudentLayout';
import RunnerLayout from './layouts/RunnerLayout';
import ShopLayout from './layouts/ShopLayout';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
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
          
          {/* Checkout & Order Success use the sidebar layout */}
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<CheckoutPage />} />
          </Route>
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
            <Route path="profile" element={<RunnerProfile />} />
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
            <Route path="orders/:orderId/preparing" element={<ShopPreparingOrder />}/>
            <Route
  path="orders/:orderId/ready"
  element={<ShopReadyForPickup />}
/>
<Route path="menu" element={<ShopMenuManagement />} />

<Route
  path="menu/add"
  element={<ShopAddMenuItem />}
/>
            <Route path="menu" element={<ShopMenuManagement />} />
            <Route path="reports" element={<ShopSalesReports />} />
            <Route path="reviews" element={<ShopCustomerReviews />} />
            <Route path="profile" element={<ShopProfile />} />
            <Route path="preview/:shopId" element={<ShopDetails />} />

          </Route>
          {/* TEMPORARY - Admin UI Preview */}
{/* Admin Routes */}
{/* Admin Routes */}
<Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/admin/shop-owners"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminShopOwnerApproval />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/admin/runners"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminRunnerApproval />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/admin/shops"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminManageShops />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/admin/complaints"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminComplaintManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/admin/reports"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminReportsAnalytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/admin/profile"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminProfile />
    </ProtectedRoute>
  }
/>
        </Routes>
          </LayoutProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
