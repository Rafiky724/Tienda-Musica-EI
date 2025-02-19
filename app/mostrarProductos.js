import { db } from './firebase.js'
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"
import { actualizarBotonCarro } from './carritoCompras.js'
//console.log(productosBD)

import './carritoCompras.js'

const productosBD = await getDocs(collection(db, 'productos2'))
let botonProductos = document.querySelectorAll(".tarjeta-producto");
const productoArreglado = productosBD.docs.map(product => product.data());
let botonAgregarCarro = document.querySelectorAll(".agregar-producto-identificador");

export function mostrarProductos(prod){

    if (prod.length) {

        const conetenedorProductos = document.querySelector("#contenedor-productos");
    
        conetenedorProductos.innerHTML = "";
    
        prod.forEach(doc => {
    
            function cargarProductos(productos){
    
                const div = document.createElement("div");
                div.classList.add("col-xxl-3", "col-xl-4", "col-sm-6", "d-flex", "justify-content-center", "mb-3");
        
                div.innerHTML = `
                
                <a id="${productos.idProducto}" class="a-color tarjeta-producto" data-bs-toggle="modal" data-bs-target="#exampleModalProducto">
        
                    <div class="d-flex flex-column align-items-center">
        
                        <img src="${productos.imagen}" width="225" alt="${productos.nombre}">
                        <p class="mb-0 mt-1">${productos.nombre}</p>
                        <p class="fw-bold fst-italic">${productos.precio}$</p>
        
                    </div>
                    
        
                </a>
        
                <button type="button" id="${productos.id}" class=" agregar-producto-identificador container-carrito log-in" data-bs-toggle="modal" data-bs-target="#exampleModal3" >
        
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart agregar-carrito" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                     </svg>
        
                </button>
                
                <button type="button" id="${productos.id}" class="container-favorito log-in agregar-producto-favorito" data-bs-toggle="modal" data-bs-target="#exampleModalFavorito" >

                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                      </svg>

                </button>

                
                `
                conetenedorProductos.append(div);
    
            }
            
            cargarProductos(doc)
    
        })
    
    
    }else {
    
        //console.log('loop null')

        const conetenedorProductos = document.querySelector("#contenedor-productos");
    
        conetenedorProductos.innerHTML = `
        
        <p class="fs-5 fw-bold fst-italic">¡Oh no!</p>
        <p>Desafortunadamente no tenemos productos para mostrar en este momento</p>

        `;
    
    }

    actualizarBotonProducto()

}

export function actualizarBotonProducto(){

    botonProductos = document.querySelectorAll(".tarjeta-producto");

    //console.log(botonProductos);

    botonProductos.forEach(boton => {

        boton.addEventListener("click", mostrarProducto)

    })

}

function mostrarProducto(e){

    //console.log(e);

    const idMostrar = e.currentTarget.id;
    const productoMostrar = productoArreglado.filter(articulo => articulo.idProducto ===  idMostrar);
    
    const contenedorMostrarProducto = document.querySelector("#contenedor-mostrar-producto")

    contenedorMostrarProducto.innerHTML = ""
    const div = document.createElement("div");
    div.classList.add("modal-content");

    div.innerHTML = `
    

        <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            
            <div class="d-flex">

                
                <img class="img-fluid w-50" src="${productoMostrar[0].imagen}" alt="${productoMostrar[0].nombre}">

                <div class="ms-4 mt-2">

                    <p class="fs-3 fw-bold">${productoMostrar[0].nombre}</p>
                    <p>${productoMostrar[0].descripcion}</p>
                    <p class="fw-bold fst-italic">${productoMostrar[0].precio}$</p>

                </div>

            </div>

        </div>
        <div class="modal-footer">

            <button id="${productoMostrar[0].id}" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal3" class="btn boton-sesion agregar-producto-identificador">Comprar</button>

            <button type="button" class="btn btn-secondary boton-registro" data-bs-dismiss="modal">Cerrar</button>

        </div>

    
    `

    contenedorMostrarProducto.append(div);
    actualizarBotonCarro(botonAgregarCarro);

}

/*
botonesCategorias.forEach(botonCategoria => {

    botonCategoria.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active2"));
        e.currentTarget.classList.add("active2");

        if(e.currentTarget.id != "TodosID"){

            const productosFiltrar = productoArreglado.filter(articulo => articulo.idCategoria ===  e.currentTarget.id);
            console.log(productosFiltrar)

            mostrarProductos(productosFiltrar);


        }else{

            mostrarProductos(productoArreglado)

        }

        actualizarBotonCarro(botonAgregarCarro)


    })
})*/