//Clase 9 - Juani Aureliano Quevedo

//Objeto

class Producto {
    
    //Constructor
    constructor (id, nombre, descripcion, precio, cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = parseInt(precio);
        this.cantidad = cantidad;
    }

    //Funciones
    //Describe el Producto
    describirProducto ()
    {
        return `Código: ${this.id} | ${this.nombre}: ${this.descripcion} | Precio: ${this.precio}`;
    }

    //Describe la Compra
    describirCompra ()
    {
        let precioTotal = this.precio * this.cantidad;
        return this.cantidad > 1 ? `${this.nombre} | Precio: ${this.precio} | Cantidad: ${this.cantidad} | Sub-Total: ${precioTotal}` : `${this.nombre} | Precio: ${this.precio} | Cantidad: ${this.cantidad}`;
    }

    //suma Cantidad por Una Unidad
    sumarCantidad()
    {
        this.cantidad = this.cantidad + 1;
    }

    //elimina Cantidad por Una Unidad
    restarCantidad()
    {
        if(this.cantidad > 0)
            this.cantidad = this.cantidad - 1;
    }
}

//Productos

let producto1 = new Producto(1, "Spray", "spray de aromaterapia de 250 ml.", 600, 0);
let producto2 = new Producto(2, "Vela", "vela de soja aromaterapia en frasco de 200 ml.", 700, 0);
let producto3 = new Producto(3, "Bombón Soja", "bolsa de tela con 15 bombones de soja aromaterapia.", 450, 0);
let producto4 = new Producto(4, "Tag", "tag de soja aromaterapia", 250, 0);
let producto5 = new Producto(5, "Jabón Natural", "jabones en barra de 70 gr.", 250, 0);
let producto6 = new Producto(6, "Bath Bomb", "bombas de baño coloridas y ecológicas.", 350, 0);
let producto7 = new Producto(7, "Shower Steamer", "para usar en la ducha.", 300, 0);
let producto8 = new Producto(8, "Bath Dust", "Polvo para la bañera, metalizado.", 420, 0);


//Arrays
let productos = [producto1, producto2, producto3, producto4, producto5, producto6, producto7, producto8];
let carrito = [];


//Funciones

//Comprar
function comprar (codigo) {

    //Obtengo el carrito del Storage
    obtenerCarrito();

    //Flag producto nuevo
    let productoNuevo = false;
    
    //Veo si está ya cargado en el carrito
    let producto;
    
    if(carrito.length > 0)
        producto = carrito.find(prod => prod.id == codigo);

    //Si no está cargado, lo busco en la lista de productos y lo declaro como producto nuevo
    if(producto == null)
    {
        producto = productos.find(prod => prod.id == codigo);
        productoNuevo = true;
    }

    //Si tengo el producto
    if(producto != null)
    {
        producto.sumarCantidad();
        
        //Si el producto es nuevo, lo ingreso al carrito
        if(productoNuevo)
            carrito.push(producto);   

        swal("Carrito", "Se agregó correctamente " + producto.nombre + " a tu carrito de compras.", "success");
    }    
}

//Creación del carrito en HTML
function carritoHTML() {

    obtenerCarrito();

    //Encabezado
    let h4 = document.getElementById("tuCompra");
    h4.innerHTML = "Tu carrito contiene:";

    let totalCompra = 0;
    let div = document.getElementById("carrito");
    let stringCarrito = "";

    //Compra
    if(carrito != null && carrito.length > 0)
    {
        carrito.forEach(prod => {
            let boton = '"btnEliminar' + prod.id + '"';
            totalCompra += prod.cantidad * prod.precio;
            stringCarrito += `
            <div class="lineaCarrito">
                <p class="pTienda">${prod.describirCompra()}</p>
                <button class="botonContacto" id=${boton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>`;
        });
    }

    div.innerHTML = stringCarrito;

    //Total
    let h5 = document.getElementById("precioTotal");
    h5.innerHTML = `Total: $${totalCompra}`;
}

//Obtiene el Carrito de Session Storage
function obtenerCarrito()
{
    if(carrito.length == 0)
    {
        const carritoStorage = JSON.parse(localStorage.getItem("carritoLocal"));

        if(carritoStorage != null)
        {
            for(const prod of carritoStorage)
            {
                carrito.push(new Producto(prod.id, prod.nombre, prod.descripcion, prod.precio, prod.cantidad));
            }
        }            
    }
}

//Borra el Carrito
function borrarCarrito()
{
    localStorage.clear();
    carrito = [];
    let h4 = document.getElementById("tuCompra");
    h4.innerHTML = "";
    let h5 = document.getElementById("precioTotal");
    h5.innerHTML = "";
    let div = document.getElementById("carrito");
    div.innerHTML = "";
}

