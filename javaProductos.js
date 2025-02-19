import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { auth, db } from './app/firebase.js'
import { getDocs, collection, getDoc, query, where, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"
import { mostrarProductos } from './app/mostrarProductos.js'
import { actualizarBotonCarro, verificarCarritoDeCompras } from './app/carritoCompras.js'
import { actualizarBotonFavorito, verificarFavoritos } from './app/favoritos.js'

const productosBD = await getDocs(collection(db, 'productos2'))
const productoArreglado = productosBD.docs.map(product => product.data());

const botonesCategorias = document.querySelectorAll(".container-categorias");
const botonesFiltros = document.querySelectorAll(".botones-filtros");

let botonAgregarCarro = document.querySelectorAll(".agregar-producto-identificador");
let botonesEliminar = document.querySelectorAll(".iconos-eliminar")
let botonesEliminarFavoritos = document.querySelectorAll(".iconos-eliminar-favoritos")
let botonAgregarFavoritos = document.querySelectorAll(".agregar-producto-favorito");

const searchInput = document.getElementById("searchInput");
const productosContainer = document.getElementById("contenedor-productos");

import './app/CerrarSesion.js'
import './app/LoginCheck.js'
import './app/mostrarProductos.js'
import './app/carritoCompras.js'
import { loginCheck } from "./app/LoginCheck.js"

onAuthStateChanged(auth, async (user) => {

    loginCheck(user)
    console.log(user)
    let contenedorCarga = document.getElementById('loader-pagina');

    contenedorCarga.style.visibility = 'hidden';
    setTimeout(function () {
        contenedorCarga.style.opacity = '0';
      }, 100);

})

mostrarProductos(productoArreglado)

botonesCategorias.forEach(botonCategoria => {

    botonCategoria.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active2"));
        botonesFiltros.forEach(boton => boton.classList.remove("active"));

        e.currentTarget.classList.add("active2");

        if(e.currentTarget.id != "TodosID"){

            const productosFiltrar = productoArreglado.filter(articulo => articulo.idCategoria ===  e.currentTarget.id);
            console.log(productosFiltrar)

            mostrarProductos(productosFiltrar);


        }else{

            mostrarProductos(productoArreglado)

        }

        actualizarBotonCarro(botonAgregarCarro)
        actualizarBotonFavorito(botonAgregarFavoritos)


    })
})

botonesFiltros.forEach(botonFiltro => {

    botonFiltro.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active2"));
        botonesFiltros.forEach(boton => boton.classList.remove("active"));

        e.currentTarget.classList.add("active");
        /*
        if(e.currentTarget.id != "TodosID"){

            const productosFiltrar = productoArreglado.filter(articulo => articulo.idCategoria ===  e.currentTarget.id);
            console.log(productosFiltrar)

            mostrarProductos(productosFiltrar);


        }else{

            mostrarProductos(productoArreglado)

        }*/

        const productosFiltrar = productoArreglado.filter(articulo => articulo.idFiltro.some(filtroId => filtroId === e.currentTarget.id));

        mostrarProductos(productosFiltrar);

        actualizarBotonCarro(botonAgregarCarro)
        actualizarBotonFavorito(botonAgregarFavoritos)


    })
})

searchInput.addEventListener("input", (event) => {
    const searchText = event.target.value.trim().toLowerCase();
    
    const productosFiltrados = productoArreglado.filter((producto) => {
        const nombreProducto = producto.nombre.toLowerCase();
        return nombreProducto.includes(searchText);
    });

    mostrarProductos(productosFiltrados);

});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      productosContainer.scrollIntoView({ behavior: "smooth" });
    }
});

actualizarBotonCarro(botonAgregarCarro)
actualizarBotonFavorito(botonAgregarFavoritos)

verificarCarritoDeCompras(botonesEliminar)
verificarFavoritos(botonesEliminarFavoritos)



//ARREGLOS DE PRODUCTOS

