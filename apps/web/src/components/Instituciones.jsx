import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import { INSTITUCIONES } from "../data/content";

export default function Instituciones() {
  return (
    <section id="instituciones" className="sec bg-paper text-ink">
      <div className="wrap">
        <Reveal as="p" className="eyebrow text-ink/60">08 — Instituciones educativas</Reveal>
        <AnimatedTitle text="Lleva la tecnología a tu institución" className="max-w-[15ch]" />
        <Reveal delay={0.1}>
          <p className="lead mt-6 text-ink/60">
            Diseñamos programas que se integran a la realidad de cada institución, y formamos a los docentes
            que van a sostenerlos.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {INSTITUCIONES.map((i) => (
            <div
              key={i.t}
              style={{ "--acc": i.acc }}
              className="flex min-h-[230px] flex-col justify-between bg-paper px-[26px] py-8 transition-colors duration-300 hover:bg-white"
            >
              <i className="block h-[34px] w-[34px] rounded-[9px] bg-[var(--acc)]" />
              <div>
                <h4 className="m-0 mb-2 mt-[14px] font-display text-[1.25rem] font-extrabold uppercase leading-none tracking-[-.02em]">
                  {i.t}
                </h4>
                <p className="m-0 text-[.9rem] text-ink/60">{i.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
