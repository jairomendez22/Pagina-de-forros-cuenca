/* ============================================================
   F0 — Fundacion:  un producto = una entrada en PRODUCTS.
   F2 — Catalogo como datos: colores, patrones, materiales,
        reglas de incompatibilidad y precios "desde".
   Los <defs> viven en #fx, que NUNCA lleva display:none:
   en Blink un paint server dentro de display:none no resuelve.
   ============================================================ */

const NEGOCIO = { tel:'0984353695', wa:'593984353695', ig:'FORROSCUENCA' };

/* ############################################################
   ANALITICA — para saber cuanta gente disena y cuanta te escribe.

   Ahora mismo no envia nada a ninguna parte: los eventos quedan
   registrados y listos. Cuando contrates un servicio de analitica
   (Plausible o Umami son los mas simples y no usan cookies, asi que
   no necesitas cartel de cookies), pegas su script en el <head> y
   esto empieza a reportar solo, sin tocar nada mas.

   Para revisar los eventos mientras tanto: abre la consola del
   navegador y escribe  __eventos
   ############################################################ */
window.__eventos = [];
function track(evento, datos){
  const d = Object.assign({ producto: (typeof productId!=='undefined' ? productId : null) }, datos||{});
  window.__eventos.push({ evento, datos:d, t:Date.now() });
  try{
    if(typeof window.plausible === 'function') window.plausible(evento, {props:d});
    if(window.umami && typeof window.umami.track === 'function') window.umami.track(evento, d);
    if(Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({event:evento}, d));
    if(typeof window.gtag === 'function') window.gtag('event', evento, d);
  }catch(e){}
}

/* --- CATALOGO. Los 14 colores que realmente maneja el taller. --- */
/* ############################################################
   #  COLORES                                                  #
   #                                                           #
   #  Tercer valor: true = lo tienes en stock                  #
   #                false = lo haces bajo pedido               #
   #                                                           #
   #  PARA AGREGAR UN COLOR NUEVO: ponlo SIEMPRE AL FINAL      #
   #  de la lista. Nunca en medio. El enlace para compartir un  #
   #  diseño guarda cada color por su POSICIÓN, así que meter   #
   #  uno en medio corre todos los demás y los enlaces que ya   #
   #  circulan abren un diseño equivocado.                     #
   ############################################################ */
const COLORS=[
  /* --- en stock, con muestra fotografiada --- */
  ['Negro',       '#111214', true],
  ['Gris',        '#85878a', true],
  ['Gris claro',  '#a9abae', true],
  ['Gris oscuro', '#4d4f53', true],
  ['Beige',       '#cdbb9b', true],
  ['Café',        '#70462e', true],
  /* --- bajo pedido: los hace, pero no son de stock --- */
  ['Blanco',      '#e9e9e6', false],
  ['Vino',        '#641c2a', false],
  ['Rojo',        '#c71d28', false],
  ['Verde',       '#145a42', false],
  ['Azul',        '#164f9d', false],
  ['Turquesa',    '#1594a6', false]
];
const enStock = n => (COLORS.find(c=>c[0]===n)||[])[2] === true;

/* Solo los patrones que el taller hace de verdad. */
const PATTERNS={
  Liso:            {svg:null,       cls:''},
  Rombos:          {svg:'pDiamond', cls:'diamond'},
  Puntos:          {svg:'pDots',    cls:'dots'},
  Microperforado:  {svg:'pMicro',   cls:'micro'},
  Hexagonal:       {svg:'pHex',     cls:'hex'},
  'Chevrón':       {svg:'pChevron', cls:'chevronp'},
  Canaletas:       {svg:'pCanal',   cls:'canal'}
};

const STITCHES=[['Roja','#e50914'],['Blanca','#fff'],['Negra','#111'],['Azul','#2776db'],['Beige','#d7b986'],['Turquesa','#1594a6'],['Gris','#9a9ba0']];

/* ############################################################
   #  MATERIALES POR FAMILIA                                    #
   #                                                            #
   #  Cada producto usa su propia familia: el cuero de forro no  #
   #  es el de tablero, y el techo lleva un material aparte.     #
   #                                                            #
   #  recargo = cuánto SUMA sobre el precio "desde" del producto.#
   #  grano   = qué tan marcada se ve la textura en el dibujo.   #
   #                                                            #
   #  REVISA las descripciones: las escribí a partir de tus      #
   #  muestrarios, pero tú sabes mejor cómo vender cada uno.     #
   ############################################################ */
const MATERIALES = {
  forro: [
    {name:'Cuero Colombiano', recargo:0,   grano:'.48', desc:'Cuero nacional de textura firme y grano marcado, excelente relación calidad-precio.'},
    {name:'Cuero Americano',  recargo:100, grano:'.12', desc:'Importado, acabado suave y uniforme, alto brillo y gran durabilidad.'}
  ],
  tablero: [
    {name:'Felpa',            recargo:0,  grano:'.62', desc:'Felpa de pelo corto, suave al tacto y sin reflejos sobre el parabrisas.'},
    {name:'Malla',            recargo:5,  grano:'.50', desc:'Malla tejida, fresca y firme, que no se levanta con el calor.'},
    {name:'Cuero de tablero', recargo:10, grano:'.30', desc:'Cuero específico para tablero, pensado para aguantar sol y calor sin cuartearse.'}
  ],
  techo: [
    {name:'Tela de techo', recargo:0, grano:'.40', desc:'Tela tejida propia para cielo raso: liviana y que no se descuelga con el calor.'}
  ],
  piso: [
    {name:'Cuero para piso', recargo:0, grano:'.55', desc:'Cuero grueso de grano marcado, hecho para pisarlo todos los días.'}
  ]
};
const familia    = () => PRODUCTS[productId].familia;
const materiales = () => MATERIALES[familia()] || MATERIALES.forro;
const matDef     = n => materiales().find(m=>m.name===n) || materiales()[0];
/* el más barato de cada familia, para que el precio de apertura
   coincida siempre con el "desde" anunciado */
const matPorDefecto = fam =>
  MATERIALES[fam].slice().sort((a,b)=>a.recargo-b.recargo)[0].name;

const EMB=[
  {t:'Sin bordado',        precio:0},
  {t:'FORROS CUENCA',      precio:5, tam:'grande'},
  {t:'Nombre del cliente', precio:2, tam:'pequeno', pideTexto:true},
  {t:'Logo personalizado', precio:5, tam:'grande',  pideTexto:true},
  {t:'Logo de mi vehículo', precio:5, tam:'grande',  pideTexto:true}
];

/* ############################################################
   #                                                          #
   #   PRECIOS  —  ESTA ES LA UNICA PARTE QUE TU EDITAS.      #
   #                                                          #
   #   Cambia los numeros de abajo y guarda el archivo.        #
   #   No toques nada mas: ni las comas, ni las comillas.      #
   #                                                          #
   #   'desde' = el precio MAS BARATO al que haces ese         #
   #   producto. Es el que ve el cliente como "Desde $X".      #
   #   Pon  null  (sin comillas) si prefieres no publicarlo:   #
   #   la app dira "Precio a medida" en vez de inventar.       #
   #                                                          #
   ############################################################ */
const PRECIOS = {
  moneda: '$',

  desde: {
    auto:       110,   // <-- forro de asiento de auto
    tablero:     25,   // <-- forro de tablero (felpa; malla +$5, cuero +$10)

    /* Retirados del selector el 29 ago 2026: el configurador solo muestra
       Forros y Tablero. Los numeros se dejan aqui porque son precios que
       confirmo el dueno, y asi no hay que volver a preguntarlos si algun dia
       estos productos vuelven a la barra. No se consultan mientras no exista
       su entrada en PRODUCTS. */
    camioneta: null,   // sin precio publicado: se cotiza a medida
    techo:       60,
    pisos:      110
  },

  // El texto chico que aparece debajo del precio.
  nota: 'Precio referencial desde. Incluye instalación. No cobramos IVA (somos artesanos). Entrega en 1 a 2 días.'
};

/* ============================================================
   CATALOGO DE PRODUCTOS. Agregar uno = una entrada aqui + su svg.
   pending:true  -> declarado pero sin geometria todavia (F1).
   ============================================================ */
const PRODUCTS = {
  auto: {
    id:'auto', familia:'forro', usaDiseno:true, label:'Forros', wa:'juego de forros de asiento',
    parts:[
      {key:'back', label:'Frontal respaldo', num:1, rol:'centro',  zones:['back'],         labelAt:{x:310,y:300}},
      {key:'side', label:'Laterales',        num:2, rol:'lateral', zones:['side','sideR'], labelAt:{x:185,y:300}},
      {key:'base', label:'Centro base',      num:3, rol:'centro',  zones:['base'],         labelAt:{x:310,y:550}},
      {key:'head', label:'Cabecera',         num:4, rol:'lateral', zones:['head'],         labelAt:{x:310,y:120}},
      {key:'edge', label:'Bordes base',      num:5, rol:'lateral', zones:['edge'],         labelAt:{x:455,y:600}}
    ]
  },
  tablero: { id:'tablero', familia:'tablero', label:'Tablero', wa:'forro de tablero',
    parts:[ {key:'pieza', label:'Tablero', num:1, rol:'centro', zones:['pieza'], labelAt:{x:500,y:250}} ] }
};

