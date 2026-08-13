async function obtenerProductos() {
  try {
    const respuesta = await fetch("./data/productos.json");

    if (!respuesta.ok) {
      throw new Error(
        `No se pudieron cargar los productos. Estado: ${respuesta.status}`
      );
    }

    const productos = await respuesta.json();

    return productos;
  } catch (error) {
    console.error("Error al obtener los productos:", error);

    return [];
  }
}