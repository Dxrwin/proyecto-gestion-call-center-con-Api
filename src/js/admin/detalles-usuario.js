/*
 * User Details functionality
 * Handles user information display, requests management, and performance charts
 */

// DOM Elements - User Info
const employeeAvatar = document.getElementById("employee-avatar");
const employeeName = document.getElementById("employee-name");
const employeePosition = document.getElementById("employee-position");
const employeeDepartment = document.getElementById("employee-department");
const employeeStatus = document.getElementById("employee-status");
const employeeId = document.getElementById("employee-id");
const employeeHireDate = document.getElementById("employee-hire-date");
const employeeEmail = document.getElementById("employee-email");
const employeePhone = document.getElementById("employee-phone");
const employeeBirthDate = document.getElementById("employee-birth-date");
const employeeAddress = document.getElementById("employee-address");
const employeeEmergencyContact = document.getElementById(
  "employee-emergency-contact"
);
const employeeEmergencyPhone = document.getElementById(
  "employee-emergency-phone"
);
const employeeNotes = document.getElementById("employee-notes");
const employeeSkills = document.getElementById("employee-skills");

// DOM Elements - Requests
const scheduleRequestsTable = document.getElementById(
  "schedule-requests-table"
);
const timeoffRequestsTable = document.getElementById("timeoff-requests-table");

// DOM Elements - Performance
const productivityValue = document.getElementById("productivity-value");
const qualityValue = document.getElementById("quality-value");
const teamworkValue = document.getElementById("teamwork-value");
const performanceChart = document.getElementById("performance-chart");
const tasksChart = document.getElementById("tasks-chart");

// DOM Elements - Navigation
const navLinks = document.querySelectorAll(".nav-link[data-section]");
const sections = document.querySelectorAll(".dashboard-section");
const sectionTitle = document.getElementById("section-title");

// DOM Elements - Modal
const requestActionModalElement = document.getElementById(
  "request-action-modal"
);
const requestActionForm = document.getElementById("request-action-form");
const requestId = document.getElementById("request-id");
const requestType = document.getElementById("request-type");
const requestComments = document.getElementById("request-comments");
const saveRequestAction = document.getElementById("save-request-action");

// DOM Elements - Calendar and Event Scheduling
//const eventCalendar = document.getElementById("event-calendar");
const scheduleEventBtn = document.getElementById("schedule-event-btn");
const scheduleEventModal = document.getElementById("schedule-event-modal");
const scheduleEventForm = document.getElementById("schedule-event-form");
const eventDate = document.getElementById("event-date");
const eventTime = document.getElementById("event-time");
const eventTitle = document.getElementById("event-title");
const eventReason = document.getElementById("event-reason");
const eventType = document.getElementById("event-type");
const eventEmployeeName = document.getElementById("event-employee-name");
const eventEmployeeDepartment = document.getElementById(
  "event-employee-department"
);
const saveEventBtn = document.getElementById("save-event-btn");

// User state
const userState = {
  employee: null,
  scheduleRequests: [],
  timeoffRequests: [],
  performanceData: null,
  events: [], // Array para almacenar eventos agendados
  selectedDate: null, // Fecha seleccionada en el calendario
};

// Importaciones y configuración inicial
document.addEventListener("DOMContentLoaded", () => {
  // Datos del empleado (simulados)
  const mockEmployee = {
    id: 1,
    firstName: "Juan",
    lastName: "Pérez",
    position: "Desarrollador Senior",
    department: "Tecnología",
    status: "Active",
    email: "juan.perez@empresa.com",
    phone: "(555) 123-4567",
    hireDate: "2021-03-15",
    birthDate: "1985-06-22",
    address: "Calle Principal 123, Ciudad",
    emergencyContact: "María Pérez",
    emergencyPhone: "(555) 987-6543",
    notes:
      "Empleado destacado con excelentes habilidades técnicas y de trabajo en equipo.",
    skills: ["JavaScript", "React", "Node.js", "SQL", "Git"],
  };

  // Almacenar datos del empleado en localStorage si no existen
  if (!localStorage.getItem("selectedEmployee")) {
    localStorage.setItem("selectedEmployee", JSON.stringify(mockEmployee));
  }

  // Cargar datos del empleado
  loadEmployeeData();

  // Inicializar navegación
  initNavigation();

  // Inicializar calendarios
  initCalendars();

  // Inicializar gráficos
  initCharts();

  // Configurar eventos para modales
  setupModalEvents();
});

/**
 * Carga los datos del empleado desde localStorage
 */
