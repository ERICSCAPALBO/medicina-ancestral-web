document.addEventListener(
  "DOMContentLoaded",
  iniciarMenuPrincipal
);


function iniciarMenuPrincipal() {

  const header =
    document.querySelector(
      ".header-principal"
    );

  const botonMenu =
    document.querySelector(
      "#menu-toggle"
    );

  const menu =
    document.querySelector(
      "#header-menu"
    );


  if (
    !header ||
    !botonMenu ||
    !menu
  ) {
    return;
  }


  /* ================================================
     ABRIR / CERRAR
  ================================================ */

  function cambiarEstadoMenu(
    abierto
  ) {

    header.classList.toggle(
      "menu-abierto",
      abierto
    );


    botonMenu.setAttribute(
      "aria-expanded",
      String(abierto)
    );


    botonMenu.setAttribute(
      "aria-label",
      abierto
        ? "Cerrar menú de navegación"
        : "Abrir menú de navegación"
    );

  }


  function cerrarMenu() {

    cambiarEstadoMenu(
      false
    );

  }


  /* ================================================
     BOTÓN HAMBURGUESA
  ================================================ */

  botonMenu.addEventListener(
    "click",
    () => {

      const menuEstaAbierto =
        header.classList.contains(
          "menu-abierto"
        );


      cambiarEstadoMenu(
        !menuEstaAbierto
      );

    }
  );


  /* ================================================
     CERRAR AL ELEGIR UN ENLACE
  ================================================ */

  menu.addEventListener(
    "click",
    (evento) => {

      const enlace =
        evento.target.closest(
          "a"
        );


      if (!enlace) {
        return;
      }


      cerrarMenu();

    }
  );


  /* ================================================
     ESCAPE
  ================================================ */

  document.addEventListener(
    "keydown",
    (evento) => {

      if (
        evento.key !== "Escape"
      ) {
        return;
      }


      if (
        !header.classList.contains(
          "menu-abierto"
        )
      ) {
        return;
      }


      cerrarMenu();


      botonMenu.focus();

    }
  );


  /* ================================================
     CLICK FUERA DEL HEADER
  ================================================ */

  document.addEventListener(
    "click",
    (evento) => {

      if (
        header.contains(
          evento.target
        )
      ) {
        return;
      }


      cerrarMenu();

    }
  );


  /* ================================================
     CAMBIO DE TAMAÑO
  ================================================ */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 900
      ) {
        cerrarMenu();
      }

    }
  );

}