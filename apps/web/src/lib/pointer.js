import { isTouch, prefersReducedMotion } from "./hooks";

/**
 * Un solo listener de ratón y un solo bucle de animación para toda la página.
 *
 * Antes cada componente con parallax abría su propio requestAnimationFrame y
 * seguía corriendo aunque estuviera fuera de pantalla. Con cinco campos de
 * partículas más el hero y el cursor eran siete bucles compitiendo en cada
 * fotograma, y eso es lo que hacía que el scroll se sintiera trabado.
 *
 * Ahora hay un único bucle: los suscriptores se apuntan al entrar en viewport
 * y se dan de baja al salir. Sin suscriptores, el bucle se detiene solo.
 */

const subs = new Set();
let tx = 0, ty = 0, cx = 0, cy = 0;
let raf = null;
let listening = false;

const onMove = (e) => {
  tx = (e.clientX / window.innerWidth - 0.5) * 2;
  ty = (e.clientY / window.innerHeight - 0.5) * 2;
};

function loop() {
  cx += (tx - cx) * 0.07;
  cy += (ty - cy) * 0.07;
  subs.forEach((fn) => fn(cx, cy));
  raf = subs.size ? requestAnimationFrame(loop) : null;
}

function start() {
  if (!listening) {
    window.addEventListener("mousemove", onMove, { passive: true });
    listening = true;
  }
  if (raf === null) raf = requestAnimationFrame(loop);
}

function stop() {
  if (subs.size === 0) {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
    if (listening) {
      window.removeEventListener("mousemove", onMove);
      listening = false;
    }
  }
}

/** Devuelve una función para darse de baja. */
export function subscribePointer(fn) {
  if (isTouch() || prefersReducedMotion()) return () => {};
  subs.add(fn);
  start();
  return () => {
    subs.delete(fn);
    stop();
  };
}

/**
 * Ejecuta `fn` solo mientras `el` esté visible en pantalla.
 * Al salir del viewport se da de baja y deja de consumir fotogramas.
 */
export function usePointerWhenVisible(el, fn) {
  if (!el) return () => {};
  let unsub = null;
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !unsub) {
        unsub = subscribePointer(fn);
      } else if (!entry.isIntersecting && unsub) {
        unsub();
        unsub = null;
      }
    },
    { rootMargin: "20% 0px" }
  );
  io.observe(el);
  return () => {
    io.disconnect();
    if (unsub) unsub();
  };
}
