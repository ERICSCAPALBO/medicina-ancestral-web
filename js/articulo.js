document.addEventListener(
  "DOMContentLoaded",
  iniciarArticulo
);


async function iniciarArticulo() {

  const contenedor =
    document.querySelector(
      "#articulo-contenedor"
    );

  if (!contenedor) {
    return;
  }


  const parametrosURL =
    new URLSearchParams(
      window.location.search
    );

  const slug =
    parametrosURL.get("slug");


  if (!slug) {

    mostrarArticuloNoEncontrado(
      contenedor
    );

    return;
  }


  try {

    const respuesta = await fetch(
      "../data/articulos.json"
    );


    if (!respuesta.ok) {

      throw new Error(
        "No se pudieron cargar los artículos."
      );

    }


    const articulos =
      await respuesta.json();


    const articulo =
      articulos.find(
        (articulo) => {
          return (
            articulo.slug === slug &&
            articulo.visible
          );
        }
      );


    if (!articulo) {

      mostrarArticuloNoEncontrado(
        contenedor
      );

      return;
    }


    actualizarSEOArticulo(
      articulo
    );


    renderizarArticulo(
      articulo,
      contenedor
    );


  } catch (error) {

    console.error(error);

    mostrarErrorArticulo(
      contenedor
    );

  }

}


/* ==================================================
   RENDERIZAR ARTÍCULO
================================================== */

function renderizarArticulo(
  articulo,
  contenedor
) {

  const seccionesHTML =
    Array.isArray(articulo.secciones)
      ? articulo.secciones
          .map((seccion) => {

            const parrafosHTML =
              Array.isArray(seccion.parrafos)
                ? seccion.parrafos
                    .map((parrafo) => {
                      return `
                        <p>
                          ${parrafo}
                        </p>
                      `;
                    })
                    .join("")
                : "";

            return `
              <section class="articulo-seccion">

                <h2>
                  ${seccion.titulo}
                </h2>

                ${parrafosHTML}

              </section>
            `;
          })
          .join("")
      : "";


  contenedor.innerHTML = `

    <header class="articulo-header">

      <div class="articulo-meta">

        <span>
          ${articulo.categoria}
        </span>

        <span aria-hidden="true">
          ·
        </span>

        <span>
          ${formatearFecha(
            articulo.fecha
          )}
        </span>

        <span aria-hidden="true">
          ·
        </span>

        <span>
          ${articulo.tiempoLectura}
        </span>

      </div>


      <h1>
        ${articulo.titulo}
      </h1>


      <p class="articulo-resumen">
        ${articulo.resumen}
      </p>

    </header>


    <figure class="articulo-imagen-principal">

      <img
        src=".${articulo.imagen}"
        alt="${articulo.titulo}"
      >

    </figure>


    <div class="articulo-cuerpo">

      <p class="articulo-introduccion">
        ${articulo.introduccion}
      </p>

      ${seccionesHTML}


      <aside class="articulo-aviso">

        <h2>
          Información responsable
        </h2>

        <p>
          Este contenido tiene fines educativos.
          Los productos naturales pueden tener
          indicaciones y precauciones diferentes
          según cada persona.
        </p>

        <p>
          En casos de medicación, embarazo,
          lactancia, patologías previas, niños
          o mascotas, recomendamos consultar
          con un profesional antes de incorporar
          nuevos productos a una rutina.
        </p>

      </aside>

    </div>
  `;


  const migaTitulo =
    document.querySelector(
      "#articulo-miga-titulo"
    );

  if (migaTitulo) {

    migaTitulo.textContent =
      articulo.titulo;

  }

}


/* ==================================================
   FECHA
================================================== */

function formatearFecha(
  fecha
) {

  if (!fecha) {
    return "";
  }

  const fechaArticulo =
    new Date(
      `${fecha}T12:00:00`
    );

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  ).format(
    fechaArticulo
  );

}


/* ==================================================
   SEO BÁSICO
================================================== */

function actualizarSEOArticulo(
  articulo
) {

  document.title =
    `${articulo.titulo} | Medicina Ancestral`;


  const metaDescription =
    document.querySelector(
      "#meta-description"
    );


  if (metaDescription) {

    metaDescription.setAttribute(
      "content",
      articulo.resumen
    );

  }

}


/* ==================================================
   ARTÍCULO NO ENCONTRADO
================================================== */

function mostrarArticuloNoEncontrado(
  contenedor
) {

  document.title =
    "Artículo no encontrado | Medicina Ancestral";


  contenedor.innerHTML = `

    <div class="articulo-no-encontrado">

      <h1>
        No encontramos este artículo
      </h1>

      <p>
        Puede que el contenido haya cambiado
        o que el enlace no sea correcto.
      </p>

      <a href="./blog.html">
        Volver al blog
      </a>

    </div>
  `;

}


/* ==================================================
   ERROR
================================================== */

function mostrarErrorArticulo(
  contenedor
) {

  contenedor.innerHTML = `

    <div class="articulo-no-encontrado">

      <h1>
        No pudimos cargar el artículo
      </h1>

      <p>
        Intentá nuevamente o volvé al blog.
      </p>

      <a href="./blog.html">
        Volver al blog
      </a>

    </div>
  `;

}