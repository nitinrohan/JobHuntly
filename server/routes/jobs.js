const express = require("express");
const multer = require("multer");
const Job = require("/Users/rohanb/job_application_tracker/server/models/job.js");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    console.log("📥 Incoming POST /api/jobs");
    console.log("🧾 Form Data:", req.body);
    console.log("📎 Uploaded File:", req.file);

    const { email, role, company, jobLink, status, notes } = req.body;

    const job = new Job({
      email,
      role,
      company,
      jobLink,
      status,
      notes,
      resumeFileName: req.file ? req.file.filename : null,
    });

    await job.save();

    console.log("✅ Job saved to MongoDB");
    res.status(201).json({ message: "Job added successfully!" });
  } catch (err) {
    console.error("❌ Error saving job:", err);
    res.status(500).json({ message: "Failed to save job." });
  }
});

module.exports = router; // ✅ Don't forget this!
