// Catálogos editables. Los `id` viajan en enlaces compartidos: no los cambies
// una vez publicados; edita etiquetas, colores, textos o agrega nuevos ítems.

export const COLORS = Object.freeze([
  { id: "negro", label: "Negro", hex: "#111214" },
  { id: "gris-oscuro", label: "Gris oscuro", hex: "#4d4f53" },
  { id: "gris", label: "Gris", hex: "#85878a" },
  { id: "beige", label: "Beige", hex: "#cdbb9b" },
  { id: "cafe", label: "Café", hex: "#70462e" },
  { id: "rojo", label: "Rojo", hex: "#c71d28" },
  { id: "azul", label: "Azul", hex: "#164f9d" },
  { id: "marino", label: "Azul marino", hex: "#162b4a" },
  { id: "turquesa", label: "Turquesa", hex: "#1594a6" },
  { id: "morado", label: "Morado", hex: "#6a3fa0" },
  { id: "verde", label: "Verde", hex: "#145a42" },
  { id: "naranja", label: "Naranja", hex: "#d86b1c" },
  { id: "blanco", label: "Blanco", hex: "#e9e9e6" },
  { id: "borgona", label: "Borgoña", hex: "#641c2a" },
]);

export const PATTERNS = Object.freeze([
  { id: "liso", label: "Liso", svgId: null, previewClass: "" },
  { id: "chevron", label: "Chevron (V)", svgId: "pattern-chevron", previewClass: "sample-chevron" },
  { id: "diamante", label: "Rombos", svgId: "pattern-diamond", previewClass: "sample-diamond" },
  { id: "ondas", label: "Ondas", svgId: "pattern-wave", previewClass: "sample-wave" },
  { id: "hexagonal", label: "Hexagonal", svgId: "pattern-hex", previewClass: "sample-hex" },
  { id: "deportivo", label: "Deportivo", svgId: "pattern-sport", previewClass: "sample-sport" },
  { id: "perforado", label: "Microperforado", svgId: "pattern-dots", previewClass: "sample-dots" },
]);

export const STITCH_COLORS = Object.freeze([
  { id: "roja", label: "Roja", hex: "#e50914" },
  { id: "blanca", label: "Blanca", hex: "#ffffff" },
  { id: "negra", label: "Negra", hex: "#111111" },
  { id: "azul", label: "Azul", hex: "#2776db" },
  { id: "beige", label: "Beige", hex: "#d7b986" },
  { id: "turquesa", label: "Turquesa", hex: "#1594a6" },
  { id: "morada", label: "Morada", hex: "#6a3fa0" },
  { id: "gris", label: "Gris", hex: "#9a9ba0" },
]);

// El vivo es global: enmarca los paneles y separa visualmente el centro de
// los bolsters. Sus `id` también forman parte de los enlaces compartidos.
export const PIPING_COLORS = Object.freeze([
  { id: "roja", label: "Rojo", hex: "#e50914" },
  { id: "blanca", label: "Blanco", hex: "#f4f1e8" },
  { id: "negra", label: "Negro", hex: "#111111" },
  { id: "beige", label: "Beige", hex: "#d7b986" },
  { id: "amarilla", label: "Amarillo", hex: "#f2c230" },
  { id: "azul", label: "Azul", hex: "#2776db" },
  { id: "turquesa", label: "Turquesa", hex: "#1594a6" },
  { id: "gris", label: "Gris", hex: "#9a9ba0" },
]);

export const MATERIALS = Object.freeze([
  { id: "americano", label: "Cuero Americano", description: "Importado, de acabado suave y uniforme, alto brillo y gran durabilidad." },
  { id: "colombiano", label: "Cuero Colombiano", description: "Textura firme y grano marcado, con excelente relación entre calidad y precio." },
]);

export const EMBROIDERIES = Object.freeze([
  { id: "ninguno", label: "Sin bordado" },
  { id: "forros-cuenca", label: "FORROS CUENCA" },
  { id: "nombre", label: "Nombre del cliente" },
  { id: "logo", label: "Logo" },
]);

// `parent` marca una sub-zona dibujada dentro de otra: si un diseño no la
// define, hereda el acabado de su zona madre. Con `seamOnlyWhenDifferent` su
// costura solo se dibuja cuando su acabado difiere del de la zona madre.
export const PARTS = Object.freeze([
  { id: "back", number: 1, label: "Centro respaldo", short: "Respaldo", svgZoneIds: ["zone-back"], svgPatternIds: ["pattern-back"] },
  { id: "side", number: 2, label: "Laterales respaldo", short: "Laterales", svgZoneIds: ["zone-side-left", "zone-side-right"], svgPatternIds: ["pattern-side-left", "pattern-side-right"] },
  { id: "base", number: 3, label: "Centro cojín", short: "Cojín", svgZoneIds: ["zone-base"], svgPatternIds: ["pattern-base"] },
  { id: "head", number: 4, label: "Cabecera", short: "Cabecera", svgZoneIds: ["zone-head"], svgPatternIds: ["pattern-head"] },
  { id: "edge", number: 5, label: "Laterales cojín", short: "Bordes cojín", svgZoneIds: ["zone-edge"], svgPatternIds: ["pattern-edge"] },
  { id: "top", number: 6, parent: "back", label: "Panel superior respaldo", short: "Panel superior", svgZoneIds: ["zone-top"], svgPatternIds: ["pattern-top"] },
  { id: "headCenter", number: 7, parent: "head", label: "Centro cabecera", short: "Centro cabecera", svgZoneIds: ["zone-head-center"], svgPatternIds: ["pattern-head-center"] },
  { id: "front", number: 8, parent: "edge", label: "Frente del cojín", short: "Frente cojín", svgZoneIds: ["zone-front"], svgPatternIds: ["pattern-front"] },
]);

