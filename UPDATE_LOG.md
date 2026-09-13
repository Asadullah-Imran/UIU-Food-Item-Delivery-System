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
