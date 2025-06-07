// ✅ FINAL main.js — fixed sorting + consistent dateAdded handling

const themeDropdown = document.getElementById("themeDropdown");
const body = document.body;
const themes = ["naruto-theme", "onepiece-theme", "demonslayer-theme"];

// Apply saved theme
const savedTheme = localStorage.getItem("selectedTheme");
if (savedTheme && themes.includes(savedTheme)) {
  body.classList.remove(...themes);
  body.classList.add(savedTheme);
  themeDropdown.value = savedTheme;
}

// Handle theme switching
themeDropdown.addEventListener("change", function () {
  const selectedTheme = themeDropdown.value;
  body.classList.remove(...themes);
  body.classList.add(selectedTheme);
  localStorage.setItem("selectedTheme", selectedTheme);
});

// ✅ Job form handling (no edit)
const jobForm = document.getElementById("jobForm");

jobForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(jobForm);

  // ✅ Ensure dateAdded is always sent in proper ISO format
  const now = new Date();
  const localISO = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString();
  formData.set("dateAdded", localISO);

  fetch("http://localhost:5050/api/jobs", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then(() => {
      alert("✅ Job saved!");
      jobForm.reset();
      window.location.href = "dashboard.html";
    })
    .catch((err) => {
      console.error("❌ Submission failed:", err);
      alert("Something went wrong. Try again.");
    });
});