function loadEmployeeData() {
  const employeeData = localStorage.getItem("selectedEmployee");
  if (!employeeData) {
    window.location.href = "admin.html";
    return;
  }

  const employee = JSON.parse(employeeData);

  // Actualizar información básica
  document.getElementById(
    "employee-name"
  ).textContent = `${employee.firstName} ${employee.lastName}`;
  document.getElementById("employee-position").textContent = employee.position;
  document.getElementById("employee-department").textContent =
    employee.department;

  // Actualizar estado
  const statusElement = document.getElementById("employee-status");
  statusElement.textContent = employee.status;
  statusElement.className = `badge ${
    employee.status === "Active"
      ? "bg-success"
      : employee.status === "Inactive"
      ? "bg-danger"
      : "bg-warning"
  }`;

  // Actualizar información detallada
  document.getElementById("employee-id").textContent = employee.id
    ? `EMP-${employee.id.toString().padStart(3, "0")}`
    : "N/A";
  document.getElementById("employee-hire-date").textContent = formatDate(
    employee.hireDate
  );
  document.getElementById("employee-email").textContent =
    employee.email || "N/A";
  document.getElementById("employee-phone").textContent =
    employee.phone || "N/A";
  document.getElementById("employee-birth-date").textContent = formatDate(
    employee.birthDate
  );
  document.getElementById("employee-address").textContent =
    employee.address || "N/A";
  document.getElementById("employee-emergency-contact").textContent =
    employee.emergencyContact || "N/A";
  document.getElementById("employee-emergency-phone").textContent =
    employee.emergencyPhone || "N/A";
  document.getElementById("employee-notes").textContent =
    employee.notes || "Sin notas";

  // Actualizar habilidades
  const skillsContainer = document.getElementById("employee-skills");
  if (employee.skills && employee.skills.length > 0) {
    const skillsHTML = employee.skills
      .map(
        (skill) => `<span class="badge bg-primary skill-badge">${skill}</span>`
      )
      .join("");
    skillsContainer.innerHTML = skillsHTML;
  } else {
    skillsContainer.innerHTML =
      '<p class="text-muted">No hay habilidades registradas</p>';
  }

  // Cargar datos para las solicitudes y rendimiento
  loadRequestsData(employee);
  loadPerformanceData(employee);
}

/**
 * Carga los datos de solicitudes del empleado
 * @param {Object} employee - Datos del empleado
 */
function loadRequestsData(employee) {
  // Datos de ejemplo para solicitudes de cambio de horario
  const scheduleRequests = [
    {
      id: 1,
      employeeId: employee.id,
      requestDate: "2023-11-15",
      exchangeWith: "Ana García (Marketing Manager)",
      reason: "Cita médica programada para revisión anual",
      status: "Pending",
      createdAt: "2023-11-01T10:30:00Z",
    },
    {
      id: 2,
      employeeId: employee.id,
      requestDate: "2023-11-22",
      exchangeWith: "Roberto López (Financial Analyst)",
      reason: "Evento familiar importante - Aniversario de bodas",
      status: "Approved",
      createdAt: "2023-10-25T14:15:00Z",
      comments:
        "Solicitud aprobada. Favor de coordinar con Roberto para los detalles del intercambio de horario.",
    },
    {
      id: 3,
      employeeId: employee.id,
      requestDate: "2023-12-05",
      exchangeWith: "Sofía Hernández (QA Engineer)",
      reason: "Trámites personales en oficina gubernamental",
      status: "Rejected",
      createdAt: "2023-11-10T09:45:00Z",
      comments:
        "Solicitud rechazada debido a la alta carga de trabajo programada para ese día y la presentación con el cliente.",
    },
  ];

  // Datos de ejemplo para solicitudes de permiso
  const timeoffRequests = [
    {
      id: 1,
      employeeId: employee.id,
      startDate: "2023-11-10",
      endDate: "2023-11-10",
      type: "Personal",
      reason: "Cita médica importante con especialista",
      status: "Pending",
      createdAt: "2023-10-20T11:30:00Z",
    },
    {
      id: 2,
      employeeId: employee.id,
      startDate: "2023-12-15",
      endDate: "2023-12-20",
      type: "Vacaciones",
      reason: "Viaje familiar programado",
      status: "Approved",
      createdAt: "2023-10-05T15:45:00Z",
      comments:
        "Solicitud aprobada. Disfrute sus vacaciones. Por favor asegúrese de completar todas sus tareas pendientes antes de partir.",
    },
    {
      id: 3,
      employeeId: employee.id,
      startDate: "2023-10-30",
      endDate: "2023-10-30",
      type: "Personal",
      reason: "Trámites bancarios urgentes",
      status: "Rejected",
      createdAt: "2023-10-15T08:20:00Z",
      comments:
        "Solicitud rechazada debido a la entrega de proyecto programada para ese día. Por favor reprograme para la próxima semana.",
    },
  ];

  // Actualizar tablas de solicitudes
  updateRequestsTables(scheduleRequests, timeoffRequests);
}

