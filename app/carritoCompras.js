import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { query, getDocs, getDoc, setDoc, collection, doc, updateDoc, arrayUnion, where, arrayRemove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"
import { auth, db } from './firebase.js'

const productosBD = await getDocs(collection(db, 'productos'))
const productoArreglado = productosBD.docs.map(product => product.data());
let botonesEliminar = document.querySelectorAll(".iconos-eliminar")
const cantidadCarrito = document.querySelector("#cantidad-carro");
const totalCarrito = document.querySelector("#span-total");
const botonComprarCarrito = document.getElementById("carrito-boton-comprar")
botonComprarCarrito.addEventListener("click", comprarCarro);
const loadingIndicator = document.getElementById('loader-pagina2');

export function actualizarBotonCarro(botonAgregarCarro){

    botonAgregarCarro = document.querySelectorAll(".agregar-producto-identificador");

    onAuthStateChanged(auth, async (user) => {

        if(user){

            botonAgregarCarro.forEach(boton => {

                boton.addEventListener("click", agregarAlCarrito);
        
            })

        }else{

            botonAgregarCarro.forEach(boton => {

                boton.removeAttribute("data-bs-toggle");
                boton.removeAttribute("data-bs-target");
                boton.addEventListener("click", iniciarSesionCarrito);
        
            })

        }
    
    })

}

function iniciarSesionCarrito(){

    const modal = new bootstrap.Modal(document.getElementById("exampleModal5"));
    modal.show();

}

async function agregarAlCarrito(e){

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
        // Accede al campo idCarrito en el documento del usuario
        const idCarrito = userDocument.data().carritoId;
        // Ahora tienes el valor de idCarrito que puedes usar para acceder al carrito del usuario
        //console.log(idCarrito);

        const carritoRef = doc(db, 'carritos', idCarrito);
        const carritoSnapshot = await getDoc(carritoRef);

        if (carritoSnapshot.exists()) {
            
            const carritoData = carritoSnapshot.data();
            const productosEnCarro = carritoData.productos || [];

            // Verificar si el producto ya está en el carrito
            const productoExistenteIndex = productosEnCarro.findIndex(producto => producto.id === id);

            if (productoExistenteIndex !== -1) {
                // Si el producto ya existe, aumentar la cantidad en lugar de agregar uno nuevo
                productosEnCarro[productoExistenteIndex].cantidad += 1;
            } else {
                // Si el producto no existe, agregarlo con cantidad 1
                productosEnCarro.push({ ...productoAgregado, cantidad: 1 });
            }

            // Actualizar el carrito con los productos
            await setDoc(carritoRef, { productos: productosEnCarro }, { merge: true });
        }
        
        //ARREGLAR SI ES NECESARIO LA INFORMACIÓN QUE SE GUARDA SOBRE EL CARRO DE COMPRAS

        /*
        const productosEnCarro = doc(db, 'carritos', idCarrito);

        // Verifica si el producto ya está en el carrito
    
        if (productoAgregado) {

            const carritoActual = (await getDoc(productosEnCarro)).data();

            console.log(carritoActual);

            if (carritoActual.productos) {

                const productoEnCarrito = carritoActual.productos.find(item => item.id === id);

                if (productoEnCarrito) {
                    // Si el producto ya está en el carrito, actualiza la cantidad
                    productoEnCarrito.cantidad++;
                } else {
                    // Si el producto no está en el carrito, agrégalo con cantidad 1
                    carritoActual.productos.push({
                        idProducto: id,
                        cantidad: 1
                    });
                }
            } else {
                // Si el carrito no tiene productos, crea un nuevo carrito con el producto
                carritoActual.productos = [{
                    idProducto: id,
                    cantidad: 1
                }];
            }

            // Actualiza el carrito en Firestore con la nueva estructura
            await setDoc(productosEnCarro, carritoActual);




            /*ANTIGUO
            // Actualiza el carrito para agregar el producto
            await updateDoc(productosEnCarro, {
                productos: arrayUnion(productoAgregado)
            });*/
        //}

    }

    mostrarProductosEnCarrito()
    actualizarContadorCarrito()

}


