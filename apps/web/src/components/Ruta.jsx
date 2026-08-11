import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import { NIVELES } from "../data/content";
import { prefersReducedMotion } from "../lib/hooks";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Ruta() {
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 821px)", () => {
        if (prefersReducedMotion()) return;
        const el = track.current;
        const distance = () => el.scrollWidth - window.innerWidth + window.innerWidth * 0.1;

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.to("#ruta-bar", {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="ruta" ref={root} className="relative overflow-hidden bg-paper py-20 text-ink md:h-screen md:py-0">
      <div className="flex h-full flex-col justify-center">
        <div className="mx-auto mb-[30px] flex w-[90vw] max-w-[1300px] flex-wrap items-end justify-between gap-5">
          <div>
            <Reveal as="p" className="eyebrow text-ink/60">04 — Ruta formativa</Reveal>
            <AnimatedTitle text="Cinco niveles, un mismo camino" size="d-md" className="max-w-[14ch]" />
          </div>
          <p className="m-0 font-mono text-[.68rem] uppercase tracking-[.2em] text-ink/60">Nivel 01 → 05</p>
        </div>

        <div
          ref={track}
          className="flex flex-col gap-[22px] px-[5vw] md:w-max md:flex-row md:will-change-transform"
        >
          {NIVELES.map((n) => (
            <article
              key={n.num}
              data-cursor
              style={{ "--acc": n.acc }}
              className="relative flex flex-none flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-white p-[34px] md:min-h-[min(60vh,470px)] md:w-[min(430px,82vw)]"
            >
              <span className="absolute inset-x-0 top-0 h-[5px] bg-[var(--acc)]" />
              <span className="font-mono text-[.66rem] tracking-[.24em] text-[var(--acc)]">{n.num}</span>
              <h3 className="my-3 font-display text-[1.75rem] font-extrabold uppercase leading-[.98] tracking-[-.03em]">
                {n.titulo}
              </h3>
              <p className="m-0 mb-5 text-[.95rem] text-ink/60">{n.texto}</p>
              <ul className="m-0 mt-auto flex list-none flex-wrap gap-[6px] p-0">
                {n.items.map((i) => (
                  <li
                    key={i}
                    className="rounded-full px-[10px] py-[5px] font-mono text-[.63rem] uppercase tracking-[.08em]"
                    style={{
                      background: "color-mix(in srgb, var(--acc) 12%, #fff)",
                      color: "color-mix(in srgb, var(--acc) 78%, #070A11)",
                    }}
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-[30px] hidden h-[2px] w-[90vw] max-w-[1300px] bg-ink/10 md:block">
          <i id="ruta-bar" className="block h-full w-0 bg-ink" />
        </div>
      </div>
    </section>
  );
}
