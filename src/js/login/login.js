// Función para comprobar si el usuario ya ha iniciado sesión
// Si ya ha iniciado sesión, redirigirlo a la página correspondiente
// Admin o User

//local storage
/*let comprobar = () => {
    let privilegios = localStorage.getItem("privilegios");

    if (privilegios) {
        console.log("privilegios:", privilegios);

        if (privilegios === "Admin") {
            window.location.href = "/html/admin/dashboardAdmin.html";
        } else if (privilegios == "User") {
            window.location.href = "/html/user/dashboard-user.html";
            }
            } else {
                console.log("No se encontraron datos de inicio de sesión en el LocalStorage");
        }
        }*/

/*const usuario_prueba = {
  email: "user@example.com",
  password: "123456",
};*/

// Constantes y configuración
const API_URL = "http://localhost:8000";
const ROUTES = {
    ADMIN: "/pages/admin/admin.html",
    AGENTE: "/pages/user/dashboard_agente.html"
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

const guardarDatosUsuario = (id, rol) => {
    localStorage.setItem("id_usuario", id);
    localStorage.setItem("rol", rol);
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

// Evento principal
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const messageDiv = document.getElementById("message");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const usernameInput = document.getElementById("username").value;
        const passwordInput = document.getElementById("password").value;

        // Validación inicial
        const validacion = validarCampos(usernameInput, passwordInput);
        if (!validacion.valido) {
            mostrarMensajeError(messageDiv, validacion.mensaje);
            return;
        }

        try {
            const loginData = await realizarLogin(usernameInput, passwordInput);

            if (loginData.correo === usernameInput && 
                loginData.contrasena === passwordInput) {
                
                guardarDatosUsuario(loginData.id, loginData.rol);
                redirigirUsuario(loginData.rol);
            } else {
                mostrarMensajeError(messageDiv, "Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error en el login:", error);
            mostrarMensajeError(messageDiv, error.message);
        }
    });
});

//funcion para el login de usuario
/*function login() {

    const correo_login = document.getElementById('correo_login').value;
    const contraseña_login = document.getElementById('contraseña_login').value;

    const tipo_Usuario_login = document.getElementById('tipo_Usuario_login');
    const tipouser = tipo_Usuario_login.options[tipo_Usuario_login.selectedIndex].value;
    const tipo_de_usuario = tipouser

    //console.log(tipo_de_usuario);

    if ((correo_login || contraseña_login) == "") {
        alert("Rellene todos los campos")

    } else {
        try {
            axios({
                method: 'POST',
                url: 'http://127.0.0.1:5000/login',

                data: {
                    correo: correo_login,
                    contraseña: contraseña_login,
                    tipo_usuario: tipo_de_usuario
                }

            }).then(function (response) {

                const data_nombre = response.data[0].nombre;
                console.log("nombre del usuario loggeado", data_nombre);

                const data_correo = response.data[0].correo;
                console.log("correo = ",data_correo);

                const data_contraseña = response.data[0].contraseña;
                console.log("contraseña = ",data_contraseña);

                const data_tipo_usuario = response.data[0].tipo_usuario;
                console.log("tipo de usuario=",data_tipo_usuario);



                if (correo_login === data_correo && contraseña_login === data_contraseña) {

                    if (data_tipo_usuario === "cliente") {

                        alert("INICIO DE SESION EXITOSO \n BIENVENIDO  " + data_nombre);
                        window.location.href = "html/user/dashboard_user.html"
                        console.log("ruta para admin = ", window.location.href)
                        let = id = data_id;
                        localStorage.setItem("id_login", id);

                        localStorage.setItem("privilegios", "cliente");

                    } else if (data_tipo_usuario === "proovedor") {


                        alert("INICIO DE SESION EXITOSO \n BIENVENIDO  " + data_nombre);
                        window.location.href = "html/administrador/dashboard_admin.html"




                        console.log("ruta para admin = ", window.location.href)

                        let = id = data_id;
                        localStorage.setItem("id_login", id);


                        localStorage.setItem("privilegios", "proovedor");


                    } else {
                        alert("correo o contraseña o tipo de usuario incorrectos verifique sus datos")
                    }
                }
            }

            );

        } catch (error) {
            console.log(error)
        }

    }
}*/

