import { useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import Particles from "./Particles";
import { BENTO } from "../data/content";
import { isTouch, prefersReducedMotion } from "../lib/hooks";

function BentoCard({ item }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (isTouch() || prefersReducedMotion()) return;
    const rx = (y / r.height - 0.5) * -6;
    const ry = (x / r.width - 0.5) * 6;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <article
      ref={ref}
      data-cursor
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ "--acc": item.acc }}
      className={`spotlight isolate relative flex flex-col justify-end overflow-hidden rounded-[20px] border border-white/10 bg-ink-900 p-[26px] transition-colors duration-300 hover:border-[var(--acc)] ${item.span}`}
    >
      <div className={`absolute inset-0 -z-10 opacity-50 ${item.art}`} />
      <span className="absolute left-[26px] top-[22px] font-mono text-[.6rem] uppercase tracking-[.2em] text-[var(--acc)]">
        {item.tag}
      </span>
      <h4 className="m-0 mb-2 font-display text-[clamp(1.25rem,2vw,1.8rem)] font-extrabold uppercase leading-none tracking-[-.03em]">
        {item.titulo}
      </h4>
      <p className="m-0 text-[.92rem] text-white/60">{item.texto}</p>
    </article>
  );
}

export default function Ecosistema() {
  return (
    <section id="ecosistema" className="sec overflow-hidden">
      <Particles count={18} seed={51} depth={14} className="opacity-50" />
      <div className="wrap relative z-10">
        <Reveal as="p" className="eyebrow text-white/60">03 — Ecosistema</Reveal>
        <AnimatedTitle text="Todo lo que sabemos hacer" className="max-w-[17ch]" />
        <div className="mt-12 grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-[14px] sm:grid-cols-2 md:grid-cols-4">
          {BENTO.map((b) => (
            <BentoCard key={b.titulo} item={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
