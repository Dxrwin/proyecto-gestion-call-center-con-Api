/*
 * Módulo de Gestión de Empleados:
 * Este módulo implementa un sistema completo de administración de empleados con las siguientes funcionalidades:
 * 
 * 1. Gestión de Datos:
 *    - Almacenamiento y manipulación de información de empleados
 *    - Operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 *    - Validación de datos y manejo de errores
 * 
 * 2. Interfaz de Usuario:
 *    - Tabla dinámica con paginación
 *    - Formularios para agregar/editar empleados
 *    - Modales de confirmación
 *    - Sistema de notificaciones
 * 
 * 3. Funcionalidades Avanzadas:
 *    - Búsqueda en tiempo real
 *    - Filtrado por departamento y estado
 *    - Selección múltiple de empleados
 *    - Exportación de datos
 * 
 * 4. Optimizaciones:
 *    - Carga perezosa de datos
 *    - Actualización parcial de la interfaz
 *    - Manejo eficiente del estado
 */

// elementos del DOM

//elementos de la tabla de empleados
const employeesTableBody = document.getElementById("employees-table-body");

//elemento del botón de agregar empleado
const addEmployeeBtn = document.getElementById("add-employee-btn");

//elemento del modal de empleado
const employeeModalElement = document.getElementById("employee-modal");

//elemento del modal de empleado y la creacion de un modal de bootstrap
const employeeModal = new bootstrap.Modal(employeeModalElement);

//elemento del formulario de empleado
const employeeForm = document.getElementById("employee-form");

//elemento del botón de guardar empleado
const saveEmployeeBtn = document.getElementById("save-employee-btn");

//elemento del input de búsqueda de empleados
const employeeSearch = document.getElementById("employee-search");

//elemento del botón de búsqueda de empleados
const searchBtn = document.getElementById("search-btn");

//elementos de los filtros de empleados
const departmentFilter = document.getElementById("department-filter");

//elemento del filtro de estado de empleados
const statusFilter = document.getElementById("status-filter");

//elemento del checkbox de seleccionar todos los empleados
const selectAllEmployees = document.getElementById("select-all-employees");

//elemento del botón de eliminar empleados seleccionados
const deleteSelectedBtn = document.getElementById("delete-selected-btn");
//elemento del modal de confirmación de eliminación
const deleteConfirmationModalElement = document.getElementById(
  "delete-confirmation-modal"
);
//elemento para la creacion del modal eliminar
const deleteConfirmationModal = new bootstrap.Modal(
  deleteConfirmationModalElement
);
//elemento del boton confirmar eliminar
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

// Datos de empleados de prueba
const testEmployees = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juan.perez@example.com",
    telefono: "3002548745",
    Area: "Ventas",
    posicion: "Senior Developer",
    estado: "laburando",
    fechaContrato: "2022-03-15",
    direccion: "Calle Principal 123, Ciudad de México",
    descripcion: "Desarrollador con 5 años de experiencia en React y Node.js.",
    Id_empleado: "EMP-001",
    fecha_nacimiento: "1990-05-15",
    contactoEmergencia: "María Pérez",
    telefono_emergencia: "3002548745",
    habilidades: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    rendimiento: {
      productivity: 92,
      quality: 95,
      teamwork: 88,
    },
  },
  {
    id: 2,
    nombre: "Ana",
    apellido: "García",
    correo: "ana.garcia@example.com",
    telefono: "3002548745",
    Area: "publicidad",
    posicion: "publicidad director",
    estado: "laburando",
    fechaContrato: "2021-06-10",
    direccion: "Av. Reforma 456, Ciudad de México",
    descripcion: "Especialista en publicidad digital y campañas en redes sociales.",
    Id_empleado: "EMP-002",
    fecha_nacimiento: "1988-09-22",
    contactoEmergencia: "Carlos García",
    telefono_emergencia: "3002548745",
    habilidades: [
      "publicidad Digital",
      "SEO",
      "Redes Sociales",
      "Google Analytics",
      "Content publicidad",
    ],
    rendimiento: {
      productivity: 90,
      quality: 88,
      teamwork: 95,
    },
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    correo: "carlos.rodriguez@example.com",
    telefono: "3002548745",
    Area: "Sales",
    posicion: "Sales Representative",
    estado: "descansando",
    fechaContrato: "2023-01-05",
    direccion: "Calle Juárez 789, Guadalajara",
    descripcion:
      "En permiso parental hasta junio 2023. Excelente historial de ventas.",
    Id_empleado: "EMP-003",
    fecha_nacimiento: "1985-11-30",
    contactoEmergencia: "Laura Rodríguez",
    telefono_emergencia: "3002548745",
    habilidades: [
      "Ventas",
      "Negociación",
      "CRM",
      "Presentaciones",
      "Atención al Cliente",
    ],
    rendimiento: {
      productivity: 85,
      quality: 82,
      teamwork: 90,
    },
  },
  {
    id: 4,
    nombre: "Laura",
    apellido: "Martínez",
    correo: "laura.martinez@example.com",
    telefono: "3002548745",
    Area: "HR",
    posicion: "HR Specialist",
    estado: "laburando",
    fechaContrato: "2022-09-20",
    direccion: "Av. Insurgentes 321, Ciudad de México",
    descripcion: "Especialista en reclutamiento y desarrollo organizacional.",
    Id_empleado: "EMP-004",
    fecha_nacimiento: "1992-03-18",
    contactoEmergencia: "Roberto Martínez",
    telefono_emergencia: "3002548745",
    habilidades: [
      "Reclutamiento",
      "Selección de Personal",
      "Desarrollo Organizacional",
      "Gestión de Conflictos",
    ],
    rendimiento: {
      productivity: 88,
      quality: 90,
      teamwork: 92,
    },
  },
  {
    id: 5,
    nombre: "Roberto",
    apellido: "López",
    correo: "roberto.lopez@example.com",
    telefono: "3002548745",
    Area: "Finance",
    posicion: "Financial Analyst",
    estado: "esperando ingreso",
    fechaContrato: "2021-11-15",
    direccion: "Calle Hidalgo 654, Monterrey",
    descripcion:
      "Contrato finalizado el 31/03/2023. Excelente en análisis financiero.",
    Id_empleado: "EMP-005",
    fecha_nacimiento: "1987-07-12",
    contactoEmergencia: "Sofía López",
    telefono_emergencia: "3002548745",
    habilidades: [
      "Análisis Financiero",
      "Excel Avanzado",
      "Presupuestos",
      "Proyecciones Financieras",
    ],
    rendimiento: {
      productivity: 91,
      quality: 87,
      teamwork: 75,
    },
  },
  {
    id: 6,
    nombre: "Sofía",
    apellido: "Hernández",
    correo: "sofia.hernandez@example.com",
    telefono: "3002548745",
    Area: "Ventas",
    posicion: "QA Engineer",
    estado: "Active",
    fechaContrato: "2022-05-10",
    direccion: "Av. Universidad 789, Ciudad de México",
    descripcion: "Especialista en pruebas automatizadas y control de calidad.",
    Id_empleado: "EMP-006",
    fecha_nacimiento: "1991-12-05",
    contactoEmergencia: "Miguel Hernández",
    telefono_emergencia: "(555) 432-1098",
    habilidades: [
      "Pruebas Automatizadas",
      "Selenium",
      "JIRA",
      "Gestión de Calidad",
      "Scrum",
    ],
    rendimiento: {
      productivity: 86,
      quality: 94,
      teamwork: 88,
    },
  },
];