//Borra Producto por Unidad
function borrarProductoUnidad(event)
{
    //Obtengo el control
    let btnNombre = event.target.id;

    //Guardo la parte númerica, o sea, el id del Producto
    let idProducto = btnNombre.match(/\d+/) != null ? btnNombre.match(/\d+/)[0] : 0;

    //Busco el producto
    let producto = carrito.find(prod => prod.id == idProducto);

    //Si lo encuentro, procedo
    if(producto != null)
    {
        //Si es el último, lo saco del carrito
        if(producto.cantidad == 1)
        {
            carrito = carrito.filter(prod => prod.id != idProducto);
        }
        else
        {
            //Sino, resto la cantidad del Producto
            producto.restarCantidad();
        }

        //Actualizo el carrito
        carritoHTML();
    }
}

//Mostrar Información
function mostrarInformacion(id) {

    //Declaramos la url del archivo JSON local
    const urlLocal = "./JSON/datos.json";
    
    $.getJSON(urlLocal, function (respuesta, estado) {
        if(estado == "success")
        {
            let producto = respuesta.find(prod => prod.id == id);
            swal(producto.nombre, producto.descripción + "\n\n" + producto.consejos);
        }
    });
}

//Eventos
let botonSpray = document.getElementById("btnSpray");
botonSpray.onclick = () => comprar(1);

let botonSprayInfo = document.getElementById("btnSprayInfo");
botonSprayInfo.onclick = () => mostrarInformacion(1);

let botonVela = document.getElementById("btnVela");
botonVela.onclick = () => comprar(2);

let botonVelaInfo = document.getElementById("btnVelaInfo");
botonVelaInfo.onclick = () => mostrarInformacion(2);

let botonBombon = document.getElementById("btnBombon");
botonBombon.onclick = () => comprar(3);

let botonBombonInfo = document.getElementById("btnBombonInfo");
botonBombonInfo.onclick = () => mostrarInformacion(3);

let botonTag = document.getElementById("btnTag");
botonTag.onclick = () => comprar(4);

let botonTagInfo = document.getElementById("btnTagInfo");
botonTagInfo.onclick = () => mostrarInformacion(4);

let botonJabon = document.getElementById("btnJabon");
botonJabon.onclick = () => comprar(5);

let botonJabonInfo = document.getElementById("btnJabonInfo");
botonJabonInfo.onclick = () => mostrarInformacion(5);

let botonBomba = document.getElementById("btnBomba");
botonBomba.onclick = () => comprar(6);

let botonBombaInfo = document.getElementById("btnBombaInfo");
botonBombaInfo.onclick = () => mostrarInformacion(6);

let botonShower = document.getElementById("btnShower");
botonShower.onclick = () => comprar(7);

let botonShowerInfo = document.getElementById("btnShowerInfo");
botonShowerInfo.onclick = () => mostrarInformacion(7);

let botonPolvo = document.getElementById("btnPolvo");
botonPolvo.onclick = () => comprar(8);

let botonPolvoInfo = document.getElementById("btnPolvoInfo");
botonPolvoInfo.onclick = () => mostrarInformacion(8);

let botonCarrito = document.getElementById("btnCarrito");
botonCarrito.onclick = () => carritoHTML();

//Animación en botón ver Carrito
let flag = true;
$('#btnCarrito').click(() => {    

    if(flag == true)
    {
        $("#tuCompra").slideDown("slow");
        $("#carrito").slideDown("slow");
        $("#precioTotal").slideDown("slow");
        $("#btnCarrito").text("Ocultar Carrito");
    }
    else
    {
        $("#tuCompra").slideUp("slow");
        $("#carrito").slideUp("slow");
        $("#precioTotal").slideUp("slow");
        $("#btnCarrito").text("Ver Carrito");
    }

    flag = !flag;
});

let botonBorrarCarrito = document.getElementById("btnBorrarCarrito");
botonBorrarCarrito.onclick = () => borrarCarrito();

//Guardar Carrito
$("#guardarCarrito").append('<button class="botonContacto" id="guardarCarro">Guardar Carrito</button>');
$("#guardarCarro").click(function() {
    localStorage.clear();
    localStorage.setItem("carritoLocal", JSON.stringify(carrito));
});

//Botones eliminar
for(const prod of productos)
{
    let btn = "#btnEliminar" + prod.id;
    $(document).on('click', btn, (event) => borrarProductoUnidad(event));
}
