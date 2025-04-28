/**
 * funcionalidades de intercambios
 * Maneja el estado de intercambios, solicitudes y interacciones con la API
 */



const bootstrap = window.bootstrap



// Elementos del DOM
const exchangeStatusToggle = document.getElementById("exchange-status-toggle")
const exchangeStatusText = document.getElementById("exchange-status-text")
const exchangeAvailabilityDetails = document.getElementById("exchange-availability-details")
const availableDates = document.getElementById("available-dates")
const addDateBtn = document.getElementById("add-date-btn")
const addDateModal = new bootstrap.Modal(document.getElementById("add-date-modal"))
const saveDateBtn = document.getElementById("save-date-btn")
const availableDateInput = document.getElementById("available-date")
const exchangeRequestForm = document.getElementById("exchange-request-form")
const exchangeDateInput = document.getElementById("exchange-date")
const exchangeStatusWarning = document.getElementById("exchange-status-warning")
const incomingRequests = document.getElementById("incoming-requests")
const outgoingRequests = document.getElementById("outgoing-requests")

// Estado de intercambios
const exchangeState = {
  isAvailable: false,
  availableDates: [],
  incomingRequests: [],
  outgoingRequests: [],
}

/**
 * Inicializar la funcionalidad de intercambios
 */
function initExchange() {
  // Configurar los event listeners
  exchangeStatusToggle.addEventListener("change", toggleExchangeStatus)
  addDateBtn.addEventListener("click", showAddDateModal)
  saveDateBtn.addEventListener("click", saveAvailableDate)
  exchangeRequestForm.addEventListener("submit", submitExchangeRequest)

  // Cargar datos de intercambio de prueba
  loadMockExchangeData()

  // Actualizar la interfaz con valores iniciales
  updateExchangeUI()

  // Verificar si hay una fecha seleccionada desde el horario
  if (window.scheduleState && window.scheduleState.selectedDate) {
    const selectedDate = window.scheduleState.selectedDate
    exchangeDateInput.value = selectedDate.toISOString().split("T")[0]
  }
}

/**
  * Cambiar el estado de disponibilidad de intercambio
 */
function toggleExchangeStatus() {
  exchangeState.isAvailable = exchangeStatusToggle.checked
  updateExchangeUI()

  // Enviar actualización de estado a la API
  updateExchangeStatusAPI(exchangeState.isAvailable)

  // Show notification based on status
  if (exchangeState.isAvailable) {
    showNotification("Estado de disponibilidad para intercambio activado", "success")
  } else {
    showNotification("Estado de disponibilidad para intercambio desactivado", "info")
  }
}

/**
 * Actualizar la interfaz de intercambio basada en el estado actual
 */
function updateExchangeUI() {
  // Actualizar el toggle y el texto
  exchangeStatusToggle.checked = exchangeState.isAvailable
  exchangeStatusText.textContent = exchangeState.isAvailable
    ? "Disponible para intercambio"
    : "No disponible para intercambio"

  // Mostrar/ocultar detalles de disponibilidad
  if (exchangeAvailabilityDetails) {
    exchangeAvailabilityDetails.style.display = exchangeState.isAvailable ? "block" : "none"
  }

  // Mostrar/ocultar advertencia de estado de intercambio
  if (exchangeStatusWarning) {
    exchangeStatusWarning.style.display = exchangeState.isAvailable ? "none" : "block"
  }

  // Actualizar fechas disponibles
  updateAvailableDatesDisplay()

  // Actualizar tablas de solicitudes
  updateRequestTables()
}

/**
 * Mostrar el modal de añadir fecha
 */
function showAddDateModal() {
  // Resetear el input
  availableDateInput.value = ""

  // Mostrar el modal
  addDateModal.show()
}

/**
 * Guardar una fecha disponible
 */
