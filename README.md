# UIU Food Item Delivery System

A comprehensive food delivery platform tailored for UIU, featuring dedicated dashboards and workflows for **Students** (Customers), **Shops** (Vendors), and **Runners** (Delivery Personnel).

## 🚀 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router DOM, Lucide React (Icons)
- **Backend (WIP):** Node.js, Express.js

## 📁 Project Structure

This project follows a monorepo-style structure:

```text
UIU-Food-Item-Delivery-System/
├── client/      # Frontend React application (Vite)
└── server/      # Backend Node.js/Express application
```

### 🧩 Frontend Organization (`client/src/`)
To minimize merge conflicts during collaboration, the page components are modularized by user roles:
- `pages/auth/` - Authentication and onboarding pages (Login, Registration)
- `pages/student/` - Student-facing pages (Browse Shops, Checkout, Orders)
- `pages/shop/` - Shop management pages (Menu, Incoming Orders, Sales)
- `pages/runner/` - Runner task pages (Available Deliveries, Earnings, Tracking)

---

## 🛠️ Getting Started (Frontend)

Follow these steps to clone the project, install dependencies, and run the frontend locally.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd UIU-Food-Item-Delivery-System
```

### 2. Navigate to the Client Directory
```bash
cd client
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

The application will start, usually at `http://localhost:5173`. Open this URL in your browser to view the app!

## 🤝 Collaboration Guidelines
- **Working on Pages:** Make sure to create/edit pages inside their respective role folder in `client/src/pages/`.
- **Styling:** We use Tailwind CSS. Please utilize the existing utility classes.
- **Routing:** Routes are centrally managed in `client/src/App.jsx`. If you add a new page, remember to import it and add it to the `Routes` list.
