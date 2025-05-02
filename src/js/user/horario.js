/**
 * funcionalidad del horario
 * Maneja la visualización, navegación y detalles de los eventos
 */

// Elementos del DOM
const scheduleBody = document.getElementById("schedule-body");
const currentWeekDisplay = document.getElementById("current-week-display");
const prevWeekBtn = document.getElementById("prev-week-btn");
const nextWeekBtn = document.getElementById("next-week-btn");
const eventDetailsModalElement = document.getElementById("event-details-modal");
const eventDetailsContent = document.getElementById("event-details-content");

// Inicializar el modal de Bootstrap
const eventDetailsModal = new bootstrap.Modal(eventDetailsModalElement);

// Estado del horario
const scheduleState = {
  currentWeekStart: getStartOfWeek(new Date()),
  events: [],
  selectedDate: null,
};

/**
 * Inicializar la funcionalidad del horario
 */
function initSchedule() {
  // Configurar los event listeners
  prevWeekBtn.addEventListener("click", showPreviousWeek);
  nextWeekBtn.addEventListener("click", showNextWeek);

  // Cargar los datos del horario de prueba
  loadMockScheduleData();

  // Generar el horario inicial
  generateSchedule();
}

/**
 * Cargar datos del horario de prueba para demostración
 */
function loadMockScheduleData() {
  //traigo data de la api

  const today = new Date();
  console.log("fecha configurada", today);
  const startOfWeek = getStartOfWeek(today);

  // Crear eventos de prueba
  scheduleState.events = [
    {
      id: 1,
      type: "work",
      title: "turno regular",
      startTime: new Date(startOfWeek.getTime() + 9 * 60 * 60 * 1000), // 9:00 AM Monday
      endTime: new Date(startOfWeek.getTime() + 17 * 60 * 60 * 1000), // 5:00 PM Monday
      description: "turno regular",
    },
    {
      id: 2,
      type: "work",
      title: "turno regular",
      startTime: new Date(
        startOfWeek.getTime() + 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000
      ), // 9:00 AM Tuesday
      endTime: new Date(
        startOfWeek.getTime() + 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      ), // 5:00 PM Tuesday
      description: "turno regular",
    },
    {
      id: 3,
      type: "meeting",
      title: "reunion de equipo",
      startTime: new Date(
        startOfWeek.getTime() + 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000
      ), // 11:00 AM Tuesday
      endTime: new Date(
        startOfWeek.getTime() + 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000
      ), // 12:00 PM Tuesday
      description: "reunion de equipo",
    },
    {
      id: 4,
      type: "work",
      title: "turno regular",
      startTime: new Date(
        startOfWeek.getTime() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000
      ), // 9:00 AM Wednesday
      endTime: new Date(
        startOfWeek.getTime() + 2 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      ), // 5:00 PM Wednesday
      description: "turno regular",
    },
    {
      id: 5,
      type: "work",
      title: "turno regular",
      startTime: new Date(
        startOfWeek.getTime() + 3 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000
      ), // 9:00 AM Thursday
      endTime: new Date(
        startOfWeek.getTime() + 3 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      ), // 5:00 PM Thursday
      description: "Regular work shift",
    },
    {
      id: 6,
      type: "meeting",
      title: "reunion de proyecto",
      startTime: new Date(
        startOfWeek.getTime() + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000
      ), // 2:00 PM Thursday
      endTime: new Date(
        startOfWeek.getTime() + 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000
      ), // 3:00 PM Thursday
      description: "reunion de proyecto",
    },
    {
      id: 7,
      type: "work",
      title: "turno regular",
      startTime: new Date(
        startOfWeek.getTime() + 4 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000
      ), // 9:00 AM Friday
      endTime: new Date(
        startOfWeek.getTime() + 4 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      ), // 5:00 PM Friday
      description: "turno regular",
    },
    {
      id: 8,
      type: "request",
      title: "solicitud de tiempo libre",
      startTime: new Date(
        startOfWeek.getTime() + 4 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000
      ), // 3:00 PM Friday
      endTime: new Date(
        startOfWeek.getTime() + 4 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      ), // 5:00 PM Friday
      description: "solicitud de tiempo libre",
      status: "pendiente",
    },
  ];

  let tipoEvento = scheduleState.events[0].startTime;
  console.log("eventos del horario", scheduleState.events);
  console.log("tipo de eventos del horario = ", typeof tipoEvento === "object");
}

/**
 * Generar el horario para la semana actual
 */
