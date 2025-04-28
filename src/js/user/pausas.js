/**
 * Funcionabilidad de Pausas Activas
 * Maneja el temporizador de pausas, el historial de pausas y las interacciones con la API
 */

// Importar Axios (o declararla si ya está disponible globalmente)
const axios = window.axios // Asumiendo que axios está cargado globalmente

// Elementos DOM
const startBreakBtn = document.getElementById("start-break-btn")
const endBreakBtn = document.getElementById("end-break-btn")
const timerDisplay = document.getElementById("timer-display")
const breakHistory = document.getElementById("break-history")
const breakTypeRadios = document.querySelectorAll('input[name="break-type"]')
const shortBreak1Remaining = document.getElementById("short-break-1-remaining")
const shortBreak2Remaining = document.getElementById("short-break-2-remaining")
const lunchBreakRemaining = document.getElementById("lunch-break-remaining")

// Configuración de pausas
const BREAK_TYPES = {
  "short-1": {
    name: "Pausa Corta 1",
    duration: 10 * 60, // 10 minutos en segundos
    available: true,
  },
  "short-2": {
    name: "Pausa Corta 2",
    duration: 10 * 60, // 10 minutos en segundos
    available: true,
  },
  lunch: {
    name: "Pausa Almuerzo",
    duration: 60 * 60, // 60 minutos en segundos
    available: true,
  },
}

const WARNING_THRESHOLD_HALF = 0.5 // 50% del tiempo
const WARNING_THRESHOLD_END = 2 * 60 // 2 minutos restantes

// Estado de pausas
const breakState = {
  isActive: false,
  timeRemaining: 0,
  breakHistory: [],
  currentBreakType: null,
  currentBreakStart: null,
  timerInterval: null,
  halfTimeNotified: false,
  twoMinutesNotified: false,
}

/**
 * Inicializar la funcionalidad de pausas
 */
function initBreaks() {
  // Configurar los listeners de eventos
  startBreakBtn.addEventListener("click", startBreak)
  endBreakBtn.addEventListener("click", endBreak)

  // Cargar el historial de pausas desde localStorage (si está disponible)
  loadBreakHistory()

  // Actualizar la interfaz con los valores iniciales
  updateBreakStatusDisplay()
  formatTimeDisplay(0)
}

/**
 * Iniciar una pausa
 */
function startBreak() {
  if (breakState.isActive) {
    return
  }

  // Obtener el tipo de pausa seleccionado
  let selectedBreakType = null
  for (const radio of breakTypeRadios) {
    if (radio.checked) {
      selectedBreakType = radio.value
      break
    }
  }

  if (!selectedBreakType) {
    showNotification("Por favor seleccione un tipo de pausa", "warning")
    return
  }

  // Verificar si la pausa está disponible
  if (!BREAK_TYPES[selectedBreakType].available) {
    showNotification(`${BREAK_TYPES[selectedBreakType].name} ya ha sido utilizada hoy`, "warning")
    return
  }

  // Establecer la pausa como activa
  breakState.isActive = true
  breakState.currentBreakType = selectedBreakType
  breakState.timeRemaining = BREAK_TYPES[selectedBreakType].duration
  breakState.currentBreakStart = new Date()
  breakState.halfTimeNotified = false
  breakState.twoMinutesNotified = false

  // Actualizar la interfaz
  startBreakBtn.disabled = true
  endBreakBtn.disabled = false

  // Deshabilitar los botones de radio
  breakTypeRadios.forEach((radio) => {
    radio.disabled = true
  })

  // Iniciar el temporizador
  breakState.timerInterval = setInterval(updateBreakTimer, 1000)

  // Mostrar notificación
  showNotification(`${BREAK_TYPES[selectedBreakType].name} iniciada`, "info")
}

/**
 * Terminar una pausa
 */
function endBreak() {
  if (!breakState.isActive) {
    return
  }

  // Limpiar el intervalo del temporizador
  clearInterval(breakState.timerInterval)

  // Calcular la duración real de la pausa
  const endTime = new Date()
  const duration = Math.floor((endTime - breakState.currentBreakStart) / 1000)
  const breakType = breakState.currentBreakType
  const allowedDuration = BREAK_TYPES[breakType].duration

  // Añadir al historial de pausas
  const breakRecord = {
    type: breakType,
    typeName: BREAK_TYPES[breakType].name,
    startTime: breakState.currentBreakStart,
    endTime: endTime,
    duration: duration,
    allowedDuration: allowedDuration,
  }

  breakState.breakHistory.push(breakRecord)

  // Marcar la pausa como utilizada
  BREAK_TYPES[breakType].available = false

  // Restablecer el estado de la pausa
  breakState.isActive = false
  breakState.timeRemaining = 0
  breakState.currentBreakStart = null
  breakState.currentBreakType = null

  // Actualizar la interfaz
  formatTimeDisplay(0)
  startBreakBtn.disabled = false
  endBreakBtn.disabled = true
  updateBreakStatusDisplay()
  updateBreakHistoryDisplay()

  // Habilitar los botones de radio
  breakTypeRadios.forEach((radio) => {
    radio.disabled = false
  })

  // Guardar los datos de la pausa
  saveBreakHistory()

  // Enviar datos de la pausa a la API
  sendBreakDataToAPI(breakRecord)

  // Mostrar notificación
  const percentUsed = Math.round((duration / allowedDuration) * 100)
  showNotification(
    `Pausa terminada. Tiempo utilizado: ${formatDuration(duration)} (${percentUsed}% del tiempo permitido)`,
    "success",
  )
}

/**
 * Actualizar el temporizador de pausas
 */