/**
 * Actualiza las tablas de solicitudes con los datos proporcionados
 * @param {Array} scheduleRequests - Solicitudes de cambio de horario
 * @param {Array} timeoffRequests - Solicitudes de permiso
 */
function updateRequestsTables(scheduleRequests, timeoffRequests) {
  const scheduleTable = document.getElementById("schedule-requests-table");
  const timeoffTable = document.getElementById("timeoff-requests-table");

  if (!scheduleTable || !timeoffTable) return;

  // Actualizar tabla de solicitudes de cambio de horario
  if (scheduleRequests.length === 0) {
    scheduleTable.innerHTML =
      '<tr><td colspan="6" class="text-center">No hay solicitudes de cambio de horario</td></tr>';
  } else {
    let scheduleHTML = "";
    scheduleRequests.forEach((request) => {
      scheduleHTML += `
        <tr>
          <td>${request.id}</td>
          <td>${formatDate(request.requestDate)}</td>
          <td>${request.exchangeWith}</td>
          <td>${request.reason}</td>
          <td>
            <span class="badge ${getStatusBadgeClass(request.status)}">
              ${request.status}
            </span>
          </td>
          <td>
            ${
              request.status === "Pending"
                ? `<button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#request-action-modal" 
                    onclick="setRequestData('schedule', ${request.id})">
                    <i class="fas fa-check-circle me-1"></i> Revisar
                  </button>`
                : `<button class="btn btn-sm btn-secondary" disabled>
                    <i class="fas fa-check-circle me-1"></i> Revisado
                  </button>`
            }
          </td>
        </tr>
      `;
    });
    scheduleTable.innerHTML = scheduleHTML;
  }

  // Actualizar tabla de solicitudes de permiso
  if (timeoffRequests.length === 0) {
    timeoffTable.innerHTML =
      '<tr><td colspan="7" class="text-center">No hay solicitudes de permiso</td></tr>';
  } else {
    let timeoffHTML = "";
    timeoffRequests.forEach((request) => {
      timeoffHTML += `
        <tr>
          <td>${request.id}</td>
          <td>${formatDate(request.startDate)}</td>
          <td>${formatDate(request.endDate)}</td>
          <td>${request.type}</td>
          <td>${request.reason}</td>
          <td>
            <span class="badge ${getStatusBadgeClass(request.status)}">
              ${request.status}
            </span>
          </td>
          <td>
            ${
              request.status === "Pending"
                ? `<button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#request-action-modal"
                    onclick="setRequestData('timeoff', ${request.id})">
                    <i class="fas fa-check-circle me-1"></i> Revisar
                  </button>`
                : `<button class="btn btn-sm btn-secondary" disabled>
                    <i class="fas fa-check-circle me-1"></i> Revisado
                  </button>`
            }
          </td>
        </tr>
      `;
    });
    timeoffTable.innerHTML = timeoffHTML;
  }
}

/**
 * Carga los datos de rendimiento del empleado
 * @param {Object} employee - Datos del empleado
 */
function loadPerformanceData(employee) {
  // Datos de ejemplo para rendimiento
  const performanceData = {
    productivity: 85,
    quality: 90,
    teamwork: 80,
    productivityData: {
      monthly: [
        { month: "Enero", casesGenerated: 45, casesResolved: 38 },
        { month: "Febrero", casesGenerated: 52, casesResolved: 47 },
        { month: "Marzo", casesGenerated: 48, casesResolved: 42 },
        { month: "Abril", casesGenerated: 56, casesResolved: 51 },
        { month: "Mayo", casesGenerated: 60, casesResolved: 55 },
        { month: "Junio", casesGenerated: 58, casesResolved: 54 },
      ],
    },
  };

  // Actualizar valores de rendimiento
  document.getElementById(
    "productivity-value"
  ).textContent = `${performanceData.productivity}%`;
  document.getElementById(
    "quality-value"
  ).textContent = `${performanceData.quality}%`;
  document.getElementById(
    "teamwork-value"
  ).textContent = `${performanceData.teamwork}%`;

  // Inicializar gráfico de rendimiento
  initPerformanceChart(performanceData.productivityData.monthly);
}

/**
 * Inicializa los calendarios (en la tarjeta y en el modal)
 */
//abrir el modal dinamicamente

function initCalendars() {
  // Inicializar calendario en el modal
  const eventCalendar = document.getElementById("event-date");
  if (eventCalendar) {
    flatpickr(eventCalendar, {
      inline: true,
      locale: flatpickr.l10ns.es,
      dateFormat: "Y-m-d",
      minDate: "today",
      disableMobile: true,
    });
  }
}
document
  .getElementById("schedule-event-btn")
  .addEventListener("show.bs.modal", () => {
    initCalendars();
  });

