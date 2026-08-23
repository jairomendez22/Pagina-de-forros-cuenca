/* =========================================================================
   FORROS CUENCA - Grafo de dominio del configurador
   Motor: catálogo como grafo dirigido tipado + resolución de precio/validez
   ========================================================================= */

/* ---------- 1. NODOS ---------- */
const N = {

  /* --- Insumo: la ÚNICA tabla que el dueño edita para mover precios --- */
  'i:cuero_am'  : {t:'Insumo', label:'Cuero americano',   unidad:'m2',   precio:18.00},
  'i:cuero_col' : {t:'Insumo', label:'Cuero colombiano',  unidad:'m2',   precio:12.50},
  'i:mano_obra' : {t:'Insumo', label:'Mano de obra',      unidad:'hora', precio: 9.00},
  'i:capitone'  : {t:'Insumo', label:'Capitoné/costura decorativa', unidad:'m2', precio:8.00},
  'i:perforado' : {t:'Insumo', label:'Perforado láser',   unidad:'m2',   precio:6.00},
  'i:bordado'   : {t:'Insumo', label:'Bordado',           unidad:'und',  precio:12.00},

  /* --- Dimension: los ejes de elección (= las pestañas de la UI) --- */
  'd:color'   : {t:'Dimension', label:'COLOR',    ambito:'zona',     ancho:1, def:'o:c_negro'},
  'd:patron'  : {t:'Dimension', label:'PATRÓN',   ambito:'zona',     ancho:1, def:'o:p_liso'},
  'd:costura' : {t:'Dimension', label:'COSTURA',  ambito:'zona',     ancho:1, def:'o:s_roja'},
  'd:bordado' : {t:'Dimension', label:'BORDADO',  ambito:'zona',     ancho:1, def:'o:b_no'},
  'd:material': {t:'Dimension', label:'MATERIAL', ambito:'producto', ancho:1, def:'o:mat_am'},
  'd:entrega' : {t:'Dimension', label:'ENTREGA',  ambito:'producto', ancho:1, def:'o:e_normal'},

  /* --- Opcion: ord es INMUTABLE (índice en la URL). Nunca se reusa. --- */
  'o:c_negro'    :{t:'Opcion',dim:'d:color',ord: 0,label:'Negro',    hex:'#111214'},
  'o:c_grisosc'  :{t:'Opcion',dim:'d:color',ord: 1,label:'Gris oscuro',hex:'#4d4f53'},
  'o:c_gris'     :{t:'Opcion',dim:'d:color',ord: 2,label:'Gris',     hex:'#85878a'},
  'o:c_beige'    :{t:'Opcion',dim:'d:color',ord: 3,label:'Beige',    hex:'#cdbb9b'},
  'o:c_cafe'     :{t:'Opcion',dim:'d:color',ord: 4,label:'Café',     hex:'#70462e'},
  'o:c_rojo'     :{t:'Opcion',dim:'d:color',ord: 5,label:'Rojo',     hex:'#c71d28'},
  'o:c_azul'     :{t:'Opcion',dim:'d:color',ord: 6,label:'Azul',     hex:'#164f9d'},
  'o:c_marino'   :{t:'Opcion',dim:'d:color',ord: 7,label:'Marino',   hex:'#162b4a'},
  'o:c_turquesa' :{t:'Opcion',dim:'d:color',ord: 8,label:'Turquesa', hex:'#1594a6'},
  'o:c_morado'   :{t:'Opcion',dim:'d:color',ord: 9,label:'Morado',   hex:'#6a3fa0'},
  'o:c_verde'    :{t:'Opcion',dim:'d:color',ord:10,label:'Verde',    hex:'#145a42'},
  'o:c_naranja'  :{t:'Opcion',dim:'d:color',ord:11,label:'Naranja',  hex:'#d86b1c'},
  'o:c_blanco'   :{t:'Opcion',dim:'d:color',ord:12,label:'Blanco',   hex:'#e9e9e6'},
  'o:c_borgona'  :{t:'Opcion',dim:'d:color',ord:13,label:'Borgoña',  hex:'#641c2a'},

  'o:p_liso'      :{t:'Opcion',dim:'d:patron',ord:0,label:'Liso',      svg:null},
  'o:p_diamante'  :{t:'Opcion',dim:'d:patron',ord:1,label:'Diamante',  svg:'pDiamond'},
  'o:p_hexagonal' :{t:'Opcion',dim:'d:patron',ord:2,label:'Hexagonal', svg:'pHex'},
  'o:p_deportivo' :{t:'Opcion',dim:'d:patron',ord:3,label:'Deportivo', svg:'pChevron'},
  'o:p_perforado' :{t:'Opcion',dim:'d:patron',ord:4,label:'Perforado', svg:'pDots'},

  'o:s_roja'     :{t:'Opcion',dim:'d:costura',ord:0,label:'Roja',    hex:'#e50914'},
  'o:s_blanca'   :{t:'Opcion',dim:'d:costura',ord:1,label:'Blanca',  hex:'#ffffff'},
  'o:s_negra'    :{t:'Opcion',dim:'d:costura',ord:2,label:'Negra',   hex:'#111111'},
  'o:s_azul'     :{t:'Opcion',dim:'d:costura',ord:3,label:'Azul',    hex:'#2776db'},
  'o:s_beige'    :{t:'Opcion',dim:'d:costura',ord:4,label:'Beige',   hex:'#d7b986'},
  'o:s_turquesa' :{t:'Opcion',dim:'d:costura',ord:5,label:'Turquesa',hex:'#1594a6'},
  'o:s_morada'   :{t:'Opcion',dim:'d:costura',ord:6,label:'Morada',  hex:'#6a3fa0'},
  'o:s_gris'     :{t:'Opcion',dim:'d:costura',ord:7,label:'Gris',    hex:'#9a9ba0'},

  'o:b_no'    :{t:'Opcion',dim:'d:bordado',ord:0,label:'Sin bordado'},
  'o:b_marca' :{t:'Opcion',dim:'d:bordado',ord:1,label:'FORROS CUENCA'},
  'o:b_nombre':{t:'Opcion',dim:'d:bordado',ord:2,label:'Nombre del cliente', pideTexto:true},
  'o:b_logo'  :{t:'Opcion',dim:'d:bordado',ord:3,label:'Logo personalizado', pideTexto:true},

  'o:mat_am' :{t:'Opcion',dim:'d:material',ord:0,label:'Cuero Americano', desc:'Importado, acabado suave y uniforme.'},
  'o:mat_col':{t:'Opcion',dim:'d:material',ord:1,label:'Cuero Colombiano',desc:'Nacional, grano marcado, mejor precio.'},

  'o:e_normal' :{t:'Opcion',dim:'d:entrega',ord:0,label:'Entrega normal (5 días)'},
  'o:e_express':{t:'Opcion',dim:'d:entrega',ord:1,label:'Entrega express (48 h)'},

  /* --- Producto --- */
  'p:auto'    :{t:'Producto',ord:0,label:'Auto',          svg:'seat',     min:120},
  'p:moto'    :{t:'Producto',ord:1,label:'Moto',          svg:'seat-moto',min: 35},
  'p:suv'     :{t:'Producto',ord:2,label:'Camioneta/SUV', svg:'seat',     min:150},
  'p:tablero' :{t:'Producto',ord:3,label:'Tablero',       svg:'dash',     min: 60},
  'p:techo'   :{t:'Producto',ord:4,label:'Techo',         svg:'roof',     min: 70},

  /* --- Zona (m2 y horas son los multiplicadores del precio) --- */
  'z:m_piloto'   :{t:'Zona',ord:0,label:'Asiento piloto',  m2:0.42,horas:1.2,svg:['moto_piloto']},
  'z:m_copiloto' :{t:'Zona',ord:1,label:'Asiento copiloto',m2:0.26,horas:0.8,svg:['moto_copiloto']},
  'z:m_laterales':{t:'Zona',ord:2,label:'Laterales',       m2:0.30,horas:0.9,svg:['moto_sidesL','moto_sidesR']},
  'z:m_ridge'    :{t:'Zona',ord:3,label:'Borde / Acento',  m2:0.08,horas:0.4,svg:['moto_ridge']},

  'z:a_respaldo' :{t:'Zona',ord:0,label:'Frontal respaldo',m2:0.55,horas:1.6,svg:['back']},
  'z:a_laterales':{t:'Zona',ord:1,label:'Laterales',       m2:0.40,horas:1.4,svg:['side','sideR']},
  'z:a_base'     :{t:'Zona',ord:2,label:'Centro base',     m2:0.50,horas:1.5,svg:['base']},
  'z:a_cabecera' :{t:'Zona',ord:3,label:'Cabecera',        m2:0.22,horas:0.7,svg:['head']},
  'z:a_bordes'   :{t:'Zona',ord:4,label:'Bordes base',     m2:0.18,horas:0.6,svg:['edge']},
  'z:a_apoyabr'  :{t:'Zona',ord:5,label:'Apoyabrazos',     m2:0.14,horas:0.5,svg:['arm']},
  'z:a_tercera'  :{t:'Zona',ord:6,label:'Tercera fila',    m2:0.90,horas:2.4,svg:['row3']},

  'z:t_superior' :{t:'Zona',ord:0,label:'Cubierta superior',m2:0.60,horas:2.0,svg:['dash_top']},
  'z:t_frontal'  :{t:'Zona',ord:1,label:'Frontal',          m2:0.45,horas:1.8,svg:['dash_front']},
  'z:t_laterales':{t:'Zona',ord:2,label:'Laterales/puertas',m2:0.70,horas:2.2,svg:['dash_sides']},

  'z:c_centro'   :{t:'Zona',ord:0,label:'Paño central',     m2:2.10,horas:3.0,svg:['roof_center']},
  'z:c_pilares'  :{t:'Zona',ord:1,label:'Pilares',          m2:0.50,horas:1.2,svg:['roof_pillars']},
  'z:c_viseras'  :{t:'Zona',ord:2,label:'Visera/parasoles', m2:0.20,horas:0.6,svg:['roof_visors']},

  /* --- ReglaDePrecio (fase: 0 base, 1 aditivo, 2 %, 3 descuento, 4 piso) --- */
  'r:material'  :{t:'Regla',kind:'insumo',   fase:0,label:'Material'},
  'r:confeccion':{t:'Regla',kind:'insumo',   fase:0,label:'Confección'},
  'r:capitone'  :{t:'Regla',kind:'insumo',   fase:1,label:'Capitoné'},
  'r:perforado' :{t:'Regla',kind:'insumo',   fase:1,label:'Perforado'},
  'r:bordado'   :{t:'Regla',kind:'insumo',   fase:1,label:'Bordado'},
  'r:prep_moto' :{t:'Regla',kind:'fijo',     fase:1,label:'Desmontaje y preparación', monto:15},
  'r:prep_auto' :{t:'Regla',kind:'fijo',     fase:1,label:'Desmontaje y preparación', monto:30},
  'r:desmonte_t':{t:'Regla',kind:'fijo',     fase:1,label:'Desmontaje de cielo raso',  monto:35},
  'r:express'   :{t:'Regla',kind:'porcentaje',fase:2,label:'Recargo entrega express', pct:0.15},
  'r:combo'     :{t:'Regla',kind:'combo',    fase:3,label:'Combo interior completo',  pct:0.10,
                  requiere:['p:auto','p:tablero','p:techo']}
};

