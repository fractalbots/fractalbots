import { useEffect, useRef, useState } from "react";
import AnimatedTitle from "./AnimatedTitle";
import Reveal from "./Reveal";
import Particles from "./Particles";
import { BENTO, CONTACTO } from "../data/content";
import { isTouch, prefersReducedMotion } from "../lib/hooks";

/**
 * Fondo de la tarjeta: foto translúcida o, si falta el archivo, degradado de marca.
 *
 * ¿QUIERES LAS FOTOS MÁS O MENOS VISIBLES? Son dos valores:
 *   1. opacity-[.45] y group-hover:opacity-[.62]  → cuánto se ve la foto
 *      (sube a .60/.75 para más, baja a .30/.45 para menos)
 *   2. El velo oscuro de abajo → protege la lectura del texto.
 *      Si aclaras mucho la foto, sube el último valor (.92) para compensar.
 */
function Fondo({ img, acc }) {
  const [ok, setOk] = useState(Boolean(img));
  return (
    <>
      {ok && (
        <img
          src={img}
          alt=""
          aria-hidden
          loading="lazy"
          onError={() => setOk(false)}
          className="absolute inset-0 -z-10 h-full w-full scale-105 object-cover opacity-[.45] transition-[opacity,transform] duration-700 ease-soft group-hover:scale-100 group-hover:opacity-[.62]"
        />
      )}
      {!ok && (
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{
            background:
              "radial-gradient(90% 80% at 80% 10%, color-mix(in srgb, var(--acc) 45%, transparent), transparent 60%)",
          }}
        />
      )}
      {/* Velo: garantiza contraste del texto sea cual sea la foto */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,10,17,.25)_0%,rgba(7,10,17,.45)_45%,rgba(7,10,17,.92)_100%)]" />
    </>
  );
}

function Tarjeta({ item, onOpen }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (isTouch() || prefersReducedMotion()) return;
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(item)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ "--acc": item.acc }}
      aria-label={`Ver detalle de ${item.titulo}`}
      className={`spotlight group isolate relative flex min-h-[230px] flex-col overflow-hidden rounded-[20px] border border-white/10 bg-ink-900 p-[26px] text-left transition-colors duration-300 hover:border-[var(--acc)] ${item.span}`}
    >
      <Fondo img={item.img} acc={item.acc} />

      {/* La etiqueta va en el flujo, no absoluta: antes se superponía al título
          cuando el título ocupaba tres líneas. */}
      <span className="mb-auto inline-flex w-fit rounded-full bg-ink/70 px-[10px] py-[5px] font-mono text-[.6rem] uppercase tracking-[.2em] text-[var(--acc)] backdrop-blur-sm">
        {item.tag}
      </span>

      <div className="mt-6">
        <h4 className="m-0 mb-2 font-display text-[clamp(1.25rem,2vw,1.8rem)] font-extrabold uppercase leading-[1.02] tracking-[-.03em] drop-shadow-[0_2px_12px_rgba(7,10,17,.9)]">
          {item.titulo}
        </h4>
        <p className="m-0 text-[.92rem] text-white/75 drop-shadow-[0_1px_8px_rgba(7,10,17,.9)]">{item.texto}</p>
        <span className="mt-4 inline-flex items-center gap-2 font-mono text-[.62rem] uppercase tracking-[.18em] text-white/45 transition-colors duration-300 group-hover:text-[var(--acc)]">
          Ver detalle
          <i className="grid h-[18px] w-[18px] place-items-center rounded-full border border-current text-[10px] not-italic leading-none">
            +
          </i>
        </span>
      </div>
    </button>
  );
}

function Detalle({ item, onClose }) {
  const caja = useRef(null);

  useEffect(() => {
    document.body.classList.add("locked");
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    caja.current?.focus();
    return () => {
      document.body.classList.remove("locked");
      window.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  if (!item) return null;
  const d = item.detalle || {};

  return (
    <div
      className="fixed inset-0 z-[800] flex items-end justify-center bg-ink/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.titulo}
    >
      <div
        ref={caja}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{ "--acc": item.acc }}
        className="relative max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-t-[24px] border border-white/12 bg-ink-900 p-[clamp(24px,4vw,44px)] outline-none sm:rounded-[24px]"
      >
        <span className="absolute inset-x-0 top-0 h-[4px] bg-[var(--acc)]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
        >
          ✕
        </button>

        <span className="font-mono text-[.62rem] uppercase tracking-[.22em] text-[var(--acc)]">
          {item.tag}
        </span>
        <h3 className="m-0 mb-4 mt-3 max-w-[18ch] font-display text-[clamp(1.6rem,3.4vw,2.5rem)] font-extrabold uppercase leading-[.98] tracking-[-.03em]">
          {item.titulo}
        </h3>

        {d.intro && <p className="m-0 text-[1rem] text-white/75">{d.intro}</p>}

        {d.items?.length > 0 && (
          <ul className="mt-7 grid list-none gap-px border border-white/10 bg-white/10 p-0 sm:grid-cols-2">
            {d.items.map((i) => (
              <li key={i} className="flex items-start gap-3 bg-ink-900 px-4 py-[14px] text-[.9rem] text-white/80">
                <i className="mt-[7px] block h-[6px] w-[6px] flex-none rounded-full bg-[var(--acc)]" />
                {i}
              </li>
            ))}
          </ul>
        )}

        {d.entrega && (
          <p className="mt-6 border-l-2 border-[var(--acc)] pl-4 text-[.92rem] text-white/60">
            {d.entrega}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`${CONTACTO.whatsapp}?text=${encodeURIComponent(
              `Hola Fractal-Bots, me interesa: ${item.titulo}`
            )}`}
            target="_blank"
            rel="noopener"
            className="btn btn-orange"
          >
            Consultar por WhatsApp
          </a>
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Ecosistema() {
  const [abierta, setAbierta] = useState(null);

  return (
    <section id="ecosistema" className="sec overflow-hidden">
      <Particles count={18} seed={51} depth={14} className="opacity-50" />
      <div className="wrap relative z-10">
        <Reveal as="p" className="eyebrow text-white/60">03 — Ecosistema</Reveal>
        <AnimatedTitle text="Todo lo que sabemos hacer" className="max-w-[17ch]" />
        <Reveal delay={0.1}>
          <p className="lead mt-6 text-white/60">
            Educamos, desarrollamos y automatizamos. Toca cualquier área para ver qué incluye y
            qué recibes al final.
          </p>
        </Reveal>

        <div className="mt-12 grid auto-rows-[minmax(230px,auto)] grid-cols-1 gap-[14px] sm:grid-cols-2 md:grid-cols-4">
          {BENTO.map((b) => (
            <Tarjeta key={b.titulo} item={b} onOpen={setAbierta} />
          ))}
        </div>
      </div>

      {abierta && <Detalle item={abierta} onClose={() => setAbierta(null)} />}
    </section>
  );
}
