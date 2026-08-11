import { useEffect, useState } from "react";

export default function Loader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] grid place-items-center bg-ink transition-[opacity,visibility] duration-700 ease-soft ${
        gone ? "invisible opacity-0" : "visible opacity-100"
      }`}
    >
      <div>
        <div className="flex gap-2">
          {["bg-fb-cyan", "bg-fb-green", "bg-fb-purple", "bg-fb-orange"].map((c, i) => (
            <i
              key={c}
              className={`h-[34px] w-[34px] rounded-[7px] ${c}`}
              style={{
                animation: `pop .8s cubic-bezier(.16,1,.3,1) ${0.05 + i * 0.1}s forwards`,
                transform: "translateY(26px) scale(.4)",
                opacity: 0,
              }}
            />
          ))}
        </div>
        <p className="mt-[22px] text-center font-mono text-[.7rem] tracking-[.3em] text-white/60">
          FRACTAL-BOTS
        </p>
      </div>
      <style>{`@keyframes pop{to{transform:none;opacity:1}}`}</style>
    </div>
  );
}
