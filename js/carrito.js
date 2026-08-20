const CLAVE_CARRITO =
  "medicinaAncestralCarrito";

const TELEFONO_WHATSAPP =
  "5491138456670";


let carrito = [];
let catalogoProductos = [];

let carritoInicializado = false;
let temporizadorNotificacion = null;


/* ==================================================
   ELEMENTOS
================================================== */

const carritoPanel =
  document.querySelector(
    "#carrito-panel"
  );

const carritoOverlay =
  document.querySelector(
    "#carrito-overlay"
  );

const abrirCarrito =
  document.querySelector(
    "#abrir-carrito"
  );

const cerrarCarrito =
  document.querySelector(
    "#cerrar-carrito"
  );

const carritoItems =
  document.querySelector(
    "#carrito-items"
  );

const contadorCarrito =
  document.querySelector(
    "#contador-carrito"
  );

const carritoTotal =
  document.querySelector(
    "#carrito-total"
  );

const finalizarWhatsapp =
  document.querySelector(
    "#finalizar-whatsapp"
  );

const vaciarCarritoBtn =
  document.querySelector(
    "#vaciar-carrito"
  );

const notificacion =
  document.querySelector(
    "#notificacion"
  );


/* ==================================================
   INICIALIZAR
================================================== */

function inicializarCarrito(
  productos
) {

  catalogoProductos =
    Array.isArray(productos)
      ? productos
      : [];


  carrito =
    cargarCarritoGuardado(
      catalogoProductos
    );


  /*
    Evita registrar eventos dos veces
    si inicializarCarrito() vuelve
    a ejecutarse.
  */

  if (!carritoInicializado) {

    registrarEventosCarrito();

    carritoInicializado = true;

  }


  actualizarCarrito();

}


/* ==================================================
   EVENTOS GENERALES
================================================== */

function registrarEventosCarrito() {

  if (abrirCarrito) {

    abrirCarrito.addEventListener(
      "click",
      abrirPanelCarrito
    );

  }


  if (cerrarCarrito) {

    cerrarCarrito.addEventListener(
      "click",
      cerrarPanelCarrito
    );

  }


  if (carritoOverlay) {

    carritoOverlay.addEventListener(
      "click",
      cerrarPanelCarrito
    );

  }


  if (finalizarWhatsapp) {

    finalizarWhatsapp.addEventListener(
      "click",
      finalizarCompraWhatsapp
    );

  }


  if (vaciarCarritoBtn) {

    vaciarCarritoBtn.addEventListener(
      "click",
      vaciarCarrito
    );

  }


  if (carritoItems) {

    carritoItems.addEventListener(
      "click",
      manejarClickCarrito
    );

  }


  /*
    Agregar desde cards del catálogo.
  */

  const productosContenedor =
    document.querySelector(
      "#productos-container"
    );


  if (productosContenedor) {

    productosContenedor.addEventListener(
      "click",
      manejarClickProductos
    );

  }


  /*
    Cerrar con Escape.
  */



}


/* ==================================================
   AGREGAR DESDE CARDS
================================================== */

function manejarClickProductos(
  evento
) {

  const botonAgregar =
    evento.target.closest(
      ".agregar-carrito"
    );


  if (!botonAgregar) {
    return;
  }


  const productoId =
    Number(
      botonAgregar.dataset.id
    );


  agregarProductoAlCarrito(
    productoId
  );

}


/* ==================================================
   ACCIONES DENTRO DEL CARRITO
================================================== */

function manejarClickCarrito(
  evento
) {

  const control =
    evento.target.closest(
      "[data-accion-carrito]"
    );


  if (!control) {
    return;
  }


  const productoId =
    Number(
      control.dataset.id
    );


  const accion =
    control.dataset
      .accionCarrito;


  if (accion === "sumar") {

    sumarProducto(
      productoId
    );

  }


  if (accion === "restar") {

    restarProducto(
      productoId
    );

  }


  if (accion === "eliminar") {

    eliminarProducto(
      productoId
    );

  }

}


/* ==================================================
   AGREGAR PRODUCTO
================================================== */

