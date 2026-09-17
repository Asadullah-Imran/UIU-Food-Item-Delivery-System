# UIU Food & Items Delivery System

A specialized campus food & essentials delivery platform engineered for **United International University (UIU)**, featuring dedicated workflows and dashboards for **Students** (Ordering Customers), **Shops** (Campus Vendors), **Runners** (Student Couriers), and **Super Admin**.

---

## 👥 4-Member Collaboration Structure

To ensure zero merge conflicts and seamless team collaboration across 4 team members, the repository is split into 4 role-based domains across both frontend and backend:

| Team Member Scope | Primary Domain | Frontend Modules (`client/src/`) | Backend Modules (`server/`) |
| :--- | :--- | :--- | :--- |
| **Student Role (Active Focus)** | Ordering, In-App Wallet, Order Tracking, Chat | `pages/student/`, `components/wallet/` | `controllers/student/`, `routes/student/` |
| **Shop Role** | Menu Management, Incoming Orders, Sales Reports | `pages/shop/` | `controllers/shop/`, `routes/shop/` |
| **Runner Role** | Delivery Dispatch, Active Tracking, Payouts | `pages/runner/` | `controllers/runner/`, `routes/runner/` |
| **Admin Role** | Approvals, Campus Stores, Disputes, Analytics | `pages/admin/` | `controllers/admin/`, `routes/admin/` |

---

## 🚀 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router DOM, Lucide React (Icons), Context API
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT Authentication, Bcrypt.js

---

## 📁 Project Structure

```text
UIU-Food-Item-Delivery-System/
├── client/                     # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/         # Shared UI, Header, Wallet Top-Up Modal, Chat Hub
│   │   ├── context/            # AuthContext, CartContext, FavoritesContext, LayoutContext
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Register, Role Selector
│   │   │   ├── student/        # 🎓 Student Dashboard, Browse Shops, Shop Menu, Checkout, My Orders
│   │   │   ├── shop/           # 🏪 Shop Dashboard, Orders, Menu Management, Reports
│   │   │   ├── runner/         # 🛵 Runner Available Tasks, Tracking, Earnings
│   │   │   └── admin/          # 👑 Approvals, Complaints, Analytics
│   │   └── App.jsx             # Role-based protected routing
│
└── server/                     # Backend Node.js / Express application
    ├── config/                 # MongoDB Atlas connection
    ├── controllers/
    │   ├── student/            # 🎓 Student Role Controllers (Orders, Wallet, Shops, Reviews, Chat)
    │   ├── authController.js   # Shared JWT Auth & Session
    │   ├── shopController.js   # Campus Shop Management
    │   └── walletController.js # Campus Wallet & Transactions
    ├── middlewares/            # JWT protect & role authorization
    ├── models/                 # User, Shop, MenuItem, Order, Transaction, Complaint, OrderChat
    ├── routes/
    │   ├── student/            # 🎓 Student Routes (/api/student/*)
    │   ├── authRoutes.js
    │   ├── shopRoutes.js
    │   ├── orderRoutes.js
    │   └── walletRoutes.js
    └── utils/                  # Database Seeder (npm run seed)
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection string configured in `server/.env`

### 1. Backend Setup & Database Seeding
```bash
cd server
npm install
npm run seed     # Seeds demo accounts for all 4 roles with realistic wallet balances
npm run dev      # Starts Express server at http://localhost:5001
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts Vite React app at http://localhost:5173
```

---

## 🔑 Default Test Credentials

| Role | Email | Password | Starting Wallet Balance |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `student@uiu.ac.bd` | `password123` | **৳ 650.00** |
| 🛵 **Runner** | `runner@uiu.ac.bd` | `password123` | **৳ 2,450.00** |
| 🏪 **Shop Owner** | `shop@uiu.ac.bd` | `password123` | **৳ 4,250.00** |
| 👑 **Admin** | `admin@uiu.ac.bd` | `password123` | **৳ 1,500.00** |

---

## 🤝 Collaboration Guidelines
- **Role Isolation:** Implement all Student features inside `client/src/pages/student/` and `server/controllers/student/` to avoid conflicts with teammates.
- **In-App Purchase Standard:** All student orders use the In-App Campus Wallet (automatic funds deduction and multi-party distribution on delivery).
