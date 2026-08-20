document.addEventListener(
  "DOMContentLoaded",
  iniciarPaginaProducto
);


async function iniciarPaginaProducto() {

  const contenedor =
    document.querySelector(
      "#producto-detalle"
    );


  if (!contenedor) {
    return;
  }


  const parametros =
    new URLSearchParams(
      window.location.search
    );


  const slug =
    parametros.get("slug");


  if (!slug) {

    mostrarProductoNoEncontrado(
      contenedor
    );

    return;
  }


  try {

    const productos =
      await obtenerProductos();


    const productosVisibles =
      productos.filter(
        (producto) => {
          return producto.visible;
        }
      );


    /* ==============================================
       INICIALIZAR CARRITO
    ============================================== */

    if (
      typeof inicializarCarrito ===
      "function"
    ) {

      inicializarCarrito(
        productosVisibles
      );

    }


    /* ==============================================
       BUSCAR PRODUCTO
    ============================================== */

    const producto =
      productosVisibles.find(
        (producto) => {
          return producto.slug === slug;
        }
      );


    if (!producto) {

      mostrarProductoNoEncontrado(
        contenedor
      );

      return;

    }


    actualizarSEOProducto(
      producto
    );


    actualizarMigaProducto(
      producto
    );

    renderizarProducto(
      producto,
      contenedor,
      productosVisibles
    );


    inicializarEventosProducto(
      producto,
      contenedor,
      productosVisibles
    );


  } catch (error) {

    console.error(
      "Error al cargar producto:",
      error
    );


    mostrarErrorProducto(
      contenedor
    );

  }

}

function buscarVarianteExacta(
  variantes,
  concentracion,
  presentacion
) {

  return variantes.find(
    (producto) => {

      const concentracionProducto =
        obtenerConcentracionProducto(
          producto
        );


      const presentacionProducto =
        obtenerPresentacionVariante(
          producto
        );


      const coincideConcentracion =
        !concentracion ||
        normalizarVariante(
          concentracionProducto
        ) ===
        normalizarVariante(
          concentracion
        );


      const coincidePresentacion =
        !presentacion ||
        normalizarVariante(
          presentacionProducto
        ) ===
        normalizarVariante(
          presentacion
        );


      return (
        coincideConcentracion &&
        coincidePresentacion
      );

    }
  );

}

function existePresentacionParaConcentracion(
  variantes,
  concentracion,
  presentacion
) {

  return variantes.some(
    (producto) => {

      const concentracionProducto =
        obtenerConcentracionProducto(
          producto
        );


      const presentacionProducto =
        obtenerPresentacionVariante(
          producto
        );


      return (
        normalizarVariante(
          concentracionProducto
        ) ===
          normalizarVariante(
            concentracion
          ) &&

        normalizarVariante(
          presentacionProducto
        ) ===
          normalizarVariante(
            presentacion
          )
      );

    }
  );

}


/* ==================================================
   VARIANTES DEL PRODUCTO
================================================== */

function obtenerNombreBaseVariante(nombre = "") {

  return String(nombre)

    /* Concentraciones: 250 mg, 1000mg, etc. */
    .replace(
      /\b\d+(?:[.,]\d+)?\s*mg\b/gi,
      ""
    )

    /* Volúmenes: 10 ml, 30ml, etc. */
    .replace(
      /\b\d+(?:[.,]\d+)?\s*ml\b/gi,
      ""
    )

    /* Pesos: 5 g, 40g, 250 g, etc. */
    .replace(
      /\b\d+(?:[.,]\d+)?\s*g\b/gi,
      ""
    )

    /* Kg */
    .replace(
      /\b\d+(?:[.,]\d+)?\s*kg\b/gi,
      ""
    )

    /* Separadores sobrantes */
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

    .trim()
    .toLowerCase();
}


function obtenerConcentracionProducto(
  producto
) {

  const texto =
    `${producto.nombre || ""} ${producto.presentacion || ""}`;


  const coincidencia =
    texto.match(
      /\b\d+(?:[.,]\d+)?\s*mg\b/i
    );


  return coincidencia
    ? coincidencia[0]
        .replace(/\s+/g, " ")
        .trim()
    : null;
}