function agregarProductoAlCarrito(
  productoId
) {

  const productoSeleccionado =
    catalogoProductos.find(
      (producto) => {

        return (
          Number(producto.id) ===
          Number(productoId)
        );

      }
    );


  if (!productoSeleccionado) {

    console.error(
      `No se encontró el producto con id ${productoId}`
    );

    return;

  }


  const productoExistente =
    carrito.find(
      (producto) => {

        return (
          Number(producto.id) ===
          Number(productoId)
        );

      }
    );


  if (productoExistente) {

    productoExistente.cantidad++;

  } else {

    carrito.push(
      crearProductoCarrito(
        productoSeleccionado,
        1
      )
    );

  }


  sincronizarCarrito();


  mostrarNotificacionCarrito(
    "Producto agregado al carrito."
  );


  abrirPanelCarrito();

}


/* ==================================================
   CREAR OBJETO DEL CARRITO
================================================== */

function crearProductoCarrito(
  producto,
  cantidad
) {

  return {

    id: producto.id,

    nombre:
      producto.nombre || "",

    slug:
      producto.slug || "",

    precio:
      Number(
        producto.precio
      ) || 0,

    imagen:
      producto.imagen || "",

    presentacion:
      producto.presentacion || "",

    categoria:
      producto.categoria || "",

    subcategoria:
      producto.subcategoria || "",

    cantidad:
      Math.max(
        1,
        Number(cantidad) || 1
      )

  };

}


/* ==================================================
   LOCAL STORAGE
================================================== */

function guardarCarrito() {

  const carritoParaGuardar =
    carrito.map(
      (producto) => {

        return {

          id:
            producto.id,

          cantidad:
            producto.cantidad

        };

      }
    );


  localStorage.setItem(

    CLAVE_CARRITO,

    JSON.stringify(
      carritoParaGuardar
    )

  );

}


/* ==================================================
   RECUPERAR CARRITO
================================================== */

function cargarCarritoGuardado(
  productos
) {

  const carritoGuardado =
    localStorage.getItem(
      CLAVE_CARRITO
    );


  if (!carritoGuardado) {
    return [];
  }


  try {

    const itemsGuardados =
      JSON.parse(
        carritoGuardado
      );


    if (
      !Array.isArray(
        itemsGuardados
      )
    ) {

      return [];

    }


    return itemsGuardados

      .map(
        (itemGuardado) => {

          const productoCatalogo =
            productos.find(
              (producto) => {

                return (
                  Number(producto.id) ===
                  Number(
                    itemGuardado.id
                  )
                );

              }
            );


          if (!productoCatalogo) {

            return null;

          }


          return crearProductoCarrito(

            productoCatalogo,

            itemGuardado.cantidad

          );

        }
      )

      .filter(Boolean);


  } catch (error) {

    console.error(
      "No se pudo recuperar el carrito:",
      error
    );


    localStorage.removeItem(
      CLAVE_CARRITO
    );


    return [];

  }

}


/* ==================================================
   SINCRONIZAR
================================================== */

function sincronizarCarrito() {

  guardarCarrito();

  actualizarCarrito();

}


/* ==================================================
   RENDER DEL CARRITO
================================================== */

function actualizarCarrito() {

  if (
    !carritoItems ||
    !contadorCarrito ||
    !carritoTotal
  ) {

    return;

  }


  if (
    carrito.length === 0
  ) {

    carritoItems.innerHTML = `

      <div class="carrito-vacio">

        <p>
          Todavía no agregaste productos.
        </p>

        <span>
          Explorá la tienda y agregá
          las opciones que quieras consultar.
        </span>

      </div>

    `;


    contadorCarrito.textContent =
      "0";


    carritoTotal.textContent =
      formatearPrecio(0);


    if (vaciarCarritoBtn) {

      vaciarCarritoBtn.disabled =
        true;

    }


    return;

  }


  carritoItems.innerHTML =
    carrito
      .map(
        crearItemCarrito
      )
      .join("");


  if (vaciarCarritoBtn) {

    vaciarCarritoBtn.disabled =
      false;

  }


  actualizarResumenCarrito();

}


/* ==================================================
   CARD DEL CARRITO
================================================== */

