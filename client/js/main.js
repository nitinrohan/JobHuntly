const themeDropdown = document.getElementById("themeDropdown");
const body = document.body;
const themes = ["naruto-theme", "onepiece-theme", "demonslayer-theme"];

const savedTheme = localStorage.getItem("selectedTheme");
if (savedTheme && themes.includes(savedTheme)) {
  body.classList.remove(...themes);
  body.classList.add(savedTheme);
  themeDropdown.value = savedTheme;
}

themeDropdown.addEventListener("change", function () {
  body.classList.remove(...themes);
  const selectedTheme = themeDropdown.value;
  body.classList.add(selectedTheme);
  localStorage.setItem("selectedTheme", selectedTheme);
});

// Prefill form for editing
const editJobId = localStorage.getItem("editJobId");
const editJobData = localStorage.getItem("editJobData");
const jobForm = document.getElementById("jobForm");
const cancelEditBtn = document.getElementById("cancelEditBtn");

if (editJobId && editJobData) {
  const job = JSON.parse(editJobData);
  jobForm.elements["email"].value = job.email;
  jobForm.elements["role"].value = job.role;
  jobForm.elements["company"].value = job.company;
  jobForm.elements["jobLink"].value = job.jobLink || "";
  jobForm.elements["status"].value = job.status;
  jobForm.elements["notes"].value = job.notes || "";
  jobForm.elements["dateAdded"].value = job.dateAdded
    ? new Date(job.dateAdded).toISOString().split("T")[0]
    : "";
  document.querySelector("h1").textContent = "Update Job Application";
  cancelEditBtn.style.display = "inline-block";
}

// Cancel Edit
cancelEditBtn.addEventListener("click", function () {
  localStorage.removeItem("editJobId");
  localStorage.removeItem("editJobData");
  jobForm.reset();
  cancelEditBtn.style.display = "none";
  document.querySelector("h1").textContent = "Track Your Job Applications";
});

// Submit job
jobForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(jobForm);
  const isEdit = Boolean(editJobId);
  const url = isEdit
    ? `http://localhost:5050/api/jobs/${editJobId}`
    : "http://localhost:5050/api/jobs";
  const method = isEdit ? "PUT" : "POST";

  fetch(url, {
    method,
    body: formData,
  })
    .then((res) => res.json())
    .then(() => {
      alert(isEdit ? "✅ Job updated!" : "✅ Job saved!");
      localStorage.removeItem("editJobId");
      localStorage.removeItem("editJobData");
      jobForm.reset();
      window.location.href = "dashboard.html";
    })
    .catch((err) => {
      console.error("❌ Submission failed:", err);
      alert("Something went wrong. Try again.");
    });
});