//evento para el pop up de registro, los inputs de cliente y proveedor se ocultan dependiendo de la eleccion
//si elije cliente se muestra los inputs de cliente y se oculta los de proveedor
/*document.addEventListener("click",()=>{

    const cliente_inputs = document.getElementById('cliente_Inputs');
    const proovedor_inputs = document.getElementById('proveedor_Inputs');

    const tipo_usuario = document.getElementById('tipo_Usuario_registro');
    let tipouser = tipo_usuario.options[tipo_usuario.selectedIndex].value;
    const tipo_de_usuario = tipouser

    cliente_inputs.setAttribute("style", "display:none");
    proovedor_inputs.setAttribute("style", "display:none");



    if (tipo_de_usuario === "cliente") {
        cliente_inputs.setAttribute("style", "display:block");
        proovedor_inputs.setAttribute("style", "display:none");
    }
    else if (tipo_de_usuario === "proovedor") {
        proovedor_inputs.setAttribute("style", "display:block");
        cliente_inputs.setAttribute("style", "display:none");

    }


})*/

//funcion para el registro de usuario
/*function registro() {




    let fecha = new Date();
    const fecha_registro = fecha.toUTCString();



    const numero_identificacion = document.getElementById('numero_identificacion').value;

    const ubicacion = document.getElementById('ubicacion').value;


    const tipo_usuario = document.getElementById('tipo_Usuario_registro');
    let tipouser = tipo_usuario.options[tipo_usuario.selectedIndex].value;
    const tipo_de_usuario = tipouser

    const nombre_asesor = document.getElementById('nombre_asesor').value;

    const numero_nit = document.getElementById('numero_NIT').value;

    const telefono_empresa = document.getElementById('telefono_empresa').value;

    const tipo_empresa = document.getElementById('tipo_empresa').value;

    const ubicacion_empresa = document.getElementById('ubicacion').value;
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;
    const nombre_empresa = document.getElementById('empresa_asociada').value
    const nombre_cliente = document.getElementById('nombre_cliente').value;
    const apellido = document.getElementById('apellido').value;
    const edad = document.getElementById('edad').value;
    const telefono = document.getElementById('telefono').value;

    const tipo_de_Identificacion = document.getElementById('tipo_de_identificacion');
    let tipo_identificacion = tipo_de_Identificacion.options[tipo_de_Identificacion.selectedIndex].value;
    const tipo_identificacion_usuario = tipo_identificacion


    if ((nombre_cliente || apellido || edad || telefono || tipo_identificacion_usuario || correo || contraseña || tipo_de_usuario) == "") {
        alert("por favor revise y Rellene todos los campos para poder registrarse correctamente")


    } else if (tipo_de_usuario === "cliente") {
        console.log("entro a la funcion de registro de cliente")
        try {
            axios({
                method: 'POST',
                url: 'http://127.0.0.1:5000/register',
                data: {

                    tipo_usuario: tipo_de_usuario,
                    nombre: nombre_cliente,
                    apellido: apellido,
                    edad: edad,
                    fecha_registro: fecha_registro,
                    tipo_identificacion: tipo_identificacion_usuario,
                    numero_identificacion: numero_identificacion,
                    ubicacion: ubicacion,
                    correo: correo,
                    contraseña: contraseña,
                    telefono: telefono,
                }

            }).then(function (response) {

                if (response.mensaje == "Registro exitoso") {
                    console.log("REGISTRO EXITOSO  DE USUARIO")
                    alert("REGISTRO EXITOSO DE USUARIO CLIENTE");
                    Form.reset();

                }
            })

        } catch (error) {
            console.log(error)
        }

    } else if ((nombre_empresa || numero_nit || ubicacion_empresa || telefono_empresa || correo || contraseña || tipo_empresa || tipo_de_usuario) == "") {
        alert("revise y Rellene todos los campos para poder registrarse correctamente")

    } else if (tipo_de_usuario === "proovedor") {
        try {
            axios({
                method: 'POST',
                url: 'http://127.0.0.1:5000/register',

                data: {
                    tipo_de_usuario: tipo_de_usuario,
                    numero_nit: numero_nit,
                    tipo_empresa: tipo_empresa,
                    ubicacion: ubicacion_empresa,
                    nombre_empresa: nombre_empresa,
                    nombre_asesor: nombre_asesor,
                    telefono_empresa: telefono_empresa,
                    correo: correo,
                    contraseña: contraseña
                }
            }).then(function (response) {

                if (response.mensaje == "Registro exitoso") {
                    console.log("REGISTRO EXITOSO  DE USUARIO")
                    alert("REGISTRO EXITOSO DE USUARIO PROOVEDOR");
                    Form.reset();

                }
            })

        } catch (error) {
            console.log(error)
        }

    } else {
        alert("revise y Rellene todos los campos para poder registrarse correctamente")
    }

}*/
