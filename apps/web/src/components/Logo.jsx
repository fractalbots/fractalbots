const PIECES = [
  { l: "B", c: "bg-fb-cyan" },
  { l: "O", c: "bg-fb-green" },
  { l: "T", c: "bg-fb-purple" },
  { l: "S", c: "bg-fb-orange" },
];

export default function Logo({ dark = false, className = "" }) {
  return (
    <a
      href="#top"
      className={`flex items-center gap-[9px] font-display text-[1.22rem] font-extrabold uppercase leading-none tracking-[-.02em] ${className}`}
      aria-label="Fractal-Bots, inicio"
    >
      <span className={dark ? "text-ink" : "text-white"}>FRACTAL</span>
      <span className="flex gap-[3px]">
        {PIECES.map((p, i) => (
          <span
            key={p.l}
            className={`relative grid h-[1.42em] w-[1.42em] place-items-center rounded-[5px] text-[.78em] text-white ${p.c}`}
          >
            {p.l}
            {i < PIECES.length - 1 && (
              <span
                className={`absolute -right-[3px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full ${p.c}`}
              />
            )}
          </span>
        ))}
      </span>
    </a>
  );
}
