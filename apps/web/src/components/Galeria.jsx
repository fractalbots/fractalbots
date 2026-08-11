import { useCallback, useEffect, useRef, useState } from "react";
import { GALERIA } from "../data/content";
import Reveal from "./Reveal";

const ACCENTS = ["#1E9AD7", "#43B02A", "#5E2D8E", "#F5811F"];

/**
 * Carrusel de fotos con scroll horizontal por arrastre, flechas y puntos.
 * Si una imagen no existe todavía, la tarjeta cae en un degradado de marca
 * en vez de mostrar el icono de imagen rota.
 */
function Slide({ item, index, acc }) {
  const [failed, setFailed] = useState(false);
  const inner = useRef(null);

  /* Zoom sutil según la posición de la tarjeta dentro del carril */
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const track = el.closest("[data-track]");
    if (!track) return;
    let raf = null;
    const update = () => {
      raf = null;
      const tr = track.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const center = tr.left + tr.width / 2;
      const dist = Math.abs(r.left + r.width / 2 - center) / tr.width;
      el.style.transform = `scale(${1.12 - Math.min(dist, 1) * 0.08})`;
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <article
      data-slide
      style={{ "--acc": acc }}
      className="group relative aspect-[4/3] w-[min(430px,78vw)] flex-none snap-center overflow-hidden rounded-[20px] border border-white/10 bg-ink-800"
    >
      {!failed ? (
        <img
          ref={inner}
          src={item.src}
          alt={item.titulo}
          loading="lazy"
          draggable="false"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />
      ) : (
        <div
          ref={inner}
          className="absolute inset-0 grid place-items-center will-change-transform"
          style={{
            background:
              "radial-gradient(80% 80% at 30% 25%, color-mix(in srgb, var(--acc) 55%, transparent), transparent 70%), #131C2B",
          }}
        >
          <span className="grid-fine absolute inset-0 opacity-60" />
          <span className="relative font-mono text-[.68rem] uppercase tracking-[.24em] text-white/45">
            {item.src.split("/").pop()}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,10,17,.9))]" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <span className="font-mono text-[.6rem] uppercase tracking-[.2em] text-[var(--acc)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="m-0 mt-2 font-display text-[1.35rem] font-extrabold uppercase leading-none tracking-[-.02em]">
          {item.titulo}
        </h3>
        {item.pie && <p className="m-0 mt-[6px] text-[.85rem] text-white/60">{item.pie}</p>}
      </div>
    </article>
  );
}

export default function Galeria() {
  const track = useRef(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((i) => {
    const t = track.current;
    if (!t) return;
    const slide = t.querySelectorAll("[data-slide]")[i];
    if (slide) t.scrollTo({ left: slide.offsetLeft - t.offsetLeft - 24, behavior: "smooth" });
  }, []);

  /* Punto activo según la tarjeta más cercana al centro */
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let raf = null;
    const update = () => {
      raf = null;
      const center = t.scrollLeft + t.clientWidth / 2;
      let best = 0;
      let min = Infinity;
      t.querySelectorAll("[data-slide]").forEach((s, i) => {
        const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - t.offsetLeft - center);
        if (d < min) {
          min = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      t.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Arrastrar con el ratón, como en una galería de escritorio */
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let down = false, startX = 0, startLeft = 0, moved = false;
    const md = (e) => {
      down = true;
      moved = false;
      startX = e.pageX;
      startLeft = t.scrollLeft;
      t.style.cursor = "grabbing";
    };
    const mm = (e) => {
      if (!down) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      t.scrollLeft = startLeft - dx;
    };
    const up = () => {
      down = false;
      t.style.cursor = "";
    };
    const click = (e) => {
      if (moved) e.preventDefault();
    };
    t.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", up);
    t.addEventListener("click", click, true);
    return () => {
      t.removeEventListener("mousedown", md);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", up);
      t.removeEventListener("click", click, true);
    };
  }, []);

  const go = (dir) => scrollToIndex(Math.max(0, Math.min(GALERIA.length - 1, active + dir)));

  return (
    <section className="relative overflow-hidden bg-ink py-[clamp(56px,7vw,96px)]">
      <div className="wrap mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <Reveal as="p" className="eyebrow text-white/60">En el taller</Reveal>
          <h2 className="display d-md m-0 max-w-[16ch]">Así se ve aprender construyendo</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink disabled:opacity-30"
            disabled={active === 0}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Siguiente"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink disabled:opacity-30"
            disabled={active === GALERIA.length - 1}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={track}
        data-track
        className="flex snap-x snap-mandatory gap-[18px] overflow-x-auto scroll-smooth px-[max(24px,calc((100vw-1300px)/2))] pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {GALERIA.map((g, i) => (
          <Slide key={g.src} item={g} index={i} acc={ACCENTS[i % ACCENTS.length]} />
        ))}
      </div>

      <div className="wrap mt-6 flex gap-2">
        {GALERIA.map((g, i) => (
          <button
            key={g.src}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Ir a ${g.titulo}`}
            className={`h-[3px] rounded-full transition-all duration-500 ease-soft ${
              i === active ? "w-10 bg-white" : "w-5 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