function obtenerPresentacionVariante(
  producto
) {

  const texto =
    `${producto.nombre || ""} ${producto.presentacion || ""}`;


  /*
    Buscamos primero ml.
  */

  let coincidencia =
    texto.match(
      /\b\d+(?:[.,]\d+)?\s*ml\b/i
    );


  if (coincidencia) {

    return coincidencia[0]
      .replace(/\s+/g, " ")
      .trim();

  }


  /*
    Después gramos.
  */

  coincidencia =
    texto.match(
      /\b\d+(?:[.,]\d+)?\s*g\b/i
    );


  if (coincidencia) {

    return coincidencia[0]
      .replace(/\s+/g, " ")
      .trim();

  }


  /*
    Finalmente kg.
  */

  coincidencia =
    texto.match(
      /\b\d+(?:[.,]\d+)?\s*kg\b/i
    );


  return coincidencia
    ? coincidencia[0]
        .replace(/\s+/g, " ")
        .trim()
    : null;
}

function obtenerVariantesProducto(
  productoActual,
  productos
) {

  const nombreBaseActual =
    obtenerNombreBaseVariante(
      productoActual.nombre
    );


  return productos.filter(
    (producto) => {

      if (
        producto.visible === false
      ) {
        return false;
      }


      if (
        producto.categoria !==
        productoActual.categoria
      ) {
        return false;
      }


      if (
        producto.subcategoria !==
        productoActual.subcategoria
      ) {
        return false;
      }


      const nombreBase =
        obtenerNombreBaseVariante(
          producto.nombre
        );


      return (
        nombreBase ===
        nombreBaseActual
      );

    }
  );

}

function crearSelectorVariantesHTML(
  productoActual,
  productos
) {

  const variantes =
    obtenerVariantesProducto(
      productoActual,
      productos
    );


  /*
    Si solamente existe una presentación,
    no mostramos ningún selector.
  */

  if (
    variantes.length <= 1
  ) {
    return "";
  }


  const concentracionActual =
    obtenerConcentracionProducto(
      productoActual
    );


  const presentacionActual =
    obtenerPresentacionVariante(
      productoActual
    );


  /* ==============================================
     CONCENTRACIONES DISPONIBLES
  ============================================== */

  const concentraciones = [
    ...new Set(
      variantes
        .map(
          obtenerConcentracionProducto
        )
        .filter(Boolean)
    )
  ];


  /* ==============================================
     PRESENTACIONES DISPONIBLES
  ============================================== */

  const presentaciones = [
    ...new Set(
      variantes
        .map(
          obtenerPresentacionVariante
        )
        .filter(Boolean)
    )
  ];


  const concentracionesHTML =
    concentraciones.length > 1
      ? `
          <div class="producto-variante-grupo">

            <p class="producto-variante-titulo">
              Concentración
            </p>

            <div
              class="producto-variante-opciones"
              role="group"
              aria-label="Elegir concentración"
            >

              ${concentraciones
                .map((concentracion) => {

                  const activa =
                    normalizarVariante(
                      concentracion
                    ) ===
                    normalizarVariante(
                      concentracionActual
                    );


                  return `
                    <button
                      type="button"
                      class="producto-variante-btn ${
                        activa
                          ? "activo"
                          : ""
                      }"
                      data-tipo-variante="concentracion"
                      data-valor-variante="${concentracion}"
                      aria-pressed="${
                        activa
                          ? "true"
                          : "false"
                      }"
                    >
                      ${concentracion}
                    </button>
                  `;

                })
                .join("")}

            </div>

          </div>
        `
      : "";