function crearItemCarrito(
  producto
) {

  const subtotal =
    producto.precio *
    producto.cantidad;


  const nombreBase =
    obtenerNombreBaseCarrito(
      producto.nombre
    );


  const variante =
    obtenerDetalleVarianteCarrito(
      producto
    );


  const urlProducto =
    obtenerURLProducto(
      producto.slug
    );


  return `

    <article
      class="carrito-item"
      data-id="${producto.id}"
    >


      <a
        href="${urlProducto}"
        class="carrito-item-imagen-link"
        aria-label="Ver ${producto.nombre}"
      >

        <img
          src="${producto.imagen}"
          alt=""
          class="carrito-item-imagen"
          loading="lazy"
          decoding="async"
        >

      </a>


      <div
        class="carrito-item-info"
      >

        <h3>

          <a
            href="${urlProducto}"
          >
            ${nombreBase}
          </a>

        </h3>


        ${
          variante
            ? `
                <p
                  class="carrito-item-variante"
                >
                  ${variante}
                </p>
              `
            : ""
        }


        <p
          class="carrito-item-precio"
        >
          ${formatearPrecio(
            producto.precio
          )}
        </p>


        <div
          class="carrito-controles"
        >

          <button
            type="button"
            data-accion-carrito="restar"
            data-id="${producto.id}"
            aria-label="Restar una unidad de ${producto.nombre}"
          >
            −
          </button>


          <span
            class="carrito-cantidad"
            aria-label="Cantidad ${producto.cantidad}"
          >
            ${producto.cantidad}
          </span>


          <button
            type="button"
            data-accion-carrito="sumar"
            data-id="${producto.id}"
            aria-label="Sumar una unidad de ${producto.nombre}"
          >
            +
          </button>

        </div>


        <p
          class="carrito-subtotal"
        >
          Subtotal:
          ${formatearPrecio(
            subtotal
          )}
        </p>


        <div
          class="carrito-item-acciones"
        >

          <a
            href="${urlProducto}"
            class="carrito-ver-producto"
          >
            Ver producto
          </a>


          <button
            type="button"
            class="btn-eliminar"
            data-accion-carrito="eliminar"
            data-id="${producto.id}"
          >
            Eliminar
          </button>

        </div>

      </div>

    </article>

  `;

}


/* ==================================================
   NOMBRE BASE
================================================== */

function obtenerNombreBaseCarrito(
  nombre = ""
) {

  const nombreBase =
    String(nombre)

      .replace(
        /\b\d+(?:[.,]\d+)?\s*(?:mg|ml|kg|g)\b/gi,
        ""
      )

      .replace(
        /\s*-\s*-\s*/g,
        " - "
      )

      .replace(
        /^[-–—\s]+|[-–—\s]+$/g,
        ""
      )

      .replace(
        /\s+/g,
        " "
      )

      .trim();


  return (
    nombreBase ||
    nombre
  );

}


/* ==================================================
   DETALLE DE VARIANTE
================================================== */

function obtenerDetalleVarianteCarrito(
  producto
) {

  const coincidencias =
    String(
      producto.nombre || ""
    ).match(
      /\b\d+(?:[.,]\d+)?\s*(?:mg|ml|kg|g)\b/gi
    );


  if (
    coincidencias &&
    coincidencias.length > 0
  ) {

    return coincidencias

      .map(
        (valor) => {

          return valor
            .replace(
              /\s+/g,
              " "
            )
            .trim();

        }
      )

      .join(" · ");

  }


  /*
    Si el nombre no contiene
    tamaño o concentración,
    usamos presentación.
  */

  if (producto.presentacion) {

    return producto.presentacion;

  }


  return "";

}


/* ==================================================
   RUTA A PRODUCTO
================================================== */

function obtenerURLProducto(
  slug
) {

  if (!slug) {

    return "./tienda.html";

  }


  /*
    Permite reutilizar carrito.js
    incluso si más adelante el carrito
    aparece dentro de /pages.
  */

  const dentroDePages =
    window.location.pathname
      .includes("/pages/");


  const rutaBase =
    dentroDePages
      ? "../producto.html"
      : "./producto.html";


  return (
    `${rutaBase}?slug=` +
    encodeURIComponent(slug)
  );

}


/* ==================================================
   RESUMEN
================================================== */

function actualizarResumenCarrito() {

  const cantidadTotal =
    carrito.reduce(
      (
        acumulador,
        producto
      ) => {

        return (
          acumulador +
          producto.cantidad
        );

      },
      0
    );


  const total =
    carrito.reduce(
      (
        acumulador,
        producto
      ) => {

        return (
          acumulador +
          producto.precio *
          producto.cantidad
        );

      },
      0
    );


  contadorCarrito.textContent =
    cantidadTotal;


  carritoTotal.textContent =
    formatearPrecio(
      total
    );

}


/* ==================================================
   SUMAR
================================================== */

