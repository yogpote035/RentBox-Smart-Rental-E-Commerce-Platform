# 🛒 RentBox - Rental E-Commerce Platform

RentBox is a full-stack rental-based e-commerce application where users can rent items like books, tools, and gadgets for short periods (3, 7, or 30 days). It supports user-driven listings, real-time booking logic, rating systems, and optional payments.

---

## 🚀 Tech Stack

### 🔧 Frontend

- React.js
- Tailwind CSS
- Axios
- React Router
- react-datepicker
- react-stars

### 🔩 Backend

- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Multer (Image Upload)
- date-fns (Date Logic)

### 🧩 Optional Integrations

- Razorpay (Payments)
- Cloudinary (Image Hosting)
- PDFKit (Receipt Generation)

---

## ✨ Features

- 🔐 **User Authentication** (JWT-based login/register)
- ➕ **Add/Edit/Delete** user-owned product listings
- 🖼️ **Image Upload** (Multer middleware)
- 📆 **Date-based Rental Bookings** with price auto-calculation
- ❌ **Booking Conflict Prevention** (overlap check via `date-fns`)
- 🧾 **My Listings & My Rentals** pages
- ⭐ **Review System** (1 review per user, editable)
- 📊 **Average Rating Display**
- 🔍 **Filtering** (by category, date, or rating)

---

## 🗂️ Project Structure

```
RentBox/
├── client/ Frontend - React
│    ├── public/....
│    │      │   
│    │      ├─── utils/ (images)   
│    │      │   
│    │      └─── styles/(Different file for different pages or components)....
│    │
│    └── src/
│    │   ├── components/....
│    │   │     ├── Product/(CRUD)
│    │   │     ├── User/(AUTH,Token)
│    │   │     ├── Order/[Create , Cancel ,View ]
│    │   │     └── Rating And Comment/[ Rating(Number), Comment]
│    │   ├── pages/(Combine Components)....
│    │   └── context/(Redux Store)....
│    ├── App.jsx
│    ├── App.css
│    ├── index.css
│    └── Main.jsx
│
└── server/ Backend - Node.js
│    ├── controllers/....
│    ├── middleware/....
│    ├── models/....
│    ├── routes/....
│    ├── package.json
│    ├── package-lock.json
│    └── index.js
├── gitignore
└── README.md
```

---

## 🔁 Backend Logic Summary

- **Authentication:** JWT with middleware to protect routes
- **Product CRUD:** Only owner can add/edit/delete their listings
- **Booking Logic:** Prevent overlapping rentals, auto-calculate price
- **Review System:** One review per user per product (editable), avg rating updates
- **User Dashboard:** My Listings and My Rentals views

---

## 📅 14-Day Development Timeline

| Day | Task                            |
| --- | ------------------------------- |
| 1   | Setup React, Express, MongoDB   |
| 2   | Implement authentication        |
| 3-4 | Product CRUD with image upload  |
| 5   | My Listings page                |
| 6-7 | Rent logic + overlap prevention |
| 8   | Price calculation               |
| 9   | Review system                   |
| 10  | Average rating logic            |
| 11  | Filter implementation           |
| 12  | UI polish + responsive design   |
| 13  | Backend deployment (Render)     |
| 14  | Frontend deployment (Vercel)    |

---

## 🎁 Bonus Features (Optional)

- 🧾 PDF Receipt generation with PDFKit
- 💳 Razorpay integration for payments
- 📧 Email reminders for item return
- ☁️ Cloudinary for better image hosting
- 💬 Real-time chat with Socket.io
- 🛠 Admin dashboard (analytics, moderation)

---

## 🌐 Deployment

- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)

---

## 🙌 Contributions

Want to contribute or enhance this project? Fork it, make your changes, and create a pull request!

---

## 📬 Contact

Visit My Portfolio Website [https://yogpote035.github.io/Portfolio-Website/](https://yogpote035.github.io/Portfolio-Website/)

Created with ❤️ by [Yogesh Pote](mailto:yogpote035@gmail.com)  
📞 +91 89993 90368