/* ============================================================
   REGLAS DE INCOMPATIBILIDAD — datos, no ifs anidados.
   Cada veto lleva su motivo, y el motivo se le muestra al cliente.

   NO BORRAR ESTA MAQUINARIA AUNQUE PAREZCA MUERTA.
   Hoy no se dispara nunca, y es facil confundirlo con codigo muerto: la
   unica regla apunta a 'pisos', que esta pending:true, y setProduct
   rechaza los pendientes, asi que vetos() siempre devuelve vacio.
   Esta DORMIDA, no muerta. Comprobado en navegador el 24 ago 2026 que en
   cuanto pisos deje de estar pendiente las cuatro capas funcionan:
     · vetos()             devuelve la regla con su motivo
     · render()            pinta el boton disabled y el motivo en el title
     · setPart()           lo rechaza aunque se fuerce por consola
     · repararConflictos() arregla un diseno guardado que ya no vale
   ============================================================ */
const INCOMPATIBLES = [
  /* Esta regla apunta a 'pisos', que salio del selector el 29 ago 2026: queda
     inerte pero valida, y vuelve a aplicarse sola si el producto regresa. */
  { producto:'pisos', dim:'pattern', valor:'Puntos',
    motivo:'El perforado no se usa en pisos: deja pasar el agua y la tierra.' }
];

/* ############################################################
   #  MODELOS DE FORRO                                          #
   #                                                            #
   #  Cada uno es un DISENO distinto: cambia la arquitectura de  #
   #  paneles, no solo el color. Las fotos son de trabajos       #
   #  reales del taller.                                        #
   #                                                            #
   #  Para agregar uno nuevo: pon su foto en disenos/ (560x760   #
   #  y una de 280x380) y anade su entrada AL FINAL de la lista. #
   #  Nunca en medio: el enlace para compartir guarda el modelo   #
   #  por su posicion.                                          #
   ############################################################ */
const DISENOS = [
  {id:'capitone-rombos', nombre:'Capitone Rombos',      desc:'Rombos cosidos en el panel central del respaldo y del cojin. El clasico de la casa.'},
  {id:'franja-sparco',   nombre:'Franja Central',       desc:'Una franja ancha baja del cabezal y remata en lengueta sobre el cojin.'},
  {id:'costados-azules', nombre:'Deportivo Costados',   desc:'Alas laterales de color, vivos blancos y galones troquelados en el centro.'},
  {id:'sparco-racing',   nombre:'Sparco Racing',        desc:'Tipo butaca: cabezal integrado, bolsters en U y almohadillas escalonadas.'},
  {id:'alas-aveo',       nombre:'Alas Laterales',       desc:'Las alas cierran en V sobre el cabezal y encierran un panel central tipo escudo.'},
  {id:'barras-cuenca',   nombre:'Barras Cuenca',        desc:'Barras horizontales de contraste sobre el panel central, con bordado propio.'},
  {id:'coraza-bloques',  nombre:'Coraza de Bloques',    desc:'Respaldo alto en tres capas, con el escudo central dividido en bloques.'},
  {id:'acanalado',       nombre:'Acanalado Elegante',   desc:'Linea confort: cabezal ovalado suelto y acanalado vertical en el centro.'}
];
const disDef = id => DISENOS.find(d=>d.id===id) || DISENOS[0];

const SVGNS='http://www.w3.org/2000/svg';
const el = (prod, suffix) => document.getElementById(prod+'__'+suffix);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const colorHex  = n => (COLORS.find(c=>c[0]===n)||[])[1]||'#111';
const stitchHex = n => (STITCHES.find(s=>s[0]===n)||[])[1]||'#e50914';
const embDef    = t => EMB.find(e=>e.t===t) || EMB[0];
const buildable = () => Object.values(PRODUCTS).filter(p=>!p.pending);

/* --- vetos vigentes para el producto activo, por dimension --- */
function vetos(dim){
  const m = new Map();
  INCOMPATIBLES.forEach(r=>{
    if(r.dim===dim && r.producto===productId) m.set(r.valor, r.motivo);
  });
  return m;
}

/* --- estado anidado por producto, DERIVADO del catalogo --- */
const state = Object.fromEntries(Object.entries(PRODUCTS).map(([id,prod])=>[
  id, Object.fromEntries(prod.parts.map(x=>[x.key,{color:'Negro',pattern:'Liso',stitch:'Roja'}]))
]));

let productId = 'auto';
let activePart = PRODUCTS.auto.parts[0].key;
let tab = 'color';
/* Se recuerda la elección de cada familia por separado: si el cliente pone
   Cuero Americano en su auto y se va a ver el techo, al volver sigue ahí. */
let materialPorFamilia = Object.fromEntries(
  Object.keys(MATERIALES).map(f=>[f, matPorDefecto(f)]));
let material = materialPorFamilia.forro;
let embroidery = { type:'Sin bordado', text:'' };
let diseno = DISENOS[0].id;

const content  = document.getElementById('content');
const tabscope = document.getElementById('tabscope');

/* Lo que reparo el ultimo cambio de producto, pendiente de contarselo al
   cliente. render() lo pinta una vez y lo vacia. */
let ultimasReparaciones = [];

/* --- repara elecciones que quedaron vetadas al cambiar de producto --- */
function repararConflictos(){
  const reparados = [];
  ['pattern','color','stitch'].forEach(dim=>{
    const v = vetos(dim);
    if(!v.size) return;
    const fallback = dim==='pattern' ? 'Liso' : (dim==='color' ? 'Negro' : 'Roja');
    PRODUCTS[productId].parts.forEach(part=>{
      const s = state[productId][part.key];
      if(v.has(s[dim])){ reparados.push(`${part.label}: ${s[dim]} -> ${fallback}`); s[dim]=fallback; }
    });
  });
  return reparados;
}

function mountVehicleBar(){
  const bar = document.getElementById('vehiclebar');
  bar.innerHTML = Object.values(PRODUCTS).map(p=>
    `<button class="opt" data-prod="${esc(p.id)}"${p.pending?' data-pending="1"':''} style="padding:6px 16px;font-size:12px;border-radius:20px">${esc(p.label)}${p.pending?'<span class="soon">pronto</span>':''}</button>`
  ).join('');
}

/* La delegacion se engancha UNA sola vez, FUERA de mountVehicleBar. #vehiclebar
   es markup fijo y sobrevive al innerHTML, asi que no hace falta reengancharla.
   Si estuviera dentro, repintar la barra —justo lo que habra que hacer el dia
   que camioneta/techo/pisos dejen de estar pending:true— duplicaria el listener
   y cada clic dispararia setProduct dos veces. Mismo patron que #content. */
document.getElementById('vehiclebar').addEventListener('click', e=>{
  const b = e.target.closest('[data-prod]');
  if(!b) return;
  if(b.dataset.pending) hojaPendiente(PRODUCTS[b.dataset.prod]);
  else setProduct(b.dataset.prod);
});

function mountLabels(){
  buildable().forEach(prod=>{
    const g = el(prod.id,'labels');
    if(!g) return;
    g.replaceChildren(...prod.parts.map(part=>{
      const t = document.createElementNS(SVGNS,'text');
      t.setAttribute('class','label');
      t.setAttribute('x', part.labelAt.x);
      t.setAttribute('y', part.labelAt.y);
      t.textContent = part.num;
      return t;
    }));
  });
}

/* El grano se pintaba sobre TODO el lienzo, asi que la textura se veia
   tambien sobre el fondo. Se recorta a la union de las zonas: solo hay
   material donde hay asiento. */
function mountGrainClips(){
  buildable().forEach(prod=>{
    const svg = document.getElementById('svg-'+prod.id);
    const grain = el(prod.id,'grain');
    if(!svg || !grain) return;
    const cp = document.createElementNS(SVGNS,'clipPath');
    cp.setAttribute('id', prod.id+'__clip');
    prod.parts.forEach(part=>part.zones.forEach(z=>{
      const u = document.createElementNS(SVGNS,'use');
      u.setAttribute('href', '#'+prod.id+'__'+z);
      cp.appendChild(u);
    }));
    /* Un clipPath no pinta nada, asi que vale como hijo directo del <svg>.
       Antes esto decia (svg.querySelector('defs') || svg).insertBefore(...,
       svg.firstChild): si el SVG llegaba a tener un <defs>, se le pasaba a
       insertBefore un nodo de referencia que NO era hijo suyo, lanzaba
       NotFoundError y se moria el script entero. Hoy ninguno tiene <defs>,
       o sea que funcionaba de milagro. */
    svg.insertBefore(cp, svg.firstChild);
    grain.setAttribute('clip-path', 'url(#'+prod.id+'__clip)');
  });
}

/* ============================================================
   CAPA DE REALISMO

   Se dibuja encima del color y debajo de las costuras:
     · pillow  -> cada panel se hincha (elipse con degradado radial)
     · crown   -> la franja de luz del bolster
     · valle   -> la costura hunde el cuero: sombra oscura difusa
     · labio   -> y levanta un brillo fino en el lado iluminado

   Todo va recortado a su zona, asi que nada se sale del asiento.
   ============================================================ */
