import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import ImageParallax from "./ImageParallax";

const PUNTOS = [
  { t: "Diseño del espacio", d: "Distribución, mobiliario móvil, zonas de trabajo y seguridad eléctrica." },
  { t: "Equipamiento", d: "Impresoras 3D, herramienta, componentes y almacenamiento por proyecto." },
  { t: "Currículo", d: "Rutas de aprendizaje conectadas al plan académico de la institución." },
  { t: "Docentes", d: "Formación del equipo que va a sostener el espacio cuando nos vayamos." },
];

export default function Makerspace() {
  return (
    <section className="sec bg-paper text-ink">
      <div className="wrap grid items-center gap-[clamp(32px,5vw,72px)] lg:grid-cols-2">
        <div>
          <Reveal as="p" className="eyebrow text-ink/60">Makerspaces</Reveal>
          <AnimatedTitle text="Diseñamos el lugar donde se construye" size="d-md" className="max-w-[15ch]" />
          <Reveal delay={0.1}>
            <p className="lead mt-6 text-ink/60">
              Un makerspace no es un aula con impresoras. Es un espacio pensado para que los estudiantes
              trabajen en paralelo, se muevan, se equivoquen y dejen proyectos a medio terminar sobre la mesa.
            </p>
          </Reveal>
          <div className="mt-9 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {PUNTOS.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.06}>
                <div className="h-full bg-paper p-6">
                  <h4 className="m-0 mb-2 font-display text-[1.05rem] font-extrabold uppercase tracking-[-.02em]">
                    {p.t}
                  </h4>
                  <p className="m-0 text-[.88rem] text-ink/60">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <ImageParallax
            src="/img/makerspace.jpg"
            alt="Makerspace con mesas de trabajo móviles, laptops y estudiantes construyendo proyectos"
            speed={0.16}
            overlay={false}
            className="aspect-[4/5] w-full rounded-[24px] border border-ink/10 lg:aspect-[3/4]"
          />
        </Reveal>
      </div>
    </section>
  );
}