const productosArray = [

    {

        id: "1",
        nombre: "Mochila piola",
        precio: "40.000$",
        imagen: "/src/Mochilas/mochila-1.png",
        descripcion: "Una de las mejores mochilas de la historia",
        categoria: {

            nombre: "Mochilas",
            id: "MochilasID"

        }

    },

    {

        id: "2",
        nombre: "Mochila muy piola",
        precio: "60.000$",
        imagen: "/src/Mochilas/mochila-2.png",
        descripcion: "Una de las mejores mochilas de la historia",
        categoria: {

            nombre: "Mochilas",
            id: "MochilasID"

        }

    },

    {

        id: "3",
        nombre: "Mochila extremadamente piola",
        precio: "80.000$",
        imagen: "/src/Mochilas/mochila-3.png",
        descripcion: "Una de las mejores mochilas de la historia",
        categoria: {

            nombre: "Mochilas",
            id: "MochilasID"

        }

    },

    {

        id: "4",
        nombre: "Termo para beber",
        precio: "26.000$",
        imagen: "/src/Termos/termo-1.png",
        descripcion: "Uno de los mejores termos de la historia",
        categoria: {

            nombre: "Termos",
            id: "TermosID"

        }

    },

    {

        id: "5",
        nombre: "Termo para tomar",
        precio: "15.000$",
        imagen: "/src/Termos/termo-2.png",
        descripcion: "Uno de los mejores termos de la historia",
        categoria: {

            nombre: "Termos",
            id: "TermosID"

        }

    },

    {

        id: "6",
        nombre: "Termo para tragar",
        precio: "30.000$",
        imagen: "/src/Termos/termo-3.png",
        descripcion: "Uno de los mejores termos de la historia",
        categoria: {

            nombre: "Termos",
            id: "TermosID"

        }

    },

    {

        id: "7",
        nombre: "Gafas aesthetic",
        precio: "65.000$",
        imagen: "/src/Accesorios/accesorio-1.png",
        descripcion: "Una de las mejores gafas de la historia",
        categoria: {

            nombre: "Accesorios",
            id: "AccesoriosID"

        }

    },

    {

        id: "8",
        nombre: "Reloj tu propio jefe",
        precio: "105.000$",
        imagen: "/src/Accesorios/accesorio-2.png",
        descripcion: "Uno de las mejores relojes de la historia",
        categoria: {

            nombre: "Accesorios",
            id: "AccesoriosID"

        }

    },

    {

        id: "9",
        nombre: "Bolso bolsito",
        precio: "85.000$",
        imagen: "/src/Accesorios/accesorio-3.png",
        descripcion: "Uno de las mejores bolsos de la historia",
        categoria: {

            nombre: "Accesorios",
            id: "AccesoriosID"

        }

    },

    {

        id: "10",
        nombre: "Cuaderno simple",
        precio: "3.500$",
        imagen: "/src/Cuadernos/cuaderno-1.png",
        descripcion: "Uno de los mejores cuadernos de la historia",
        categoria: {

            nombre: "Cuadernos",
            id: "CuadernoID"

        }

    },

    {

        id: "11",
        nombre: "Cuaderno sarpado",
        precio: "5.000$",
        imagen: "/src/Cuadernos/cuaderno-2.png",
        descripcion: "Uno de los mejores cuadernos de la historia",
        categoria: {

            nombre: "Cuadernos",
            id: "CuadernoID"

        }

    },

    {

        id: "12",
        nombre: "Cuaderno de Dios",
        precio: "10.000$",
        imagen: "/src/Cuadernos/cuaderno-3.png",
        descripcion: "Uno de los mejores cuadernos de la historia",
        categoria: {

            nombre: "Cuadernos",
            id: "CuadernoID"

        }

    },

    {

        id: "13",
        nombre: "Labial Miss Universo",
        precio: "45.000$",
        imagen: "/src/Otros/otro-1.png",
        descripcion: "Uno de los mejores labiales de la historia",
        categoria: {

            nombre: "Otros",
            id: "OtroID"

        }

    },

    {

        id: "14",
        nombre: "Auriculares Skrillex",
        precio: "35.000$",
        imagen: "/src/Otros/otro-2.png",
        descripcion: "Uno de los mejores auriculres de la historia",
        categoria: {

            nombre: "Otros",
            id: "OtroID"

        }

    },

    {

        id: "15",
        nombre: "Calculadora de Oppenheimer",
        precio: "100.000$",
        imagen: "/src/Otros/otro-3.png",
        descripcion: "Una de las mejores calculadoras de la historia",
        categoria: {

            nombre: "Otros",
            id: "OtroID"

        }

    },

    {

        id: "16",
        nombre: "Uniforme chefsito",
        precio: "80.000$",
        imagen: "/src/Uniformes/uniforme-1.png",
        descripcion: "Uno de los mejores uniformes de la historia",
        categoria: {

            nombre: "Uniforme",
            id: "UniformeID"

        }

    },

    {

        id: "17",
        nombre: "Uniforme Grey's Anatomy",
        precio: "100.000$",
        imagen: "/src/Uniformes/uniforme-2.png",
        descripcion: "Uno de los mejores uniformes de la historia",
        categoria: {

            nombre: "Uniforme",
            id: "UniformeID"

        }

    },

    {

        id: "18",
        nombre: "Uniforme Ni idea",
        precio: "75.000$",
        imagen: "/src/Uniformes/uniforme-3.png",
        descripcion: "Uno de los mejores uniformes de la historia",
        categoria: {

            nombre: "Uniforme",
            id: "UniformeID"

        }

    },

    {

        id: "19",
        nombre: "Marcadores chetados",
        precio: "15.000$",
        imagen: "/src/Utiles/util-1.png",
        descripcion: "Uno de los mejores marcadores de la historia",
        categoria: {

            nombre: "Utiles",
            id: "UtilID"

        }

    },

    {

        id: "20",
        nombre: "Colores Raibow Dash",
        precio: "8.000$",
        imagen: "/src/Utiles/util-2.png",
        descripcion: "Uno de los mejores colores de la historia",
        categoria: {

            nombre: "Utiles",
            id: "UtilID"

        }

    },

    {

        id: "21",
        nombre: "Tijeras para cortar cortando",
        precio: "4.000$",
        imagen: "/src/Utiles/util-3.png",
        descripcion: "Una de los mejores tijeras de la historia",
        categoria: {

            nombre: "Utiles",
            id: "UtilID"

        }

    }

    

];

