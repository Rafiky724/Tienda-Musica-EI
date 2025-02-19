import { auth, db } from './firebase.js'
import { getDocs, collection, getDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"

export async function mostrarProductosComprados() {

    const comprasVacio = document.querySelector("#container-compras-vacio");
    const containerProductosCompras = document.querySelector("#container-productos-compras");
    const titulosCompras = document.querySelector("#titulos-compras");

    const user = auth.currentUser;

    if (user) {
        const userUID = user.uid;

        const usersCollectionRef = collection(db, 'usuarios');
        const query2 = query(usersCollectionRef, where('uid', '==', userUID));

        const querySnapshot = await getDocs(query2);

        if (!querySnapshot.empty) {

            const userDocument = querySnapshot.docs[0];
            const idCompras = userDocument.data().comprasId;

            console.log(idCompras)

            const comprasRef = doc(db, 'compras', idCompras);
            const comprasSnapshot = await getDoc(comprasRef);

            if (comprasSnapshot.exists()) {
                const comprasData = comprasSnapshot.data();

                // Verifica si el carrito tiene productos
                if (comprasData.productos && comprasData.productos.length > 0) {

                    comprasVacio.classList.add("disabled");
                    containerProductosCompras.classList.remove("disabled");
                    titulosCompras.classList.remove("disabled");

                    containerProductosCompras.innerHTML = "";

                    const productosComprados = comprasData.productos;

                    // Recorre los productos y muéstralos en tu página
                    productosComprados.forEach(producto => {

                        const tr = document.createElement("tr");
                        let pagado = producto.precio * producto.cantidad;
                        tr.innerHTML = `
                        

                        <th class="text-center"><img src="${producto.imagen}" width="100" alt="${producto.nombre}"></th>
                        <td class="text-center elementos-centrar-carro"><p class="mb-0">${producto.nombre}</p></td>
                        <td class="text-center elementos-centrar-carro"><p class="mb-0 fw-bold fst-italic mt-1">${pagado}</p></td>
                        <td class="text-center elementos-centrar-carro"><p class="mb-0">${producto.cantidad}</p></td>     
                
                        
                        `;
                
                        containerProductosCompras.append(tr);


                        /*
                        // Aquí puedes crear elementos HTML para mostrar cada producto
                        const productoHTML = document.createElement('div');
                        productoHTML.textContent = `Producto: ${producto.nombre}, Cantidad: ${producto.cantidad}`;
                        // Agrega el elemento HTML a tu página
                        document.getElementById('carrito-container').appendChild(productoHTML);*/
                    });

                } else {

                    console.log('No hay compras');

                    comprasVacio.classList.remove("disabled");
                    containerProductosCompras.classList.add("disabled");
                    titulosCompras.classList.add("disabled");
                }

            } else {
                console.log('Las compras no existen');
            }
        }
    }
}