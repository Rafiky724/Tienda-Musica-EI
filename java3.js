import { auth, db } from './app/firebase.js'
import { onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential  } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { getDocs, collection, getDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"
import { mostrarProductosComprados } from "./app/compras.js"

const loadingIndicator = document.getElementById('loader-pagina2');
// Función para cargar y mostrar los datos del usuario
async function mostrarDatosUsuario() {
    const user = auth.currentUser;

    console.log(user)

    if (user) {

        // Realiza una consulta a la base de datos para obtener los datos del usuario
        const userUID = user.uid;
        const usersCollectionRef = collection(db, 'usuarios');
        const query2 = query(usersCollectionRef, where('uid', '==', userUID));
        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {
            const userDocument = querySnapshot.docs[0];
            const userData = userDocument.data();

            // Accede a las etiquetas <p> por su ID y actualiza su contenido con los datos del usuario
            document.getElementById('mostarInfoNombre').textContent = userData.nombre;
            document.getElementById('mostarInfoApellido').textContent = userData.apellido;
            document.getElementById('mostarInfoFecha').textContent = userData.fechaNacimiento;
            document.getElementById('mostarInfoCorreo').textContent = userData.email;
        }
    }

    let contenedorCarga = document.getElementById('loader-pagina');

    contenedorCarga.style.visibility = 'hidden';
    setTimeout(function () {
        contenedorCarga.style.opacity = '0';
      }, 100);
}

// Llama a la función para cargar y mostrar los datos del usuario


onAuthStateChanged(auth, async (user) => {

    if (user) {
        
        mostrarDatosUsuario();
        mostrarProductosComprados();

    } else {

        const containerComprasVacio = document.querySelector("#container-compras-vacio")
        const containerNoIniciado = document.querySelector("#container-no-iniciado");

        containerNoIniciado.classList.remove("disabled");
        containerComprasVacio.classList.add("disabled");
        
        var noIdentificado = document.getElementById("usuarioNoRegistrado");
        noIdentificado.style.display = "block";
    }

})


const inputNuevaContraseña = document.getElementById("inputNuevaContraseña");
const botonCambiarContraseña = document.getElementById("botonCambiarContraseña");
const successAlertContraseña = document.querySelector("#modalCambiarContraseña .alert-success");
const errorAlertContraseña = document.querySelector("#modalCambiarContraseña .alert-danger");
const inputContraseñaActual = document.getElementById('inputContraseñaActual');

/*
botonCambiarContraseña.addEventListener("click", async () => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, inputContraseñaActual.value);

    try {
        // Reautentica al usuario
        await user.reauthenticateWithCredential(credential);
        
        // Cambia la contraseña
        await updatePassword(user, inputNuevaContraseña.value);

        // Muestra la alerta de éxito y oculta la de error
        successAlertContraseña.style.display = 'block';
        errorAlertContraseña.style.display = 'none';
    } catch (error) {
        // Muestra la alerta de error y oculta la de éxito
        errorAlertContraseña.style.display = 'block';
        successAlertContraseña.style.display = 'none';
        console.error('Error al cambiar la contraseña:', error);
    }
});*/

botonCambiarContraseña.addEventListener("click", async () => {
    loadingIndicator.style.display = 'block';
    const user = auth.currentUser;
    
    try {
      // Reautenticar al usuario con su contraseña actual antes de cambiarla
      const credential = EmailAuthProvider.credential(user.email, inputContraseñaActual.value);
      await reauthenticateWithCredential(user, credential);
  
      // Cambiar la contraseña
      await updatePassword(user, inputNuevaContraseña.value);
      successAlertContraseña.style.display = 'block';
      errorAlertContraseña.style.display = 'none';
    } catch (error) {
        errorAlertContraseña.style.display = 'block';
        successAlertContraseña.style.display = 'none';
        console.error('Error al cambiar la contraseña:', error);
    }

    loadingIndicator.style.display = 'none';

  });