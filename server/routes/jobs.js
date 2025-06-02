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

// ✅ GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ dateAdded: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    res.status(500).json({ message: "Failed to fetch jobs." });
  }
});

// ✅ POST new job
router.post("/", upload.single("resume"), async (req, res) => {
  try {
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
    res.status(201).json({ message: "Job added successfully!" });
  } catch (err) {
    console.error("❌ Error saving job:", err);
    res.status(500).json({ message: "Failed to save job." });
  }
});
// DELETE job by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Job.findByIdAndDelete(id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("❌ Error deleting job:", err);
    res.status(500).json({ message: "Failed to delete job." });
  }
});

module.exports = router;
