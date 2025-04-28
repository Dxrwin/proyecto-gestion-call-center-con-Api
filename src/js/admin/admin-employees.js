/*
 * funcionalidad de empleados
  gestion de empleados,crud, busqueda, filtros, paginacion 
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
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@example.com",
    phone: "(555) 123-4567",
    department: "Engineering",
    position: "Senior Developer",
    status: "Active",
    hireDate: "2022-03-15",
    address: "Calle Principal 123, Ciudad de México",
    notes: "Desarrollador con 5 años de experiencia en React y Node.js.",
    employeeId: "EMP-001",
    birthDate: "1990-05-15",
    emergencyContact: "María Pérez",
    emergencyPhone: "(555) 987-6543",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    performance: {
      productivity: 92,
      quality: 95,
      teamwork: 88,
    },
  },
  {
    id: 2,
    firstName: "Ana",
    lastName: "García",
    email: "ana.garcia@example.com",
    phone: "(555) 234-5678",
    department: "Marketing",
    position: "Marketing Manager",
    status: "Active",
    hireDate: "2021-06-10",
    address: "Av. Reforma 456, Ciudad de México",
    notes: "Especialista en marketing digital y campañas en redes sociales.",
    employeeId: "EMP-002",
    birthDate: "1988-09-22",
    emergencyContact: "Carlos García",
    emergencyPhone: "(555) 876-5432",
    skills: [
      "Marketing Digital",
      "SEO",
      "Redes Sociales",
      "Google Analytics",
      "Content Marketing",
    ],
    performance: {
      productivity: 90,
      quality: 88,
      teamwork: 95,
    },
  },
  {
    id: 3,
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@example.com",
    phone: "(555) 345-6789",
    department: "Sales",
    position: "Sales Representative",
    status: "On Leave",
    hireDate: "2023-01-05",
    address: "Calle Juárez 789, Guadalajara",
    notes:
      "En permiso parental hasta junio 2023. Excelente historial de ventas.",
    employeeId: "EMP-003",
    birthDate: "1985-11-30",
    emergencyContact: "Laura Rodríguez",
    emergencyPhone: "(555) 765-4321",
    skills: [
      "Ventas",
      "Negociación",
      "CRM",
      "Presentaciones",
      "Atención al Cliente",
    ],
    performance: {
      productivity: 85,
      quality: 82,
      teamwork: 90,
    },
  },
  {
    id: 4,
    firstName: "Laura",
    lastName: "Martínez",
    email: "laura.martinez@example.com",
    phone: "(555) 456-7890",
    department: "HR",
    position: "HR Specialist",
    status: "Active",
    hireDate: "2022-09-20",
    address: "Av. Insurgentes 321, Ciudad de México",
    notes: "Especialista en reclutamiento y desarrollo organizacional.",
    employeeId: "EMP-004",
    birthDate: "1992-03-18",
    emergencyContact: "Roberto Martínez",
    emergencyPhone: "(555) 654-3210",
    skills: [
      "Reclutamiento",
      "Selección de Personal",
      "Desarrollo Organizacional",
      "Gestión de Conflictos",
    ],
    performance: {
      productivity: 88,
      quality: 90,
      teamwork: 92,
    },
  },
  {
    id: 5,
    firstName: "Roberto",
    lastName: "López",
    email: "roberto.lopez@example.com",
    phone: "(555) 567-8901",
    department: "Finance",
    position: "Financial Analyst",
    status: "Inactive",
    hireDate: "2021-11-15",
    address: "Calle Hidalgo 654, Monterrey",
    notes:
      "Contrato finalizado el 31/03/2023. Excelente en análisis financiero.",
    employeeId: "EMP-005",
    birthDate: "1987-07-12",
    emergencyContact: "Sofía López",
    emergencyPhone: "(555) 543-2109",
    skills: [
      "Análisis Financiero",
      "Excel Avanzado",
      "Presupuestos",
      "Proyecciones Financieras",
    ],
    performance: {
      productivity: 91,
      quality: 87,
      teamwork: 75,
    },
  },
  {
    id: 6,
    firstName: "Sofía",
    lastName: "Hernández",
    email: "sofia.hernandez@example.com",
    phone: "(555) 678-9012",
    department: "Engineering",
    position: "QA Engineer",
    status: "Active",
    hireDate: "2022-05-10",
    address: "Av. Universidad 789, Ciudad de México",
    notes: "Especialista en pruebas automatizadas y control de calidad.",
    employeeId: "EMP-006",
    birthDate: "1991-12-05",
    emergencyContact: "Miguel Hernández",
    emergencyPhone: "(555) 432-1098",
    skills: [
      "Pruebas Automatizadas",
      "Selenium",
      "JIRA",
      "Gestión de Calidad",
      "Scrum",
    ],
    performance: {
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
  //array de empleados filtrados
  filteredEmployees: [],
  //array de empleados seleccionados
  selectedEmployees: [],
  //array de empleados eliminados
  currentEmployee: null,
  //booleano para saber si se esta editando un empleado o no
  isEditing: false,

  //filtros de empleados, busqueda, departamento y estado
  filters: {
    search: "",
    department: "",
    status: "",
  },
  //paginacion de empleados, pagina actual, total de paginas y items por pagina
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  },
};

/**
 * Inicializar la funcionalidad de empleados
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
  deleteSelectedBtn.addEventListener("click", showDeleteConfirmation);
  //agregando la funcion al boton para eliminar el empleado
  confirmDeleteBtn.addEventListener("click", deleteSelectedEmployees);

  // Cargar datos de los empleados
  loadEmployees();
}

//Cargar datos de empleados
function loadEmployees() {
  // Mostrar un estado de carga mientras se obtienen los datos
  employeesTableBody.innerHTML =
    '<tr><td colspan="8" class="text-center"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando empleados...</td></tr>';

  // Simular una llamada a la API con un pequeño retraso
  setTimeout(() => {
    //aqui se podria hacer una solicitud a la API para obtener los empleados

    // Actualizar el estado con los datos de prueba
    employeesState.employees = testEmployees;

    // Filtrar los empleados inicialmente
    employeesState.filteredEmployees = [...testEmployees];

    // Actualizar la tabla de empleados
    updateEmployeesTable();
  }, 500);
}

// Actualizar la tabla de empleados con el estado actual,agregando los atributos de cada fila
//generando dinamicamente los empleados con cada bton y sus funciones
function updateEmployeesTable() {
  //calcula los indices de paginacion para obtener los empleados visibles
  //obtener la pagina actual y el total de items por pagina
  const startIndex =
    (employeesState.pagination.currentPage - 1) *
    employeesState.pagination.itemsPerPage;
  console.log("funcion actualizar tabla, pagina actual = ", startIndex);

  //obtener la ultima pagina y el total de items por pagina
  const endIndex = startIndex + employeesState.pagination.itemsPerPage;
  //de los empleados filtrados, obtener los empleados visibles
  //slice devuelve una copia superficial de una porcion del array, desde el indice de inicio hasta el indice de fin
  const paginatedEmployees = employeesState.filteredEmployees.slice(
    startIndex,
    endIndex
  );

  // Actualizar el total de páginas
  //el metodo math.ceil devuelve el entero mayor o igual al resultado de la division
  //calcular el total de paginas dividiendo el total de empleados filtrados entre el total de items por pagina
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
            <img src="/src/assets/img/avatarimage.png" alt="${
              employee.firstName
            } ${employee.lastName}" class="employee-avatar me-2">
            <div>
              <div class="employee-name">${employee.firstName} ${
      employee.lastName
    }</div>
              <div class="employee-position">${employee.position}</div>
            </div>
          </div>
        </td>
        <td>${employee.email}</td>
        <td>${employee.department}</td>
        <td>${employee.position}</td>
        <td>
          <span class="status-badge ${getStatusClass(employee.status)}">
            ${employee.status}
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

  console.log(
    "datos de los empleados en la tabla empleados =",
    paginatedEmployees,
    "\n",
    "nombre de empleados =",
    employeesState.employees[0].firstName,
    "\n",
    "id_employes de cada empleado =",
    employeesState.employees[0].employeeId
  );

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
 * Ver detalles del empleado
 * @param {number} employeeId - El ID del empleado a ver, este id se obtiene de testEmployees
 */

