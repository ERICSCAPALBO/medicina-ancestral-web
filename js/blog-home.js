document.addEventListener(
  "DOMContentLoaded",
  iniciarBlogHome
);


async function iniciarBlogHome() {

  const contenedor =
    document.querySelector(
      "#blog-home-articulos"
    );

  if (!contenedor) {
    return;
  }


  try {

    const respuesta = await fetch(
      "./data/articulos.json"
    );


    if (!respuesta.ok) {

      throw new Error(
        "No se pudieron cargar los artículos."
      );

    }


    const articulos =
      await respuesta.json();


    const articulosVisibles = articulos
      .filter((articulo) => {
        return articulo.visible;
      })
      .sort((articuloA, articuloB) => {

        return (
          new Date(articuloB.fecha) -
          new Date(articuloA.fecha)
        );

      });


    /* ==============================================
       PRIORIZAR DESTACADOS
    ============================================== */

    const articulosDestacados =
      articulosVisibles.filter(
        (articulo) => {
          return articulo.destacado;
        }
      );


    /*
      Si hay destacados:
      usamos los destacados.

      Si no hay destacados:
      usamos los artículos más recientes.
    */

    const articulosHome =
      (
        articulosDestacados.length > 0
          ? articulosDestacados
          : articulosVisibles
      )
        .slice(0, 3);


    renderizarArticulosHome(
      articulosHome,
      contenedor
    );


  } catch (error) {

    console.error(error);


    contenedor.innerHTML = `

      <div class="blog-home-error">

        <p>
          No pudimos cargar los artículos
          en este momento.
        </p>

        <a href="./pages/blog.html">
          Ir al blog
        </a>

      </div>

    `;

  }

}


/* ==================================================
   RENDER
================================================== */

function renderizarArticulosHome(
  articulos,
  contenedor
) {

  if (articulos.length === 0) {

    contenedor.innerHTML = `

      <div class="blog-home-error">

        <p>
          Todavía no hay artículos publicados.
        </p>

      </div>

    `;

    return;

  }


  contenedor.innerHTML = articulos
    .map((articulo, indice) => {

      const clasePrincipal =
        indice === 0
          ? "blog-home-card-principal"
          : "";


      return `

        <article
          class="blog-home-card ${clasePrincipal}"
        >

          <a
            href="./pages/articulo.html?slug=${articulo.slug}"
            class="blog-home-imagen"
            aria-label="Leer ${articulo.titulo}"
          >

            <img
              src="${articulo.imagen}"
              alt="${articulo.titulo}"
              loading="lazy"
            >

            <div
              class="blog-home-imagen-placeholder"
              hidden
              aria-hidden="true"
            >
              <span>
                Medicina Ancestral
              </span>
            </div>

          </a>


          <div class="blog-home-contenido">

            <div class="blog-home-meta">

              <span>
                ${articulo.categoria}
              </span>

              <span aria-hidden="true">
                ·
              </span>

              <span>
                ${articulo.tiempoLectura}
              </span>

            </div>


            <h3>

              <a
                href="./pages/articulo.html?slug=${articulo.slug}"
              >
                ${articulo.titulo}
              </a>

            </h3>


            <p>
              ${articulo.resumen}
            </p>


            <a
              href="./pages/articulo.html?slug=${articulo.slug}"
              class="blog-home-leer"
            >
              Leer artículo

              <span aria-hidden="true">
                →
              </span>
            </a>

          </div>

        </article>

      `;

    })
    .join("");


  activarPlaceholdersImagenes(
    contenedor
  );

}


/* ==================================================
   IMÁGENES NO DISPONIBLES
================================================== */

function activarPlaceholdersImagenes(
  contenedor
) {

  const imagenes =
    contenedor.querySelectorAll(
      ".blog-home-imagen img"
    );


  imagenes.forEach((imagen) => {

    imagen.addEventListener(
      "error",
      () => {

        const placeholder =
          imagen.nextElementSibling;


        imagen.hidden = true;


        if (placeholder) {
          placeholder.hidden = false;
        }

      }
    );

  });

}