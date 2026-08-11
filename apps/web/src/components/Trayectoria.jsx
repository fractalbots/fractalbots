import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import { TRAYECTORIA } from "../data/content";

export default function Trayectoria() {
  return (
    <section id="trayectoria" className="sec bg-paper text-ink">
      <div className="wrap">
        <Reveal as="p" className="eyebrow text-ink/60">06 — Trayectoria</Reveal>
        <AnimatedTitle text="Tecnología puesta a prueba" className="max-w-[15ch]" />
        <Reveal delay={0.1}>
          <p className="lead mt-6 text-ink/60">
            Nuestros equipos han competido dentro y fuera del país. Estos son algunos de los resultados
            publicados.
          </p>
        </Reveal>

        <div className="mt-12 border-t border-ink/10 pt-0">
          {TRAYECTORIA.map((t, i) => (
            <Reveal key={`${t.yr}-${t.ev}`} delay={i * 0.04}>
              <div className="group relative grid items-baseline gap-[22px] border-b border-ink/10 py-6 md:grid-cols-[120px_1fr_240px]">
                <span className="font-display text-[1.6rem] font-extrabold tracking-[-.03em]">{t.yr}</span>
                <span className="text-[1.05rem] font-semibold">
                  <i className={`mr-[9px] inline-block h-[9px] w-[9px] rounded-full align-middle ${t.m}`} />
                  {t.ev}
                </span>
                <span className="font-mono text-[.68rem] uppercase tracking-[.14em] text-ink/60">{t.pl}</span>
                <span className="absolute -bottom-px left-0 h-px w-0 bg-ink transition-[width] duration-700 ease-soft group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
