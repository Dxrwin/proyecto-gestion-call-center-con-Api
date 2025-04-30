/**
 * Archivo JavaScript principal para el Panel de Administración
 * Maneja la navegación e inicialización del panel de control
 * 
 * Este archivo se encarga de:
 * - Inicializar el panel de administración
 * - Manejar la navegación entre diferentes secciones
 * - Gestionar eventos de usuario
 * - Cargar datos iniciales necesarios
 */


// Elementos del DOM que se utilizan en el panel de administración:
// - navLinks: Enlaces de navegación para cambiar entre secciones
// - sections: Secciones/paneles del dashboard que se muestran/ocultan
// - sectionTitle: Título que muestra la sección actual
// - cerrar_sesion: Botón para cerrar la sesión del usuario
const navLinks = document.querySelectorAll(
  ".nav-link[data-section], .dropdown-item[data-section]"
);
const sections = document.querySelectorAll(".dashboard-section");
const sectionTitle = document.getElementById("section-title");
const cerrar_sesion = document.getElementById("cerrar_sesion");

/*
 * Esta función se encarga de:
 * - Inicializar el panel de control ocultando todas las secciones
 * - Configurar los eventos de navegación entre secciones
 * - Mostrar la sección de perfil por defecto
 * - Marcar el enlace de perfil como activo en la navegación
 * - Preparar el sistema para la interacción del usuario
 */
function initDashboard() {
  console.log("Initializing dashboard...");

  // Ocultar todas las secciones primero para asegurar que el panel de control
  // comience en un estado limpio. Esto evita que se muestren múltiples secciones
  // al mismo tiempo y prepara el dashboard para mostrar solo la sección seleccionada
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    section.style.display = "none";
  });

  // Set up navigation
  // Configura la navegación entre las diferentes secciones del panel de administración
  // - Agrega event listeners a los enlaces de navegación
  // - Maneja el cambio entre secciones cuando se hace clic
  // - Actualiza los estados activos de los enlaces
  // - Asegura una transición suave entre vistas
  setupNavigation();

  // Initialize the current section (default: profile)
  // Esta sección inicializa la vista predeterminada del panel de administración,
  // estableciendo la sección de perfil como la primera en mostrarse cuando el usuario
  // ingresa al dashboard. Esto proporciona una experiencia consistente al usuario y
  // asegura que siempre haya una sección visible al cargar la página.
  showSection("profile");
  cerrar;

  // Marcar el enlace de perfil como activo por defecto en la navegación
  // Esto asegura que el enlace de perfil tenga la clase 'active' cuando se carga 
  // inicialmente el dashboard, proporcionando una indicación visual al usuario
  // de que se encuentra en la sección de perfil
  document
    .querySelector('.nav-link[data-section="profile"]')
    .classList.add("active");

  console.log("dashboard iniciado");
  


}

/**
 * Función para cerrar la sesión del usuario
 * - Limpia todos los datos almacenados en el localStorage
 * - Redirige al usuario a la página de login
 * - Se activa cuando el usuario hace click en el botón de cerrar sesión
 * - Ayuda a mantener la seguridad eliminando datos sensibles
 * - Asegura que el usuario deba autenticarse nuevamente para acceder
 */
const cerrar = cerrar_sesion.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/src/login.html";
});


/**
 * Set up navigation between dashboard sections
 * - Configura los event listeners para los enlaces de navegación del dashboard
 * - Maneja el cambio entre diferentes secciones cuando se hace clic
 * - Actualiza los estados activos de los enlaces en la barra lateral
 * - Asegura una transición suave entre las diferentes vistas
 * - Mantiene la consistencia visual activando/desactivando las clases CSS apropiadas
 */