const presentacionesHTML =
  presentaciones.length > 1
    ? `
        <div class="producto-variante-grupo">

          <p class="producto-variante-titulo">
            Presentación
          </p>

          <div
            class="producto-variante-opciones"
            role="group"
            aria-label="Elegir presentación"
          >

            ${presentaciones
              .map((presentacion) => {

                const activa =
                  normalizarVariante(
                    presentacion
                  ) ===
                  normalizarVariante(
                    presentacionActual
                  );


                /*
                  Si existe concentración,
                  verificamos que esta presentación
                  exista para esa concentración.
                */

                const disponible =
                  !concentracionActual ||
                  existePresentacionParaConcentracion(
                    variantes,
                    concentracionActual,
                    presentacion
                  );


                const claseNoDisponible =
                  disponible
                    ? ""
                    : "no-disponible";


                return `
                  <button
                    type="button"

                    class="
                      producto-variante-btn
                      ${
                        activa
                          ? "activo"
                          : ""
                      }
                      ${claseNoDisponible}
                    "

                    data-tipo-variante="presentacion"

                    data-valor-variante="${presentacion}"

                    aria-pressed="${
                      activa
                        ? "true"
                        : "false"
                    }"

                    ${
                      disponible
                        ? ""
                        : "disabled"
                    }

                    aria-label="${
                      disponible
                        ? presentacion
                        : `${presentacion}, no disponible para ${concentracionActual}`
                    }"
                  >
                    ${presentacion}
                  </button>
                `;

              })
              .join("")}

          </div>

        </div>
      `
    : "";


  /*
    Puede existir solamente tamaño,
    solamente concentración,
    o ambas.
  */

  if (
    !concentracionesHTML &&
    !presentacionesHTML
  ) {
    return "";
  }


  return `
    <div class="producto-variantes">

      <div class="producto-variantes-encabezado">

        <h2>
          Elegí tu variante
        </h2>

        <p>
          Seleccioná la concentración
          o presentación disponible.
        </p>

      </div>

      ${concentracionesHTML}

      ${presentacionesHTML}

      <p
        class="producto-variante-aviso"
        id="producto-variante-aviso"
        aria-live="polite"
      >
      ${
        concentraciones.length > 1 &&
        presentaciones.length > 1
          ? "Las opciones atenuadas no están disponibles para la concentración seleccionada."
          : ""
      }
      </p>

    </div>
  `;

}


function normalizarVariante(
  valor = ""
) {

  return String(valor)
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();

}

/* ==================================================
   RENDER PRINCIPAL
================================================== */

