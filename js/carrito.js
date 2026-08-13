const CLAVE_CARRITO = "medicinaAncestralCarrito";

let carrito = [];
let catalogoProductos = [];
let temporizadorNotificacion;

function mostrarNotificacion(mensaje) {
  if (!notificacion) {
    return;
  }

  clearTimeout(temporizadorNotificacion);

  notificacion.textContent = mensaje;
  notificacion.classList.add("activa");

  temporizadorNotificacion = setTimeout(() => {
    notificacion.classList.remove("activa");
  }, 2500);
}


/* ---------------------------------
   ELEMENTOS DEL DOM
--------------------------------- */

const carritoPanel = document.querySelector("#carrito-panel");
const carritoOverlay = document.querySelector("#carrito-overlay");
const abrirCarrito = document.querySelector("#abrir-carrito");
const cerrarCarrito = document.querySelector("#cerrar-carrito");

const carritoItems = document.querySelector("#carrito-items");
const contadorCarrito = document.querySelector("#contador-carrito");
const carritoTotal = document.querySelector("#carrito-total");
const finalizarWhatsapp = document.querySelector("#finalizar-whatsapp");

const vaciarCarritoBoton = document.querySelector("#vaciar-carrito");
const notificacion = document.querySelector("#notificacion");
/* ---------------------------------
   LOCAL STORAGE
--------------------------------- */

function guardarCarrito() {
  const carritoParaGuardar = carrito.map((producto) => {
    return {
      id: producto.id,
      cantidad: producto.cantidad
    };
  });

  const carritoConvertidoATexto = JSON.stringify(
    carritoParaGuardar
  );

  localStorage.setItem(
    CLAVE_CARRITO,
    carritoConvertidoATexto
  );
}

function cargarCarritoGuardado(productos) {
  const carritoGuardado = localStorage.getItem(
    CLAVE_CARRITO
  );

  if (!carritoGuardado) {
    return [];
  }

  try {
    const itemsGuardados = JSON.parse(carritoGuardado);

    if (!Array.isArray(itemsGuardados)) {
      return [];
    }

    return itemsGuardados
      .map((itemGuardado) => {
        const productoCatalogo = productos.find(
          (producto) => {
            return producto.id === Number(itemGuardado.id);
          }
        );

        if (!productoCatalogo) {
          return null;
        }

        return {
          id: productoCatalogo.id,
          nombre: productoCatalogo.nombre,
          precio: productoCatalogo.precio,
          imagen: productoCatalogo.imagen,
          cantidad: Math.max(
            1,
            Number(itemGuardado.cantidad) || 1
          )
        };
      })
      .filter((producto) => producto !== null);

  } catch (error) {
    console.error(
      "No se pudo recuperar el carrito:",
      error
    );

    localStorage.removeItem(CLAVE_CARRITO);

    return [];
  }
}

function sincronizarCarrito() {
  guardarCarrito();
  actualizarCarrito();
}

/* ---------------------------------
   INICIALIZACIÓN
--------------------------------- */

function inicializarCarrito(productos) {
  catalogoProductos = productos;

  carrito = cargarCarritoGuardado(
    catalogoProductos
  );

  if (
    !abrirCarrito ||
    !cerrarCarrito ||
    !carritoPanel ||
    !carritoOverlay ||
    !carritoItems ||
    !contadorCarrito ||
    !carritoTotal ||
    !finalizarWhatsapp ||
    !vaciarCarritoBoton
  ) {
    console.warn(
      "No se encontraron todos los elementos del carrito."
    );

    return;
  }

  abrirCarrito.addEventListener(
    "click",
    abrirPanelCarrito
  );

  cerrarCarrito.addEventListener(
    "click",
    cerrarPanelCarrito
  );

  carritoOverlay.addEventListener(
    "click",
    cerrarPanelCarrito
  );

  finalizarWhatsapp.addEventListener(
    "click",
    finalizarCompraWhatsapp
  );

  vaciarCarritoBoton.addEventListener(
  "click",
  vaciarCarrito
  );

  const productosContenedor = document.querySelector(
  "#productos-container"
);

  if (productosContenedor) {
  productosContenedor.addEventListener(
    "click",
    manejarClickProductos
  );
}

  carritoItems.addEventListener(
  "click",
  manejarClickCarrito
);  

  document.addEventListener(
  "keydown",
  manejarTeclaCarrito
);

actualizarCarrito();
}

