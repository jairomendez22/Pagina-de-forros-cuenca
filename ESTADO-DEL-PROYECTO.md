# Estado del proyecto — Forros Cuenca

> **Léeme primero si abres una conversación nueva.**
> Este archivo es el traspaso completo: qué hay hecho, cómo está armado el
> código, qué ya se probó y falló, y qué queda pendiente.
> Última actualización: 1 de septiembre de 2026 (galería agrupada por forro).

---

## 1. Qué es esto

Sitio web público de **Forros Cuenca**, taller de tapizados para autos y
camionetas en **Machala, provincia de El Oro**, Ecuador, activo **desde
2002**. Dueño: Jairo Méndez.

> **Ojo con el nombre:** la marca se llama *Forros Cuenca*, pero el almacén
> está en **Machala**, no en Cuenca (corregido el 29 ago 2026). El nombre,
> el dominio `forroscuenca.com` y las redes `@FORROSCUENCA` se mantienen
> tal cual: son la marca. Lo que apunta a Machala es todo lo geográfico —
> title, h1, descripciones, el JSON-LD (`addressLocality`, `addressRegion`
> con **El Oro**, no Azuay) y el texto indexable.
Contacto del negocio: WhatsApp **0984353695** (`593984353695`).
Redes: **@FORROSCUENCA** en Instagram, Facebook y TikTok.
Dominio: **forroscuenca.com** (comprado 21 ago 2026). **PUBLICADO** en
GitHub Pages desde el 1 sep 2026 — ver §8.

El corazón del sitio es un **configurador**: el cliente elige vehículo,
color, patrón, costura, modelo de diseño y material, ve el asiento
dibujarse en vivo, y cotiza por WhatsApp con el resumen ya escrito.

---

## 2. EL ARCHIVO VIVO ES `index.html`

Esto es lo primero que hay que saber, porque es fácil equivocarse:

| Archivo | Qué es |
|---|---|
| **`index.html`** | **El sitio actual. Aquí se edita.** ~124 KB, un solo archivo. |
| `APP FORROS CEUNCA.html` | El original de Jairo, de antes de todo. **No editar.** |
| `_respaldo/APP FORROS CEUNCA.original.html` | Copia intacta del original. |
| `_respaldo/index.*.html` | 20 respaldos secuenciales, uno por hito. |
| `SUBIR A LA WEB/` | Copia lista para el hosting. Ver §8. |

> Si el editor tiene abierto `APP FORROS CEUNCA.html`, está mirando el
> archivo viejo. El bueno es `index.html`.

---

## 3. Mapa de carpetas

```
app forros cuenca/
├─ index.html                    ← EL SITIO (editar aquí)
├─ SUBIR A LA WEB/               ← 57 archivos, 2,2 MB, listo para subir
│   ├─ index.html                (copia idéntica a la raíz)
│   ├─ logo-forros-cuenca.png
│   ├─ og-forros-cuenca.jpg      (tarjeta de WhatsApp/redes, 1200×630)
│   ├─ fotos/                    (36 archivos = 18 fotos × 2 tamaños)
│   ├─ disenos/                  (16 archivos = 8 modelos × 2 tamaños)
│   ├─ LEEME.txt                 (qué subir, qué NO subir, checklist)
│   └─ COMO-SUBIRLO.txt          (pasos exactos: Cloudflare o cPanel)
│
├─ fotos/                        galería procesada (fuente de SUBIR A LA WEB)
├─ disenos/                      los 8 modelos de diseño, fotografiados
├─ muestras/                     13 muestrarios de cuero normalizados
├─ _respaldo/                    versiones anteriores (ver §2)
├─ catalogo-grafo.js             prototipo ejecutable del grafo de dominio
├─ contorno-forro-trazado.svg    trazado potrace del forro de cojín (auto)
├─ referencia-auto-trazada.svg   trazado potrace del asiento de auto
├─ package.json                  herramientas de desarrollo (NO se sube)
├─ resumen_cambios.md            bitácora inicial de Jairo
└─ .claude/skills/impeccable/    detector de anti-patrones de frontend
```

**Nada de lo anterior se sube al hosting salvo `SUBIR A LA WEB/`.**
Materia prima que se queda en el Mac: `node_modules/` (95 MB),
`CATALOGO FORROS CEUCNA/` (85 MB), `Fotos para app de forros cuenca/`
(78 MB, los HEIC originales), `Nuevas fotos/`, los tres `.MOV`.

