import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { query, getDocs, getDoc, setDoc, collection, doc, updateDoc, arrayUnion, where, arrayRemove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"
import { auth, db } from './firebase.js'
import { actualizarBotonProducto } from './mostrarProductos.js'

const productosBD = await getDocs(collection(db, 'productos2'))
const productoArreglado = productosBD.docs.map(product => product.data());
let botonesEliminar = document.querySelectorAll(".iconos-eliminar-favoritos")
const cantidadFavorito = document.querySelector("#cantidad-favorito");

const loadingIndicator = document.getElementById('loader-pagina2');

export function actualizarBotonFavorito(botonAgregarFavorito) {

    botonAgregarFavorito = document.querySelectorAll(".agregar-producto-favorito");

    onAuthStateChanged(auth, async (user) => {

        if (user) {

            botonAgregarFavorito.forEach(boton => {

                boton.addEventListener("click", agregarAFavoritos);

            })

        } else {

            botonAgregarFavorito.forEach(boton => {

                boton.removeAttribute("data-bs-toggle");
                boton.removeAttribute("data-bs-target");
                boton.addEventListener("click", iniciarSesionFavorito);

            })

        }

    })

}

function iniciarSesionFavorito() {

    const modal = new bootstrap.Modal(document.getElementById("exampleModal9"));
    modal.show();

}

async function agregarAFavoritos(e) {

    const id = e.currentTarget.id;

    const productoAgregado = productoArreglado.find(producto => producto.id === id);
    
    const user = auth.currentUser;
    const userUID = user.uid;

    const usersCollectionRef = collection(db, 'usuarios');
    const query2 = query(usersCollectionRef, where('uid', '==', userUID));

    const querySnapshot = await getDocs(query2);

    if (!querySnapshot.empty) {

        // Si la consulta devuelve resultados, obtén el primer documento (debería ser único)
        const userDocument = querySnapshot.docs[0];
        // Accede al campo idFavoritos en el documento del usuario
        const idFavoritos = userDocument.data().favoritosId;
        // Ahora tienes el valor de idFavoritos que puedes usar para acceder a la colección de "favoritos" del usuario

        // Referencia a la colección "favoritos" del usuario

        const favoritosRef = doc(db, 'favoritos', idFavoritos);

        const favoritosSnapshot = await getDoc(favoritosRef);

        if (favoritosSnapshot.exists()) {

            const favoritosData = favoritosSnapshot.data();
            const productosEnFavoritos = favoritosData.productos || [];

            // Verificar si el producto ya está en "favoritos"
            const productoExistenteIndex = productosEnFavoritos.findIndex(producto => producto.id === id);

            if (productoExistenteIndex === -1) {
                // Si el producto no existe en "favoritos", agregarlo
                productosEnFavoritos.push(productoAgregado);

                await setDoc(favoritosRef, { productos: productosEnFavoritos }, { merge: true });
            }
        }
    }

    mostrarProductosEnFavoritos(botonesEliminar)
    actualizarContadorFavoritos()

}


export async function verificarFavoritos(botonesEliminar) {

    const favoritoVacio = document.querySelector("#container-favoritos-vacio");
    const containerProductosFavorito = document.querySelector("#container-productos-favorito");
    const titulosFavorito = document.querySelector("#titulos-favoritos");

    const user = auth.currentUser;

    if (user) {
        const userUID = user.uid;

        const usersCollectionRef = collection(db, 'usuarios');
        const query2 = query(usersCollectionRef, where('uid', '==', userUID));

        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {

            const userDocument = querySnapshot.docs[0];
            const idFavorito = userDocument.data().favoritosId;

            const favoritoRef = doc(db, 'favoritos', idFavorito);
            const favoritoSnapshot = await getDoc(favoritoRef);

            if (!favoritoSnapshot.exists()) {
                favoritoVacio.classList.remove("disabled");
                containerProductosFavorito.classList.add("disabled");
                titulosFavorito.classList.add("disabled");
            }else{

                mostrarProductosEnFavoritos(botonesEliminar)

            }
        }
    }

    actualizarContadorFavoritos()
    actualizarBotonProducto()

}


export async function mostrarProductosEnFavoritos(botonesEliminar) {

    const favoritoVacio = document.querySelector("#container-favoritos-vacio");
    const containerProductosFavorito = document.querySelector("#container-productos-favorito");
    const titulosFavorito = document.querySelector("#titulos-favoritos");

    const user = auth.currentUser;

    if (user) {
        const userUID = user.uid;

        const usersCollectionRef = collection(db, 'usuarios');
        const query2 = query(usersCollectionRef, where('uid', '==', userUID));

        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {
            const userDocument = querySnapshot.docs[0];
            const idFavorito = userDocument.data().favoritosId;

            const favoritoRef = doc(db, 'favoritos', idFavorito);
            const favoritoSnapshot = await getDoc(favoritoRef);

            if (favoritoSnapshot.exists()) {
                const favoritoData = favoritoSnapshot.data();

                // Verifica si el carrito tiene productos
                if (favoritoData.productos && favoritoData.productos.length > 0) {

                    favoritoVacio.classList.add("disabled");
                    containerProductosFavorito.classList.remove("disabled");
                    titulosFavorito.classList.remove("disabled");

                    containerProductosFavorito.innerHTML = "";

                    const productosEnCarro = favoritoData.productos;

                    // Recorre los productos y muéstralos en tu página
                    productosEnCarro.forEach(producto => {

                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                        
                        <th class="text-center"><a class="tarjeta-producto" id="${producto.idProducto}" data-bs-toggle="modal" data-bs-target="#exampleModalProducto" ><img class="tarjeta-producto2" src="${producto.imagen}" width="100" alt="${producto.nombre}"></a></th>
                        <td class="text-center elementos-centrar-carro"><p class="mb-0">${producto.nombre} <br> <span class="mb-0 fw-bold fst-italic mt-1">${producto.precio}</span> </p></td>
                        <td class="text-center elementos-centrar-carro"><a class="iconos-eliminar-favoritos" id="${producto.id}" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                            </svg></a></td>
                
                        
                        `;
                
                        containerProductosFavorito.append(tr);

                    });

                } else {

                    //console.log('El carrito de compras está vacío');
                    favoritoVacio.classList.remove("disabled");
                    containerProductosFavorito.classList.add("disabled");
                    titulosFavorito.classList.add("disabled");
                }

            } else {
                console.log('La lista de favoritos no existe');
            }
        }
    }

    actualizarBotonEliminarFavoritos(botonesEliminar)
    actualizarBotonProducto()
}

function actualizarBotonEliminarFavoritos(botonesEliminar){

    botonesEliminar = document.querySelectorAll(".iconos-eliminar-favoritos");

    botonesEliminar.forEach(boton => {

        boton.addEventListener("click", eliminarProductoFavorito);

    })

}


async function eliminarProductoFavorito(e) {

    loadingIndicator.style.display = 'block';
    const idEliminar = e.currentTarget.id;

    const user = auth.currentUser;
    if (user) {
        const userUID = user.uid;

        const usersCollectionRef = collection(db, 'usuarios');
        const query2 = query(usersCollectionRef, where('uid', '==', userUID));

        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {

            const userDocument = querySnapshot.docs[0];
            const idFavorito = userDocument.data().favoritosId;

            const favoritoRef = doc(db, 'favoritos', idFavorito);
            const favoritoSnapshot = await getDoc(favoritoRef);

            if (favoritoSnapshot.exists()) {
                const favoritoData = favoritoSnapshot.data();

                // Verifica si el carrito tiene productos
                if (favoritoData.productos && favoritoData.productos.length > 0) {
                    // Filtra el producto a eliminar
                    const nuevosProductos = favoritoData.productos.filter(producto => producto.id !== idEliminar);

                    // Actualiza los productos en el carrito
                    await updateDoc(favoritoRef, {
                        productos: nuevosProductos
                    });

                    mostrarProductosEnFavoritos(botonesEliminar)
                    actualizarBotonEliminarFavoritos(botonesEliminar)

                } else {
                    console.log('La lista favoritos está vacía');
                }
            } else {
                console.log('la lista favoritos no existe');
            }
        }
    }

    actualizarContadorFavoritos()
    loadingIndicator.style.display = 'none';
}


async function actualizarContadorFavoritos() {

    const user = auth.currentUser;

    if (user) {
        // Realiza una consulta a la base de datos para obtener la información del carrito

        const userUID = user.uid;
        const usersCollectionRef = collection(db, 'usuarios');
        const query2 = query(usersCollectionRef, where('uid', '==', userUID));
        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {
            const userDocument = querySnapshot.docs[0];
            const idFavorito = userDocument.data().favoritosId;
            const favoritoRef = doc(db, 'favoritos', idFavorito);

            const favoritoData = (await getDoc(favoritoRef)).data();

            // Calcula la cantidad total de productos en el carrito
            //let cantidadTotal = 0;
            //let precioTotal = 0;

            /*
            if (carritoData.productos && carritoData.productos.length > 0) {
                carritoData.productos.forEach(producto => {
                    cantidadTotal += producto.cantidad;
                    precioTotal += producto.precio * producto.cantidad;
                });
            }*/

            // Actualiza el valor del contador con la cantidad total de productos en el carrito
            cantidadFavorito.innerText = favoritoData.productos.length;

        }
    }
}
