# SUPER MART — Full-Stack Super Shop & Multi-Category E-Commerce Platform

A production-ready online supermarket and hypermarket platform built for high-speed multi-category grocery shopping with instant delivery, live order tracking, Bangladesh payment gateways (bKash, Nagad, Rocket, COD), and enterprise management portals.

---

## 🌟 Key Features

### 1. Multi-Category Department Architecture
Covers 14 real-world supermarket categories (A through N):
- **A. Grocery & Daily Essentials**: Chashi Chinigura rice, Rupchanda fortified soybean oil, Teer atta, Radhuni pure spices, noodles, lentils, tea & coffee.
- **B. Fresh Fruits & Vegetables**: Naturally ripened papaya, red salad tomatoes, Munshiganj potatoes, fresh spinach, leafy greens.
- **C. Meat & Seafood**: Fresh Padma River Hilsa fish (Ilish), 100% Halal beef curry cuts, farm red eggs.
- **D. Dairy & Bakery**: Aarong Dairy pure milk, Bogura sweet curd (misti doi), fresh bakery items.
- **E. Beverages & Juices**: Coca-Cola zero sugar, Pran Frooto real mango juice, mineral water.
- **F. Electronics & Gadgets**: Anker Soundcore Bluetooth speakers, Xiaomi Haylou smartwatches, Baseus 65W GaN chargers.
- **G. Fashion & Clothing**: Men's royal embroidered Panjabi, women's pure cotton printed kurtis.
- **H. Beauty & Personal Care**: Nivea soft cream, Dettol antiseptic soap bundles.
- **I. Home & Kitchen**: Kiam non-stick fry pans, Harpic power cleaners.
- **J. Baby & Kids**: Pampers baby dry diaper pants, baby food.
- **K. Health & Wellness**: Omron digital blood pressure monitors, first aid antiseptics.
- **L. Stationery & Books**: Matador pinpoint ballpoint pens.
- **M. Pet Supplies**: Whiskas cat food ocean fish.
- **N. Sports & Fitness**: Yonex carbon badminton rackets.

### 2. Bangladesh Localization & Gateways
- **Currency**: BDT (৳) with automatic English and Bangla digit formatting.
- **Bilingual Interface**: 1-click toggle between **English** and **বাংলা** (কার্টে যোগ, ফ্ল্যাশ সেল, ক্যাটাগরি).
- **Payment Gateways**:
  - Cash on Delivery (COD)
  - bKash (Interactive simulator with merchant account `01899-SUPERMART` and automated TRX ID verification)
  - Nagad
  - Rocket & Card payments
- **Delivery Slots**:
  - Express (Within 60 Mins)
  - Today: Afternoon (2:00 PM - 5:00 PM)
  - Today: Evening (6:30 PM - 9:30 PM)
  - Tomorrow: Morning (9:00 AM - 12:00 PM)

### 3. Shopping Cart & Checkout
- Interactive quantity stepper directly on product cards (`[-]` `Qty` `[+]`)
- Slide-in cart drawer with free delivery progress bar (Free shipping over ৳1,500)
- Promo code engine (`SUPER100` for ৳100 off, `RAMADAN20` for 15% off, `FRESH50` for ৳50 off)
- Instant order confirmation with confetti explosion
- Printable Supermarket Invoice & thermal receipt with VAT BIN and itemized breakdown

### 4. Portals & Role-Based Access Control (RBAC)
- **Customer Portal**: My orders, 1-click reorder all items, saved delivery addresses, wishlist, loyalty points (1 point per ৳20 spent).
- **Live Order Tracking**: Real-time status progression (Pending → Confirmed → Processing → Packed → Out for Delivery → Delivered) with assigned rider details and direct call button.
- **Enterprise Admin Dashboard**:
  - Live revenue analytics & sales by category
  - Product catalog CRUD (Add product, update price, adjust stock, delete)
  - Order dispatch workflow (Update status, assign riders, view invoices)
  - Perishable goods shelf-life and expiration tracking
  - Staff RBAC management
- **Delivery Agent (Rider) Dashboard**: Mobile-optimized interface for riders to view assigned dispatches, customer address, phone number, and collect cash.
- **Customer Support**: 24/7 hotline (16999), instant FAQ, live chat simulator, and ticket management.

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express.js REST API with Vite middleware integration.
- **Persistence**: Structured JSON database in `data/db.json` with fallback memory store and automatic synchronization.
- **Port**: 3000

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🔐 Demo Accounts (Role Switcher in Header)
- **Customer**: Tanvir Ahmed (`tanvir@supermart.bd` / `01711223344`)
- **Super Admin**: Admin Farhana Haque (`admin@supermart.bd`)
- **Store Manager**: Kabir Hossain (`manager@supermart.bd`)
- **Delivery Rider**: Sojib Hasan Rider #104 (`01677334455`)
