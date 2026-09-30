import { COLORS, EMBROIDERIES, MATERIALS, PARTS, PATTERNS, PIPING_COLORS, STITCH_COLORS } from "./data.js";

const STATE_VERSION = 5;
const COMPATIBLE_VERSIONS = new Set([1, 2, 3, 4, 5]);
const URL_PARAMETER = "diseno";
// Se mantiene la clave de la primera ronda para migrar sin perder diseños.
const STORAGE_KEY = "forros-cuenca-configuracion-v1";
const DEFAULT_ZONE = Object.freeze({ color: "negro", pattern: "liso", stitch: "roja" });

function defaultConfig() {
  return {
    version: STATE_VERSION,
    zones: Object.fromEntries(PARTS.map((part) => [part.id, { ...DEFAULT_ZONE }])),
    piping: "roja",
    material: "americano",
    embroidery: { type: "ninguno", text: "" },
    vehicle: { model: "", year: "" },
  };
}

function hasId(collection, id) {
  return collection.some((item) => item.id === id);
}

function compactConfig(config) {
  return {
    v: STATE_VERSION,
    z: Object.fromEntries(PARTS.map((part) => {
      const zone = config.zones[part.id];
      return [part.id, [zone.color, zone.pattern, zone.stitch]];
    })),
    p: config.piping,
    m: config.material,
    b: [config.embroidery.type, config.embroidery.text],
    ve: [config.vehicle.model, config.vehicle.year],
  };
}

function normalizeConfig(payload) {
  if (!payload || typeof payload !== "object" || !COMPATIBLE_VERSIONS.has(payload.v)) {
    throw new Error("Versión de configuración no compatible");
  }

  const config = defaultConfig();
  const zones = payload.z && typeof payload.z === "object" ? payload.z : {};

  for (const part of PARTS) {
    const candidate = zones[part.id];
    // v4/v5 añadieron sub-zonas; en enlaces anteriores heredan de su zona madre, que
    // se procesa antes porque PARTS lista primero las cinco zonas principales.
    if (part.parent) config.zones[part.id] = { ...config.zones[part.parent] };
    if (!Array.isArray(candidate)) continue;
    if (hasId(COLORS, candidate[0])) config.zones[part.id].color = candidate[0];
    if (hasId(PATTERNS, candidate[1])) config.zones[part.id].pattern = candidate[1];
    if (hasId(STITCH_COLORS, candidate[2])) config.zones[part.id].stitch = candidate[2];
  }

  if (hasId(PIPING_COLORS, payload.p)) {
    config.piping = payload.p;
  } else if (payload.v < 3 && hasId(PIPING_COLORS, config.zones.back.stitch)) {
    // Los enlaces v1/v2 no tenían vivo: se migra usando el hilo del respaldo,
    // que conserva la intención cromática del diseño anterior.
    config.piping = config.zones.back.stitch;
  }

  if (hasId(MATERIALS, payload.m)) config.material = payload.m;
  if (Array.isArray(payload.b) && hasId(EMBROIDERIES, payload.b[0])) {
    config.embroidery.type = payload.b[0];
    config.embroidery.text = typeof payload.b[1] === "string" ? payload.b[1].slice(0, 80) : "";
  }
  if (!["nombre", "logo"].includes(config.embroidery.type)) config.embroidery.text = "";

  if (Array.isArray(payload.ve)) {
    config.vehicle.model = typeof payload.ve[0] === "string" ? payload.ve[0].slice(0, 60) : "";
    config.vehicle.year = typeof payload.ve[1] === "string" ? payload.ve[1].replace(/\D/gu, "").slice(0, 4) : "";
  }

  return config;
}

function toBase64Url(value) {
  const bytes = new TextEncoder().encode(value);
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function fromBase64Url(value) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeConfig(config) {
  return toBase64Url(JSON.stringify(compactConfig(config)));
}

function decodeConfig(value) {
  return normalizeConfig(JSON.parse(fromBase64Url(value)));
}

export function loadConfig() {
  const urlValue = new URL(window.location.href).searchParams.get(URL_PARAMETER);
  if (urlValue) {
    try {
      return { config: decodeConfig(urlValue), source: "url", warning: "" };
    } catch {
      return { config: loadLocalConfig() ?? defaultConfig(), source: "fallback", warning: "El enlace no contenía un diseño válido. Recuperamos la última configuración disponible." };
    }
  }

  const localConfig = loadLocalConfig();
  if (localConfig) return { config: localConfig, source: "local", warning: "" };
  return { config: defaultConfig(), source: "default", warning: "" };
}

function loadLocalConfig() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeConfig(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
}

export function persistConfig(config) {
  const compact = compactConfig(config);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
  } catch {
    // El configurador continúa si el navegador bloquea el almacenamiento.
  }

  try {
    const url = new URL(window.location.href);
    url.searchParams.set(URL_PARAMETER, encodeConfig(config));
    window.history.replaceState(null, "", url);
  } catch {
    // Algunos navegadores limitan history.replaceState en archivos locales.
  }
}

export function getShareUrl(config) {
  const url = new URL(window.location.href);
  url.searchParams.set(URL_PARAMETER, encodeConfig(config));
  return url.toString();
}