const RELIEVE = {
  auto: {
    // paneles que se hinchan: [zona, cx, cy, rx, ry, rotacion]
    pillows: [
      ['back', 310, 212,  62, 30, 0], ['back', 310, 276,  62, 22, 0],
      ['back', 310, 317,  62, 22, 0], ['back', 310, 358,  62, 22, 0],
      ['back', 310, 404,  62, 26, 0],
      ['base', 310, 448,  58, 20, 0], ['base', 310, 484,  58, 20, 0],
      ['base', 310, 519,  58, 20, 0], ['base', 310, 555,  54, 20, 0],
      ['base', 310, 591,  50, 20, 0], ['base', 310, 632,  46, 24, 0],
      ['head', 310, 118,  56, 46, 0],
      ['side', 212, 300,  32, 118, 0], ['sideR', 408, 300, 32, 118, 0],
      ['edge', 232, 545,  34, 100, 0], ['edge', 388, 545, 34, 100, 0],
      ['edge', 310, 648,  58, 22, 0]
    ],
    // coronas de los rollos laterales: [zona, x, y, w, h, gradiente]
    crowns: [
      ['side',  178, 186,  74, 240, 'crown-L'],
      ['sideR', 368, 186,  74, 240, 'crown-R'],
      ['edge',  198, 452,  62, 200, 'crown-L'],
      ['edge',  360, 452,  62, 200, 'crown-R']
    ]
  },
  tablero: {
    pillows: [['pieza', 480, 190, 300, 70, 0], ['pieza', 830, 220, 130, 50, 0]],
    crowns: []
  }
};

function mountRelieve(){
  buildable().forEach(prod=>{
    const cfg = RELIEVE[prod.id];
    const svg = document.getElementById('svg-'+prod.id);
    if(!cfg || !svg) return;

    /* un clip por zona, para que el relieve no se derrame */
    const zonas = new Set();
    prod.parts.forEach(p=>p.zones.forEach(z=>zonas.add(z)));
    zonas.forEach(z=>{
      const src = el(prod.id, z);
      if(!src) return;
      const cp = document.createElementNS(SVGNS,'clipPath');
      cp.setAttribute('id', prod.id+'__c-'+z);
      const u = document.createElementNS(SVGNS,'use');
      u.setAttribute('href', '#'+prod.id+'__'+z);
      cp.appendChild(u);
      svg.insertBefore(cp, svg.firstChild);
    });

    const capa = document.createElementNS(SVGNS,'g');
    capa.setAttribute('id', prod.id+'__relieve');
    capa.setAttribute('pointer-events','none');

    const grupo = z=>{
      const g = document.createElementNS(SVGNS,'g');
      g.setAttribute('clip-path','url(#'+prod.id+'__c-'+z+')');
      capa.appendChild(g);
      return g;
    };

    (cfg.pillows||[]).forEach(([z,cx,cy,rx,ry,rot])=>{
      const e = document.createElementNS(SVGNS,'ellipse');
      e.setAttribute('cx',cx); e.setAttribute('cy',cy);
      e.setAttribute('rx',(rx*1.34).toFixed(1)); e.setAttribute('ry',(ry*1.30).toFixed(1));
      e.setAttribute('fill','url(#pillow)');
      if(rot) e.setAttribute('transform',`rotate(${rot} ${cx} ${cy})`);
      grupo(z).appendChild(e);
    });

    (cfg.crowns||[]).forEach(([z,x,y,w,h,grad])=>{
      const r = document.createElementNS(SVGNS,'rect');
      r.setAttribute('x',x); r.setAttribute('y',y-60);
      r.setAttribute('width',w); r.setAttribute('height',h+120);
      r.setAttribute('fill',`url(#${grad})`);
      grupo(z).appendChild(r);
    });

    /* La capa va justo ANTES de las costuras, para que el hilo quede encima.
       Subimos hasta el hijo DIRECTO del <svg>: hoy todas las .seam lo son,
       pero si algun dia se envuelven en un <g>, insertBefore recibiria un
       nodo de referencia que no es hijo suyo y lanzaria NotFoundError, la
       misma trampa que ya se desactivo en mountGrainClips. */
    let ref = svg.querySelector('.seam');
    while(ref && ref.parentNode !== svg) ref = ref.parentNode;
    svg.insertBefore(capa, ref || null);
  });
}

/* La costura no se dibuja encima del cuero: lo hunde.
   Debajo del hilo va un valle oscuro y difuso; al lado iluminado,
   un labio fino de luz. Sin eso el pespunte parece una calcomania. */
function mountCosturaVolumen(){
  buildable().forEach(prod=>{
    const svg = document.getElementById('svg-'+prod.id);
    if(!svg) return;
    [...svg.querySelectorAll('.seam')].forEach(seam=>{
      const d = seam.getAttribute('d');
      const valle = document.createElementNS(SVGNS,'path');
      valle.setAttribute('d', d);
      valle.setAttribute('class','valle');
      valle.setAttribute('pointer-events','none');
      const labio = document.createElementNS(SVGNS,'path');
      labio.setAttribute('d', d);
      labio.setAttribute('class','labio');
      labio.setAttribute('pointer-events','none');
      seam.parentNode.insertBefore(valle, seam);
      seam.parentNode.insertBefore(labio, seam);
    });
  });
}

function mountZoneHandlers(){
  buildable().forEach(prod=>prod.parts.forEach(part=>part.zones.forEach(z=>{
    const zn = el(prod.id, z);
    if(!zn) return;
    /* Aqui no hay delegacion: se engancha zona por zona. La marca evita que
       volver a llamar a esta funcion enganche dos veces la misma zona y cada
       toque cuente doble. */
    if(zn.dataset.enganchada) return;
    zn.dataset.enganchada = '1';
    const elegir = ()=>{
      /* La pista ("toca una parte para cambiarle el color...") es una
         instruccion de una sola vez. En cuanto el cliente toca una zona ya la
         aprendio, y en movil esos 57 px valen mas como asiento. */
      document.body.classList.add('yatoco');
      toggleLimpio(false); activePart = part.key; render(); paint();
    };
    zn.setAttribute('role','button');
    zn.setAttribute('tabindex','0');
    zn.setAttribute('aria-label', `Personalizar ${part.label}`);
    zn.addEventListener('click', elegir);
    zn.addEventListener('keydown', e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); elegir(); }
    });
  })));
}

/* Un pulso corto al abrir: sin esto nadie descubre que el asiento es clicable,
   que es justo la diferencia frente a la competencia. */
function pulsarZonas(){
  const svg = document.getElementById('svg-'+productId);
  if(!svg) return;
  svg.classList.add('pulsar');
  setTimeout(()=>svg.classList.remove('pulsar'), 3600);
}

function setProduct(id){
  const prod = PRODUCTS[id];
  if(!prod || prod.pending) return;
  productId = id;
  Object.values(PRODUCTS).forEach(p=>{
    const svg = document.getElementById('svg-'+p.id);
    if(svg) svg.style.display = (p.id===id ? 'block' : 'none');
  });
  document.querySelectorAll('#vehiclebar [data-prod]')
    .forEach(b=>b.classList.toggle('active', b.dataset.prod===id));
  if(!prod.parts.some(p=>p.key===activePart)) activePart = prod.parts[0].key;
  material = materialPorFamilia[prod.familia];
  sincronizarPestanas();
  ultimasReparaciones = repararConflictos();
  render(); paint(); paintMaterial(); paintEmbroidery(); pulsarZonas();
  guardar();   /* cambiar de vehiculo tambien se recuerda */
  track('producto_seleccionado', {label: prod.label});
}

function currentPart(){
  const parts = PRODUCTS[productId].parts;
  let part = parts.find(p=>p.key===activePart);
  if(!part){ part = parts[0]; activePart = part.key; }
  return part;
}

/* --- precio "desde": base del producto + recargos conocidos --- */
function precioDesde(){
  const base = PRECIOS.desde[productId];
  if(base==null) return null;
  return base + (matDef(material).recargo||0) + embDef(embroidery.type).precio;
}

function renderPrice(){
  const v = precioDesde();
  const valEl = document.getElementById('priceVal');
  const noteEl = document.getElementById('priceNote');
  if(v==null){
    valEl.innerHTML = '<small>Cotizamos tu caso por WhatsApp</small>';
    noteEl.textContent = 'Todavía no publicamos precio de referencia para este producto.';
    return;
  }
  const extras = [];
  const rm = matDef(material).recargo||0;
  if(rm) extras.push(`${material} +${PRECIOS.moneda}${rm}`);
  const re = embDef(embroidery.type).precio;
  if(re) extras.push(`bordado +${PRECIOS.moneda}${re}`);
  valEl.innerHTML = `${PRECIOS.moneda}${v}` + (extras.length?` <small>(${extras.map(esc).join(' &middot; ')})</small>`:'');
  noteEl.textContent = PRECIOS.nota;
}

