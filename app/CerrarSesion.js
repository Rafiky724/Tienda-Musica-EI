import { signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { auth } from './firebase.js'


const logout = document.querySelector('#cerrar-sesion');
const logout2 = document.querySelector('#cerrar-sesion2');

logout.addEventListener('click', async () => {

    await signOut(auth);
    console.log('User logged out');

    location.reload();

});

logout2.addEventListener('click', async () => {

    await signOut(auth);
    console.log('User logged out');

    location.reload();

});