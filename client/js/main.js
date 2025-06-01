// Wait for the full DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // === THEME DROPDOWN HANDLING ===

  const themeDropdown = document.getElementById("themeDropdown"); // dropdown element
  const body = document.body; // <body> tag to apply theme
  const themes = ["naruto-theme", "onepiece-theme", "demonslayer-theme"]; // all themes

  // Load saved theme from localStorage if available
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme && themes.includes(savedTheme)) {
    body.classList.remove(...themes); // remove any theme already on body
    body.classList.add(savedTheme); // apply saved theme
    themeDropdown.value = savedTheme; // set dropdown value
  }

  // On theme change, update the body class and save selection
  themeDropdown.addEventListener("change", function () {
    body.classList.remove(...themes); // remove all themes
    const selectedTheme = themeDropdown.value; // get new value
    body.classList.add(selectedTheme); // add new theme class
    localStorage.setItem("selectedTheme", selectedTheme); // store it
  });

  // === FORM SUBMISSION HANDLING ===

  const jobForm = document.getElementById("jobForm"); // form element

  // Listen for form submission
  jobForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the page from reloading

    // Create a FormData object to hold all form fields and file
    const formData = new FormData(jobForm); // automatically collects all input fields and the uploaded file

    // Send the form data to the backend using fetch
    fetch("http://localhost:5050/api/jobs", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json(); // Parse the response JSON
      })
      .then((data) => {
        alert("✅ Job application saved successfully!");
        jobForm.reset(); // Clear form after submission
      })
      .catch((error) => {
        console.error("❌ Error submitting form:", error);
        alert("Something went wrong while saving your job. Please try again.");
      });
  });
});
