document.addEventListener(
  "DOMContentLoaded",
  iniciarBlog
);

async function iniciarBlog() {
  const contenedor = document.querySelector(
    "#blog-articulos"
  );

  if (!contenedor) {
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

    const articulos = await respuesta.json();

    const articulosVisibles = articulos
      .filter((articulo) => {
        return articulo.visible;
      })
      .sort((articuloA, articuloB) => {
        return new Date(articuloB.fecha) -
          new Date(articuloA.fecha);
      });

    renderizarArticulos(
      articulosVisibles,
      contenedor
    );

  } catch (error) {

    console.error(error);

    contenedor.innerHTML = `
      <div class="blog-error">

        <h2>
          No pudimos cargar los artículos
        </h2>

        <p>
          Intentá nuevamente en unos minutos.
        </p>

      </div>
    `;
  }
}


function renderizarArticulos(
  articulos,
  contenedor
) {

  if (articulos.length === 0) {

    contenedor.innerHTML = `
      <p>
        Todavía no hay artículos publicados.
      </p>
    `;

    return;
  }


  contenedor.innerHTML = articulos
    .map((articulo, indice) => {

      const claseDestacado =
        indice === 0
          ? "blog-articulo-destacado"
          : "";

      return `
        <article
          class="blog-articulo-card ${claseDestacado}"
        >

          <a
            href="./articulo.html?slug=${articulo.slug}"
            class="blog-articulo-imagen"
          >

            <img
              src=".${articulo.imagen}"
              alt="${articulo.titulo}"
              loading="lazy"
            >

          </a>


          <div class="blog-articulo-contenido">

            <div class="blog-articulo-meta">

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
                href="./articulo.html?slug=${articulo.slug}"
              >
                ${articulo.titulo}
              </a>

            </h3>


            <p>
              ${articulo.resumen}
            </p>


            <a
              href="./articulo.html?slug=${articulo.slug}"
              class="blog-leer-articulo"
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
}