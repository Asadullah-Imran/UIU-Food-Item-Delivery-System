# UIU Food & Items Delivery System — Backend & Integration Phases

This document tracks the phased development and integration of the backend services with the frontend React application.

---

## 📊 Phase Status Overview

| Phase | Description | Scope / Domain | Status | Last Updated |
| :---: | :--- | :--- | :---: | :---: |
| **Phase 1** | **Authentication, Session & User Profiles** | Student, Runner, Shop, Admin Auth + JWT + Session Sync | ✅ **COMPLETED** | 2026-09-13 |
| **Phase 2** | **Campus Shops & Menu Management** | Shop Listing, Menu CRUD, Create Food Item, Inventory Toggles | 🔄 **IN_PROGRESS** | 2026-09-13 |
| **Phase 3** | **Student Ordering, Cart & Checkout Flow** | Cart Drawer, Order Creation, Billing Calculations, Order Tracking | ⏳ **PENDING** | — |
| **Phase 4** | **Shop Kitchen & Order Lifecycle** | Incoming Queue, Accept/Reject, Cooking Timer, Ready for Pickup | ⏳ **PENDING** | — |
| **Phase 5** | **Student Runner Delivery & Earnings** | Available Delivery Queue, Accept Task, Live Tracking, Wallet Payout | ⏳ **PENDING** | — |
| **Phase 6** | **Order-Scoped Chat, Admin Approvals & Analytics** | Tri-party Chat (Student-Shop-Runner), Account Approvals, PDF Reports | ⏳ **PENDING** | — |

---

## 🚀 Detailed Phase Breakdown

### Phase 1: Authentication, Session & User Profiles
- **Status:** ✅ **COMPLETED**
- **Target Frontend Pages:**
  - [`SelectionPage.jsx`](client/src/pages/auth/SelectionPage.jsx) (`/`)
  - [`LoginPage.jsx`](client/src/pages/auth/LoginPage.jsx) (`/login`)
  - [`RegistrationPage.jsx`](client/src/pages/auth/RegistrationPage.jsx) (`/register`)
- **Backend Endpoints:**
  - `POST /api/auth/register` — User registration with role-based defaults.
  - `POST /api/auth/login` — JWT token generation & password comparison.
  - `POST /api/auth/logout` — Invalidate user session & clear storage.
  - `GET /api/auth/me` — Protected session verification with JWT.
  - `PUT /api/auth/profile` — Update user profile details.
- **Completed Deliverables:**
  - [x] Bcrypt password hashing and JWT token generator in `User` model.
  - [x] Role-based status defaults (students auto-active; runner/shop approval support).
  - [x] Real backend login and registration validation on frontend (removed mock bypass).
  - [x] Initial app load session hydration and JWT validation in `AuthContext.jsx`.
  - [x] Database seeder (`npm run seed`) with default credentials for all 4 roles.

---

### Phase 2: Campus Shops & Menu Management
- **Status:** ⏳ **PENDING**
- **Target Frontend Pages:**
  - [`BrowseShops.jsx`](client/src/pages/student/BrowseShops.jsx) (`/dashboard/student/shops`)
  - [`ShopDetails.jsx`](client/src/pages/student/ShopDetails.jsx) (`/dashboard/student/shops/:shopId`)
  - [`StudentDashboard.jsx`](client/src/pages/student/StudentDashboard.jsx) (`/dashboard/student`)
  - [`ShopMenuManagement.jsx`](client/src/pages/shop/ShopMenuManagement.jsx) (`/dashboard/shop/menu`)
  - [`ShopAddMenuItem.jsx`](client/src/pages/shop/ShopAddMenuItem.jsx) (`/dashboard/shop/menu/add`)
  - [`ShopProfile.jsx`](client/src/pages/shop/ShopProfile.jsx) (`/dashboard/shop/profile`)
