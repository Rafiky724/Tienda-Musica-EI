import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"
import { auth } from './firebase.js'

const IniciarSesionForm = document.querySelector('#loginForm');
const loadingIndicator = document.getElementById('loader-pagina2');

IniciarSesionForm.addEventListener('submit', async e => {

    e.preventDefault();

    
    loadingIndicator.style.display = 'block';
    const email = IniciarSesionForm['exampleInputEmail1'].value;
    const password = IniciarSesionForm['exampleInputPassword1'].value;
    var loginAlert = document.getElementById("loginAlert");

    try {
        
        const credentials = await signInWithEmailAndPassword(auth, email, password)
        
        //TIENE QUE SE TRUE PARA CONFIRMAR VERIFICACION
        if (credentials.user.emailVerified === true) {
            loginAlert.style.display = "none";
            console.log(credentials);
            window.location.href = "./home.html";
        } else {
            // Si el correo no está verificado, mostrar un mensaje de error
            loginAlert.innerText = "Tu correo electrónico aún no ha sido verificado. Por favor, verifica tu correo antes de iniciar sesión.";
            loginAlert.style.display = "block";
            await signOut(auth);

        }

        loadingIndicator.style.display = 'none';
        //loginAlert.style.display = "none";
        //console.log(credentials) 

    } catch (error) {
        
        console.log(error)
        loginAlert.style.display = "block";
        loadingIndicator.style.display = 'none';

    }

})


const inputRestablecerContraseña = document.getElementById("inputRestablecerContraseña");
const botonRestablecerContraseña = document.getElementById("botonRestablecerContraseña");
const successAlert = document.querySelector(".alert-success");
const errorAlert = document.querySelector(".alert-danger");

botonRestablecerContraseña.addEventListener("click", () => {
    const email = inputRestablecerContraseña.value;

    loadingIndicator.style.display = 'block';
    sendPasswordResetEmail(auth, email)
        .then(() => {
            successAlert.style.display = "block";
            errorAlert.style.display = "none";
            loadingIndicator.style.display = 'none';
        })
        .catch((error) => {
            errorAlert.style.display = "block";
            successAlert.style.display = "none";
            console.error(error);
            loadingIndicator.style.display = 'none';
        });
});