/* ---------- 2. ARISTAS: [origen, TIPO, destino, props] ---------- */
const A = [
  /* -- EXTIENDE: SUV hereda todo el auto y agrega/ajusta zonas -- */
  ['p:suv','EXTIENDE','p:auto',{}],

  /* -- TIENE: Producto -> Zona -- */
  ['p:moto','TIENE','z:m_piloto',{}], ['p:moto','TIENE','z:m_copiloto',{}],
  ['p:moto','TIENE','z:m_laterales',{}], ['p:moto','TIENE','z:m_ridge',{}],

  ['p:auto','TIENE','z:a_respaldo',{}], ['p:auto','TIENE','z:a_laterales',{}],
  ['p:auto','TIENE','z:a_base',{}], ['p:auto','TIENE','z:a_cabecera',{}],
  ['p:auto','TIENE','z:a_bordes',{}],

  ['p:suv','TIENE','z:a_apoyabr',{}], ['p:suv','TIENE','z:a_tercera',{}],
  ['p:suv','TIENE','z:a_base',{m2:0.62,horas:1.8}],   // override: banca más ancha

  ['p:tablero','TIENE','z:t_superior',{}], ['p:tablero','TIENE','z:t_frontal',{}],
  ['p:tablero','TIENE','z:t_laterales',{}],
  ['p:techo','TIENE','z:c_centro',{}], ['p:techo','TIENE','z:c_pilares',{}],
  ['p:techo','TIENE','z:c_viseras',{}],

  /* -- ACEPTA: Zona -> Dimension. La AUSENCIA es la regla estructural. -- */
  ...['z:m_piloto','z:m_copiloto','z:a_respaldo','z:a_laterales','z:a_base',
      'z:a_cabecera','z:a_apoyabr','z:a_tercera','z:t_superior','z:t_frontal',
      'z:t_laterales','z:c_centro','z:c_pilares']
     .flatMap(z=>[[z,'ACEPTA','d:color',{}],[z,'ACEPTA','d:patron',{}],[z,'ACEPTA','d:costura',{}]]),
  // zonas angostas: sólo color + costura (sin patrón)
  ...['z:m_laterales','z:m_ridge','z:a_bordes','z:c_viseras']
     .flatMap(z=>[[z,'ACEPTA','d:color',{}],[z,'ACEPTA','d:costura',{}]]),
  // BORDADO sólo en estas zonas -> no hay if, simplemente no hay arista en las demás
  ['z:m_piloto','ACEPTA','d:bordado',{}],
  ['z:a_respaldo','ACEPTA','d:bordado',{}],
  ['z:a_cabecera','ACEPTA','d:bordado',{}],
  ['z:t_frontal','ACEPTA','d:bordado',{}],

  /* -- ACEPTA a nivel producto -- */
  ...['p:auto','p:moto','p:suv','p:tablero','p:techo']
     .flatMap(p=>[[p,'ACEPTA','d:material',{}],[p,'ACEPTA','d:entrega',{}]]),

  /* -- COMPARTE_COSTURA_CON: clase de equivalencia, se propaga al elegir -- */
  ['z:m_piloto','COMPARTE_COSTURA_CON','z:m_copiloto',{dims:['d:costura']}],
  ['z:a_respaldo','COMPARTE_COSTURA_CON','z:a_base',{dims:['d:costura']}],
  ['z:a_laterales','COMPARTE_COSTURA_CON','z:a_bordes',{dims:['d:costura','d:color']}],
  ['z:c_centro','COMPARTE_COSTURA_CON','z:c_pilares',{dims:['d:costura','d:color']}],

  /* -- INCOMPATIBLE_CON: todas las prohibiciones del negocio, como datos -- */
  ['p:techo','INCOMPATIBLE_CON','o:p_perforado',
    {motivo:'El perforado no se usa en cielo raso: filtra polvo y humedad.'}],
  ['p:techo','INCOMPATIBLE_CON','o:p_diamante',
    {motivo:'El capitoné en techo se descuelga con el calor.'}],
  ['z:m_ridge','INCOMPATIBLE_CON','o:p_diamante',
    {motivo:'El acento es muy angosto para capitoné.'}],
  ['z:t_superior','INCOMPATIBLE_CON','o:p_perforado',
    {motivo:'La cubierta del tablero recibe sol directo; el perforado se deforma.'}],
  ['o:mat_col','INCOMPATIBLE_CON','o:p_perforado',
    {ambito:'config', motivo:'El perforado sólo se hace en cuero americano.'}],
  ['o:c_negro','INCOMPATIBLE_CON','o:s_negra',
    {ambito:'zona', motivo:'Costura negra sobre cuero negro no se aprecia.'}],
  ['o:c_blanco','INCOMPATIBLE_CON','o:s_blanca',
    {ambito:'zona', motivo:'Costura blanca sobre cuero blanco no se aprecia.'}],

  /* -- REQUIERE: dependencia positiva -- */
  ['o:p_perforado','REQUIERE','o:mat_am',
    {ambito:'config', motivo:'El perforado requiere cuero americano.'}],

  /* -- SUMA_PRECIO: quién dispara qué regla -- */
  ['o:mat_am','SUMA_PRECIO','r:material',{}],
  ['o:mat_col','SUMA_PRECIO','r:material',{}],
  ['p:auto','SUMA_PRECIO','r:confeccion',{}], ['p:moto','SUMA_PRECIO','r:confeccion',{}],
  ['p:suv','SUMA_PRECIO','r:confeccion',{}], ['p:tablero','SUMA_PRECIO','r:confeccion',{}],
  ['p:techo','SUMA_PRECIO','r:confeccion',{}],
  ['o:p_diamante','SUMA_PRECIO','r:capitone',{}],
  ['o:p_hexagonal','SUMA_PRECIO','r:capitone',{}],
  ['o:p_deportivo','SUMA_PRECIO','r:capitone',{}],
  ['o:p_perforado','SUMA_PRECIO','r:perforado',{}],
  ['o:b_marca','SUMA_PRECIO','r:bordado',{}],
  ['o:b_nombre','SUMA_PRECIO','r:bordado',{}],
  ['o:b_logo','SUMA_PRECIO','r:bordado',{}],
  ['p:moto','SUMA_PRECIO','r:prep_moto',{}],
  ['p:auto','SUMA_PRECIO','r:prep_auto',{}], ['p:suv','SUMA_PRECIO','r:prep_auto',{}],
  ['p:techo','SUMA_PRECIO','r:desmonte_t',{}],
  ['o:e_express','SUMA_PRECIO','r:express',{}],

  /* -- CONSUME: Regla -> Insumo. medida = con qué se multiplica. -- */
  ['r:material','CONSUME','i:cuero_am',  {medida:'m2', cant:1.15, si:'o:mat_am'}],   // 15% desperdicio
  ['r:material','CONSUME','i:cuero_col', {medida:'m2', cant:1.15, si:'o:mat_col'}],
  ['r:confeccion','CONSUME','i:mano_obra',{medida:'horas', cant:1}],
  ['r:capitone','CONSUME','i:capitone',  {medida:'m2', cant:1}],
  ['r:perforado','CONSUME','i:perforado',{medida:'m2', cant:1}],
  ['r:bordado','CONSUME','i:bordado',    {medida:'zonas', cant:1}]
];