// Mostrar los detalles del empleado en una nueva página
//se le pasa el id del empleado a la funcion viewEmployeeDetails
// Actualizar los controles de paginación dinámicamente según el estado actual
// Generar botones "Anterior", "Siguiente" y números de página
// Agregar eventos para manejar el cambio de página
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
  localStorage.setItem("selectedEmployee", JSON.stringify(employee));

  // Redirigir a la página de detalles del empleado
  window.location.href = "detalles-usuario.html";
}

//Actualizar los controles de paginación
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
 * Obtener la clase CSS para el estado del empleado
 * @param {string} status - El estado del empleado
 * @returns {string} - Clase CSS
 */

//la funcion recibe el estado del empleado creado dinamicamente y devuelve la clase css correspondiente al estado del empleado
//la clase css se usa para cambiar el color del texto del estado del empleado y estilizar el estado en la tabla
function getStatusClass(status) {
  switch (status) {
    case "Active":
      return "status-active";
    case "Inactive":
      return "status-inactive";
    case "On Leave":
      return "status-leave";
    default:
      return "";
  }
}

/**
 * Mostrar el modal para agregar un empleado
 */

/**
 * Mostrar el modal para agregar un empleado
 * - Limpia el formulario.
 * - Establece la fecha actual como predeterminada.
 * - Cambia el título del modal a "Agregar Empleado".
 * - Actualiza el estado global para indicar que no se está editando.
 * - Muestra el modal en la pantalla.
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
 * Editar un empleado
 * @param {number} employeeId - El ID del empleado a editar
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
  document.getElementById("emp-first-name").value = employee.firstName;
  document.getElementById("emp-last-name").value = employee.lastName;
  document.getElementById("emp-email").value = employee.email;
  document.getElementById("emp-phone").value = employee.phone;
  document.getElementById("emp-department").value = employee.department;
  document.getElementById("emp-position").value = employee.position;
  document.getElementById("emp-hire-date").value = employee.hireDate;
  document.getElementById("emp-status").value = employee.status;
  document.getElementById("emp-address").value = employee.address;
  document.getElementById("emp-notes").value = employee.notes;

  // Actualizar el título del modal
  document.getElementById("employee-modal-label").textContent =
    "Editar Empleado";

  // Mostrar el modal
  //se usa el objeto employeemodal una istancia de bootstrap para mostrar el modal en pantalla
  employeeModal.show();
}

/**
 * Guardar un empleado (crear o actualizar)
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
 * Crear un nuevo empleado
 * @param {Object} employeeData - Los datos del empleado
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
 * Actualizar un empleado existente
 * @param {number} employeeId - El ID del empleado a actualizar
 * @param {Object} employeeData - Los datos actualizados del empleado
 */

