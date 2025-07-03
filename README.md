# 🛒 RentBox – Smart Rental E-Commerce Platform

**RentBox** is a full-stack rental-based e-commerce application where users can rent items like books, tools, and gadgets for fixed periods (3, 7, or 30 days). Users can list their own products, book items, leave reviews, and manage rentals in a seamless interface.

---

## 🚀 Tech Stack

### 🔧 Frontend
- React.js (with Hooks & Router)
- Tailwind CSS
- Axios
- `react-datepicker`
- `react-stars` (Rating UI)

### 🔩 Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Auth + bcrypt
- Multer (image uploads)
- `date-fns` (date logic)

### 🧩 Optional Integrations
- Razorpay (Payments)
- Cloudinary (Image Hosting)
- PDFKit (Receipt Generation)

---

## ✨ Core Features

- 🔐 **Authentication**: JWT-based Login/Register with protected routes  
- ➕ **Product Management**: Add / Edit / Delete own listings  
- 🖼️ **Image Uploads** using Multer middleware  
- 📆 **Date-based Rentals**: Book products with rental duration  
- ❌ **Conflict Prevention**: Block overlapping bookings via `date-fns`  
- ⭐ **Review System**: 1 review per user  
- 📊 **Auto-calculated Ratings**  
- 🗂️ **My Listings** & **My Rentals** dashboards  
- 🔍 **Search + Filter**: Category, Rating, Availability  

---

## 🗂️ Folder Structure

```
RentBox/
├── client/                  # Frontend - React
│   ├── public/             
│   │   └── utils/           # Static files (e.g., logo, video)
│   └── src/
│       ├── components/
│       │   ├── Product/     # Product pages (CRUD)
│       │   ├── User/        # Auth handling
│       │   ├── Order/       # Booking logic
│       │   └── Rating/      # Stars + Comments
│       ├── pages/           # Page-level UI composition
│       └── context/         # Global state mgmt (auth, cart, product)
│
└── server/                  # Backend - Node.js
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── index.js
```

---

## 🔁 Backend Logic Summary

- ✅ **JWT Middleware** to protect routes
- ✅ **Role-restricted Product CRUD** (only owner)
- ✅ **Booking Conflict Logic** with `date-fns`
- ✅ **Price Calculation** based on rental duration
- ✅ **Review Enforcement**: One review/user per product
- ✅ **MongoDB Aggregations** for average ratings
- ✅ **My Orders / My Listings** APIs

---

## 📅 14-Day Development Plan

| Day | Task |
|-----|------|
| 1   | React + Express Setup |
| 2   | Authentication |
| 3–4 | Product CRUD + Multer |
| 5   | My Listings Page |
| 6–7 | Rental Logic + Conflict Check |
| 8   | Auto Price Calculation |
| 9   | Rating + Comment System |
| 10  | Average Ratings |
| 11  | Filtering + Search |
| 12  | UI Polish + Responsiveness |
| 13  | Backend Deployment (Render) |
| 14  | Frontend Deployment (Vercel) |

---

## 🎁 Bonus Features (Try Later)

- 🧾 PDF receipts with PDFKit  
- 💳 Razorpay payment gateway  
- 📧 Return reminder emails  
- ☁️ Cloudinary image optimization  
- 💬 Real-time chat (Socket.io)  
- 🛠 Admin panel with analytics  

---

## 🌐 Live Deployment

| Layer     | URL |
|-----------|-----|
| Frontend  | [https://rent-box-rentals.vercel.app/](https://rent-box-rentals.vercel.app/) |
| Backend   | [rentbox-sdvm.onrender.com](https://rentbox-sdvm.onrender.com) |

---

## 👨‍💻 Created By

**Yogesh Pote**  
📬 [yogpote035@gmail.com](mailto:yogpote035@gmail.com)  
🌐 [Portfolio](https://yogpote035.github.io/Portfolio-Website/)  
