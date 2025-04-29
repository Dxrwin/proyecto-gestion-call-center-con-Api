
/*const usuario_prueba = {
  email: "user@example.com",
  password: "123456",
};*/

// Constantes y configuración
const API_URL = "http://localhost:8000";
const ROUTES = {
    ADMIN: "/pages/admin/admin.html",
    AGENTE: "/pages/user/dashboard_agente.html",
    LOGIN: "/login.html"
};

// Funciones de utilidad
const mostrarMensajeError = (elemento, mensaje) => {
    elemento.textContent = mensaje;
    elemento.className = "mt-3 text-center text-danger";
};

const validarCampos = (username, password) => {
    if (!username || !password) {
        return { valido: false, mensaje: "Por favor, complete todos los campos" };
    }
    return { valido: true };
};

const guardarDatosUsuario = (loginData) => {
    const idUsuario = loginData.rol === "administrador" 
        ? loginData.id_administrador 
        : loginData.id_empleado;
    
    localStorage.setItem("id_usuario", idUsuario);
    localStorage.setItem("rol", loginData.rol);
    localStorage.setItem("ultimoAcceso", new Date().getTime());
};

const redirigirUsuario = (rol) => {
    const ruta = rol === "administrador" ? ROUTES.ADMIN : ROUTES.AGENTE;
    window.location.href = ruta;
};

// Función principal de login
const realizarLogin = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/obtenerlogin`, {
            correo: username,
            contrasena: password
        });
        
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Error al intentar iniciar sesión");
    }
};

// Función para verificar si hay una sesión activa
const verificarSesionActiva = () => {
    const idUsuario = localStorage.getItem("id_usuario");
    const rol = localStorage.getItem("rol");
    
    // Si no hay datos de sesión, retornamos false
    if (!idUsuario || !rol) {
        return false;
    }
    
    // Si hay datos de sesión, redirigimos según el rol
    redirigirUsuario(rol);
    return true;
};

// Función para cerrar sesión
const cerrarSesion = () => {
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("rol");
    window.location.href = ROUTES.LOGIN;
};

// Función para validar la sesión en cada página
const validarSesionEnPagina = () => {
    const idUsuario = localStorage.getItem("id_usuario");
    const rol = localStorage.getItem("rol");
    
    // Si no hay sesión activa, redirigir al login
    if (!idUsuario || !rol) {
        window.location.href = ROUTES.LOGIN;
        return;
    }
    
    // Verificar que la página actual coincida con el rol del usuario
    const paginaActual = window.location.pathname;
    const rutaEsperada = rol === "administrador" ? ROUTES.ADMIN : ROUTES.AGENTE;
    
    if (!paginaActual.includes(rutaEsperada)) {
        // Si el usuario está en una página que no corresponde a su rol, redirigir
        window.location.href = rutaEsperada;
    }
};

// Evento principal
document.addEventListener("DOMContentLoaded", function () {
    // Verificar si estamos en la página de login
    if (window.location.pathname.includes("login.html")) {
        // Si hay sesión activa, redirigir
        if (verificarSesionActiva()) {
            return;
        }
        
        const loginForm = document.getElementById("login-form");
        const messageDiv = document.getElementById("message");

        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const usernameInput = document.getElementById("username").value;
            const passwordInput = document.getElementById("password").value;

            const validacion = validarCampos(usernameInput, passwordInput);
            if (!validacion.valido) {
                mostrarMensajeError(messageDiv, validacion.mensaje);
                return;
            }

            try {
                const loginData = await realizarLogin(usernameInput, passwordInput);

                if (loginData.correo === usernameInput && 
                    loginData.contrasena === passwordInput) {
                    
                    guardarDatosUsuario(loginData);
                    redirigirUsuario(loginData.rol);
                } else {
                    mostrarMensajeError(messageDiv, "Credenciales incorrectas");
                }
            } catch (error) {
                console.error("Error en el login:", error);
                mostrarMensajeError(messageDiv, error.message);
            }
        });
    } else {
        // Si no estamos en la página de login, validar la sesión
        validarSesionEnPagina();
    }
});

