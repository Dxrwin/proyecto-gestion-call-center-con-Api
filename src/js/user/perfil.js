/**
 * Funcionalidad de gestión de perfil
 * Maneja la edición de perfil, cambios de foto y subida de currículum
 */

// Elementos DOM
const editProfileBtn = document.getElementById("edit-profile-btn")
const cancelEditBtn = document.getElementById("cancel-edit-btn")
const saveProfileBtn = document.getElementById("save-profile-btn")
const profileForm = document.getElementById("profile-form")
const profileInputs = profileForm.querySelectorAll("input")
const profileActions = document.getElementById("profile-actions")
const changePictureBtn = document.getElementById("change-picture-btn")
const profilePictureInput = document.getElementById("profile-picture-input")
const profilePicture = document.getElementById("profile-picture")
const sidebarAvatar = document.getElementById("sidebar-avatar")
const uploadResumeBtn = document.getElementById("upload-resume-btn")
const resumeInput = document.getElementById("resume-input")
const resumeStatus = document.getElementById("resume-status")

// Datos originales de perfil para cancelación
const originalProfileData = {}

/**
 * Inicializar la funcionalidad de perfil
 */
function initProfile() {
  // Configurar los listeners de eventos
  editProfileBtn.addEventListener("click", enableProfileEditing)
  cancelEditBtn.addEventListener("click", cancelProfileEditing)
  profileForm.addEventListener("submit", saveProfileChanges)
  changePictureBtn.addEventListener("click", triggerProfilePictureUpload)
  profilePictureInput.addEventListener("change", handleProfilePictureChange)
  uploadResumeBtn.addEventListener("click", triggerResumeUpload)
  resumeInput.addEventListener("change", handleResumeUpload)

  // Almacenar datos originales de perfil
  storeOriginalProfileData()
}

/**
 * Almacenar los datos originales de perfil para cancelación
 */
function storeOriginalProfileData() {
  profileInputs.forEach((input) => {
    originalProfileData[input.id] = input.value
  })
}

/**
 * Habilitar la edición de la información del perfil
 */
function enableProfileEditing() {
  // Habilitar todos los campos de entrada
  profileInputs.forEach((input) => {
    input.disabled = false
  })

  // Mostrar los botones de acción
  profileActions.style.display = "block"

  // Ocultar el botón de edición
  editProfileBtn.style.display = "none"
}

/**
 * Cancelar la edición del perfil y restaurar los valores originales
 */
function cancelProfileEditing() {
  // Restaurar los valores originales
  profileInputs.forEach((input) => {
    input.value = originalProfileData[input.id]
    input.disabled = true
  })

  // Ocultar los botones de acción
  profileActions.style.display = "none"

  // Mostrar el botón de edición
  editProfileBtn.style.display = "inline-block"
}

/**
 * Guardar los cambios del perfil
 * @param {Event} e - El evento de envío del formulario
 */
function saveProfileChanges(e) {
  e.preventDefault()

  // Crear un objeto de datos desde el formulario
  const formData = new FormData(profileForm)
  const profileData = {}
  for (const [key, value] of formData.entries()) {
    profileData[key] = value
  }

  // Simular llamada a API para actualizar el perfil
  updateProfileAPI(profileData)
    .then((response) => {
      // Actualizar los datos originales con nuevos valores
      storeOriginalProfileData()

      // Deshabilitar los campos de entrada y ocultar los botones de acción
      profileInputs.forEach((input) => {
        input.disabled = true
      })
      profileActions.style.display = "none"

      // Mostrar el botón de edición
      editProfileBtn.style.display = "inline-block"

      // Actualizar el nombre en el sidebar y el encabezado del perfil si ha cambiado
      const firstName = document.getElementById("first-name").value
      const lastName = document.getElementById("last-name").value
      const fullName = `${firstName} ${lastName}`

      document.getElementById("sidebar-username").textContent = fullName
      document.getElementById("profile-name").textContent = fullName

      // Mostrar mensaje de éxito
      showNotification("Perfil actualizado correctamente", "success")
    })
    .catch((error) => {
      showNotification("Failed to update profile. Please try again.", "error")
      console.error("Error updating profile:", error)
    })
}

