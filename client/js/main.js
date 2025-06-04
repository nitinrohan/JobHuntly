document.addEventListener("DOMContentLoaded", function () {
  const themeDropdown = document.getElementById("themeDropdown");
  const body = document.body;
  const themes = ["naruto-theme", "onepiece-theme", "demonslayer-theme"];
  const jobForm = document.getElementById("jobForm");

  const narutoIcon = document.getElementById("naruto-icon");
  const onepieceIcon = document.getElementById("onepiece-icon");
  const demonslayerIcon = document.getElementById("demonslayer-icon");

  function showIcon(theme) {
    [narutoIcon, onepieceIcon, demonslayerIcon].forEach((icon) => {
      icon.classList.add("hidden");
      icon.style.animation = "none";
    });

    if (theme === "naruto-theme") {
      narutoIcon.classList.remove("hidden");
      narutoIcon.style.animation = "shake 0.8s ease 2";
    } else if (theme === "onepiece-theme") {
      onepieceIcon.classList.remove("hidden");
      onepieceIcon.style.animation = "shake 0.8s ease 2";
    } else if (theme === "demonslayer-theme") {
      demonslayerIcon.classList.remove("hidden");
      demonslayerIcon.style.animation = "stab 0.6s ease 2";
    }
  }

  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme && themes.includes(savedTheme)) {
    body.classList.remove(...themes);
    body.classList.add(savedTheme);
    themeDropdown.value = savedTheme;
    showIcon(savedTheme);
  } else {
    showIcon(themeDropdown.value);
  }

  themeDropdown.addEventListener("change", function () {
    const selectedTheme = themeDropdown.value;
    body.classList.remove(...themes);
    body.classList.add(selectedTheme);
    localStorage.setItem("selectedTheme", selectedTheme);
    showIcon(selectedTheme);
  });

  jobForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(jobForm);

    fetch("http://localhost:5050/api/jobs", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        alert("✅ Job application saved successfully!");
        jobForm.reset();
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        console.error("❌ Error submitting form:", error);
        alert("Something went wrong. Please try again.");
      });
  });
});
