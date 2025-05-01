/**
 * Admin Profile functionality
 * Handles profile editing, photo changes, and security settings
 */

// Import necessary modules (if using modules)
// For example:
// import axios from 'axios';
// import * as bootstrap from 'bootstrap';

// Declare axios and bootstrap if not using modules
//const axios = window.axios; // Assuming axios is loaded globally
//const bootstrap = window.bootstrap; // Assuming bootstrap is loaded globally

// DOM Elements
const editProfileBtn = document.getElementById("edit-profile-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const saveProfileBtn = document.getElementById("save-profile-btn");
const profileForm = document.getElementById("profile-form");
const profileInputs = profileForm.querySelectorAll("input");
const profileActions = document.getElementById("profile-actions");
const changePictureBtn = document.getElementById("change-picture-btn");
const profilePictureInput = document.getElementById("profile-picture-input");
const profilePicture = document.getElementById("profile-picture");
const sidebarAvatar = document.getElementById("sidebar-avatar");
const changePasswordBtn = document.getElementById("change-password-btn");
const enable2faBtn = document.getElementById("enable-2fa-btn");
const changePasswordModal = new bootstrap.Modal(
  document.getElementById("change-password-modal")
);
const savePasswordBtn = document.getElementById("save-password-btn");
const changePasswordForm = document.getElementById("change-password-form");

// Original profile data for cancellation
const originalProfileData = {};

// Constantes para ruta de la imagen perfil
const RUTA_BASE_IMAGENES = "/src/assets/img/";

/**
 * Initialize profile functionality
 */
function initProfile() {
  // Set up event listeners
  editProfileBtn.addEventListener("click", enableProfileEditing);
  cancelEditBtn.addEventListener("click", cancelProfileEditing);
  profileForm.addEventListener("submit", saveProfileChanges);
  changePictureBtn.addEventListener("click", triggerProfilePictureUpload);
  profilePictureInput.addEventListener("change", handleProfilePictureChange);
  changePasswordBtn.addEventListener("click", showChangePasswordModal);
  savePasswordBtn.addEventListener("click", handlePasswordChange);
  enable2faBtn.addEventListener("click", handle2FASetup);

  // Load admin profile data
  loadAdminProfile();

  // Store original profile data
  storeOriginalProfileData();
}

/**
 * Load admin profile data from API
 */
function loadAdminProfile() {
  fetchAdminProfile()
    .then((data) => {
      console.log("Datos recibidos en loadAdminProfile:", data);
      
      // Actualizar los campos del formulario
      document.getElementById("first-name").value = data.nombre || "";
      document.getElementById("last-name").value = data.apellido || "";
      document.getElementById("email").value = data.correo || "";
      document.getElementById("phone").value = data.telefono || "";
      document.getElementById("role").value = data.rol || "";

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
      storeOriginalProfileData();
    })
    .catch((error) => {
      console.error("Error al cargar el perfil del administrador:", error);
      showNotification("Error al cargar los datos del perfil", "error");
    });
}


//realiza una peticion a la api para pedir los datos del perfil del administrador
function fetchAdminProfile() {
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
    .get(`http://localhost:8000/administrador/${idUsuario}`)
    .then((response) => {
      const userData = response.data;
      console.log("Datos completos del administrador:", userData);
      
      // Verifica si cada dato es dato o undefined antes de asignarlo
      const nombre = userData?.nombre || "";
      const apellido = userData?.apellido || "";
      const correo = userData?.correo || "";
      const telefono = userData?.telefono || "";
      const rol = userData?.rol || "";
      const imagen_perfil = userData?.imagen_perfil || "";

      console.log("Datos procesados y validados para asignarlos a los campos:", {
        nombre,
        apellido,
        correo,
        telefono,
        rol,
        imagen_perfil
      });

      //los datos recibidos se asignan a los elementos del dom

      // Actualizar los campos del formulario
      const firstNameInput = document.getElementById("first-name");
      const lastNameInput = document.getElementById("last-name");
      const emailInput = document.getElementById("email");
      const phoneInput = document.getElementById("phone");
      const roleInput = document.getElementById("role");

      firstNameInput.value = nombre;
      lastNameInput.value = apellido;
      emailInput.value = correo;
      phoneInput.value = telefono;
      roleInput.value = rol;

      // Actualizar la información en el encabezado del perfil
      const profileName = document.getElementById("profile-name");
      const profilePosition = document.getElementById("profile-position");
      
      if (profileName) profileName.textContent = `${nombre} ${apellido}`;
      if (profilePosition) profilePosition.textContent = rol;

      // Actualizar la información en el sidebar
      const sidebarUsername = document.getElementById("sidebar-username");
      const sidebarPosition = document.getElementById("sidebar-position");
      
      if (sidebarUsername) sidebarUsername.textContent = `${nombre} ${apellido}`;
      if (sidebarPosition) sidebarPosition.textContent = rol;

      // Si hay una imagen de perfil, actualizarla
      if (imagen_perfil) {
        if (profilePicture) profilePicture.src = imagen_perfil;
        if (sidebarAvatar) sidebarAvatar.src = imagen_perfil;
      }

      return userData;
    })
    .catch((error) => {
      console.error("Error al obtener el perfil:", error);
      showNotification("Error al cargar el perfil del usuario", "error");
      throw error;
    });
}

/**
 * Store the original profile data for cancellation
 */
function storeOriginalProfileData() {
  profileInputs.forEach((input) => {
    originalProfileData[input.id] = input.value;
  });
}

/**
 * Enable editing of profile information
 */
function enableProfileEditing() {
  // Enable all input fields
  profileInputs.forEach((input) => {
    input.disabled = false;
  });

  // Show action buttons
  profileActions.style.display = "block";

  // Hide edit button
  editProfileBtn.style.display = "none";
}

/**
 * Cancel profile editing and restore original values
 */
function cancelProfileEditing() {
  // Restore original values
  profileInputs.forEach((input) => {
    input.value = originalProfileData[input.id];
    input.disabled = true;
  });

  // Hide action buttons
  profileActions.style.display = "none";

  // Show edit button
  editProfileBtn.style.display = "inline-block";
}

/**
 * Save profile changes
 * @param {Event} e - The form submit event
 */
function saveProfileChanges(e) {
  e.preventDefault();

  // Create data object from form
  const formData = new FormData(profileForm);
  const profileData = {};
  for (const [key, value] of formData.entries()) {
    profileData[key] = value;
  }

  // Simulate API call to update profile
  updateAdminProfile(profileData)
    .then((response) => {
      // Update original data with new values
      storeOriginalProfileData();

      // Disable inputs and hide action buttons
      profileInputs.forEach((input) => {
        input.disabled = true;
      });
      profileActions.style.display = "none";

      // Show edit button
      editProfileBtn.style.display = "inline-block";

      // Update sidebar and profile header if name changed
      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const fullName = `${firstName} ${lastName}`;

      document.getElementById("sidebar-username").textContent = fullName;
      document.getElementById("profile-name").textContent = fullName;

      // Show success message
      showNotification("Profile updated successfully", "success");
    })
    .catch((error) => {
      showNotification("Failed to update profile. Please try again.", "error");
      console.error("Error updating profile:", error);
    });
}

/**
 * Update admin profile via API (simulated)
 * @param {Object} profileData - The profile data to update
 * @returns {Promise} - Promise that resolves with the response
 */
function updateAdminProfile(profileData) {
  return axios
    .put("https://api.example.com/admin/profile", profileData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("API Error:", error);
      // For demonstration, simulate successful update
      return { success: true, message: "Profile updated successfully" };
    });
}