/* =========================================================================
   3. MOTOR
   ========================================================================= */
const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const IDX = {out:{}, inn:{}};
for (const [o,t,d,p={}] of A){
  ((IDX.out[t] ??= {})[o] ??= []).push({n:d,p});
  ((IDX.inn[t] ??= {})[d] ??= []).push({n:o,p});
}
const sal = (t,n) => (IDX.out[t]?.[n]) || [];
const ent = (t,n) => (IDX.inn[t]?.[n]) || [];

// simetría opción<->opción de INCOMPATIBLE_CON (se declara una vez, vale en ambos sentidos)
for (const [o,t,d,p={}] of [...A]) {
  if (t==='INCOMPATIBLE_CON' && N[o].t==='Opcion')
    ((IDX.out.INCOMPATIBLE_CON[d] ??= [])).push({n:o,p});
}

/** Zonas efectivas de un producto: herencia por EXTIENDE, override por id. */
function zonasDe(pid){
  const cadena = []; for (let c=pid; c; c = sal('EXTIENDE',c)[0]?.n) cadena.unshift(c);
  const m = new Map();
  for (const p of cadena)
    for (const {n,p:props} of sal('TIENE',p))
      props.quita ? m.delete(n) : m.set(n, {...N[n], ...props, id:n});
  return [...m.values()].sort((a,b)=>a.ord-b.ord);
}
const dimsDe   = n => sal('ACEPTA',n).map(e=>e.n);
const opcsDe   = d => Object.keys(N).filter(k=>N[k].t==='Opcion'&&N[k].dim===d)
                            .sort((a,b)=>N[a].ord-N[b].ord);