---

## 4. Cómo está armado `index.html`

> **Mapa detallado:** `PLANO-DEL-CONFIGURADOR.html` (ábrelo en el navegador)
> tiene el árbol de componentes, el grafo de flujo de estado, la cascada de
> repintado, la capa de tokens y el plan de desacoplamiento — con los 5
> defectos reales que encontró el análisis del 23 ago 2026. También publicado
> en https://claude.ai/code/artifact/3b6a86bb-e93e-400d-be03-318499c1feb8


Un solo archivo, sin build, sin dependencias. Orden interno:

| Líneas | Qué hay |
|---|---|
| 1–35 | `<head>`: metas, canonical, Open Graph, Twitter, favicon en data-URI, Google Fonts (Poppins) |
| 36–262 | `<style>` completo (~16 KB) |
| 263–304 | JSON-LD `AutoRepair` para Google |
| 305–495 | `<svg id="fx">` — **paint servers compartidos** (gradientes, patrones, filtros) |
| 496–518 | `<header>` + barra de vehículos + barra de restauración |
| 519–710 | `<main>`: los tres SVG de escenario + panel de opciones |
| 711–739 | Galería "Trabajos que ya entregamos" (18 fotos) |
| 740–798 | Sección de información / texto indexable |
| 799–808 | `<footer>` + barra fija de cotizar |
| 809–1839 | `<script>` — toda la lógica |

### 4.1 El catálogo es dato, no código

Toda la app se configura con tablas. **Agregar un producto = una entrada
en `PRODUCTS` + su SVG. No hay `if` por producto en ningún lado.**

```
línea  857  COLORS         12 colores; [nombre, hex, enStock]
línea  876  PATTERNS       7 patrones; cada uno apunta a un <pattern> del <svg id="fx">
línea  900  MATERIALES     por FAMILIA (forro / tablero / techo / piso)
línea  946  PRECIOS        "desde" por producto + nota legal
línea  968  PRODUCTS       los 6 productos, sus partes y sus zonas
línea 1009  INCOMPATIBLES  reglas del tipo "puntos no va en pisos"
línea 1026  DISENOS        los 8 modelos de diseño
línea 1148  RELIEVE        tabla que genera la capa de realismo
línea 1504  PRESETS        combinaciones de arranque
```

### 4.2 Convención de identificadores

`${producto}__${zona}` — por ejemplo `auto__back`, `moto__seams-sides`.
Doble guión bajo, siempre. Es lo que permite que tres SVG distintos
convivan en el mismo documento sin chocar.

### 4.3 Funciones principales

```
mountVehicleBar()      pinta la barra de productos
mountLabels()          números sobre las partes del asiento
mountGrainClips()      recorta el grano a la silueta
mountRelieve()         capa de realismo: almohadillas y volumen
mountCosturaVolumen()  valles y labios de cada costura
mountZoneHandlers()    hace clicables las zonas
setProduct(id)         cambia de vehículo
render()               repinta el panel de opciones
paint()                aplica color/patrón/costura al SVG
renderPrice()          calcula el "desde"
codificar()/decodificar()  el enlace compartible ?d=
guardar()/restaurar()  persistencia en localStorage
enviarWhatsApp()       arma el mensaje y abre el chat
```

---

## 4.4 Arreglos del 24 ago 2026

Cuatro defectos encontrados por el mapeo de arquitectura y corregidos.
Respaldo previo en `_respaldo/index.antes-4arreglos.html`.

1. **`mountGrainClips` L1138** — decía
   `(svg.querySelector('defs') || svg).insertBefore(cp, svg.firstChild)`.
   Si el SVG llegaba a tener un `<defs>`, se le pasaba a `insertBefore` un
   nodo de referencia que no era hijo suyo → `NotFoundError` → moría el
   script entero → **página en blanco**. Funcionaba de milagro porque
   ninguno de los tres escenarios tiene `<defs>`. Ahora inserta siempre en
   el `<svg>`, que es lo que `mountRelieve` ya hacía.
2. **`setProduct` L1312** — era el único setter que no llamaba a
   `guardar()`. Cambiar de vehículo no se recordaba al recargar.
