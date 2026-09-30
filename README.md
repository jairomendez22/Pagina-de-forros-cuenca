# Sitio y configurador web de Forros Cuenca

Frontend 100% estático, sin backend, base de datos, framework ni proceso de compilación. La carpeta `web/` completa se puede subir a cualquier hosting de archivos estáticos.

## Probar localmente

Desde esta carpeta ejecuta:

```bash
python3 -m http.server 8080
```

Luego abre `http://localhost:8080`. Los módulos JavaScript necesitan servirse por HTTP; no conviene abrir `index.html` con doble clic.

## Publicar

Sube todo el contenido de `web/` al directorio público del hosting. Las rutas son relativas y funcionan también dentro de un subdirectorio.

## Lo que debe completar el dueño

### Precio desde

En `js/data.js`, edita:

```js
export const PRECIO_DESDE = "";
```

Escribe solo el número, por ejemplo `"120"`. Con valor, la barra móvil dirá **Cotizar en WhatsApp · Desde $120**. Vacío no muestra precio.

### Fotos reales del taller

La galería actual usa fotos confirmadas por el dueño, copiadas desde `fotos-reales/` a `web/assets/trabajos/`: cuatro miniaturas `-400.webp`, una foto completa para el hero y una macro para la franja de detalle. Las 38 fotos originales (19 completas y 19 miniaturas) permanecen fuera de `web/` para no subir material no utilizado.

Para cambiar una tarjeta, copia la nueva variante `-400.webp` a `assets/trabajos/` y reemplaza en el `<article class="project-card...">` correspondiente el `src`, `alt`, título y subtítulo. Conserva `width`, `height`, `loading="lazy"` y `decoding="async"`. Para el hero usa la foto completa con `fetchpriority="high"`; para la franja de detalle usa una foto completa o una miniatura según el encuadre. Mantén las fotos nuevas optimizadas y en miniatura para que la carga inicial crítica siga por debajo de 300 KB.

### Dirección, horario y redes

La sección `#ubicacion` muestra la dirección confirmada del taller: Napoleón Mera, entre Primera Diagonal y Rocafuerte, Machala, El Oro. El pie enlaza a Instagram, Facebook y TikTok (@FORROSCUENCA). El horario sigue pendiente de confirmación.

## Estructura

```text
web/
├── index.html             # Sitio editorial, secciones y SVG del asiento
├── assets/
│   ├── logo-forros-cuenca.png
│   └── trabajos/
├── css/styles.css
└── js/
    ├── data.js   # Catálogos, presets, precio y teléfono
    ├── vehicles.js # Marcas, modelos y años comunes en Ecuador (selector de vehículo)
    ├── state.js  # Validación, migración, URL y localStorage
    ├── view.js   # SVG, controles, navegación, scroll y PNG
    └── app.js    # Eventos y orden de WhatsApp
```

## Estado y compatibilidad

Cada cambio se guarda en `localStorage` y en `?diseno=`. La URL tiene prioridad al abrir un diseño compartido. El esquema actual es versión 5 y acepta enlaces y datos de las versiones 1 a 4. Al migrar un diseño anterior, el vivo de contraste toma el color del hilo del respaldo para conservar su intención cromática; los campos de vehículo solo quedan vacíos cuando el enlace original no los incluía. Las sub-zonas que falten en un diseño anterior heredan el acabado de su zona madre, así que se ven igual que antes.

Los `id` de `data.js` forman parte de los enlaces compartidos. No los cambies después de publicar. Los presets contienen estados completos del diseño —incluido el vivo global— y se pueden editar sin tocar la lógica.

El configurador es solo 2D (la vista 3D se retiró el 24/09/2026; sus archivos están en `../respaldos/`). El dibujo tiene ocho zonas: cinco principales y tres sub-zonas (`parent` en `data.js`) que aparecen al pulsar «+ Detalles». Sus proporciones siguen los trabajos reales del taller y se genera con `../herramientas/generar-asiento-2d.py`; la ilustración de la portada es una copia estática de ese dibujo con la plantilla Sport Bicolor Rojo (ids con prefijo `hero-`).

## Secciones del sitio

Header, hero, propuesta de valor, trabajos, servicios, detalle, nosotros, proceso, configurador, ubicación, llamada final y footer. Las apariciones al hacer scroll usan `IntersectionObserver`; si JavaScript no está disponible, el contenido permanece visible.

## Vehículos y marcas

`js/vehicles.js` alimenta el selector marca → modelo → año; se basa en la investigación de `../qa/vehiculos-ecuador-antigravity.md`. Para agregar un modelo, añade una línea en su marca. La franja de marcas bajo el hero muestra solo logos en su color oficial sobre tarjetas blancas (`assets/marcas/`: Simple Icons CC0 y Wikimedia Commons; Shineray y Changan son CC BY-SA 4.0 y su crédito aparece en el pie de página). Se regenera con `../herramientas/generar-franja-marcas.py`. La portada es un carrusel (`js/hero.js`) de un solo asiento que cambia de forro; las imágenes están en `assets/portada/` y sus originales (vista frontal hecha por Codex con ChatGPT Image a partir de las fotos de Higgsfield) y prompts en `../fotos-mejoradas/portada-frontal/`. El bordado de la 01 se corrigió a «GRAND i10» según la foto real del catálogo (página 26).

## Publicación

El sitio se publica con GitHub Pages desde la rama `main` del repositorio `jairomendez22/Pagina-de-forros-cuenca`, con el dominio `forroscuenca.com` (archivo `CNAME` en la raíz del repositorio). Las URL absolutas de vista previa (`og:image`, `canonical`, `sitemap.xml`) apuntan a `https://forroscuenca.com/`.