function renderizarProducto(
  producto,
  contenedor,
  productosVisibles
) {

  const categoria =
    typeof obtenerNombreCategoria ===
    "function"
      ? obtenerNombreCategoria(
          producto.categoria
        )
      : producto.categoria;


  const subcategoria =
    typeof obtenerNombreSubcategoria ===
    "function"
      ? obtenerNombreSubcategoria(
          producto.subcategoria
        )
      : producto.subcategoria;


  const precioActual =
    Number(producto.precio) > 0
      ? formatearPrecio(
          producto.precio
        )
      : "Consultar";


  const precioAnterior =
    producto.precioAnterior
      ? `
          <span
            class="producto-detalle-precio-anterior"
          >
            ${formatearPrecio(
              producto.precioAnterior
            )}
          </span>
        `
      : "";


  /* ==============================================
     ETIQUETAS
  ============================================== */

  const etiquetaOferta =
    producto.oferta
      ? `
          <span
            class="producto-detalle-etiqueta"
          >
            Oferta
          </span>
        `
      : "";


  const etiquetaNuevo =
    producto.nuevo
      ? `
          <span
            class="producto-detalle-etiqueta nuevo"
          >
            Nuevo
          </span>
        `
      : "";


  /* ==============================================
     IMAGEN
  ============================================== */

  const imagenHTML =
    producto.imagen
      ? `
          <img
            src="${producto.imagen}"
            alt="${producto.nombre}"
            id="producto-imagen-principal"
            fetchpriority="high"
            decoding="async"
          >
        `
      : "";


  /* ==============================================
     INGREDIENTES
  ============================================== */

  const ingredientesHTML =
    Array.isArray(
      producto.ingredientes
    ) &&
    producto.ingredientes.length > 0
      ? `
          <article
            class="producto-info-card"
          >

            <div
              class="producto-info-icono"
              aria-hidden="true"
            >
              ❋
            </div>

            <div>

              <h3>
                Ingredientes
              </h3>

              <ul
                class="producto-ingredientes"
              >

                ${producto.ingredientes
                  .map(
                    (ingrediente) => {
                      return `
                        <li>
                          ${ingrediente}
                        </li>
                      `;
                    }
                  )
                  .join("")}

              </ul>

            </div>

          </article>
        `
      : "";


  /* ==============================================
     AVISO CONSULTA
  ============================================== */

  const consultaRecomendada =
    producto.consultarAntes
      ? `
          <div
            class="producto-consulta-recomendada"
          >

            <span
              aria-hidden="true"
              class="producto-consulta-icono"
            >
              !
            </span>

            <div>

              <strong>
                Recomendamos orientación antes de elegir
              </strong>

              <p>
                Este producto puede requerir
                consideraciones individuales.
                Si utilizás medicación, existe
                embarazo o lactancia, patologías
                previas, o se trata de niños o
                mascotas, consultá antes de incorporarlo.
              </p>

            </div>

          </div>
        `
      : "";


  /* ==============================================
     WHATSAPP DINÁMICO
  ============================================== */

  const mensajeWhatsapp =
    encodeURIComponent(
      `Hola, estoy viendo "${producto.nombre}" en la web de Medicina Ancestral y quisiera recibir orientación antes de elegirlo.`
    );


  const whatsappURL =
    `https://wa.me/5491138456670?text=${mensajeWhatsapp}`;



/* ==============================================
   PRODUCTOS RELACIONADOS
============================================== */

  const relacionadosHTML =
  crearProductosRelacionadosHTML(
    producto,
    productosVisibles
  );


  const variantesHTML =
  crearSelectorVariantesHTML(
    producto,
    productosVisibles
  );

  /* ==============================================
     HTML
  ============================================== */

  contenedor.innerHTML = `

    <!-- ==================================================
         BLOQUE PRINCIPAL
    ================================================== -->

    <div class="producto-detalle-grid">


      <!-- IMAGEN -->

      <div class="producto-detalle-imagen">

        ${etiquetaOferta}
        ${etiquetaNuevo}

        ${imagenHTML}

        <div
          class="producto-imagen-placeholder"
          id="producto-imagen-placeholder"
          ${producto.imagen ? "hidden" : ""}
        >
          <span aria-hidden="true">
            ❋
          </span>

          <p>
            Imagen no disponible
          </p>
        </div>

      </div>


      <!-- INFORMACIÓN -->

      <div class="producto-detalle-contenido">


        <div class="producto-detalle-taxonomia">

          <span>
            ${categoria}
          </span>

          ${
            subcategoria
              ? `
                  <span
                    aria-hidden="true"
                  >
                    ·
                  </span>

                  <span>
                    ${subcategoria}
                  </span>
                `
              : ""
          }

        </div>


        <h1>
          ${producto.nombre}
        </h1>


        <p class="producto-detalle-descripcion">
          ${producto.descripcionCorta}
        </p>


        ${variantesHTML}


        <div class="producto-detalle-precios">

          ${precioAnterior}

          <p class="producto-detalle-precio">
            ${precioActual}
          </p>

        </div>


        ${consultaRecomendada}


        <div class="producto-detalle-acciones">

          <button
            type="button"
            class="producto-detalle-agregar"
            id="agregar-producto-detalle"
            data-id="${producto.id}"
          >
            🛒 Agregar al carrito
          </button>


          <a
            href="${whatsappURL}"
            target="_blank"
            rel="noopener noreferrer"
            class="producto-consultar"
          >
            Consultar este producto
          </a>

        </div>


        <p class="producto-compra-nota">
          ¿No sabés si esta opción es adecuada para vos?
          Podés consultarnos antes de realizar tu compra.
        </p>

      </div>

    </div>


    <!-- ==================================================
         INFORMACIÓN AMPLIADA
    ================================================== -->

    <div class="producto-informacion-ampliada">


      <div class="producto-info-encabezado">

        <p class="seccion-eyebrow">
          Conocé lo que estás eligiendo
        </p>

        <h2>
          Información del producto
        </h2>

        <p>
          Te compartimos información clara para
          ayudarte a comprender sus características
          antes de incorporarlo a tu rutina.
        </p>

      </div>


      <div class="producto-info-grid">


        ${
          crearBloqueInformacion(
            "◉",
            "Qué es",
            producto.queEs
          )
        }


        ${
          crearBloqueInformacion(
            "✦",
            "Uso tradicional",
            producto.usoTradicional
          )
        }


        ${
          crearBloqueInformacion(
            "♡",
            "¿Para quién puede ser útil?",
            producto.paraQuien
          )
        }


        ${
          crearBloqueInformacion(
            "◌",
            "Cómo integrarlo",
            producto.comoIntegrar
          )
        }


        ${ingredientesHTML}

      </div>


      ${
        producto.descripcionLarga
          ? `
              <div
                class="producto-descripcion-ampliada"
              >

                <p class="seccion-eyebrow">
                  Más información
                </p>

                <p>
                  ${producto.descripcionLarga}
                </p>

              </div>
            `
          : ""
      }


      ${
        producto.precauciones
          ? `
              <aside
                class="producto-precauciones"
              >

                <div
                  class="producto-precauciones-icono"
                  aria-hidden="true"
                >
                  !
                </div>

                <div>

                  <h2>
                    Precauciones y recomendaciones
                  </h2>

                  <p>
                    ${producto.precauciones}
                  </p>

                  ${
                    producto.consultarAntes
                      ? `
                          <a
                            href="${whatsappURL}"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Consultar antes de elegir →
                          </a>
                        `
                      : ""
                  }

                </div>

              </aside>
            `
          : ""
      }


    </div>
    
    ${relacionadosHTML}
  `;

}


