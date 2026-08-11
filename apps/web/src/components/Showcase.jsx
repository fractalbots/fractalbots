import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import ImageParallax from "./ImageParallax";
import Particles from "./Particles";
import Button from "./Button";
import { prefersReducedMotion } from "../lib/hooks";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Bloque a pantalla completa con la foto del laboratorio.
 * La imagen se revela con un clip-path que se abre al entrar (mismo lenguaje que el hero).
 */
export default function Showcase() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "#showcase-frame",
        { clipPath: "inset(12% 14% 12% 14% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "center 45%",
            scrub: 0.6,
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-[clamp(60px,8vw,110px)]">
      <Particles count={16} seed={21} depth={12} className="opacity-70" />

      <div className="wrap relative z-10">
        <Reveal as="p" className="eyebrow text-white/60">Nuestro espacio</Reveal>
        <AnimatedTitle text="Un laboratorio, no un aula" className="max-w-[14ch]" />
      </div>

      <div id="showcase-frame" className="relative mt-10 h-[min(78vh,660px)] w-full overflow-hidden">
        <ImageParallax
          src="/img/lab.jpg"
          alt="Estudiantes de Fractal-Bots trabajando con robots y computadoras en el laboratorio"
          speed={0.22}
          className="h-full w-full"
        />
        <div className="absolute inset-x-0 bottom-0 z-10 bg-[linear-gradient(180deg,transparent,rgba(7,10,17,.88))] p-[clamp(20px,4vw,54px)] pt-24">
          <div className="wrap flex flex-wrap items-end justify-between gap-6">
            <p className="m-0 max-w-[46ch] text-[clamp(1rem,1.5vw,1.35rem)] font-medium">
              Bancos de trabajo, impresoras 3D, microcontroladores y pistas de competencia. Todo lo que se
              enseña aquí se arma, se prueba y se rompe hasta que funciona.
            </p>
            <Button href="#contacto" variant="ghost">Agenda una visita</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
