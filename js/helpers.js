function convertirPrecioANumero(precioTexto) {
  return Number(
    precioTexto
      .replace("$", "")
      .replace(".", "")
      .replace(",", "")
      .trim()
  );
}

function formatearPrecio(numero) {
  return `$${numero.toLocaleString("es-AR")}`;
}