/* ==================================================
   BLOQUES DE INFORMACIÓN
================================================== */

function crearBloqueInformacion(
  icono,
  titulo,
  contenido
) {

  if (!contenido) {
    return "";
  }


  return `

    <article class="producto-info-card">

      <div
        class="producto-info-icono"
        aria-hidden="true"
      >
        ${icono}
      </div>

      <div>

        <h3>
          ${titulo}
        </h3>

        <p>
          ${contenido}
        </p>

      </div>

    </article>

  `;

}

/* ==================================================
   PRODUCTOS RELACIONADOS
================================================== */

function obtenerProductosRelacionados(
  productoActual,
  productos,
  limite = 4
) {

  const nombreBaseActual =
  obtenerNombreBaseVariante(
    productoActual.nombre
  );


const candidatos =
  productos.filter(
    (producto) => {

      /*
        No mostrar el producto actual.
      */

      if (
        producto.id ===
        productoActual.id
      ) {

        return false;

      }


      /*
        No mostrar productos ocultos.
      */

      if (
        producto.visible === false
      ) {

        return false;

      }


      /*
        Comprobamos si pertenece
        a la misma familia de variantes.
      */

      const mismaFamilia =
        producto.categoria ===
          productoActual.categoria &&

        producto.subcategoria ===
          productoActual.subcategoria &&

        obtenerNombreBaseVariante(
          producto.nombre
        ) ===
          nombreBaseActual;


      /*
        Las variantes de la misma
        familia ya se muestran arriba
        en el selector.
      */

      if (mismaFamilia) {

        return false;

      }


      return true;

    }
  );


  /* ==============================================
     MISMA SUBCATEGORÍA
  ============================================== */

  const mismaSubcategoria =
    candidatos.filter(
      (producto) => {
        return (
          producto.categoria ===
            productoActual.categoria &&

          producto.subcategoria ===
            productoActual.subcategoria
        );
      }
    );


  /* ==============================================
     MISMA CATEGORÍA
  ============================================== */

  const mismaCategoria =
    candidatos.filter(
      (producto) => {
        return (
          producto.categoria ===
            productoActual.categoria &&

          producto.subcategoria !==
            productoActual.subcategoria
        );
      }
    );


  /* ==============================================
     RESTO DEL CATÁLOGO
  ============================================== */

  const otrosProductos =
    candidatos.filter(
      (producto) => {
        return (
          producto.categoria !==
          productoActual.categoria
        );
      }
    );


  /* ==============================================
     ORDEN
  ============================================== */

  function ordenarProductos(lista) {

    return [...lista].sort(
      (productoA, productoB) => {

        /*
          Primero los destacados.
        */

        const destacadoA =
          productoA.destacado
            ? 1
            : 0;


        const destacadoB =
          productoB.destacado
            ? 1
            : 0;


        if (
          destacadoA !== destacadoB
        ) {

          return (
            destacadoB -
            destacadoA
          );

        }


        /*
          Después respetamos el campo orden.
        */

        return (
          (productoA.orden ?? 9999) -
          (productoB.orden ?? 9999)
        );

      }
    );

  }


  const relacionados = [

    ...ordenarProductos(
      mismaSubcategoria
    ),

    ...ordenarProductos(
      mismaCategoria
    ),

    ...ordenarProductos(
      otrosProductos
    )

  ];


  return relacionados.slice(
    0,
    limite
  );

}

