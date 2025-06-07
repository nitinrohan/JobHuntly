// Wait for the DOM to fully load before running scripts
document.addEventListener("DOMContentLoaded", function () {
  const themeDropdown = document.getElementById("themeDropdown");
  const body = document.body;
  const themes = ["naruto-theme", "onepiece-theme", "demonslayer-theme"];

  // === THEME PERSISTENCE ===
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

  // === FETCH AND DISPLAY JOBS ===
  fetch("http://localhost:5050/api/jobs")
    .then((res) => res.json())
    .then((jobs) => {
      populateTable(jobs);
      renderChart(jobs, "pie"); // Default to pie chart
    });
  document.getElementById("filterDate").addEventListener("change", function () {
    const selected = this.value;
    fetch("http://localhost:5050/api/jobs")
      .then((res) => res.json())
      .then((jobs) => {
        const filtered = jobs.filter((job) => {
          const jobDate = new Date(job.dateAdded).toISOString().split("T")[0];
          return jobDate === selected;
        });
        populateTable(filtered);
        renderChart(filtered, document.getElementById("chartType").value);
      });
  });

  // === POPULATE TABLE ===
  function populateTable(jobs) {
    const tbody = document.querySelector("#jobTable tbody");
    tbody.innerHTML = "";

    jobs.forEach((job, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${job.email}</td>
        <td>${job.role}</td>
        <td>${job.company}</td>
        <td>${job.status}</td>
        <td>${job.notes || "-"}</td>
        <td>${
          job.resumeFileName
            ? `<a href="/uploads/${job.resumeFileName}" target="_blank">View</a>`
            : "-"
        }</td>
        <td>${
          job.jobLink
            ? `<a href="${job.jobLink}" target="_blank">Link</a>`
            : "-"
        }</td>
        <td>${new Date(job.dateAdded).toLocaleDateString()}</td>
        <td>
          <button class="delete-btn" data-id="${job._id}">❌</button>
          <button class="edit-btn" data-id="${job._id}">✏️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = btn.dataset.id;
        fetch(`http://localhost:5050/api/jobs/${id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then(() => {
            alert("Job deleted.");
            location.reload();
          });
      });
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = btn.dataset.id;
        fetch(`http://localhost:5050/api/jobs/${id}`)
          .then((res) => res.json())
          .then((job) => {
            localStorage.setItem("editJobId", id);
            localStorage.setItem("editJobData", JSON.stringify(job));
            window.location.href = "index.html";
          });
      });
    });
  }

  // === CHART HANDLING ===
  const chartCanvas = document.getElementById("jobChart");
  let currentChart;

  function renderChart(jobs, type) {
    const statusCounts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    if (currentChart) currentChart.destroy();

    currentChart = new Chart(chartCanvas, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: "Job Status Count",
            data: data,
            backgroundColor: ["#ffa600", "#003f5c", "#7a5195", "#ef5675"],
          },
        ],
      },
    });
  }

  // Chart switch buttons
  document.getElementById("chartType").addEventListener("change", function () {
    renderChartFromSelection();
  });

  function renderChartFromSelection() {
    const selectedType = document.getElementById("chartType").value;
    fetch("http://localhost:5050/api/jobs")
      .then((res) => res.json())
      .then((jobs) => {
        renderChart(jobs, selectedType);
      });
  }
});

// csv export functionality
document.getElementById("exportBtn").addEventListener("click", () => {
  fetch("http://localhost:5050/api/jobs")
    .then((res) => res.json())
    .then((jobs) => {
      const csvRows = [
        ["Email", "Role", "Company", "Status", "Notes", "Resume", "Date Added"],
        ...jobs.map((job) => [
          job.email,
          job.role,
          job.company,
          job.status,
          job.notes?.replace(/[\n\r]+/g, " ") || "",
          `http://localhost:5050/uploads/${job.resumeFileName || ""}`,
          new Date(job.dateAdded).toLocaleString(),
        ]),
      ];

      const csvContent = csvRows
        .map((row) =>
          row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "job_applications.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
});
