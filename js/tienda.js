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

iniciarTienda();