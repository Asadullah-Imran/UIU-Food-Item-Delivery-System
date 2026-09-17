# UIU Food & Items Delivery System — Student Role Engineering & Integration Phases

> **🤝 4-Member Collaboration Scope Note:**
> This repository is collaboratively engineered by 4 team members across four dedicated roles (**Admin**, **Shop Owner**, **Delivery Runner**, and **Ordering Student**). 
> This phase tracking document is exclusively dedicated to the **Student Role** (Ordering Customer), tracking all student-specific backend controllers, API endpoints, MongoDB models, and frontend integration deliverables.

---

## 📊 Student Role Phase Status Overview

| Phase | Description | Scope / Domain | Status | Last Updated |
| :---: | :--- | :--- | :---: | :---: |
| **Phase 1** | **Student Authentication, Profiles & Session Sync** | Registration, Login, JWT session hydration, Student ID & Room | ✅ **COMPLETED** | 2026-09-17 |
| **Phase 2** | **Campus Shop Discovery & Dynamic Menus** | Shop Browsing, Categories, Dynamic Menu, Favorite Shops | ✅ **COMPLETED** | 2026-09-17 |
| **Phase 3** | **Campus Wallet, In-App Purchase & Checkout Flow** | In-App Cash Top-Up Simulator, Insufficient Funds Blocker, Order Placement | ✅ **COMPLETED** | 2026-09-17 |
| **Phase 4** | **Live Order Tracking, History & 100% Refund Cancellation** | Active Orders Queue, Real-Time Timeline, Drop-off Room, 1-Click Cancel | ✅ **COMPLETED** | 2026-09-17 |
| **Phase 5** | **Post-Delivery Reviews, 5-Star Ratings & Complaints** | Rate Shop & Runner, Food Feedback, Dispute Ticket Submission | ✅ **COMPLETED** | 2026-09-17 |
| **Phase 6** | **Student Tri-Party Order Chat & UIU Support** | In-App Messaging with Runner & Shop, Quick Replies, Notification Badges | ✅ **COMPLETED** | 2026-09-17 |

---

## 🚀 Detailed Student Phase Breakdown

### Phase 1: Student Authentication, Profile & Session Sync
- **Status:** ✅ **COMPLETED**
- **Target Frontend Pages:**
  - [`SelectionPage.jsx`](client/src/pages/auth/SelectionPage.jsx) (`/`)
  - [`LoginPage.jsx`](client/src/pages/auth/LoginPage.jsx) (`/login`)
  - [`RegistrationPage.jsx`](client/src/pages/auth/RegistrationPage.jsx) (`/register`)
- **Backend Endpoints & Controllers:**
  - `POST /api/auth/register` — Student registration with Student ID (`011XXXXXX`), department, delivery room.
  - `POST /api/auth/login` — JWT token generation & password comparison for student account.
  - `GET /api/auth/me` — JWT session hydration & profile retrieval.
  - `PUT /api/auth/profile` — Update student delivery room, phone, and profile avatar.
- **Deliverables Completed:**
  - [x] Bcrypt password hashing & JWT auth in `User` model.
  - [x] Role-based status defaults (`status: 'active'`, `isApproved: true` for students).
  - [x] Initial app load session hydration and JWT validation in `AuthContext.jsx`.
  - [x] 1-Click demo student credentials in `LoginPage.jsx` (`student@uiu.ac.bd` / `password123`).

---

### Phase 2: Campus Shop Discovery, Dynamic Menus & Favorites
- **Status:** ✅ **COMPLETED**
- **Target Frontend Pages:**
  - [`StudentDashboard.jsx`](client/src/pages/student/StudentDashboard.jsx) (`/dashboard/student`)
  - [`BrowseShops.jsx`](client/src/pages/student/BrowseShops.jsx) (`/dashboard/student/shops`)
  - [`ShopDetails.jsx`](client/src/pages/student/ShopDetails.jsx) (`/dashboard/student/shops/:shopId`)
  - [`CartSlideOut.jsx`](client/src/components/CartSlideOut.jsx) (Global Slide-out)
- **Backend Endpoints & Controllers:**
  - `GET /api/student/shops` — List approved campus vendors with category filter, search query, and rating sorting (`server/controllers/student/studentShopController.js`).
  - `GET /api/student/shops/:shopId` — Retrieve shop profile, active menu items, and distinct categories.
- **Deliverables Completed:**
  - [x] Live MongoDB shop listing on `BrowseShops.jsx` with category pills (Fast Food, Food Court, Stationery).
  - [x] Real-time categorized menu rendering on `ShopDetails.jsx` with dietary tags (Halal, Spicy) and in-stock checks.
  - [x] Favorites state persistence via `FavoritesContext.jsx` with heart toggle animation.
  - [x] Cart item addition, quantity adjustments, and subtotal calculation in `CartContext.jsx` and `CartSlideOut.jsx`.

---

### Phase 3: Campus Digital Wallet, In-App Purchase & Checkout Flow
- **Status:** ✅ **COMPLETED**
- **Target Frontend Pages:**
  - [`CheckoutPage.jsx`](client/src/pages/student/CheckoutPage.jsx) (`/checkout`)
  - [`TopUpModal.jsx`](client/src/components/wallet/TopUpModal.jsx) (Global In-App Simulator)
  - [`OrderSuccessPage.jsx`](client/src/pages/student/OrderSuccessPage.jsx) (`/order-success`)
