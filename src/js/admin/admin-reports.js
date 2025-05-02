
/*
 * Admin Reports functionality
 * Handles reports, charts, and productivity data visualization
 */


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

// Estado de los informes
const reportsState = {
  // Periodo seleccionado para los informes
  period: "month",
  // Filtro de departamento seleccionado
  departmentFilter: "",
  // Datos de rendimiento de los empleados
  employeePerformance: null,
  // Datos de rendimiento de los departamentos
  departmentPerformance: null,
  // Distribución de tipos de casos
  caseTypeDistribution: null,
  // Tiempo de resolución
  resolutionTime: null,
  // Gráficos de los informes
  charts: {
    // Gráfico de rendimiento de los empleados
    employeePerformance: null,
    // Gráfico de rendimiento de los departamentos
    departmentPerformance: null,
    // Gráfico de distribución de tipos de casos
    caseTypeDistribution: null,
    // Gráfico de tiempo de resolución
    resolutionTime: null,
  },
};

/**
 * Inicializa la funcionalidad de los informes
 * Esta función se encarga de configurar los listeners de eventos para los selectores de período y filtro de departamento,
 * y de cargar los datos iniciales de los informes.
 */
function initReports() {
  // Configura los listeners de eventos para el selector de período de los informes
  if (reportPeriodSelect) {
    reportPeriodSelect.addEventListener("change", handlePeriodChange);
  }

  // Configura los listeners de eventos para el selector de filtro de departamento
  if (departmentFilterSelect) {
    departmentFilterSelect.addEventListener(
      "change",
      handleDepartmentFilterChange
    );
  }

  // Carga los datos iniciales de los informes con el período predeterminado (mes) y sin filtro de departamento
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
 * Maneja el cambio en el filtro de departamento
 * Esta función se encarga de obtener el valor seleccionado del filtro de departamento y llamar a la función loadReportsData
 * para cargar los datos de los informes basados en el período actual y el nuevo filtro de departamento.
 */
function handleDepartmentFilterChange() {
  // Obtener el valor seleccionado del filtro de departamento
  const department = departmentFilterSelect.value;
  // Cargar los datos de los informes con el período actual y el nuevo filtro de departamento
  loadReportsData(reportsState.period, department);
}

/**
 * Carga los datos de los informes basados en el período y los filtros seleccionados
 * @param {string} period - El período seleccionado (semana, mes, trimestre, año)
 * @param {string} department - El filtro de departamento seleccionado
 */
function loadReportsData(period, department) {
  // Actualiza el estado
  reportsState.period = period;
  reportsState.departmentFilter = department;

  // Muestra el estado de carga
  showLoadingState();

  // Obtiene los datos de la API
  fetchReportsData(period, department)
    .then((data) => {
      // Actualiza el estado con los datos obtenidos
      updateReportsState(data);

      // Actualiza la interfaz de usuario
      updateReportsUI();
    })
    .catch((error) => {
      console.error("Error al obtener los datos de los informes:", error);
      showNotification("Error al cargar los datos de los informes", "error");
    });
}

/**
 * Muestra el estado de carga mientras se obtienen los datos
 */
function showLoadingState() {
  // Muestra los indicadores de carga para los gráficos
  if (employeePerformanceChart) {
    employeePerformanceChart.innerHTML =
      '<div class="d-flex justify-content-center align-items-center" style="height: 300px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
  }

  if (departmentPerformanceChart) {
    departmentPerformanceChart.innerHTML =
      '<div class="d-flex justify-content-center align-items-center" style="height: 300px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
  }

  if (caseTypeDistributionChart) {
    caseTypeDistributionChart.innerHTML =
      '<div class="d-flex justify-content-center align-items-center" style="height: 300px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
  }

  if (resolutionTimeChart) {
    resolutionTimeChart.innerHTML =
      '<div class="d-flex justify-content-center align-items-center" style="height: 300px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
  }

  // Muestra la carga en la tabla de mejores rendimientos
  if (topPerformersTableBody) {
    topPerformersTableBody.innerHTML =
      '<tr><td colspan="5" class="text-center"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando mejores rendimientos...</td></tr>';
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
 * Inicializa o actualiza los gráficos
 * Esta función se encarga de limpiar los gráficos previos, preparar los elementos canvas
 * y crear nuevos gráficos basados en los datos actuales de los informes.
 */
function initializeCharts() {
  // Limpia las instancias de gráficos previas
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

  // Prepara los elementos canvas para los gráficos
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

  // Inicializa el gráfico de rendimiento del empleado (gráfico de barras)
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
            label: "Casos Generados",
            data: reportsState.employeePerformance.casesGenerated,
            backgroundColor: "rgba(13, 110, 253, 0.7)",
            borderColor: "rgba(13, 110, 253, 1)",
            borderWidth: 1,
          },
          {
            label: "Casos Resueltos",
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
            text: "Rendimiento del Empleado",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Número de Casos",
            },
          },
        },
      },
    });
  }

  // Inicializa el gráfico de rendimiento del departamento (gráfico de barras)
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
            label: "Casos Generados",
            data: reportsState.departmentPerformance.casesGenerated,
            backgroundColor: "rgba(13, 110, 253, 0.7)",
            borderColor: "rgba(13, 110, 253, 1)",
            borderWidth: 1,
          },
          {
            label: "Casos Resueltos",
            data: reportsState.departmentPerformance.casesResolved,
            backgroundColor: "rgba(25, 135, 84, 0.7)",
            borderColor: "rgba(25, 135, 84, 1)",
            borderWidth: 1,
          },
          {
            label: "Tasa de Resolución (%)",
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
            text: "Rendimiento del Departamento",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Número de Casos",
            },
          },
          percentage: {
            position: "right",
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Tasa de Resolución (%)",
            },
          },
        },
      },
    });
  }

  // Inicializa el gráfico de distribución de tipos de casos (gráfico de rosquilla)
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
            text: "Distribución de Tipos de Casos",
          },
        },
      },
    });
  }

  // Inicializa el gráfico de tiempo de resolución (gráfico de línea)
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
            label: "Tiempo de Resolución Promedio (minutos)",
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
            text: "Tendencia del Tiempo de Resolución",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Minutos",
            },
          },
        },
      },
    });
  }
}