3. **Texto del bordado L1800-1808** — el handler `input` de `#embInput` no
   persistía. Ahora `guardar()` con retardo de 500 ms.
   **Nunca meter `render()` aquí**: termina en `content.innerHTML` y
   destruiría el propio `<input>`, el cliente perdería el foco y en móvil
   se le cerraría el teclado. Verificado que el input no se recrea.
4. **Orden de analítica** — `setProduct` disparaba `producto_seleccionado`
   antes de que el arranque disparara `visita`, así que la primera entrada
   de cada sesión nunca era la visita. Invertido. Y `setEmbroidery` ahora
   emite `bordado_cambiado`.

Probado en navegador sobre `python3 -m http.server`: los 6 vehículos, las
6 pestañas, clic en zona, preset, vista limpia, ida y vuelta del enlace
`?d=`, recarga con `localStorage` y el mensaje de WhatsApp completo.
Cero errores de consola. Detector en 0 anti-patrones.

**Sin arreglar, a propósito:** el sistema de vetos entero es código muerto
(`INCOMPATIBLES` apunta a `pisos`, que es `pending:true`, y `setProduct`
rechaza los pending, así que `vetos()` siempre devuelve vacío). Y en
`mountRelieve` L1246, `svg.insertBefore(capa, primeraCostura)` es la misma
clase de trampa: hoy funciona porque todas las `.seam` son hijas directas
del `<svg>`; si alguien las envuelve en un `<g>`, lanza.

---

## 4.5 Segunda tanda del 24 ago 2026

Respaldo previo en `_respaldo/index.antes-3mejoras.html`.

**① El sistema de vetos NO estaba muerto: estaba dormido.**
Se comprobó en navegador que en cuanto `pisos` deje de ser `pending:true`
las cuatro capas funcionan (`vetos()` devuelve la regla, `render()` pinta el
botón `disabled` con su motivo, `setPart()` lo rechaza aunque se fuerce por
consola, y `repararConflictos()` arregla un diseño guardado que ya no vale).
Por eso **no se borró**: se documentó con un aviso grande en `INCOMPATIBLES`
para que nadie lo confunda con código muerto. Y se corrigió lo que sí fallaba:
`setProduct` tiraba a la basura el retorno de `repararConflictos()`, así que
al cliente se le cambiaba la elección **a la callada**. Ahora `render()` lo
avisa una vez con un `.vetonote`: *"Ajustamos tu diseño para este producto:
Alfombra: Puntos -> Liso."*

**② `mountRelieve` L1246** tenía la misma trampa que `mountGrainClips`:
`svg.insertBefore(capa, primeraCostura)` con una `.seam` que hoy es hija
directa del `<svg>`, pero que si algún día se envuelve en un `<g>` lanzaría
`NotFoundError`. Ahora sube hasta el hijo directo antes de insertar.

**③ El botón "Ver limpio" pisaba la pista en móvil.** En `max-width:1150px`
`.center` se vuelve compacto y `.hint` arranca pegado al borde de arriba,
justo donde flotaba el botón. Ahora en móvil el botón sale de
`position:absolute` y va en el flujo, alineado a la derecha, formando una
barra de herramientas con la pastilla del material.
**Dos cosas que costaron y conviene no repetir:**
  · La regla base `.cleanbtn` está en la línea ~222, DESPUÉS del bloque
    `@media` de la ~170. Un media query **no suma especificidad**, así que
    una anulación puesta en el bloque de arriba la pisa la regla de abajo y
    el botón se estira de lado a lado. La anulación va después de la base.
  · Bajarlo a la esquina inferior izquierda NO vale: a scroll 0 el borde de
    abajo de la tarjeta cae bajo la barra fija de cotizar (z-index 60 contra
    5) y el botón queda tapado y sin poder pulsarse.

**④ Encontrado de paso: la pastilla del material** vivía abajo a la derecha
y quedaba tapada por la barra fija cuando el banner de "retomamos tu diseño"
empujaba la tarjeta 56 px. Subida a la banda superior izquierda.

**⑤ Encontrado de paso: `mountVehicleBar`, `mountPresets` y
`mountZoneHandlers` enganchaban sus listeners DENTRO de la función.**
Hoy se llaman una sola vez, así que no había fallo en producción, pero
repintar la barra —lo primero que habrá que hacer el día que camioneta,
techo o pisos dejen de estar `pending:true`— duplicaba el listener y cada
clic disparaba `setProduct` dos veces. Las dos delegaciones se enganchan
ahora una sola vez fuera de la función, y `mountZoneHandlers` es idempotente
con una marca `data-enganchada`. Verificado: tras repintar tres veces, un
clic sigue disparando **un** `setProduct`.