/** Rellena toda elección faltante con el default de su dimensión. */
function normalizar(cfg){
  const c = {producto:cfg.producto, global:{...cfg.global}, zonas:{}, texto:cfg.texto||''};
  for (const d of dimsDe(cfg.producto)) c.global[d] ??= N[d].def;
  for (const z of zonasDe(cfg.producto)){
    c.zonas[z.id] = {};
    for (const d of dimsDe(z.id)) c.zonas[z.id][d] = cfg.zonas?.[z.id]?.[d] ?? N[d].def;
  }
  return c;
}

/** Todas las opciones elegidas + producto + zonas = el "contexto" de la config. */
function contexto(cfg){
  const s = new Set([cfg.producto, ...Object.keys(cfg.zonas)]);
  Object.values(cfg.global).forEach(v=>s.add(v));
  for (const z of Object.values(cfg.zonas)) Object.values(z).forEach(v=>s.add(v));
  return s;
}

/** Ámbito por defecto: una Zona sólo veta dentro de sí misma; Producto/Opción vetan global. */
const ambitoDe = (fuente, p) => p.ambito ?? (N[fuente].t === 'Zona' ? 'zona' : 'config');

/** Opciones válidas para (zona,dim). Un solo barrido de aristas, cero ifs anidados. */
function opcionesValidas(cfg, zonaId, dimId){
  cfg = normalizar(cfg);
  const cand = new Set(opcsDe(dimId));
  const enConfig = contexto(cfg);                                     // ámbito 'config'
  const enZona = new Set([cfg.producto, zonaId,                       // ámbito 'zona'
                          ...Object.values(cfg.zonas[zonaId] || {}),
                          ...Object.values(cfg.global)]);
  const activo = (f,p) => (ambitoDe(f,p)==='zona' ? enZona : enConfig).has(f);
  const motivos = {};
  for (const f of enConfig)                                           // prohibiciones
    for (const {n,p} of sal('INCOMPATIBLE_CON', f))
      if (activo(f,p) && cand.has(n)) { cand.delete(n); motivos[n] = p.motivo; }
  for (const o of [...cand])                                          // REQUIERE insatisfecho
    for (const {n,p} of sal('REQUIERE', o)) {
      const universo = ambitoDe(o,p)==='zona' ? enZona : enConfig;
      if (!universo.has(n)) { cand.delete(o); motivos[o] = p.motivo; }
    }
  return {validas:[...cand], motivos};
}

