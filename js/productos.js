function crearCardProducto(producto) {
  const precioActual = formatearPrecio(producto.precio);

  const precioAnterior = producto.precioAnterior
    ? `<span class="precio-anterior">
         ${formatearPrecio(producto.precioAnterior)}
       </span>`
    : "";

  const etiquetaOferta = producto.oferta
    ? `<span class="producto-etiqueta">Oferta</span>`
    : "";

  return `
    <article
      class="card"
      data-id="${producto.id}"
      role="listitem"
      aria-labelledby="producto-titulo-${producto.id}"
    >
      <div class="card-imagen-container">
        ${etiquetaOferta}

      <img
        src="${producto.imagen}"
        alt=""
        loading="lazy"
        decoding="async"
      >
      </div>

      <h3
        id="producto-titulo-${producto.id}"
      >
        ${producto.nombre}
      </h3>

      <p class="descripcion">
        <span class="texto-corto">
          ${producto.descripcionCorta}
        </span>

        <span class="texto-largo">
          ${producto.descripcionLarga}
        </span>

        <button
          type="button"
          class="leer-mas"
          aria-expanded="false"
          aria-label="Leer más sobre ${producto.nombre}"
        >
          Leer más
        </button>
      </p>

      <div class="card-precios">
        ${precioAnterior}
        <p class="precio">${precioActual}</p>
      </div>

      <div class="card-acciones">
        <a
          href="./producto.html?slug=${producto.slug}"
          class="ver-detalle"
          aria-label="Ver información de ${producto.nombre}"
        >
          Ver detalle
        </a>

        <button
          type="button"
          class="agregar-carrito"
          data-id="${producto.id}"
        >
          🛒 Agregar al carrito
        </button>
      </div>
    </article>
  `;
}

function renderizarProductos(
  productos,
  selector = "#productos-container"
) {
  const contenedor = document.querySelector(selector);

  if (!contenedor) {
    console.warn(`No se encontró el contenedor ${selector}`);
    return;
  }

  if (productos.length === 0) {
    contenedor.innerHTML = `
      <div class="sin-resultados">
        <p>
          No encontramos productos que coincidan con tu búsqueda.
        </p>

        <p>
          También podés consultarnos para recibir orientación personalizada.
        </p>
      </div>
    `;

    return;
  }

  contenedor.innerHTML = productos
    .map((producto) => crearCardProducto(producto))
    .join("");
}

function inicializarEventosProductos() {
  const contenedor = document.querySelector(
    "#productos-container"
  );

  if (!contenedor) {
    return;
  }

  contenedor.addEventListener("click", (evento) => {
    const botonLeerMas = evento.target.closest(".leer-mas");

    if (botonLeerMas) {
      alternarDescripcion(botonLeerMas);
    }
  });
}

function alternarDescripcion(boton) {
  const descripcion = boton.closest(".descripcion");
  const card = boton.closest(".card");


  const tituloProducto = card?.querySelector("h3")?.textContent.trim() || "este producto";
  const textoLargo = descripcion.querySelector(".texto-largo");

  const estaAbierto = textoLargo.classList.contains("activo");

  textoLargo.classList.toggle("activo");

  boton.textContent = estaAbierto
    ? "Leer más"
    : "Leer menos";

  boton.setAttribute(
    "aria-expanded",
    String(!estaAbierto)
  );
}