//const conetenedorProductos = document.querySelector("#contenedor-productos");
//const botonesCategorias = document.querySelectorAll(".container-categorias");
//let botonAgregarCarro = document.querySelectorAll(".container-carrito");
//const cantidadCarrito = document.querySelector("#cantidad-carro");

//CARRITO DE COMPRAS

/*
const carritoVacio = document.querySelector("#container-carrito-vacio");
const containerProductosCarrito = document.querySelector("#container-productos-carrito");
const botonComprarCarrito = document.querySelector("#carrito-boton-comprar")
const titulosCarrito = document.querySelector("#titulos-carrito");
*/


//

//let botonesEliminar = document.querySelectorAll(".iconos-eliminar")


function cargarProductos(productosMostrar){

    conetenedorProductos.innerHTML = "";

    productosMostrar.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("col-xxl-3", "col-xl-4", "col-sm-6", "d-flex", "justify-content-center", "mb-3");
        div.innerHTML = `
        
        <a href="#" class="a-color tarjeta-producto">

            <div class="d-flex flex-column align-items-center">

                <img src="${producto.imagen}" width="225" alt="${producto.nombre}">
                <p class="mb-0 mt-1">${producto.nombre}</p>
                <p class="fw-bold fst-italic">${producto.precio}</p>

            </div>
            


        </a>

        <button type="button" id="${producto.id}" class="container-carrito log-in" data-bs-toggle="modal" data-bs-target="#exampleModal3" >

           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart agregar-carrito" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
             </svg>

        </button>
        
        `

        conetenedorProductos.append(div);

    })

    actualizarBotonCarro()

}

//cargarProductos(productosArray);

/*
botonesCategorias.forEach(botonCategoria => {

    botonCategoria.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active2"));
        e.currentTarget.classList.add("active2");

        if(e.currentTarget.id != "TodosID"){

            const productosFiltrar = productosArray.filter(articulo => articulo.categoria.id ===  e.currentTarget.id);
            cargarProductos(productosFiltrar);


        }else{

            cargarProductos(productosArray);

        }

        

    })
})

*/
/*
function actualizarBotonCarro(){

    botonAgregarCarro = document.querySelectorAll(".container-carrito");

    botonAgregarCarro.forEach(boton => {

        boton.addEventListener("click", agregarAlCarrito);

    })

}*/


let productosEnCarro = [];

const productosEnLS = JSON.parse(localStorage.getItem("producto-en-carro"));
/*
if (productosEnLS && productosEnCarro.length == 0){

    productosEnCarro = productosEnLS;
    actualizarCantidad();

    //CARRITO

    actualizarContainerCarrito()
    
 
}else{

    carritoVacio.classList.remove("disabled");
    containerProductosCarrito.classList.add("disabled");
    botonComprarCarrito.classList.add("disabled");
    titulosCarrito.classList.add("disabled");

    productosEnCarro = [];

}*/

/*
function agregarAlCarrito(e){

    const id = e.currentTarget.id;
    const productoAgregado = productosArray.find(producto => producto.id === id);
    

    if(productosEnCarro.some(producto => producto.id === id)){

        const index = productosEnCarro.findIndex(producto => producto.id === id);
        productosEnCarro[index].cantidad++;

    }else{

        productoAgregado.cantidad = 1;
        productosEnCarro.push(productoAgregado);

    }

    actualizarContainerCarrito()
    actualizarCantidad()

    localStorage.setItem("producto-en-carro", JSON.stringify(productosEnCarro));

}*/
/*
function actualizarCantidad(){

    let numero = productosEnCarro.reduce((acc, producto) => acc + producto.cantidad, 0);
    cantidadCarrito.innerText = numero;

}*/
/*
function actualizarContainerCarrito(){

    carritoVacio.classList.add("disabled");
    containerProductosCarrito.classList.remove("disabled");
    botonComprarCarrito.classList.remove("disabled");
    titulosCarrito.classList.remove("disabled");


    containerProductosCarrito.innerHTML = "";

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

    });

    actualizarBotonCarro();
    actualizarBotonEliminar();

}*/


function actualizarBotonEliminar(){

    botonesEliminar = document.querySelectorAll(".iconos-eliminar");

    botonesEliminar.forEach(boton => {

        boton.addEventListener("click", eliminarProducto);

    })

}

function eliminarProducto(e){

    let idEliminar = e.currentTarget.id;
    const index = productosEnCarro.findIndex(producto => producto.id === idEliminar)
    productosEnCarro.splice(index, 1);
    actualizarContainerCarrito();
    localStorage.setItem("producto-en-carro", JSON.stringify(productosEnCarro));
    actualizarCantidad();
    verificarCarrito();

}

function verificarCarrito(){

    if (productosEnCarro.length === 0){

        carritoVacio.classList.remove("disabled");
        containerProductosCarrito.classList.add("disabled");
        botonComprarCarrito.classList.add("disabled");
        titulosCarrito.classList.add("disabled");
    
        productosEnCarro = [];
        
     
    }

}