function saveAvailableDate() {
  const dateStr = availableDateInput.value
  if (!dateStr) {
    showNotification("Por favor seleccione una fecha", "warning")
    return
  }

  // Verificar si la fecha ya existe
  if (exchangeState.availableDates.includes(dateStr)) {
    showNotification("Esta fecha ya está en sus fechas disponibles", "warning")
    return
  }

  // Añadir fecha al estado
  exchangeState.availableDates.push(dateStr)

  // Actualizar la interfaz
  updateAvailableDatesDisplay()

  // Ocultar el modal
  addDateModal.hide()

  // Enviar actualización a la API
  updateAvailableDatesAPI(exchangeState.availableDates)

  // Mostrar notificación
  showNotification("Fecha añadida exitosamente", "success")
}

/**
 * Actualizar la visualización de fechas disponibles
 */
function updateAvailableDatesDisplay() {
  if (!availableDates) return

  if (exchangeState.availableDates.length === 0) {
    availableDates.innerHTML = '<p class="text-muted">No hay fechas añadidas aún</p>'
    return
  }

  let datesHTML = ""
  exchangeState.availableDates.forEach((dateStr) => {
    const formattedDate = formatDateString(dateStr)
    datesHTML += `
            <div class="date-badge">
                ${formattedDate}
                <span class="remove-date" data-date="${dateStr}">×</span>
            </div>
        `
  })

  availableDates.innerHTML = datesHTML

  // Añadir event listeners a los botones de eliminación
  document.querySelectorAll(".remove-date").forEach((btn) => {
    btn.addEventListener("click", function () {
      removeAvailableDate(this.dataset.date)
    })
  })
}

/**
 * Eliminar una fecha disponible
 * @param {string} dateStr - La fecha en formato de cadena a eliminar
 */
function removeAvailableDate(dateStr) {
  // Eliminar fecha del estado
  exchangeState.availableDates = exchangeState.availableDates.filter((date) => date !== dateStr)

  // Actualizar la interfaz
  updateAvailableDatesDisplay()

  // Enviar actualización a la API
  updateAvailableDatesAPI(exchangeState.availableDates)

  // Mostrar notificación
  showNotification("Fecha eliminada", "info")
}

/**
 * Enviar una solicitud de intercambio
 * @param {Event} e - El evento de envío del formulario
 */
function submitExchangeRequest(e) {
  e.preventDefault()

  // Verificar si el estado de intercambio está habilitado
  if (!exchangeState.isAvailable) {
    showNotification(
      "No puede enviar solicitudes de intercambio porque su estado de disponibilidad está desactivado. Por favor, active su disponibilidad primero.",
      "warning",
    )
    return
  }

  // Obtener datos del formulario
  const date = document.getElementById("exchange-date").value
  const employeeId = document.getElementById("exchange-employee").value
  const reason = document.getElementById("exchange-reason").value

  if (!date || !employeeId || !reason) {
    showNotification("Por favor complete todos los campos", "warning")
    return
  }

  // Obtener información del empleado seleccionado
  const employeeSelect = document.getElementById("exchange-employee")
  const selectedEmployee = employeeSelect.options[employeeSelect.selectedIndex].text

  // Crear objeto de solicitud con fecha actual
  const currentDate = new Date()
  const request = {
    id: Date.now(), // Usar timestamp como ID
    date: date,
    employeeId: employeeId,
    employeeName: selectedEmployee,
    reason: reason,
    status: "Pending",
    createdAt: currentDate.toISOString(),
  }

  // Añadir a las solicitudes enviadas
  exchangeState.outgoingRequests.push(request)

  // Actualizar la interfaz
  updateRequestTables()

  // Resetear el formulario
  exchangeRequestForm.reset()

  // Enviar solicitud a la API
  sendExchangeRequestAPI(request)

  // Formatear fecha para mostrar en notificación
  const formattedDate = new Date(date).toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Mostrar notificación con detalles
  showNotification(
    `Solicitud de intercambio enviada correctamente para el ${formattedDate} con ${selectedEmployee}`,
    "success",
  )
}

/**
 * Actualizar tablas de solicitudes
 */
