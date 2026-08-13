async function iniciarPaginaProducto() {
  try {
    const productos = await obtenerProductos();

    const productosVisibles = productos.filter(
      (producto) => producto.visible
    );

    inicializarCarrito(productosVisibles);

    const parametros = new URLSearchParams(
      window.location.search
    );

    const slugProducto = parametros.get("slug");

    if (!slugProducto) {
      mostrarProductoNoEncontrado();
      return;
    }

    const productoSeleccionado =
      productosVisibles.find((producto) => {
        return producto.slug === slugProducto;
      });

    if (!productoSeleccionado) {
      mostrarProductoNoEncontrado();
      return;
    }

    renderizarDetalleProducto(
      productoSeleccionado
    );

    inicializarEventoDetalleProducto();

    actualizarInformacionPagina(
      productoSeleccionado
    );

  } catch (error) {
    console.error(
      "No se pudo cargar el producto:",
      error
    );

    mostrarProductoNoEncontrado();
  }
}

function renderizarDetalleProducto(producto) {
  const contenedor = document.querySelector(
    "#producto-detalle"
  );

  if (!contenedor) {
    return;
  }

  const precioAnterior = producto.precioAnterior
    ? `
      <span class="producto-detalle-precio-anterior">
        ${formatearPrecio(producto.precioAnterior)}
      </span>
    `
    : "";

  const etiquetaOferta = producto.oferta
    ? `
      <span class="producto-detalle-etiqueta">
        Oferta
      </span>
    `
    : "";

  const etiquetaNuevo = producto.nuevo
    ? `
      <span class="producto-detalle-etiqueta nuevo">
        Nuevo
      </span>
    `
    : "";

  contenedor.innerHTML = `
    <div class="producto-detalle-grid">

      <div class="producto-detalle-imagen">
        ${etiquetaOferta}
        ${etiquetaNuevo}

        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
        >
      </div>

      <div class="producto-detalle-contenido">

        <p class="producto-detalle-categoria">
          ${obtenerNombreCategoria(
            producto.categoria
          )}

          <span aria-hidden="true">
            ·
          </span>

          ${obtenerNombreSubcategoria(
            producto.subcategoria
          )}
        </p>

        <h1>${producto.nombre}</h1>

        <p class="producto-detalle-descripcion">
          ${producto.descripcionCorta}
        </p>

        <div class="producto-detalle-precios">
          ${precioAnterior}

          <span class="producto-detalle-precio">
            ${formatearPrecio(producto.precio)}
          </span>
        </div>

        <div class="producto-detalle-informacion">
          <h2>Información del producto</h2>

          <p>
            ${producto.descripcionLarga}
          </p>
        </div>

        <div class="producto-detalle-recomendacion">
          <h2>Uso responsable</h2>

          <p>
            Recomendamos asesoramiento personalizado.
            En casos de medicación, embarazo, lactancia,
            patologías previas, niños o mascotas,
            sugerimos consultar con un profesional.
          </p>
        </div>

        <div class="producto-detalle-acciones">
          <button
            type="button"
            class="agregar-carrito producto-detalle-agregar"
            data-id="${producto.id}"
          >
            🛒 Agregar al carrito
          </button>

          <a
            href="./tienda.html"
            class="producto-volver"
          >
            Volver a la tienda
          </a>
        </div>

      </div>

    </div>
  `;
}

function inicializarEventoDetalleProducto() {
  const contenedor = document.querySelector(
    "#producto-detalle"
  );

  if (!contenedor) {
    return;
  }

  contenedor.addEventListener(
    "click",
    manejarClickProductos
  );
}

function actualizarInformacionPagina(producto) {
  document.title =
    `${producto.nombre} | Medicina Ancestral`;

  const migaProducto = document.querySelector(
    "#miga-producto"
  );

  if (migaProducto) {
    migaProducto.textContent =
      producto.nombre;
  }
}

function mostrarProductoNoEncontrado() {
  const contenedor = document.querySelector(
    "#producto-detalle"
  );

  if (!contenedor) {
    return;
  }

  contenedor.innerHTML = `
    <div class="producto-no-encontrado">
      <h1>Producto no encontrado</h1>

      <p>
        El producto que buscás no está disponible
        o la dirección es incorrecta.
      </p>

      <a href="./tienda.html">
        Volver a la tienda
      </a>
    </div>
  `;

  document.title =
    "Producto no encontrado | Medicina Ancestral";
}

iniciarPaginaProducto();