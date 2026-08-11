import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import { STATS } from "../data/content";
import { useCounter } from "../lib/hooks";

function Stat({ n, label, color }) {
  const [val, ref] = useCounter(n);
  return (
    <div ref={ref} className="bg-paper px-[22px] py-7">
      <b className={`block font-display text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold leading-none tracking-[-.04em] ${color}`}>
        {val}
      </b>
      <span className="mt-[10px] block font-mono text-[.64rem] uppercase tracking-[.18em] text-ink/60">
        {label}
      </span>
    </div>
  );
}

export default function Nosotros() {
  return (
    <section id="nosotros" className="sec bg-paper text-ink">
      <div className="wrap">
        <Reveal as="p" className="eyebrow text-ink/60">01 — Quiénes somos</Reveal>
        <AnimatedTitle text="Mucho más que robótica" className="max-w-[16ch]" />

        <div className="mt-12 grid items-end gap-[clamp(30px,5vw,80px)] lg:grid-cols-[1.05fr_.95fr]">
          <Reveal>
            <p className="lead text-ink/70">
              Fractal-Bots es un centro ecuatoriano dedicado a la educación tecnológica, la innovación y el
              desarrollo de soluciones basadas en tecnología. No enseñamos a usar un kit: enseñamos a
              imaginar, diseñar, construir, programar, probar, corregir y mejorar.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="m-0 text-ink/60">
              Nuestra experiencia combina dos mundos que casi nunca conviven en el mismo lugar: un centro de
              formación donde niños, jóvenes y adultos desarrollan competencias en robótica, electrónica y
              programación; y un equipo que desarrolla software, sistemas académicos, prototipos electrónicos
              y soluciones de inteligencia artificial para instituciones y organizaciones.
            </p>
            <p className="mt-[18px] text-ink/60">Enseñamos tecnología porque también la construimos.</p>
          </Reveal>
        </div>

        <div className="mt-[72px] grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 md:grid-cols-4">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
