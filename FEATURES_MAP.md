# UIU Food & Items Delivery Portal — Feature Audit & Page Map

This document provides a comprehensive audit of all stakeholders, features, routes, components, and backend controller mappings implemented across the UIU Food & Items Delivery System.

> **🎯 Collaboration Scope:** 
> For our 4-member team collaboration, this document highlights the **Ordering Student Role** and its complete backend & frontend system mappings.

---

## 📋 Student Role Feature & Controller Mapping

| Student Feature | Route / Page URL | Frontend Component | Backend Endpoint | Backend Controller (`server/controllers/student/`) |
| :--- | :--- | :--- | :--- | :--- |
| **Student Auth & Session** | [`/login`](http://localhost:5173/login), [`/register`](http://localhost:5173/register) | `LoginPage.jsx`, `RegistrationPage.jsx` | `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me` | `authController.js` |
| **Student Dashboard** | [`/dashboard/student`](http://localhost:5173/dashboard/student) | `StudentDashboard.jsx` | `GET /api/student/shops`, `GET /api/student/wallet/balance` | `studentShopController.js`, `studentWalletController.js` |
| **Browse Campus Shops** | [`/dashboard/student/shops`](http://localhost:5173/dashboard/student/shops) | `BrowseShops.jsx` | `GET /api/student/shops` (with search & category filters) | `studentShopController.js` |
| **Shop Menu & Dish Details** | [`/dashboard/student/shops/:shopId`](http://localhost:5173/dashboard/student/shops/1) | `ShopDetails.jsx` | `GET /api/student/shops/:shopId` | `studentShopController.js` |
| **Slide-Out Cart & Subtotal** | *Global Slide-Out* | `CartSlideOut.jsx`, `CartContext.jsx` | *Client Context + In-App Balance Validation* | `studentOrderController.js` |
| **In-App Top-Up Simulator** | *Global Modal* | `TopUpModal.jsx` | `POST /api/student/wallet/topup` | `studentWalletController.js` |
| **In-App Checkout & Purchase**| [`/checkout`](http://localhost:5173/checkout) | `CheckoutPage.jsx` | `POST /api/student/orders` | `studentOrderController.js` |
| **Order Receipt & Confirmation**| [`/order-success`](http://localhost:5173/order-success) | `OrderSuccessPage.jsx` | `GET /api/student/orders/:orderId` | `studentOrderController.js` |
| **My Orders & Timeline Tracking**| [`/dashboard/student/orders`](http://localhost:5173/dashboard/student/orders) | `MyOrdersPage.jsx` | `GET /api/student/orders`, `GET /api/student/orders/:orderId` | `studentOrderController.js` |
| **100% Refund Order Cancel** | [`/dashboard/student/orders`](http://localhost:5173/dashboard/student/orders) | `MyOrdersPage.jsx` | `POST /api/student/orders/:orderId/cancel` | `studentOrderController.js` |
| **Rate Shop & Runner (5-Star)**| [`/dashboard/student/orders`](http://localhost:5173/dashboard/student/orders) | `MyOrdersPage.jsx` (Rating Modal) | `POST /api/student/orders/:orderId/rate` | `studentReviewController.js` |
| **File Complaint / Dispute** | [`/dashboard/student/orders`](http://localhost:5173/dashboard/student/orders) | `ComplaintDrawer.jsx` | `POST /api/student/complaints` | `studentComplaintController.js` |
| **Tri-Party Order Chat** | [`/dashboard/student/chat`](http://localhost:5173/dashboard/student/chat) | `ChatPage.jsx`, `OrderChatDrawer.jsx` | `GET /api/student/chat/:orderNumber`, `POST /api/student/chat/:orderNumber` | `studentChatController.js` |

---

## 📋 Teammate Stakeholder Feature Matrix

| Stakeholder / Role | Key Feature Requirements | Implementation Status | Route / Page URL | Component File |
| :--- | :--- | :---: | :--- | :--- |
| **Admin** | Approve shop owner accounts | ✅ Active | [`/dashboard/admin/shop-owners`](http://localhost:5173/dashboard/admin/shop-owners) | `AdminShopOwnerApproval.jsx` |
| **Admin** | Approve delivery runner accounts | ✅ Active | [`/dashboard/admin/runners`](http://localhost:5173/dashboard/admin/runners) | `AdminRunnerApproval.jsx` |
| **Admin** | Create and edit campus shops | ✅ Active | [`/dashboard/admin/shops`](http://localhost:5173/dashboard/admin/shops) | `AdminManageShops.jsx` |
| **Admin** | Overall order & delivery reports | ✅ Active | [`/dashboard/admin/reports`](http://localhost:5173/dashboard/admin/reports) | `AdminReportsAnalytics.jsx` |
| **Admin** | Handle complaint tickets | ✅ Active | [`/dashboard/admin/complaints`](http://localhost:5173/dashboard/admin/complaints) | `AdminComplaintManagement.jsx` |
| **Shop Owner** | Add/update menu items & prices | ✅ Active | [`/dashboard/shop/menu`](http://localhost:5173/dashboard/shop/menu) & [`/dashboard/shop/menu/add`](http://localhost:5173/dashboard/shop/menu/add) | `ShopMenuManagement.jsx`, `ShopAddMenuItem.jsx` |
| **Shop Owner** | Accept/reject incoming orders | ✅ Active | [`/dashboard/shop/orders`](http://localhost:5173/dashboard/shop/orders) | `ShopIncomingOrders.jsx` |
| **Shop Owner** | Mark order as preparing / ready for pickup | ✅ Active | [`/dashboard/shop/orders/:id/preparing`](http://localhost:5173/dashboard/shop/orders/3392/preparing) | `ShopPreparingOrder.jsx` |
| **Shop Owner** | View sales history & daily reports | ✅ Active | [`/dashboard/shop/reports`](http://localhost:5173/dashboard/shop/reports) | `ShopSalesReports.jsx` |
| **Delivery Runner** | View available delivery requests | ✅ Active | [`/dashboard/runner/deliveries`](http://localhost:5173/dashboard/runner/deliveries) | `RunnerAvailableDeliveries.jsx` |
| **Delivery Runner** | Accept delivery tasks | ✅ Active | [`/dashboard/runner/deliveries`](http://localhost:5173/dashboard/runner/deliveries) | `RunnerOrderAccepted.jsx` |
| **Delivery Runner** | Update delivery status (Picked up, Delivered) | ✅ Active | [`/dashboard/runner/active/tracking`](http://localhost:5173/dashboard/runner/active/tracking) | `RunnerOrderTracking.jsx` |
| **Delivery Runner** | Earn dummy money/credits & payout | ✅ Active | [`/dashboard/runner/earnings`](http://localhost:5173/dashboard/runner/earnings) | `RunnerEarnings.jsx` |

---

## 🎯 Verification Summary
- **Student Scope Backend**: Modularized in `server/controllers/student/` and `server/routes/student/`.
- **Frontend Build Status**: Verified with `npm run build` — 0 errors.
- **Development Server**: Running on [http://localhost:5173](http://localhost:5173).
