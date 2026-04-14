# 📚 Library Management System (MERN Stack)

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-blue)
![Status](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-Educational-lightgrey)

A full-stack Library Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It includes role-based access control, book lifecycle management, membership validation, and automated fine calculation.

---

## 🌐 Live Demo

| Service   | Link |
|----------|------|
| 🎨 Frontend (Vercel) | https://library-management-system-ce9i7n4nb.vercel.app/ |
| ⚙️ Backend API (Render) | https://library-management-system-3-p9wr.onrender.com/ |

> ⚠️ Backend is hosted on Render (free tier), so it may take 30–60 seconds to wake up on the first request.

---

## 🔑 Demo Credentials

| Role       | Email                  | Password   |
|------------|------------------------|------------|
| Admin      | admin@example.com      | admin123   |
| Librarian  | librarian@example.com  | lib123     |
| Student    | student@example.com    | student123 |

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based authorization (Admin, Librarian, Student)
- Protected routes & secure APIs
- Password hashing using bcrypt

---

### 👨‍🎓 Student Features
- Browse and search books with images
- Request book issuance
- Submit return requests
- View due dates and fines
- Personal dashboard with borrowing history

---

### 📚 Librarian Features
- Approve/reject book requests
- Manage issue & return workflow
- Add/Edit/Delete books
- Upload book images using Cloudinary
- Dashboard with analytics

---

### 👨‍💼 Admin Features
- Manage all users
- Assign roles (Admin/Librarian)
- System-wide analytics dashboard

---

### 🪪 Membership System
- Membership creation and renewal
- Expiry validation before issuing books

---

### 🔄 Issue & Return System
- Issue books with due date tracking
- Prevent duplicate issuance
- Return validation and tracking

---

### 💰 Fine Management
- Automatic fine calculation for late returns
- Fine tracking per user

---
## 🛠️ Tech Stack

### Frontend
- React.js (v18)
- React Router v6
- Axios
- React Hook Form
- Context API
- React Toastify
- Bootstrap / CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt.js
- Nodemailer
- Multer + Cloudinary

### Deployment
- Frontend: Vercel  
- Backend: Render  
- Database: MongoDB Atlas  
- Media Storage: Cloudinary  

---


### 📂 Project Structure


LibraryManagement/
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ └── config/
│
├── frontend/
│ ├── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ └── utils/
---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository


git clone https://github.com/gopalverma/Library-Management.git
cd Library-Management

--- 
### 2. Install Dependencies 
#### Backend

bash
cd backend
npm install

#### Frontend

bash
cd frontend
npm install

3️⃣ Environment Variables

🔹 Backend .env

EMAIL_USER=your_email_address

EMAIL_PASS=your_email_password

EMAIL_SERVICE=your_email_service
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
🔹 Frontend .env
VITE_BACKEND_URL=https://your-backend-url.onrender.com

4️⃣ Run the Application
Backend
nodemon index.js
Frontend
npm run dev

## 📡 API Endpoints (Examples) 
### Auth 
- POST /api/users/register
- POST /api/users/login
  
### Books
- GET /api/books
- POST /api/books 
- PUT /api/books/:id
- DELETE /api/books/:id

### Membership
- GET /api/membership/:userId
- PUT /api/membership/extend/:id -
- PUT /api/membership/cancel/:id
- 
 ### Issue/Return 
- POST /api/issue
- POST /api/return ---

## 🧠 Core Logic Example

``js
if (membership.status !== "active" || new Date(membership.endDate) < new Date()) {
  return res.status(400).json({ message: "Membership expired ❌" });
}