/**
 * Actualiza la tabla de los mejores rendimientos
 * Esta función se encarga de actualizar la tabla de los mejores rendimientos con los datos actuales.
 * Si no hay datos disponibles, muestra un mensaje indicando que no hay datos disponibles.
 */
function updateTopPerformersTable() {
  // Verifica si el cuerpo de la tabla y los datos de los mejores rendimientos están disponibles
  if (!topPerformersTableBody || !reportsState.topPerformers) {
    return;
  }

  // Si no hay empleados en la lista de mejores rendimientos, muestra un mensaje de no hay datos disponibles
  if (reportsState.topPerformers.length === 0) {
    topPerformersTableBody.innerHTML =
      '<tr><td colspan="5" class="text-center">No data available</td></tr>';
    return;
  }

  // Inicializa una variable para construir el HTML de la tabla
  let tableHTML = "";
  // Itera sobre la lista de empleados para construir las filas de la tabla
  reportsState.topPerformers.forEach((employee, index) => {
    // Construye el HTML para cada fila de la tabla
    tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="/src/assets/img/avatarimage.png" alt="${employee.name}" class="employee-avatar me-2">
                        <div>
                            <div class="employee-name">${employee.name}</div>
                            <div class="employee-position">${employee.position}</div>
                        </div>
                    </div>
                </td>
                <td>${employee.department}</td>
                <td>${employee.casesResolved}</td>
                <td>${employee.avgResolutionTime} min</td>
            </tr>
        `;
  });

  // Asigna el HTML construido al cuerpo de la tabla
  topPerformersTableBody.innerHTML = tableHTML;
}

// Genera comentarios con detalles en base a esta funcion
/**
 * Obtener datos de informes de la API
 * Esta función se encarga de obtener los datos de los informes de la API basándose en el período y el departamento seleccionados.
 * @param {string} period - El período seleccionado (semana, mes, trimestre, año)
 * @param {string} department - El filtro de departamento seleccionado
 * @returns {Promise} - Promesa que se resuelve con los datos de los informes
 */
function fetchReportsData(period, department) {
  // Construye la URL de la API con el período y el departamento seleccionados
  const url = `https://api.example.com/reports?period=${period}${
    department ? `&department=${department}` : ""
  }`;

  // Realiza una solicitud GET a la API
  return axios
    .get(url)
    .then((response) => {
      // Devuelve los datos de la respuesta
      return response.data;
    })
    .catch((error) => {
      // Si hay un error en la solicitud, imprime el error en la consola
      console.error("API Error:", error);
      // Si la API falla, devuelve datos simulados para la demostración
      return getMockReportsData(period, department);
    });
}

/**
 * Obtener datos de informes simulados para demostración
 * Esta función se encarga de generar datos de informes simulados para demostración en caso de que la solicitud a la API falle.
 * @param {string} period - El período seleccionado (semana, mes, trimestre, año)
 * @param {string} department - El filtro de departamento seleccionado
 * @returns {Object} - Datos de informes simulados
 */
function getMockReportsData(period, department) {
  // Genera etiquetas de tiempo diferentes basadas en el período y el departamento
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

  // Filtra empleados por departamento si está especificado
  const departments = ["Ventas", "soporte tecnico", "atencion al cliente", "contaduria", "desarrollo"];
  const filteredDepartments = department ? [department] : departments;

  // Genera datos de rendimiento de los empleados
  const employeeNames = [
    "darwin pacheco",
    "luis manotas",
    "luz merys",
    "jude bellingham",
    "josue garrido",
    "Saray garrido",
    "Jhonny walker",
    "luka modric",
  ];

  const employeePerformance = {
    labels: employeeNames,
    casesGenerated: employeeNames.map(
      () => Math.floor(Math.random() * 50) + 10
    ),
    casesResolved: employeeNames.map(() => Math.floor(Math.random() * 40) + 5),
  };

  // Genera datos de rendimiento de los departamentos
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

  // Genera datos de distribución de tipos de casos
  const caseTypes = [
    "Problemas Tecnicos",
    "Preguntas de Facturacion",
    "Solicitud de Funciones",
    "Acceso a la Cuenta",
    "Preguntas Generales",
  ];
  const caseTypeDistribution = {
    labels: caseTypes,
    values: caseTypes.map(() => Math.floor(Math.random() * 100) + 20),
  };

  // Genera datos de tiempo de resolución
  const resolutionTime = {
    labels: timeLabels,
    values: timeLabels.map(() => Math.floor(Math.random() * 60) + 30), // 30-90 minutos
  };

  // Genera datos de los mejores rendimientos
  const positions = [
    "Ventas", 
    "soporte tecnico", 
    "atencion al cliente", 
    "contaduria", 
    "desarrollo"
  ];
  // Esta sección genera un arreglo de los 5 mejores rendimientos, ordenados por el número de casos resueltos.
  // Cada elemento del arreglo representa a un empleado, con sus respectivos datos de rendimiento.
  const topPerformers = Array.from({ length: 5 }, (_, i) => {
    // Selecciona un índice aleatorio para un departamento filtrado.
    const randomDeptIndex = Math.floor(
      Math.random() * filteredDepartments.length
    );
    // Selecciona un índice aleatorio para una posición.
    const randomPosIndex = Math.floor(Math.random() * positions.length);

    // Retorna un objeto que representa a un empleado, con sus datos de rendimiento.
    return {
      name: employeeNames[i], // El nombre del empleado, basado en el índice actual.
      position: positions[randomPosIndex], // La posición del empleado, seleccionada aleatoriamente.
      department: filteredDepartments[randomDeptIndex], // El departamento del empleado, seleccionado aleatoriamente.
      casesResolved: Math.floor(Math.random() * 30) + 20, // El número de casos resueltos, entre 20 y 49.
      avgResolutionTime: Math.floor(Math.random() * 40) + 20, // El tiempo promedio de resolución, entre 20 y 59 minutos.
    };
  }).sort((a, b) => b.casesResolved - a.casesResolved); // Ordena el arreglo de los mejores rendimientos por el número de casos resueltos, de mayor a menor.

  // Retorna un objeto que contiene todos los datos generados para los informes.
  return {
    employeePerformance,
    departmentPerformance,
    caseTypeDistribution,
    resolutionTime,
    topPerformers, // El arreglo de los 5 mejores rendimientos.
  };
  
}
/**
 * Muestra un mensaje de notificación
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - El tipo de notificación (success, error, info, warning)
 */
function showNotification(message, type) {
  // Crea el elemento de notificación
  const notification = document.createElement("div");
  // Establece las clases CSS para el elemento de notificación, incluyendo el tipo de notificación y estilos de posición y visibilidad
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  // Establece el índice z para asegurar que la notificación se muestre encima de otros elementos
  notification.style.zIndex = "9999";
  // Establece el contenido HTML del elemento de notificación, incluyendo el mensaje y un botón de cierre
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  // Agrega el elemento de notificación al documento HTML
  document.body.appendChild(notification);

  // Configura un temporizador para eliminar automáticamente la notificación después de 5 segundos
  setTimeout(() => {
    // Elimina la clase 'show' para ocultar la notificación
    notification.classList.remove("show");
    // Configura un temporizador adicional para eliminar el elemento de notificación después de un breve retraso para asegurar una transición suave
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 150);
  }, 5000);
}

// Inicializa la funcionalidad de los informes cuando el DOM se carga completamente
document.addEventListener("DOMContentLoaded", initReports);