function crearProductosRelacionadosHTML(
  productoActual,
  productos
) {

  const relacionados =
    obtenerProductosRelacionados(
      productoActual,
      productos,
      4
    );


  if (
    relacionados.length === 0
  ) {

    return "";

  }


  const cardsHTML =
    relacionados
      .map((producto) => {

        const nombreCategoria =
          typeof obtenerNombreCategoria ===
          "function"
            ? obtenerNombreCategoria(
                producto.categoria
              )
            : producto.categoria;


        const precio =
          Number(producto.precio) > 0
            ? formatearPrecio(
                producto.precio
              )
            : "Consultar";


        const imagen =
          producto.imagen
            ? `
                <img
                  src="${producto.imagen}"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  data-imagen-fallback
                >
              `
            : "";


        return `

          <article
            class="producto-relacionado-card"
          >


            <!-- IMAGEN -->

            <a
              href="./producto.html?slug=${encodeURIComponent(
                producto.slug
              )}"
              class="producto-relacionado-imagen"
              aria-label="Ver ${producto.nombre}"
            >

              ${imagen}


              <div
                class="producto-relacionado-placeholder"
                ${producto.imagen ? "hidden" : ""}
                aria-hidden="true"
              >

                <span>
                  ❋
                </span>

                <p>
                  Medicina Ancestral
                </p>

              </div>

            </a>


            <!-- INFORMACIÓN -->

            <div
              class="producto-relacionado-contenido"
            >

              <p
                class="producto-relacionado-categoria"
              >
                ${nombreCategoria}
              </p>


              <h3>

                <a
                  href="./producto.html?slug=${encodeURIComponent(
                    producto.slug
                  )}"
                >
                  ${producto.nombre}
                </a>

              </h3>


              ${
                producto.presentacion
                  ? `
                      <p
                        class="producto-relacionado-presentacion"
                      >
                        ${producto.presentacion}
                      </p>
                    `
                  : ""
              }


              <p
                class="producto-relacionado-precio"
              >
                ${precio}
              </p>


              <a
                href="./producto.html?slug=${encodeURIComponent(
                  producto.slug
                )}"
                class="producto-relacionado-ver"
              >
                Ver producto

                <span aria-hidden="true">
                  →
                </span>

              </a>

            </div>

          </article>

        `;

      })
      .join("");


  return `

    <section
      class="productos-relacionados"
      aria-labelledby="productos-relacionados-titulo"
    >

      <div
        class="productos-relacionados-encabezado"
      >

        <p class="seccion-eyebrow">
          Seguí explorando
        </p>

        <h2
          id="productos-relacionados-titulo"
        >
          También puede interesarte
        </h2>

        <p>
          Otras opciones relacionadas
          que podés conocer dentro
          de nuestro catálogo.
        </p>

      </div>


      <div
        class="productos-relacionados-grid"
      >

        ${cardsHTML}

      </div>

    </section>

  `;

}

/* ==================================================
   EVENTOS
================================================== */

function inicializarEventosProducto(
  producto,
  contenedor,
  productosVisibles
) {

  const botonAgregar =
    contenedor.querySelector(
      "#agregar-producto-detalle"
    );


  if (botonAgregar) {

    botonAgregar.addEventListener(
      "click",
      () => {

        if (
          typeof agregarProductoAlCarrito ===
          "function"
        ) {

          agregarProductoAlCarrito(
            producto.id
          );

        }

      }
    );

  }


  /* ==============================================
     FALLBACK DE IMAGEN
  ============================================== */

  const imagen =
    contenedor.querySelector(
      "#producto-imagen-principal"
    );


/* ==============================================
   FALLBACK PRODUCTOS RELACIONADOS
============================================== */

const imagenesRelacionadas =
  contenedor.querySelectorAll(
    ".producto-relacionado-imagen img"
  );


imagenesRelacionadas.forEach(
  (imagen) => {

    const placeholder =
      imagen.nextElementSibling;


    function mostrarPlaceholder() {

      imagen.hidden = true;


      if (placeholder) {

        placeholder.hidden =
          false;

      }

    }


    imagen.addEventListener(
      "error",
      mostrarPlaceholder
    );


    /*
      Si el error ocurrió antes
      de registrar el evento.
    */

    if (
      imagen.complete &&
      imagen.naturalWidth === 0
    ) {

      mostrarPlaceholder();

    }

  }
);

  const placeholder =
    contenedor.querySelector(
      "#producto-imagen-placeholder"
    );


  if (
    imagen &&
    placeholder
  ) {

    imagen.addEventListener(
      "error",
      () => {

        imagen.hidden = true;

        placeholder.hidden =
          false;

      }
    );

  }

  /* ==============================================
   SELECTOR DE VARIANTES
============================================== */

const botonesVariantes =
  contenedor.querySelectorAll(
    ".producto-variante-btn"
  );


botonesVariantes.forEach(
  (boton) => {

    boton.addEventListener(
      "click",
      () => {

        manejarCambioVariante(
          producto,
          productosVisibles,
          boton
        );

      }
    );

  }
);
}

