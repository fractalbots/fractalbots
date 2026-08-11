import { useEffect, useRef } from "react";
import { clamp } from "../lib/hooks";

/**
 * Imagen con parallax vertical al hacer scroll.
 * `speed` = cuánto se desplaza la imagen dentro de su marco (0 = fija, 1 = mucho).
 * La imagen se renderiza más alta que el marco para que el desplazamiento no deje huecos.
 */
export default function ImageParallax({
  src,
  alt,
  speed = 0.18,
  className = "",
  imgClassName = "",
  overlay = true,
  children,
}) {
  const frame = useRef(null);
  const img = useRef(null);

  useEffect(() => {
    const f = frame.current;
    const i = img.current;
    if (!f || !i) return;
    let raf = null;

    const update = () => {
      raf = null;
      const r = f.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const prog = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height), 0, 1) - 0.5;
      i.style.transform = `translate3d(0, ${prog * speed * 100}%, 0) scale(1.001)`;
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <img
        ref={img}
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute left-0 top-[-15%] h-[130%] w-full object-cover will-change-transform ${imgClassName}`}
      />
      {overlay && (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,17,.15),rgba(7,10,17,.7))]" />
      )}
      {children}
    </div>
  );
}