function updateRequestTables() {
  // Actualizar solicitudes recibidas
  if (!incomingRequests) return

  if (exchangeState.incomingRequests.length === 0) {
    incomingRequests.innerHTML = '<tr><td colspan="5" class="text-center">No hay solicitudes recibidas</td></tr>'
  } else {
    let incomingHTML = ""
    exchangeState.incomingRequests.forEach((request) => {
      incomingHTML += `
                <tr>
                    <td>${request.employeeName}</td>
                    <td>${formatDateString(request.date)}</td>
                    <td>${request.reason}</td>
                    <td>
                        <span class="badge ${request.status === "Approved" ? "bg-success" : request.status === "Rejected" ? "bg-danger" : "bg-warning"}">
                            ${request.status}
                        </span>
                    </td>
                    <td>
                        ${
                          request.status === "Pending"
                            ? `
                            <button class="btn btn-sm btn-success me-1" data-request-id="${request.id}" data-action="approve">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" data-request-id="${request.id}" data-action="reject">
                                <i class="fas fa-times"></i>
                            </button>
                        `
                            : ""
                        }
                    </td>
                </tr>
            `
    })

    incomingRequests.innerHTML = incomingHTML

    // Añadir event listeners a los botones de acción
    document.querySelectorAll("[data-action='approve'], [data-action='reject']").forEach((btn) => {
      btn.addEventListener("click", function () {
        const requestId = Number.parseInt(this.dataset.requestId)
        const action = this.dataset.action
        handleRequestAction(requestId, action)
      })
    })
  }

  // Actualizar solicitudes enviadas
  if (!outgoingRequests) return

  if (exchangeState.outgoingRequests.length === 0) {
    outgoingRequests.innerHTML = '<tr><td colspan="5" class="text-center">No hay solicitudes enviadas</td></tr>'
  } else {
    let outgoingHTML = ""
    exchangeState.outgoingRequests.forEach((request) => {
      // Formatear fecha de creación
      const createdAtDate = new Date(request.createdAt)
      const formattedCreatedAt =
        createdAtDate.toLocaleDateString() +
        " " +
        createdAtDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      outgoingHTML += `
                <tr>
                    <td>${request.employeeName}</td>
                    <td>${formatDateString(request.date)}</td>
                    <td>${request.reason}</td>
                    <td>
                        <span class="badge ${request.status === "Approved" ? "bg-success" : request.status === "Rejected" ? "bg-danger" : "bg-warning"}">
                            ${request.status}
                        </span>
                        <div class="text-muted small mt-1">Enviado: ${formattedCreatedAt}</div>
                    </td>
                    <td>
                        ${
                          request.status === "Pending"
                            ? `
                            <button class="btn btn-sm btn-danger" data-request-id="${request.id}" data-action="cancel">
                                <i class="fas fa-trash"></i>
                            </button>
                        `
                            : ""
                        }
                    </td>
                </tr>
            `
    })

    outgoingRequests.innerHTML = outgoingHTML

    // Añadir event listeners a los botones de cancelación
    document.querySelectorAll('[data-action="cancel"]').forEach((btn) => {
      btn.addEventListener("click", function () {
        const requestId = Number.parseInt(this.dataset.requestId)
        cancelExchangeRequest(requestId)
      })
    })
  }
}

/**
 * Manejar la acción de la solicitud (aprobar/rechazar)
 * @param {number} requestId - El ID de la solicitud
 * @param {string} action - La acción a tomar (aprobar/rechazar)
 */
function handleRequestAction(requestId, action) {
  // Encontrar la solicitud
  const requestIndex = exchangeState.incomingRequests.findIndex((req) => req.id === requestId)
  if (requestIndex === -1) {
    return
  }

  // Actualizar el estado de la solicitud
  exchangeState.incomingRequests[requestIndex].status = action === "approve" ? "Approved" : "Rejected"

  // Actualizar la interfaz
  updateRequestTables()

  // Enviar actualización a la API
  updateRequestStatusAPI(requestId, action)

  // Mostrar notificación
  showNotification(`Solicitud ${action === "approve" ? "aprobada" : "rechazada"} exitosamente`, "success")
}

/**
 * Cancelar una solicitud de intercambio
 * @param {number} requestId - El ID de la solicitud
 */
