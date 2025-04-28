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
  // Fetch admin profile data from API
  fetchAdminProfile()
    .then((data) => {
      // Update form fields with profile data
      document.getElementById("first-name").value = data.firstName;
      document.getElementById("last-name").value = data.lastName;
      document.getElementById("email").value = data.email;
      document.getElementById("phone").value = data.phone;
      document.getElementById("role").value = data.role;
      document.getElementById("department").value = data.department;
      document.getElementById("address").value = data.address;

      // Update profile header
      document.getElementById(
        "profile-name"
      ).textContent = `${data.firstName} ${data.lastName}`;
      document.getElementById("profile-position").textContent = data.role;
      document.getElementById("profile-department").textContent =
        data.department;

      // Update sidebar
      document.getElementById(
        "sidebar-username"
      ).textContent = `${data.firstName} ${data.lastName}`;
      document.getElementById("sidebar-position").textContent = data.role;

      // Update profile picture if available
      if (data.profilePicture) {
        profilePicture.src = data.profilePicture;
        sidebarAvatar.src = data.profilePicture;
      }

      // Store original data
      storeOriginalProfileData();
    })
    .catch((error) => {
      console.error("Error loading admin profile:", error);
      showNotification("Failed to load profile data", "error");
    });
}

/**
 * Fetch admin profile data from API (simulated)
 * @returns {Promise} - Promise that resolves with admin profile data
 */
function fetchAdminProfile() {
  return axios
    .get("https://api.example.com/admin/profile")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("API Error:", error);
      // If API fails, return mock data for demonstration
      return {
        id: 1,
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        phone: "(555) 123-4567",
        role: "System Administrator",
        department: "Management",
        address: "123 Admin St, Admin City, AC 12345",
        profilePicture: null,
      };
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
