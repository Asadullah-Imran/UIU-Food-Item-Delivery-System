# UIU Food & Items Delivery System — Update Log

This document records the chronological history of updates, changes, test verifications, and phase completions across the project.

---

## 📝 Update Log

### [2026-09-13] — Authentication & Session Stabilization (Phase 1 Complete)
- **Domain:** Authentication, Session Management & API Verification
- **Status:** Phase 1 ✅ COMPLETED
- **Changes Summary:**
  - **Backend**:
    - Verified MongoDB Atlas connection and `User` model with Bcrypt password hashing and JWT issuance.
    - Added explicit `POST /api/auth/logout` endpoint in `server/controllers/authController.js` and `server/routes/authRoutes.js`.
    - Executed database seeder (`npm run seed`) creating verified accounts for `admin`, `student`, `runner`, and `shop` roles.
    - Tested registration, login, JWT bearer `/api/auth/me`, and logout with automated HTTP test scripts.
  - **Frontend**:
    - Fixed [LoginPage.jsx](client/src/pages/auth/LoginPage.jsx): Enforced real form validation (email and password required), removed fallback mock bypass that logged in on failure, and connected 1-click role demo sign-ins to real backend auth.
    - Fixed [RegistrationPage.jsx](client/src/pages/auth/RegistrationPage.jsx): Added password mismatch & length validation, removed bypass fallback, and connected real registration to MongoDB.
    - Updated [AuthContext.jsx](client/src/context/AuthContext.jsx): Added initial app load session hydration that validates stored JWT tokens against `GET /api/auth/me` and invalidates expired sessions.
- **Files Modified/Created:**
  - `server/controllers/authController.js`
  - `server/routes/authRoutes.js`
  - `client/src/pages/auth/LoginPage.jsx`
  - `client/src/pages/auth/RegistrationPage.jsx`
  - `client/src/context/AuthContext.jsx`
  - `PHASES.md`
  - `UPDATE_LOG.md`
  - `AGENTS.md`
- **Verification:**
  - `POST /api/auth/register` -> 201 Created
  - `POST /api/auth/login` -> 200 OK (returned signed token + user object)
  - `GET /api/auth/me` -> 200 OK (verified role and user attributes)
  - `POST /api/auth/logout` -> 200 OK
  - `npm run build` in `client/` passed with 0 errors.

---

### [2026-09-13] — Campus Shops & Menu Management (Phase 2 Complete)
- **Domain:** Campus Shops, Menu Management & Food Item Creation
- **Status:** Phase 2 ✅ COMPLETED
- **Changes Summary:**
  - **Backend**:
    - Created `server/controllers/shopController.js` and `server/routes/shopRoutes.js`.
    - Added `GET /api/shops` (with category and search filters), `GET /api/shops/:shopId` (with populated menu and categories), `GET /api/shops/my-shop` (shop owner menu management), `POST /api/shops/menu` (create food item), `PUT /api/shops/menu/:id` (update item), `PATCH /api/shops/menu/:id/availability` (toggle stock), `DELETE /api/shops/menu/:id`, and `PUT /api/shops/profile` (update shop information).
    - Mounted `/api/shops` in `server/index.js` with role protection (`protect`, `authorizeRoles('shop', 'admin')`).
    - Extended `MenuItem` schema to support `stockQuantity`, `taxRate`, `discount`, `todaySpecial`, `featured`, `recommended`.
  - **Frontend**:
    - Connected [`ShopAddMenuItem.jsx`](client/src/pages/shop/ShopAddMenuItem.jsx) (`/dashboard/shop/menu/add`) to `POST /api/shops/menu` with live input validation, image preview, and loading states.
    - Connected [`ShopMenuManagement.jsx`](client/src/pages/shop/ShopMenuManagement.jsx) (`/dashboard/shop/menu`) to `GET /api/shops/my-shop`, `PATCH /api/shops/menu/:id/availability`, `DELETE /api/shops/menu/:id`, and `PUT /api/shops/menu/:id`.
    - Connected [`BrowseShops.jsx`](client/src/pages/student/BrowseShops.jsx) and [`StudentDashboard.jsx`](client/src/pages/student/StudentDashboard.jsx) to live `GET /api/shops` with category filters and navigation.
    - Connected [`ShopDetails.jsx`](client/src/pages/student/ShopDetails.jsx) to live `GET /api/shops/:shopId` with dynamic categorized menus, item quantities, and cart additions.
    - Connected [`ShopProfile.jsx`](client/src/pages/shop/ShopProfile.jsx) to `GET /api/shops/my-shop` and `PUT /api/shops/profile`.
    - Enhanced [`CartContext.jsx`](client/src/context/CartContext.jsx) to support both MongoDB `_id` and legacy `id`.