/**
 * Activar el diálogo de subida de foto de perfil
 */
function triggerProfilePictureUpload() {
  profilePictureInput.click()
}

/**
 * Manejar el cambio de foto de perfil
 * @param {Event} e - El evento de cambio
 */
function handleProfilePictureChange(e) {
  const file = e.target.files[0]
  if (file) {
    // Validar el tipo de archivo
    if (!file.type.match("image.*")) {
      showNotification("Please select an image file", "error")
      return
    }

    // Crear un FileReader para leer la imagen
    const reader = new FileReader()
    reader.onload = (e) => {
      // Actualizar la foto de perfil y el avatar del sidebar
      profilePicture.src = e.target.result
      sidebarAvatar.src = e.target.result

      // Subir a servidor (simulado)
      uploadProfilePictureAPI(file)
        .then((response) => {
          showNotification("Foto de perfil actualizada correctamente", "success")
        })
        .catch((error) => {
          showNotification("Error al actualizar la foto de perfil", "error")
          console.error("Error al actualizar la foto de perfil:", error)
        })
    }
    reader.readAsDataURL(file)
  }
}

/**
 * Activar el diálogo de subida de currículum
 */
function triggerResumeUpload() {
  resumeInput.click()
}

/**
 * Manejar la subida de currículum
 * @param {Event} e - El evento de cambio
 */
function handleResumeUpload(e) {
  const file = e.target.files[0]
  if (file) {
    // Validar el tipo de archivo
    const validTypes = [".pdf", ".doc", ".docx"]
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
    if (!validTypes.includes(fileExtension)) {
      showNotification("Please select a PDF or Word document", "error")
      return
    }

    // Subir a servidor (simulado)
    uploadResumeAPI(file)
      .then((response) => {
        // Actualizar el estado del currículum
        resumeStatus.innerHTML = `
                    <div class="alert alert-success mb-0">
                        <i class="fas fa-check-circle me-2"></i>
                        Currículum subido: ${file.name}
                    </div>
                `
        showNotification("Currículum subido correctamente", "success")
      })
      .catch((error) => {
        showNotification("Error al subir el currículum", "error")
        console.error("Error al subir el currículum:", error)
      })
  }
}

/**
 * Mostrar un mensaje de notificación
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - El tipo de notificación (success, error, info)
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

/**
 * Llamada a la API para actualizar el perfil (simulada)
 * @param {Object} profileData - Los datos del perfil a actualizar
 * @returns {Promise} - Una promesa que resuelve con la respuesta
 */
function updateProfileAPI(profileData) {
  return new Promise((resolve, reject) => {
    // Simular retraso de llamada a API
    setTimeout(() => {
      console.log("Datos del perfil enviados a la API:", profileData)
      resolve({ success: true, message: "Perfil actualizado correctamente" })
    }, 1000)
  })
}

/**
 * Llamada a la API para subir la foto de perfil (simulada)
 * @param {File} file - El archivo de la foto de perfil
 * @returns {Promise} - Una promesa que resuelve con la respuesta
 */
function uploadProfilePictureAPI(file) {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      console.log("Foto de perfil enviada a la API:", file.name)
      resolve({ success: true, url: "profile-picture-url.jpg" })
    }, 1500)
  })
}

/**
 * Llamada a la API para subir el currículum (simulada)
 * @param {File} file - El archivo del currículum
 * @returns {Promise} - Una promesa que resuelve con la respuesta
 */
function uploadResumeAPI(file) {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      console.log("Currículum enviado a la API:", file.name)
      resolve({ success: true, url: "resume-url.pdf" })
    }, 1500)
  })
}

// Inicializar la funcionalidad de perfil cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", initProfile)

