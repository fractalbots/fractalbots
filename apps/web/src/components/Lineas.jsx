import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import Particles from "./Particles";
import { ENLACES, LINEAS } from "../data/content";

export default function Lineas() {
  return (
    <section id="lineas" className="relative overflow-hidden pt-[clamp(84px,11vw,170px)]">
      <Particles count={14} seed={33} depth={10} className="opacity-60" />
      <div className="wrap relative z-10">
        <Reveal as="p" className="eyebrow text-white/60">02 — Estructura</Reveal>
        <AnimatedTitle text="Aprende · crea · desarrolla · fabrica" className="max-w-[18ch]" />
        <Reveal delay={0.1}>
          <p className="lead mt-6 text-white/60">
            Tres líneas que se alimentan entre sí. Lo que se enseña en el aula se aplica en proyectos reales,
            y lo que se desarrolla en proyectos regresa al aula.
          </p>
        </Reveal>
      </div>

      <div className="mt-[clamp(48px,7vw,90px)] grid gap-px border-y border-white/10 bg-white/10 lg:grid-cols-3">
        {LINEAS.map((l) => (
          <article
            key={l.num}
            data-cursor
            style={{ "--acc": l.acc }}
            className="group relative flex min-h-[clamp(380px,44vw,520px)] flex-col justify-between overflow-hidden bg-ink px-[clamp(26px,3vw,44px)] py-[clamp(34px,4vw,60px)] transition-colors duration-500 hover:bg-ink-900"
          >
            <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[var(--acc)] transition-transform duration-[600ms] ease-soft group-hover:scale-x-100" />
            <div>
              <span className="font-mono text-[.66rem] tracking-[.22em] text-[var(--acc)]">{l.num}</span>
              <h3 className="my-4 whitespace-pre-line font-display text-[clamp(1.7rem,2.9vw,2.6rem)] font-extrabold uppercase leading-[.95] tracking-[-.03em]">
                {l.titulo}
              </h3>
              <p className="m-0 mb-[22px] text-[.98rem] text-white/60">{l.texto}</p>
            </div>
            <div>
              <ul className="m-0 flex list-none flex-wrap gap-[7px] p-0">
                {l.items.map((i) => (
                  <li key={i} className="chip-tag transition-colors duration-300 group-hover:border-[var(--acc)]">
                    {i}
                  </li>
                ))}
              </ul>
              {l.enlace && (
                <a
                  href={l.enlace}
                  target="_blank"
                  rel="noopener"
                  className="mt-6 inline-flex items-center gap-2 border-b border-[var(--acc)] pb-1 font-mono text-[.7rem] uppercase tracking-[.14em] text-[var(--acc)] transition-opacity duration-300 hover:opacity-70"
                >
                  {l.enlaceTexto} ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
