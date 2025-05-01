/*
 * Admin Reports functionality
 * Handles reports, charts, and productivity data visualization
 */

// Declare axios and Chart if not using modules
//const axios = window.axios; // Assuming axios is loaded globally
//const Chart = window.Chart; // Assuming Chart.js is loaded globally

// DOM Elements
const reportPeriodSelect = document.getElementById("report-period");
const departmentFilterSelect = document.getElementById(
  "report-department-filter"
);
const employeePerformanceChart = document.getElementById(
  "employee-performance-chart"
);
const departmentPerformanceChart = document.getElementById(
  "department-performance-chart"
);
const caseTypeDistributionChart = document.getElementById(
  "case-type-distribution-chart"
);
const resolutionTimeChart = document.getElementById("resolution-time-chart");
const topPerformersTableBody = document.getElementById("top-performers-table-body");

// Reports state
const reportsState = {
  period: "month",
  departmentFilter: "",
  employeePerformance: null,
  departmentPerformance: null,
  caseTypeDistribution: null,
  resolutionTime: null,
  charts: {
    employeePerformance: null,
    departmentPerformance: null,
    caseTypeDistribution: null,
    resolutionTime: null,
  },
};

/**
 * Initialize reports functionality
 */
function initReports() {
  // Set up event listeners
  if (reportPeriodSelect) {
    reportPeriodSelect.addEventListener("change", handlePeriodChange);
  }

  if (departmentFilterSelect) {
    departmentFilterSelect.addEventListener(
      "change",
      handleDepartmentFilterChange
    );
  }

  // Load initial reports data
  loadReportsData("month", "");
}

/**
 * Handle period change
 */
function handlePeriodChange() {
  const period = reportPeriodSelect.value;
  loadReportsData(period, reportsState.departmentFilter);
}

/**
 * Handle department filter change
 */
function handleDepartmentFilterChange() {
  const department = departmentFilterSelect.value;
  loadReportsData(reportsState.period, department);
}

/**
 * Load reports data based on selected period and filters
 * @param {string} period - The selected period (week, month, quarter, year)
 * @param {string} department - The selected department filter
 */
function loadReportsData(period, department) {
  // Update state
  reportsState.period = period;
  reportsState.departmentFilter = department;

  // Show loading state
  showLoadingState();

  // Fetch data from API
  fetchReportsData(period, department)
    .then((data) => {
      // Update state with fetched data
      updateReportsState(data);

      // Update UI
      updateReportsUI();
    })
    .catch((error) => {
      console.error("Error fetching reports data:", error);
      showNotification("Failed to load reports data", "error");
    });
}

/**
 * Show loading state while data is being fetched
 */
