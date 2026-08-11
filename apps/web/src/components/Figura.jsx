import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../lib/hooks";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Imagen o vídeo con parallax vertical al hacer scroll.
 * speed = cuántos % se desplaza el medio dentro de su marco (más alto = más profundidad).
 */
export default function Figura({
  src,
  video = false,
  poster,
  alt = "",
  speed = 14,
  aspect = "aspect-[16/9]",
  radius = "rounded-[22px]",
  caption,
  overlay = true,
  className = "",
}) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".figura-media",
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: root }
  );

  return (
    <figure ref={root} className={`relative m-0 overflow-hidden ${radius} ${aspect} ${className}`}>
      <div className="absolute inset-0 scale-[1.35]">
        {video ? (
          <video
            className="figura-media h-full w-full object-cover"
            src={src}
            poster={poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img className="figura-media h-full w-full object-cover" src={src} alt={alt} loading="lazy" />
        )}
      </div>
      {overlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      )}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,.14)]" />
      {caption && (
        <figcaption className="absolute bottom-5 left-6 right-6 font-mono text-[.64rem] uppercase tracking-[.2em] text-white/70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
