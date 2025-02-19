import './app/RegistrarS.js';



//LÓGICA DE INICIO DE SESIÓN
/*
document.addEventListener("DOMContentLoaded", function () {
    // Verificar si estamos en la página de registro (register.html)
    var isRegisterPage = window.location.pathname.endsWith("register.html");

    if (isRegisterPage) {
        // Agregar eventos solo si estamos en la página de registro
        var registerForm = document.getElementById("registerForm");
        if (registerForm) {
            registerForm.addEventListener("submit", function (event) {
                event.preventDefault(); // Evitar la recarga de la página

                // Resto de la lógica de registro
                var nombre = document.getElementById("validationTooltip01").value;
                var apellidos = document.getElementById("validationTooltip02").value;
                var correo = document.getElementById("exampleInputEmail1").value;
                var fechaNacimiento = document.getElementById("validationTooltip05").value;
                var contraseña = document.getElementById("exampleInputPassword1").value;

                // Crear un objeto para el usuario registrado
                var usuario = {
                    nombre: nombre,
                    apellidos: apellidos,
                    correo: correo,
                    fechaNacimiento: fechaNacimiento,
                    contraseña: contraseña,
                };

                // Obtener la lista de usuarios registrados del almacenamiento local
                var usuariosRegistrados =
                    JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

                // Agregar el nuevo usuario a la lista
                usuariosRegistrados.push(usuario);

                // Almacenar la lista actualizada en el almacenamiento local
                localStorage.setItem(
                    "usuariosRegistrados",
                    JSON.stringify(usuariosRegistrados)
                );

                // Limpiar el formulario de registro
                registerForm.reset();

                // Redirigir a la página de inicio de sesión
                window.location.href = "./index.html";
            });
        }
    }

    // Verificar si estamos en la página de inicio de sesión (index.html)
    var isLoginPage = window.location.pathname.endsWith("index.html");

    if (isLoginPage) {
        // Agregar eventos solo si estamos en la página de inicio de sesión
        var loginForm = document.getElementById("loginForm");
        var loginAlert = document.getElementById("loginAlert");

        if (loginForm) {
            loginForm.addEventListener("submit", function (event) {
                event.preventDefault(); // Evitar la recarga de la página

                // Resto de la lógica de inicio de sesión
                var correo = document.getElementById("exampleInputEmail1").value;
                var contraseña = document.getElementById("exampleInputPassword1").value;

                // Obtener la lista de usuarios registrados del almacenamiento local
                var usuariosRegistrados =
                    JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

                // Verificar si el usuario existe en la lista de usuarios registrados
                var usuarioExistente = usuariosRegistrados.find(function (usuario) {
                    return usuario.correo === correo && usuario.contraseña === contraseña;
                });

                if (usuarioExistente) {
                    // Iniciar sesión exitosa, redirigir a la página principal o realizar otras acciones
                    // Redirigir a la página principal
                    window.location.href = "./home.html";
                } else {
                    // Mostrar el mensaje de alerta si las credenciales son incorrectas
                    loginAlert.style.display = "block";
                }
            });
        }
    }

    var isHomePage = window.location.pathname.endsWith("home.html");

    if(isHomePage){

        

    }

});

function returnSesion() {
    window.location.href = "./index.html";
}

function returnRegister() {
    window.location.href = "./register.html";
}

*/