- **Backend Deliverables to Build:**
  - [ ] `GET /api/shops` — List approved campus shops with category & search query filters.
  - [ ] `GET /api/shops/:shopId` — Shop profile details with full categorized menu items.
  - [ ] `POST /api/shops/menu` — Create food item with image, pricing, prep time, dietary tags.
  - [ ] `PUT /api/shops/menu/:itemId` — Update menu item fields and price.
  - [ ] `PATCH /api/shops/menu/:itemId/availability` — Toggle In-Stock / Out-of-Stock status.
  - [ ] `DELETE /api/shops/menu/:itemId` — Delete menu item from shop.
  - [ ] `PUT /api/shops/profile` — Shop owner updates operating hours, banner, phone, location.
- **Frontend Integration Goals:**
  - [ ] Connect `ShopAddMenuItem.jsx` to `POST /api/shops/menu` with live MongoDB saving.
  - [ ] Connect `ShopMenuManagement.jsx` to live menu APIs with edit and delete capabilities.
  - [ ] Connect student browsing and shop menu pages to live database records.

---

### Phase 3: Student Ordering, Cart & Checkout Flow
- **Status:** ⏳ **PENDING**
- **Target Frontend Pages:**
  - [`CheckoutPage.jsx`](client/src/pages/student/CheckoutPage.jsx) (`/checkout`)
  - [`OrderSuccessPage.jsx`](client/src/pages/student/OrderSuccessPage.jsx) (`/order-success`)
  - [`MyOrdersPage.jsx`](client/src/pages/student/MyOrdersPage.jsx) (`/dashboard/student/orders`)
- **Backend Deliverables to Build:**
  - [ ] `POST /api/orders` — Create order, calculate billing, assign unique `#UIU-XXXX` order number.
  - [ ] `GET /api/orders/student` — Fetch student active & historical orders.
  - [ ] `GET /api/orders/:orderId` — Real-time order tracker and timeline details.
  - [ ] `POST /api/orders/:orderId/rate` — Submit 5-star rating and review for shop & runner.
  - [ ] `POST /api/orders/:orderId/cancel` — Cancel pending order.
- **Frontend Integration Goals:**
  - [ ] Wire checkout form submission to `POST /api/orders`.
  - [ ] Pass live order ID to `OrderSuccessPage.jsx`.
  - [ ] Populate `MyOrdersPage.jsx` with active order timeline and past orders from MongoDB.

---

### Phase 4: Shop Kitchen & Order Management Lifecycle
- **Status:** ⏳ **PENDING**
- **Target Frontend Pages:**
  - [`ShopDashboard.jsx`](client/src/pages/shop/ShopDashboard.jsx) (`/dashboard/shop`)
  - [`ShopIncomingOrders.jsx`](client/src/pages/shop/ShopIncomingOrders.jsx) (`/dashboard/shop/orders`)
  - [`ShopOrderDetails.jsx`](client/src/pages/shop/ShopOrderDetails.jsx) (`/dashboard/shop/orders/:orderId`)
  - [`ShopPreparingOrder.jsx`](client/src/pages/shop/ShopPreparingOrder.jsx) (`/dashboard/shop/orders/:orderId/preparing`)
  - [`ShopReadyForPickup.jsx`](client/src/pages/shop/ShopReadyForPickup.jsx) (`/dashboard/shop/orders/:orderId/ready`)
  - [`ShopSalesReports.jsx`](client/src/pages/shop/ShopSalesReports.jsx) (`/dashboard/shop/reports`)
- **Backend Deliverables to Build:**
  - [ ] `GET /api/orders/shop` — Retrieve incoming, cooking, ready, and completed queues.
  - [ ] `PATCH /api/orders/:orderId/status` — State changes (`CONFIRMED`, `REJECTED`, `PREPARING`, `READY_FOR_PICKUP`).
  - [ ] `GET /api/shops/stats` — Real-time dashboard stats (revenue, pending orders, completed sales).
- **Frontend Integration Goals:**
  - [ ] Connect Accept/Reject buttons in `ShopIncomingOrders.jsx`.
  - [ ] Connect cooking timer and "Ready for Pickup" action in `ShopPreparingOrder.jsx`.
  - [ ] Connect shop sales analytics to live orders.

---

