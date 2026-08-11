import { useEffect, useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import { PROYECTOS } from "../data/content";
import { clamp } from "../lib/hooks";

/**
 * Cada tarjeta admite tres tipos de medio, en este orden:
 *   1. video  → se reproduce en bucle y hace zoom-out suave al entrar
 *   2. media  → imagen con parallax vertical
 *   3. nada   → marcador con degradado (hueco listo para tu foto)
 */
function ProyectoCard({ p }) {
  const media = useRef(null);

  useEffect(() => {
    const el = media.current;
    if (!el) return;
    let raf = null;

    const update = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const prog = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height), 0, 1) - 0.5;
      el.querySelectorAll("[data-depth]").forEach((l) => {
        const d = parseFloat(l.dataset.depth || 0);
        l.style.transform = `translate3d(0, ${-prog * d * 1.6}%, 0)`;
      });
      const zoom = el.querySelector("[data-zoom]");
      if (zoom) zoom.style.transform = `scale(${1.14 - Math.abs(prog) * 0.12}) translate3d(0, ${prog * 6}%, 0)`;
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const hasVideo = Boolean(p.video);
  const hasImage = Boolean(p.media);

  return (
    <article
      data-cursor
      style={{ "--acc": p.acc }}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-ink-900 transition-colors duration-300 hover:border-[var(--acc)]"
    >
      <div ref={media} className="relative aspect-[16/10] overflow-hidden bg-ink-800">
        {hasVideo && (
          <>
            <video
              data-zoom
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              src={p.video}
              poster={p.poster}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,17,.1),rgba(7,10,17,.6))]" />
          </>
        )}

        {!hasVideo && hasImage && (
          <>
            <img
              data-zoom
              src={p.media}
              alt={p.titulo}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,17,.1),rgba(7,10,17,.6))]" />
          </>
        )}

        {!hasVideo && !hasImage && (
          <>
            <div data-depth="6" className="absolute -inset-[10%] grid-fine" />
            <div
              data-depth="14"
              className="absolute -inset-[10%]"
              style={{
                background:
                  "radial-gradient(60% 60% at 30% 30%, color-mix(in srgb, var(--acc) 60%, transparent), transparent 70%)",
              }}
            />
            <div data-depth="24" className="absolute -inset-[10%] grid place-items-center">
              <span className="whitespace-pre-line px-5 text-center font-mono text-[clamp(1.4rem,3.4vw,2.6rem)] font-bold tracking-[-.02em] text-white">
                {p.label}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-[26px]">
        <h4 className="m-0 mb-[10px] font-display text-[1.6rem] font-extrabold uppercase leading-none tracking-[-.03em]">
          {p.titulo}
        </h4>
        <p className="m-0 mb-4 text-[.95rem] text-white/60">{p.texto}</p>
        <div className="mt-auto flex flex-wrap gap-[6px]">
          {p.stack.map((s) => (
            <span key={s} className="chip-tag">{s}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Proyectos() {
  return (
    <section id="proyectos" className="sec">
      <div className="wrap">
        <Reveal as="p" className="eyebrow text-white/60">07 — Proyectos</Reveal>
        <AnimatedTitle text="Algunas ideas terminan funcionando" className="max-w-[16ch]" />
        <div className="mt-12 grid gap-[18px] md:grid-cols-2">
          {PROYECTOS.map((p) => (
            <Reveal key={p.titulo} className="h-full">
              <ProyectoCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