**⑥ Recuperados los píxeles: cero recorte en todos los estados.**
La fila de herramientas añadía 39 px y dejaba 43 px del asiento bajo la barra
fija. Se midieron cuatro alternativas en el navegador y ganó la evidente en
cuanto se vieron los números: **la pista ocupa 57 px, más que la fila que se
añadió, y es una instrucción de una sola vez.** Ahora se retira sola en móvil
cuando el cliente toca una zona (clase `yatoco`), y quien vuelve arranca ya
sin ella. Además `.stage` lleva un tope calculado por estado:

| Estado | Pista | Asiento | Oculto |
|---|---|---|---|
| Primera visita | visible | 255 px | **0** |
| Tras tocar una zona | oculta | **305 px** | **0** |
| Cliente que vuelve (banner) | oculta | 256 px | **0** |

Las constantes (`438`, `381`, `437`) salen de `alto de la ventana − posición
de la tarjeta − lo que ocupa por dentro − barra fija`, medidas a 406×693.
Van dentro de un `min()` **a propósito**: solo pueden encoger el asiento
respecto al `44vh`, nunca agrandarlo, así que si algún día cambia la altura
de la cabecera lo peor que puede pasar es que el asiento salga un pelo más
pequeño, nunca que se recorte. Y van en un `@media` colocado **después** del
bloque tablet, que es la última regla que toca `.stage`.

Probado en navegador: 6 vehículos, 6 pestañas, clic en zona, preset, vista
limpia, ida y vuelta del `?d=`, mensaje de WhatsApp y recarga con
`localStorage`. Cero errores de consola. Detector en 0 anti-patrones.

---

## 5. TRAMPAS — léelas antes de tocar nada

Cada una de estas costó horas. Están aquí para no repetirlas.

### 5.1 Los paint servers no pueden estar en `display:none`
En Blink (Chrome), un **gradiente o patrón** dentro de un elemento con
`display:none` **no resuelve** y las zonas salen planas. Los filtros sí
funcionan. Por eso todos los `<defs>` viven en `<svg id="fx">`, que
**nunca** debe llevar `display:none`. Esto fue lo que mató el render de
la moto en su momento.

### 5.2 Las opciones nuevas van SIEMPRE al final
El enlace compartible `?d=` codifica cada elección como su **índice** en
un alfabeto de 64 caracteres, más un checksum. Si insertas un color,
patrón o diseño **en medio** de su array, **todos los enlaces que la
gente ya compartió apuntan a otra cosa**. Nuevos: al final. Sin excepción.
Aplica a `COLORS`, `PATTERNS`, `DISENOS`, `MATERIALES`.

### 5.3 `potrace` traza la región NEGRA
No hay que hacer `.negate()` de la máscara. Eso hizo que el tablero
tardara siete intentos: trazaba el fondo en vez de la pieza.

### 5.4 `sharp`
- `.stats()` mide **el archivo de entrada**, ignora las operaciones en cola.
- `.rotate()` cambia las dimensiones, así que hay que releer los metadatos
  desde un buffer, no del original.
- **HEIC de iPhone falla** (límite de seguridad `iref` de libheif). Hay
  que convertir antes con el `sips` de macOS:
  `sips -s format jpeg entrada.HEIC --out salida.jpg`

### 5.5 La vista previa de Artifact tarda ~20 segundos
Un archivo de 124 KB sale **en blanco** los primeros 15–20 segundos en el
visor de artifacts. No es un fallo del HTML. Se perdió una sesión entera
bisectando (tamaño, defs, CSS, favicon, fuentes, JSON-LD, trazados de
4093 caracteres) — **todos los trozos pintaban, y el archivo entero
también, solo había que esperar**. Si el `<title>` aparece en la pestaña,
el documento sí se procesó: no hay nada que bisectar.
Las rutas relativas (`fotos/`, `logo-...png`) siempre salen rotas en la
vista previa porque el artifact es un archivo suelto. Es esperado.

### 5.6 La caché del navegador miente durante las pruebas
Hubo tests reportando FAIL con el código correcto. Se arregla con
`?v=Date.now()` al cargar la página en las pruebas.

