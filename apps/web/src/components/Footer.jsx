import Logo from "./Logo";
import { CONTACTO, ENLACES } from "../data/content";

const COLS = [
  {
    title: "Educación",
    links: [
      { t: "Programas por niveles", h: "#ruta" },
      { t: "Club de robótica", h: "#ruta" },
      { t: "Vacacionales", h: "#ruta" },
      { t: "Capacitación docente", h: "#instituciones" },
    ],
  },
  {
    title: "Tecnología",
    links: [
      { t: "Desarrollo de software", h: "#ecosistema" },
      { t: "Inteligencia artificial", h: "#ecosistema" },
      { t: "Electrónica e IoT", h: "#ecosistema" },
      { t: "Impresión 3D", h: "#ecosistema" },
    ],
  },
  {
    title: "Plataformas",
    links: [
      { t: "Sistema de gestión ↗", h: ENLACES.sistema, ext: true },
      { t: "ToboTech · Tienda ↗", h: ENLACES.tienda, ext: true },
      { t: "Código en GitHub ↗", h: ENLACES.repo, ext: true },
    ],
  },
  {
    title: "Contacto",
    links: [
      { t: CONTACTO.telefono, h: CONTACTO.tel },
      { t: "WhatsApp", h: CONTACTO.whatsapp },
      { t: "Proyectos", h: "#proyectos" },
      { t: "Preguntas frecuentes", h: "#faq" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink pb-9 pt-[70px]">
      <div className="wrap">
        <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="m-0 mt-[18px] max-w-[34ch] text-[.92rem] text-white/60">
              Centro de Robótica Educativa, Tecnología e Innovación.
              <br />
              {CONTACTO.direccion}
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h5 className="m-0 mb-4 font-mono text-[.64rem] font-medium uppercase tracking-[.22em] text-white/45">
                {c.title}
              </h5>
              <ul className="m-0 grid list-none gap-[9px] p-0">
                {c.links.map((l) => (
                  <li key={l.t}>
                    <a
                      href={l.h}
                      {...(l.ext ? { target: "_blank", rel: "noopener" } : {})}
                      className="text-[.92rem] text-white/75 hover:text-fb-sky"
                    >
                      {l.t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-[22px] font-mono text-[.64rem] uppercase tracking-[.14em] text-white/40">
          <span>© {new Date().getFullYear()} Fractal-Bots · Quito, Ecuador</span>
          <span>Aprendemos tecnología construyéndola</span>
        </div>
      </div>
    </footer>
  );
}