// objeto de estado para manejar los empleados
const employeesState = {
  //array de empleados
  employees: [],
  //array de empleados filtrados o los que se muestran en la tabla
  filteredEmployees: [],
  //array de empleados seleccionados
  selectedEmployees: [],
  //array de empleados eliminados
  currentEmployee: null,
  //booleano para saber si se esta editando un empleado o no
  isEditing: false,

  //filtros de empleados, busqueda, posicion/perfil y estado
  filters: {
    search: "",
    posicion: "",
    estado: "",
  },
  //paginacion de empleados, pagina actual, total de paginas y items por pagina
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  },
};

/**
 * Inicialización del Módulo de Empleados:
 * Configura todos los elementos necesarios para el funcionamiento del sistema:
 * - Vincula eventos a los elementos del DOM
 * - Inicializa el estado global
 * - Carga los datos iniciales
 * - Configura los manejadores de eventos
 */
function initEmployees() {
  //crand las funciones de los eventos

  //agregando funcion de agregar empleado, al hacer click en el boton de agregar empleado mostrar el modal
  addEmployeeBtn.addEventListener("click", showAddEmployeeModal);

  //agregando funcion de guardar empleado, al hacer click en el boton de guardar empleado guardar el empleado y cerrar el modal
  saveEmployeeBtn.addEventListener("click", saveEmployee);
  //agregando funcion de buscar empleado usando en elvento input, al escribir en el input de busqueda filtrar los empleados
  employeeSearch.addEventListener("input", handleSearchInput);
  //agregando funcion de aplicar filtros, al hacer click en el boton de buscar empleado aplicar los filtros y mostrar el empleado
  searchBtn.addEventListener("click", applyFilters);
  //agregando la funcion de aplicar los cambios en las opciones de departamento
  departmentFilter.addEventListener("change", applyFilters);
  //agregando la funcion de aplicar los cambios en las opciones de el estado
  statusFilter.addEventListener("change", applyFilters);
  //agregando la funcion de al hacer clicl en obtener todos los empleados en las opciones del filtro traera todos los empleados
  selectAllEmployees.addEventListener("change", handleSelectAll);
  //agregando la funcion al seleccionar el boton eliminar empleado, al hacer click en el boton de eliminar empleado mostrar el modal de confirmacion de eliminacion
  deleteSelectedBtn.addEventListener("click", exportarReportePdf);
  //agregando la funcion al boton para eliminar el empleado
  //confirmDeleteBtn.addEventListener("click", exportarReportePdf);

  // Cargar datos de los empleados
  loadEmployees();
}

/**
 * Carga de Datos de Empleados:
 * - Muestra un indicador de carga mientras se obtienen los datos
 * - Realiza la petición a la API o carga datos de prueba
 * - Actualiza el estado global con los datos recibidos
 * - Inicializa los filtros y la paginación
 * - Actualiza la interfaz de usuario
 */
