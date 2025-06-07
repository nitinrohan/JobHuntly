// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // ✅ Allow all origins (for now)
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // For resume files, if used

// ========== MONGO DB CONNECTION ==========
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ========== ROUTES ==========
const jobsRoute = require("./routes/jobs");
app.use("/api/jobs", jobsRoute);

// ========== TEST ROUTE (optional) ==========
app.get("/", (req, res) => {
  res.send("✅ JobHuntly Backend is running.");
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