function render(){
  const part = currentPart();
  const s = state[productId][part.key];
  let h = '';
  if(tab==='color'){
    tabscope.textContent = `Editando color de: ${part.label}`;
    const v = vetos('color');
    const boton = c=>{
      const bad = v.get(c[0]);
      const et = c[2] ? c[0] : c[0]+', bajo pedido';
      return `<button class="color ${s.color===c[0]?'active':''}" style="background:${c[1]}" title="${esc(bad||et)}" ${bad?'disabled':''} data-act="color" data-val="${esc(c[0])}" aria-label="${esc(et)}"><span>${esc(c[0])}</span></button>`;
    };
    const stock  = COLORS.filter(c=>c[2]);
    const pedido = COLORS.filter(c=>!c[2]);
    h = '<b>COLOR DE LA PARTE SELECCIONADA</b>'
      + '<div class="grupolbl">Siempre disponibles</div>'
      + '<div class="colors">' + stock.map(boton).join('') + '</div>'
      + '<div class="grupolbl">Bajo pedido</div>'
      + '<div class="colors">' + pedido.map(boton).join('') + '</div>'
      + '<div class="pedidonota">Estos los conseguimos para ti. Escríbenos y te confirmamos el tiempo.</div>';
  }
  if(tab==='pattern'){
    tabscope.textContent = `Editando patrón de: ${part.label}`;
    const v = vetos('pattern');
    h = '<b>TIPO DE PATRÓN</b><div class="patterns">' + Object.keys(PATTERNS).map(k=>{
      const bad = v.get(k);
      return `<button class="pat ${s.pattern===k?'active':''}" ${bad?'disabled':''} title="${esc(bad||k)}" data-act="pattern" data-val="${esc(k)}"><span class="sample ${PATTERNS[k].cls}"></span>${esc(k)}</button>`;
    }).join('');
    const motivos = [...v.values()];
    if(motivos.length) h += `<div class="vetonote">${esc(motivos.join(' '))}</div>`;
    h += '</div>';
  }
  if(tab==='stitch'){
    tabscope.textContent = `Editando costura de: ${part.label}`;
    h = '<b>COLOR DE COSTURA</b><div class="swatches">' + STITCHES.map(x=>
      `<button class="stitch ${s.stitch===x[0]?'active':''}" title="${esc(x[0])}" data-act="stitch" data-val="${esc(x[0])}" aria-label="Costura ${esc(x[0])}"><i style="border-color:${x[1]}"></i><span>${esc(x[0])}</span></button>`).join('') + '</div>';
  }
  if(tab==='diseno'){
    tabscope.textContent = 'Elige el modelo de forro';
    h = '<b>MODELO DE FORRO</b><div class="modelos">' + DISENOS.map(d=>
      `<button class="modelo ${diseno===d.id?'active':''}" data-act="diseno" data-val="${esc(d.id)}" aria-pressed="${diseno===d.id}">
         <img src="disenos/${esc(d.id)}-280.webp" srcset="disenos/${esc(d.id)}-280.webp 280w, disenos/${esc(d.id)}.webp 560w" sizes="150px" alt="Modelo ${esc(d.nombre)}" width="280" height="380" loading="lazy" decoding="async">
         <span class="mnom">${esc(d.nombre)}</span></button>`).join('') + '</div>'
      + `<div class="pedidonota">${esc(disDef(diseno).desc)}</div>`;
  }
  if(tab==='material'){
    tabscope.textContent = 'Aplica a todo el producto';
    const lista = materiales();
    h = '<b>MATERIAL</b><div class="options">' + lista.map(m=>{
      const tag = m.recargo ? ` (+${PRECIOS.moneda}${m.recargo})` : '';
      return `<button class="opt matopt ${material===m.name?'active':''}" data-act="material" data-val="${esc(m.name)}">${esc(m.name)}${tag}<small>${esc(m.desc)}</small></button>`;
    }).join('') + '</div>';
    if(lista.length===1) h += '<div class="pedidonota">Para este producto trabajamos solo este material.</div>';
  }
  if(tab==='embroidery'){
    tabscope.textContent = 'Aplica a todo el producto';
    h = '<b>BORDADO</b><div class="options">' + EMB.map(e=>{
      const tag = e.precio ? ` (+${PRECIOS.moneda}${e.precio})` : '';
      return `<button class="opt ${embroidery.type===e.t?'active':''}" data-act="emb" data-val="${esc(e.t)}">${esc(e.t)}${tag}</button>`;
    }).join('') + '</div>';
    if(embDef(embroidery.type).pideTexto){
      const ph = embroidery.type==='Nombre del cliente' ? 'Escribe el nombre...'
               : embroidery.type==='Logo de mi vehículo' ? 'Marca de tu vehículo. Ej: Toyota'
               : 'Describe el logo/texto...';
      h += `<div class="txtbox"><input id="embInput" placeholder="${esc(ph)}" aria-label="${esc(ph)}"></div>`;
    }
  }
  /* Si al cambiar de producto hubo que ajustar una eleccion vetada, se le
     dice al cliente en vez de cambiarsela a la callada. */
  if(ultimasReparaciones.length){
    h += `<div class="vetonote">Ajustamos tu diseño para este producto: ${esc(ultimasReparaciones.join('; '))}.</div>`;
    ultimasReparaciones = [];
  }
  /* Reescribir el panel entero destruye el boton que el cliente acaba de
     activar, y con el se va el foco: el teclado volvia al principio del
     documento y habia que tabular hasta aqui otra vez en CADA eleccion de
     color, patron o costura. Como todos los controles llevan data-act y
     data-val, basta con anotar cual estaba enfocado y buscar su equivalente
     despues de repintar. */
  const enfocado = document.activeElement;
  const marca = enfocado && enfocado.dataset && enfocado.dataset.act
    ? {act: enfocado.dataset.act, val: enfocado.dataset.val} : null;
  const habiaFocoEnElPanel = !!(marca && content.contains(enfocado));

  content.innerHTML = h;

  if(habiaFocoEnElPanel){
    const vuelve = content.querySelector('[data-act="'+marca.act+'"]'
      + (marca.val != null ? '[data-val="'+CSS.escape(marca.val)+'"]' : ''));
    if(vuelve) vuelve.focus();
  }
  const inp = document.getElementById('embInput');
  if(inp) inp.value = embroidery.text;
  renderSummary();
  renderPrice();
  renderSticky();
}

function setPart(field,value){
  if(vetos(field).has(value)) return;
  state[productId][activePart][field]=value; render(); paint(); guardar();
  track('zona_editada', {zona:activePart, campo:field, valor:value});
}
function setDiseno(id){
  if(!DISENOS.some(d=>d.id===id)) return;
  diseno = id; render(); guardar();
  track('diseno_elegido', {diseno:id});
}
function setMaterial(m){
  if(!materiales().some(x=>x.name===m)) return;
  material = m;
  materialPorFamilia[familia()] = m;
  render(); paintMaterial(); guardar();
  track('material_cambiado', {material:m, familia:familia()});
}
function setEmbroidery(t){
  embroidery.type=t;
  if(!embDef(t).pideTexto) embroidery.text='';
  render(); paintEmbroidery(); guardar();
  track('bordado_cambiado', {tipo:t});
}

function paint(){
  PRODUCTS[productId].parts.forEach(part=>{
    const s = state[productId][part.key];
    const pd = PATTERNS[s.pattern] || PATTERNS.Liso;
    part.zones.forEach(z=>{
      const zn = el(productId, z);
      if(!zn) return;
      zn.setAttribute('fill', colorHex(s.color));
      const ov = el(productId, z+'-pat');
      if(ov) ov.setAttribute('fill', pd.svg ? `url(#${pd.svg})` : 'none');
      const sel = part.key===activePart;
      zn.classList.toggle('sel', sel);
      zn.style.stroke = sel ? '' : stitchHex(s.stitch);
    });
    const seam = el(productId, 'seams-'+part.key);
    if(seam) seam.style.stroke = stitchHex(s.stitch);
  });
}

function paintMaterial(){
  Object.values(PRODUCTS).forEach(p=>{
    const g = el(p.id,'grain');
    if(!g) return;
    g.setAttribute('opacity', p.id!==productId ? '0' : (matDef(material).grano || '.3'));
  });
  document.getElementById('matBadge').textContent = material;
  renderPrice();
}

function paintEmbroidery(){
  const txt = embroidery.type==='Sin bordado' ? ''
    : (embroidery.type==='FORROS CUENCA' ? 'FORROS CUENCA'
      : (embroidery.text || (embroidery.type==='Nombre del cliente' ? 'Tu nombre aqui'
         : embroidery.type==='Logo de mi vehículo' ? 'Logo de tu marca' : 'Tu logo aqui')));
  Object.values(PRODUCTS).forEach(p=>{
    const t = el(p.id,'emb');
    if(!t) return;
    const on = (p.id===productId && txt);
    t.textContent = on ? txt : '';
    t.setAttribute('opacity', on ? '.9' : '0');
  });
  renderPrice();
}