function setupNavigation() {
  console.log("Setting up navigation...");

  // Obtener todos los enlaces de navegación del dashboard
  // Estos enlaces están marcados con la clase 'nav-link' y se utilizan para
  // cambiar entre las diferentes secciones del panel de administración
  const navLinks = document.querySelectorAll(".nav-link");

  // Obtener todas las secciones del dashboard
  // Estas secciones contienen el contenido principal de cada vista y están
  // marcadas con la clase 'dashboard-section'
  const sections = document.querySelectorAll(".dashboard-section");

  // Obtener el elemento que muestra el título de la sección actual
  // Este elemento se actualiza dinámicamente cuando el usuario navega
  // entre diferentes secciones del dashboard
  const sectionTitle = document.querySelector(".section-title");


  
  navLinks.forEach((link) => {

    // Para cada enlace de navegación en el panel de administración, se añade un event listener
    // que escucha el evento 'click'. Este listener previene el comportamiento por defecto del
    // enlace, que es recargar la página, y en su lugar, obtiene el atributo 'data-section' del
    // enlace clicado. Este atributo indica la sección del dashboard a la que se desea navegar.
    // Luego, se actualiza el estado activo de los enlaces en la barra lateral, asegurando que
    // solo el enlace correspondiente a la sección actual esté marcado como activo. Finalmente,
    // se llama a la función 'showSection' para mostrar la sección seleccionada y ocultar las demás.
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.getAttribute("data-section");
      console.log(`Navigating to section: ${section}`);

      // Actualizar el estado activo en la barra lateral
      // Este bloque de código se encarga de recorrer todos los enlaces de navegación
      // y eliminar la clase 'active' de cada uno de ellos. Esto asegura que ningún
      // enlace quede marcado como activo antes de activar el enlace correspondiente
      // a la sección actual. Posteriormente, se añade la clase 'active' al enlace
      // que coincide con la sección seleccionada, lo que visualmente indica al usuario
      // cuál es la sección activa en el panel de administración.
      document.querySelectorAll(".nav-link").forEach((navLink) => {
        navLink.classList.remove("active");
      });

      // Activar el enlace actual: Este bloque de código busca el enlace de navegación que coincide
      // con la sección seleccionada utilizando el atributo 'data-section'. Una vez encontrado,
      // se añade la clase 'active' a este enlace, lo que visualmente indica al usuario que este
      // es el enlace actualmente activo en la barra lateral del panel de administración.
      // Esto es crucial para mantener la interfaz de usuario consistente y proporcionar
      // una experiencia de navegación clara y coherente.
      const activeLink = document.querySelector(
        `.nav-link[data-section="${section}"]`
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }

      // Mostrar la sección correspondiente: Este bloque de código se encarga de llamar a la función 'showSection'
      // pasando como argumento el identificador de la sección que se desea mostrar. La función 'showSection' es
      // responsable de ocultar todas las secciones del dashboard y luego mostrar únicamente la sección que
      // corresponde al identificador proporcionado. Esto asegura que el usuario solo vea el contenido relevante
      // para la sección seleccionada, mejorando así la experiencia de navegación dentro del panel de administración.
      showSection(section);
    });
  });
}

/*
 * Muestra la sección especificada y oculta las demás.
 * 
 * Esta función es crucial para la navegación dentro del panel de administración,
 * ya que permite al usuario enfocarse en una sola sección a la vez. Al recibir
 * el identificador de la sección que se desea mostrar, la función primero oculta
 * todas las secciones disponibles en el dashboard. Luego, busca la sección que
 * coincide con el identificador proporcionado y la hace visible, asegurando que
 * solo el contenido relevante para esa sección esté a la vista del usuario.
 * Además, actualiza el título de la sección en la interfaz para reflejar el
 * contenido actual, mejorando así la experiencia de usuario al proporcionar
 * un contexto claro sobre la información que se está visualizando.
 */