function generateSchedule() {
  // Actualizar la visualización de la semana
  updateWeekDisplay();

  // Limpiar el horario existente
  scheduleBody.innerHTML = "";

  // Generar los slots de tiempo (9 AM a 5 PM)
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(hour);
  }

  // Generar la fila de encabezados con los nombres de los días y las fechas
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = "<th>HORA</th>";

  // Agregar los encabezados de los días con las fechas
  for (let day = 0; day < 5; day++) {
    const date = new Date(scheduleState.currentWeekStart);
    date.setDate(date.getDate() + day);

    const dayName = date.toLocaleDateString([], { weekday: "long" });
    const dateStr = date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });

    const th = document.createElement("th");
    th.className = "day-column";
    th.setAttribute("data-day", day);
    th.setAttribute("data-date", date.toISOString().split("T")[0]); // almacenar la fecha ISO para fácil recuperación
    th.innerHTML = `${dayName}<br><small>${dateStr}</small>`;

    // Agregar el evento de clic para seleccionar este día
    th.addEventListener("click", () => selectDay(date, dayName));

    headerRow.appendChild(th);
  }

  // Agregar la fila de encabezados a la tabla
  const scheduleTable = document.querySelector(".schedule-table thead");
  scheduleTable.innerHTML = "";
  scheduleTable.appendChild(headerRow);

  // Generar las filas para cada slot de tiempo
  timeSlots.forEach((hour) => {
    const row = document.createElement("tr");

    // Agregar la celda de tiempo
    const timeCell = document.createElement("td");
    timeCell.textContent = formatHour(hour);
    row.appendChild(timeCell);

    // Agregar las celdas para cada día (Lunes a Viernes)
    for (let day = 0; day < 5; day++) {
      const date = new Date(scheduleState.currentWeekStart);
      date.setDate(date.getDate() + day);

      const cell = document.createElement("td");
      cell.className = "day-cell";
      cell.setAttribute("data-day", day);
      cell.setAttribute("data-date", date.toISOString().split("T")[0]);
      cell.setAttribute("data-hour", hour);

      // Agregar el evento de clic para seleccionar este día
      cell.addEventListener("click", () =>
        selectDay(date, date.toLocaleDateString([], { weekday: "long" }))
      );

      // Encontrar eventos para este slot de tiempo y día
      const cellEvents = findEventsForTimeSlot(hour, day);

      // Agregar eventos a la celda
      cellEvents.forEach((event) => {
        const eventElement = document.createElement("div");
        eventElement.className = `schedule-event event-${event.type}`;
        eventElement.textContent = event.title;
        eventElement.dataset.eventId = event.id;

        // Agregar el evento de clic para mostrar los detalles
        eventElement.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevenir el disparo del evento de clic de la celda
          showEventDetails(event);
        });

        cell.appendChild(eventElement);
      });

      row.appendChild(cell);
    }

    scheduleBody.appendChild(row);
  });
}

/**
 * Seleccionar un día del horario
 * @param {Date} date - La fecha seleccionada
 * @param {string} dayName - El nombre del día
 */
function selectDay(date, dayName) {
  // Almacenar la fecha seleccionada
  if (!window.scheduleState) {
    window.scheduleState = {};
  }
  window.scheduleState.selectedDate = date;

  // Formatear la fecha para la visualización
  const formattedDate = date.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Resaltar el día seleccionado en el horario
  document.querySelectorAll(".day-column, .day-cell").forEach((cell) => {
    cell.classList.remove("selected-day");

    if (cell.getAttribute("data-date") === date.toISOString().split("T")[0]) {
      cell.classList.add("selected-day");
    }
  });

  // Establecer la fecha en el formulario de intercambio si existe
  const exchangeDateInput = document.getElementById("exchange-date");
  if (exchangeDateInput) {
    exchangeDateInput.value = date.toISOString().split("T")[0];
  }

  // Mostrar la notificación
  showNotification(
    `Has seleccionado ${dayName}, ${formattedDate} para intercambio de horario`,
    "info"
  );

  // Si la sección de intercambio no está activa, cambiar a ella
  const exchangeSection = document.getElementById("exchange-section");
  if (exchangeSection && !exchangeSection.classList.contains("active")) {
    if (typeof showSection === "function") {
      showSection("exchange");
    }
  }
}

/**
 * Encontrar eventos para un slot de tiempo y día específico
 * @param {number} hour - La hora (0-23)
 * @param {number} dayOffset - El desplazamiento del día desde el inicio de la semana (0-4)
 * @returns {Array} - Array de eventos para este slot de tiempo
 */