function renderSummary(){
  const rows = PRODUCTS[productId].parts.map(part=>{
    const s = state[productId][part.key];
    const marca = enStock(s.color) ? '' : ' <i class="bp">bajo pedido</i>';
    return `<div class="row"><span>${esc(part.label)}</span><b>${esc(s.color)}${marca} &middot; ${esc(s.pattern)} &middot; ${esc(s.stitch)}</b></div>`;
  }).join('');
  const filaDis = PRODUCTS[productId].usaDiseno
    ? `<div class="row"><span>Modelo</span><b>${esc(disDef(diseno).nombre)}</b></div>` : '';
  document.getElementById('summary').innerHTML = filaDis + rows +
    `<div class="row"><span>Material</span><b>${esc(material)}</b></div>` +
    `<div class="row"><span>Bordado</span><b>${esc(embroidery.type)}${embroidery.text?' - '+esc(embroidery.text):''}</b></div>`;
}



/* ============================================================
   F3 — Conversion. Presets, persistencia, diseno compartible,
   formulario del vehiculo y mensaje de WhatsApp util.
   ============================================================ */

/* Presets por ROL, no por producto: sirven para los 6 sin tocarlos. */
const PRESETS = [
  {name:'Full Negro',      centro:{color:'Negro',  pattern:'Liso',  stitch:'Roja'},   lateral:{color:'Negro', pattern:'Liso', stitch:'Roja'}},
  {name:'Deportivo Rojo',  centro:{color:'Rojo',   pattern:'Rombos',stitch:'Negra'},  lateral:{color:'Negro', pattern:'Liso', stitch:'Roja'}},
  {name:'Elegante Beige',  centro:{color:'Beige',  pattern:'Rombos',stitch:'Beige'},  lateral:{color:'Café',  pattern:'Liso', stitch:'Beige'}},
  {name:'Bicolor Azul',    centro:{color:'Azul',   pattern:'Rombos',stitch:'Blanca'}, lateral:{color:'Gris',  pattern:'Liso', stitch:'Blanca'}},
  {name:'Vino Clasico',    centro:{color:'Vino',   pattern:'Rombos',stitch:'Beige'},  lateral:{color:'Negro', pattern:'Liso', stitch:'Beige'}}
];

let cliente = { nombre:'', vehiculo:'', ciudad:'' };

function aplicarPreset(i){
  const p = PRESETS[i]; if(!p) return;
  const vC = vetos('color'), vP = vetos('pattern');
  PRODUCTS[productId].parts.forEach(part=>{
    const src = p[part.rol] || p.centro;
    const s = state[productId][part.key];
    if(!vC.has(src.color))   s.color   = src.color;
    if(!vP.has(src.pattern)) s.pattern = src.pattern;
    s.stitch = src.stitch;
  });
  render(); paint(); guardar();
  track('preset_aplicado', {preset:p.name});
}

function mountPresets(){
  const c = document.getElementById('presets');
  c.innerHTML = PRESETS.map((p,i)=>
    `<button class="preset" data-preset="${i}"><span class="dots">`+
    `<i style="background:${colorHex(p.centro.color)}"></i>`+
    `<i style="background:${colorHex(p.lateral.color)}"></i>`+
    `<i style="background:${stitchHex(p.centro.stitch)}"></i>`+
    `</span>${esc(p.name)}</button>`).join('');
}

/* Misma razon que en #vehiclebar: la delegacion, una sola vez y fuera. */
document.getElementById('presets').addEventListener('click', e=>{
  const b = e.target.closest('[data-preset]');
  if(b) aplicarPreset(+b.dataset.preset);
});

/* ---------- diseno compartible en la URL ---------- */
const A64='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const idxColor  = n => Math.max(0, COLORS.findIndex(c=>c[0]===n));
const idxPat    = n => Math.max(0, Object.keys(PATTERNS).indexOf(n));
const idxStitch = n => Math.max(0, STITCHES.findIndex(s=>s[0]===n));

/* Orden historico de productos para el enlace ?d=. NO reordenar ni compactar:
   el indice viaja dentro del enlace, asi que un enlace ya compartido tiene que
   seguir resolviendo al mismo producto. 'moto' se retiro del catalogo el
   25 ago 2026 y su posicion queda reservada para no desplazar a los demas. */
const ORDEN_URL = ['auto', null /* moto (retirado) */, 'camioneta', 'tablero', 'techo', 'pisos'];

function codificar(){
  const nums = [ORDEN_URL.indexOf(productId)];
  PRODUCTS[productId].parts.forEach(part=>{
    const s = state[productId][part.key];
    nums.push(idxColor(s.color), idxPat(s.pattern), idxStitch(s.stitch));
  });
  nums.push(Math.max(0, materiales().findIndex(m=>m.name===material)));
  nums.push(Math.max(0, EMB.findIndex(e=>e.t===embroidery.type)));
  nums.push(Math.max(0, DISENOS.findIndex(d=>d.id===diseno)));
  const chk = nums.reduce((a,b)=>(a+b)%64, 7);
  let out = nums.concat([chk]).map(n=>A64[n%64]).join('');
  if(embroidery.text) out += '~' + encodeURIComponent(embroidery.text.slice(0,40));
  return out;
}

function decodificar(str){
  try{
    if(!str) return false;
    const [codeRaw, txt] = str.split('~');
    const nums = [...codeRaw].map(ch=>A64.indexOf(ch));
    if(nums.some(n=>n<0) || nums.length < 5) return false;
    const chk = nums.pop();
    if(nums.reduce((a,b)=>(a+b)%64, 7) !== chk) return false;
    const prod = PRODUCTS[ORDEN_URL[nums[0]]];
    if(!prod || prod.pending) return false;
    const esperado = 1 + prod.parts.length*3 + 2;
    if(nums.length !== esperado && nums.length !== esperado + 1) return false;
    let i = 1;
    prod.parts.forEach(part=>{
      const s = state[prod.id][part.key];
      s.color   = (COLORS[nums[i++]]||COLORS[0])[0];
      s.pattern = Object.keys(PATTERNS)[nums[i++]] || 'Liso';
      s.stitch  = (STITCHES[nums[i++]]||STITCHES[0])[0];
    });
    const lista = MATERIALES[prod.familia] || MATERIALES.forro;
    material = (lista[nums[i++]] || lista[0]).name;
    materialPorFamilia[prod.familia] = material;
    embroidery.type = (EMB[nums[i++]]||EMB[0]).t;
    embroidery.text = txt ? decodeURIComponent(txt) : '';
    if(i < nums.length) diseno = (DISENOS[nums[i++]] || DISENOS[0]).id;
    productId = prod.id;
    return true;
  }catch(e){ return false; }
}

function enlaceDiseno(){
  return location.origin + location.pathname + '?d=' + codificar();
}

/* ---------- persistencia ---------- */
const LS = 'forroscuenca.v1';
function guardar(){
  try{
    localStorage.setItem(LS, JSON.stringify({productId, state, materialPorFamilia, embroidery, cliente, diseno}));
  }catch(e){}
}
function restaurar(){
  try{
    const raw = localStorage.getItem(LS);
    if(!raw) return false;
    const d = JSON.parse(raw);
    if(!d || !PRODUCTS[d.productId] || PRODUCTS[d.productId].pending) return false;
    const okColor  = n => COLORS.some(c=>c[0]===n);
    const okPat    = n => !!PATTERNS[n];
    const okStitch = n => STITCHES.some(x=>x[0]===n);
    Object.entries(d.state||{}).forEach(([pid, parts])=>{
      if(!state[pid]) return;
      Object.entries(parts).forEach(([k,v])=>{
        const t = state[pid][k];
        if(!t || !v) return;
        if(okColor(v.color))   t.color   = v.color;
        if(okPat(v.pattern))   t.pattern = v.pattern;
        if(okStitch(v.stitch)) t.stitch  = v.stitch;
      });
    });
    if(d.materialPorFamilia) Object.entries(d.materialPorFamilia).forEach(([f,v])=>{
      if(MATERIALES[f] && MATERIALES[f].some(m=>m.name===v)) materialPorFamilia[f]=v;
    });
    if(d.embroidery && EMB.some(e=>e.t===d.embroidery.type)) embroidery = d.embroidery;
    if(d.cliente) cliente = Object.assign(cliente, d.cliente);
    if(DISENOS.some(x=>x.id===d.diseno)) diseno = d.diseno;
    productId = d.productId;
    return true;
  }catch(e){ return false; }
}
function olvidar(){ try{ localStorage.removeItem(LS); }catch(e){} }

/* ---------- barra fija ---------- */
function renderSticky(){
  const v = precioDesde();
  document.getElementById('stickyLbl').textContent = PRODUCTS[productId].label;
  document.getElementById('stickyVal').innerHTML = v==null
    ? '<small>Precio a medida</small>'
    : `Desde ${PRECIOS.moneda}${v}`;
}

