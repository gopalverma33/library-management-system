const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Allowed origins can be configured from env as comma-separated values.
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  "https://library-management-system-3-p9wr.onrender.com")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// ✅ CORS Configuration (ONLY ONCE)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.includes("vercel.app")  // ✅ allow all vercel deployments

    ) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// ✅ Handle Preflight Requests
app.options("*", cors({
  origin: true,
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
const users = require("./routes/user.js");
const books = require("./routes/books.js");
const admin = require("./routes/admin.js");
const librarian = require("./routes/librarian.js");
const home = require("./routes/home.js");
const transactionRoutes = require("./routes/transactionRoutes");
const membershipRoutes = require("./routes/membershipRoutes");

app.use("/membership", membershipRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users", users);
app.use("/books", books);
app.use("/admin", admin);
app.use("/librarian", librarian);
app.use("/home", home);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Server + DB Connection
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

app.listen(PORT, async () => {
  try {
    console.log(`Server running on port ${PORT}`);
    await mongoose.connect(uri);
    console.log("✅ DB Connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
  }
});
