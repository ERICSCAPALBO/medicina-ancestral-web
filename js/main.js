async function iniciarAplicacion() {

  try {

    const productos =
      await obtenerProductos();


    const productosVisibles =
      productos
        .filter(
          (producto) =>
            producto.visible
        )
        .sort(
          (a, b) =>
            a.orden - b.orden
        );


    const productosDestacados =
      productosVisibles.filter(
        (producto) =>
          producto.destacado
      );


    renderizarProductos(
      productosDestacados
    );


    inicializarEventosProductos();


    inicializarCarrito(
      productosVisibles
    );


    /*
      Lo dejamos porque ya forma parte
      de tu estructura actual.
    */

    if (
      typeof inicializarBuscadorYFiltros ===
      "function"
    ) {

      inicializarBuscadorYFiltros(
        productosDestacados
      );

    }


  } catch (error) {

    console.error(
      "No se pudo iniciar la página principal:",
      error
    );


    mostrarErrorProductosInicio();

  }

}


/* ==================================================
   ERROR DE PRODUCTOS EN INICIO
================================================== */

function mostrarErrorProductosInicio() {

  const contenedor =
    document.querySelector(
      "#productos-container"
    );


  if (!contenedor) {
    return;
  }


  contenedor.innerHTML = `

    <div class="sin-resultados">

      <p>
        No pudimos cargar los productos destacados.
      </p>

      <p>
        Podés intentar nuevamente en unos minutos
        o visitar nuestro catálogo.
      </p>

    </div>

  `;

}


/* ==================================================
   INICIAR
================================================== */

iniciarAplicacion();