/** Conflictos de una config completa (para reparar antes de cotizar). */
function validar(cfg){
  cfg = normalizar(cfg); const out=[];
  for (const z of zonasDe(cfg.producto))
    for (const d of dimsDe(z.id)){
      const el = cfg.zonas[z.id][d];
      const {validas,motivos} = opcionesValidas(cfg, z.id, d);
      if (!validas.includes(el))
        out.push({zona:z.id, dim:d, elegida:el, motivo:motivos[el]||'No disponible',
                  sugerido: validas.includes(N[d].def) ? N[d].def : validas[0]});
    }
  return out;
}
/** Reparación automática: cae al default de la dimensión, o a la 1ra válida. */
function reparar(cfg){
  let c = normalizar(cfg), pasos=[], guard=0;
  while (guard++ < 20){
    const cf = validar(c); if (!cf.length) break;
    for (const x of cf){ c.zonas[x.zona][x.dim]=x.sugerido; pasos.push(x); }
  }
  return {cfg:c, pasos};
}

/** Propagación por COMPARTE_COSTURA_CON (clase de equivalencia no dirigida). */
function elegir(cfg, zonaId, dimId, opId){
  const grupo = new Set([zonaId]), cola=[zonaId];
  while (cola.length){
    const z = cola.pop();
    for (const {n,p} of [...sal('COMPARTE_COSTURA_CON',z), ...ent('COMPARTE_COSTURA_CON',z)])
      if ((p.dims||['d:costura']).includes(dimId) && !grupo.has(n)) { grupo.add(n); cola.push(n); }
  }
  for (const z of grupo) if (dimsDe(z).includes(dimId)) (cfg.zonas[z] ??= {})[dimId]=opId;
  return [...grupo];
}