### 5.7 El flag `-p` de `agy` va al final
`agy --model gemini-3.1-pro-high --effort high -p "…"`. `-p` **toma el
prompt como su valor**, así que si va antes se traga el siguiente flag.
Además, leer archivos le exige un permiso interactivo que Claude Code no
puede conceder: para eso Jairo debe correrlo él con `! agy …`.

---

## 6. Lo que YA SE PROBÓ Y FALLÓ — no reintentar

| Intento | Qué pasó |
|---|---|
| **Generar el SVG del asiento con un LLM** (Gemini vía `agy`) | Cuatro paths que renderizan como un borrón diagonal. Inservible. No es un problema de prompt. |
| **Textura de cuero real (foto DOKA)** | 4 intentos. El mosaico en espejo mostraba los ejes; bajando la opacidad se volvía invisible. Un A/B con el grano apagado se veía **mejor**. Revertido. |
| **Rehacer la geometría del asiento desde el video** | Los bolsters quedaban como salchichas rojas flotando. Revertido a `_respaldo/index.antes-asiento-real.html`. |
| **Calcar `IMAGEN 3.webp`** | Tiene marca de agua de Shutterstock (ID 2757759677). No se usa en un sitio comercial. `IMAGEN ASIENTO.jpg` e `IMAGEN 2.jpg` también parecen stock de licencia no verificada. |

---

## 7. Cómo probar

```bash
cd "/Users/jairomendez/Desktop/app forros cuenca"
node .claude/skills/impeccable/scripts/detect.mjs index.html
```

Salida esperada: **código 0, cero anti-patrones**. Ese es el estado
actual y hay que mantenerlo. Detecta cosas como texto por debajo de 11px,
contraste bajo, sombras oscuras duplicadas.

Si hay que instalar herramientas: `npm install --no-save` **no** sirve
(poda las dependencias). Por eso existe `package.json`: usar `npm install`.

---

## 8. Publicación — CÓMO SE PUBLICA AHORA

**El sitio está en línea: https://forroscuenca.com**

Se sirve con **GitHub Pages** desde el repo
`jairomendez22/Pagina-de-forros-cuenca`, rama `main`, carpeta raíz `/`.
El DNS lo gestiona **Cloudflare** (nameservers `diana`/`rohin.ns.cloudflare.com`)
y apunta a las IP de GitHub Pages. El archivo `CNAME` de la raíz del repo
contiene `forroscuenca.com` y **no debe borrarse**: si desaparece, el
dominio propio se cae. HTTPS forzado activado el 1 sep 2026.

### Publicar un cambio son tres comandos

    cp index.html "SUBIR A LA WEB/index.html"   # sincronizar la copia
    git add -A . && git commit -m "..."
    git push origin main

GitHub tarda **1-3 minutos** en reconstruir. Hasta que termina, el sitio
sigue mostrando la versión anterior.

> **La trampa que ya nos costó una semana:** editar `index.html` NO
> publica nada. Del 22 al 31 de agosto el sitio en línea fue el commit
> inicial mientras todo el trabajo (corrección a Machala, fotos
> renombradas) vivía solo en el disco de Jairo. **Si un cambio no se ve
> en forroscuenca.com, lo primero que hay que mirar es `git status`.**

`SUBIR A LA WEB/` y `COMO-SUBIRLO.txt` describen el camino manual
(Cloudflare Pages / cPanel). **Quedaron obsoletos**: ya no hace falta
subir nada a mano. Se conservan solo por si algún día se migra de host.

---

## 9. PENDIENTES

### Datos que solo Jairo puede confirmar (el sitio ya está en línea con supuestos)
1. ~~**Dirección del taller.**~~ **RESUELTO el 1 sep 2026.** Jairo
   confirmó: **Napoleón Mera entre Primera Diagonal y Rocafuerte**,
   Machala. Ya está en el `streetAddress` del JSON-LD y publicada.
   Ojo: solo vive en los metadatos, no se muestra en la página.
2. **Horario.** Puse 08:00–18:00 de lunes a sábado. **Es una suposición
   mía.** Un horario equivocado en Google hace que la gente llegue con el
   taller cerrado.
3. **Precio de Camioneta/SUV.** Está en `null` **a propósito**: mientras
   siga así la web dice "Precio a medida" en vez de inventar una cifra.
