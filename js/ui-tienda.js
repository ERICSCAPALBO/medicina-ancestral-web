function inicializarPanelFiltros() {
  const abrirFiltros = document.querySelector(
    "#abrir-filtros"
  );

  const cerrarFiltros = document.querySelector(
    "#cerrar-filtros"
  );

  const panelFiltros = document.querySelector(
    "#panel-filtros"
  );

  const filtrosOverlay = document.querySelector(
    "#filtros-overlay"
  );

  if (
    !abrirFiltros ||
    !cerrarFiltros ||
    !panelFiltros ||
    !filtrosOverlay
  ) {
    console.warn(
      "No se encontraron los elementos del panel de filtros."
    );

    return;
  }

  function abrirPanelFiltros() {
    panelFiltros.classList.add("activo");
    filtrosOverlay.classList.add("activo");

    document.body.classList.add(
      "filtros-abiertos"
    );

    abrirFiltros.setAttribute(
      "aria-expanded",
      "true"
    );

    cerrarFiltros.focus();
  }

  function cerrarPanelFiltros() {
    panelFiltros.classList.remove("activo");
    filtrosOverlay.classList.remove("activo");

    document.body.classList.remove(
      "filtros-abiertos"
    );

    abrirFiltros.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  abrirFiltros.addEventListener(
    "click",
    abrirPanelFiltros
  );

  cerrarFiltros.addEventListener(
    "click",
    cerrarPanelFiltros
  );

  filtrosOverlay.addEventListener(
    "click",
    cerrarPanelFiltros
  );

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      cerrarPanelFiltros();
    }
  });
}