function showSection(sectionId) {
  console.log(`Showing section: ${sectionId}`);

  // Este bloque de código se encarga de ocultar todas las secciones del panel de administración.
  // Al recorrer cada sección, se establece su estilo de visualización a "none", lo que las hace
  // invisibles para el usuario. Además, se elimina la clase 'active' de cada sección para asegurar
  // que ninguna de ellas quede marcada como activa. Esto es esencial para preparar el entorno
  // antes de mostrar la sección seleccionada, garantizando que solo el contenido relevante
  // esté visible en el dashboard.
  sections.forEach((section) => {
    section.style.display = "none";
    section.classList.remove("active");
  });

  // Mostrar la sección activa: Este bloque de código se encarga de identificar y mostrar la sección del panel de administración
  // que el usuario ha seleccionado. Utiliza el identificador de la sección proporcionado para buscar el elemento correspondiente
  // en el DOM. Una vez encontrado, cambia su estilo de visualización a "block" para hacerlo visible y añade la clase 'active'
  // para indicar visualmente que esta es la sección actualmente activa. Esto es fundamental para asegurar que el usuario
  // pueda ver y acceder al contenido relevante de la sección seleccionada, mejorando así la experiencia de navegación.
  const activeSection = document.getElementById(`${sectionId}-section`);
  if (activeSection) {
    activeSection.style.display = "block";
    activeSection.classList.add("active");

    console.log(`Section ${sectionId} activated`);

    // Actualizar el título de la sección: Este bloque de código se encarga de modificar el texto del título de la sección
    // en la interfaz de usuario, de acuerdo con la sección que el usuario ha seleccionado. Al cambiar el contenido del
    // elemento 'sectionTitle', se proporciona un contexto claro y específico sobre la información que se está mostrando
    // actualmente en el panel de administración. Esto no solo mejora la experiencia del usuario al navegar por el dashboard,
    // sino que también asegura que el usuario siempre esté consciente de la sección en la que se encuentra, facilitando
    // una navegación más intuitiva y eficiente.
    switch (sectionId) {
      case "profile":
        sectionTitle.textContent = "Mi Perfil";
        break;
      case "employees":
        sectionTitle.textContent = "Gestion de Empleados";
        break;
      case "departments":
        sectionTitle.textContent = "Gestion de Areas";
        break;
      case "reports":
        sectionTitle.textContent = "Rendimiento";
        break;
      case "settings":
        sectionTitle.textContent = "configuracion";
        break;
      default:
        sectionTitle.textContent = "interfaz Administrador";
    }
  } else {
    console.error(`Section with ID ${sectionId}-section not found`);
  }
}

/**
 * Muestra un mensaje de notificación en la interfaz de usuario.
 * Este método crea un elemento de notificación que se muestra en la esquina superior derecha de la pantalla.
 * La notificación es de tipo "alerta" y se puede cerrar manualmente o se eliminará automáticamente después de 5 segundos.
 * @param {string} message - El mensaje que se mostrará en la notificación.
 * @param {string} type - El tipo de notificación, que determina el estilo visual de la alerta. 
 * Puede ser uno de los siguientes: 'success' (éxito), 'error' (error), 'info' (información), 'warning' (advertencia).
 */
function showNotification(message, type) {
  // Crear un elemento de notificación: Este bloque de código se encarga de generar un nuevo elemento HTML de tipo 'div' que 
  // servirá como contenedor para la notificación en la interfaz de usuario. Este elemento se personaliza con clases de estilo 
  // específicas para asegurar que se muestre correctamente como una alerta visual en la esquina superior derecha de la pantalla. 
  // Además, se le asigna un índice de z alto para garantizar que siempre esté visible sobre otros elementos de la página.
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  notification.style.zIndex = "9999";
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  // Añadir la notificación al documento: Este paso es crucial para que la notificación sea visible para el usuario. 
  // Al agregar el elemento de notificación al cuerpo del documento, nos aseguramos de que se renderice en la interfaz 
  // de usuario. Esto permite que el usuario reciba retroalimentación visual inmediata sobre la acción que ha realizado, 
  // mejorando así la experiencia de usuario al proporcionar información contextual y relevante en tiempo real.
  document.body.appendChild(notification);

  // Eliminar automáticamente la notificación después de 5 segundos: Este bloque de código utiliza la función setTimeout para 
  // programar la eliminación de la notificación después de un período de 5 segundos. Primero, se elimina la clase "show" del 
  // elemento de notificación para iniciar una transición de desvanecimiento. Luego, se utiliza otro setTimeout anidado para 
  // esperar 150 milisegundos adicionales antes de eliminar completamente el elemento del DOM, asegurando que la transición 
  // visual se complete antes de que el elemento desaparezca.
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 150);
  }, 5000);
}

// Inicializa el panel de control una vez que el DOM ha sido completamente cargado.
// Esto asegura que todos los elementos del DOM estén disponibles y listos para ser manipulados
// por el script, permitiendo que las funciones de inicialización configuren correctamente
// la interfaz de usuario y los eventos necesarios para el funcionamiento del panel de administración.
document.addEventListener("DOMContentLoaded", initDashboard);
