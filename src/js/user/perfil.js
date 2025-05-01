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

  //cargar perfil empleado
  loadEmployeeProfile();

  // Almacenar datos originales de perfil
  storeOriginalProfileData()
}

// Constantes para ruta de la imagen perfil
const RUTA_BASE_IMAGENES = "/src/assets/img/";

/**
 * Almacenar los datos originales de perfil para cancelación
 */
function storeOriginalProfileData() {
  profileInputs.forEach((input) => {
    originalProfileData[input.id] = input.value
  })
}

function loadEmployeeProfile() {


    // objeto usuario de prueba
    const userData = {
      firstName: "Darwin",
      lastName: "Pacheco",
      email: "Darwin@gmail.com",
      phone: "3002613148",
      position: "soporte tecnico",
      department: "area tecnica",
      birthDate: "1999-05-15",
      address: "las moras",
      emergencyContact: "alex char",
      emergencyPhone: "5 te la meto,8te la enclocho",
    };

    fetchEmployeeProfile()
    .then((data) => {
      console.log("Datos recibidos de la api para asignacion en lso campos:", data);
      

       // colocar datos del objeto en la interfaz usuario
    document.getElementById("first-name").value = data.nombre || userData.firstName;
    document.getElementById("last-name").value = data.apellido || userData.lastName;
    document.getElementById("email").value = data.correo || userData.email;
    document.getElementById("phone").value = data.telefono || userData.phone;
    document.getElementById("birth-date").value = data.fecha_nacimiento || userData.birthDate;
    document.getElementById("address").value = data.direccion || userData.address;
    document.getElementById("emergency-contact").value =data.contacto_emergencia || userData.emergencyContact;
    document.getElementById("emergency-phone").value = data.telefono_emergencia || userData.emergencyPhone;
    document.getElementById("profile-department").textContent = data.area || userData.department;

      // Actualizar la información en el encabezado del perfil
      document.getElementById("profile-name").textContent = `${data.nombre || ""} ${data.apellido || ""}`;
      document.getElementById("profile-position").textContent = data.rol || "";

      // Actualizar la información en el sidebar
      document.getElementById("sidebar-username").textContent = `${data.nombre || ""} ${data.apellido || ""}`;
      document.getElementById("sidebar-position").textContent = data.rol || "";

      // Actualizar la imagen de perfil si existe
      if (data.imagen_perfil) {
        const rutaImagen = `${RUTA_BASE_IMAGENES}${data.imagen_perfil}`;
        console.log("Ruta completa de la imagen:", rutaImagen);
        
        // Verificar si la imagen existe antes de asignarla
        const img = new Image();
        img.onload = function() {
          profilePicture.src = rutaImagen;
          sidebarAvatar.src = rutaImagen;
        };
        img.onerror = function() {
          console.error("Error al cargar la imagen:", rutaImagen);
          // Asignar una imagen por defecto si la imagen no se encuentra
          profilePicture.src = `${RUTA_BASE_IMAGENES}avatarimage.png`;
          sidebarAvatar.src = `${RUTA_BASE_IMAGENES}avatarimage.png`;
        };
        img.src = rutaImagen;
      } else {
        // Si no hay imagen de perfil, usar la imagen por defecto
        profilePicture.src = `${RUTA_BASE_IMAGENES}avatarimage.png`;
        sidebarAvatar.src = `${RUTA_BASE_IMAGENES}avatarimage.png`;
      }

      // Almacenar los datos originales
      //storeOriginalProfileData();
    })
    .catch((error) => {
      console.error("Error al cargar el perfil del empleado:", error);
      showNotification("Error al cargar los datos del perfil", "error");
    });
}


//realiza una peticion a la api para pedir los datos del perfil del administrador
function fetchEmployeeProfile() {
  //obtiene el id y el rol del usuario desde el localstorage
  //hace una peticion get al servidor para obtener los datos del admin
  //procesa y devuelve los datos
  const idUsuario = localStorage.getItem("id_usuario");
  const rolUsuario = localStorage.getItem("rol");

  console.log("ID Usuario desde localStorage:", idUsuario);
  console.log("Rol Usuario desde localStorage:", rolUsuario);

  if (!idUsuario || !rolUsuario) {
    console.error("No se encontraron datos de usuario en localStorage");
    return Promise.reject("Usuario no autenticado");
  }

  return axios
    .get(`http://127.0.0.1:8000/empleado/${idUsuario}`)
    .then((response) => {
      const userData = response.data;
      console.log("Datos completos del empleado:", userData);
      
      // Verifica si cada dato es dato o undefined antes de asignarlo
      const nombre = userData?.nombre || "";
      const apellido = userData?.apellido || "";
      const correo = userData?.correo || "";
      const telefono = userData?.telefono || "";
      const rol = userData?.rol || "";
      const imagen_perfil = userData?.imagen_perfil || "";

      console.log("Datos OBtenidos de la Api y validados que NO fuesen vacios para poder usar:", {
        nombre,
        apellido,
        correo,
        telefono,
        rol,
        imagen_perfil
      });

      return userData;
    })
    .catch((error) => {
      console.error("Error al obtener el perfil:", error);
      showNotification("Error al cargar el perfil del usuario", "error");
      throw error;
    });
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

