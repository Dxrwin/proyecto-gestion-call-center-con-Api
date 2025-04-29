/**
 * Main JavaScript file for the Admin Dashboard
 * Handles navigation and initialization of the dashboard
 */

// DOM Elements
const navLinks = document.querySelectorAll(
  ".nav-link[data-section], .dropdown-item[data-section]"
);
const sections = document.querySelectorAll(".dashboard-section");
const sectionTitle = document.getElementById("section-title");
const cerrar_sesion = document.getElementById("cerrar_sesion");

/**
 * Initialize the dashboard
 * Sets up event listeners and loads initial data
 */
function initDashboard() {
  console.log("Initializing dashboard...");

  // Ocultar todas las secciones primero
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    section.style.display = "none";
  });

  // Set up navigation
  setupNavigation();

  // Initialize the current section (default: profile)
  showSection("profile");
  cerrar;

  // Marcar el enlace de perfil como activo
  document
    .querySelector('.nav-link[data-section="profile"]')
    .classList.add("active");

  console.log("dashboard iniciado");
  


}

//funcion cerrar sesion
const cerrar = cerrar_sesion.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/src/login.html";
});


/**
 * Set up navigation between dashboard sections
 */
function setupNavigation() {
  console.log("Setting up navigation...");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.getAttribute("data-section");
      console.log(`Navigating to section: ${section}`);

      // Update active state in sidebar
      document.querySelectorAll(".nav-link").forEach((navLink) => {
        navLink.classList.remove("active");
      });

      // Activar el enlace actual
      const activeLink = document.querySelector(
        `.nav-link[data-section="${section}"]`
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }

      // Mostrar la sección correspondiente
      showSection(section);
    });
  });
}

/**
 * Show the specified section and hide others
 * @param {string} sectionId - The ID of the section to show
 */
function showSection(sectionId) {
  console.log(`Showing section: ${sectionId}`);

  // Ocultar todas las secciones
  sections.forEach((section) => {
    section.style.display = "none";
    section.classList.remove("active");
  });

  // Mostrar la sección activa
  const activeSection = document.getElementById(`${sectionId}-section`);
  if (activeSection) {
    activeSection.style.display = "block";
    activeSection.classList.add("active");

    console.log(`Section ${sectionId} activated`);

    // Update section title
    switch (sectionId) {
      case "profile":
        sectionTitle.textContent = "My Profile";
        break;
      case "employees":
        sectionTitle.textContent = "Employee Management";
        break;
      case "departments":
        sectionTitle.textContent = "Department Management";
        break;
      case "reports":
        sectionTitle.textContent = "Reports";
        break;
      case "settings":
        sectionTitle.textContent = "System Settings";
        break;
      default:
        sectionTitle.textContent = "Admin Dashboard";
    }
  } else {
    console.error(`Section with ID ${sectionId}-section not found`);
  }
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

// Initialize the dashboard when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initDashboard);
