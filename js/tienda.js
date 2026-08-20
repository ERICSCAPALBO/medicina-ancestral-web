async function iniciarTienda() {
  try {
    inicializarPanelFiltros();

    const productos = await obtenerProductos();
    revisarOrganizacionCatalogo(productos);

    const productosVisibles = productos
      .filter((producto) => producto.visible)
      .sort((a, b) => a.orden - b.orden);

    inicializarEventosProductos();
    inicializarCarrito(productosVisibles);
    inicializarBuscadorYFiltros(
      productosVisibles
    );

  } catch (error) {
    console.error(
      "No se pudo iniciar la tienda:",
      error
    );

    mostrarErrorTienda();
  }
}


/* ==================================================
   ERROR AL CARGAR LA TIENDA
================================================== */

function mostrarErrorTienda() {

  const contenedor =
    document.querySelector(
      "#productos-container"
    );


  const resultados =
    document.querySelector(
      "#resultados-texto"
    );


  const paginacion =
    document.querySelector(
      ".paginacion-catalogo"
    );


  if (resultados) {

    resultados.textContent = "";

  }


  if (paginacion) {

    paginacion.hidden = true;

  }


  if (contenedor) {

    contenedor.innerHTML = `

      <div class="sin-resultados">

        <p>
          No pudimos cargar el catálogo.
        </p>

        <p>
          Intentá nuevamente en unos minutos
          o consultanos por WhatsApp.
        </p>

      </div>

    `;

  }

}


iniciarTienda();