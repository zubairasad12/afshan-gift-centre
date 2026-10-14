# 🏠 Afshan Gift Centre — Premium Furniture & Home Decor Store
**Location:** Vehari, Punjab, Pakistan  
**Contact / WhatsApp:** `03001005861`  
**Currency:** Pakistani Rupee (PKR - Rs.)

---

## 🌟 Overview & Key Features

A complete, production-ready full-stack e-commerce store built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM with SQLite (or PostgreSQL)** inspired by the refined minimalist look of woodaction.com with bespoke branding for **Afshan Gift Centre**.

### 🛍️ Customer Storefront
1. **Global Navigation & Layout**:
   - Announcement bar with Free Delivery thresholds (orders above Rs. 10,000) and direct contact (`03001005861`).
   - Sticky Header with serif logo, dropdown category mega-menus (Furniture, Decor, Lighting), instant search trigger, wishlist badge, and live cart drawer.
   - 4-Column warm cream footer with store details, policies, newsletter signup, and COD payment badges.
2. **Dynamic Collections (`/collections`, `/collections/[slug]`, `/sale`)**:
   - 33+ categories seeded (Sofas, Beds, Dining Tables, Candle Stands, Mirrors, Wall Frames, Planters, Chandeliers, etc.).
   - Price range filters, sorting by Featured, Newest, Price: Low-to-High, and Price: High-to-Low.
   - Responsive product cards with secondary image hover, discount badges, and quick add.
3. **Product Detail Pages (`/products/[slug]`)**:
   - High-res image gallery and interactive thumbnail switcher.
   - Dynamic variant picker (Finish & Dimensions) with live stock/price updates.
   - Quantity selector with real-time stock ceiling validation.
   - Direct "Add to Cart" and "Buy Now" workflows.
   - Specifications table (Material, Dimensions, Weight, Finish, Warranty).
   - Solid wood craftsmanship guarantee and Vehari showroom direct inquiry.
4. **Interactive Shopping Cart (`/cart`)**:
   - Quantity adjustment, item removal, live line totals.
   - Free shipping progress counter (Rs. 10,000 threshold).
   - Promo discount coupon validator (`WELCOME500`, `AFSHAN10`, `VEHARI5`).
5. **Multi-Step Checkout & Orders (`/checkout`, `/order-confirmation/[id]`)**:
   - Pakistani shipping addresses with city selection (Vehari, Lahore, Multan, Faisalabad, Karachi, Islamabad, etc.).
   - Payment choices: **Cash on Delivery (COD)** and **Direct Bank Transfer / IBFT**.
   - Server-side inventory reservation, duplicate prevention, and order number generation (`AGC-YYYYMMDD-XXXX`).
   - Order confirmation recap with print and WhatsApp support integration.
6. **Dedicated Content & Policy Pages**:
   - `/about`, `/contact`, `/faq`, `/shipping-policy`, `/return-policy`, `/privacy-policy`, `/terms`.

### 🛡️ Admin Dashboard (`/admin`)
1. **Analytics Overview (`/admin`)**:
   - KPI metrics: Total Sales in PKR, Total Orders, Active Catalog Items, Pending Approvals.
   - Recent orders table with live status badges.
2. **Order Management (`/admin/orders`)**:
   - Filter by status (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`).
   - Order detail modal with customer information and tracking number update.
3. **Product Catalog (`/admin/products`)**:
   - Searchable, categorized product list with stock badges.
   - Interactive Add New Product modal with variant and pricing options.

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- Node.js 18+ (tested with Node 20 / 22 / 25)
- npm or pnpm

### 2. Setup
```bash
# Clone or navigate to the directory
cd sadiaproject

# Verify dependencies are installed
npm install

# Initialize database and seed 55+ realistic products
npx prisma generate
npx prisma db push
npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Admin Credentials
- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin Email**: `admin@afshangiftcentre.com`
- **Default Password**: `admin123`

---

## 📦 Production Deployment

### Build Command
```bash
npm run build
npm start
```
*Successfully compiled with 29 production routes and 0 errors.*
