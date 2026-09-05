# UIU Food & Items Delivery Portal — Feature Audit & Page Map

This document provides a comprehensive audit of all stakeholders, features, routes, and components implemented across the UIU Food & Items Delivery System.

---

## 📋 Stakeholder Feature Matrix

| Stakeholder / Role | Key Feature Requirements | Implementation Status | Route / Page URL | Component File |
| :--- | :--- | :---: | :--- | :--- |
| **Admin** | Approve shop owner accounts | ✅ Active | [`/dashboard/admin/shop-owners`](http://localhost:5173/dashboard/admin/shop-owners) | `AdminShopOwnerApproval.jsx` |
| **Admin** | Approve delivery runner accounts | ✅ Active | [`/dashboard/admin/runners`](http://localhost:5173/dashboard/admin/runners) | `AdminRunnerApproval.jsx` |
| **Admin** | Create and edit campus shops | ✅ Active | [`/dashboard/admin/shops`](http://localhost:5173/dashboard/admin/shops) | `AdminManageShops.jsx` |
| **Admin** | Overall order & delivery reports | ✅ Active | [`/dashboard/admin/reports`](http://localhost:5173/dashboard/admin/reports) | `AdminReportsAnalytics.jsx` |
| **Admin** | Handle complaint tickets | ✅ Active | [`/dashboard/admin/complaints`](http://localhost:5173/dashboard/admin/complaints) | `AdminComplaintManagement.jsx` |
| **Admin** | Admin Dashboard & Stats | ✅ Active | [`/dashboard/admin`](http://localhost:5173/dashboard/admin) | `AdminDashboard.jsx` |
| **Admin** | Admin Profile Settings | ✅ Active | [`/dashboard/admin/profile`](http://localhost:5173/dashboard/admin/profile) | `AdminProfile.jsx` |
| **Shop Owner** | Add/update menu items & prices | ✅ Active | [`/dashboard/shop/menu`](http://localhost:5173/dashboard/shop/menu) & [`/dashboard/shop/menu/add`](http://localhost:5173/dashboard/shop/menu/add) | `ShopMenuManagement.jsx`, `ShopAddMenuItem.jsx` |
| **Shop Owner** | Mark items available/unavailable | ✅ Active | [`/dashboard/shop/menu`](http://localhost:5173/dashboard/shop/menu) | `ShopMenuManagement.jsx` |
| **Shop Owner** | Accept/reject incoming orders | ✅ Active | [`/dashboard/shop/orders`](http://localhost:5173/dashboard/shop/orders) & [`/dashboard/shop/orders/:orderId`](http://localhost:5173/dashboard/shop/orders/3392) | `ShopIncomingOrders.jsx`, `ShopOrderDetails.jsx` |
| **Shop Owner** | Mark order as preparing / ready for pickup | ✅ Active | [`/dashboard/shop/orders/:id/preparing`](http://localhost:5173/dashboard/shop/orders/3392/preparing) & [`/dashboard/shop/orders/:id/ready`](http://localhost:5173/dashboard/shop/orders/3392/ready) | `ShopPreparingOrder.jsx`, `ShopReadyForPickup.jsx` |
| **Shop Owner** | View sales history & daily reports | ✅ Active | [`/dashboard/shop/reports`](http://localhost:5173/dashboard/shop/reports) & [`/dashboard/shop`](http://localhost:5173/dashboard/shop) | `ShopSalesReports.jsx`, `ShopDashboard.jsx` |
| **Shop Owner** | View customer reviews & ratings | ✅ Active | [`/dashboard/shop/reviews`](http://localhost:5173/dashboard/shop/reviews) | `ShopCustomerReviews.jsx` |
| **Shop Owner** | Shop Profile Management | ✅ Active | [`/dashboard/shop/profile`](http://localhost:5173/dashboard/shop/profile) | `ShopProfile.jsx` |
| **Delivery Runner** | View available delivery requests | ✅ Active | [`/dashboard/runner/deliveries`](http://localhost:5173/dashboard/runner/deliveries) & [`/dashboard/runner`](http://localhost:5173/dashboard/runner) | `RunnerAvailableDeliveries.jsx`, `RunnerDashboard.jsx` |
| **Delivery Runner** | Accept delivery tasks | ✅ Active | [`/dashboard/runner/deliveries`](http://localhost:5173/dashboard/runner/deliveries) → [`/dashboard/runner/active/accepted`](http://localhost:5173/dashboard/runner/active/accepted) | `RunnerOrderAccepted.jsx` |
| **Delivery Runner** | Update delivery status (Picked up, On the way, Delivered) | ✅ Active | [`/dashboard/runner/active/tracking`](http://localhost:5173/dashboard/runner/active/tracking) → [`/dashboard/runner/active/completed`](http://localhost:5173/dashboard/runner/active/completed) | `RunnerOrderTracking.jsx`, `RunnerDeliveryCompleted.jsx` |
| **Delivery Runner** | Earn dummy money/credits & payout | ✅ Active | [`/dashboard/runner/earnings`](http://localhost:5173/dashboard/runner/earnings) & [`/dashboard/runner/history`](http://localhost:5173/dashboard/runner/history) | `RunnerEarnings.jsx`, `RunnerDeliveryHistory.jsx` |
| **Delivery Runner** | Chat with student & shop (Blank Avatar) | ✅ Active | [`/dashboard/runner/chat`](http://localhost:5173/dashboard/runner/chat) | `SharedChat.jsx` |
| **Delivery Runner** | Runner Profile & Verification Status | ✅ Active | [`/dashboard/runner/profile`](http://localhost:5173/dashboard/runner/profile) | `RunnerProfile.jsx` |
| **Ordering Student** | Browse shops, categories & menus | ✅ Active | [`/dashboard/student/shops`](http://localhost:5173/dashboard/student/shops) & [`/dashboard/student/shops/:shopId`](http://localhost:5173/dashboard/student/shops/1) | `BrowseShops.jsx`, `ShopDetails.jsx`, `StudentDashboard.jsx` |
| **Ordering Student** | Add to cart, slide-out drawer, favorites | ✅ Active | Across all student shop/dashboard views | `CartContext.jsx`, `CartSlideOut.jsx`, `FavoritesContext.jsx` |
| **Ordering Student** | Place orders & choose delivery time/location | ✅ Active | [`/checkout`](http://localhost:5173/checkout) | `CheckoutPage.jsx` |
| **Ordering Student** | Real-time order tracking & status flow | ✅ Active | [`/order-success`](http://localhost:5173/order-success) & [`/dashboard/student/orders`](http://localhost:5173/dashboard/student/orders) | `OrderSuccessPage.jsx`, `MyOrdersPage.jsx` |
| **Ordering Student** | Pay dummy money (Wallet, bKash, COD) | ✅ Active | [`/checkout`](http://localhost:5173/checkout) | `CheckoutPage.jsx` |
| **Ordering Student** | Rate shop & delivery runner (5-Star modal) | ✅ Active | [`/dashboard/student/orders`](http://localhost:5173/dashboard/student/orders) | `MyOrdersPage.jsx` |
| **Ordering Student** | Chat with shop & runner + Send button | ✅ Active | [`/dashboard/student/chat`](http://localhost:5173/dashboard/student/chat) | `ChatPage.jsx` |
| **Guests / Auth** | Role Selection Portal | ✅ Active | [`/`](http://localhost:5173/) | `SelectionPage.jsx` |
| **Guests / Auth** | Registration with dynamic ID visibility | ✅ Active | [`/register`](http://localhost:5173/register) | `RegistrationPage.jsx` |
| **Guests / Auth** | Role-based Login system | ✅ Active | [`/login`](http://localhost:5173/login) | `LoginPage.jsx` |
| **Cross-Cutting** | Sales & Delivery Performance Reports (PDF) | ✅ Active | [`/dashboard/admin/reports`](http://localhost:5173/dashboard/admin/reports) & [`/dashboard/shop/reports`](http://localhost:5173/dashboard/shop/reports) | `AdminReportsAnalytics.jsx`, `ShopSalesReports.jsx` |

---

## 🔍 Detailed Breakdown by Role & Page

### 1. Admin Role
| Page Name | Route URL | Key Features & Actions |
| :--- | :--- | :--- |
| **Admin Dashboard** | `/dashboard/admin` | High-level metrics (Total Revenue, Active Runners, Campus Orders, Complaints), Quick Actions, Recent Activity Log. |
| **Shop Owner Approval** | `/dashboard/admin/shop-owners` | Review pending shop owner registrations, verify Trade Licenses, Approve or Reject applications with instant status updates. |
| **Runner Approval** | `/dashboard/admin/runners` | Review student runner applications, verify Student IDs, approve runner status, view driver details. |
| **Manage Shops** | `/dashboard/admin/shops` | Create new campus shop, edit shop details, change operating hours, toggle active/inactive status, remove shop. |
| **Complaint Management** | `/dashboard/admin/complaints` | Filter complaints by status (Open, In Review, Resolved), view student/runner dispute details, resolve or escalate tickets. |
| **Reports & Analytics** | `/dashboard/admin/reports` | Comprehensive revenue, order volume, runner efficiency metrics, date range filters (Today, 7 Days, Semester), **Download PDF Report**, **Export CSV/Excel**. |
| **Admin Profile** | `/dashboard/admin/profile` | Manage administrator details, system settings, security logs. |

---

### 2. Shop Owner Role
| Page Name | Route URL | Key Features & Actions |
| :--- | :--- | :--- |
| **Shop Dashboard** | `/dashboard/shop` | Today's sales summary, pending orders count, live incoming orders list, quick status toggles. |
| **Incoming Orders** | `/dashboard/shop/orders` | View live queue of student orders, accept or reject orders, estimated preparation timers. |
| **Order Details** | `/dashboard/shop/orders/:orderId` | View itemized customer order, special cooking instructions, student contact info, direct chat/call buttons, proceed to cooking. |
| **Preparing Order** | `/dashboard/shop/orders/:orderId/preparing` | Kitchen view timer, item checklist, mark preparation progress, trigger "Ready for Pickup". |
| **Ready For Pickup** | `/dashboard/shop/orders/:orderId/ready` | Waiting for runner pickup notification, assign runner verification code, complete handover. |
| **Menu Management** | `/dashboard/shop/menu` | Search items, filter by category (Burgers, Drinks, Meals), toggle item In-Stock / Out-of-Stock, edit prices, delete items. |
| **Add Menu Item** | `/dashboard/shop/menu/add` | Upload dish image, set name, category, price, preparation time, dietary tags (Halal, Spicy, Veg). |
| **Sales Reports** | `/dashboard/shop/reports` | Daily/weekly revenue charts, best-selling items, commission breakdown, **Export PDF Sales Report**. |
| **Customer Reviews** | `/dashboard/shop/reviews` | View student ratings, food review comments, response to feedback. |
| **Shop Profile** | `/dashboard/shop/profile` | Update shop name, banner image, contact number, opening/closing hours, campus building location. |

---

### 3. Delivery Student (Runner) Role
| Page Name | Route URL | Key Features & Actions |
| :--- | :--- | :--- |
| **Runner Dashboard** | `/dashboard/runner` | Active delivery card with pickup/drop-off timelines, quick action buttons, today's earnings & delivery counts. |
| **Available Deliveries** | `/dashboard/runner/deliveries` | List of orders ready for pickup across campus shops with payout amounts (৳ 30 - ৳ 60), pickup/drop-off distance, "Accept Delivery" button. |
| **Delivery Accepted** | `/dashboard/runner/active/accepted` | Pickup location details, shop contact, customer notes, navigation map trigger, call/chat triggers. |
| **Order Tracking** | `/dashboard/runner/active/tracking` | Multi-stage status tracker (Accepted → Reached Shop → Picked Up → On the Way → Delivered), student call/chat triggers, "Mark Delivered". |
| **Delivery Completed** | `/dashboard/runner/active/completed` | Delivery summary, earned credits (৳ 40 earned), customer tip display, "Return to Dashboard" button. |
| **Delivery History** | `/dashboard/runner/history` | List of completed deliveries with timestamps, earnings per trip, status filters. |
| **Runner Earnings** | `/dashboard/runner/earnings` | Total wallet balance, weekly breakdown, completed trips graph, "Withdraw / Payout" simulation. |
| **Runner Chat** | `/dashboard/runner/chat` | Filter by Student/Shop/Support, send custom messages, quick response chips, simulated live auto-replies, call modals, **Blank Avatar** style. |
| **Runner Profile** | `/dashboard/runner/profile` | View Student ID verification, total trips completed, star rating, vehicle/bicycle type, emergency contact. |

---

### 4. Ordering Student Role
| Page Name | Route URL | Key Features & Actions |
| :--- | :--- | :--- |
| **Student Dashboard** | `/dashboard/student` | Hero banner with UIU campus visual, category chips, featured shops, top-rated meals, active order banner, support links. |
| **Browse Shops** | `/dashboard/student/shops` | Search shops, filter by category & rating, "Favorites Only" filter toggle, direct heart button favoriting. |
| **Shop Details** | `/dashboard/student/shops/:shopId` | Full menu with category tabs, dish photos, descriptions, prices, one-click add to cart `+` buttons, heart favorite toggle. |
| **Cart Drawer** | *Global Slide-out* | Item list, quantity increment/decrement, subtotal calculation, free campus delivery threshold, direct "Proceed to Checkout" button. |
| **Checkout Page** | `/checkout` | Delivery building & room selector, delivery time slots (ASAP, 15m, 30m), payment method (UIU Dummy Wallet, bKash, Cash on Delivery), order confirmation. |
| **Order Success** | `/order-success` | Success animation, Order ID, assigned runner badge, ETA countdown, "Track Order" button. |
| **My Orders Page** | `/dashboard/student/orders` | Active & Past orders tabs, live timeline status, re-order button, "Rate Order & Runner" 5-star modal. |
| **Student Chat** | `/dashboard/student/chat` | Direct chat with assigned Runner, Shop Owner, and UIU Support Desk with send button, Enter trigger, quick replies, typing indicator, auto-replies. |

---

### 5. Guests & Authentication
| Page Name | Route URL | Key Features & Actions |
| :--- | :--- | :--- |
| **Role Selection** | `/` | 4-card role selector (Student → Runner → Shop Owner → Admin) with direct login routes. |
| **Registration Page** | `/register` | Registration form with Student / Runner / Shop Owner tabs, dynamic University ID visibility (hidden for shops), simplified email field. |
| **Login Page** | `/login` | Role-based one-click demo login & custom credential login directing users into their respective authenticated dashboards. |

---

## 🎯 Verification Summary
- **100% of required features** are visible, routed, and functional in the application.
- **Build Status**: Verified with `npm run build` — 0 errors.
- **Development Server**: Continuously running on [http://localhost:5173](http://localhost:5173).
