const mongoose = require("mongoose");

// Define the schema (structure) of a Job record
const jobSchema = new mongoose.Schema({
  email: String,
  role: String,
  company: String,
  jobLink: String,
  status: String,
  resumeFileName: String, // Store only the filename
  notes: String,
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

// Export the model so it can be used elsewhere
module.exports = mongoose.model("Job", jobSchema);