function cancelExchangeRequest(requestId) {
  // Encontrar la solicitud para obtener detalles para la notificación
  const request = exchangeState.outgoingRequests.find((req) => req.id === requestId)

  // Eliminar la solicitud del estado
  exchangeState.outgoingRequests = exchangeState.outgoingRequests.filter((req) => req.id !== requestId)

  // Actualizar la interfaz
  updateRequestTables()

  // Enviar actualización a la API
  cancelRequestAPI(requestId)

  // Mostrar notificación con detalles si la solicitud fue encontrada
  if (request) {
    const formattedDate = new Date(request.date).toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    showNotification(
      `Solicitud de intercambio con ${request.employeeName} para el ${formattedDate} ha sido cancelada`,
      "info",
    )
  } else {
    showNotification("Solicitud cancelada", "info")
  }
}

/**
 * Formatear la fecha en formato de cadena para mostrar
 * @param {string} dateStr - La fecha en formato de cadena (YYYY-MM-DD)
 * @returns {string} - Fecha formateada
 */
function formatDateString(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
}

/**
 * Cargar datos de intercambio de prueba para demostración
 */
function loadMockExchangeData() {
  // Mock available dates
  exchangeState.availableDates = ["2025-04-10", "2025-04-15"]

  // datos de solicitudes recibidas
  exchangeState.incomingRequests = [
    {
      id: 1,
      employeeId: 2,
      employeeName: "luis vangald (UI/UX Designer)",
      date: "2025-04-05",
      reason: "cita medica",
      status: "Pendiente",
      createdAt: "2025-04-01T10:30:00Z",
    },
    {
      id: 2,
      employeeId: 3,
      employeeName: "Carolina villegas",
      date: "2025-04-12",
      reason: "evento familiar",
      status: "Aprobado",
      createdAt: "2025-03-28T14:15:00Z",
    },
  ]

  // datos de solicitudes enviadas
  exchangeState.outgoingRequests = [
    {
      id: 3,
      employeeId: 4,
      employeeName: "David luiz",
      date: "2025-04-08",
      reason: "cita personal",
      status: "Pendiente",
      createdAt: "2025-04-01T09:45:00Z",
    },
  ]
}

/**
 * Llamada a la API para actualizar el estado de intercambio (simulada)
 * @param {boolean} isAvailable - El estado de disponibilidad
 */
function updateExchangeStatusAPI(isAvailable) {
  // Preparar datos para la API
  const apiData = {
    employeeId: "current-user-id", // Esto vendría de la autenticación
    isAvailable: isAvailable,
  }

  console.log("Actualizando estado de disponibilidad:", apiData)

  // Enviar datos usando Axios

  if (typeof axios !== "undefined") {
    axios
      .put("https://api.example.com/exchange/status", apiData)
      .then((response) => {
        console.log("Exchange status updated successfully:", response.data)
      })
      .catch((error) => {
        console.error("Error actualizando el estado de disponibilidad:", error)
        // Guardar solicitudes fallidas para reintentar
        storeFailedRequest("exchange-status", apiData)
      })
  } else {
    console.warn("Axios no está definido. Las llamadas a la API fallarán.")
  }
}

/**
 * Llamada a la API para actualizar las fechas disponibles (simulada)
 * @param {Array} dates - Las fechas disponibles
 */
function updateAvailableDatesAPI(dates) {
  // Preparar datos para la API
  const apiData = {
    employeeId: "current-user-id", // Esto vendría de la autenticación
    availableDates: dates,
  }

  console.log("Actualizando fechas disponibles:", apiData)

  // Enviar datos usando Axios
  // Asegurarse de que axios esté disponible globalmente o importado
  if (typeof axios !== "undefined") {
    axios
      .put("https://api.example.com/exchange/dates", apiData)
      .then((response) => {
        console.log("Available dates updated successfully:", response.data)
      })
      .catch((error) => {
        console.error("Error actualizando las fechas disponibles:", error)
        // Guardar solicitudes fallidas para reintentar
        storeFailedRequest("exchange-dates", apiData)
      })
  } else {
    console.warn("Axios no está definido. Las llamadas a la API fallarán.")
  }
}

