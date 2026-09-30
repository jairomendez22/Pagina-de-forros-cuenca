import {
  COLORS,
  EMBROIDERIES,
  MATERIALS,
  PARTS,
  PATTERNS,
  PIPING_COLORS,
  PRECIO_DESDE,
  PRESETS,
  STITCH_COLORS,
  TABS,
  findById,
} from "./data.js";
import { VEHICLE_BRANDS, findBrand, modelYears } from "./vehicles.js";

const elements = {
  panel: document.querySelector("#config-panel"),
  tabContext: document.querySelector("#tab-context"),
  tabs: [...document.querySelectorAll("[data-tab]")],
  materialBadge: document.querySelector("#material-badge"),
  grain: document.querySelector("#grain-overlay"),
  piping: document.querySelector("#piping-lines"),
  embroideryPreview: document.querySelector("#embroidery-preview"),
  summary: document.querySelector("#summary-list"),
  shareButtons: [document.querySelector("#share-button"), document.querySelector("#summary-share-button")],
  saveImageButton: document.querySelector("#save-image-button"),
  mobileQuoteButton: document.querySelector("#mobile-quote-button"),
  whatsappButtons: [...document.querySelectorAll('[data-action="whatsapp"]')],
  vehicleFields: [...document.querySelectorAll("[data-vehicle-field]")],
  vehicleBrand: document.querySelector('[data-vehicle-select="brand"]'),
  vehicleModel: document.querySelector('[data-vehicle-select="model"]'),
  vehicleYear: document.querySelector('[data-vehicle-select="year"]'),
  vehicleSelectWraps: [...document.querySelectorAll("[data-vehicle-select-wrap]")],
  vehicleCustom: [...document.querySelectorAll("[data-vehicle-custom]")],
  zones: [...document.querySelectorAll(".zone[data-part]")],
  zoneChipHost: document.querySelector("#zone-chips"),
  zoneChips: [],
  seat: document.querySelector("#seat"),
  seatStage: document.querySelector("#seat-stage"),
  navToggle: document.querySelector("#nav-toggle"),
  siteNav: document.querySelector("#site-nav"),
  toast: document.querySelector("#toast"),
  announcer: document.querySelector("#announcer"),
};

let toastTimer;

