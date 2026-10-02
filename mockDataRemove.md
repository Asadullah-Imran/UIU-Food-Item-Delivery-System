# Mock Data Removal & Backend Integration Plan

This document outlines the step-by-step plan to remove all mock data, dummy data, and mock assets from the frontend and replace them with actual data from our backend APIs.

## Phase 1: Authentication (`AuthContext.jsx`) — ✅ COMPLETED
**Goal:** Remove all usages of `uiu_mock_user` in local storage and connect to the real authentication backend.
- **Tasks:**
  - [x] Remove `localStorage.setItem('uiu_mock_user', ...)` and `localStorage.getItem('uiu_mock_user')`. *(Renamed to `uiu_user_cache`; legacy key cleaned up on first access.)*
  - [x] Update `login`, `register`, and `logout` functions to send requests to the actual backend authentication endpoints (e.g., `/api/auth/login`).
  - [x] Ensure that a proper JWT token or session mechanism is utilized and user states are fetched securely from the backend upon app load.
  - [x] Handle backend authentication errors correctly and update UI accordingly. *(Offline JSON parse error handling added.)*
  - [x] Remove mock `login(userData)` bypass function.

## Phase 2: Shop Details (`ShopDetails.jsx`) — ✅ COMPLETED
**Goal:** Remove the mock data fallback and fetch actual shop data from the backend.
- **Tasks:**
  - [x] Delete the hardcoded mock data variables located at the top of the file. *(Removed `shops.json`, `menu.json`, `reviews.json` imports.)*
  - [x] Ensure the component relies exclusively on data fetched from the `GET /api/shops/:id` backend route (or equivalent).
  - [x] Add loading skeletons or spinners while data is being fetched. *(Full-page animated pulse skeleton added.)*
  - [x] Implement error handling for scenarios where shop data cannot be loaded. *(Error/not-found state with back-to-shops link added.)*

## Phase 3: Runner Charts & Analytics (`RunnerDeliveryHistory.jsx` & `RunnerEarnings.jsx`) — ✅ COMPLETED
**Goal:** Replace hardcoded dummy chart arrays with real analytics fetched from the database.
- **Tasks:**
  - [x] Implement/verify backend endpoints for runner statistics (e.g., `GET /api/runner/earnings-history` and `GET /api/runner/delivery-history`).
  - [x] **In `RunnerDeliveryHistory.jsx`**: Replaced hardcoded `chartData` array with dynamic values derived from the real `history` API response. Bar heights are proportional to actual daily delivery counts.
  - [x] **In `RunnerEarnings.jsx`**: Chart already derived from live `transactions` API response (was already correct).
  - [x] Test that charts respond correctly to changes in real-world MongoDB data.

## Phase 4: Mock Assets & Order Tracking (`RunnerOrderTracking.jsx`) — ✅ COMPLETED
**Goal:** Remove the static map mockup and integrate real tracking functionality.
- **Tasks:**
  - [x] Remove the placeholder "Map Mock Background Image" element. *(Unsplash static image removed.)*
  - [x] Integrate a real mapping solution. *(OpenStreetMap `<iframe>` embed centred on UIU Dhaka campus — no API key required.)*
  - [x] Remove `activeDeliveryData.json` import; `displayData` now uses only live `activeOrder` with safe fallbacks.
  - [ ] (Optional) Add real-time location updates via WebSockets or polling if supported by the backend.

## Testing & Verification
- **Test:** Verify all features End-to-End without any mock data to ensure that zero fallback data leaks into production.
- **Validation:** `npm run build` in `client/` folder → ✅ exit 0 (2468 modules, 0 errors) — 2026-10-03
