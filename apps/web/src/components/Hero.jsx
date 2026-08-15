import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "./Button";
import Particles from "./Particles";
import { ENLACES, HERO_TAGS } from "../data/content";
import { prefersReducedMotion } from "../lib/hooks";
import { usePointerWhenVisible } from "../lib/pointer";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FULL = "inset(0% 0% 0% 0% round 0px)";
const SMALL = "inset(17% 5% 21% 53% round 24px)";
const SMALL_MOBILE = "inset(64% 6% 10% 6% round 18px)";

export default function Hero() {
  const root = useRef(null);
  const layers = useRef([]);
  const addLayer = (el) => {
    if (el && !layers.current.includes(el)) layers.current.push(el);
  };

  /* Parallax de ratón por capas (bucle compartido, pausado fuera de pantalla) */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return usePointerWhenVisible(el, (cx, cy) => {
      layers.current.forEach((l) => {
        const d = parseFloat(l.dataset.depth || 0);
        l.style.transform = `translate3d(${-cx * d}px, ${-cy * d}px, 0)`;
      });
    });
  }, []);

  /* Scroll: la ventana se abre y el vídeo hace zoom-out desde dentro */
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set("#hero-frame", { clipPath: FULL });
        gsap.set("#hero-video", { scale: 1 });
        return;
      }
      const small = window.innerWidth < 760 ? SMALL_MOBILE : SMALL;
      gsap.set("#hero-frame", { clipPath: small });
      gsap.set("#hero-video", { scale: 1.14 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      /* Los tiempos están escalonados a propósito: el titular de la izquierda
         debe haberse ido ANTES de que aparezca el de la ventana, o los dos
         textos se cruzan y se leen encima uno del otro. */
      tl.to("#hero-frame", { clipPath: FULL, ease: "power1.inOut", duration: 1 }, 0)
        /* el vídeo empieza acercado y se aleja mientras la ventana crece */
        .to("#hero-video", { scale: 1, ease: "power1.inOut", duration: 1 }, 0)
        .to("#hero-content", { opacity: 0, y: -80, ease: "power1.in", duration: 0.34 }, 0)
        .to("#hero-bg", { opacity: 0, ease: "none", duration: 0.5 }, 0)
        .to("#scroll-hint", { opacity: 0, duration: 0.12 }, 0)
        .fromTo(
          "#frame-text",
          { scale: 0.62, opacity: 0 },
          { scale: 1, opacity: 1, ease: "power2.out", duration: 0.46 },
          0.42
        )
        .fromTo("#hero-veil", { opacity: 0.7 }, { opacity: 1, ease: "none", duration: 1 }, 0);
    },
    { scope: root }
  );

  return (
    <div id="hero-scroll" ref={root} className="relative h-[150vh]">
      <section className="sticky top-0 h-svh overflow-hidden bg-ink">
        {/* ---------- fondo: rejilla, halos y átomos ---------- */}
        <div id="hero-bg" className="absolute inset-0">
          <div ref={addLayer} data-depth="5" className="absolute -inset-[8%] grid-lines" />
          <div ref={addLayer} data-depth="10" className="absolute -inset-[8%]">
            <span className="absolute -left-[8%] top-[2%] h-[46vw] w-[46vw] rounded-full bg-fb-cyan opacity-40 blur-[100px]" />
            <span className="absolute -right-[6%] -top-[8%] h-[38vw] w-[38vw] rounded-full bg-fb-purple opacity-45 blur-[100px]" />
            <span className="absolute -bottom-[14%] right-[14%] h-[34vw] w-[34vw] rounded-full bg-fb-orange opacity-25 blur-[100px]" />
            <span className="absolute -bottom-[16%] left-[16%] h-[30vw] w-[30vw] rounded-full bg-fb-green opacity-25 blur-[100px]" />
          </div>
          <Particles count={30} seed={7} depth={22} />
        </div>

        {/* ---------- ventana con vídeo real ---------- */}
        <div id="hero-frame" className="absolute inset-0 z-[3] overflow-hidden">
          <video
            id="hero-video"
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            src="/videos/hero.mp4"
            poster="/img/hero-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          {/* velo para que el texto blanco siempre sea legible sobre el vídeo */}
          <div id="hero-veil" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,17,.2),rgba(7,10,17,.1)_45%,rgba(7,10,17,.55))]" />
          <div id="frame-text" className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <h2 className="display text-[clamp(1.6rem,5.4vw,4.6rem)] drop-shadow-[0_4px_30px_rgba(0,0,0,.6)]">
                De la idea
                <br />
                al prototipo
              </h2>
              <p className="mt-4 font-mono text-[.7rem] uppercase tracking-[.28em] text-white/70">
                Del prototipo a la solución
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,.22)]" />
        </div>

        {/* ---------- contenido: una sola columna, sin nada que lo cruce ---------- */}
        <div
          id="hero-content"
          className="pointer-events-none absolute inset-0 z-[4] flex flex-col justify-start pt-[16vh] lg:justify-center lg:pb-24 lg:pt-24"
        >
          <div className="wrap pointer-events-auto lg:max-w-[min(1300px,90vw)]">
            <div className="lg:w-[52%]">
            <p className="eyebrow text-white/60">Quito · Ecuador — Robótica · Tecnología · Innovación</p>
            <h1 className="display is-in max-w-[9ch] text-[clamp(2.5rem,6.4vw,5.6rem)] drop-shadow-[0_4px_40px_rgba(7,10,17,.75)] lg:max-w-[10ch]">
              <span className="rv-word mr-[.24em]">
                <span style={{ transitionDelay: "0s" }}>Tecnología</span>
              </span>
              <span className="rv-word mr-[.24em]">
                <span className="text-outline" style={{ transitionDelay: ".08s" }}>que se</span>
              </span>
              <span className="rv-word mr-[.24em]">
                <span className="text-fb-sky" style={{ transitionDelay: ".16s" }}>aprende</span>
              </span>
              <span className="rv-word">
                <span style={{ transitionDelay: ".24s" }}>construyendo</span>
              </span>
            </h1>
            <p className="mt-6 max-w-[40ch] text-[clamp(.98rem,1.25vw,1.12rem)] text-white/75">
              Formamos creadores de tecnología y desarrollamos soluciones reales.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#ruta" variant="orange">Conoce nuestros programas</Button>
              <Button href={ENLACES.sistema} variant="ghost" target="_blank" rel="noopener">
                Ingresar al sistema
              </Button>
            </div>
            </div>
          </div>
        </div>

        {/* ---------- barra inferior: etiquetas y aviso de scroll en la misma fila ---------- */}
        <div className="absolute inset-x-0 bottom-0 z-[5] pb-5">
          <div className="wrap flex items-end justify-between gap-6">
            <div className="hidden flex-wrap gap-x-2 gap-y-1 sm:flex sm:max-w-[70%]">
              {HERO_TAGS.map((t, i) => (
                <span key={t} className="font-mono text-[.6rem] uppercase tracking-[.2em] text-white/45">
                  {t}
                  {i < HERO_TAGS.length - 1 && <span className="ml-2 text-fb-orange">·</span>}
                </span>
              ))}
            </div>
            <div
              id="scroll-hint"
              className="ml-auto flex flex-col items-center gap-2 font-mono text-[.58rem] uppercase tracking-[.28em] text-white/45"
            >
              <i className="block h-[30px] w-px bg-gradient-to-b from-white to-transparent" />
              Desplázate
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}