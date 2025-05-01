// elementos del dom

const navLinks = document.querySelectorAll(
  ".nav-link[data-section], .dropdown-item[data-section]"
);
const sections = document.querySelectorAll(".dashboard-section");
const sectionTitle = document.getElementById("section-title");
const cerrar_sesion = document.getElementById("cerrar_sesion");

//inicializa las funciones del dashboard
function initDashboard() {
  // navegacion entre pestañas
  setupNavigation();

  // objetos para demostracion
  loadMockData();

  // seccion por defecto o principal a renderizar
  showSection("profile");
  cerrar;
}

//funcion cerrar sesion
const cerrar = cerrar_sesion.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/src/login.html";
});

//navegacion entre las secciones del dashboard
function setupNavigation() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.getAttribute("data-section");
      showSection(section);

      // Actualizar el estado activo en el sidebar
      document.querySelectorAll(".nav-link").forEach((navLink) => {
        navLink.classList.remove("active");
      });
      document
        .querySelector(`.nav-link[data-section="${section}"]`)
        ?.classList.add("active");
    });
  });
}

/**
 * Mostrar la sección especificada y ocultar las demás
 * @param {string} sectionId - El ID de la sección a mostrar
 */
function showSection(sectionId) {
  sections.forEach((section) => {
    section.classList.remove("active");
  });

  const activeSection = document.getElementById(`${sectionId}-section`);
  if (activeSection) {
    activeSection.classList.add("active");

    // Actualizar el título de la sección
    switch (sectionId) {
      case "profile":
        sectionTitle.textContent = "MI PERFIL";
        break;
      case "breaks":
        sectionTitle.textContent = "PAUSAS ACTIVAS";
        break;
      case "schedule":
        sectionTitle.textContent = "HORARIO LABORAL";
        break;
      case "exchange":
        sectionTitle.textContent = "INTERCAMBIO HORARIO";
        break;
      default:
        sectionTitle.textContent = "DASHBOARD EMPLEADO";
    }
  }
}

/**
 * datos de objetos para demostracion
 */
function loadMockData() {

  // objeto usuario de prueba
  /*const userData = {
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

  // colocar datos del objeto en la interfaz usuario
  document.getElementById("first-name").value = userData.firstName;
  document.getElementById("last-name").value = userData.lastName;
  document.getElementById("email").value = userData.email;
  document.getElementById("phone").value = userData.phone;
  document.getElementById("birth-date").value = userData.birthDate;
  document.getElementById("address").value = userData.address;
  document.getElementById("emergency-contact").value =
    userData.emergencyContact;
  document.getElementById("emergency-phone").value = userData.emergencyPhone;

  // Update sidebar and profile header
  document.getElementById(
    "sidebar-username"
  ).textContent = `${userData.firstName} ${userData.lastName}`;
  document.getElementById("sidebar-position").textContent = userData.position;
  document.getElementById(
    "profile-name"
  ).textContent = `${userData.firstName} ${userData.lastName}`;
  document.getElementById("profile-position").textContent = userData.position;
  document.getElementById("profile-department").textContent =
    userData.department;*/

  // objeto de empleados de ejemplo
  const employees = [
    { id: 1, name: "Alice Johnson", position: "UI/UX Designer" },
    { id: 2, name: "Bob Smith", position: "Frontend Developer" },
    { id: 3, name: "Carol Williams", position: "Project Manager" },
    { id: 4, name: "David Brown", position: "QA Engineer" },
  ];

  const exchangeEmployeeSelect = document.getElementById("exchange-employee");
  employees.forEach((employee) => {
    const option = document.createElement("option");
    option.value = employee.id;
    option.textContent = `${employee.name} (${employee.position})`;
    exchangeEmployeeSelect.appendChild(option);
  });
  
}

//inicializar el dashboard con toda la informacion
document.addEventListener("DOMContentLoaded", initDashboard);