function manejarCambioVariante(
  productoActual,
  productos,
  botonSeleccionado
) {

  /*
    Un botón disabled normalmente
    ni siquiera dispara click,
    pero lo comprobamos igualmente.
  */

  if (
    botonSeleccionado.disabled
  ) {
    return;
  }


  const variantes =
    obtenerVariantesProducto(
      productoActual,
      productos
    );


  const tipo =
    botonSeleccionado.dataset
      .tipoVariante;


  const valor =
    botonSeleccionado.dataset
      .valorVariante;


  const concentracionActual =
    obtenerConcentracionProducto(
      productoActual
    );


  const presentacionActual =
    obtenerPresentacionVariante(
      productoActual
    );


  let varianteEncontrada = null;


  /* ==============================================
     CAMBIO DE CONCENTRACIÓN
  ============================================== */

  if (
    tipo === "concentracion"
  ) {

    /*
      Primero intentamos conservar
      la presentación actual.
    */

    varianteEncontrada =
      buscarVarianteExacta(
        variantes,
        valor,
        presentacionActual
      );


    /*
      Si esa combinación no existe,
      buscamos cualquier presentación
      disponible para esa concentración.
    */

    if (
      !varianteEncontrada
    ) {

      varianteEncontrada =
        variantes.find(
          (producto) => {

            const concentracion =
              obtenerConcentracionProducto(
                producto
              );


            return (
              normalizarVariante(
                concentracion
              ) ===
              normalizarVariante(
                valor
              )
            );

          }
        );

    }

  }


  /* ==============================================
     CAMBIO DE PRESENTACIÓN
  ============================================== */

  if (
    tipo === "presentacion"
  ) {

    varianteEncontrada =
      buscarVarianteExacta(
        variantes,
        concentracionActual,
        valor
      );

  }


  /* ==============================================
     NAVEGAR
  ============================================== */

  if (
    varianteEncontrada
  ) {

    window.location.href =
      `./producto.html?slug=${encodeURIComponent(
        varianteEncontrada.slug
      )}`;

    return;

  }


  /* ==============================================
     FALLBACK
  ============================================== */

  const aviso =
    document.querySelector(
      "#producto-variante-aviso"
    );


  if (aviso) {

    aviso.textContent =
      "Esta variante no se encuentra disponible actualmente.";

  }

}



/* ==================================================
   MIGAS DE PAN
================================================== */

function actualizarMigaProducto(
  producto
) {

  const miga =
    document.querySelector(
      "#miga-producto"
    );


  if (miga) {

    miga.textContent =
      producto.nombre;

  }

}


/* ==================================================
   SEO
================================================== */

function actualizarSEOProducto(
  producto
) {

  document.title =
    `${producto.nombre} | Medicina Ancestral`;


  const metaDescription =
    document.querySelector(
      "#meta-description-producto"
    );


  if (metaDescription) {

    metaDescription.setAttribute(
      "content",
      producto.descripcionCorta
    );

  }

}


/* ==================================================
   NO ENCONTRADO
================================================== */

function mostrarProductoNoEncontrado(
  contenedor
) {

  document.title =
    "Producto no encontrado | Medicina Ancestral";


  contenedor.innerHTML = `

    <div class="producto-no-encontrado">

      <h1>
        No encontramos este producto
      </h1>

      <p>
        Puede que ya no esté disponible
        o que el enlace no sea correcto.
      </p>

      <a href="./tienda.html">
        Volver a la tienda
      </a>

    </div>

  `;

}


/* ==================================================
   ERROR
================================================== */

function mostrarErrorProducto(
  contenedor
) {

  contenedor.innerHTML = `

    <div class="producto-no-encontrado">

      <h1>
        No pudimos cargar el producto
      </h1>

      <p>
        Intentá nuevamente o regresá a la tienda.
      </p>

      <a href="./tienda.html">
        Volver a la tienda
      </a>

    </div>

  `;

}