/* ---------- formulario del vehiculo ---------- */
/* ============================================================
   FOCO MIENTRAS HAY UN MODAL ABIERTO
   Los dos modales de este archivo se pintan encima de la pagina, pero el
   teclado seguia recorriendo lo de detras: desde el ultimo boton del
   formulario, un Tab salia al configurador y paseaba por la cabecera, la
   barra de vehiculos y las seis zonas del asiento, todas ellas tabulables
   (tabindex=0), tapadas por el velo y sin verse donde estaba el foco.
   Se resuelve marcando 'inert' a los hermanos del modal: los saca del orden
   de tabulacion de una vez, sin tener que ciclar el Tab a mano.
   Y al cerrar, el foco vuelve a quien abrio el modal. Antes caia a <body>, asi
   que quien lo abria desde la barra fija de abajo reaparecia al principio del
   documento y tenia que tabular la pagina entera para volver.
   ============================================================ */
let abrioElModal = null;

function aislarElFondo(bg){
  abrioElModal = document.activeElement;
  document.querySelectorAll('body > *').forEach(n=>{
    if(n !== bg && !n.hasAttribute('inert')){ n.inert = true; n.dataset.inertPorModal = '1'; }
  });
}

function soltarElFondo(){
  document.querySelectorAll('[data-inert-por-modal]').forEach(n=>{
    n.inert = false; delete n.dataset.inertPorModal;
  });
  /* se devuelve ya, sin esperar a la animacion de salida: si se esperara, el
     foco pasaria ese rato en la nada */
  if(abrioElModal && document.contains(abrioElModal)) abrioElModal.focus();
  abrioElModal = null;
}

function abrirFormulario(){
  const bg = document.createElement('div');
  bg.className = 'modalbg';
  bg.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTit">
      <h3 id="mTit">Un dato m&aacute;s y te cotizamos</h3>
      <p class="sub">El precio depende del veh&iacute;culo. Con esto te damos el valor exacto en el primer mensaje, sin ida y vuelta.</p>
      <div class="field">
        <label for="fVeh">Marca, modelo y a&ntilde;o</label>
        <input id="fVeh" placeholder="Ej: Chevrolet Aveo 2015" autocomplete="off">
        <div class="err">Escribe al menos la marca y el modelo.</div>
      </div>
      <div class="field">
        <label for="fNom">Tu nombre</label>
        <input id="fNom" placeholder="Ej: Jairo M&eacute;ndez" autocomplete="name">
        <div class="err">Dinos c&oacute;mo te llamas.</div>
      </div>
      <div class="field">
        <label for="fCiu">Ciudad <span>(opcional)</span></label>
        <input id="fCiu" placeholder="Machala" autocomplete="address-level2">
      </div>
      <div class="modalact">
        <button class="btnghost" id="mCancel">Volver</button>
        <button class="cta" id="mSend">Enviar por WhatsApp</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  track('formulario_abierto', {precio: precioDesde()});
  const veh = bg.querySelector('#fVeh'), nom = bg.querySelector('#fNom'), ciu = bg.querySelector('#fCiu');
  veh.value = cliente.vehiculo; nom.value = cliente.nombre; ciu.value = cliente.ciudad;
  aislarElFondo(bg);
  veh.focus();

  const cerrar = ()=>{
    document.removeEventListener('keydown', onKey);
    soltarElFondo();
    /* El nodo se quita cuando termina la animacion de salida, no antes, o se
       veria desaparecer de golpe. Con reduced-motion no hay animacion que
       esperar y se va en el acto. */
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){ bg.remove(); return; }
    bg.classList.add('cerrando');
    setTimeout(()=>bg.remove(), 170);
  };
  const onKey = e=>{ if(e.key==='Escape') cerrar(); };
  document.addEventListener('keydown', onKey);
  bg.addEventListener('click', e=>{ if(e.target===bg) cerrar(); });
  bg.querySelector('#mCancel').addEventListener('click', cerrar);

  const validar = ()=>{
    let ok = true;
    if(veh.value.trim().length < 3){ veh.setAttribute('aria-invalid','true'); ok=false; } else veh.removeAttribute('aria-invalid');
    if(nom.value.trim().length < 2){ nom.setAttribute('aria-invalid','true'); ok=false; } else nom.removeAttribute('aria-invalid');
    return ok;
  };
  [veh,nom].forEach(i=>i.addEventListener('input',()=>i.removeAttribute('aria-invalid')));
  bg.querySelector('#mSend').addEventListener('click', ()=>{
    if(!validar()){ bg.querySelector('[aria-invalid="true"]').focus(); return; }
    cliente = { nombre:nom.value.trim(), vehiculo:veh.value.trim(), ciudad:ciu.value.trim() };
    guardar(); cerrar(); enviarWhatsApp();
  });
}

/* ══ GALERIA POR FORRO ══
   Antes la galeria eran 17 fotos sueltas en fila: la general de un juego y
   sus detalles quedaban separadas por otras cuatro, y el cliente no tenia
   como saber que eran el MISMO forro. Ahora cada tarjeta es la portada de un
   juego y al abrirla salen las demas fotos de ese mismo cuero, con su mismo
   color y su mismo dibujo.

   Como en el resto del sitio, esto es DATO y no codigo: para sumar un forro
   se anade una entrada aqui y una <figure> en la galeria. La primera foto de
   cada lista es la portada, la misma que se ve en la tarjeta.
   'visor' solo se pone cuando la foto grande no es la 3:4 recortada de la
   tarjeta: las del taller son verticales de telefono y se veria cortada. */
const GALERIA = {
  negro: {
    nombre:'Negro con ondas',
    desc:'Cuero negro con paneles en ondas y costura blanca. El contraste de la costura es lo que dibuja el relieve.',
    fotos:[
      {img:'muestra-negro-showroom',   alt:'Juego de forros en cuero negro con acolchado de ondas y costura blanca'},
      {img:'muestra-negro-ondas',      alt:'Los mismos forros negros vistos de lado, con las ondas del respaldo y del cojin'},
      {img:'muestra-negro-cueros',     alt:'Los forros negros junto al muestrario de cueros de colores del taller'},
      {img:'muestra-detalle-ondas',    alt:'Detalle del acolchado en ondas con costura clara sobre cuero negro'},
      {img:'muestra-detalle-costura',  alt:'Detalle de la costura y los paneles en cuero negro combinado con gris'},
      {img:'muestra-detalle-canaletas',alt:'Primer plano de las canaletas cosidas del cojin en cuero negro'}
    ]
  },
  gris: {
    nombre:'Gris pizarra',
    desc:'Cuero gris con costura al tono y el nombre del vehiculo bordado en el respaldo.',
    fotos:[
      {img:'muestra-gris-dmax',  alt:'Forros en cuero gris pizarra con bordado Isuzu D-Max'},
      {img:'muestra-gris-panel', alt:'Detalle del cojin en cuero gris pizarra con costura al tono'}
    ]
  },
  bicolor: {
    nombre:'Blanco y negro',
    desc:'Bicolor con rombos cosidos en el respaldo y los costados en blanco.',
    fotos:[
      {img:'muestra-blanco-negro',  alt:'Forros bicolor blanco y negro con rombos cosidos en el respaldo'},
      {img:'muestra-rombos-blanco', alt:'Detalle de los rombos cosidos en el respaldo bicolor blanco y negro'}
    ]
  },
  azul: {
    nombre:'Azul marino',
    desc:'Cuero azul marino liso, con costura al tono. Sobrio y de los que menos se ensucian.',
    fotos:[
      {img:'muestra-azul-marino', alt:'Forros en cuero azul marino lisos, con costura al tono'},
      {img:'muestra-azul-cojin',  alt:'Asiento en cuero azul marino visto de frente, con el muestrario al fondo'}
    ]
  },
  camel: {
    nombre:'Camel acanalado',
    desc:'Cuero camel con acanalado vertical y el logo bordado en el respaldo.',
    fotos:[
      {img:'muestra-camel-hilux',     alt:'Forros en cuero camel con acanalado vertical y bordado Toyota Hilux'},
      {img:'muestra-camel-acanalado', alt:'Primer plano del acanalado vertical en cuero camel'}
    ]
  },
  verde: {
    nombre:'Verde oscuro',
    desc:'Cuero verde con acolchado hexagonal y ribete texturizado en los costados.',
    fotos:[
      {img:'muestra-verde-showroom',  alt:'Juego de forros en cuero verde oscuro con acolchado hexagonal, vistos de frente'},
      {img:'muestra-verde-hexagonal', alt:'Los mismos forros verdes vistos de cerca, con el acolchado hexagonal del respaldo'},
      {img:'muestra-verde-panel',     alt:'Detalle del acolchado hexagonal y del ribete texturizado en cuero verde oscuro'}
    ]
  },
  foton: {
    nombre:'Gris y negro con vivo',
    desc:'Banca de furgoneta en dos tonos, con vivo blanco y perforado en los paneles del centro.',
    fotos:[
      {img:'muestra-banca-foton', alt:'Banca de furgoneta en cuero gris y negro con vivo blanco y bordado Foton'},
      {img:'muestra-foton-vivo',  alt:'Detalle del vivo blanco y el perforado en la banca gris y negra'}
    ]
  }
};