- **Files Modified/Created:**
  - `server/controllers/shopController.js`
  - `server/routes/shopRoutes.js`
  - `server/models/MenuItem.js`
  - `server/index.js`
  - `client/src/pages/shop/ShopAddMenuItem.jsx`
  - `client/src/pages/shop/ShopMenuManagement.jsx`
  - `client/src/pages/shop/ShopProfile.jsx`
  - `client/src/pages/student/BrowseShops.jsx`
  - `client/src/pages/student/ShopDetails.jsx`
  - `client/src/pages/student/StudentDashboard.jsx`
  - `client/src/context/CartContext.jsx`
  - `PHASES.md`
  - `UPDATE_LOG.md`
- **Verification:**
  - `GET /api/shops` -> 200 OK (returned active shops list)
  - `GET /api/shops/:shopId` -> 200 OK (returned shop details + menu items + categories)
  - `POST /api/shops/menu` -> 201 Created (successfully created food item in MongoDB)
  - `PATCH /api/shops/menu/:id/availability` -> 200 OK (toggled In Stock / Out of Stock)
  - `PUT /api/shops/menu/:id` -> 200 OK (updated item price and description)
  - `DELETE /api/shops/menu/:id` -> 200 OK (deleted item)
  - `PUT /api/shops/profile` -> 200 OK (updated operational details)
  - `npm run build` in `client/` passed with 0 errors.

---

### [2026-09-17] — In-App Purchase & Campus Digital Wallet System
- **Domain:** In-App Purchase, Digital Wallet, Automated Settlements & Checkout Flow
- **Status:** In-App Purchase Feature ✅ COMPLETED
- **Changes Summary:**
  - **Backend**:
    - Created [`server/models/Transaction.js`](server/models/Transaction.js) financial ledger schema recording `TOPUP`, `ORDER_PAYMENT`, `RUNNER_EARNING`, `SHOP_EARNING`, and `REFUND`.
    - Extended [`server/models/User.js`](server/models/User.js) with `walletBalance` for students/admins and [`server/models/Shop.js`](server/models/Shop.js) with `walletBalance` & `totalEarnings`.
    - Created [`server/controllers/walletController.js`](server/controllers/walletController.js) and [`server/routes/walletRoutes.js`](server/routes/walletRoutes.js) with `GET /api/wallet/balance`, `POST /api/wallet/topup`, and `GET /api/wallet/transactions`.
    - Created [`server/controllers/orderController.js`](server/controllers/orderController.js) and [`server/routes/orderRoutes.js`](server/routes/orderRoutes.js) with:
      - `POST /api/orders`: In-App Purchase validation checking `student.walletBalance >= grandTotal`, atomic balance deduction, and ledger logging.
      - `PATCH /api/orders/:orderId/status`: Multi-party payout settlement on `DELIVERED` (Runner: +৳20 reward, Shop: +Subtotal sales, Platform: +৳5 fee) and automated refund on `CANCELLED`/`REJECTED`.
    - Mounted `/api/wallet` and `/api/orders` in [`server/index.js`](server/index.js).
    - Updated [`server/utils/seeder.js`](server/utils/seeder.js) with initial wallet balances and transactions.
  - **Frontend**:
    - Created [`TopUpModal.jsx`](client/src/components/wallet/TopUpModal.jsx): Interactive simulation modal with bKash/Nagad/Smart ID channels, quick amount presets (৳100, ৳200, ৳500, ৳1000), simulated PIN verification, and instant balance refresh.
    - Updated [`AuthContext.jsx`](client/src/context/AuthContext.jsx): Added `refreshUser()` and `updateUserWallet()` for global reactive wallet balance.
    - Updated [`SharedLayout.jsx`](client/src/components/SharedLayout.jsx): Added header Wallet Pill badge (e.g. `💳 ৳ 650.00`) and quick `+ Top Up` trigger.
    - Refactored [`CheckoutPage.jsx`](client/src/pages/student/CheckoutPage.jsx): Replaced COD/Card/external methods with exclusive **In-App Campus Wallet**, showing live balance, insufficient balance alerts, blocked checkout on shortage, and direct connection to `POST /api/orders`.
    - Updated [`StudentDashboard.jsx`](client/src/pages/student/StudentDashboard.jsx): Added Campus Digital Wallet card with balance and Top-Up button.
    - Updated [`OrderSuccessPage.jsx`](client/src/pages/student/OrderSuccessPage.jsx): Shows payment confirmed via In-App Wallet and displays remaining wallet balance.
    - Updated [`RunnerEarnings.jsx`](client/src/pages/runner/RunnerEarnings.jsx): Connected to live runner wallet balance.