- **Backend Endpoints & Controllers:**
  - `GET /api/student/wallet/balance` — Real-time student wallet balance and transaction ledger (`server/controllers/student/studentWalletController.js`).
  - `POST /api/student/wallet/topup` — In-App top-up simulation with bKash, Nagad, and UIU Smart ID channels.
  - `POST /api/student/orders` — In-App Purchase validation (`walletBalance >= grandTotal`), atomic balance deduction, and financial ledger logging (`server/controllers/student/studentOrderController.js`).
- **Deliverables Completed:**
  - [x] Exclusive In-App Purchase payment method (removed direct COD/external cards at checkout).
  - [x] Insufficient balance guard: Disables checkout button and provides 1-click `+ Top Up` modal with amount chips (৳100, ৳200, ৳500, ৳1000).
  - [x] Transaction ledger schema in `Transaction.js` recording all debits and credits.
  - [x] Live header wallet pill badge (`💳 ৳ 650.00`) and Student Dashboard wallet card.
  - [x] Receipt confirmation on `OrderSuccessPage.jsx` showing order number and remaining balance.

---

### Phase 4: Real-Time Order Lifecycle Tracking & 100% Refund Cancellation
- **Status:** ✅ **COMPLETED**
- **Target Frontend Pages:**
  - [`MyOrdersPage.jsx`](client/src/pages/student/MyOrdersPage.jsx) (`/dashboard/student/orders`)
  - [`OrderSuccessPage.jsx`](client/src/pages/student/OrderSuccessPage.jsx) (`/order-success`)
- **Backend Endpoints to Connect:**
  - `GET /api/student/orders` — Fetch student active & completed order history with populated shop and runner info.
  - `GET /api/student/orders/:orderId` — Single order tracking details with live 5-step status timeline (`PLACED` $\rightarrow$ `CONFIRMED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY_FOR_PICKUP` $\rightarrow$ `ON_THE_WAY` $\rightarrow$ `DELIVERED`).
  - `POST /api/student/orders/:orderId/cancel` — Cancel pending order and receive instant 100% wallet refund.
- **Deliverables Completed:**
  - [x] Connect `MyOrdersPage.jsx` to live `GET /api/student/orders` from MongoDB with active, completed, and cancelled tab filters.
  - [x] Implement active order progress tracker with dynamic 5-step status timeline, ETA, and runner contact details.
  - [x] Connect "Cancel Order" button to `POST /api/student/orders/:orderId/cancel` with real-time 100% wallet balance refund and notification banner.
  - [x] Add 1-click re-order button to quickly populate cart from previous orders.
  - [x] Itemized receipt modal with billing breakdown, special instructions, and timeline log.

---

### Phase 5: Post-Delivery Reviews, 5-Star Ratings & Complaint Tickets
- **Status:** ✅ **COMPLETED**
- **Target Frontend Pages:**
  - [`MyOrdersPage.jsx`](client/src/pages/student/MyOrdersPage.jsx) (`/dashboard/student/orders`)
  - Rate Order Modal & Dispute Support Ticket Modal
- **Backend Endpoints to Connect:**
  - `POST /api/student/orders/:orderId/rate` — Submit 5-star rating for shop food and runner speed (`server/controllers/student/studentReviewController.js`).
  - `POST /api/student/complaints` — Submit dispute ticket for late delivery, missing item, or wrong location (`server/controllers/student/studentComplaintController.js`).
  - `GET /api/student/complaints` — View student ticket resolution status.
- **Deliverables Completed:**
  - [x] Connect 5-star rating modal on completed orders to update shop and runner reputation.
  - [x] Build student dispute / complaint submission form with category presets (Late Delivery, Missing Item, Food Quality, Spill/Damaged, Payment Issue).
  - [x] Display admin ticket resolutions, priority badges, and compensation status in dedicated "Disputes & Tickets" tab.
  - [x] Add 1-click "Report Issue" buttons directly on order cards and in receipt modals.

---

### Phase 6: Student Tri-Party Order Chat & UIU Support
- **Status:** ✅ **COMPLETED**
- **Target Frontend Pages:**
  - [`ChatPage.jsx`](client/src/pages/student/ChatPage.jsx) (`/dashboard/student/chat`)
  - [`OrderChatDrawer.jsx`](client/src/components/chat/OrderChatDrawer.jsx)
- **Backend Endpoints to Connect:**
  - `GET /api/student/chat/:orderNumber` — Retrieve live order conversation thread (`server/controllers/student/studentChatController.js`).
  - `POST /api/student/chat/:orderNumber` — Send instant message to assigned runner, shop kitchen, or UIU support.
- **Deliverables Completed:**
  - [x] Connect order chat hub and drawer to MongoDB message persistence (`POST /api/student/chat/:orderNumber`).
  - [x] Support quick reply chips ("I am at 4th floor elevator", "Please add extra cutlery").
  - [x] Simulated multi-role auto-replies for kitchen preparation status and runner delivery ETA.
  - [x] Unread message badges and active order switching in chat drawer.