/**
 * Trigger the profile picture upload dialog
 */
function triggerProfilePictureUpload() {
  profilePictureInput.click();
}

/**
 * Handle profile picture change
 * @param {Event} e - The change event
 */
function handleProfilePictureChange(e) {
  const file = e.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.match("image.*")) {
      showNotification("Please select an image file", "error");
      return;
    }

    // Create a FileReader to read the image
    const reader = new FileReader();
    reader.onload = (e) => {
      // Update profile picture and sidebar avatar
      profilePicture.src = e.target.result;
      sidebarAvatar.src = e.target.result;

      // Upload to server (simulated)
      uploadProfilePicture(file)
        .then((response) => {
          showNotification("Profile picture updated successfully", "success");
        })
        .catch((error) => {
          showNotification("Failed to update profile picture", "error");
          console.error("Error uploading profile picture:", error);
        });
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Upload profile picture to API (simulated)
 * @param {File} file - The profile picture file
 * @returns {Promise} - Promise that resolves with the response
 */
function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("profilePicture", file);

  return axios
    .post("https://api.example.com/admin/profile/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("API Error:", error);
      // For demonstration, simulate successful upload
      return { success: true, url: "profile-picture-url.jpg" };
    });
}

/**
 * Show the change password modal
 */
function showChangePasswordModal() {
  // Reset form
  changePasswordForm.reset();

  // Show modal
  changePasswordModal.show();
}

/**
 * Handle password change
 */
function handlePasswordChange() {
  // Get form values
  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate passwords
  if (!currentPassword || !newPassword || !confirmPassword) {
    showNotification("Please fill in all password fields", "warning");
    return;
  }

  if (newPassword !== confirmPassword) {
    showNotification("New passwords do not match", "warning");
    return;
  }

  // Send password change request to API
  changePassword(currentPassword, newPassword)
    .then((response) => {
      // Hide modal
      changePasswordModal.hide();

      // Show success message
      showNotification("Password changed successfully", "success");
    })
    .catch((error) => {
      showNotification(
        "Failed to change password. Please check your current password.",
        "error"
      );
      console.error("Error changing password:", error);
    });
}

/**
 * Change password via API (simulated)
 * @param {string} currentPassword - The current password
 * @param {string} newPassword - The new password
 * @returns {Promise} - Promise that resolves with the response
 */
function changePassword(currentPassword, newPassword) {
  return axios
    .post("https://api.example.com/admin/change-password", {
      currentPassword,
      newPassword,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("API Error:", error);
      // For demonstration, simulate successful password change
      return { success: true, message: "Password changed successfully" };
    });
}

/**
 * Handle 2FA setup
 */
function handle2FASetup() {
  // This would typically open a modal with QR code and setup instructions
  showNotification(
    "Two-factor authentication setup is not implemented in this demo",
    "info"
  );
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

// Initialize profile functionality when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initProfile);
