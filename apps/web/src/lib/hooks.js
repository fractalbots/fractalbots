import { useEffect, useRef, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover:none),(pointer:coarse)").matches;

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Añade .is-in cuando el elemento entra en viewport (una sola vez). */
export function useInView(threshold = 0.16) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/** Botón magnético: el elemento sigue ligeramente al cursor. */
export function useMagnetic(strength = 0.22) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch() || prefersReducedMotion()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px,${
        (e.clientY - r.top - r.height / 2) * strength * 1.4
      }px)`;
    };
    const out = () => (el.style.transform = "");
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", out);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", out);
    };
  }, [strength]);
  return ref;
}

/** Contador animado al entrar en pantalla. */
export function useCounter(end, duration = 1200) {
  const [val, setVal] = useState(end > 1000 ? end - 9 : 0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setVal(end);
    const start = end > 1000 ? end - 9 : 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.unobserve(el);
        const t0 = performance.now();
        const tick = (n) => {
          const p = clamp((n - t0) / duration, 0, 1);
          setVal(Math.round(lerp(start, end, 1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);
  return [val, ref];
}