/** Alcance de una regla: sobre qué zonas se multiplica, según de quién cuelga. */
function alcance(ctxNodo, cfg, zonas){
  const T = N[ctxNodo].t;
  if (T==='Producto') return zonas;
  if (T==='Zona')     return zonas.filter(z=>z.id===ctxNodo);
  if (N[ctxNodo].dim && N[N[ctxNodo].dim].ambito==='producto') return zonas;   // material/entrega
  return zonas.filter(z=>Object.values(cfg.zonas[z.id]||{}).includes(ctxNodo));
}
const medir = zs => ({zonas:zs.length, m2:zs.reduce((a,z)=>a+z.m2,0),
                                       horas:zs.reduce((a,z)=>a+z.horas,0)});

/** PRECIO: recorre el grafo, devuelve desglose (lo que cierra la venta). */
function precio(cfg){
  cfg = normalizar(cfg);
  const zonas = zonasDe(cfg.producto);
  const ctx = contexto(cfg);
  const disparos = [];
  for (const nodo of ctx)
    for (const {n:regla} of sal('SUMA_PRECIO', nodo)) disparos.push({regla, nodo});
  disparos.sort((a,b)=>N[a.regla].fase - N[b.regla].fase);

  let total = 0; const lineas = [];
  for (const {regla, nodo} of disparos){
    const R = N[regla], m = medir(alcance(nodo, cfg, zonas));
    let monto = 0, detalle = '';
    if (R.kind==='fijo')       { monto = R.monto; }
    if (R.kind==='porcentaje') { monto = total * R.pct; detalle = `${R.pct*100}%`; }
    if (R.kind==='insumo')
      for (const {n:ins, p} of sal('CONSUME', regla)){
        if (p.si && !ctx.has(p.si)) continue;
        const q = m[p.medida] * p.cant;
        monto += q * N[ins].precio;
        detalle = `${q.toFixed(2)} ${N[ins].unidad} x $${N[ins].precio}`;
      }
    if (!monto) continue;
    monto = Math.round(monto*100)/100; total += monto;
    lineas.push({regla, label:R.label, ctx:N[nodo].label, detalle, monto});
  }
  const min = N[cfg.producto].min;
  if (total < min){ lineas.push({label:'Ajuste a mínimo de taller', monto:+(min-total).toFixed(2)}); total = min; }
  return {total:+total.toFixed(2), lineas};
}