function findEventsForTimeSlot(hour, dayOffset) {
  const slotStart = new Date(scheduleState.currentWeekStart);
  slotStart.setDate(slotStart.getDate() + dayOffset);
  slotStart.setHours(hour, 0, 0, 0);

  const slotEnd = new Date(slotStart);
  slotEnd.setHours(hour + 1, 0, 0, 0);

  return scheduleState.events.filter((event) => {
    return event.startTime < slotEnd && event.endTime > slotStart;
  });
}

/**
 * Mostrar detalles para un evento específico
 * @param {Object} event - El evento para mostrar los detalles
 */
function showEventDetails(event) {
  // Formatear los detalles del evento
  const startTime = event.startTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = event.endTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = event.startTime.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Establecer el contenido del modal
  eventDetailsContent.innerHTML = `
       <div class="event-details">
           <h4>${event.title}</h4>
           <p class="text-muted">${date}, ${startTime} - ${endTime}</p>
           <div class="mb-3">
               <strong>Type:</strong> 
               <span class="badge ${
                 event.type === "work"
                   ? "bg-success"
                   : event.type === "meeting"
                   ? "bg-primary"
                   : "bg-warning"
               }">
                   ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}
               </span>
           </div>
           <p>${event.description}</p>
           ${
             event.status
               ? `<p><strong>Status:</strong> ${event.status}</p>`
               : ""
           }
       </div>
   `;

  // Mostrar el modal
  eventDetailsModal.show();
}

/**
 * Mostrar el horario de la semana anterior
 */
function showPreviousWeek() {
  // Actualizar la fecha de inicio de la semana actual
  const prevWeek = new Date(scheduleState.currentWeekStart);
  prevWeek.setDate(prevWeek.getDate() - 7);
  scheduleState.currentWeekStart = prevWeek;

  // Regenerar el horario
  generateSchedule();
}

/**
 * Mostrar el horario de la semana siguiente
 */
function showNextWeek() {
  // Actualizar la fecha de inicio de la semana actual
  const nextWeek = new Date(scheduleState.currentWeekStart);
  nextWeek.setDate(nextWeek.getDate() + 7);
  scheduleState.currentWeekStart = nextWeek;

  // Regenerar el horario
  generateSchedule();
}

/**
 * Actualizar la visualización de la semana
 */
function updateWeekDisplay() {
  function updateWeekDisplay() {
    // Obtiene la fecha de inicio de la semana actual desde el estado global
    const weekStart = scheduleState.currentWeekStart;

    // Crea una nueva fecha basada en el inicio de la semana para calcular el final (viernes)
    const weekEnd = new Date(weekStart);
    // Ajusta la fecha sumando 4 días al lunes para obtener el viernes de la misma semana
    weekEnd.setDate(weekEnd.getDate() + 4); // Viernes

    // Formatea la fecha de inicio (lunes) en formato "mes día" (ej: "junio 3")

    const startStr = weekStart.toLocaleDateString([], {
      month: "long",
      day: "numeric",
    });
    // Formatea la fecha de fin (viernes) en formato "mes día, año" (ej: "junio 7, 2024")
    const endStr = weekEnd.toLocaleDateString([], {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Actualiza el texto del elemento en el DOM para mostrar el rango de la semana
    currentWeekDisplay.textContent = `${startStr} - ${endStr}`;
  }
}

// Función para obtener el inicio de la semana (Lunes) para una fecha dada
// @param {Date} date - La fecha
// @returns {Date} - El inicio de la semana
function getStartOfWeek(date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para el domingo
  const monday = new Date(date);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Formatear la hora en formato de 12 horas
 * @param {number} hour - La hora (0-23)
 * @returns {string} - La hora formateada
 */
function formatHour(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:00 ${period}`;
}

/**
 * Mostrar un mensaje de notificación
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - El tipo de notificación (success, error, info, warning)
 */
function showNotification(message, type) {
  // Crear el elemento de notificación
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  notification.style.zIndex = "9999";
  notification.innerHTML = `
       ${message}
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
   `;

  // Agregar al documento
  document.body.appendChild(notification);

  // Eliminar automáticamente después de 5 segundos
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 150);
  }, 5000);
}

// Función dummy para showSection
function showSection(sectionId) {
  console.log(`Cambiando a la sección: ${sectionId}`);
  // Agregar su lógica aquí para mostrar la sección especificada
}

// Hacer la función disponible globalmente
window.selectDay = selectDay;
window.showSection = showSection;

// Inicializar la funcionalidad del horario cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", initSchedule);