- **Files Modified/Created:**
  - `server/models/Transaction.js`
  - `server/models/User.js`
  - `server/models/Shop.js`
  - `server/models/Order.js`
  - `server/controllers/walletController.js`
  - `server/routes/walletRoutes.js`
  - `server/controllers/orderController.js`
  - `server/routes/orderRoutes.js`
  - `server/controllers/authController.js`
  - `server/index.js`
  - `server/utils/seeder.js`
  - `client/src/components/wallet/TopUpModal.jsx`
  - `client/src/components/SharedLayout.jsx`
  - `client/src/context/AuthContext.jsx`
  - `client/src/pages/student/CheckoutPage.jsx`
  - `client/src/pages/student/StudentDashboard.jsx`
  - `client/src/pages/student/OrderSuccessPage.jsx`
  - `client/src/pages/runner/RunnerEarnings.jsx`
  - `UPDATE_LOG.md`
- **Verification:**
  - `GET /api/wallet/balance` -> 200 OK (returned current balance and transactions)
  - `POST /api/wallet/topup` -> 200 OK (credited ৳250 and created ledger entry)
  - `POST /api/orders` (with insufficient balance) -> 400 Bad Request with shortage details
  - `POST /api/orders` (with sufficient balance) -> 201 Created and deducted from student wallet
  - `PATCH /api/orders/:id/status` (status: DELIVERED) -> 200 OK with runner credit and shop credit
  - `npm run build` in `client/` passed with 0 errors.

---

### [2026-09-17] — Student Role Architecture & Phase Restructure
- **Domain:** Student Role Engineering, Modular Backend Restructure & Collaboration Setup
- **Status:** Architecture Setup ✅ COMPLETED / Student Phase 4 ⏳ IN_PROGRESS
- **Changes Summary:**
  - **Backend**:
    - Created dedicated role-modular student controllers in `server/controllers/student/`:
      - `studentShopController.js`: Campus vendors & dynamic menu retrieval.
      - `studentOrderController.js`: In-app wallet order placement, status tracker & 100% refund cancellation.
      - `studentWalletController.js`: Student balance, top-up simulation & ledger history.
      - `studentReviewController.js`: 5-star rating for shops and runners.
      - `studentComplaintController.js`: Student dispute & complaint ticket submission.
      - `studentChatController.js`: Tri-party order chat for students.
    - Created `server/routes/student/studentRoutes.js` and mounted at `/api/student` in `server/index.js`.
  - **Documentation & Roadmap**:
    - Rewrote [`PHASES.md`](PHASES.md) into 6 crystal-clear phases focused exclusively on the Student Role for 4-member team collaboration.
    - Updated [`README.md`](README.md) with collaboration guidelines and role-modular architecture breakdown.
    - Updated [`FEATURES_MAP.md`](FEATURES_MAP.md) with student frontend-to-backend endpoint and controller mapping.
    - Updated [`AGENTS.md`](AGENTS.md) with student domain rules and coding standards.
- **Files Modified/Created:**
  - `server/controllers/student/studentShopController.js`
  - `server/controllers/student/studentOrderController.js`
  - `server/controllers/student/studentWalletController.js`
  - `server/controllers/student/studentReviewController.js`
  - `server/controllers/student/studentComplaintController.js`
  - `server/controllers/student/studentChatController.js`
  - `server/routes/student/studentRoutes.js`
  - `server/index.js`
  - `PHASES.md`
  - `README.md`
  - `FEATURES_MAP.md`
  - `AGENTS.md`
  - `UPDATE_LOG.md`
- **Verification:**
  - All `/api/student/*` routes loaded and mounted without syntax errors.
  - `npm run build` in `client/` passed with 0 errors.

---
