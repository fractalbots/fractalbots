# Fractal-Bots · Landing

Sitio web del Centro de Robótica Educativa, Tecnología e Innovación.
Mismo stack que el proyecto Zentry de referencia: **React 18 + Vite 6 + Tailwind 3 + GSAP**.

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # genera dist/
npm run preview
```

## Despliegue en Vercel

Framework preset: **Vite**. Build command `npm run build`, output `dist`.

## Estructura

```
src/
├─ App.jsx                 Composición de secciones
├─ index.css               Tailwind + capas de componentes y utilidades
├─ data/content.js         TODOS los textos del sitio (editar aquí)
├─ lib/hooks.js            useInView, useMagnetic, useCounter, helpers
└─ components/
   ├─ Hero.jsx             Ventana con clip-path que se expande (ScrollTrigger)
   ├─ Ruta.jsx             Scroll horizontal con pin de GSAP
   ├─ Ecosistema.jsx       Bento grid con tilt 3D y spotlight
   ├─ AnimatedTitle.jsx    Reveal palabra por palabra
   └─ ...
```

## Dónde tocar cada cosa

- **Textos, niveles, competencias, FAQ:** `src/data/content.js`
- **Colores de marca:** `tailwind.config.js` → `colors.fb`
- **Tipografías:** `index.html` (Google Fonts) + `tailwind.config.js` → `fontFamily`
- **Duración del scroll del hero:** altura `h-[230vh]` en `Hero.jsx`
- **Velocidad del marquee:** `animation.slide` en `tailwind.config.js`

## Pendiente: reemplazar los placeholders visuales

Las tarjetas de proyecto y la ventana del hero usan degradados generados por CSS.
El original de Zentry usa vídeo. Para hacer lo mismo:

1. Coloca los archivos en `public/videos/`
2. En `Hero.jsx`, dentro de `#hero-frame`, sustituye el `div` del degradado por:

```jsx
<video src="/videos/taller.mp4" autoPlay loop muted playsInline
       className="absolute inset-0 h-full w-full object-cover" />
```

Comprime antes con `ffmpeg -i entrada.mp4 -vf scale=1280:-2 -crf 30 -an salida.mp4`.

---

## Medios (imágenes y vídeo)

Todo vive en `public/`. Para cambiar cualquiera, sustituye el archivo con el mismo nombre.

| Archivo | Dónde aparece |
|---|---|
| `public/videos/hero.mp4` | Ventana del hero que se abre al bajar |
| `public/img/hero-poster.jpg` | Primer fotograma (evita el parpadeo negro) |
| `public/videos/taller.mp4` | Tarjeta "Cronometría IoT" en Proyectos |
| `public/img/lab.jpg` | Bloque "Un laboratorio, no un aula" |
| `public/img/makerspace.jpg` | Bloque "Diseñamos el lugar donde se construye" |

### Huecos listos para tus fotos reales

En `src/data/content.js`, tres proyectos tienen `media: null`. Al poner una ruta,
la tarjeta cambia sola de marcador con degradado a foto con parallax y zoom:

```js
media: "/img/proyectos/sistema.jpg",
```

Crea la carpeta `public/img/proyectos/` y suelta ahí las capturas.
Proporción recomendada 16:10, mínimo 1200 px de ancho.

### Comprimir antes de subir

```bash
# vídeo: de 4 MB a menos de 1 MB sin pérdida perceptible
ffmpeg -i original.mp4 -vf scale=1280:-2 -crf 30 -preset slow -movflags +faststart -an salida.mp4

# imagen
ffmpeg -i original.png -vf scale=1600:-2 -q:v 4 salida.jpg
```

Los vídeos van `muted` + `playsInline`: es la única forma de que iOS y Chrome
permitan la reproducción automática.

## Ajustes rápidos del hero

En `src/components/Hero.jsx`:

- `SMALL` / `SMALL_MOBILE` — tamaño y posición de la ventana antes de abrirse
- `gsap.set("#hero-video", { scale: 1.32 })` — cuánto arranca acercado el vídeo
- `h-[240vh]` — cuánto scroll dura la apertura

En `src/components/Particles.jsx`: `count` regula cuántos átomos flotan.
La máscara radial vacía el centro, así que nunca compiten con el texto.


---

## Carrusel de fotos (debajo del banner)

Suelta tus imágenes en `public/img/galeria/` con estos nombres:

```
public/img/galeria/img1.jpg
public/img/galeria/img2.jpg
public/img/galeria/img3.jpg
public/img/galeria/img4.jpg
public/img/galeria/img5.jpg
public/img/galeria/img6.jpg
```

No hay que tocar ningún componente: aparecen solas y en ese orden.
Mientras falte un archivo, esa tarjeta muestra un degradado con el nombre
que espera (IMG1.JPG, IMG2.JPG…), así se ve de un vistazo cuál falta.

Los títulos y pies de foto se editan en `src/data/content.js`:

```js
export const GALERIA = [
  { src: "/img/galeria/img1.jpg", titulo: "Clases de robótica", pie: "Nivel 1 · Electrónica" },
  ...
];
```

Para añadir una séptima foto basta con agregar una línea más al array
y guardar `img7.jpg` en la carpeta.

## Enlaces al sistema y a la tienda

Ambos salen de un solo sitio, `src/data/content.js`:

```js
export const ENLACES = {
  sistema: "https://fractalbots.vercel.app",
  tienda:  "https://tobotech.vercel.app",
  repo:    "https://github.com/fractalbots/fractalbots",
};
```

Cambiando ahí la URL se actualizan todos los botones a la vez. Aparecen en:

- Barra superior: botón blanco **Ingresar al sistema** y enlace **Tienda**
- Banner: botón **Ingresar al sistema**
- Sección Estructura: enlaces **Ver la plataforma** y **Ir a la tienda**
- Menú móvil y pie de página

## Publicar en Vercel

La landing y el sistema son dos despliegues distintos del mismo GitHub.
En Vercel, al importar este proyecto: preset **Vite**, build `npm run build`,
output `dist`. Si lo pones en el mismo repositorio que la plataforma, indica
el **Root Directory** de cada uno para que Vercel sepa cuál compilar.