/**
 * Llamada a la API para enviar una solicitud de intercambio (simulada)
 * @param {Object} request - La solicitud de intercambio
 */
function sendExchangeRequestAPI(request) {
  // Prepare data for API
  const apiData = {
    fromEmployeeId: "current-user-id", // Esto vendría de la autenticación
    toEmployeeId: request.employeeId,
    date: request.date,
    reason: request.reason,
    requestDate: request.createdAt,
  }

  console.log("Enviando solicitud de intercambio a la API:", apiData)

  // Enviar datos usando Axios
  // Asegurarse de que axios esté disponible globalmente o importado
  if (typeof axios !== "undefined") {
    axios
      .post("https://api.example.com/exchange/requests", apiData)
      .then((response) => {
        console.log("Exchange request sent successfully:", response.data)
      })
      .catch((error) => {
        console.error("Error enviando la solicitud de intercambio:", error)
        // Guardar solicitudes fallidas para reintentar
        storeFailedRequest("exchange-request", apiData)
      })
  } else {
    console.warn("Axios no está definido. Las llamadas a la API fallarán.")
  }
}

/**
 * Llamada a la API para actualizar el estado de la solicitud (simulada)
 * @param {number} requestId - El ID de la solicitud
 * @param {string} action - La acción (aprobar/rechazar)
 */
function updateRequestStatusAPI(requestId, action) {
  // Prepare data for API
  const apiData = {
    requestId: requestId,
    action: action,
    employeeId: "current-user-id", // Esto vendría de la autenticación
    actionDate: new Date().toISOString(),
  }

  console.log("Actualizando estado de solicitud:", apiData)

  // Send data using Axios
  // Asegurarse de que axios esté disponible globalmente o importado
  if (typeof axios !== "undefined") {
    axios
      .put("https://api.example.com/exchange/requests/" + requestId, apiData)
      .then((response) => {
        console.log("Request status updated successfully:", response.data)
      })
      .catch((error) => {
        console.error("Error actualizando el estado de la solicitud:", error)
        // Guardar solicitudes fallidas para reintentar
        storeFailedRequest("exchange-status-update", apiData)
      })
  } else {
    console.warn("Axios no está definido. Las llamadas a la API fallarán.")
  }
}

/**
 * Llamada a la API para cancelar una solicitud (simulada)
 * @param {number} requestId - El ID de la solicitud
 */
function cancelRequestAPI(requestId) {
  // Prepare data for API
  const apiData = {
    requestId: requestId,
    employeeId: "current-user-id", // Esto vendría de la autenticación
    cancelDate: new Date().toISOString(),
  }

  console.log("Cancelando solicitud:", apiData)

  // Send data using Axios
  // Asegurarse de que axios esté disponible globalmente o importado
  if (typeof axios !== "undefined") {
    axios
      .delete("https://api.example.com/exchange/requests/" + requestId, { data: apiData })
      .then((response) => {
        console.log("Request cancelled successfully:", response.data)
      })
      .catch((error) => {
        console.error("Error cancelando la solicitud:", error)
        // Guardar solicitudes fallidas para reintentar
        storeFailedRequest("exchange-cancel", apiData)
      })
  } else {
    console.warn("Axios no está definido. Las llamadas a la API fallarán.")
  }
}

/**
 * Almacenar solicitudes fallidas de API para reintentar más tarde
 * @param {string} type - El tipo de solicitud
 * @param {Object} data - Los datos de la solicitud
 */
function storeFailedRequest(type, data) {
  const failedRequests = JSON.parse(localStorage.getItem("failedRequests") || "[]")
  failedRequests.push({
    type,
    data,
    timestamp: new Date().toISOString(),
  })
  localStorage.setItem("failedRequests", JSON.stringify(failedRequests))
}

/**
 * Mostrar un mensaje de notificación
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - El tipo de notificación (success, error, info, warning)
 */
function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`
  notification.style.zIndex = "9999"
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `

  // Añadir al documento
  document.body.appendChild(notification)

  // Eliminar automáticamente después de 5 segundos
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 150)
  }, 5000)
}

// Inicializar la funcionalidad de intercambio cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", initExchange)

