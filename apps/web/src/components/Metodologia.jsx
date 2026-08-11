import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import { METODO } from "../data/content";

export default function Metodologia() {
  return (
    <section id="metodologia" className="sec">
      <div className="wrap grid items-start gap-[clamp(28px,5vw,70px)] lg:grid-cols-[.85fr_1.15fr]">
        <div className="lg:sticky lg:top-[120px]">
          <Reveal as="p" className="eyebrow text-white/60">05 — Metodología</Reveal>
          <AnimatedTitle text="Aprender haciendo" size="d-md" className="max-w-[11ch]" />
          <Reveal delay={0.1}>
            <p className="lead mt-[22px] text-[1rem] text-white/60">
              Un robot no es solamente un robot: es matemáticas, física, electrónica, mecánica, programación,
              diseño y resolución de problemas ocurriendo al mismo tiempo.
            </p>
          </Reveal>
        </div>

        <div className="border-t border-white/10">
          {METODO.map((m, i) => (
            <Reveal key={m.n} delay={i * 0.05}>
              <div className="grid grid-cols-[64px_1fr] gap-[18px] border-b border-white/10 py-[26px] transition-[padding] duration-500 ease-soft hover:pl-[14px]">
                <b className="font-mono text-[.75rem] tracking-[.1em] text-fb-sky">/ {m.n}</b>
                <div>
                  <h4 className="m-0 mb-[6px] font-display text-[1.5rem] font-extrabold uppercase leading-none tracking-[-.02em]">
                    {m.t}
                  </h4>
                  <p className="m-0 text-[.95rem] text-white/60">{m.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
