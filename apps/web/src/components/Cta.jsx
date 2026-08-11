import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import Button from "./Button";
import Particles from "./Particles";
import { CONTACTO } from "../data/content";

const IDEAS = ["Un robot", "Un circuito", "Una aplicación", "Un sistema", "Un prototipo", "Una solución con IA"];

export default function Cta() {
  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-[linear-gradient(150deg,#0A1322,#070A11_65%)] py-[clamp(90px,14vw,190px)] text-center"
    >
      <span className="absolute -left-[8%] top-[2%] h-[46vw] w-[46vw] rounded-full bg-fb-cyan opacity-[.34] blur-[90px]" />
      <span className="absolute -bottom-[14%] right-[14%] h-[34vw] w-[34vw] rounded-full bg-fb-orange opacity-[.28] blur-[90px]" />
      <Particles count={20} seed={99} depth={18} />
      <div className="wrap relative z-10">
        <Reveal as="p" className="eyebrow justify-center text-white/60">10 — Hablemos</Reveal>
        <AnimatedTitle text="¿Tienes una idea? Hagámosla realidad" className="mx-auto max-w-[12ch]" />
        <div className="my-8 flex flex-wrap justify-center gap-[10px]">
          {IDEAS.map((i) => (
            <span key={i} className="chip-tag">{i}</span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href={CONTACTO.whatsapp} variant="orange" target="_blank" rel="noopener">
            Escribir por WhatsApp
          </Button>
          <Button href={CONTACTO.tel} variant="ghost">{CONTACTO.telefono}</Button>
        </div>
      </div>
    </section>
  );
}
