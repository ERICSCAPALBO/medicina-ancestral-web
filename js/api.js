async function obtenerProductos() {

  const respuesta =
    await fetch(
      "./data/productos.json"
    );


  if (!respuesta.ok) {

    throw new Error(
      `No se pudieron cargar los productos. Estado: ${respuesta.status}`
    );

  }


  const productos =
    await respuesta.json();


  if (
    !Array.isArray(productos)
  ) {

    throw new Error(
      "El catálogo recibido no tiene un formato válido."
    );

  }


  return productos;

}