function updateEmployee(employeeId, employeeData) {
  console.log("entrando al modal e inicializando la funcion editar empleado");

  console.log(
    "funcion actualizar Empleado \n idempleado obtenido = ",
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
 * Mostrar el modal de confirmación de eliminación
 * @param {Array} employeeIds - Array de IDs de empleados a eliminar (opcional)
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
    confirmationMessage = `¿Está seguro que desea eliminar al empleado "${employee.firstName} ${employee.lastName}"? Esta acción no se puede deshacer.`;
  } else {
    confirmationMessage = `¿Está seguro que desea eliminar ${idsToDelete.length} empleados seleccionados? Esta acción no se puede deshacer.`;
  }

  document.getElementById("delete-confirmation-content").textContent =
    confirmationMessage;

  // Almacenar los IDs a eliminar en el estado
  employeesState.selectedEmployees = idsToDelete;

  // Mostrar el modal de confirmación
  deleteConfirmationModal.show();
}

/**
 * Eliminar los empleados seleccionados
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
 * Manejar la selección de un empleado
 * @param {number} employeeId - El ID del empleado
 * @param {boolean} isSelected - Si el empleado está seleccionado
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
 * Manejar el cambio del checkbox de seleccionar todos
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
 * Actualizar el estado del checkbox de seleccionar todos
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
 * Actualizar el estado del botón de eliminar seleccionados
 */
function updateDeleteSelectedButton() {
  deleteSelectedBtn.disabled = employeesState.selectedEmployees.length === 0;
}

/**
 * Manejar la entrada de búsqueda
 */
function handleSearchInput() {
  employeesState.filters.search = employeeSearch.value.trim().toLowerCase();
}

/**
 * Aplicar filtros a los empleados
 */
function applyFilters() {
  // Actualizar los valores de filtro desde las entradas
  employeesState.filters.search = employeeSearch.value.trim().toLowerCase();
  employeesState.filters.department = departmentFilter.value;
  employeesState.filters.status = statusFilter.value;

  const { search, department, status } = employeesState.filters;

  // Filtrar empleados
  employeesState.filteredEmployees = employeesState.employees.filter(
    (employee) => {
      // Filtro de búsqueda
      const searchMatch =
        !search ||
        employee.firstName.toLowerCase().includes(search) ||
        employee.lastName.toLowerCase().includes(search) ||
        employee.email.toLowerCase().includes(search) ||
        employee.position.toLowerCase().includes(search);

      // Filtro de departamento
      const departmentMatch = !department || employee.department === department;

      // Filtro de estado
      const statusMatch = !status || employee.status === status;

      return searchMatch && departmentMatch && statusMatch;
    }
  );

  // Resetear a la primera página
  employeesState.pagination.currentPage = 1;

  // Actualizar la tabla
  updateEmployeesTable();

  // Actualizar el checkbox de seleccionar todos
  updateSelectAllCheckbox();
}

/**
 * Mostrar un mensaje de notificación
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - El tipo de notificación (success, error, info, warning)
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

// Inicializar la funcionalidad de empleados cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", initEmployees);
