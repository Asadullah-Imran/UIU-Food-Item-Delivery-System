# Mock Data Removal & Backend Integration Plan

This document outlines the step-by-step plan to remove all mock data, dummy data, and mock assets from the frontend and replace them with actual data from our backend APIs.

## Phase 1: Authentication (`AuthContext.jsx`)
**Goal:** Remove all usages of `uiu_mock_user` in local storage and connect to the real authentication backend.
- **Tasks:**
  - [ ] Remove `localStorage.setItem('uiu_mock_user', ...)` and `localStorage.getItem('uiu_mock_user')`.
  - [ ] Update `login`, `register`, and `logout` functions to send requests to the actual backend authentication endpoints (e.g., `/api/auth/login`).
  - [ ] Ensure that a proper JWT token or session mechanism is utilized and user states are fetched securely from the backend upon app load.
  - [ ] Handle backend authentication errors correctly and update UI accordingly.

## Phase 2: Shop Details (`ShopDetails.jsx`)
**Goal:** Remove the mock data fallback and fetch actual shop data from the backend.
- **Tasks:**
  - [ ] Delete the hardcoded mock data variables located at the top of the file.
  - [ ] Ensure the component relies exclusively on data fetched from the `GET /api/shops/:id` backend route (or equivalent).
  - [ ] Add loading skeletons or spinners while data is being fetched.
  - [ ] Implement error handling for scenarios where shop data cannot be loaded.

## Phase 3: Runner Charts & Analytics (`RunnerDeliveryHistory.jsx` & `RunnerEarnings.jsx`)
**Goal:** Replace hardcoded dummy chart arrays with real analytics fetched from the database.
- **Tasks:**
  - [ ] Implement/verify backend endpoints for runner statistics (e.g., `GET /api/runner/earnings-history` and `GET /api/runner/delivery-history`).
  - [ ] **In `RunnerDeliveryHistory.jsx`**: Remove the dummy data arrays and populate the charts directly with the backend response.
  - [ ] **In `RunnerEarnings.jsx`**: Remove the "Weekly Earnings Trend" dummy chart data and map the backend data points to the charting library.
  - [ ] Test that charts respond correctly to changes in real-world MongoDB data.

## Phase 4: Mock Assets & Order Tracking (`RunnerOrderTracking.jsx`)
**Goal:** Remove the static map mockup and integrate real tracking functionality.
- **Tasks:**
  - [ ] Remove the placeholder "Map Mock Background Image" element.
  - [ ] Integrate a real mapping solution (e.g., Leaflet.js with OpenStreetMap or Google Maps API).
  - [ ] Ensure that the map dynamically centers on the runner's real coordinates and the delivery destination.
  - [ ] (Optional) Add real-time location updates via WebSockets or polling if supported by the backend.

## Testing & Verification
- **Test:** Verify all features End-to-End without any mock data to ensure that zero fallback data leaks into production.
- **Validation:** Confirm that `npm run build` in the `client/` folder executes successfully with 0 errors after the mock data removal.
