import { useEffect, useRef } from "react";
import { isTouch, lerp } from "../lib/hooks";

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (isTouch()) return;
    let px = 0, py = 0, rx = 0, ry = 0, raf;
    const move = (e) => { px = e.clientX; py = e.clientY; };
    const grow = () => ring.current?.classList.add("scale-[2.05]", "bg-white/15", "border-transparent");
    const shrink = () => ring.current?.classList.remove("scale-[2.05]", "bg-white/15", "border-transparent");

    const targets = document.querySelectorAll("a,button,[data-cursor]");
    targets.forEach((t) => {
      t.addEventListener("mouseenter", grow);
      t.addEventListener("mouseleave", shrink);
    });

    const loop = () => {
      rx = lerp(rx, px, 0.16);
      ry = lerp(ry, py, 0.16);
      if (dot.current) dot.current.style.transform = `translate3d(${px}px,${py}px,0)`;
      if (ring.current) ring.current.style.translate = `${rx}px ${ry}px`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move, { passive: true });
    loop();
    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach((t) => {
        t.removeEventListener("mouseenter", grow);
        t.removeEventListener("mouseleave", shrink);
      });
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[9000] -ml-[3.5px] -mt-[3.5px] hidden h-[7px] w-[7px] rounded-full bg-fb-sky md:block"
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[9000] -ml-[19px] -mt-[19px] hidden h-[38px] w-[38px] rounded-full border border-white/50 mix-blend-difference transition-[transform,background-color,border-color] duration-300 ease-soft md:block"
      />
    </>
  );
}
