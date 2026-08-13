async function iniciarAplicacion() {
  const productos = await obtenerProductos();

  const productosVisibles = productos
    .filter((producto) => producto.visible)
    .sort((a, b) => a.orden - b.orden);

  const productosDestacados =
    productosVisibles.filter((producto) => {
      return producto.destacado;
    });

  renderizarProductos(productosDestacados);

  inicializarEventosProductos();
  inicializarCarrito(productosVisibles);
}

iniciarAplicacion();