function showLoadingState() {
  // Show loading indicators for charts
  if (employeePerformanceChart) {
    employeePerformanceChart.innerHTML =
      '<div class="d-flex justify-content-center align-items-center" style="height: 300px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  }

  if (departmentPerformanceChart) {
    departmentPerformanceChart.innerHTML =
      '<div class="d-flex justify-content-center align-items-center" style="height: 300px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  }

  if (caseTypeDistributionChart) {
    caseTypeDistributionChart.innerHTML =
      '<div class="d-flex justify-content-center align-items-center" style="height: 300px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  }

  if (resolutionTimeChart) {
    resolutionTimeChart.innerHTML =
      '<div class="d-flex justify-content-center align-items-center" style="height: 300px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  }

  // Show loading in top performers table
  if (topPerformersTableBody) {
    topPerformersTableBody.innerHTML =
      '<tr><td colspan="5" class="text-center"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading top performers...</td></tr>';
  }
}

/**
 * Update reports state with fetched data
 * @param {Object} data - The fetched reports data
 */
function updateReportsState(data) {
  reportsState.employeePerformance = data.employeePerformance;
  reportsState.departmentPerformance = data.departmentPerformance;
  reportsState.caseTypeDistribution = data.caseTypeDistribution;
  reportsState.resolutionTime = data.resolutionTime;
  reportsState.topPerformers = data.topPerformers;
}

/**
 * Update reports UI with current state
 */
function updateReportsUI() {
  // Initialize or update charts
  initializeCharts();

  // Update top performers table
  updateTopPerformersTable();
}

/**
 * Initialize or update charts
 */
function initializeCharts() {
  // Clear previous chart instances
  if (reportsState.charts.employeePerformance) {
    reportsState.charts.employeePerformance.destroy();
  }

  if (reportsState.charts.departmentPerformance) {
    reportsState.charts.departmentPerformance.destroy();
  }

  if (reportsState.charts.caseTypeDistribution) {
    reportsState.charts.caseTypeDistribution.destroy();
  }

  if (reportsState.charts.resolutionTime) {
    reportsState.charts.resolutionTime.destroy();
  }

  // Prepare canvas elements
  if (employeePerformanceChart) {
    employeePerformanceChart.innerHTML =
      '<canvas id="employee-performance-canvas"></canvas>';
  }

  if (departmentPerformanceChart) {
    departmentPerformanceChart.innerHTML =
      '<canvas id="department-performance-canvas"></canvas>';
  }

  if (caseTypeDistributionChart) {
    caseTypeDistributionChart.innerHTML =
      '<canvas id="case-type-distribution-canvas"></canvas>';
  }

  if (resolutionTimeChart) {
    resolutionTimeChart.innerHTML =
      '<canvas id="resolution-time-canvas"></canvas>';
  }

  // Initialize employee performance chart (bar chart)
  if (employeePerformanceChart && reportsState.employeePerformance) {
    const ctx = document
      .getElementById("employee-performance-canvas")
      .getContext("2d");
    reportsState.charts.employeePerformance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: reportsState.employeePerformance.labels,
        datasets: [
          {
            label: "Cases Generated",
            data: reportsState.employeePerformance.casesGenerated,
            backgroundColor: "rgba(13, 110, 253, 0.7)",
            borderColor: "rgba(13, 110, 253, 1)",
            borderWidth: 1,
          },
          {
            label: "Cases Resolved",
            data: reportsState.employeePerformance.casesResolved,
            backgroundColor: "rgba(25, 135, 84, 0.7)",
            borderColor: "rgba(25, 135, 84, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Employee Performance",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Cases",
            },
          },
        },
      },
    });
  }

  // Initialize department performance chart (bar chart)
  if (departmentPerformanceChart && reportsState.departmentPerformance) {
    const ctx = document
      .getElementById("department-performance-canvas")
      .getContext("2d");
    reportsState.charts.departmentPerformance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: reportsState.departmentPerformance.labels,
        datasets: [
          {
            label: "Cases Generated",
            data: reportsState.departmentPerformance.casesGenerated,
            backgroundColor: "rgba(13, 110, 253, 0.7)",
            borderColor: "rgba(13, 110, 253, 1)",
            borderWidth: 1,
          },
          {
            label: "Cases Resolved",
            data: reportsState.departmentPerformance.casesResolved,
            backgroundColor: "rgba(25, 135, 84, 0.7)",
            borderColor: "rgba(25, 135, 84, 1)",
            borderWidth: 1,
          },
          {
            label: "Resolution Rate (%)",
            data: reportsState.departmentPerformance.resolutionRate,
            backgroundColor: "rgba(255, 193, 7, 0.7)",
            borderColor: "rgba(255, 193, 7, 1)",
            borderWidth: 1,
            type: "line",
            yAxisID: "percentage",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Department Performance",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Cases",
            },
          },
          percentage: {
            position: "right",
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Resolution Rate (%)",
            },
          },
        },
      },
    });
  }

  // Initialize case type distribution chart (doughnut chart)
  if (caseTypeDistributionChart && reportsState.caseTypeDistribution) {
    const ctx = document
      .getElementById("case-type-distribution-canvas")
      .getContext("2d");
    reportsState.charts.caseTypeDistribution = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: reportsState.caseTypeDistribution.labels,
        datasets: [
          {
            data: reportsState.caseTypeDistribution.values,
            backgroundColor: [
              "rgba(13, 110, 253, 0.7)",
              "rgba(25, 135, 84, 0.7)",
              "rgba(255, 193, 7, 0.7)",
              "rgba(220, 53, 69, 0.7)",
              "rgba(111, 66, 193, 0.7)",
              "rgba(253, 126, 20, 0.7)",
            ],
            borderColor: [
              "rgba(13, 110, 253, 1)",
              "rgba(25, 135, 84, 1)",
              "rgba(255, 193, 7, 1)",
              "rgba(220, 53, 69, 1)",
              "rgba(111, 66, 193, 1)",
              "rgba(253, 126, 20, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Case Type Distribution",
          },
        },
      },
    });
  }

  // Initialize resolution time chart (line chart)
  if (resolutionTimeChart && reportsState.resolutionTime) {
    const ctx = document
      .getElementById("resolution-time-canvas")
      .getContext("2d");
    reportsState.charts.resolutionTime = new Chart(ctx, {
      type: "line",
      data: {
        labels: reportsState.resolutionTime.labels,
        datasets: [
          {
            label: "Average Resolution Time (minutes)",
            data: reportsState.resolutionTime.values,
            borderColor: "rgba(13, 110, 253, 1)",
            backgroundColor: "rgba(13, 110, 253, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Average Resolution Time Trend",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Minutes",
            },
          },
        },
      },
    });
  }
}

/**
 * Update top performers table
 */
