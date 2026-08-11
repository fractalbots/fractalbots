import { useRef, useState } from "react";
import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import { FAQS } from "../data/content";

function Item({ q, a, open, onToggle }) {
  const body = useRef(null);
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="relative w-full cursor-pointer border-0 bg-transparent py-6 pl-0 pr-11 text-left font-display text-[clamp(1.05rem,1.9vw,1.5rem)] font-extrabold uppercase leading-tight tracking-[-.02em] text-white"
      >
        {q}
        <span
          className={`absolute right-2 top-1/2 -translate-y-1/2 font-body text-[1.6rem] font-normal text-fb-sky transition-transform duration-500 ease-soft ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        ref={body}
        style={{ maxHeight: open ? `${body.current?.scrollHeight || 400}px` : 0 }}
        className="overflow-hidden transition-[max-height] duration-[600ms] ease-soft"
      >
        <p className="m-0 mb-[26px] max-w-[70ch] text-white/60">{a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="sec">
      <div className="wrap max-w-[1000px]">
        <Reveal as="p" className="eyebrow text-white/60">09 — Preguntas frecuentes</Reveal>
        <AnimatedTitle text="Lo que suelen preguntarnos" size="d-md" className="max-w-[14ch]" />
        <div className="mt-11 border-t border-white/10">
          {FAQS.map((f, i) => (
            <Item key={f.q} {...f} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