export function bindView(actions) {

  for (const zone of elements.zones) {
    zone.addEventListener("click", () => actions.selectPart(zone.dataset.part));
    zone.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      actions.selectPart(zone.dataset.part);
    });
  }

  elements.zoneChips = PARTS.map((part) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "zone-chip";
    chip.dataset.zoneChip = part.id;
    chip.setAttribute("aria-pressed", "false");
    chip.setAttribute("aria-label", `Zona ${part.number}, ${part.label}`);
    chip.innerHTML = `<span aria-hidden="true">${part.number}</span>${part.short}`;
    if (part.parent) chip.classList.add("is-detail");
    chip.addEventListener("click", () => actions.selectPart(part.id));
    elements.zoneChipHost.append(chip);
    return chip;
  });

  // Las sub-zonas quedan tras "+ Detalles" para no abrumar en el primer vistazo.
  const detailCount = PARTS.filter((part) => part.parent).length;
  const detailToggle = document.createElement("button");
  detailToggle.type = "button";
  detailToggle.className = "zone-chip zone-detail-toggle";
  detailToggle.setAttribute("aria-expanded", "false");
  detailToggle.addEventListener("click", () => {
    setDetailsOpen(!elements.zoneChipHost.classList.contains("show-details"));
  });
  elements.detailToggle = detailToggle;
  elements.detailLabel = (open) => open ? "− Menos zonas" : `+ Detalles (${detailCount})`;
  detailToggle.textContent = elements.detailLabel(false);
  elements.zoneChipHost.append(detailToggle);

  for (const tab of elements.tabs) {
    tab.addEventListener("click", () => actions.selectTab(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => handleTabKeyboard(event, actions));
  }

  elements.panel.addEventListener("click", (event) => {
    const presetButton = event.target.closest("button[data-preset]");
    if (presetButton) {
      actions.applyPreset(presetButton.dataset.preset);
      elements.panel.querySelector(`button[data-preset="${presetButton.dataset.preset}"]`)
        ?.focus({ preventScroll: true });
      return;
    }

    const option = event.target.closest("button[data-field][data-value]");
    if (!option) return;

    const { field, value } = option.dataset;
    actions.selectOption(field, value);

    elements.panel.querySelector(`button[data-field="${field}"][data-value="${value}"]`)
      ?.focus({ preventScroll: true });
  });

  elements.panel.addEventListener("input", (event) => {
    if (!event.target.matches("[data-embroidery-text]")) return;
    actions.updateEmbroideryText(event.target.value);
  });

  for (const input of elements.vehicleFields) {
    input.addEventListener("input", () => actions.updateVehicle(input.dataset.vehicleField, input.value));
  }

  // Selector marca → modelo → año. Se guarda como texto («Toyota Hilux», «2020») para
  // que los enlaces y el mensaje de WhatsApp sigan igual que con el campo libre.
  elements.vehicleBrand.innerHTML = [
    '<option value="">Elige la marca</option>',
    ...VEHICLE_BRANDS.map((item) => `<option value="${item.brand}">${item.brand}</option>`),
    `<option value="${OTHER}">Otra marca</option>`,
  ].join("");
  elements.vehicleBrand.addEventListener("change", () => {
    const brand = elements.vehicleBrand.value;
    vehicleUi.custom = brand === OTHER;
    actions.updateVehicle("model", vehicleUi.custom ? "" : brand);
    actions.updateVehicle("year", "");
    if (vehicleUi.custom) elements.vehicleCustom[0].querySelector("input").focus();
  });
  elements.vehicleModel.addEventListener("change", () => {
    const brand = elements.vehicleBrand.value;
    const model = elements.vehicleModel.value;
    vehicleUi.custom = model === OTHER;
    actions.updateVehicle("model", vehicleUi.custom ? `${brand} ` : [brand, model].filter(Boolean).join(" "));
    actions.updateVehicle("year", "");
    if (vehicleUi.custom) elements.vehicleCustom[0].querySelector("input").focus();
  });
  elements.vehicleYear.addEventListener("change", () => actions.updateVehicle("year", elements.vehicleYear.value));

  for (const button of elements.shareButtons) {
    button?.addEventListener("click", actions.share);
  }

  elements.saveImageButton?.addEventListener("click", actions.saveImage);

  for (const button of elements.whatsappButtons) {
    button.addEventListener("click", actions.openWhatsApp);
  }

  elements.navToggle?.addEventListener("click", () => {
    const willOpen = elements.navToggle.getAttribute("aria-expanded") !== "true";
    setNavigationOpen(willOpen);
  });
  for (const link of elements.siteNav?.querySelectorAll("a") ?? []) {
    link.addEventListener("click", () => setNavigationOpen(false));
  }
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavigationOpen(false);
  });

  initScrollReveals();
}

function setNavigationOpen(isOpen) {
  if (!elements.navToggle || !elements.siteNav) return;
  elements.navToggle.setAttribute("aria-expanded", String(isOpen));
  elements.navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  elements.siteNav.classList.toggle("is-open", isOpen);
}