/** Cotización multi-producto (combo = descuento por conjunto). */
function precioCotizacion(cfgs){
  const partes = cfgs.map(c=>({cfg:c, ...precio(c)}));
  let total = partes.reduce((a,p)=>a+p.total,0);
  const ids = new Set(cfgs.map(c=>c.producto)), extras=[];
  for (const k of Object.keys(N)) {
    const R = N[k];
    if (R.t==='Regla' && R.kind==='combo' && R.requiere.every(x=>ids.has(x))){
      const d = -Math.round(total*R.pct*100)/100;
      extras.push({label:R.label, monto:d}); total += d;
    }
  }
  return {total:+total.toFixed(2), partes, extras};
}

/* ---------- 4. SERIALIZACIÓN A URL ---------- */
/* Layout canónico: [dims producto] + [por zona.ord][dims zona en orden canónico] */
const ORDEN_DIM = ['d:color','d:patron','d:costura','d:bordado'];
function layout(pid){
  const slots = dimsDe(pid).map(d=>({zona:null, dim:d}));
  for (const z of zonasDe(pid))
    for (const d of ORDEN_DIM.filter(x=>dimsDe(z.id).includes(x)))
      slots.push({zona:z.id, dim:d});
  return slots;
}
function codificar(cfg){
  const s = layout(cfg.producto).map(({zona,dim}) => {
    const id = zona ? (cfg.zonas[zona]?.[dim] ?? N[dim].def) : (cfg.global?.[dim] ?? N[dim].def);
    return AB[N[id].ord];
  }).join('');
  const cuerpo = AB[N[cfg.producto].ord] + s;
  const chk = AB[[...cuerpo].reduce((a,c)=>(a+AB.indexOf(c))%64,0)];
  return '1' + cuerpo + chk + (cfg.texto ? '~'+encodeURIComponent(cfg.texto) : '');
}
function decodificar(str){
  const [core, txt] = str.split('~');
  if (core[0] !== '1') throw new Error('versión desconocida');
  const cuerpo = core.slice(1,-1), chk = core.at(-1);
  const ok = AB[[...cuerpo].reduce((a,c)=>(a+AB.indexOf(c))%64,0)] === chk;
  const pid = Object.keys(N).find(k=>N[k].t==='Producto' && N[k].ord===AB.indexOf(cuerpo[0]));
  const cfg = {producto:pid, global:{}, zonas:{}, texto: txt?decodeURIComponent(txt):''};
  layout(pid).forEach(({zona,dim}, i) => {
    const ch = cuerpo[i+1];                                  // faltante -> default (tolerante)
    const ord = ch===undefined ? -1 : AB.indexOf(ch);
    const id = opcsDe(dim).find(o=>N[o].ord===ord) ?? N[dim].def;
    zona ? ((cfg.zonas[zona] ??= {})[dim]=id) : (cfg.global[dim]=id);
  });
  return {cfg, checksumOk:ok};
}

/* =========================================================================
   PRUEBAS
   ========================================================================= */
const cfgMoto = {
  producto:'p:moto',
  global:{'d:material':'o:mat_am','d:entrega':'o:e_express'},
  zonas:{
    'z:m_piloto'   :{'d:color':'o:c_negro','d:patron':'o:p_diamante','d:costura':'o:s_roja','d:bordado':'o:b_nombre'},
    'z:m_copiloto' :{'d:color':'o:c_negro','d:patron':'o:p_perforado','d:costura':'o:s_roja'},
    'z:m_laterales':{'d:color':'o:c_rojo','d:costura':'o:s_blanca'},
    'z:m_ridge'    :{'d:color':'o:c_rojo','d:costura':'o:s_blanca'}
  },
  texto:'Jairo'
};

console.log('=== ZONAS MOTO ==='); console.log(zonasDe('p:moto').map(z=>z.label).join(' | '));
console.log('=== ZONAS SUV (hereda auto) ==='); console.log(zonasDe('p:suv').map(z=>`${z.label}[${z.m2}m2]`).join(' | '));

console.log('\n=== PRECIO MOTO ===');
const pm = precio(cfgMoto);
pm.lineas.forEach(l=>console.log(`  ${(l.label+' · '+(l.ctx||'')).padEnd(46)} ${String(l.detalle||'').padEnd(22)} $${l.monto.toFixed(2)}`));
console.log('  TOTAL  $'+pm.total.toFixed(2));