function loadEmployees() {
  // Mostrar un estado de carga mientras se obtienen los datos
  employeesTableBody.innerHTML =
    '<tr><td colspan="8" class="text-center"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando empleados...</td></tr>';

  // Configuración de la petición a la API
  const apiConfig = {
    method: 'GET',
    url: 'http://127.0.0.1:8000/empleado', // URL de la API
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Token de autenticación
    }
  };

  // Realizar la petición a la API usando Axios
  axios(apiConfig)
    .then(response => {
      console.log("datos de los empleados obtenidos en la api = \n =",response.data)
      // Verificar si la respuesta es exitosa
      if (response.status === 200) {
        // Actualizar el estado con los datos recibidos
        employeesState.employees = response.data;
        console.log("datos añadidos al esatdo global de empleados =",employeesState.employees)
        
        // Filtrar los empleados inicialmente
        employeesState.filteredEmployees = [...response.data];
        
        // Actualizar la tabla de empleados
        updateEmployeesTable();
        
        // Mostrar notificación de éxito
        showNotification('Datos de empleados cargados exitosamente', 'success');
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    })
    .catch(error => {
      console.error('Error al cargar empleados:', error);
      
      // Mostrar mensaje de error en la tabla
      employeesTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-danger">
            <i class="fas fa-exclamation-circle me-2"></i>
            Error al cargar los empleados. Por favor, intente nuevamente.
          </td>
        </tr>
      `;
      
      // Mostrar notificación de error
      showNotification('Error al cargar los empleados', 'error');
      
      // En caso de error, cargar datos de prueba como respaldo
      console.log('Cargando datos de prueba como respaldo...');
      employeesState.employees = testEmployees;
      employeesState.filteredEmployees = [...testEmployees];
      updateEmployeesTable();
    })
    .finally(() => {
      // Ocultar el spinner de carga
      const spinner = document.querySelector('.spinner-border');
      if (spinner) {
        spinner.remove();
      }
    });
}

/**
 * Actualización de la Tabla de Empleados:
 * - Calcula los índices de paginación
 * - Filtra los empleados según los criterios actuales
 * - Genera el HTML dinámico para cada fila
 * - Actualiza los controles de paginación
 * - Vincula eventos a los elementos recién creados
 * - Maneja la selección múltiple de empleados
 */
function updateEmployeesTable() {
  //calcula los indices de paginacion para obtener los empleados visibles
  //obtener la pagina actual y el total de items por pagina
  const startIndex =
    (employeesState.pagination.currentPage - 1) *
    employeesState.pagination.itemsPerPage;
  console.log("funcion actualizar tabla, pagina actual = ", startIndex);

  //obtener la ultima pagina y el total de items por pagina
  const endIndex = startIndex + employeesState.pagination.itemsPerPage;
  
  // De la lista de empleados que han sido filtrados según los criterios actuales (como búsqueda, departamento, estado, etc.),
  // obtenemos un subconjunto de empleados que serán visibles en la tabla de acuerdo con la paginación actual.
  // Utilizamos el método slice para crear una copia superficial de una porción del array de empleados filtrados.
  // Este método toma dos argumentos: el índice de inicio y el índice de fin, y devuelve los elementos comprendidos entre estos índices.
  // Esto nos permite mostrar solo los empleados correspondientes a la página actual, mejorando así la eficiencia y la experiencia del usuario.
  const paginatedEmployees = employeesState.filteredEmployees.slice(
    startIndex,
    endIndex
  );

  // Actualizar el total de páginas
  // El método Math.ceil se utiliza para redondear hacia arriba al número entero más cercano,
  // asegurando que cualquier fracción de página adicional se cuente como una página completa.
  // Esto es crucial para la paginación, ya que garantiza que todos los empleados filtrados
  // se distribuyan adecuadamente en las páginas disponibles.
  // Calculamos el total de páginas dividiendo el número total de empleados filtrados
  // por el número de elementos que se muestran por página, lo que nos permite determinar
  // cuántas páginas completas se necesitan para mostrar todos los empleados.
  employeesState.pagination.totalPages = Math.ceil(
    employeesState.filteredEmployees.length /
      employeesState.pagination.itemsPerPage
  );

  // Verificar si hay empleados para mostrar
  if (paginatedEmployees.length === 0) {
    employeesTableBody.innerHTML =
      '<tr><td colspan="8" class="text-center">No se encontraron empleados</td></tr>';
    return;
  }

  // Generar filas de la tabla
  let tableHTML = "";

  // Iterar sobre los empleados paginados y generar el HTML para cada fila
  //el metodo forEach ejecuta una funcion proporcionada una vez por cada elemento del array
  paginatedEmployees.forEach((employee) => {
    // Verificar si el empleado está seleccionado y agregar la clase correspondiente
    //el metodo includes devuelve true si el array contiene el elemento especificado, en este caso el id del empleado
    const isSelected = employeesState.selectedEmployees.includes(employee.id);

    //el tableHTML es la variable que genera las filas de cada empleado con cada informacion
    //el template string es una forma de crear cadenas de texto multilinea y con interpolacion de variables
    //la variable incluye el checkbox, el nombre, el correo, el departamento, la posicion y el estado del empleado
    //el estado del empleado se obtiene de la funcion getStatusClass que devuelve la clase css correspondiente al estado del empleado
    //el boton de editar, eliminar y ver detalles del empleado
    //el boton de editar y eliminar tienen un data-attribute que contiene el id del empleado, para poder identificarlo al hacer
    tableHTML += `
      <tr data-employee-id="${employee.id}" class="${
      isSelected ? "table-active" : ""
    }">
        <td>
          <div class="form-check">
            <input class="form-check-input employee-checkbox" type="checkbox" value="${
              employee.id
            }" ${isSelected ? "checked" : ""}>
            <label class="form-check-label"></label>
          </div>
        </td>
        <td>
          <div class="d-flex align-items-center">
            <img src="/src/assets/img/${employee.imagen_perfil}" alt="${employee.imagen_perfil} ${employee.apellido}" class="employee-avatar me-2">
            <div>
              <div class="employee-name">${employee.nombre} ${employee.apellido}</div>
              <div class="employee-position">${employee.posicion}</div>
            </div>
          </div>
        </td>
        <td>${employee.correo}</td>
        <td>${employee.rol}</td>
        <td>${employee.posicion}</td>
        <td>
          <span class="status-badge ${getStatusClass(testEmployees[employee.id-1].estado)}">${testEmployees[employee.id-1].estado}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-primary action-btn me-1" data-action="edit" data-employee-id="${
            employee.id
          }">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger action-btn" data-action="delete" data-employee-id="${
            employee.id
          }">
            <i class="fas fa-trash"></i>
          </button>
        </td>
        <td>
          <button class="btn btn-sm btn-primary action-btn" data-action="details" data-employee-id="${
            employee.id
          }">
            <i class="fas fa-eye me-1"></i> Ver Detalles
          </button>
        </td>
      </tr>
    `;
  });


  //cada fila iterada se agrega a la tabla de empleados
  //el innerHTML es una propiedad que establece o obtiene el contenido HTML de un elemento
  employeesTableBody.innerHTML = tableHTML;

  //con el querySelectorAll se seleccionan todos los botones de editar y se iteran con un forEach
  //agregando un event listener a cada boton de editar, al hacer click en el boton de editar se llama a la funcion editEmployee
  document.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      //el data-employee-id es un atributo personalizado que contiene el id del empleado, se obtiene con el metodo getAttribute
      //el metodo Number.parseInt convierte una cadena a un numero entero en este caso el id del empleado
      //lo almacena en la variable employeeId
      const employeeId = Number.parseInt(btn.getAttribute("data-employee-id"));
      //llama a la funcion editEmployee y le pasa el id del empleado
      //la funcion editEmployee busca el empleado en el array de empleados y lo edita
      editEmployee(employeeId);
    });
  });

  //con el querySelectorAll se seleccionan todos los botones de eliminar y se iteran con un forEach
  //agregando un event listener a cada boton de eliminar, al hacer click en el boton de eliminar se llama a la funcion showDeleteConfirmation
  document.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      //el data-employee-id es un atributo personalizado que contiene el id del empleado, se obtiene con el metodo getAttribute
      //el metodo Number.parseInt convierte una cadena a un numero entero en este caso el id del empleado
      //lo almacena en la variable employeeId
      const employeeId = Number.parseInt(btn.getAttribute("data-employee-id"));
      //llama a la funcion showDeleteConfirmation y le pasa el id del empleado
      //la funcion showDeleteConfirmation muestra un modal de confirmacion de eliminacion
      showDeleteConfirmation([employeeId]);
    });
  });

  //con el querySelectorAll se seleccionan todos los botones de ver detalles y se iteran con un forEach
  //agregando un event listener a cada boton de ver detalles, al hacer click en el boton de ver detalles se llama a la funcion viewEmployeeDetails
  document.querySelectorAll('[data-action="details"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      //el data-employee-id es un atributo personalizado que contiene el id del empleado, se obtiene con el metodo getAttribute
      //el metodo Number.parseInt convierte una cadena a un numero entero en este caso el id del empleado
      //lo almacena en la variable employeeId
      const employeeId = Number.parseInt(btn.getAttribute("data-employee-id"));
      //llama a la funcion viewEmployeeDetails y le pasa el id del empleado
      //la funcion viewEmployeeDetails busca el empleado en el array de empleados y lo muestra en un modal
      viewEmployeeDetails(employeeId);
    });
  });

  //usando el querySelectorAll se seleccionan todos los checkboxes de empleados y se itera con un forEach
  //agregando un event listener a cada checkbox de empleado, al hacer click en el checkbox de empleado se llama a la funcion handleEmployeeSelection
  document.querySelectorAll(".employee-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      //el value del checkbox es el id del empleado, se obtiene con el metodo value
      //el metodo Number.parseInt convierte una cadena a un numero entero en este caso el id del empleado
      const employeeId = Number.parseInt(checkbox.value);
      //llama a la funcion handleEmployeeSelection y le pasa el id del empleado y el estado del checkbox
      //la funcion handleEmployeeSelection agrega o elimina el id del empleado del array de empleados seleccionados
      //y actualiza el estado del checkbox de seleccionar todos y el boton de eliminar seleccionados
      handleEmployeeSelection(employeeId, checkbox.checked);
    });
  });

  // Actualizar el estado del botón de eliminar seleccionados
  updateDeleteSelectedButton();

  // Actualizar la paginación
  updatePagination();
}

/**
 * Visualización de Detalles del Empleado:
 * - Busca el empleado por ID en el estado global
 * - Almacena los datos en localStorage para persistencia
 * - Redirige a la página de detalles
 * - Maneja casos de error y empleados no encontrados
 */
function viewEmployeeDetails(employeeId) {
  //para encontrar el empleado se usa el metodo find que devuelve el primer elemento que cumple con la condicion
  //el id del empleado se obtiene de la variable employeeId
  const employee = employeesState.employees.find(
    (emp) => emp.id === employeeId
  );
  //si no se encuentra el empleado se retorna undefined
  if (!employee) {
    return;
  }
  //si se encuentra el empleado se guarda en el localStorage para poder acceder a el en la pagina de detalles
  //el localStorage es un objeto que permite almacenar datos en el navegador del usuario
  //redirige a la pagina de detalles del empleado

  // Guardar los datos del empleado en localStorage para la página de detalles
  localStorage.setItem("id_empleado_detalle", JSON.stringify(employee.id));
  localStorage.setItem("nombre_empleado_seleccionado", JSON.stringify(employee.nombre));

  // Redirigir a la página de detalles del empleado
  window.location.href = "detalles-usuario.html";
}

/**
 * Gestión de Paginación:
 * - Calcula el número total de páginas
 * - Genera los controles de navegación
 * - Maneja los eventos de cambio de página
 * - Actualiza la visualización de la página actual
 * - Deshabilita botones cuando es necesario
 */
function updatePagination() {
  // Obtener el elemento Html que controla la paginación
  const pagination = document.querySelector(".pagination");
  //si no existe el elemento de paginacion se retorna undefined y la funcion termina
  if (!pagination) return;

  //obtener la pagina actual y el total de paginas del estado global de empleados.pagination
  const { currentPage, totalPages } = employeesState.pagination;

  //se crea una vaariable para construir dinamicamente el contenido html de los controles de paginacion
  let paginationHTML = "";

  //para el Botón anterior
  //si la pagina es la primera (currentPage === 1) se desactiva el boton anterior añadiendo la calse diabled
  //el atributo data-page contiene el numero de la pagina anterior
  paginationHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${
        currentPage - 1
      }" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;

  //calcular el rango de paginas que se mostraran
  //la primera pagina visible sera la pagina actual menos 2, pero no menor a 1
  const startPage = Math.max(1, currentPage - 2);
  //la ultima pagina visible que es la pagina inicial mas 4 pero no puede exceder el total de paginas
  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    //la iteracion generara un boton para cada numero de pagina dentro ddel rango
    //si la pagina es la actual se le agrega la clase active para resaltar el boton
    paginationHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // Botón siguiente
  //se genera el boton siguiente, si la pagina actual es la ultima se desactiva el boton siguiente añadiendo la clase disabled
  //el atributo data-page contiene el numero de la pagina siguiente
  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${
        currentPage + 1
      }" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;

  //inserta el html generado dinamicamente en el contenedor de paginacion
  pagination.innerHTML = paginationHTML;

  //selecciona los enlaces con la clase page-link (botones de paginacion)
  document.querySelectorAll(".page-link").forEach((link) => {
    //agrega un evento click a cada enlace
    link.addEventListener("click", (e) => {
      e.preventDefault();
      //se obtiene el numero de pagina del atributo data-page del enlace
      const page = Number.parseInt(link.getAttribute("data-page"));
      //si el numero es valido entre 1 y el total de paginas se actualiza la pagina actual en el estado
      //y llama a la funcion updateEmployeesTable para actualizar la tabla de empleados
      if (page >= 1 && page <= totalPages) {
        employeesState.pagination.currentPage = page;
        updateEmployeesTable();
      }
    });
  });
}

/**
 * Clasificación de Estados:
 * - Asigna clases CSS según el estado del empleado
 * - Maneja diferentes estados: Activo, Inactivo, En Permiso
 * - Proporciona estilos visuales consistentes
 * - Facilita la identificación visual del estado
 */
function getStatusClass(status) {
  switch (status) {
    case "laburando":
      return "status-active";
    case "esperando ingreso":
      return "status-inactive";
    case "descansando":
      return "status-leave";
    default:
      return "";
  }
}

/**
 * Gestión del Modal de Agregar Empleado:
 * - Limpia y resetea el formulario
 * - Establece valores predeterminados
 * - Actualiza el título y estado del modal
 * - Prepara el formulario para nuevo ingreso
 * - Maneja la visualización del modal
 */
function showAddEmployeeModal() {
  // Resetear el formulario o limpiar los campos
  employeeForm.reset();

  // Establecer la fecha actual como fecha de contratación predeterminada
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("emp-hire-date").value = today;

  // Actualizar el título del modal
  document.getElementById("employee-modal-label").textContent =
    "Agregar Empleado";

  //se actualiza el estado global de los empleados
  //se establece en false para indicar que no se esta editando un empleado
  employeesState.isEditing = false;
  //se esatblece en null por que no hay un empleado seleccionado
  employeesState.currentEmployee = null;

  // Mostrar el modal en pantalla
  employeeModal.show();
}

/**
 * Edición de Empleado:
 * - Busca el empleado por ID
 * - Carga los datos en el formulario
 * - Actualiza el estado de edición
 * - Configura el modal para edición
 * - Maneja errores de empleado no encontrado
 */
function editEmployee(employeeId) {
  // Encontrar el empleado usando el metodo find del array employees
  //se usa la funcion que si el id coincida con el employeeId
  const employee = employeesState.employees.find(
    (emp) => emp.id === employeeId
  );
  //si no lo encuentra la funcion se termina
  if (!employee) {
    return;
  }

  // Actualizar el estado
  //se actualizan dos propiedades del objeto employeesState, isEditing y currentEmployee
  employeesState.isEditing = true;
  //se asigna el objeto del empleado encontrado para que este disponible en el estado global
  employeesState.currentEmployee = employee;

  // Llenar el formulario con los datos del empleado encontrado
  //de esta manera se visualizan los datos del empleado en el modal para ser editados
  document.getElementById("emp-first-name").value = employee.nombre;
  document.getElementById("emp-last-name").value = employee.apellido;
  document.getElementById("emp-email").value = employee.correo;
  document.getElementById("emp-phone").value = employee.telefono;
  document.getElementById("emp-department").value = employee.posicion;
  document.getElementById("emp-position").value = employee.posicion;
  document.getElementById("emp-hire-date").value = employee.fecha_contratacion;
  document.getElementById("emp-status").value = employee.estado;
  document.getElementById("emp-address").value = employee.fecha_nacimiento;
  document.getElementById("emp-notes").value = employee.habilidades;

  //agregar api para actualizar

  // Actualizar el título del modal
  document.getElementById("employee-modal-label").textContent =
    "Editar Empleado";

  // Mostrar el modal
  //se usa el objeto employeemodal una istancia de bootstrap para mostrar el modal en pantalla
  employeeModal.show();
}

/**
 * Guardado de Empleado:
 * - Valida los datos del formulario
 * - Prepara los datos para guardar
 * - Decide entre crear o actualizar
 * - Maneja la respuesta del servidor
 * - Actualiza la interfaz de usuario
 * - Muestra notificaciones de éxito/error
 */
function saveEmployee() {
  //antes de guardar el empleado se valida el formulario usando checkvalidity
  //checkValidity verifica si todos los campos cumplen con las restricciones de validacion como required, pattern, etc.
  //devuelve true si todos lso campos del formulario son validos y false al menos un campo no cumple con las restricciones
  if (!employeeForm.checkValidity()) {
    //si el formualrio no es valido devuelve false y se llama reporVALIDITY
    //reportValidity muestra los mensajes de error de validacion en los campos del formulario
    employeeForm.reportValidity();
    return;
  }

  // Obtener los datos del formulario
  const employeeData = {
    firstName: document.getElementById("emp-first-name").value,
    lastName: document.getElementById("emp-last-name").value,
    email: document.getElementById("emp-email").value,
    phone: document.getElementById("emp-phone").value,
    department: document.getElementById("emp-department").value,
    position: document.getElementById("emp-position").value,
    hireDate: document.getElementById("emp-hire-date").value,
    status: document.getElementById("emp-status").value,
    address: document.getElementById("emp-address").value,
    notes: document.getElementById("emp-notes").value,
  };

  if (employeesState.isEditing) {
    //si el estado es true se llama a la funcion updateEmployee pasandole el id del empleado y los datos del empleado
    //la funcion updateEmployee actualiza el empleado en el array de empleados
    updateEmployee(employeesState.currentEmployee.id, employeeData);
  } else {
    //si el estado es false se llama a la funcion createEmployee pasandole los datos del empleado
    //la funcion createEmployee crea un nuevo empleado y lo agrega al array de empleados
    //se le asigna un id aleatorio al empleado creado y se le asigna un employeeId que es un string con el formato EMP-001, EMP-002, etc.

    createEmployee(employeeData);
  }
}

/**
 * Creación de Nuevo Empleado:
 * - Genera ID único
 * - Establece valores predeterminados
 * - Agrega al estado global
 * - Actualiza la interfaz
 * - Maneja la respuesta del servidor
 */
function createEmployee(employeeData) {
  // Crear un nuevo objeto de empleado
  const newEmployee = {
    id: Math.floor(Math.random() * 1000) + 100, //genera ID aleatorio
    ...employeeData, //se le asignan los datos del empleado de employeeData
    //se genera un identificador unico usando formato EMP-XXX donde XXX es un numero basado en la longitud del array mas 1
    //se usa el metodo padStart para agregar ceros a la izquierda hasta completar 3 digitos
    employeeId: `EMP-${(employeesState.employees.length + 1)
      .toString()
      .padStart(3, "0")}`,
    birthDate: null,
    emergencyContact: "",
    emergencyPhone: "",
    skills: ["javascript", "html", "css"],
    performance: {
      productivity: 80,
      quality: 80,
      teamwork: 80,
    },
  };

  // Agregar al nuevo empleado al estado global
  //el nuevo empleado se le agrega al array utilizando el metodo push
  employeesState.employees.push(newEmployee);

  //se llama la funcion applyFilters para aplicar los filtros y mostrar el nuevo empleado en la tabla
  applyFilters();

  // Ocultar el modal el metodo hide es de bootstrap para ocultar el modal
  employeeModal.hide();

  // Mostrar mensaje de éxito
  showNotification("Empleado creado exitosamente", "success");
}

/**
 * Actualización de Empleado Existente:
 * - Busca el empleado por ID
 * - Actualiza los datos
 * - Mantiene datos históricos
 * - Actualiza la interfaz
 * - Maneja errores de actualización
 */
function updateEmployee(employeeId, employeeData) {
  console.log("entrando al modal e inicializando la funcion editar empleado");

  console.log(
    "funcion actualizar Empleado \n id_empleado obtenido = ",
    employeeId,
    " \n datos del empleado por el id = ",
    employeesState.employees[employeeId - 1],
    "\n datos ingresados que actualizaran al empleado = ",
    employeeData
  );

  const index = employeesState.employees.findIndex(
    (emp) => emp.id === employeeId
  );
  //si el empleado es encontrado se actualiza el empleado en el array de empleados
  if (index !== -1) {
    employeesState.employees[index] = {
      //se usa el operador de propagacion (spread operator) para copiar las propiedades del empleado existente
      //y luego se sobrescriben las propiedades que se desean actualizar con los nuevos datos
      //el operador de propagacion permite crear un nuevo objeto con las propiedades del objeto existente
      //y luego se sobrescriben las propiedades que se desean actualizar con los nuevos datos
      ...employeesState.employees[index],
      ...employeeData,
    };

    // Aplicar filtros para actualizar los empleados filtrados
    applyFilters();

    // Ocultar el modal
    employeeModal.hide();

    // Mostrar mensaje de éxito
    showNotification("Empleado actualizado exitosamente", "success");
  }
}

/**
 * Confirmación de Eliminación:
 * - Valida empleados seleccionados
 * - Muestra mensaje personalizado
 * - Maneja eliminación individual/grupal
 * - Actualiza el estado global
 * - Muestra confirmación visual
 */
function showDeleteConfirmation(employeeIds) {
  // Si se proporcionan employeeIds, usarlos; de lo contrario, usar los empleados seleccionados
  const idsToDelete = employeeIds || employeesState.selectedEmployees;

  if (idsToDelete.length === 0) {
    showNotification("No hay empleados seleccionados para eliminar", "warning");
    return;
  }

  // Actualizar el mensaje de confirmación
  let confirmationMessage = "";
  if (idsToDelete.length === 1) {
    const employee = employeesState.employees.find(
      (emp) => emp.id === idsToDelete[0]
    );
    confirmationMessage = `¿Está seguro que desea eliminar al empleado "${employee.nombre} ${employee.apellido}"? Esta acción no se puede deshacer.`;
  }
  document.getElementById("delete-confirmation-content").textContent =
    confirmationMessage;

  // Almacenar los IDs a eliminar en el estado
  employeesState.selectedEmployees = idsToDelete;

  // Mostrar el modal de confirmación
  deleteConfirmationModal.show();
}

/**
 * Eliminación de Empleados:
 * - Elimina empleados seleccionados
 * - Actualiza el estado global
 * - Limpia selecciones
 * - Actualiza la interfaz
 * - Muestra notificación de éxito
 */
function deleteSelectedEmployees() {
  if (employeesState.selectedEmployees.length === 0) {
    return;
  }

  // Eliminar los empleados del estado
  employeesState.employees = employeesState.employees.filter(
    (emp) => !employeesState.selectedEmployees.includes(emp.id)
  );

  // Limpiar los empleados seleccionados
  employeesState.selectedEmployees = [];

  // Aplicar filtros para actualizar los empleados filtrados
  applyFilters();

  // Ocultar el modal de confirmación
  deleteConfirmationModal.hide();

  // Actualizar el checkbox de seleccionar todos
  selectAllEmployees.checked = false;

  // Mostrar mensaje de éxito
  showNotification("Empleados eliminados exitosamente", "success");
}

/**
 * Gestión de Selección de Empleados:
 * - Maneja selección individual
 * - Actualiza estado de selección
 * - Mantiene sincronización UI
 * - Actualiza botones de acción
 * - Maneja selección múltiple
 */
function handleEmployeeSelection(employeeId, isSelected) {
  if (isSelected) {
    // Agregar a los empleados seleccionados si no está incluido ya
    if (!employeesState.selectedEmployees.includes(employeeId)) {
      employeesState.selectedEmployees.push(employeeId);
    }
  } else {
    // Eliminar de los empleados seleccionados
    employeesState.selectedEmployees = employeesState.selectedEmployees.filter(
      (id) => id !== employeeId
    );
  }

  // Actualizar el checkbox de seleccionar todos
  updateSelectAllCheckbox();

  // Actualizar el botón de eliminar seleccionados
  updateDeleteSelectedButton();

  // Actualizar el resaltado de filas
  document.querySelectorAll("tr[data-employee-id]").forEach((row) => {
    const rowEmployeeId = Number.parseInt(row.getAttribute("data-employee-id"));
    if (employeesState.selectedEmployees.includes(rowEmployeeId)) {
      row.classList.add("table-active");
    } else {
      row.classList.remove("table-active");
    }
  });
}

/**
 * Selección Global de Empleados:
 * - Maneja selección/deselección total
 * - Actualiza todos los checkboxes
 * - Sincroniza estado global
 * - Actualiza botones de acción
 * - Maneja estados intermedios
 */
function handleSelectAll() {
  const isChecked = selectAllEmployees.checked;

  if (isChecked) {
    // Seleccionar todos los empleados visibles
    employeesState.selectedEmployees = employeesState.filteredEmployees.map(
      (emp) => emp.id
    );
  } else {
    // Deseleccionar todos los empleados
    employeesState.selectedEmployees = [];
  }

  // Actualizar los checkboxes
  document.querySelectorAll(".employee-checkbox").forEach((checkbox) => {
    checkbox.checked = isChecked;
  });

  // Actualizar el botón de eliminar seleccionados
  updateDeleteSelectedButton();

  // Actualizar el resaltado de filas
  document.querySelectorAll("tr[data-employee-id]").forEach((row) => {
    const employeeId = Number.parseInt(row.getAttribute("data-employee-id"));
    if (employeesState.selectedEmployees.includes(employeeId)) {
      row.classList.add("table-active");
    } else {
      row.classList.remove("table-active");
    }
  });
}

/**
 * Actualización de Checkbox Global:
 * - Calcula estado de selección
 * - Maneja estados indeterminados
 * - Actualiza visualización
 * - Sincroniza con selecciones
 */
function updateSelectAllCheckbox() {
  const visibleEmployeeIds = employeesState.filteredEmployees.map(
    (emp) => emp.id
  );
  const allSelected = visibleEmployeeIds.every((id) =>
    employeesState.selectedEmployees.includes(id)
  );
  const someSelected = visibleEmployeeIds.some((id) =>
    employeesState.selectedEmployees.includes(id)
  );

  selectAllEmployees.checked = allSelected;
  selectAllEmployees.indeterminate = someSelected && !allSelected;
}

/**
 * Actualización de Botón Exportar PDF:
 * - Habilita/deshabilita según la existencia de empleados
 * - Actualiza estado visual del botón
 * - Maneja casos de tabla vacía
 */
function updateDeleteSelectedButton() {
  // Verificar si hay empleados en la tabla filtrada
  const hasEmployees = employeesState.filteredEmployees.length > 0;
  
  // Habilitar o deshabilitar el botón según la existencia de empleados
  deleteSelectedBtn.disabled = !hasEmployees;
  
  // Actualizar el texto del botón según su estado
  if (hasEmployees) {
    deleteSelectedBtn.innerHTML = '<i class="fas fa-file-pdf me-2"></i>Exportar PDF';
    deleteSelectedBtn.classList.remove('btn-danger');
    deleteSelectedBtn.classList.add('btn-success');
  } else {
    deleteSelectedBtn.innerHTML = '<i class="fas fa-file-pdf me-2"></i>Sin datos para exportar';
    deleteSelectedBtn.classList.remove('btn-success');
    deleteSelectedBtn.classList.add('btn-danger');
  }
}

/**
 * Manejo de Búsqueda:
 * - Procesa entrada en tiempo real
 * - Normaliza texto de búsqueda
 * - Actualiza filtros globales
 * - Prepara para filtrado
 */
function handleSearchInput() {
  employeesState.filters.search = employeeSearch.value.trim().toLowerCase();
}

/**
 * Aplicación de Filtros:
 * Esta función se encarga de filtrar los empleados según los criterios seleccionados
 * y actualizar la visualización de la tabla. Combina múltiples filtros y maneja
 * la paginación de los resultados.
 * 
 * Flujo de la función:
 * 1. Actualiza los valores de los filtros desde los inputs
 * 2. Aplica los filtros a la lista de empleados
 * 3. Actualiza la paginación
 * 4. Refresca la tabla con los resultados filtrados
 */
function applyFilters() {
  // 1. ACTUALIZACIÓN DE VALORES DE FILTROS
  // Obtener y normalizar los valores de los filtros desde los elementos del DOM
  employeesState.filters.search = employeeSearch.value.trim().toLowerCase();
  employeesState.filters.posicion = departmentFilter.value;
  employeesState.filters.estado = statusFilter.value;

  // Desestructurar los filtros para facilitar su uso
  const { search, posicion, estado } = employeesState.filters;

  // 2. APLICACIÓN DE FILTROS
  // Filtrar los empleados según los criterios seleccionados
  employeesState.filteredEmployees = employeesState.employees.filter((employee) => {
    // 2.1 FILTRO DE BÚSQUEDA
    // Busca coincidencias en múltiples campos del empleado
    const searchMatch =
      !search || // Si no hay término de búsqueda, incluir todos
      employee.nombre.toLowerCase().includes(search) || // Buscar en nombre
      employee.apellido.toLowerCase().includes(search) || // Buscar en apellido
      employee.correo.toLowerCase().includes(search) || // Buscar en correo
      employee.posicion.toLowerCase().includes(search); // Buscar en posición

    // 2.2 FILTRO DE POSICIÓN/PERFIL
    // Verifica si el empleado coincide con la posición seleccionada
    const positionMatch = !posicion || employee.posicion === posicion;

    // 2.3 FILTRO DE ESTADO
    // Verifica si el empleado coincide con el estado seleccionado
    const statusMatch = !estado || employee.estado === estado;

    // 2.4 COMBINACIÓN DE FILTROS
    // El empleado se incluye en los resultados solo si cumple con TODOS los filtros
    return searchMatch && positionMatch && statusMatch;
  });

  // 3. ACTUALIZACIÓN DE PAGINACIÓN
  // Resetear a la primera página para evitar problemas de navegación
  employeesState.pagination.currentPage = 1;

  // 4. ACTUALIZACIÓN DE LA INTERFAZ
  // Actualizar la tabla con los empleados filtrados
  updateEmployeesTable();

  // Actualizar el estado del checkbox de seleccionar todos
  updateSelectAllCheckbox();

  // 5. REGISTRO Y MONITOREO (opcional, para debugging)
  console.log('Filtros aplicados:', {
    búsqueda: search,
    posición: posicion,
    estado: estado,
    totalEmpleados: employeesState.employees.length,
    empleadosFiltrados: employeesState.filteredEmployees.length
  });
}

/**
 * Sistema de Notificaciones:
 * - Muestra mensajes temporales
 * - Soporta múltiples tipos
 * - Auto-eliminación
 * - Posicionamiento fijo
 * - Estilos contextuales
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

  // Auto-eliminar después de 5 segundos
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 150);
  }, 5000);
}

/**
 * Exportación de Reporte PDF:
 * - Genera un PDF con los datos actuales de la tabla
 * - Incluye los filtros aplicados
 * - Formatea los datos para mejor presentación
 * - Agrega encabezados y estilos
 * - Maneja la descarga del archivo
 */
function exportarReportePdf() {
  // Crear una nueva instancia de jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Configurar el título del documento
  const title = "Reporte de Empleados";
  const fecha = new Date().toLocaleDateString();
  
  // Agregar título y fecha
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Fecha: ${fecha}`, 14, 22);

  // Agregar información de filtros si existen
  let filtrosInfo = "Filtros aplicados: ";
  if (employeesState.filters.search) {
    filtrosInfo += `Búsqueda: "${employeesState.filters.search}" `;
  }
  if (employeesState.filters.posicion) {
    filtrosInfo += `posicion: "${employeesState.filters.posicion}" `;
  }
  if (employeesState.filters.estado) {
    filtrosInfo += `Estado: "${employeesState.filters.estado}" `;
  }
  
  if (filtrosInfo !== "Filtros aplicados: ") {
    doc.setFontSize(8);
    doc.text(filtrosInfo, 14, 30);
  }

  // Preparar los datos para la tabla
  const tableData = employeesState.filteredEmployees.map(employee => [
    employee.nombre + " " + employee.apellido,
    employee.correo,
    employee.rol,
    employee.posicion,
    employee.estado
  ]);

  // Configurar las columnas de la tabla
  const tableColumns = [
    { header: 'Nombre', dataKey: 'nombre' },
    { header: 'Correo', dataKey: 'correo' },
    { header: 'Rol', dataKey: 'rol' },
    { header: 'Posición', dataKey: 'posicion' },
    { header: 'Estado', dataKey: 'estado' }
  ];

  // Configurar opciones de la tabla
  const tableOptions = {
    startY: 35,
    head: [['Nombre', 'Correo', 'Rol', 'Posición', 'Estado']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 35 }
  };

  // Agregar la tabla al documento
  doc.autoTable(tableOptions);

  // Agregar pie de página con el total de registros
  const finalY = doc.lastAutoTable.finalY || 35;
  doc.setFontSize(8);
  doc.text(
    `Total de registros: ${employeesState.filteredEmployees.length}`,
    14,
    finalY + 10
  );

  // Generar el nombre del archivo
  const fileName = `Reporte_Empleados_${fecha.replace(/\//g, '-')}.pdf`;

  // Guardar el PDF
  doc.save(fileName);

  // Mostrar notificación de éxito
  showNotification('Reporte PDF generado exitosamente', 'success');
}

// Inicialización del módulo cuando el DOM está listo
document.addEventListener("DOMContentLoaded", initEmployees);