/**
 * Inicializa los gráficos
 */
function initCharts() {
  // El gráfico de rendimiento se inicializa cuando se cargan los datos de rendimiento
}

/**
 * Inicializa el gráfico de rendimiento
 * @param {Array} data - Datos para el gráfico
 */
function initPerformanceChart(data) {
  const ctx = document.getElementById("performance-chart");
  if (!ctx) return;

  // Destruir gráfico existente si existe
  if (window.performanceChart) {
    window.performanceChart.destroy();
  }

  // Crear nuevo gráfico
  window.performanceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((item) => item.month),
      datasets: [
        {
          label: "Casos Generados",
          data: data.map((item) => item.casesGenerated),
          backgroundColor: "rgba(13, 110, 253, 0.7)",
          borderColor: "rgba(13, 110, 253, 1)",
          borderWidth: 1,
        },
        {
          label: "Casos Resueltos",
          data: data.map((item) => item.casesResolved),
          backgroundColor: "rgba(25, 135, 84, 0.7)",
          borderColor: "rgba(25, 135, 84, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Casos Generados vs Resueltos",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

/**
 * Configura los eventos para los modales
 */
function setupModalEvents() {
  // Modal de acción de solicitud
  const saveRequestAction = document.getElementById("save-request-action");
  if (saveRequestAction) {
    saveRequestAction.addEventListener("click", handleRequestAction);
  }

  // Modal de programación de evento
  const scheduleEventBtn = document.getElementById("schedule-event-btn");
  if (scheduleEventBtn) {
    scheduleEventBtn.addEventListener("click", () => {
      const employee = JSON.parse(localStorage.getItem("selectedEmployee"));
      if (employee) {
        document.getElementById(
          "event-employee-name"
        ).textContent = `${employee.firstName} ${employee.lastName}`;
        document.getElementById("event-employee-department").textContent =
          employee.department;
      }

      // Establecer hora predeterminada
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes() >= 30 ? 30 : 0;
      document.getElementById("event-time").value = `${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    });
  }

  const saveEventBtn = document.getElementById("save-event-btn");
  if (saveEventBtn) {
    saveEventBtn.addEventListener("click", saveEvent);
  }
}

/**
 * Establece los datos de la solicitud para el modal de acción
 * @param {string} type - Tipo de solicitud (schedule o timeoff)
 * @param {number} id - ID de la solicitud
 */
function setRequestData(type, id) {
  document.getElementById("request-id").value = id;
  document.getElementById("request-type").value = type;

  // Actualizar título del modal
  const modalTitle = document.getElementById("request-action-modal-label");
  modalTitle.textContent =
    type === "schedule"
      ? "Revisar Solicitud de Cambio de Horario"
      : "Revisar Solicitud de Permiso";
}

/**
 * Maneja la acción de la solicitud (aprobar/rechazar)
 */
function handleRequestAction() {
  const id = Number.parseInt(document.getElementById("request-id").value);
  const type = document.getElementById("request-type").value;
  const status = document.querySelector(
    'input[name="request-status"]:checked'
  ).value;
  const comments = document.getElementById("request-comments").value;

  // Aquí se actualizaría la solicitud en la base de datos
  // Para este ejemplo, solo mostramos una notificación
  showNotification(
    `Solicitud ${
      status === "approved" ? "aprobada" : "rechazada"
    } exitosamente`,
    "success"
  );
}

/**
 * Guarda un evento programado
 */
function saveEvent() {
  const eventTitle = document.getElementById("event-title").value;
  const eventDate = document.getElementById("event-date").value;
  const eventTime = document.getElementById("event-time").value;

  // Aquí se guardaría el evento en la base de datos
  // Para este ejemplo, solo mostramos una notificación
  showNotification(
    `Evento "${eventTitle}" agendado exitosamente para ${eventDate} a las ${eventTime}`,
    "success"
  );
}

/**
 * Muestra una notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, warning, danger, info)
 */
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  notification.style.zIndex = "9999";
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 150);
  }, 5000);
}

/**
 * Formatea una fecha para mostrarla
 * @param {string} dateStr - Cadena de fecha (YYYY-MM-DD)
 * @returns {string} - Fecha formateada
 */
function formatDate(dateStr) {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Obtiene la clase CSS para el badge de estado
 * @param {string} status - Estado de la solicitud
 * @returns {string} - Clase CSS
 */
function getStatusBadgeClass(status) {
  switch (status) {
    case "Approved":
      return "bg-success";
    case "Rejected":
      return "bg-danger";
    case "Pending":
      return "bg-warning";
    default:
      return "bg-secondary";
  }
}

// Hacer funciones disponibles globalmente
window.setRequestData = setRequestData;
window.handleRequestAction = handleRequestAction;
window.saveEvent = saveEvent;