### Phase 5: Student Runner Delivery Dispatch & Earnings
- **Status:** ⏳ **PENDING**
- **Target Frontend Pages:**
  - [`RunnerDashboard.jsx`](client/src/pages/runner/RunnerDashboard.jsx) (`/dashboard/runner`)
  - [`RunnerAvailableDeliveries.jsx`](client/src/pages/runner/RunnerAvailableDeliveries.jsx) (`/dashboard/runner/deliveries`)
  - [`RunnerOrderAccepted.jsx`](client/src/pages/runner/RunnerOrderAccepted.jsx) (`/dashboard/runner/active/accepted`)
  - [`RunnerOrderTracking.jsx`](client/src/pages/runner/RunnerOrderTracking.jsx) (`/dashboard/runner/active/tracking`)
  - [`RunnerDeliveryCompleted.jsx`](client/src/pages/runner/RunnerDeliveryCompleted.jsx) (`/dashboard/runner/active/completed`)
  - [`RunnerDeliveryHistory.jsx`](client/src/pages/runner/RunnerDeliveryHistory.jsx) (`/dashboard/runner/history`)
  - [`RunnerEarnings.jsx`](client/src/pages/runner/RunnerEarnings.jsx) (`/dashboard/runner/earnings`)
- **Backend Deliverables to Build:**
  - [ ] `GET /api/runner/available` — Unassigned orders ready for pickup.
  - [ ] `POST /api/runner/orders/:orderId/accept` — Atomically assign order to runner.
  - [ ] `PATCH /api/runner/orders/:orderId/step` — Advance delivery steps (`REACHED_SHOP`, `PICKED_UP`, `ON_THE_WAY`, `DELIVERED`).
  - [ ] `POST /api/runner/orders/:orderId/complete` — Credit runner wallet (+৳ 40) and increment trip counter.
  - [ ] `GET /api/runner/history` & `GET /api/runner/earnings` — Deliveries summary and payout history.
- **Frontend Integration Goals:**
  - [ ] Wire "Accept Delivery" button to live backend endpoint.
  - [ ] Connect step progression to update order status.
  - [ ] Sync wallet balance and delivery history.

---

### Phase 6: Order-Scoped Chat, Admin Approvals & Analytics
- **Status:** ⏳ **PENDING**
- **Target Frontend Pages:**
  - [`ChatPage.jsx`](client/src/pages/student/ChatPage.jsx) / [`SharedChat.jsx`](client/src/pages/runner/SharedChat.jsx) / [`OrderChatHub.jsx`](client/src/components/chat/OrderChatHub.jsx)
  - [`AdminDashboard.jsx`](client/src/pages/admin/AdminDashboard.jsx) (`/dashboard/admin`)
  - [`AdminShopOwnerApproval.jsx`](client/src/pages/admin/AdminShopOwnerApproval.jsx) (`/dashboard/admin/shop-owners`)
  - [`AdminRunnerApproval.jsx`](client/src/pages/admin/AdminRunnerApproval.jsx) (`/dashboard/admin/runners`)
  - [`AdminManageShops.jsx`](client/src/pages/admin/AdminManageShops.jsx) (`/dashboard/admin/shops`)
  - [`AdminComplaintManagement.jsx`](client/src/pages/admin/AdminComplaintManagement.jsx) (`/dashboard/admin/complaints`)
  - [`AdminReportsAnalytics.jsx`](client/src/pages/admin/AdminReportsAnalytics.jsx) (`/dashboard/admin/reports`)
- **Backend Deliverables to Build:**
  - [ ] `GET /api/chat/:orderNumber` & `POST /api/chat/:orderNumber` — Order messaging API.
  - [ ] `GET /api/admin/stats` — Campus-wide high-level metrics.
  - [ ] `PATCH /api/admin/users/:id/status` — Approve/reject pending runners and shop owners.
  - [ ] `GET /api/admin/complaints` & `PATCH /api/admin/complaints/:id` — Dispute tickets management.
- **Frontend Integration Goals:**
  - [ ] Connect order chat hub to live database message exchange.
  - [ ] Connect admin approval actions, complaint resolution, and analytics charts to live data.