function sumarProducto(
  productoId
) {

  const producto =
    carrito.find(
      (item) => {

        return (
          Number(item.id) ===
          Number(productoId)
        );

      }
    );


  if (!producto) {
    return;
  }


  producto.cantidad++;


  sincronizarCarrito();

}


/* ==================================================
   RESTAR
================================================== */

function restarProducto(
  productoId
) {

  const producto =
    carrito.find(
      (item) => {

        return (
          Number(item.id) ===
          Number(productoId)
        );

      }
    );


  if (!producto) {
    return;
  }


  if (
    producto.cantidad > 1
  ) {

    producto.cantidad--;

    sincronizarCarrito();

  } else {

    eliminarProducto(
      productoId
    );

  }

}


/* ==================================================
   ELIMINAR
================================================== */

function eliminarProducto(
  productoId
) {

  carrito =
    carrito.filter(
      (producto) => {

        return (
          Number(producto.id) !==
          Number(productoId)
        );

      }
    );


  sincronizarCarrito();

}


/* ==================================================
   VACIAR
================================================== */

function vaciarCarrito() {

  if (
    carrito.length === 0
  ) {

    return;

  }


  const confirmar =
    window.confirm(
      "¿Querés vaciar todo el carrito?"
    );


  if (!confirmar) {
    return;
  }


  carrito = [];


  sincronizarCarrito();


  mostrarNotificacionCarrito(
    "Carrito vaciado."
  );

}


/* ==================================================
   ABRIR
================================================== */

function abrirPanelCarrito() {

  if (!carritoPanel) {
    return;
  }


  /* Permitimos interacción con el panel */

  carritoPanel.inert = false;


  carritoPanel.setAttribute(
    "aria-hidden",
    "false"
  );


  carritoPanel.classList.add(
    "activo"
  );


  carritoOverlay?.classList.add(
    "activo"
  );


  document.body.classList.add(
    "carrito-abierto"
  );


}


/* ==================================================
   CERRAR
================================================== */

function cerrarPanelCarrito() {

  if (!carritoPanel) {
    return;
  }


  carritoPanel.classList.remove(
    "activo"
  );


  carritoOverlay?.classList.remove(
    "activo"
  );


  carritoPanel.setAttribute(
    "aria-hidden",
    "true"
  );


  carritoPanel.inert = true;


  document.body.classList.remove(
    "carrito-abierto"
  );

}


/* ==================================================
   WHATSAPP
================================================== */

function finalizarCompraWhatsapp() {

  if (
    carrito.length === 0
  ) {

    mostrarNotificacionCarrito(
      "Tu carrito está vacío."
    );

    return;

  }


  let mensaje =
    "Hola, quisiera realizar el siguiente pedido en Medicina Ancestral:\n\n";


  carrito.forEach(
    (producto) => {

      const subtotal =
        producto.precio *
        producto.cantidad;


      const nombreBase =
        obtenerNombreBaseCarrito(
          producto.nombre
        );


      const variante =
        obtenerDetalleVarianteCarrito(
          producto
        );


      mensaje +=
        `• ${nombreBase}\n`;


      if (variante) {

        mensaje +=
          `  ${variante}\n`;

      }


      mensaje +=
        `  Cantidad: ${producto.cantidad}\n`;


      mensaje +=
        `  Precio unitario: ${formatearPrecio(
          producto.precio
        )}\n`;


      mensaje +=
        `  Subtotal: ${formatearPrecio(
          subtotal
        )}\n\n`;

    }
  );


  const total =
    carrito.reduce(
      (
        acumulador,
        producto
      ) => {

        return (
          acumulador +
          producto.precio *
          producto.cantidad
        );

      },
      0
    );


  mensaje +=
    `Total del pedido: ${formatearPrecio(
      total
    )}\n\n`;


  mensaje +=
    "Quisiera coordinar disponibilidad y entrega, y recibir orientación sobre los productos seleccionados.";


  const url =
    `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(
      mensaje
    )}`;


  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}


/* ==================================================
   NOTIFICACIÓN
================================================== */

function mostrarNotificacionCarrito(
  mensaje
) {

  if (!notificacion) {
    return;
  }


  notificacion.textContent =
    mensaje;


  notificacion.classList.add(
    "activa"
  );


  clearTimeout(
    temporizadorNotificacion
  );


  temporizadorNotificacion =
    setTimeout(
      () => {

        notificacion.classList.remove(
          "activa"
        );

      },
      2500
    );

}