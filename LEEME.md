# Forros Cuenca — sitio web

Sitio vitrina: el cliente ve los **15 diseños numerados**, elige uno y pulsa
«Quiero este diseño». Se le abre el WhatsApp con el número ya escrito.
**No hay configurador**: se quitó a propósito.

- **Dominio:** forroscuenca.com
- **Se publica en:** GitHub Pages, repo `jairomendez22/Pagina-de-forros-cuenca`, rama `main`, carpeta raíz.
- **Sin build, sin npm, sin instalar nada.** Son archivos sueltos: se suben tal cual.

---

## 1. LO PRIMERO: poner el precio de cada diseño

Los quince diseños salen hoy con **$110**, que es el precio desde el que arranca
cualquier juego de forros. Cambia el de cada uno por el tuyo.

**Diseños 01 al 07** → están en `sitio.js`. Busca `var DISENOS` y cambia el número
de `precio:` en cada línea. Solo el número, sin el signo de dólar:

```js
{ id: 'negro', num: '01', precio: 110, det: 'Cuero negro · ondas y costura blanca', ...
                          ↑ este
```

**Diseños 08 al 15** → están en `index.html`. Busca `dis-precio` y cambia el número:

```html
<p class="dis-precio"><i>desde</i><span>$110</span></p>
                                       ↑ este
```

> La palabra «desde» va delante a propósito: el valor final depende del vehículo,
> del cuero y de los acabados. Si algún diseño tiene precio cerrado, quita el
> `<i>desde</i>` de esa línea.

---

## 2. Qué archivo es cada cosa

| Archivo | Qué es |
|---|---|
| `index.html` | Textos, precios de servicios, colores, hilos, acabados y los **diseños 08 al 15**. |
| `estilos.css` | Colores, tamaños y diseño de la página. |
| `sitio.js` | Los **diseños 01 al 07** y el comportamiento: menú, visor de fotos y animaciones. |
| `fotos/` | Las 18 fotos de estudio. Cada una en dos tamaños: `nombre.webp` (760px) y `nombre-400.webp`. |
| `disenos/` | Las 8 fotos del taller. También en dos tamaños: `nombre.webp` (560px) y `nombre-280.webp`. |
| `logo-forros-cuenca.png` | El escudo. **No lo borres ni lo cambies de nombre.** |
| `og-forros-cuenca.jpg` | La imagen que sale al pegar el enlace en WhatsApp o Instagram. |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` | Los iconos del navegador y del teléfono. |
| `CNAME` | **No lo borres.** Si desaparece, forroscuenca.com se cae. |
| `robots.txt`, `sitemap.xml` | Para Google. |

---

## 3. Cambiar los precios de los servicios

Son los de la lista «El interior completo» (forros, tablero, techo, pisos).
En `index.html`, busca `ficha-precio`:

```html
<span class="ficha-precio"><i>desde</i>$110</span>
```

Esos precios aparecen **dos veces**: en la lista y en el bloque `application/ld+json`
del final (el que lee Google). Cambia los dos para que digan lo mismo.

---

## 4. Añadir un diseño nuevo

**La numeración es corrida del 01 al 15 y no puede repetirse.** Si un cliente
escribe «quiero el 12», tiene que haber un solo 12. El siguiente que añadas es el 16.

**Si tiene varias fotos** (como los del 01 al 07), va en `sitio.js`, al final de `DISENOS`:

```js
{ id: 'midiseno', num: '16', precio: 130, det: 'Cuero rojo · rombos', tono: '#3a2a2c',
  desc: 'Descripción corta que se lee al abrir las fotos.',
  fotos: [
    ['mi-foto', 'Diseño 16: descripción de la foto para quien no la puede ver'],
    ['mi-foto-detalle', 'Otra descripción']
  ] },
```

Las fotos van en `fotos/` en dos tamaños: `mi-foto.webp` (760×1013) y `mi-foto-400.webp`.
La **primera de la lista es la portada**. `tono` es un color oscuro parecido al de la
foto: se ve un instante mientras carga.

**Si tiene una sola foto** (como los del 08 al 15), va en `index.html`: busca
`rail-archivo`, copia una `<figure class="dis-placa">` entera y cambia las dos rutas
de la foto, el número, la descripción, el precio y el número del enlace de WhatsApp.
Esas fotos van en `disenos/`: `mi-modelo.webp` (560×760) y `mi-modelo-280.webp`.

---

## 5. Cambiar colores, hilos o acabados

No dependen del JavaScript: son HTML normal en `index.html`. Para añadir un color
busca `rejilla-color` y copia el bloque de al lado:

```html
<div class="color rev" style="--i:6">
  <span class="color-chip" style="background-color:#c08a2e"></span>
  <span class="color-nom">Mostaza</span>
  <span class="color-hex">#C08A2E</span>
</div>
```

Hay dos rejillas: **En stock** y **Bajo pedido**. Pon el color en la que corresponda.
El `--i` solo escalona la aparición: ponle el número siguiente al del último.

---

## 6. Publicar los cambios

```bash
cd "/Users/jairomendez/Desktop/SITIO WEB"
git add -A
git commit -m "describe aquí el cambio"
git push origin main
```

GitHub tarda **1 a 3 minutos** en reconstruir. Hasta que termina se ve la versión anterior.

> **La trampa que ya costó una semana:** editar los archivos **no publica nada**. Si un
> cambio no se ve en forroscuenca.com, lo primero que hay que mirar es `git status`.

Para verlo antes de publicar, abre `index.html` con doble clic.

---

## 7. Reglas de diseño que conviene no romper

Estas no son manías: cada una está medida.

1. **Las fotos de `disenos/` nunca pasan de 280px de ancho.** Son fotos del taller, con
   la pared y la estantería al fondo. A ese tamaño, dentro de su placa, se leen como
   fichas de catálogo. Más grandes, se ve el fondo quemado y el sitio parece barato.
2. **La foto del héroe mide 760px de ancho.** En computador va dentro de su marco, a
   620px como máximo. Si alguien la pone a pantalla completa, se ve borrosa.
3. **Un solo botón rojo por pantalla.** Por eso los quince «Quiero este diseño» son
   neutros y solo se ponen rojos al pasar el mouse por encima. Si se pintan todos de
   rojo, el rojo deja de significar nada.
4. **Ningún color de cuero se pinta sobre el fondo negro sin su anillo.** El vino sobre
   negro da 1,63 de contraste: sin ese borde claro, ese color no existe en la pantalla.
5. **En el teléfono, el texto del héroe no va encima de la foto.** Se midió: caía en
   3,3 de contraste, por debajo de lo legible. Por eso el texto va sobre negro y la
   foto debajo.
6. **El precio y el botón van debajo de la foto, nunca encima.** Un precio sobre una
   fotografía nunca llega a contraste legible.
7. **Nada de verde de WhatsApp.** El botón es rojo porque el rojo es el color de la marca.

---

## 8. Lo que se puede mejorar más adelante

- **Precios propios por diseño.** Es lo del punto 1: hoy los quince dicen $110.
- **Analítica.** El sitio no mide visitas. Si algún día contratas Plausible o Umami, se
  pega su línea de código en el `<head>` de `index.html` y empieza a reportar solo.
- **Coordenadas del taller.** Si abres la ficha del taller en Google Maps y copias el
  par de números (latitud y longitud), se pueden añadir al bloque de datos de Google
  para que la ubicación sea exacta. No se inventaron a propósito.