4. **Nombres de los 8 diseños.** Los bauticé yo mirando los videos
   (Capitoné Rombos, Franja Central, Deportivo Costados, Sparco Racing,
   Alas Laterales, Barras Cuenca, Coraza de Bloques, Acanalado Elegante).
   El taller seguro los llama de otra forma.
5. **Descripciones de los materiales** nuevos (cuero de tablero, felpa,
   malla, tela de techo, cuero para piso) — las escribí mirando sus
   muestrarios. Él los vende mejor.
6. **Reparto de precios del bordado**: $2 nombre / $5 logo / $5 FORROS
   CUENCA. Confirmar.

### Ya resuelto: la galería agrupa por forro (1 sep 2026)

Antes eran 17 fotos sueltas en fila: la vista general de un juego y sus
detalles quedaban separadas por otras cuatro, y no había forma de saber que
eran el mismo cuero. Ahora hay **7 tarjetas, una por forro**; al tocar una se
abre un visor con las demás fotos **de ese mismo color y dibujo**.

**El visor es un carrusel con `scroll-snap`, no un cambio de `src`.** Las fotos
van en fila dentro de `.visor-marco`, que es el contenedor con scroll; el
deslizamiento lo lleva el navegador y por eso el arrastre con el dedo trae
inercia y rebote de verdad. **El scroll es la única fuente de verdad**: `ver()`
solo pide el sitio con `scrollIntoView`, y `marcar()` — que corre en cada
cuadro de scroll — pone el estado. Flecha, teclado, miniatura y dedo acaban en
el mismo sitio. Las flechas no dan la vuelta y se apagan en los topes, porque
con el dedo tampoco se vuelve de la última a la primera.

> El deslizamiento usa `--curva-desliz` y no la `--curva` del sitio: esa es una
> easeOutExpo que hace el 98% del camino en 80 ms. Va bien para algo pequeño
> que aparece, pero en 900 px se lee como un salto.

- La tabla `GALERIA` (junto a `abrirForro`) es el dato: sumar un forro son una
  entrada ahí y una `<figure>` en la galería. La **primera foto de cada lista
  es la portada**, la misma que se ve en la tarjeta.
- El visor se monta sobre el `.modalbg` del formulario: mismo velo, misma
  animación, mismo `aislarElFondo`. Escape y flechas ← → funcionan.
- **Las `Imagen de WhatsApp 2023-*` NO van en el sitio.** Se probaron el 1 sep
  2026 y Jairo las mandó quitar el mismo día: son antiguas y dan un aspecto
  poco profesional. Ya lo había dicho antes. Los 7 forros que quedan son todos
  recreaciones de estudio, y por eso el encabezado dice "Así puede quedar tu
  vehículo" y no "trabajos entregados".
- Los detalles que faltaban (verde, y los de las cuatro reales) son **recortes**
  hechos con `sharp` desde el original, no fotos nuevas.
- La foto grande usa `-vista.webp` **solo** cuando la del taller es vertical de
  teléfono: recortada a 3:4 se veía cortada.

---

### Bloqueados por falta de fotos
7. **Camioneta, Techo y Pisos** siguen en `pending:true` y salen como
   "pronto" en la barra. Hace falta **una foto de frente por producto**,
   contra pared lisa y clara, cámara a la altura de la pieza, luz pareja,
   sin flash. Jairo dijo el 22 ago que no tiene fotos nuevas.

### Mejoras conocidas, no urgentes
8. Las pestañas de **patrón y costura** aplican al asiento dibujado, no
   al modelo de diseño elegido. Falta unificarlas.
9. **Analítica**: la web ya registra los eventos (`track()`, línea 833)
   pero **no los envía a ninguna parte**. Cuando contrate Plausible o
   Umami, se pega su script en el `<head>` y empieza a reportar solo.

---

## 10. Cómo retomar en una conversación nueva

1. Leer este archivo.
2. Abrir `index.html` (no `APP FORROS CEUNCA.html`).
3. Antes de editar, hacer respaldo:
   `cp index.html _respaldo/index.antes-<loquesea>.html`
4. Después de editar, correr el detector de §7.
5. Si el cambio va a producción, sincronizar la copia:
   `cp index.html "SUBIR A LA WEB/index.html"`

Las memorias del proyecto (`forros-cuenca-alcance`,
`forros-cuenca-svg-trazado`, `forros-cuenca-pendiente-fotos`,
`artifact-tarda-en-cargar`) se cargan solas al abrir sesión y contienen
las decisiones cerradas con Jairo.
