
function normalizarTexto(texto = "") {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ==================================================
   OBTENER CATEGORÍAS
================================================== */

function obtenerCategoriasConCantidad(productos) {
  const categorias = new Map();

  productos.forEach((producto) => {
    if (!producto.categoria) {
      return;
    }

    const cantidadActual =
      categorias.get(producto.categoria) || 0;

    categorias.set(
      producto.categoria,
      cantidadActual + 1
    );
  });

  return [...categorias.entries()]
    .map(([slug, cantidad]) => {
      return {
        slug,
        nombre: obtenerNombreCategoria(slug),
        cantidad
      };
    })
    .sort((categoriaA, categoriaB) => {
      return categoriaA.nombre.localeCompare(
        categoriaB.nombre,
        "es"
      );
    });
}

function renderizarFiltrosCategorias(
  productos,
  contenedor
) {
  const categorias =
    obtenerCategoriasConCantidad(productos);

  const botonTodos = `
    <button
      type="button"
      class="filtro-btn activo"
      data-categoria="todos"
      aria-pressed="true"
    >
      <span>Todos</span>

      <span class="filtro-cantidad">
        ${productos.length}
      </span>
    </button>
  `;

  const botonesCategorias = categorias
    .map((categoria) => {
      return `
        <button
          type="button"
          class="filtro-btn"
          data-categoria="${categoria.slug}"
          aria-pressed="false"
        >
          <span>${categoria.nombre}</span>

          <span class="filtro-cantidad">
            ${categoria.cantidad}
          </span>
        </button>
      `;
    })
    .join("");

  contenedor.innerHTML =
    botonTodos + botonesCategorias;
}

/* ==================================================
   OBTENER SUBCATEGORÍAS
================================================== */

function obtenerSubcategoriasConCantidad(
  productos,
  categoriaSeleccionada
) {
  const subcategorias = new Map();

  productos
    .filter((producto) => {
      return (
        producto.categoria === categoriaSeleccionada
      );
    })
    .forEach((producto) => {
      if (!producto.subcategoria) {
        return;
      }

      const cantidadActual =
        subcategorias.get(producto.subcategoria) || 0;

      subcategorias.set(
        producto.subcategoria,
        cantidadActual + 1
      );
    });

  return [...subcategorias.entries()]
    .map(([slug, cantidad]) => {
      return {
        slug,
        nombre: obtenerNombreSubcategoria(slug),
        cantidad
      };
    })
    .sort((subcategoriaA, subcategoriaB) => {
      return subcategoriaA.nombre.localeCompare(
        subcategoriaB.nombre,
        "es"
      );
    });
}

function renderizarFiltrosSubcategorias(
  productos,
  categoriaSeleccionada,
  panel,
  contenedor
) {
  if (categoriaSeleccionada === "todos") {
    panel.hidden = true;
    contenedor.innerHTML = "";
    return;
  }

  const subcategorias =
    obtenerSubcategoriasConCantidad(
      productos,
      categoriaSeleccionada
    );

  if (subcategorias.length === 0) {
    panel.hidden = true;
    contenedor.innerHTML = "";
    return;
  }

  const cantidadCategoria = productos.filter(
    (producto) => {
      return (
        producto.categoria === categoriaSeleccionada
      );
    }
  ).length;

  const botonTodas = `
    <button
      type="button"
      class="subfiltro-btn activo"
      data-subcategoria="todas"
      aria-pressed="true"
    >
      <span>Todas</span>

      <span class="filtro-cantidad">
        ${cantidadCategoria}
      </span>
    </button>
  `;

  const botonesSubcategorias = subcategorias
    .map((subcategoria) => {
      return `
        <button
          type="button"
          class="subfiltro-btn"
          data-subcategoria="${subcategoria.slug}"
          aria-pressed="false"
        >
          <span>${subcategoria.nombre}</span>

          <span class="filtro-cantidad">
            ${subcategoria.cantidad}
          </span>
        </button>
      `;
    })
    .join("");

  contenedor.innerHTML =
    botonTodas + botonesSubcategorias;

  panel.hidden = false;
}

/* ==================================================
   ORDENAMIENTO
================================================== */

function ordenarProductos(productos, criterio) {
  const productosOrdenados = [...productos];

  switch (criterio) {
    case "menor-precio":
      productosOrdenados.sort(
        (productoA, productoB) => {
          return productoA.precio - productoB.precio;
        }
      );
      break;

    case "mayor-precio":
      productosOrdenados.sort(
        (productoA, productoB) => {
          return productoB.precio - productoA.precio;
        }
      );
      break;

    case "novedades":
      productosOrdenados.sort(
        (productoA, productoB) => {
          const diferenciaNovedad =
            Number(productoB.nuevo) -
            Number(productoA.nuevo);

          if (diferenciaNovedad !== 0) {
            return diferenciaNovedad;
          }

          return productoA.orden - productoB.orden;
        }
      );
      break;

    case "ofertas":
      productosOrdenados.sort(
        (productoA, productoB) => {
          const diferenciaOferta =
            Number(productoB.oferta) -
            Number(productoA.oferta);

          if (diferenciaOferta !== 0) {
            return diferenciaOferta;
          }

          return productoA.orden - productoB.orden;
        }
      );
      break;

    case "recomendados":
    default:
      productosOrdenados.sort(
        (productoA, productoB) => {
          return productoA.orden - productoB.orden;
        }
      );
  }

  return productosOrdenados;
}

/* ==================================================
   BOTONES ACTIVOS
================================================== */

function actualizarBotonActivo(
  contenedor,
  botonSeleccionado,
  selectorBotones
) {
  contenedor
    .querySelectorAll(selectorBotones)
    .forEach((boton) => {
      boton.classList.remove("activo");

      boton.setAttribute(
        "aria-pressed",
        "false"
      );
    });

  botonSeleccionado.classList.add("activo");

  botonSeleccionado.setAttribute(
    "aria-pressed",
    "true"
  );
}

/* ==================================================
   INICIALIZACIÓN
================================================== */

function inicializarBuscadorYFiltros(productos) {
  const buscador = document.querySelector(
    "#buscador"
  );

  const ordenarSelector = document.querySelector(
    "#ordenar-productos"
  );

  const filtrosContenedor = document.querySelector(
    "#filtros-categorias"
  );

  const subcategoriasPanel = document.querySelector(
    "#subcategorias-panel"
  );

  const subcategoriasContenedor =
    document.querySelector(
      "#filtros-subcategorias"
    );

  const resultadosTexto = document.querySelector(
    "#resultados-texto"
  );

  if (
    !buscador ||
    !ordenarSelector ||
    !filtrosContenedor ||
    !subcategoriasPanel ||
    !subcategoriasContenedor
  ) {
    console.warn(
      "No se encontraron todas las herramientas del catálogo."
    );

    return;
  }

  /* ================================================
     LEER FILTROS DESDE LA URL
  ================================================ */

  const parametrosURL =
    new URLSearchParams(
      window.location.search
    );

  const busquedaURL =
    parametrosURL.get("buscar") || "";

  const categoriaURL =
    parametrosURL.get("categoria") || "todos";

  const subcategoriaURL =
    parametrosURL.get("subcategoria") || "todas";

  let textoBuscado =
    normalizarTexto(busquedaURL);

  let categoriaSeleccionada =
    categoriaURL;

  let subcategoriaSeleccionada =
    subcategoriaURL;

  let criterioOrden =
    "recomendados";

  /* ================================================
     MOSTRAR BÚSQUEDA DE LA URL EN EL INPUT
  ================================================ */

  buscador.value = busquedaURL;

  /* ================================================
     RENDERIZAR CATEGORÍAS
  ================================================ */

  renderizarFiltrosCategorias(
    productos,
    filtrosContenedor
  );

  /* ================================================
     ACTIVAR CATEGORÍA RECIBIDA POR URL
  ================================================ */

  if (
    categoriaSeleccionada !== "todos"
  ) {
    const botonCategoria =
      filtrosContenedor.querySelector(
        `[data-categoria="${categoriaSeleccionada}"]`
      );

    if (botonCategoria) {
      actualizarBotonActivo(
        filtrosContenedor,
        botonCategoria,
        ".filtro-btn"
      );

      renderizarFiltrosSubcategorias(
        productos,
        categoriaSeleccionada,
        subcategoriasPanel,
        subcategoriasContenedor
      );
    } else {
      categoriaSeleccionada = "todos";
      subcategoriaSeleccionada = "todas";
    }
  }

  /* ================================================
     ACTIVAR SUBCATEGORÍA RECIBIDA POR URL
  ================================================ */

  if (
    categoriaSeleccionada !== "todos" &&
    subcategoriaSeleccionada !== "todas"
  ) {
    const botonSubcategoria =
      subcategoriasContenedor.querySelector(
        `[data-subcategoria="${subcategoriaSeleccionada}"]`
      );

    if (botonSubcategoria) {
      actualizarBotonActivo(
        subcategoriasContenedor,
        botonSubcategoria,
        ".subfiltro-btn"
      );
    } else {
      subcategoriaSeleccionada = "todas";
    }
  }

  /* ================================================
     PAGINACIÓN
  ================================================ */

  inicializarPaginacion(() => {
    aplicarFiltros(false);
  });

  /* ================================================
     ACTUALIZAR URL
  ================================================ */

  function actualizarURLFiltros() {
    const parametros =
      new URLSearchParams();

    if (textoBuscado) {
      parametros.set(
        "buscar",
        buscador.value.trim()
      );
    }

    if (
      categoriaSeleccionada !== "todos"
    ) {
      parametros.set(
        "categoria",
        categoriaSeleccionada
      );
    }

    if (
      subcategoriaSeleccionada !== "todas"
    ) {
      parametros.set(
        "subcategoria",
        subcategoriaSeleccionada
      );
    }

    const nuevaURL =
      parametros.toString()
        ? `${window.location.pathname}?${parametros.toString()}`
        : window.location.pathname;

    window.history.replaceState(
      {},
      "",
      nuevaURL
    );
  }

  /* ================================================
     APLICAR FILTROS
  ================================================ */

  function aplicarFiltros(
    debeReiniciarPaginacion = false
  ) {
    if (debeReiniciarPaginacion) {
      reiniciarPaginacion();
    }

    const productosFiltrados =
      productos.filter((producto) => {

        const coincideCategoria =
          categoriaSeleccionada === "todos" ||
          producto.categoria ===
            categoriaSeleccionada;

        const coincideSubcategoria =
          subcategoriaSeleccionada === "todas" ||
          producto.subcategoria ===
            subcategoriaSeleccionada;

        const etiquetas = Array.isArray(
          producto.etiquetas
        )
          ? producto.etiquetas.join(" ")
          : "";

        const contenidoBuscable =
          normalizarTexto(`
            ${producto.nombre || ""}
            ${producto.categoria || ""}
            ${obtenerNombreCategoria(
              producto.categoria
            ) || ""}
            ${producto.subcategoria || ""}
            ${obtenerNombreSubcategoria(
              producto.subcategoria
            ) || ""}
            ${producto.descripcionCorta || ""}
            ${producto.descripcionLarga || ""}
            ${etiquetas}
          `);

        const terminosBusqueda =
          textoBuscado
            .split(/\s+/)
            .filter(Boolean);

        const coincideBusqueda =
          terminosBusqueda.length === 0 ||
          terminosBusqueda.every(
            (termino) => {
              return contenidoBuscable.includes(
                termino
              );
            }
          );

        return (
          coincideCategoria &&
          coincideSubcategoria &&
          coincideBusqueda
        );
      });

    const productosOrdenados =
      ordenarProductos(
        productosFiltrados,
        criterioOrden
      );

    const productosParaMostrar =
      obtenerProductosPaginados(
        productosOrdenados
      );

    renderizarProductos(
      productosParaMostrar
    );

    actualizarTextoResultados(
      productosOrdenados.length,
      resultadosTexto
    );

    actualizarControlesPaginacion(
      productosOrdenados.length,
      productosParaMostrar.length
    );
  }

  /* ================================================
     BUSCADOR
  ================================================ */

  buscador.addEventListener(
    "input",
    (evento) => {
      textoBuscado =
        normalizarTexto(
          evento.target.value.trim()
        );

      actualizarURLFiltros();

      aplicarFiltros(true);
    }
  );

  /* ================================================
     ORDENAMIENTO
  ================================================ */

  ordenarSelector.addEventListener(
    "change",
    (evento) => {
      criterioOrden =
        evento.target.value;

      aplicarFiltros(true);
    }
  );

  /* ================================================
     CATEGORÍAS
  ================================================ */

  filtrosContenedor.addEventListener(
    "click",
    (evento) => {
      const botonSeleccionado =
        evento.target.closest(
          ".filtro-btn"
        );

      if (!botonSeleccionado) {
        return;
      }

      categoriaSeleccionada =
        botonSeleccionado.dataset.categoria;

      subcategoriaSeleccionada =
        "todas";

      actualizarBotonActivo(
        filtrosContenedor,
        botonSeleccionado,
        ".filtro-btn"
      );

      renderizarFiltrosSubcategorias(
        productos,
        categoriaSeleccionada,
        subcategoriasPanel,
        subcategoriasContenedor
      );

      actualizarURLFiltros();

      aplicarFiltros(true);
    }
  );

  /* ================================================
     SUBCATEGORÍAS
  ================================================ */

  subcategoriasContenedor.addEventListener(
    "click",
    (evento) => {
      const botonSeleccionado =
        evento.target.closest(
          ".subfiltro-btn"
        );

      if (!botonSeleccionado) {
        return;
      }

      subcategoriaSeleccionada =
        botonSeleccionado.dataset
          .subcategoria;

      actualizarBotonActivo(
        subcategoriasContenedor,
        botonSeleccionado,
        ".subfiltro-btn"
      );

      actualizarURLFiltros();

      aplicarFiltros(true);
    }
  );

  /* ================================================
     PRIMER RENDER
  ================================================ */

  aplicarFiltros(true);
}

/* ==================================================
   TEXTO DE RESULTADOS
================================================== */

function actualizarTextoResultados(
  cantidad,
  elemento
) {
  if (!elemento) {
    return;
  }

  if (cantidad === 0) {
    elemento.textContent =
      "No encontramos productos con esos criterios.";

    return;
  }

  if (cantidad === 1) {
    elemento.textContent =
      "Se encontró 1 producto.";

    return;
  }

  elemento.textContent =
    `Se encontraron ${cantidad} productos.`;
}