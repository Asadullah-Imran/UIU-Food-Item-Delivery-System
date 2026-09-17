# Agent Guidelines & Repository Workflow

This file sets mandatory rules and workflows for all AI coding agents working on the **UIU Food & Items Delivery System**.

---

## 📌 Core Operational Directives

### 1. Maintain & Update `PHASES.md`
- **Location:** [`PHASES.md`](PHASES.md) (in the repository root).
- **Rule:** Before starting work on any task, check `PHASES.md` to identify the active phase and remaining deliverables.
- **Rule:** Whenever starting or completing deliverables in a phase, update the checkboxes `[x]` and phase status (`COMPLETED`, `IN_PROGRESS`, `PENDING`) and `Last Updated` date in `PHASES.md`.
- **Scope Notice:** This repository's phase tracking is tailored to the **Student Role** for team collaboration.

---

### 2. Maintain & Update `UPDATE_LOG.md`
- **Location:** [`UPDATE_LOG.md`](UPDATE_LOG.md) (in the repository root).
- **Rule:** After every user-requested task, bug fix, feature addition, or phase completion, **append a new entry** to `UPDATE_LOG.md`.
- **Entry Structure:**
  ```markdown
  ### [YYYY-MM-DD] — <Feature / Task Title> (Phase X Status)
  - **Domain:** <Area of application, e.g., Student Orders / Student Wallet / Auth>
  - **Status:** <e.g., Phase 3 COMPLETED / Phase 4 IN_PROGRESS>
  - **Changes Summary:**
    - **Backend:** <List of endpoints, models, middlewares created or changed>
    - **Frontend:** <List of pages, components, context state updated>
  - **Files Modified/Created:**
    - <File path 1>
    - <File path 2>
  - **Verification:**
    - <Commands run, API status codes, and test results>
  ```

---

### 3. Engineering & Architecture Rules
- **Role-Modular Architecture**: All student-specific backend controllers and routes must reside in `server/controllers/student/` and `server/routes/student/`, matching the frontend `client/src/pages/student/` pattern.
- **In-App Closed-Loop Purchase**: All student purchases operate exclusively via the Campus Digital Wallet (`User.walletBalance`). Do not introduce cash-on-delivery or direct card bypasses at checkout.
- **No Mock Bypasses**: Do not introduce fake fallback logic in frontend pages that silently ignores backend errors or fakes successful operations. All operations must validate through backend API endpoints and MongoDB.
- **Strict Role Security**: Ensure all protected routes and endpoints verify the user's role (`student`, `runner`, `shop`, `admin`) via the `protect` and `authorize` middlewares in `server/middlewares/`.
- **Always Validate Builds**: When frontend components are created or updated, run `npm run build` in `client/` to verify zero syntax/build errors before completing turns.
- **Port Mapping**: The Express backend runs on `http://localhost:5001`. The Vite frontend runs on `http://localhost:5173` with proxy rule `/api -> http://localhost:5001`.
