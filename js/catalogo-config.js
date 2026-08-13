const NOMBRES_CATEGORIAS = Object.freeze({
  adaptogenos: "Adaptógenos",
  apiterapia: "Apiterapia",
  cbd: "CBD",
  "cosmetica-natural": "Cosmética natural",
  fitoterapia: "Fitoterapia",
  "hongos-frescos": "Hongos frescos",
  "limpieza-energetica": "Limpieza energética",
  "medicina-selva": "Medicina de la selva",
  suplementos: "Suplementos vitamínicos",
  "uso-externo": "Uso externo",
  vapeo: "Cápsulas y equipos para vapeo"
});

const NOMBRES_SUBCATEGORIAS = Object.freeze({
  adultos: "Adultos",
  "ratio-1-1": "Ratio 1:1",
  ninos: "Niños",
  mascotas: "Mascotas",

  capsulas: "Cápsulas",
  "equipos-vapeo": "Equipos para vapeo",

  rapes: "Rapés",
  herramientas: "Herramientas ceremoniales",
  sananga: "Sananga",
  chimo: "Chimó",

  girgolas: "Gírgolas",
  champinones: "Champiñones",
  portobellos: "Portobellos",
  "melena-de-leon": "Melena de león",
  "black-pearl": "Black Pearl",
  enoki: "Enoki",
  pholiotas: "Pholiotas",

  tinturas: "Tinturas",
  "preparados-herbales": "Preparados herbales",
  "aceites-vegetales": "Aceites vegetales",

  "sahumos-resinas": "Sahumos y resinas",
  accesorios: "Accesorios",
  kits: "Kits",
  "sahumerios-esencias": "Sahumerios y esencias",
  velas: "Velas",

  "extractos-5-1": "Extractos 5:1",
  molidos: "Molidos",

  "shampoos-acondicionadores":
    "Shampoos y acondicionadores",

  "jabones-naturales":
    "Jabones naturales",

  "cuidado-rostro":
    "Cuidado del rostro",

  "cuidado-dientes":
    "Cuidado de dientes",

  "cuidado-axilas":
    "Cuidado de axilas",

  "locion-cannabis":
    "Loción de cannabis",

  "aceite-masajes":
    "Aceites de masajes",

  unguento: "Ungüentos",

  propoleo: "Propóleo",

  "mieles-monoflorales":
    "Mieles monoflorales",

  citratos: "Citratos",
  combos: "Combos"
});

const SUBCATEGORIAS_POR_CATEGORIA = Object.freeze({
  cbd: Object.freeze([
    "adultos",
    "ratio-1-1",
    "ninos",
    "mascotas"
  ]),

  vapeo: Object.freeze([
    "capsulas",
    "equipos-vapeo"
  ]),

  "medicina-selva": Object.freeze([
    "rapes",
    "herramientas",
    "sananga",
    "chimo"
  ]),

  "hongos-frescos": Object.freeze([
    "girgolas",
    "champinones",
    "portobellos",
    "melena-de-leon",
    "black-pearl",
    "enoki",
    "pholiotas"
  ]),

  fitoterapia: Object.freeze([
    "tinturas",
    "preparados-herbales",
    "aceites-vegetales"
  ]),

  "limpieza-energetica": Object.freeze([
    "sahumos-resinas",
    "accesorios",
    "kits",
    "sahumerios-esencias",
    "velas"
  ]),

  adaptogenos: Object.freeze([
    "extractos-5-1",
    "molidos"
  ]),

  "cosmetica-natural": Object.freeze([
    "shampoos-acondicionadores",
    "jabones-naturales",
    "cuidado-rostro",
    "cuidado-dientes",
    "cuidado-axilas"
  ]),

  "uso-externo": Object.freeze([
    "locion-cannabis",
    "aceite-masajes",
    "unguento"
  ]),

  apiterapia: Object.freeze([
    "propoleo",
    "mieles-monoflorales"
  ]),

  suplementos: Object.freeze([
    "citratos",
    "combos"
  ])
});

function formatearIdentificadorCatalogo(
  identificador = ""
) {
  return String(identificador)
    .trim()
    .split("-")
    .filter(Boolean)
    .map((palabra) => {
      return (
        palabra.charAt(0).toUpperCase() +
        palabra.slice(1)
      );
    })
    .join(" ");
}

function obtenerNombreCategoria(categoria) {
  return (
    NOMBRES_CATEGORIAS[categoria] ||
    formatearIdentificadorCatalogo(categoria)
  );
}

function obtenerNombreSubcategoria(
  subcategoria
) {
  return (
    NOMBRES_SUBCATEGORIAS[subcategoria] ||
    formatearIdentificadorCatalogo(
      subcategoria
    )
  );
}

function esCombinacionCatalogoValida(
  categoria,
  subcategoria
) {
  const subcategoriasPermitidas =
    SUBCATEGORIAS_POR_CATEGORIA[categoria];

  if (
    !Array.isArray(subcategoriasPermitidas)
  ) {
    return false;
  }

  return subcategoriasPermitidas.includes(
    subcategoria
  );
}

function revisarOrganizacionCatalogo(
  productos = []
) {
  const errores = [];

  productos.forEach((producto, indice) => {
    const posicion = indice + 1;

    if (
      !Object.hasOwn(
        NOMBRES_CATEGORIAS,
        producto.categoria
      )
    ) {
      errores.push(
        `Producto ${posicion}: categoría desconocida ` +
        `"${producto.categoria}".`
      );
    }

    if (
      !Object.hasOwn(
        NOMBRES_SUBCATEGORIAS,
        producto.subcategoria
      )
    ) {
      errores.push(
        `Producto ${posicion}: subcategoría desconocida ` +
        `"${producto.subcategoria}".`
      );
    }

    if (
      producto.categoria &&
      producto.subcategoria &&
      !esCombinacionCatalogoValida(
        producto.categoria,
        producto.subcategoria
      )
    ) {
      errores.push(
        `Producto ${posicion}: la subcategoría ` +
        `"${producto.subcategoria}" no corresponde a ` +
        `"${producto.categoria}".`
      );
    }
  });

  if (errores.length > 0) {
    console.group(
      `Catálogo: ${errores.length} problema(s) detectado(s)`
    );

    errores.forEach((error) => {
      console.warn(error);
    });

    console.groupEnd();
  } else {
    console.info(
      "Catálogo organizado correctamente."
    );
  }

  return errores;
}