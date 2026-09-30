// Carrusel de la portada: un solo asiento que va cambiando de forro con un fundido.
// Los diseños están en el HTML (.hero-slide); este módulo solo alterna cuál se ve.
const carousel = document.querySelector("[data-hero-carousel]");
const INTERVAL = 4500;

if (carousel) {
  const slides = [...carousel.querySelectorAll(".hero-slide")];
  const dotHost = document.querySelector("[data-hero-dots]");
  const caption = document.querySelector("[data-hero-caption]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let timer = null;

  const dots = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero-dot";
    dot.setAttribute("aria-label", `Ver forro ${slide.dataset.name}`);
    dot.addEventListener("click", () => {
      show(index);
      restart();
    });
    dotHost?.append(dot);
    return dot;
  });

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle("is-active", active);
      if (active && slide.loading === "lazy") slide.loading = "eager";
    });
    dots.forEach((dot, i) => dot.setAttribute("aria-pressed", String(i === current)));
    if (caption) caption.textContent = slides[current].dataset.name;
    // Precarga el siguiente para que el fundido no muestre un hueco.
    const next = slides[(current + 1) % slides.length];
    if (next.loading === "lazy") next.loading = "eager";
  }

  function restart() {
    window.clearInterval(timer);
    if (keyboardFocus || reduceMotion.matches || document.hidden || slides.length < 2) return;
    timer = window.setInterval(() => show(current + 1), INTERVAL);
  }

  // Pausa mientras se navega por los puntos con el teclado (no afecta al mouse).
  let keyboardFocus = false;
  dotHost?.addEventListener("focusin", (event) => {
    keyboardFocus = event.target.matches(":focus-visible");
    if (keyboardFocus) window.clearInterval(timer);
  });
  dotHost?.addEventListener("focusout", () => {
    if (keyboardFocus) {
      keyboardFocus = false;
      restart();
    }
  });

  document.addEventListener("visibilitychange", restart);
  reduceMotion.addEventListener?.("change", restart);
  show(0);
  restart();
}