console.log('\n=== VALIDEZ ===');
const L = r => r.validas.map(o=>N[o].label).join(', ');
console.log('dims ofrecidas z:m_ridge (sin patrón, sin bordado) ->', dimsDe('z:m_ridge').join(','));
console.log('dims ofrecidas z:m_piloto                          ->', dimsDe('z:m_piloto').join(','));
console.log('patrón en z:m_ridge  (diamante vetado por la zona) ->', L(opcionesValidas(cfgMoto,'z:m_ridge','d:patron')));
console.log('patrón en z:m_piloto (NO debe filtrarse el veto)   ->', L(opcionesValidas(cfgMoto,'z:m_piloto','d:patron')));
console.log('costura en piloto, cuero negro (sin Negra)         ->', L(opcionesValidas(cfgMoto,'z:m_piloto','d:costura')));
console.log('costura en laterales, cuero rojo (con Negra)       ->', L(opcionesValidas(cfgMoto,'z:m_laterales','d:costura')));
console.log('patrón en techo (perforado+diamante vetados)       ->', L(opcionesValidas({producto:'p:techo',global:{},zonas:{}},'z:c_centro','d:patron')));
console.log('config limpia sin conflictos                       ->', validar(cfgMoto).length===0);

const cfgCol = structuredClone(cfgMoto); cfgCol.global['d:material']='o:mat_col';
console.log('\n=== CAMBIO A CUERO COLOMBIANO (rompe el perforado) ===');
console.log('conflictos:', validar(cfgCol).map(c=>`${N[c.zona].label}/${N[c.dim].label}: ${c.motivo} -> ${N[c.sugerido].label}`));
const rep = reparar(cfgCol);
console.log('reparado ->', rep.cfg.zonas['z:m_copiloto']['d:patron'], '| nuevo total $'+precio(rep.cfg).total);

console.log('\n=== PROPAGACIÓN COSTURA ===');
const c2 = structuredClone(cfgMoto);
console.log('grupo tocado:', elegir(c2,'z:m_piloto','d:costura','o:s_turquesa').map(z=>N[z].label).join(' + '));
console.log('copiloto ahora:', N[c2.zonas['z:m_copiloto']['d:costura']].label);

console.log('\n=== URL ===');
const url = codificar(cfgMoto);
console.log('?c='+url, `(${url.length} chars)`);
const back = decodificar(url);
console.log('checksum ok:', back.checksumOk);
console.log('round-trip idéntico:', JSON.stringify(back.cfg.zonas)===JSON.stringify(cfgMoto.zonas)
  && back.cfg.producto===cfgMoto.producto && back.cfg.texto===cfgMoto.texto);
console.log('precio reconstruido:', precio(back.cfg).total);
console.log('tolerante a truncado:', (()=>{ const t=decodificar('1'+url.slice(1,8)+'A'); return N[t.cfg.producto].label+' zonas='+Object.keys(t.cfg.zonas).length; })());

console.log('\n=== COTIZACIÓN COMBO ===');
const cfgAuto  = {producto:'p:auto', global:{'d:material':'o:mat_am','d:entrega':'o:e_normal'}, zonas:{}};
const cfgTab   = {producto:'p:tablero', global:{'d:material':'o:mat_am','d:entrega':'o:e_normal'}, zonas:{}};
const cfgTecho = {producto:'p:techo', global:{'d:material':'o:mat_col','d:entrega':'o:e_normal'}, zonas:{}};
const q = precioCotizacion([cfgAuto,cfgTab,cfgTecho]);
q.partes.forEach(p=>console.log(`  ${N[p.cfg.producto].label.padEnd(12)} $${p.total.toFixed(2)}`));
q.extras.forEach(e=>console.log(`  ${e.label.padEnd(12)} $${e.monto.toFixed(2)}`));
console.log('  TOTAL COTIZACIÓN $'+q.total.toFixed(2));

console.log('\n=== SENSIBILIDAD: sube el cuero americano de $18 a $22 ===');
N['i:cuero_am'].precio = 22;
console.log('moto ahora: $'+precio(cfgMoto).total);

console.log('\n=== URL: tamaño por producto + detección de corrupción ===');
for (const p of ['p:auto','p:moto','p:suv','p:tablero','p:techo']){
  const u = codificar({producto:p, global:{}, zonas:{}});
  console.log(`  ${N[p].label.padEnd(14)} slots=${String(layout(p).length).padEnd(3)} url=${u} (${u.length})`);
}
const bueno = codificar(cfgMoto);
const malo  = bueno.slice(0,4) + 'Z' + bueno.slice(5);   // WhatsApp mutila un caracter
console.log('  url intacta  -> checksumOk', decodificar(bueno).checksumOk);
console.log('  url alterada -> checksumOk', decodificar(malo).checksumOk, '(la UI avisa y usa defaults)');