export async function verificarCarritoDeCompras(botonesEliminar) {

    const carritoVacio = document.querySelector("#container-carrito-vacio");
    const containerProductosCarrito = document.querySelector("#container-productos-carrito");
    const botonComprarCarrito = document.querySelector("#carrito-boton-comprar")
    const titulosCarrito = document.querySelector("#titulos-carrito");

    const user = auth.currentUser;

    if (user) {
        const userUID = user.uid;

        const usersCollectionRef = collection(db, 'usuarios');
        const query2 = query(usersCollectionRef, where('uid', '==', userUID));

        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {
            const userDocument = querySnapshot.docs[0];
            const idCarrito = userDocument.data().carritoId;

            const carritoRef = doc(db, 'carritos', idCarrito);
            const carritoSnapshot = await getDoc(carritoRef);

            if (!carritoSnapshot.exists()) {
                carritoVacio.classList.remove("disabled");
                containerProductosCarrito.classList.add("disabled");
                botonComprarCarrito.classList.add("disabled");
                titulosCarrito.classList.add("disabled");
            }else{

                mostrarProductosEnCarrito(botonesEliminar)

            }
        }
    }

    actualizarContadorCarrito()

}


export async function mostrarProductosEnCarrito(botonesEliminar) {

    const carritoVacio = document.querySelector("#container-carrito-vacio");
    const containerProductosCarrito = document.querySelector("#container-productos-carrito");
    const botonComprarCarrito = document.querySelector("#carrito-boton-comprar")
    const titulosCarrito = document.querySelector("#titulos-carrito");

    const user = auth.currentUser;

    if (user) {
        const userUID = user.uid;

        const usersCollectionRef = collection(db, 'usuarios');
        const query2 = query(usersCollectionRef, where('uid', '==', userUID));

        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {
            const userDocument = querySnapshot.docs[0];
            const idCarrito = userDocument.data().carritoId;

            const carritoRef = doc(db, 'carritos', idCarrito);
            const carritoSnapshot = await getDoc(carritoRef);

            if (carritoSnapshot.exists()) {
                const carritoData = carritoSnapshot.data();

                // Verifica si el carrito tiene productos
                if (carritoData.productos && carritoData.productos.length > 0) {

                    carritoVacio.classList.add("disabled");
                    containerProductosCarrito.classList.remove("disabled");
                    botonComprarCarrito.classList.remove("disabled");
                    titulosCarrito.classList.remove("disabled");

                    containerProductosCarrito.innerHTML = "";

                    const productosEnCarro = carritoData.productos;

                    // Recorre los productos y muéstralos en tu página
                    productosEnCarro.forEach(producto => {

                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                        
                        <th class="text-center"><img src="${producto.imagen}" width="100" alt="${producto.nombre}"></th>
                        <td class="text-center elementos-centrar-carro"><p class="mb-0">${producto.nombre}</p></td>
                        <td class="text-center elementos-centrar-carro"><p class="mb-0 fw-bold fst-italic mt-1">${producto.precio}</p></td>
                        <td class="text-center elementos-centrar-carro"><p class="mb-0">${producto.cantidad}</p></td>
                        <td class="text-center elementos-centrar-carro"><a class="iconos-eliminar" id="${producto.id}" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                          </svg></a></td>        
                
                        
                        `;
                
                        containerProductosCarrito.append(tr);


                        /*
                        // Aquí puedes crear elementos HTML para mostrar cada producto
                        const productoHTML = document.createElement('div');
                        productoHTML.textContent = `Producto: ${producto.nombre}, Cantidad: ${producto.cantidad}`;
                        // Agrega el elemento HTML a tu página
                        document.getElementById('carrito-container').appendChild(productoHTML);*/
                    });

                } else {

                    console.log('El carrito de compras está vacío');
                    carritoVacio.classList.remove("disabled");
                    containerProductosCarrito.classList.add("disabled");
                    botonComprarCarrito.classList.add("disabled");
                    titulosCarrito.classList.add("disabled");
                }

            } else {
                console.log('El carrito de compras no existe');
            }
        }
    }

    actualizarBotonEliminar(botonesEliminar)
}


function actualizarBotonEliminar(botonesEliminar){

    botonesEliminar = document.querySelectorAll(".iconos-eliminar");

    botonesEliminar.forEach(boton => {

        boton.addEventListener("click", eliminarProducto);

    })

}

async function eliminarProducto(e) {
    const idEliminar = e.currentTarget.id;

    loadingIndicator.style.display = 'block';

    const user = auth.currentUser;
    if (user) {
        const userUID = user.uid;

        const usersCollectionRef = collection(db, 'usuarios');
        const query2 = query(usersCollectionRef, where('uid', '==', userUID));

        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {

            const userDocument = querySnapshot.docs[0];
            const idCarrito = userDocument.data().carritoId;

            const carritoRef = doc(db, 'carritos', idCarrito);
            const carritoSnapshot = await getDoc(carritoRef);

            if (carritoSnapshot.exists()) {
                const carritoData = carritoSnapshot.data();

                // Verifica si el carrito tiene productos
                if (carritoData.productos && carritoData.productos.length > 0) {
                    // Filtra el producto a eliminar
                    const nuevosProductos = carritoData.productos.filter(producto => producto.id !== idEliminar);

                    // Actualiza los productos en el carrito
                    await updateDoc(carritoRef, {
                        productos: nuevosProductos
                    });

                    mostrarProductosEnCarrito(botonesEliminar)
                    actualizarBotonEliminar(botonesEliminar)

                } else {
                    console.log('El carrito de compras está vacío');
                }
            } else {
                console.log('El carrito de compras no existe');
            }
        }
    }

    actualizarContadorCarrito()
    loadingIndicator.style.display = 'none';

}


async function actualizarContadorCarrito() {
    const user = auth.currentUser;

    if (user) {
        // Realiza una consulta a la base de datos para obtener la información del carrito
        const userUID = user.uid;
        const usersCollectionRef = collection(db, 'usuarios');
        const query2 = query(usersCollectionRef, where('uid', '==', userUID));
        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {
            const userDocument = querySnapshot.docs[0];
            const idCarrito = userDocument.data().carritoId;
            const carritoRef = doc(db, 'carritos', idCarrito);

            const carritoData = (await getDoc(carritoRef)).data();

            // Calcula la cantidad total de productos en el carrito
            let cantidadTotal = 0;
            let precioTotal = 0;

            if (carritoData.productos && carritoData.productos.length > 0) {
                carritoData.productos.forEach(producto => {
                    cantidadTotal += producto.cantidad;
                    precioTotal += producto.precio * producto.cantidad;
                });
            }

            // Actualiza el valor del contador con la cantidad total de productos en el carrito
            cantidadCarrito.innerText = cantidadTotal;
            totalCarrito.innerHTML = precioTotal;
        }
    }
}

async function comprarCarro() {
    loadingIndicator.style.display = 'block';
    try {
        const user = auth.currentUser;

        if (user) {
            const userId = user.uid;
            
            // Referencia a la colección de usuarios
            const usersCollectionRef = collection(db, 'usuarios');

            // Realiza una consulta para obtener el carrito del usuario actual
            const query2 = query(usersCollectionRef, where('uid', '==', userId));
            const querySnapshot = await getDocs(query2);


            if (!querySnapshot.empty) {
                const userDocument = querySnapshot.docs[0];
                const idCarrito = userDocument.data().carritoId;
                const idCompras = userDocument.data().comprasId;

                // Referencia al documento del carrito de compras del usuario
                const carritoDocRef = doc(db, 'carritos', idCarrito);
                
                // Referencia al documento de compras del usuario
                const comprasDocRef = doc(db, 'compras', idCompras);
                
                // Obtiene el contenido actual del carrito de compras
                const carritoSnapshot = await getDoc(carritoDocRef);

                if (carritoSnapshot.exists()) {
                    const carritoData = carritoSnapshot.data();

                    if (carritoData && carritoData.productos) {
                        
                        // Agrega los productos del carrito a la colección de compras del usuario
                        await updateDoc(comprasDocRef, {
                            productos: arrayUnion(...carritoData.productos)
                        });

                        // Limpia el carrito de compras
                        await updateDoc(carritoDocRef, {
                            productos: []
                        });

                        const modalCompraHecha = new bootstrap.Modal(document.getElementById('modalCompraHecha'));
                        modalCompraHecha.show();

                        //console.log('Carrito vaciado y productos agregados a compras.');
                    }
                }

            }
        }
    } catch (error) {
        console.error('Error al vaciar el carrito y agregar a compras:', error);
    }

    actualizarContadorCarrito()
    mostrarProductosEnCarrito(botonesEliminar)
    loadingIndicator.style.display = 'none';
}