import { useEffect, useRef, useState } from "react";
import { GALERIA } from "../data/content";
import Reveal from "./Reveal";
import { prefersReducedMotion } from "../lib/hooks";

const ACCENTS = ["#1E9AD7", "#43B02A", "#5E2D8E", "#F5811F"];

/**
 * Carrusel en movimiento continuo.
 *
 * La lista se renderiza dos veces seguidas. Cuando el desplazamiento llega a la
 * mitad, se resta esa mitad de golpe: como la segunda copia es idéntica a la
 * primera, el salto es invisible y el movimiento parece infinito.
 *
 * Se detiene al pasar el ratón por encima, al arrastrar y al tocar en móvil.
 * No usa scroll-snap: el ajuste automático de snap peleaba con el movimiento
 * continuo y era lo que trababa el scroll vertical de la página al pasar por aquí.
 */
function Slide({ item, index, acc }) {
  const [failed, setFailed] = useState(false);

  return (
    <article
      data-slide
      style={{ "--acc": acc }}
      className="group relative aspect-[4/3] w-[min(430px,78vw)] flex-none overflow-hidden rounded-[20px] border border-white/10 bg-ink-800"
    >
      {!failed ? (
        <img
          src={item.src}
          alt={item.titulo}
          loading="lazy"
          draggable="false"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-700 ease-soft group-hover:scale-100"
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center"
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
  const paused = useRef(false);
  const visible = useRef(true);

  /* Movimiento continuo + bucle infinito */
  useEffect(() => {
    const t = track.current;
    if (!t || prefersReducedMotion()) return;

    let raf = null;
    const SPEED = 0.55; // px por fotograma

    const half = () => t.scrollWidth / 2;

    const step = () => {
      if (!paused.current && visible.current) {
        t.scrollLeft += SPEED;
        if (t.scrollLeft >= half()) t.scrollLeft -= half();
      }
      raf = requestAnimationFrame(step);
    };

    // Solo anima mientras la sección esté a la vista
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(t);

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  /* Arrastre con el ratón */
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let down = false, startX = 0, startLeft = 0, moved = false;

    const down_ = (e) => {
      down = true;
      moved = false;
      paused.current = true;
      startX = e.pageX;
      startLeft = t.scrollLeft;
      t.style.cursor = "grabbing";
    };
    const move_ = (e) => {
      if (!down) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      t.scrollLeft = startLeft - dx;
    };
    const up_ = () => {
      if (!down) return;
      down = false;
      paused.current = false;
      t.style.cursor = "";
    };
    const click_ = (e) => {
      if (moved) e.preventDefault();
    };

    t.addEventListener("mousedown", down_);
    window.addEventListener("mousemove", move_);
    window.addEventListener("mouseup", up_);
    t.addEventListener("click", click_, true);
    return () => {
      t.removeEventListener("mousedown", down_);
      window.removeEventListener("mousemove", move_);
      window.removeEventListener("mouseup", up_);
      t.removeEventListener("click", click_, true);
    };
  }, []);

  /* Flechas: avanzan una tarjeta y siguen funcionando en el punto de costura.
     El movimiento automático se detiene mientras dura el desplazamiento suave:
     si no, el bucle reescribe scrollLeft en cada fotograma y lo cancela. */
  const resume = useRef(null);
  const nudge = (dir) => {
    const t = track.current;
    if (!t) return;

    paused.current = true;
    clearTimeout(resume.current);
    resume.current = setTimeout(() => {
      paused.current = false;
    }, 800);
    const card = t.querySelector("[data-slide]");
    const step = card ? card.offsetWidth + 18 : 300;
    const half = t.scrollWidth / 2;

    let target = t.scrollLeft + dir * step;
    // Reposiciona antes de animar para que nunca choque contra los extremos
    if (target < 0) {
      t.scrollLeft += half;
      target = t.scrollLeft + dir * step;
    } else if (target > half * 2 - t.clientWidth) {
      t.scrollLeft -= half;
      target = t.scrollLeft + dir * step;
    }
    t.scrollTo({ left: target, behavior: "smooth" });
  };

  const items = [...GALERIA, ...GALERIA];

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
            onClick={() => nudge(-1)}
            aria-label="Anterior"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Siguiente"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={track}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onTouchStart={() => (paused.current = true)}
        onTouchEnd={() => (paused.current = false)}
        className="flex cursor-grab gap-[18px] overflow-x-auto px-[max(24px,calc((100vw-1300px)/2))] pb-3 [-ms-overflow-style:none] [overscroll-behavior-x:contain] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((g, i) => (
          <Slide key={`${g.src}-${i}`} item={g} index={i % GALERIA.length} acc={ACCENTS[i % ACCENTS.length]} />
        ))}
      </div>

      <p className="wrap mt-5 m-0 font-mono text-[.6rem] uppercase tracking-[.2em] text-white/35">
        Arrastra o usa las flechas
      </p>
    </section>
  );
}