function abrirForro(clave){
  const g = GALERIA[clave];
  if(!g) return;
  const fotos = g.fotos;
  let i = 0;

  const bg = document.createElement('div');
  bg.className = 'modalbg';
  const varias = fotos.length > 1;
  bg.innerHTML = `
    <div class="modal visor" role="dialog" aria-modal="true" aria-labelledby="vTit">
      <div class="visor-cab">
        <div>
          <h3 id="vTit">${g.nombre}</h3>
          <p>${g.desc}</p>
        </div>
        <button class="visor-x" id="vX" aria-label="Cerrar">&#10005;</button>
      </div>
      <div class="visor-caja">
        <div class="visor-marco" id="vPista">${fotos.map(f=>`
          <div class="visor-hoja"><img src="fotos/${f.visor || f.img}.webp" alt="" draggable="false" decoding="async"></div>`).join('')}
        </div>
        ${varias ? '<button class="visor-nav prev" id="vPrev" aria-label="Foto anterior">&#8249;</button><button class="visor-nav sig" id="vSig" aria-label="Foto siguiente">&#8250;</button>' : ''}
      </div>
      <p class="visor-pie" id="vPie" role="status" aria-live="polite"></p>
      ${varias ? '<div class="visor-tira" id="vTira"></div>' : ''}
    </div>`;
  document.body.appendChild(bg);
  track('galeria_forro_abierto', {forro: clave, fotos: fotos.length});

  const pista = bg.querySelector('#vPista'), pie = bg.querySelector('#vPie');
  const tira = bg.querySelector('#vTira');
  const flePrev = bg.querySelector('#vPrev'), fleSig = bg.querySelector('#vSig');
  const hojas = [...pista.children];
  const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(tira){
    /* Las miniaturas se arman aqui y no en el HTML porque son las mismas
       fotos de la tabla: escribirlas dos veces es garantia de que un dia
       digan cosas distintas. */
    fotos.forEach((f, n)=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<img src="fotos/${f.img}-400.webp" alt="" loading="lazy" decoding="async">`;
      b.setAttribute('aria-label', `Foto ${n+1} de ${fotos.length}`);
      b.addEventListener('click', ()=>ver(n));
      tira.appendChild(b);
    });
  }

  /* Quien manda aqui es el scroll del marco. 'ver' solo pide el sitio; el
     estado (pie, miniaturas, foto realzada) lo pone 'marcar', que corre con
     cada cuadro de scroll. Asi da igual como se llego -- con la flecha, con
     el teclado, con la miniatura o empujando con el dedo -- el resultado es
     el mismo y no hay dos verdades que sincronizar.
     No da la vuelta a proposito: empujando con el dedo tampoco se vuelve de
     la ultima a la primera, y que el boton hiciera algo que el gesto no hace
     obligaria a explicar cual de los dos miente. */
  const ver = n=>{
    const k = Math.max(0, Math.min(fotos.length - 1, n));
    /* Se le pide el sitio a la hoja en vez de calcularlo por el ancho: asi da
       igual el relleno que lleve, o que un dia se le ponga separacion. */
    hojas[k].scrollIntoView({
      inline:'center', block:'nearest',
      behavior: suave ? 'smooth' : 'auto'
    });
  };

  let fundido = 0;
  const marcar = k=>{
    if(k === i) return;
    i = k;
    hojas.forEach((h, n)=>h.setAttribute('aria-current', n===i ? 'true' : 'false'));

    const f = fotos[i];
    const texto = fotos.length > 1
      ? `${f.alt}. Foto ${i+1} de ${fotos.length}.`
      : f.alt;
    /* La foto va sin alt y quien la describe es el pie, que esta justo debajo
       y ademas es region viva: asi el lector de pantalla anuncia el cambio al
       pasar de foto, y no lee la misma frase dos veces. */
    if(!suave || !pie.textContent) pie.textContent = texto;
    else {
      /* la frase se funde en vez de cambiar de golpe: sustituirla a mitad del
         deslizamiento es lo que hacia que el cambio se viera brusco */
      pie.classList.add('cambiando');
      clearTimeout(fundido);
      fundido = setTimeout(()=>{ pie.textContent = texto; pie.classList.remove('cambiando'); }, 200);
    }

    if(tira){
      [...tira.children].forEach((b, n)=>b.setAttribute('aria-current', n===i ? 'true' : 'false'));
      /* que la miniatura viva no se quede fuera de cuadro en un forro de seis */
      tira.children[i].scrollIntoView({block:'nearest', inline:'center'});
    }
    /* en los topes la flecha se apaga: un boton que no lleva a ningun sitio
       se pulsa una vez y deja al cliente pensando que la pagina fallo */
    if(flePrev){ flePrev.disabled = i === 0; fleSig.disabled = i === fotos.length - 1; }
  };

  /* El scroll es la unica fuente de verdad. Se escucha en vivo y no al final
     del gesto: mientras el dedo empuja, la foto que va entrando ya se realza
     y el pie ya cambia, que es lo que hace que el gesto se sienta atendido.
     'marcar' se sale sola si el numero no cambio, asi que llamarla en cada
     cuadro de scroll no cuesta nada. */
  pista.addEventListener('scroll', ()=>{
    const k = Math.round(pista.scrollLeft / (pista.clientWidth || 1));
    marcar(Math.max(0, Math.min(fotos.length - 1, k)));
  }, {passive:true});

  /* arranque: la primera foto ya esta en su sitio, solo falta el estado */
  i = -1; marcar(0);

  aislarElFondo(bg);
  bg.querySelector('#vX').focus();

  const cerrar = ()=>{
    document.removeEventListener('keydown', onKey);
    clearTimeout(fundido);
    soltarElFondo();
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){ bg.remove(); return; }
    bg.classList.add('cerrando');
    setTimeout(()=>bg.remove(), 170);
  };
  const onKey = e=>{
    if(e.key === 'Escape'){ cerrar(); return; }
    if(!varias) return;
    if(e.key === 'ArrowRight') ver(i+1);
    if(e.key === 'ArrowLeft')  ver(i-1);
  };
  document.addEventListener('keydown', onKey);
  bg.addEventListener('click', e=>{ if(e.target===bg) cerrar(); });
  bg.querySelector('#vX').addEventListener('click', cerrar);
  if(varias){
    bg.querySelector('#vPrev').addEventListener('click', ()=>ver(i-1));
    bg.querySelector('#vSig').addEventListener('click',  ()=>ver(i+1));
  }
}

/* Un solo oyente en la rejilla en vez de once: las tarjetas se pueden anadir
   o quitar del HTML sin tocar nada de aqui. */
document.querySelector('.galeria .grid')?.addEventListener('click', e=>{
  const b = e.target.closest('.forro-btn');
  if(b) abrirForro(b.dataset.forro);
});

function folio(){
  const d = new Date(), p = n=>String(n).padStart(2,'0');
  const seq = codificar().replace(/[^A-Za-z0-9]/g,'').slice(0,3).toUpperCase();
  return `FC-${String(d.getFullYear()).slice(2)}${p(d.getMonth()+1)}${p(d.getDate())}-${seq}`;
}

function enviarWhatsApp(){
  const prod = PRODUCTS[productId];
  const lineas = prod.parts.map(part=>{
    const s = state[productId][part.key];
    return `- ${part.label}: ${s.color}${enStock(s.color)?'':' (bajo pedido)'}, ${s.pattern}, costura ${s.stitch}`;
  }).join('\n');
  const v = precioDesde();
  const m =
`Hola Forros Cuenca! Quiero cotizar un ${prod.wa}.

Cotización ${folio()}
Cliente: ${cliente.nombre}
Vehículo: ${cliente.vehiculo}${cliente.ciudad?'\nCiudad: '+cliente.ciudad:''}

${prod.usaDiseno ? 'Modelo: '+disDef(diseno).nombre+'\n' : ''}Diseño:
${lineas}
Material: ${material}
Bordado: ${embroidery.type}${embroidery.text?' - '+embroidery.text:''}
${v!=null?`Referencia web: desde ${PRECIOS.moneda}${v}`:''}

Ver mi diseño: ${enlaceDiseno()}`;
  track('whatsapp_enviado', {precio:v, material, bordado:embroidery.type, vehiculo:cliente.vehiculo});
  const url = 'https://wa.me/'+NEGOCIO.wa+'?text='+encodeURIComponent(m);
  /* window.open falla en el navegador interno de Instagram/Facebook */
  const w = window.open(url,'_blank');
  if(!w || w.closed || typeof w.closed==='undefined') location.href = url;
}

function send(){ abrirFormulario(); }

/* Un producto sin dibujo no puede ser un callejon sin salida: es el mas caro
   y el que domina la galeria. Se explica y se ofrece una salida. */
function hojaPendiente(prod){
  if(!prod) return;
  const p = PRECIOS.desde[prod.id];
  const bg = document.createElement('div');
  bg.className = 'modalbg';
  bg.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="hpTit">
      <h3 id="hpTit">${esc(prod.label)}: todavía no se puede diseñar aquí</h3>
      <p class="sub">Si lo hacemos, y es de lo que mas trabajamos. Lo que falta es el dibujo interactivo, que estamos terminando.
      ${p!=null?`<br><br><b style="color:#fff">Desde ${PRECIOS.moneda}${p}</b>, con instalación incluida.`:''}</p>
      <div class="modalact">
        <button class="btnghost" id="hpClose">Seguir viendo</button>
        <button class="cta" id="hpWa">Preguntar por WhatsApp</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  const cerrar = ()=>{
    document.removeEventListener('keydown', onKey);
    soltarElFondo();
    /* El nodo se quita cuando termina la animacion de salida, no antes, o se
       veria desaparecer de golpe. Con reduced-motion no hay animacion que
       esperar y se va en el acto. */
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){ bg.remove(); return; }
    bg.classList.add('cerrando');
    setTimeout(()=>bg.remove(), 170);
  };
  const onKey = e=>{ if(e.key==='Escape') cerrar(); };
  document.addEventListener('keydown', onKey);
  bg.addEventListener('click', e=>{ if(e.target===bg) cerrar(); });
  bg.querySelector('#hpClose').addEventListener('click', cerrar);
  bg.querySelector('#hpWa').addEventListener('click', ()=>{
    track('interes_producto_pendiente', {producto: prod.id});
    const m = `Hola Forros Cuenca! Me interesa un ${prod.wa}. Vi la página y todavía no se puede diseñar en línea. ¿Me pueden cotizar?`;
    const url = 'https://wa.me/'+NEGOCIO.wa+'?text='+encodeURIComponent(m);
    const w = window.open(url,'_blank');
    if(!w || w.closed || typeof w.closed==='undefined') location.href = url;
    cerrar();
  });
  aislarElFondo(bg);
  bg.querySelector('#hpClose').focus();
  track('vio_producto_pendiente', {producto: prod.id});
}

/* Ver el forro como quedara, sin las guias punteadas de edicion. */
function toggleLimpio(forzar){
  const on = typeof forzar==='boolean' ? forzar : !document.body.classList.contains('limpio');
  document.body.classList.toggle('limpio', on);
  const b = document.getElementById('btnLimpio');
  b.textContent = on ? 'Ver zonas' : 'Ver limpio';
  b.setAttribute('aria-pressed', on ? 'true' : 'false');
  if(on) track('vista_limpia');
}

content.addEventListener('click', e=>{
  const b = e.target.closest('[data-act]');
  if(!b || b.disabled) return;
  const a = b.dataset.act, v = b.dataset.val;
  if(a==='color'||a==='pattern'||a==='stitch') setPart(a,v);
  else if(a==='material') setMaterial(v);
  else if(a==='emb') setEmbroidery(v);
  else if(a==='diseno') setDiseno(v);
});
/* Guardar con retardo. Guardar en cada tecla castiga al movil, y llamar a
   render() aqui seria peor: termina en content.innerHTML y destruiria este
   mismo <input>, con lo que el cliente perderia el foco y el teclado. */
let embSaveT = null;
content.addEventListener('input', e=>{
  if(e.target.id==='embInput'){
    embroidery.text = e.target.value;
    renderSummary(); paintEmbroidery();
    clearTimeout(embSaveT);
    embSaveT = setTimeout(guardar, 500);
  }
});
function sincronizarPestanas(){
  const usa = !!PRODUCTS[productId].usaDiseno;
  const t = document.querySelector('.tab[data-t="diseno"]');
  if(t) t.style.display = usa ? '' : 'none';
  if(!usa && tab==='diseno'){
    tab='color';
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    document.querySelector('.tab[data-t="color"]').classList.add('active');
  }
}

document.querySelectorAll('.tab').forEach(b=>{
  b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false');
  b.addEventListener('click',()=>{
    tab = b.dataset.t;
    document.querySelectorAll('.tab').forEach(x=>{
      x.classList.remove('active'); x.setAttribute('aria-pressed','false');
    });
    b.classList.add('active'); b.setAttribute('aria-pressed','true');
    render();
  });
});
document.getElementById('ctaWa').addEventListener('click', send);

document.getElementById('ctaSticky').addEventListener('click', send);
document.getElementById('btnLimpio').addEventListener('click', ()=>toggleLimpio());
document.getElementById('restoreReset').addEventListener('click', ()=>{
  olvidar(); location.href = location.origin + location.pathname;
});

mountVehicleBar();
mountLabels();
mountGrainClips();
mountRelieve();
mountCosturaVolumen();
mountZoneHandlers();
mountPresets();

/* Prioridad: un diseno compartido por link gana sobre lo guardado. */
const compartido = decodificar(new URLSearchParams(location.search).get('d'));
const recuperado = !compartido && restaurar();
if(recuperado){
  document.getElementById('restoreBar').style.display = 'flex';
  /* Quien vuelve ya uso el configurador: no necesita la pista, y ademas el
     banner le empuja la tarjeta 56 px hacia abajo. */
  document.body.classList.add('yatoco','conbanner');
}

/* 'visita' PRIMERO: setProduct dispara 'producto_seleccionado', y si va antes
   la primera entrada de la sesion nunca es la visita y el embudo sale al reves. */
track('visita', {origen: compartido ? 'link_compartido' : (recuperado ? 'volvio' : 'nuevo')});
setProduct(productId);

/* ============================================================
   APARICION AL HACER SCROLL
   Sin librerias: IntersectionObserver, que ya viene en todos los
   navegadores que nos importan.

   Por que el estado oculto lo pone el JS y no el CSS: debajo del
   configurador estan las 400 palabras que indexa Google. Si el
   opacity:0 viviera en la hoja de estilos y el JS fallara, ese texto
   quedaria invisible para siempre. Asi, si algo se rompe, lo peor que
   pasa es que la pagina no se anime.

   Tres redes de seguridad, en este orden:
     1. Si no hay IntersectionObserver o el visitante pidio menos
        movimiento, no se toca nada.
     2. Lo que ya esta en pantalla al cargar se revela sin animar.
     3. Un seguro contra un observador muerto: al empezar a observar,
        IntersectionObserver siempre avisa una primera vez de cada
        elemento (aunque sea para decir que no se ve). Si a los 2 s no
        ha avisado ni una vez, damos por roto el mecanismo y se muestra
        todo. Ojo: el seguro NO puede ser un simple plazo que revele
        todo pasado un rato. Se probo asi y anulaba el efecto: el
        cliente pasa mas de tres segundos en el configurador antes de
        bajar, con lo que llegaba a la galeria ya revelada y no veia
        aparecer nada.
   ============================================================ */
(function(){
  /* La pagina principal ya administra sus propias animaciones. */
  return;
  var menosMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(menosMovimiento || !('IntersectionObserver' in window)) return;

  /* Los objetivos se marcan desde aqui a proposito: el HTML no lleva ni una
     clase de presentacion, asi que sin este script no hay nada que revelar. */
  var objetivos = [].concat(
    [].slice.call(document.querySelectorAll('.galeria > h2, .galeria > .sub')),
    [].slice.call(document.querySelectorAll('.grid figure')),
    [].slice.call(document.querySelectorAll('.info > h2, .info > p, .info > ul, .info > .cols')),
    [].slice.call(document.querySelectorAll('footer'))
  );
  if(!objetivos.length) return;

  document.documentElement.classList.add('anim');
  /* las fotos funden y nada mas; los textos ademas suben */
  objetivos.forEach(function(el){
    el.classList.add(el.tagName === 'FIGURE' ? 'revfade' : 'reveal');
  });

  var mostrar = function(el, puestoEnElLote){
    if(el.classList.contains('dentro')) return;
    /* El retraso se cuenta dentro del LOTE que entra a la vez, no por su
       posicion en la grilla. Antes se usaba el indice entre las dieciocho
       fotos, y como al bajar entran de una en una, doce de ellas recibian el
       mismo retraso de tope: 270 ms que no escalonaban respecto a nadie:
       eran espera y ya. Quien entra solo empieza en el acto. */
    if(puestoEnElLote != null){
      el.style.setProperty('--d', Math.min(puestoEnElLote, 3) * 45 + 'ms');
    }
    el.classList.add('dentro');
  };

  var observadorVivo = false;
  var obs = new IntersectionObserver(function(entradas){
    observadorVivo = true;       /* dio senales de vida: el seguro sobra */
    var entrando = entradas.filter(function(e){ return e.isIntersecting });
    entrando.forEach(function(e, i){
      mostrar(e.target, e.target.tagName === 'FIGURE' ? i : null);
      obs.unobserve(e.target);   /* una vez visible, ya no se vigila */
    });
  }, {rootMargin: '0px 0px -6% 0px', threshold: 0.05});

  objetivos.forEach(function(el){
    /* Red 2: lo que ya se ve al cargar no tiene por que aparecer; animarlo
       seria un parpadeo gratuito en el primer pintado. */
    var r = el.getBoundingClientRect();
    if(r.top < innerHeight && r.bottom > 0){ el.classList.add('dentro'); return; }
    obs.observe(el);
  });

  /* Red 3: si el observador nunca dio senales, se muestra todo. */
  setTimeout(function(){
    if(observadorVivo) return;
    objetivos.forEach(function(el){ el.classList.add('dentro'); });
    obs.disconnect();
  }, 2000);
})();
