document.addEventListener("DOMContentLoaded", function () {
  const themeDropdown = document.getElementById("themeDropdown");
  const body = document.body;
  const themes = ["naruto-theme", "onepiece-theme", "demonslayer-theme"];
  const chartCanvas = document.getElementById("jobChart");
  const calendarFilter = document.getElementById("calendarFilter");
  let currentChart;

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

  // Fetch and render jobs
  fetch("http://localhost:5050/api/jobs")
    .then((res) => res.json())
    .then((jobs) => {
      jobs.sort(
        (a, b) => new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0)
      );
      populateTable(jobs);
      renderChart(jobs, "pie");
    });

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
        <td><a href="/uploads/${
          job.resumeFileName || ""
        }" target="_blank">View</a></td>
        <td>${
          job.jobLink
            ? `<a href="${job.jobLink}" target="_blank">Link</a>`
            : "-"
        }</td>
        <td>${new Date(job.dateAdded).toLocaleDateString()}</td>
        <td>
          <button class="delete-btn" data-id="${job._id}">❌</button>
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
  }

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

  document.getElementById("chartType").addEventListener("change", function () {
    renderChartFromSelection();
  });

  function renderChartFromSelection() {
    const selectedType = document.getElementById("chartType").value;
    fetch("http://localhost:5050/api/jobs")
      .then((res) => res.json())
      .then((jobs) => {
        jobs.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        renderChart(jobs, selectedType);
      });
  }

  // Calendar filter by date
  calendarFilter?.addEventListener("change", () => {
    const selectedDate = calendarFilter.value;
    fetch("http://localhost:5050/api/jobs")
      .then((res) => res.json())
      .then((jobs) => {
        const filtered = jobs.filter((job) => {
          return (
            new Date(job.dateAdded).toISOString().split("T")[0] === selectedDate
          );
        });
        populateTable(filtered);
        renderChart(filtered, document.getElementById("chartType").value);
      });
  });
});

// Export all jobs to CSV
document.getElementById("exportBtn").addEventListener("click", () => {
  fetch("http://localhost:5050/api/jobs")
    .then((res) => res.json())
    .then((jobs) => {
      const csvRows = [
        [
          "S.No",
          "Email",
          "Role",
          "Company",
          "Status",
          "Notes",
          "Resume",
          "Link",
          "Date Added",
        ],
        ...jobs.map((job, index) => [
          index + 1,
          job.email,
          job.role,
          job.company,
          job.status,
          job.notes?.replace(/[\n\r]+/g, " ") || "",
          `http://localhost:5050/uploads/${job.resumeFileName || ""}`,
          job.jobLink || "-",
          new Date(job.dateAdded).toLocaleDateString(),
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
