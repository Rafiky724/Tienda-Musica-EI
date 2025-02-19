/*
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"
import { auth } from './firebase.js'

const formularioRegistrar = document.querySelector('#registerForm');
var registerAlert = document.getElementById("RegisterAlertSuccess");
var correoEnUso = document.getElementById("RegisterAlertCorreoUso");
var contraseñaDebil = document.getElementById("RegisterAlertContraDebil");
var correoNoValido = document.getElementById("RegisterAlertCorrNoVali");
var salioMal = document.getElementById("RegisterAlertErrorMal");
var verificarPass = document.getElementById("RegisterAlertVerificarCon");


formularioRegistrar.addEventListener('submit', async (e) => {

    e.preventDefault();

    const email = formularioRegistrar['exampleInputEmail1'].value
    const password = formularioRegistrar['exampleInputPassword1'].value
    const passwordConfirmation = formularioRegistrar['exampleInputPassword2'].value
    
    //console.log(email, password)

    if (password != passwordConfirmation) {

        verificarPass.style.display = "block";

    } else {

        try {

            const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
            registerAlert.style.display = "block";

            document.getElementById("exampleInputEmail1").value = ""
            document.getElementById("validationTooltip01").value = ""
            document.getElementById("validationTooltip02").value = ""
            document.getElementById("exampleInputPassword1").value = ""
            document.getElementById("exampleInputPassword2").value = ""

            verificarPass.style.display = "none";
            correoEnUso.style.display = "none";
            correoNoValido.style.display = "none";
            contraseñaDebil.style.display = "none";
            salioMal.style.display = "none";

            //console.log(userCredentials)

        } catch (error) {

            console.log(error.code)

            if (error.code === 'auth/email-already-in-use') {

                correoEnUso.style.display = "block";

            } else if (error.code === 'auth/invalid-email') {

                correoNoValido.style.display = "block";

            } else if (error.code === 'auth/weak-password') {

                contraseñaDebil.style.display = "block";


            } else if (error.code) {

                salioMal.style.display = "block";

            }

        }

    }


})
*/

import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { auth, db } from './firebase.js';
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"

const formularioRegistrar = document.querySelector('#registerForm');
var registerAlert = document.getElementById("RegisterAlertSuccess");
var correoEnUso = document.getElementById("RegisterAlertCorreoUso");
var contraseñaDebil = document.getElementById("RegisterAlertContraDebil");
var correoNoValido = document.getElementById("RegisterAlertCorrNoVali");
var salioMal = document.getElementById("RegisterAlertErrorMal");
var verificarPass = document.getElementById("RegisterAlertVerificarCon");


formularioRegistrar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const loadingIndicator = document.getElementById('loader-pagina2');
    loadingIndicator.style.display = 'block';

    const email = formularioRegistrar['exampleInputEmail1'].value;
    const password = formularioRegistrar['exampleInputPassword1'].value;
    const passwordConfirmation = formularioRegistrar['exampleInputPassword2'].value;
    const nombre = formularioRegistrar['validationTooltip01'].value;
    const apellido = formularioRegistrar['validationTooltip02'].value
    const fechaNacimiento = formularioRegistrar['validationTooltip05'].value;

    if (password !== passwordConfirmation) {
        // Mostrar mensaje de verificación de contraseña
        verificarPass.style.display = "block";
        loadingIndicator.style.display = 'none';
    } else {
        try {

            // Establece la persistencia del navegador en "none" para evitar el inicio de sesión automático
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

            // Enviar correo de verificación
            await sendEmailVerification(userCredentials.user);

            // Mostrar un mensaje de éxito y restablecer el formulario

            const carritoDoc = await addDoc(collection(db, 'carritos'), {
                productos: []
            });

            const comprasDoc = await addDoc(collection(db, 'compras'), {
                compras: []
            });

            const favoritoDoc = await addDoc(collection(db, 'favoritos'), {

                productos: []

            });

            await addDoc(collection(db, 'usuarios'), {
                nombre,
                apellido,
                fechaNacimiento,
                email,
                uid: userCredentials.user.uid, // Relaciona el usuario con su información en Firestore
                carritoId: carritoDoc.id,
                comprasId: comprasDoc.id,
                favoritosId: favoritoDoc.id

            });

            // Otros mensajes de alerta ocultados
            verificarPass.style.display = "none";
            correoEnUso.style.display = "none";
            correoNoValido.style.display = "none";
            contraseñaDebil.style.display = "none";
            salioMal.style.display = "none";

            registerAlert.style.display = "block";

            await signOut(auth);

            formularioRegistrar.reset();
            loadingIndicator.style.display = 'none';

        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                correoEnUso.style.display = "block";
            } else if (error.code === 'auth/invalid-email') {
                correoNoValido.style.display = "block";
            } else if (error.code === 'auth/weak-password') {
                contraseñaDebil.style.display = "block";
            } else {
                console.log(error);
                salioMal.style.display = "block";
            }

            loadingIndicator.style.display = 'none';
        }
    }
});
