# Library Management System (MERN)

A full-stack Library Management System built with MongoDB, Express, React (Vite), and Node.js.  
The application supports role-based workflows for admin, librarian, and student users with features like book management, issue/return flow, membership handling, and fine tracking.

## Live Demo

- Frontend: [library-management-app-gopal.vercel.app](https://library-management-app-gopal.vercel.app/)

## Features

- Role-based authentication and authorization (Admin / Librarian / Student)
- Book catalog management with image upload support
- Issue and return request workflow
- Membership creation, extension, and validation
- Late return fine calculation
- Dashboard and analytics modules for management roles

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Bootstrap, React Toastify
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, Nodemailer
- **Database:** MongoDB
- **Media:** Cloudinary + Multer

## Project Structure

```text
erp-library-management-main/
├── backend/
│   ├── index.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── frontend/
    ├── src/
    ├── public/
    └── vite.config.js
```

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or compatible npm bundled with your Node.js version)
- MongoDB connection string (local or Atlas)
- Cloudinary credentials (for image upload)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd erp-library-management-main
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Variables

Create a `.env` file in both `backend` and `frontend`.

### `backend/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

ALLOWED_ORIGINS=http://localhost:5173
```

### `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Run Locally

Open two terminals:

1. **Start backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend**
   ```bash
   cd frontend
   npm run dev
   ```

Then open `http://localhost:5173`.

## Available Scripts

### Backend (`backend/package.json`)

- `npm run dev` - start backend with nodemon
- `npm start` - start backend with node

### Frontend (`frontend/package.json`)

- `npm run dev` - start Vite development server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## API Route Prefixes

Backend route groups in `backend/index.js`:

- `/users`
- `/books`
- `/admin`
- `/librarian`
- `/membership`
- `/transactions`
- `/home`

## Deployment

### Backend Deployment (Render)

1. Push your code to GitHub.
2. Create a new **Web Service** in Render and connect your backend repository.
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add backend environment variables in Render:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `EMAIL_SERVICE`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `CLOUD_NAME`
   - `CLOUD_API_KEY`
   - `CLOUD_API_SECRET`
   - `ALLOWED_ORIGINS` (include your Vercel frontend URL)
5. Deploy and copy the generated backend URL.

### Frontend Deployment (Vercel)

1. Import the project into Vercel from GitHub.
2. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variable:
   - `VITE_BACKEND_URL=https://<your-render-service>.onrender.com`
4. Deploy and copy the frontend URL.
5. Update backend `ALLOWED_ORIGINS` with this frontend URL and redeploy backend if needed.

## Screenshots

Add project screenshots in this section to showcase the UI:

```text
- Login page
- Admin dashboard
- Book catalog
- Issue/Return workflow
- Membership management
```

Example markdown:

```md
![Login](./screenshots/login.png)
![Admin Dashboard](./screenshots/admin-dashboard.png)
```

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add: short description of change"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request with a clear description and test notes.

## Notes

- Keep `.env` files private (do not commit secrets).
- Update `ALLOWED_ORIGINS` in backend `.env` when deploying new frontend URLs.

## License

This project is provided for educational use.
