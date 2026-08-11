import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Logo from "./Logo";
import Button from "./Button";
import { ENLACES, NAV } from "../data/content";

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 60);
      setHidden(y > lastY.current && y > window.innerHeight * 0.9 && !open);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle("locked", open);
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const t = document.querySelector(href);
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={clsx(
          "fixed inset-x-0 top-0 z-[600] py-4 transition-[transform,background-color,backdrop-filter] duration-500 ease-soft",
          hidden && "-translate-y-[130%]",
          solid && "border-b border-white/10 bg-ink/70 backdrop-blur-xl"
        )}
      >
        <div className="wrap flex items-center justify-between gap-4">
          <Logo />
          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => go(e, n.href)}
                className="rounded-full px-[13px] py-[9px] font-mono text-[.72rem] uppercase tracking-[.12em] text-white/70 transition-colors duration-300 hover:bg-white/10 hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-[10px]">
            <a
              href={ENLACES.tienda}
              target="_blank"
              rel="noopener"
              className="hidden rounded-full px-[13px] py-[9px] font-mono text-[.72rem] uppercase tracking-[.12em] text-white/70 transition-colors duration-300 hover:bg-white/10 hover:text-white xl:block"
            >
              Tienda
            </a>
            <div className="hidden lg:block">
              <Button href={ENLACES.sistema} target="_blank" rel="noopener">Ingresar al sistema</Button>
            </div>
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setOpen((o) => !o)}
              className="relative h-11 w-11 rounded-full border border-white/15 lg:hidden"
            >
              <span
                className={clsx(
                  "absolute left-[13px] h-[1.5px] w-[18px] bg-white transition-all duration-300 ease-soft",
                  open ? "top-[21px] rotate-45" : "top-[18px]"
                )}
              />
              <span
                className={clsx(
                  "absolute left-[13px] h-[1.5px] w-[18px] bg-white transition-all duration-300 ease-soft",
                  open ? "top-[21px] -rotate-45" : "top-6"
                )}
              />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={clsx(
          "fixed inset-0 z-[590] overflow-y-auto bg-ink-900 px-0 pb-10 pt-[100px] transition-[clip-path] duration-700 ease-soft",
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
        )}
      >
        <div className="wrap">
          {[...NAV, { label: "Contacto", href: "#contacto" }].map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => go(e, n.href)}
              className="block border-b border-white/10 py-[6px] font-display text-[clamp(2rem,9vw,3.2rem)] font-extrabold uppercase leading-[1.05] tracking-[-.03em] hover:text-fb-sky"
            >
              {n.label}
            </a>
          ))}
          <a
            href={ENLACES.sistema}
            target="_blank"
            rel="noopener"
            className="block border-b border-white/10 py-[6px] font-display text-[clamp(2rem,9vw,3.2rem)] font-extrabold uppercase leading-[1.05] tracking-[-.03em] text-fb-sky"
          >
            Sistema ↗
          </a>
          <a
            href={ENLACES.tienda}
            target="_blank"
            rel="noopener"
            className="block border-b border-white/10 py-[6px] font-display text-[clamp(2rem,9vw,3.2rem)] font-extrabold uppercase leading-[1.05] tracking-[-.03em] text-fb-orange"
          >
            Tienda ↗
          </a>
        </div>
      </div>
    </>
  );
}
