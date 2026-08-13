const PRODUCTOS_POR_CARGA = 12;

let limiteProductosVisibles =
  PRODUCTOS_POR_CARGA;

let botonCargarMas = null;
let textoPaginacion = null;

let funcionActualizarCatalogo = null;

function inicializarPaginacion(
  funcionActualizar
) {
  botonCargarMas = document.querySelector(
    "#cargar-mas-productos"
  );

  textoPaginacion = document.querySelector(
    "#paginacion-texto"
  );

  if (!botonCargarMas || !textoPaginacion) {
    console.warn(
      "No se encontraron los controles de paginación."
    );

    return;
  }

  funcionActualizarCatalogo =
    funcionActualizar;

  botonCargarMas.addEventListener(
    "click",
    manejarCargarMas
  );
}

function manejarCargarMas() {
  limiteProductosVisibles +=
    PRODUCTOS_POR_CARGA;

  if (
    typeof funcionActualizarCatalogo ===
    "function"
  ) {
    funcionActualizarCatalogo();
  }
}

function reiniciarPaginacion() {
  limiteProductosVisibles =
    PRODUCTOS_POR_CARGA;
}

function obtenerProductosPaginados(
  productos
) {
  return productos.slice(
    0,
    limiteProductosVisibles
  );
}

function actualizarControlesPaginacion(
  cantidadTotal,
  cantidadMostrada
) {
  if (!botonCargarMas || !textoPaginacion) {
    return;
  }

  if (cantidadTotal === 0) {
    textoPaginacion.textContent = "";
    botonCargarMas.hidden = true;

    return;
  }

  textoPaginacion.textContent =
    `Mostrando ${cantidadMostrada} de ` +
    `${cantidadTotal} productos.`;

  const seMostraronTodos =
    cantidadMostrada >= cantidadTotal;

  botonCargarMas.hidden =
    seMostraronTodos;

  botonCargarMas.disabled =
    seMostraronTodos;
}