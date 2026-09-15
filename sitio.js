/* ══════════════════════════════════════════════════════════════════════════
   FORROS CUENCA — lógica del sitio
   Sin dependencias, sin build. Todo el catálogo es DATO: para añadir un juego,
   un modelo o un color basta con una entrada en las tablas de abajo.

   OJO: este sitio es una VITRINA. No hay configurador, no hay estado que
   guardar, no hay enlace codificado. Si alguien vuelve a añadir un editor,
   que sea en otra página: aquí el cliente reconoce, no diseña.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  document.documentElement.dataset.listo = '1';   /* desarma la red de seguridad del <head> */

  /* ── DATOS ────────────────────────────────────────────────────────────── */

  /* ═══════════════════════════════════════════════════════════════════════
     LOS DISEÑOS 01 AL 07 — fotografiados en estudio.

     >>> AQUÍ SE CAMBIAN LOS PRECIOS. <<<
     'precio' es el número que sale en la tarjeta, en dólares. Hoy los quince
     están en 110 porque es el precio desde el que arranca cualquier juego de
     forros: cambia el de cada diseño por el tuyo y listo. Los del 08 al 15
     están en index.html, en la sección "Más diseños del taller".

     La numeración es CORRIDA del 01 al 15 en todo el sitio, a propósito: si un
     cliente escribe "quiero el 12", tiene que haber un solo 12.
     La primera foto de la lista es la portada.
     ═══════════════════════════════════════════════════════════════════════ */
  var DISENOS = [
    { id: 'negro', num: '01', precio: 110, det: 'Cuero negro · ondas y costura blanca', tono: '#312e2f',
      desc: 'Cuero negro con paneles en ondas y costura blanca. El contraste de la costura es lo que dibuja el relieve.',
      fotos: [
        ['muestra-negro-showroom', 'Diseño 01: juego de forros en cuero negro con acolchado de ondas y costura blanca'],
        ['muestra-negro-ondas', 'Diseño 01 visto de lado, con las ondas del respaldo y del cojín'],
        ['muestra-negro-cueros', 'Diseño 01 junto al muestrario de cueros de colores del taller'],
        ['muestra-detalle-ondas', 'Detalle del acolchado en ondas con costura clara sobre cuero negro'],
        ['muestra-detalle-costura', 'Detalle de la costura y los paneles en cuero negro combinado con gris'],
        ['muestra-detalle-canaletas', 'Primer plano de las canaletas cosidas del cojín en cuero negro']
      ] },
    { id: 'verde', num: '02', precio: 110, det: 'Cuero verde · acolchado hexagonal', tono: '#2f3130',
      desc: 'Cuero verde con acolchado hexagonal y ribete texturizado en los costados.',
      fotos: [
        ['muestra-verde-showroom', 'Diseño 02: juego de forros en cuero verde oscuro con acolchado hexagonal'],
        ['muestra-verde-hexagonal', 'Diseño 02 de cerca, con el acolchado hexagonal del respaldo'],
        ['muestra-verde-panel', 'Detalle del acolchado hexagonal y del ribete texturizado en cuero verde']
      ] },
    { id: 'camel', num: '03', precio: 110, det: 'Cuero camel · acanalado vertical', tono: '#4b3a2d',
      desc: 'Cuero camel con acanalado vertical y el logo bordado en el respaldo.',
      fotos: [
        ['muestra-camel-hilux', 'Diseño 03: forros en cuero camel con acanalado vertical'],
        ['muestra-camel-acanalado', 'Primer plano del acanalado vertical en cuero camel']
      ] },
    { id: 'bicolor', num: '04', precio: 110, det: 'Bicolor blanco y negro · rombos', tono: '#353434',
      desc: 'Bicolor con rombos cosidos en el respaldo y los costados en blanco.',
      fotos: [
        ['muestra-blanco-negro', 'Diseño 04: forros bicolor blanco y negro con rombos cosidos en el respaldo'],
        ['muestra-rombos-blanco', 'Detalle de los rombos cosidos en el respaldo bicolor']
      ] },
    { id: 'gris', num: '05', precio: 110, det: 'Cuero gris · liso con costura al tono', tono: '#363638',
      desc: 'Cuero gris pizarra con costura al tono, liso y sobrio.',
      fotos: [
        ['muestra-gris-dmax', 'Diseño 05: forros en cuero gris pizarra'],
        ['muestra-gris-panel', 'Detalle del cojín en cuero gris pizarra con costura al tono']
      ] },
    { id: 'azul', num: '06', precio: 110, det: 'Cuero azul marino · liso', tono: '#37383d',
      desc: 'Cuero azul marino liso, con costura al tono. Sobrio y de los que menos se ensucian.',
      fotos: [
        ['muestra-azul-marino', 'Diseño 06: forros en cuero azul marino lisos, con costura al tono'],
        ['muestra-azul-cojin', 'Diseño 06 visto de frente, con el muestrario al fondo']
      ] },
    { id: 'foton', num: '07', precio: 110, det: 'Gris y negro · vivo blanco y perforado', tono: '#363737',
      desc: 'Banca de furgoneta en dos tonos, con vivo blanco y perforado en los paneles del centro.',
      fotos: [
        ['muestra-banca-foton', 'Diseño 07: banca de furgoneta en cuero gris y negro con vivo blanco'],
        ['muestra-foton-vivo', 'Detalle del vivo blanco y el perforado en la banca gris y negra']
      ] }
  ];

  /* ── UTILIDADES ───────────────────────────────────────────────────────── */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── CATÁLOGO DE DISEÑOS ──────────────────────────────────────────────── */
  var WA = 'https://wa.me/593984353695?text=';
  function pedir(num) {
    return WA + encodeURIComponent('Hola, quiero el diseño ' + num + ' que vi en la página. ¿Me confirman el precio para mi vehículo?');
  }

  var cajaDisenos = $('#disenos');
  if (cajaDisenos) {
    cajaDisenos.innerHTML = DISENOS.map(function (d, i) {
      var p = d.fotos[0];
      return '<figure class="dis rev" style="--i:' + (i % 4) + '">' +
        '<button type="button" class="dis-foto" data-diseno="' + d.id + '" ' +
          'aria-label="Diseño ' + d.num + ': ver las ' + d.fotos.length + ' fotos">' +
          '<img src="fotos/' + p[0] + '-400.webp" srcset="fotos/' + p[0] + '-400.webp 400w, fotos/' + p[0] + '.webp 760w" ' +
               'sizes="(max-width:699px) 48vw, (max-width:1099px) 31vw, 300px" alt="' + esc(p[1]) + '" ' +
               'width="760" height="1013" loading="lazy" decoding="async" style="background:' + d.tono + '">' +
          '<span class="dis-velo"></span>' +
          '<span class="dis-marca">Diseño ' + d.num + '</span>' +
          '<span class="dis-fotos">' + d.fotos.length + ' fotos</span>' +
        '</button>' +
        '<figcaption class="dis-ficha">' +
          '<p class="dis-det">' + esc(d.det) + '</p>' +
          '<p class="dis-precio"><i>desde</i><span>$' + d.precio + '</span></p>' +
          '<a class="dis-cta" href="' + pedir(d.num) + '" target="_blank" rel="noopener">Quiero este diseño</a>' +
        '</figcaption>' +
      '</figure>';
    }).join('') +
    '<figure class="dis-otro rev">' +
      '<h3>¿Quieres otro color?</h3>' +
      '<p>Cualquiera de los quince diseños se hace en los doce cueros de la carta y con el hilo que elijas.</p>' +
      '<a class="enlace-sub" href="' + WA + encodeURIComponent('Hola, quiero un juego de forros en otro color. ¿Me ayudan?') + '" target="_blank" rel="noopener">Cuéntanos cómo lo quieres</a>' +
    '</figure>';
  }

  /* Los colores, los hilos, los acabados y el archivo del taller son HTML
     estático en index.html: no llevan interacción, así que no hay razón para
     que dependan del JavaScript. Se indexan mejor y se ven aunque esto falle. */

  /* ── BARRA: fondo sólido y menú de móvil ──────────────────────────────── */
  var barra = $('#barra');
  var nav = $('#nav');
  var ham = $('#hamburguesa');

  function alScroll() {
    if (barra) barra.classList.toggle('solida', window.scrollY > 80);
  }
  alScroll();
  window.addEventListener('scroll', alScroll, { passive: true });

  if (ham && nav) {
    ham.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      ham.setAttribute('aria-expanded', String(abierto));
      ham.setAttribute('aria-label', abierto ? 'Cerrar el menú' : 'Abrir el menú');
      document.body.classList.toggle('menu-abierto', abierto);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      nav.classList.remove('abierto');
      ham.setAttribute('aria-expanded', 'false');
      ham.setAttribute('aria-label', 'Abrir el menú');
      document.body.classList.remove('menu-abierto');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('abierto')) ham.click();
    });
  }

  /* ── SECCIÓN ACTUAL EN LA NAVEGACIÓN ──────────────────────────────────── */
  var enlacesNav = [].slice.call(document.querySelectorAll('.nav a'));
  var destinos = enlacesNav.map(function (a) { return document.querySelector(a.getAttribute('href')); });

  if ('IntersectionObserver' in window) {
    var vistaActual = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = destinos.indexOf(e.target);
        if (i < 0) return;
        enlacesNav.forEach(function (a, n) { a.classList.toggle('aqui', n === i); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    destinos.forEach(function (d) { if (d) vistaActual.observe(d); });
  }

  /* ── REVELADOS ────────────────────────────────────────────────────────── */
  var revelables = [].slice.call(document.querySelectorAll('.rev'));
  if (!('IntersectionObserver' in window) || menosMovimiento.matches) {
    revelables.forEach(function (el) { el.classList.add('visto'); });
  } else {
    var ojo = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visto');
        obs.unobserve(e.target);     /* lo que se reveló, se queda revelado */
      });
    }, { rootMargin: '0px 0px -12%', threshold: 0.15 });
    revelables.forEach(function (el) { ojo.observe(el); });

    /* Red de seguridad: si algo impide que el observador dispare (un
       navegador raro, una pestaña en segundo plano), a los 3 segundos se
       revela todo. Nunca se queda contenido invisible. */
    setTimeout(function () {
      revelables.forEach(function (el) { el.classList.add('visto'); });
    }, 3000);
  }

  /* ── PARALLAX DE LA VITRINA ───────────────────────────────────────────────
     Solo en escritorio, con rAF y bandera de ticking: sin esto, en un Android
     de gama media el scroll se entrecorta de forma visible. Tope 40px. */
  var vitrina = $('#vitrina');
  var anchoGrande = window.matchMedia('(min-width: 900px)');
  if (vitrina && !menosMovimiento.matches && anchoGrande.matches) {
    var pendiente = false;
    window.addEventListener('scroll', function () {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        vitrina.style.transform = 'translate3d(0,' + (-y * 0.045).toFixed(2) + 'px,0)';
        pendiente = false;
      });
    }, { passive: true });
  }

  /* ── VISOR DE FOTOS ───────────────────────────────────────────────────────
     Carrusel con scroll-snap: el desplazamiento lo lleva el navegador, así el
     arrastre con el dedo trae inercia de verdad. EL SCROLL ES LA ÚNICA FUENTE
     DE VERDAD: ver() solo pide el sitio y marcar() lee el estado. Flecha,
     teclado y dedo acaban siempre en el mismo sitio. */
  var visor = $('#visor');
  var marco = $('#visorMarco');
  var visorTit = $('#visorTit');
  var visorEt = $('#visorEt');
  var visorTxt = $('#visorTxt');
  var btnAnt = $('#visorAnt');
  var btnSig = $('#visorSig');
  var btnX = $('#visorX');
  var visorPedir = $('#visorPedir');
  var disActual = null;
  var indice = 0;

  function abrirDiseno(id) {
    var j = null;
    for (var k = 0; k < DISENOS.length; k++) if (DISENOS[k].id === id) j = DISENOS[k];
    if (!j || !visor || !visor.showModal) return;

    disActual = j;
    indice = 0;
    visorEt.textContent = j.det;
    visorTit.textContent = 'Diseño ' + j.num;
    visorPedir.href = pedir(j.num);
    marco.innerHTML = j.fotos.map(function (f) {
      return '<figure><img src="fotos/' + f[0] + '.webp" alt="' + esc(f[1]) + '" ' +
        'width="760" height="1013" decoding="async" style="background:' + j.tono + '"></figure>';
    }).join('');

    var varias = j.fotos.length > 1;
    btnAnt.hidden = btnSig.hidden = !varias;
    marco.scrollLeft = 0;
    visor.showModal();
    marcar();
  }

  function marcar() {
    if (!disActual) return;
    var ancho = marco.clientWidth || 1;
    indice = Math.round(marco.scrollLeft / ancho);
    indice = Math.max(0, Math.min(indice, disActual.fotos.length - 1));
    var total = disActual.fotos.length;
    visorTxt.textContent = total > 1
      ? (indice + 1) + ' de ' + total + ' — ' + disActual.desc
      : disActual.desc;
    /* las flechas no dan la vuelta: con el dedo tampoco se vuelve de la
       última a la primera, y dos comportamientos distintos confunden */
    btnAnt.disabled = indice === 0;
    btnSig.disabled = indice === total - 1;
  }

  function ver(i) {
    if (!disActual) return;
    var destino = marco.children[Math.max(0, Math.min(i, disActual.fotos.length - 1))];
    if (destino) destino.scrollIntoView({ behavior: menosMovimiento.matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }

  if (visor) {
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-diseno]') : null;
      if (b) abrirDiseno(b.getAttribute('data-diseno'));
    });

    var tiempoScroll;
    marco.addEventListener('scroll', function () {
      clearTimeout(tiempoScroll);
      tiempoScroll = setTimeout(marcar, 60);
    }, { passive: true });

    btnAnt.addEventListener('click', function () { ver(indice - 1); });
    btnSig.addEventListener('click', function () { ver(indice + 1); });
    btnX.addEventListener('click', function () { visor.close(); });

    visor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); ver(indice - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); ver(indice + 1); }
    });

    /* clic en el velo del <dialog> = cerrar */
    visor.addEventListener('click', function (e) {
      if (e.target === visor) visor.close();
    });
    visor.addEventListener('close', function () { disActual = null; });
  }

  /* ── AÑO DEL PIE ──────────────────────────────────────────────────────── */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