function updateTopPerformersTable() {
  if (!topPerformersTableBody || !reportsState.topPerformers) {
    return;
  }

  if (reportsState.topPerformers.length === 0) {
    topPerformersTableBody.innerHTML =
      '<tr><td colspan="5" class="text-center">No data available</td></tr>';
    return;
  }

  let tableHTML = "";
  reportsState.topPerformers.forEach((employee, index) => {
    tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="../../src/assets/img/default-avatar.png" alt="${
                          employee.name
                        }" class="employee-avatar me-2">
                        <div>
                            <div class="employee-name">${employee.name}</div>
                            <div class="employee-position">${
                              employee.position
                            }</div>
                        </div>
                    </div>
                </td>
                <td>${employee.department}</td>
                <td>${employee.casesResolved}</td>
                <td>${employee.avgResolutionTime} min</td>
            </tr>
        `;
  });

  topPerformersTableBody.innerHTML = tableHTML;
}

/**
 * Fetch reports data from API
 * @param {string} period - The selected period (week, month, quarter, year)
 * @param {string} department - The selected department filter
 * @returns {Promise} - Promise that resolves with reports data
 */
function fetchReportsData(period, department) {
  const url = `https://api.example.com/reports?period=${period}${
    department ? `&department=${department}` : ""
  }`;

  return axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("API Error:", error);
      // If API fails, return mock data for demonstration
      return getMockReportsData(period, department);
    });
}

/**
 * Get mock reports data for demonstration
 * @param {string} period - The selected period (week, month, quarter, year)
 * @param {string} department - The selected department filter
 * @returns {Object} - Mock reports data
 */
function getMockReportsData(period, department) {
  // Generate different data based on period and department
  let timeLabels;

  switch (period) {
    case "week":
      timeLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      break;
    case "month":
      timeLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      break;
    case "quarter":
      timeLabels = ["Jan", "Feb", "Mar"];
      break;
    case "year":
      timeLabels = ["Q1", "Q2", "Q3", "Q4"];
      break;
    default:
      timeLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  }

  // Filter employees by department if specified
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance"];
  const filteredDepartments = department ? [department] : departments;

  // Generate employee performance data
  const employeeNames = [
    
    
    "EMANUEL KAGASTEN",
    "Jane Smith",
    "Michael Johnson",
    "Emily Williams",
    "David Brown",
    "Sarah Miller",
    "James Wilson",
    "Jennifer Taylor",
  ];

  const employeePerformance = {
    labels: employeeNames,
    casesGenerated: employeeNames.map(
      () => Math.floor(Math.random() * 50) + 10
    ),
    casesResolved: employeeNames.map(() => Math.floor(Math.random() * 40) + 5),
  };

  // Generate department performance data
  const departmentPerformance = {
    labels: filteredDepartments,
    casesGenerated: filteredDepartments.map(
      () => Math.floor(Math.random() * 200) + 50
    ),
    casesResolved: filteredDepartments.map(
      () => Math.floor(Math.random() * 180) + 40
    ),
    resolutionRate: filteredDepartments.map(
      () => Math.floor(Math.random() * 30) + 70
    ), // 70-100%
  };

  // Generate case type distribution data
  const caseTypes = [
    "Technical Issue",
    "Billing Question",
    "Feature Request",
    "Account Access",
    "General Inquiry",
  ];
  const caseTypeDistribution = {
    labels: caseTypes,
    values: caseTypes.map(() => Math.floor(Math.random() * 100) + 20),
  };

  // Generate resolution time data
  const resolutionTime = {
    labels: timeLabels,
    values: timeLabels.map(() => Math.floor(Math.random() * 60) + 30), // 30-90 minutes
  };

  // Generate top performers data
  const positions = [
    "Software Developer",
    "Marketing Manager",
    "Sales Representative",
    "HR Specialist",
    "Financial Analyst",
  ];
  const topPerformers = Array.from({ length: 5 }, (_, i) => {
    const randomDeptIndex = Math.floor(
      Math.random() * filteredDepartments.length
    );
    const randomPosIndex = Math.floor(Math.random() * positions.length);

    return {
      name: employeeNames[i],
      position: positions[randomPosIndex],
      department: filteredDepartments[randomDeptIndex],
      casesResolved: Math.floor(Math.random() * 30) + 20,
      avgResolutionTime: Math.floor(Math.random() * 40) + 20,
    };
  }).sort((a, b) => b.casesResolved - a.casesResolved);

  return {
    employeePerformance,
    departmentPerformance,
    caseTypeDistribution,
    resolutionTime,
    topPerformers,
  };
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info, warning)
 */
function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  notification.style.zIndex = "9999";
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  // Add to document
  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 150);
  }, 5000);
}

// Initialize reports functionality when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initReports);