function updateBreakTimer() {
  if (breakState.timeRemaining <= 0) {
    // El tiempo de la pausa ha terminado
    endBreak()
    return
  }

  // Decrementar el tiempo restante
  breakState.timeRemaining--

  // Formatear y mostrar el tiempo
  formatTimeDisplay(breakState.timeRemaining)

  // Verificar notificación de mitad de tiempo
  const totalDuration = BREAK_TYPES[breakState.currentBreakType].duration
  const halfTime = totalDuration * WARNING_THRESHOLD_HALF

  if (breakState.timeRemaining <= halfTime && !breakState.halfTimeNotified) {
    showNotification("Ha transcurrido la mitad del tiempo de su pausa", "warning")
    breakState.halfTimeNotified = true
  }

  // Verificar notificación de 2 minutos
  if (breakState.timeRemaining <= WARNING_THRESHOLD_END && !breakState.twoMinutesNotified) {
    showNotification("Su pausa termina en 2 minutos", "warning")
    breakState.twoMinutesNotified = true
  }
}

/**
 * Formatear y mostrar el tiempo en formato MM:SS
 * @param {number} seconds - Tiempo en segundos
 */
function formatTimeDisplay(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

/**
 * Actualizar el estado de la pausa
 */
function updateBreakStatusDisplay() {
  // Actualizar los badges de estado
  shortBreak1Remaining.textContent = BREAK_TYPES["short-1"].available ? "Disponible" : "Utilizada"
  shortBreak1Remaining.className = BREAK_TYPES["short-1"].available ? "badge bg-primary" : "badge bg-secondary"

  shortBreak2Remaining.textContent = BREAK_TYPES["short-2"].available ? "Disponible" : "Utilizada"
  shortBreak2Remaining.className = BREAK_TYPES["short-2"].available ? "badge bg-primary" : "badge bg-secondary"

  lunchBreakRemaining.textContent = BREAK_TYPES["lunch"].available ? "Disponible" : "Utilizada"
  lunchBreakRemaining.className = BREAK_TYPES["lunch"].available ? "badge bg-primary" : "badge bg-secondary"
}

/**
 * Actualizar el historial de pausas
 */
function updateBreakHistoryDisplay() {
  if (breakState.breakHistory.length === 0) {
    breakHistory.innerHTML = '<tr><td colspan="4" class="text-center">No se han tomado pausas hoy</td></tr>'
    return
  }

  let historyHTML = ""
  breakState.breakHistory.forEach((breakRecord, index) => {
    const startTime = formatDateTime(breakRecord.startTime)
    const endTime = formatDateTime(breakRecord.endTime)
    const duration = formatDuration(breakRecord.duration)
    const percentUsed = Math.round((breakRecord.duration / breakRecord.allowedDuration) * 100)

    historyHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${breakRecord.typeName}</td>
                <td>${startTime}</td>
                <td>${endTime}</td>
                <td>${duration} (${percentUsed}%)</td>
            </tr>
        `
  })

  breakHistory.innerHTML = historyHTML
}

/**
 * Formatear fecha y hora
 * @param {Date} date - La fecha a formatear
 * @returns {string} - Fecha y hora formateada
 */
function formatDateTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

/**
 * Formatear la duración en segundos a formato MM:SS
 * @param {number} seconds - Duración en segundos
 * @returns {string} - Duración formateada
 */
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`
}

/**
 * Guardar el historial de pausas en localStorage
 */
function saveBreakHistory() {
  const today = new Date().toDateString()
  const breakData = {
    date: today,
    history: breakState.breakHistory,
    breakTypes: BREAK_TYPES,
  }

  localStorage.setItem("breakData", JSON.stringify(breakData))
}

/**
 * Cargar el historial de pausas desde localStorage
 */
function loadBreakHistory() {
  const savedData = localStorage.getItem("breakData")
  if (savedData) {
    const breakData = JSON.parse(savedData)
    const today = new Date().toDateString()

    // Solo cargar datos si son de hoy
    if (breakData.date === today) {
      breakState.breakHistory = breakData.history.map((record) => {
        return {
          ...record,
          startTime: new Date(record.startTime),
          endTime: new Date(record.endTime),
        }
      })

      // Restaurar la disponibilidad de los tipos de pausas
      if (breakData.breakTypes) {
        for (const type in breakData.breakTypes) {
          if (BREAK_TYPES[type]) {
            BREAK_TYPES[type].available = breakData.breakTypes[type].available
          }
        }
      }

      // Actualizar la interfaz
      updateBreakStatusDisplay()
      updateBreakHistoryDisplay()
    }
  }
}

/**
 * Enviar datos de la pausa a la API
 * @param {Object} breakRecord - Los datos de la pausa a enviar
 */
function sendBreakDataToAPI(breakRecord) {
  // Preparar datos para la API
  const apiData = {
    type: breakRecord.type,
    startTime: breakRecord.startTime.toISOString(),
    endTime: breakRecord.endTime.toISOString(),
    duration: breakRecord.duration,
    allowedDuration: breakRecord.allowedDuration,
    percentUsed: Math.round((breakRecord.duration / breakRecord.allowedDuration) * 100),
    employeeId: "current-user-id", // This would come from authentication
  }

  // Enviar datos usando Axios
  axios
    .post("https://api.example.com/breaks", apiData)
    .then((response) => {
      console.log("Break data sent successfully:", response.data)
    })
    .catch((error) => {
      console.error("Error sending break data:", error)
      // Almacenar solicitudes fallidas para reintentar
      storeFailedRequest("breaks", apiData)
    })
}

/**
 * Almacenar solicitudes fallidas de API para reintentar
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
  // Crear elemento de notificación
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

// Inicializar la funcionalidad de pausas cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", initBreaks)