function manejarTeclaCarrito(evento) {
  if (evento.key !== "Escape") {
    return;
  }

  const carritoEstaAbierto =
    carritoPanel.classList.contains("activo");

  if (!carritoEstaAbierto) {
    return;
  }

  cerrarPanelCarrito();
  abrirCarrito.focus();
}

/* ---------------------------------
   EVENTOS DE PRODUCTOS
--------------------------------- */

function manejarClickProductos(evento) {
  if (evento.type !== "click") {
    return;
  }

  const botonAgregar = evento.target.closest(
    ".agregar-carrito"
  );

  if (!botonAgregar) {
    return;
  }

  const productoId = Number(
    botonAgregar.dataset.id
  );

  agregarProductoAlCarrito(productoId);
}

function manejarClickCarrito(evento) {
  const boton = evento.target.closest(
    "[data-accion]"
  );

  if (!boton) {
    return;
  }

  const productoId = Number(
    boton.dataset.id
  );

  const accion = boton.dataset.accion;

  switch (accion) {
    case "sumar":
      sumarProducto(productoId);
      break;

    case "restar":
      restarProducto(productoId);
      break;

    case "eliminar":
      eliminarProducto(productoId);
      break;

    default:
      console.warn(
        `Acción desconocida en el carrito: ${accion}`
      );
  }
}

function agregarProductoAlCarrito(productoId) {
  const productoSeleccionado =
    catalogoProductos.find((producto) => {
      return producto.id === productoId;
    });

  if (!productoSeleccionado) {
    console.error(
      `No se encontró el producto con id ${productoId}`
    );

    return;
  }

  const productoExistente = carrito.find(
    (producto) => {
      return producto.id === productoId;
    }
  );

  if (productoExistente) {
    productoExistente.cantidad++;

    mostrarNotificacion(
      `Se agregó otra unidad de ${productoSeleccionado.nombre}.`
    );
  } else {
    carrito.push({
      id: productoSeleccionado.id,
      nombre: productoSeleccionado.nombre,
      precio: productoSeleccionado.precio,
      imagen: productoSeleccionado.imagen,
      cantidad: 1
    });

    mostrarNotificacion(
      `${productoSeleccionado.nombre} se agregó al carrito.`
    );
  }

  sincronizarCarrito();
  abrirPanelCarrito();
}

/* ---------------------------------
   PANEL LATERAL
--------------------------------- */

function abrirPanelCarrito() {
  carritoPanel.classList.add("activo");
  carritoOverlay.classList.add("activo");

  carritoPanel.setAttribute(
    "aria-hidden",
    "false"
  );

  cerrarCarrito.focus();
}

function cerrarPanelCarrito() {
  carritoPanel.classList.remove("activo");
  carritoOverlay.classList.remove("activo");

  carritoPanel.setAttribute(
    "aria-hidden",
    "true"
  );
}

/* ---------------------------------
   RENDERIZADO
--------------------------------- */

function actualizarCarrito() {
  carritoItems.innerHTML = "";

  if (carrito.length === 0) {
  carritoItems.innerHTML = `
    <p class="carrito-vacio">
      Todavía no agregaste productos.
    </p>
  `;

  contadorCarrito.textContent = "0";
  carritoTotal.textContent = formatearPrecio(0);

  vaciarCarritoBoton.disabled = true;

  return;
}

  vaciarCarritoBoton.disabled = false;

  carritoItems.innerHTML = carrito
    .map((producto) => crearItemCarrito(producto))
    .join("");

  actualizarResumenCarrito();
}