function initScrollReveals() {
  const sections = [...document.querySelectorAll(".reveal")];
  if (!("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.1, rootMargin: "0px 0px -7% 0px" });
  for (const section of sections) observer.observe(section);
}

function handleTabKeyboard(event, actions) {
  const currentIndex = elements.tabs.indexOf(event.currentTarget);
  let nextIndex = currentIndex;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex += 1;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex -= 1;
  else if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = elements.tabs.length - 1;
  else return;

  event.preventDefault();
  nextIndex = (nextIndex + elements.tabs.length) % elements.tabs.length;
  const nextTab = elements.tabs[nextIndex];
  actions.selectTab(nextTab.dataset.tab);
  nextTab.focus();
}

export function render(config, ui, { controls = true, seat = true } = {}) {
  if (seat) paintSeat(config, ui.activePart);
  renderTabs(ui);
  renderVehicleFields(config.vehicle);
  renderQuoteLabel();
  if (controls) renderControls(config, ui);
  renderSummary(config);
}

function paintSeat(config, activePart) {
  for (const part of PARTS) {
    const zoneConfig = config.zones[part.id];
    const color = findById(COLORS, zoneConfig.color);
    const pattern = findById(PATTERNS, zoneConfig.pattern);
    const stitch = findById(STITCH_COLORS, zoneConfig.stitch);
    const isActive = part.id === activePart;
    const patternPaintId = pattern.svgId ? preparePattern(pattern, part.id, stitch) : null;

    for (const zoneId of part.svgZoneIds) {
      const zone = document.getElementById(zoneId);
      zone.style.fill = color.hex;
      zone.style.removeProperty("stroke");
      zone.classList.toggle("is-active", isActive);
      zone.setAttribute("aria-pressed", String(isActive));
    }

    for (const patternId of part.svgPatternIds) {
      const layer = document.getElementById(patternId);
      // Estilo en línea: la regla CSS `.pattern-layer{fill:none}` anula el atributo `fill`.
      layer.style.fill = patternPaintId ? `url(#${patternPaintId})` : "none";
    }

    const seam = document.querySelector(`#seams-${part.id}`);
    if (seam) {
      const parentZone = part.parent ? config.zones[part.parent] : null;
      const sameAsParent = part.seamOnlyWhenDifferent && parentZone.color === zoneConfig.color
        && parentZone.pattern === zoneConfig.pattern && parentZone.stitch === zoneConfig.stitch;
      seam.style.stroke = stitch.hex;
      seam.style.display = sameAsParent ? "none" : "";
    }
  }

  if (findById(PARTS, activePart)?.parent) setDetailsOpen(true);
  for (const chip of elements.zoneChips) {
    const isActive = chip.dataset.zoneChip === activePart;
    chip.setAttribute("aria-pressed", String(isActive));
    if (isActive) revealChip(chip);
  }

  const material = findById(MATERIALS, config.material);
  elements.materialBadge.textContent = material.label;
  elements.grain.setAttribute("opacity", config.material === "colombiano" ? ".2" : ".09");
  elements.piping.style.stroke = findById(PIPING_COLORS, config.piping).hex;

  paintEmbroidery(config.embroidery);
}

function setDetailsOpen(open) {
  elements.zoneChipHost.classList.toggle("show-details", open);
  elements.detailToggle.setAttribute("aria-expanded", String(open));
  elements.detailToggle.textContent = elements.detailLabel(open);
}

// Desliza la fila de zonas sin mover la página, para que el chip activo se vea
// también cuando la zona se eligió tocando el dibujo.
function revealChip(chip) {
  const host = elements.zoneChipHost;
  if (host.scrollWidth <= host.clientWidth) return;
  const left = chip.offsetLeft - host.offsetLeft;
  const right = left + chip.offsetWidth;
  if (left < host.scrollLeft) host.scrollTo({ left: left - 8, behavior: "smooth" });
  else if (right > host.scrollLeft + host.clientWidth) host.scrollTo({ left: right - host.clientWidth + 8, behavior: "smooth" });
}

function preparePattern(pattern, partId, stitch) {
  const source = document.getElementById(pattern.svgId);
  const cloneId = `${pattern.svgId}-${partId}`;
  let clone = document.getElementById(cloneId);

  if (!clone) {
    clone = source.cloneNode(true);
    clone.id = cloneId;
    source.parentNode.append(clone);
  }

  // En los patrones cosidos, la trama usa el hilo elegido para esa zona.
  // Perforado conserva puntos oscuros porque representa orificios, no hilo.
  if (pattern.id !== "perforado") {
    // `data-groove` es la hendidura oscura del acolchado: no toma el color del hilo.
    for (const line of clone.querySelectorAll("[stroke]:not([data-groove])")) line.setAttribute("stroke", stitch.hex);
  }

  return cloneId;
}

function paintEmbroidery(embroidery) {
  let text = "";
  if (embroidery.type === "forros-cuenca") text = "FORROS CUENCA";
  if (embroidery.type === "nombre") text = embroidery.text.trim() || "TU NOMBRE";
  if (embroidery.type === "logo") text = "LOGO";

  const preview = Array.from(text).slice(0, 20).join("");
  elements.embroideryPreview.textContent = preview;
  elements.embroideryPreview.style.display = preview ? "block" : "none";
  elements.embroideryPreview.setAttribute("font-size", preview.length > 14 ? "8" : "10");
}

function renderTabs(ui) {
  const activeTab = findById(TABS, ui.activeTab);
  const activePart = findById(PARTS, ui.activePart);

  for (const tab of elements.tabs) {
    const isActive = tab.dataset.tab === ui.activeTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  }

  elements.panel.setAttribute("aria-labelledby", `tab-${ui.activeTab}`);
  elements.tabContext.textContent = activeTab.scope === "global"
    ? "Esta opción se aplica a todo el asiento"
    : `Editando ${activeTab.label.toLowerCase()} de: ${activePart.label}`;
}

const OTHER = "__otro";
const vehicleUi = { custom: false };

// Reconoce «Marca Modelo» del catálogo; cualquier otro texto se edita en modo libre.
function parseVehicle(text) {
  const value = text.trim();
  if (!value) return { brand: null, model: null };
  const brand = [...VEHICLE_BRANDS].sort((a, b) => b.brand.length - a.brand.length)
    .find((item) => value === item.brand || value.startsWith(`${item.brand} `));
  if (!brand) return { brand: null, model: null, unknown: true };
  const rest = value.slice(brand.brand.length).trim();
  const model = brand.models.find((item) => item.name === rest) ?? null;
  return { brand, model, unknown: Boolean(rest) && !model };
}

function setOptions(select, options, value) {
  const html = options.map(([optionValue, label]) => `<option value="${optionValue}">${label}</option>`).join("");
  if (select.dataset.options !== html) {
    select.innerHTML = html;
    select.dataset.options = html;
  }
  select.value = value;
}

function renderVehicleFields(vehicle) {
  const parsed = parseVehicle(vehicle.model);
  if (parsed.unknown) vehicleUi.custom = true;
  const custom = vehicleUi.custom;

  for (const wrap of elements.vehicleSelectWraps) wrap.hidden = custom;
  for (const wrap of elements.vehicleCustom) wrap.hidden = !custom;
  elements.vehicleBrand.value = custom && !parsed.brand ? OTHER : parsed.brand?.brand ?? "";

  const brand = parsed.brand ?? findBrand(elements.vehicleBrand.value);
  setOptions(elements.vehicleModel, brand
    ? [["", "Elige el modelo"], ...brand.models.map((item) => [item.name, `${item.name} · ${item.type}`]), [OTHER, "Otro modelo"]]
    : [["", "Primero elige la marca"]], custom ? OTHER : parsed.model?.name ?? "");
  elements.vehicleModel.disabled = !brand;

  const years = parsed.model ? modelYears(parsed.model) : [];
  setOptions(elements.vehicleYear, parsed.model
    ? [["", "Elige el año"], ...years.map((year) => [year, year])]
    : [["", "Primero elige el modelo"]], years.includes(vehicle.year) ? vehicle.year : "");
  elements.vehicleYear.disabled = !parsed.model;

  for (const input of elements.vehicleFields) {
    const value = vehicle[input.dataset.vehicleField] ?? "";
    if (input.value !== value && document.activeElement !== input) input.value = value;
  }
}

function renderQuoteLabel() {
  const price = String(PRECIO_DESDE ?? "").trim();
  elements.mobileQuoteButton.textContent = price
    ? `Cotizar en WhatsApp · Desde $${price}`
    : "Cotizar en WhatsApp";
}

function renderControls(config, ui) {
  const zone = config.zones[ui.activePart];

  if (ui.activeTab === "color") {
    elements.panel.innerHTML = `
      ${renderPresets(config)}
      <fieldset class="choice-group">
        <legend>Color de la zona seleccionada</legend>
        <div class="color-grid">
          ${COLORS.map((color) => `
            <button class="color-option" type="button" data-field="color" data-value="${color.id}"
              aria-label="Color ${color.label}" aria-pressed="${zone.color === color.id}"
              style="--swatch:${color.hex}">${color.label}</button>
          `).join("")}
        </div>
      </fieldset>`;
    return;
  }

  if (ui.activeTab === "pattern") {
    elements.panel.innerHTML = `
      <fieldset class="choice-group">
        <legend>Tipo de patrón</legend>
        <div class="pattern-grid">
          ${PATTERNS.map((pattern) => `
            <button class="pattern-option" type="button" data-field="pattern" data-value="${pattern.id}"
              aria-pressed="${zone.pattern === pattern.id}">
              <span class="pattern-sample ${pattern.previewClass}" aria-hidden="true"></span>${pattern.label}
            </button>
          `).join("")}
        </div>
      </fieldset>`;
    return;
  }

  if (ui.activeTab === "stitch") {
    elements.panel.innerHTML = `
      <fieldset class="choice-group">
        <legend>Color de costura</legend>
        <div class="stitch-grid">
          ${STITCH_COLORS.map((stitch) => `
            <button class="stitch-option" type="button" data-field="stitch" data-value="${stitch.id}"
              aria-label="Costura ${stitch.label}" aria-pressed="${zone.stitch === stitch.id}"
              style="--stitch:${stitch.hex}">
              <span class="stitch-line" aria-hidden="true"></span>${stitch.label}
            </button>
          `).join("")}
        </div>
      </fieldset>`;
    return;
  }

  if (ui.activeTab === "piping") {
    elements.panel.innerHTML = `
      <fieldset class="choice-group">
        <legend>Color del vivo para todo el asiento</legend>
        <div class="color-grid">
          ${PIPING_COLORS.map((piping) => `
            <button class="color-option" type="button" data-field="piping" data-value="${piping.id}"
              aria-label="Vivo ${piping.label}" aria-pressed="${config.piping === piping.id}"
              style="--swatch:${piping.hex}">${piping.label}</button>
          `).join("")}
        </div>
      </fieldset>`;
    return;
  }

  if (ui.activeTab === "material") {
    elements.panel.innerHTML = `
      <fieldset class="choice-group">
        <legend>Material para todo el asiento</legend>
        <div class="cards-grid">
          ${MATERIALS.map((material) => `
            <button class="card-option" type="button" data-field="material" data-value="${material.id}"
              aria-pressed="${config.material === material.id}">
              <strong>${material.label}</strong><small>${material.description}</small>
            </button>
          `).join("")}
        </div>
      </fieldset>`;
    return;
  }

  elements.panel.innerHTML = `
    <fieldset class="choice-group">
      <legend>Bordado para el asiento</legend>
      <div class="cards-grid">
        ${EMBROIDERIES.map((embroidery) => `
          <button class="card-option" type="button" data-field="embroidery" data-value="${embroidery.id}"
            aria-pressed="${config.embroidery.type === embroidery.id}">
            <strong>${embroidery.label}</strong>
          </button>
        `).join("")}
      </div>
      ${renderEmbroideryField(config.embroidery)}
    </fieldset>`;

  const input = elements.panel.querySelector("[data-embroidery-text]");
  if (input) input.value = config.embroidery.text;
}

function renderPresets(config) {
  return `
    <section class="preset-section" aria-labelledby="presets-title">
      <div class="preset-heading">
        <strong id="presets-title">Empieza con un diseño</strong>
        <small>Aplica el asiento completo en un toque</small>
      </div>
      <div class="preset-scroll">
        ${PRESETS.map((preset) => `
          <button class="preset-card" type="button" data-preset="${preset.id}"
            aria-pressed="${matchesPreset(config, preset)}">
            <span class="preset-swatches" aria-hidden="true">${presetSwatches(preset)}</span>
            <strong>${preset.label}</strong>
            <small>${preset.description}</small>
          </button>
        `).join("")}
      </div>
    </section>`;
}

function presetSwatches(preset) {
  const colorIds = [...new Set(PARTS.map((part) => preset.config.zones[part.id].color))];
  return colorIds.map((colorId) => {
    const color = findById(COLORS, colorId);
    return `<i style="--preset-color:${color.hex}" title="${color.label}"></i>`;
  }).join("");
}

function matchesPreset(config, preset) {
  if (config.piping !== preset.config.piping) return false;
  if (config.material !== preset.config.material) return false;
  if (config.embroidery.type !== preset.config.embroidery.type) return false;
  if (config.embroidery.text !== preset.config.embroidery.text) return false;

  return PARTS.every((part) => {
    const current = config.zones[part.id];
    const expected = preset.config.zones[part.id];
    return current.color === expected.color
      && current.pattern === expected.pattern
      && current.stitch === expected.stitch;
  });
}

function renderEmbroideryField(embroidery) {
  if (embroidery.type !== "nombre" && embroidery.type !== "logo") return "";

  const isName = embroidery.type === "nombre";
  return `
    <div class="field-wrap">
      <label for="embroidery-text">${isName ? "Nombre que deseas bordar" : "Descripción del logo"}</label>
      <input id="embroidery-text" data-embroidery-text type="text" maxlength="80"
        autocomplete="off" placeholder="${isName ? "Ej.: María" : "Ej.: Iniciales JM con una corona"}">
      <p class="field-help">${isName ? "Así aparecerá en el resumen y la cotización." : "El equipo confirmará por WhatsApp si necesita que envíes el archivo del logo."}</p>
    </div>`;
}

function renderSummary(config) {
  elements.summary.replaceChildren();

  const vehicle = [config.vehicle.model.trim(), config.vehicle.year.trim()].filter(Boolean).join(" · ");
  elements.summary.append(createSummaryRow("Vehículo", vehicle || "Por completar"));

  for (const part of PARTS) {
    const zone = config.zones[part.id];
    const detail = [
      findById(COLORS, zone.color).label,
      findById(PATTERNS, zone.pattern).label,
      `costura ${findById(STITCH_COLORS, zone.stitch).label.toLowerCase()}`,
    ].join(" · ");
    elements.summary.append(createSummaryRow(part.label, detail));
  }

  elements.summary.append(
    createSummaryRow("Vivo de contraste", findById(PIPING_COLORS, config.piping).label),
    createSummaryRow("Material", findById(MATERIALS, config.material).label),
  );

  const embroidery = findById(EMBROIDERIES, config.embroidery.type);
  const embroideryDetail = config.embroidery.text.trim()
    ? `${embroidery.label}: ${config.embroidery.text.trim()}`
    : embroidery.label;
  elements.summary.append(createSummaryRow("Bordado", embroideryDetail));
}

function createSummaryRow(label, value) {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const detail = document.createElement("dd");
  row.className = "summary-row";
  term.textContent = label;
  detail.textContent = value;
  row.append(term, detail);
  return row;
}

export async function exportDesignPng() {
  const source = document.querySelector("#seat");
  const clone = source.cloneNode(true);
  const namespace = "http://www.w3.org/2000/svg";
  const [viewX, viewY, viewWidth, viewHeight] = source.getAttribute("viewBox").split(/\s+/u).map(Number);
  clone.setAttribute("xmlns", namespace);
  clone.setAttribute("width", String(viewWidth));
  clone.setAttribute("height", String(viewHeight));

  clone.querySelector(".zone-numbers")?.remove();
  for (const zone of clone.querySelectorAll(".zone")) {
    zone.classList.remove("is-active");
    zone.removeAttribute("role");
    zone.removeAttribute("tabindex");
    zone.removeAttribute("aria-label");
    zone.removeAttribute("aria-pressed");
    zone.setAttribute("stroke", "#ffffff");
    zone.setAttribute("stroke-opacity", ".08");
    zone.setAttribute("stroke-width", "1.2");
    zone.setAttribute("stroke-dasharray", "none");
    zone.setAttribute("stroke-linecap", "round");
  }

  for (const seam of clone.querySelectorAll(".seam")) {
    seam.setAttribute("fill", "none");
    const isChannelStitch = seam.classList.contains("channel-stitch");
    seam.setAttribute("stroke-width", isChannelStitch ? ".38" : ".75");
    seam.setAttribute("stroke-dasharray", isChannelStitch ? ".9 4.8" : ".6 4.2");
    if (isChannelStitch) seam.setAttribute("opacity", ".24");
    seam.setAttribute("stroke-linecap", "round");
  }

  const grain = clone.querySelector("#grain-overlay");
  if (grain) grain.style.mixBlendMode = "overlay";

  const embroidery = clone.querySelector("#embroidery-preview");
  if (embroidery) {
    embroidery.setAttribute("fill", "#fff");
    embroidery.setAttribute("stroke", "#111");
    embroidery.setAttribute("stroke-width", "3");
    embroidery.setAttribute("paint-order", "stroke");
    embroidery.setAttribute("font-family", "Poppins, Arial, sans-serif");
    embroidery.setAttribute("font-weight", "700");
  }

  const background = document.createElementNS(namespace, "rect");
  background.setAttribute("x", String(viewX));
  background.setAttribute("y", String(viewY));
  background.setAttribute("width", String(viewWidth));
  background.setAttribute("height", String(viewHeight));
  background.setAttribute("fill", "#0b0c0f");
  const definitions = clone.querySelector("defs");
  definitions.parentNode.insertBefore(background, definitions.nextSibling);

  const serialized = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement("canvas");
    canvas.width = viewWidth * 2;
    canvas.height = viewHeight * 2;
    const context = canvas.getContext("2d");
    context.fillStyle = "#0b0c0f";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pngBlob = await canvasToBlob(canvas);
    return offerDesignPng(pngBlob);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo convertir el diseño"));
    image.src = url;
  });
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    if (canvas.toBlob) {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo crear el PNG")), "image/png");
      return;
    }

    try {
      const [metadata, data] = canvas.toDataURL("image/png").split(",");
      const mime = metadata.match(/:(.*?);/u)?.[1] ?? "image/png";
      const bytes = Uint8Array.from(atob(data), (character) => character.charCodeAt(0));
      resolve(new Blob([bytes], { type: mime }));
    } catch (error) {
      reject(error);
    }
  });
}

export async function offerDesignPng(blob) {
  const fileName = `forros-cuenca-diseno-${new Date().toISOString().slice(0, 10)}.png`;

  if (typeof File === "function" && navigator.share && navigator.canShare) {
    const file = new File([blob], fileName, { type: "image/png" });
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Mi diseño de Forros Cuenca" });
        return "shared";
      }
    } catch (error) {
      if (error.name === "AbortError") return "cancelled";
    }
  }

  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 30000);
  return "downloaded";
}

export function announce(message) {
  elements.announcer.textContent = "";
  window.setTimeout(() => {
    elements.announcer.textContent = message;
  }, 20);
}

export function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2800);
}