// Completa las sub-zonas que falten copiando el acabado de su zona madre.
export function withSubZones(zones) {
  const complete = { ...zones };
  for (const part of PARTS) {
    if (part.parent && !complete[part.id]) complete[part.id] = { ...complete[part.parent] };
  }
  return complete;
}

// Estados completos de diseño. Los datos del vehículo se conservan al aplicar uno.
const BASE_PRESETS = [
  {
    id: "clasico-negro", label: "Clásico Cuero Negro", description: "Sobrio, uniforme y fácil de combinar.",
    config: { zones: { back: { color: "negro", pattern: "liso", stitch: "gris" }, side: { color: "negro", pattern: "liso", stitch: "gris" }, base: { color: "negro", pattern: "liso", stitch: "gris" }, head: { color: "negro", pattern: "liso", stitch: "gris" }, edge: { color: "negro", pattern: "liso", stitch: "gris" } }, piping: "gris", material: "americano", embroidery: { type: "ninguno", text: "" } },
  },
  {
    id: "sport-rojo", label: "Sport Bicolor Rojo", description: "Centro rojo en V, laterales negros y costura roja.",
    config: { zones: { back: { color: "rojo", pattern: "chevron", stitch: "roja" }, side: { color: "negro", pattern: "liso", stitch: "roja" }, base: { color: "rojo", pattern: "chevron", stitch: "roja" }, head: { color: "negro", pattern: "liso", stitch: "roja" }, edge: { color: "negro", pattern: "liso", stitch: "roja" }, top: { color: "negro", pattern: "liso", stitch: "roja" } }, piping: "roja", material: "americano", embroidery: { type: "forros-cuenca", text: "" } },
  },
  {
    id: "deportivo-morado", label: "Deportivo Morado", description: "Gris con V y laterales morados, como nuestros trabajos deportivos.",
    config: { zones: { back: { color: "gris-oscuro", pattern: "chevron", stitch: "morada" }, side: { color: "morado", pattern: "liso", stitch: "morada" }, base: { color: "gris-oscuro", pattern: "chevron", stitch: "morada" }, head: { color: "gris-oscuro", pattern: "liso", stitch: "morada" }, edge: { color: "morado", pattern: "liso", stitch: "morada" }, top: { color: "morado", pattern: "liso", stitch: "morada" }, headCenter: { color: "morado", pattern: "liso", stitch: "morada" }, front: { color: "gris-oscuro", pattern: "liso", stitch: "morada" } }, piping: "negra", material: "americano", embroidery: { type: "nombre", text: "" } },
  },
  {
    id: "negro-turquesa", label: "Negro y Turquesa", description: "Negro con V y alas turquesa.",
    config: { zones: { back: { color: "negro", pattern: "chevron", stitch: "gris" }, side: { color: "turquesa", pattern: "liso", stitch: "gris" }, base: { color: "negro", pattern: "chevron", stitch: "gris" }, head: { color: "negro", pattern: "liso", stitch: "gris" }, edge: { color: "turquesa", pattern: "liso", stitch: "gris" }, top: { color: "negro", pattern: "liso", stitch: "gris" }, front: { color: "negro", pattern: "liso", stitch: "gris" } }, piping: "negra", material: "americano", embroidery: { type: "ninguno", text: "" } },
  },
  {
    id: "aventura-cafe", label: "Aventura Café", description: "Café y beige con rombos para camionetas y SUV.",
    config: { zones: { back: { color: "cafe", pattern: "diamante", stitch: "beige" }, side: { color: "negro", pattern: "liso", stitch: "beige" }, base: { color: "beige", pattern: "diamante", stitch: "beige" }, head: { color: "cafe", pattern: "liso", stitch: "beige" }, edge: { color: "cafe", pattern: "liso", stitch: "beige" } }, piping: "beige", material: "americano", embroidery: { type: "ninguno", text: "" } },
  },
  {
    id: "gris-ejecutivo", label: "Gris Ejecutivo", description: "Grises combinados con microperforado.",
    config: { zones: { back: { color: "gris", pattern: "perforado", stitch: "gris" }, side: { color: "gris-oscuro", pattern: "liso", stitch: "gris" }, base: { color: "gris", pattern: "perforado", stitch: "gris" }, head: { color: "gris-oscuro", pattern: "liso", stitch: "gris" }, edge: { color: "gris-oscuro", pattern: "liso", stitch: "gris" } }, piping: "azul", material: "colombiano", embroidery: { type: "ninguno", text: "" } },
  },
];

export const PRESETS = Object.freeze(BASE_PRESETS.map((preset) => ({
  ...preset,
  config: { ...preset.config, zones: withSubZones(preset.config.zones) },
})));

export const TABS = Object.freeze([
  { id: "color", label: "Color", scope: "zone" }, { id: "pattern", label: "Patrón", scope: "zone" },
  { id: "stitch", label: "Costura", scope: "zone" }, { id: "piping", label: "Vivo", scope: "global" },
  { id: "material", label: "Material", scope: "global" },
  { id: "embroidery", label: "Bordado", scope: "global" },
]);

export const WHATSAPP_NUMBER = "593984353695";

// Escribe solo el número, sin símbolo de dólar. Ejemplo: "120".
// Déjalo vacío para mostrar únicamente "Cotizar en WhatsApp".
export const PRECIO_DESDE = "";

export function findById(collection, id) {
  return collection.find((item) => item.id === id);
}