function crearItemCarrito(producto) {
  const subtotal =
    producto.precio * producto.cantidad;

  return `
    <article
      class="carrito-item"
      data-id="${producto.id}"
    >
      <img
        src="${producto.imagen}"
        alt="${producto.nombre}"
        class="carrito-item-imagen"
      >

      <div class="carrito-item-info">
        <h3>${producto.nombre}</h3>

        <p>
          Precio: ${formatearPrecio(producto.precio)}
        </p>

        <div class="carrito-controles">
          <button
            type="button"
            data-id="${producto.id}"
            data-accion="restar"
            aria-label="Restar una unidad de ${producto.nombre}"
          >
            −
          </button>

          <span
            aria-label="${producto.cantidad} unidades"
          >
            ${producto.cantidad}
          </span>

          <button
            type="button"
            data-id="${producto.id}"
            data-accion="sumar"
            aria-label="Sumar una unidad de ${producto.nombre}"
          >
            +
          </button>
        </div>

        <p class="carrito-subtotal">
          Subtotal:
          ${formatearPrecio(subtotal)}
        </p>

        <button
          type="button"
          class="btn-eliminar"
          data-id="${producto.id}"
          data-accion="eliminar"
          aria-label="Eliminar ${producto.nombre} del carrito"
        >
          Eliminar
        </button>
      </div>
    </article>
  `;
}

function actualizarResumenCarrito() {
  const cantidadTotal = carrito.reduce(
    (acumulador, producto) => {
      return acumulador + producto.cantidad;
    },
    0
  );

  const total = carrito.reduce(
    (acumulador, producto) => {
      return (
        acumulador +
        producto.precio * producto.cantidad
      );
    },
    0
  );

  contadorCarrito.textContent = cantidadTotal;
  carritoTotal.textContent = formatearPrecio(total);
}

/* ---------------------------------
   MODIFICAR CANTIDADES
--------------------------------- */

function sumarProducto(productoId) {
  const producto = carrito.find(
    (item) => item.id === productoId
  );

  if (!producto) {
    return;
  }

  producto.cantidad++;

  sincronizarCarrito();

  mostrarNotificacion(
    `Cantidad actualizada: ${producto.cantidad}.`
  );
}

function restarProducto(productoId) {
  const producto = carrito.find(
    (item) => item.id === productoId
  );

  if (!producto) {
    return;
  }

  if (producto.cantidad > 1) {
    producto.cantidad--;

    sincronizarCarrito();

    mostrarNotificacion(
      `Cantidad actualizada: ${producto.cantidad}.`
    );
  } else {
    eliminarProducto(productoId);
  }
}

function eliminarProducto(productoId) {
  const productoEliminado = carrito.find(
    (producto) => producto.id === productoId
  );

  carrito = carrito.filter((producto) => {
    return producto.id !== productoId;
  });

  sincronizarCarrito();

  if (productoEliminado) {
    mostrarNotificacion(
      `${productoEliminado.nombre} se eliminó del carrito.`
    );
  }
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    mostrarNotificacion(
      "El carrito ya está vacío."
    );

    return;
  }

  const confirmarVaciado = confirm(
    "¿Querés eliminar todos los productos del carrito?"
  );

  if (!confirmarVaciado) {
    return;
  }

  carrito = [];

  sincronizarCarrito();

  mostrarNotificacion(
    "Se vació el carrito."
  );
}

/* ---------------------------------
   WHATSAPP
--------------------------------- */

function finalizarCompraWhatsapp() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let mensaje =
    "Hola, quiero realizar el siguiente pedido:\n\n";

  carrito.forEach((producto) => {
    const subtotal =
      producto.precio * producto.cantidad;

    mensaje += `• ${producto.nombre}\n`;
    mensaje += `Cantidad: ${producto.cantidad}\n`;
    mensaje += `Subtotal: ${formatearPrecio(subtotal)}\n\n`;
  });

  const total = carrito.reduce(
    (acumulador, producto) => {
      return (
        acumulador +
        producto.precio * producto.cantidad
      );
    },
    0
  );

  mensaje += `Total del pedido: ${formatearPrecio(total)}\n\n`;
  mensaje +=
    "Quisiera recibir orientación para finalizar la compra.";

  const telefono = "5491138456670";

  const url =
    `https://wa.me/${telefono}?text=` +
    encodeURIComponent(mensaje);

  window.open(url, "_blank");
}