import { MARQUEE } from "../data/content";

const DOTS = ["bg-fb-orange", "bg-fb-cyan", "bg-fb-green", "bg-fb-purple"];

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="group overflow-hidden border-y border-white/10 bg-ink py-[18px]">
      <div className="flex w-max animate-slide group-hover:[animation-play-state:paused]">
        {items.map((m, i) => (
          <span
            key={`${m}-${i}`}
            className="flex items-center gap-[26px] px-[26px] font-display text-[clamp(1.1rem,2.3vw,1.9rem)] font-extrabold uppercase tracking-[-.02em] text-white/90"
          >
            {m}
            <i className={`block h-[9px] w-[9px] rounded-full ${DOTS[i % 4]}`} />
          </span>
        ))}
      </div>
    </div>
  );
}
