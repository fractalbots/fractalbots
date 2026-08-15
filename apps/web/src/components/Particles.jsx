import { useEffect, useMemo, useRef } from "react";
import { usePointerWhenVisible } from "../lib/pointer";

/**
 * Campo de átomos/burbujas de fondo.
 * Se genera con posiciones deterministas y se mantiene en la periferia:
 * una máscara radial vacía el centro para que NUNCA compita con el texto.
 */
const COLORS = ["#1E9AD7", "#43B02A", "#5E2D8E", "#F5811F", "#6FD3FF"];

// PRNG con semilla fija: mismas posiciones en cada render, sin saltos.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function useNodes(count, seed) {
  return useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, (_, i) => {
      // Reparte en anillo: evita el centro por construcción, no solo por máscara.
      const angle = r() * Math.PI * 2;
      const radius = 0.30 + r() * 0.24;
      return {
        id: i,
        x: 50 + Math.cos(angle) * radius * 100,
        y: 50 + Math.sin(angle) * radius * 78,
        size: 6 + r() * 26,
        color: COLORS[Math.floor(r() * COLORS.length)],
        dur: 9 + r() * 14,
        delay: -r() * 14,
        drift: 8 + r() * 22,
        ring: r() > 0.55,
      };
    });
  }, [count, seed]);
}

export default function Particles({ count = 26, seed = 7, depth = 16, className = "" }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return usePointerWhenVisible(el, (cx, cy) => {
      el.style.transform = `translate3d(${-cx * depth}px, ${-cy * depth}px, 0)`;
    });
  }, [depth]);

  const nodes = useNodes(count, seed);

  return (
    <div
      ref={root}
      aria-hidden
      className={`pointer-events-none absolute -inset-[10%] overflow-hidden ${className}`}
      style={{
        maskImage:
          "radial-gradient(ellipse 46% 42% at 50% 50%, transparent 40%, #000 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 46% 42% at 50% 50%, transparent 40%, #000 78%)",
      }}
    >
      {nodes.map((n) => (
        <span
          key={n.id}
          className="absolute block rounded-full"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: n.size,
            height: n.size,
            background: n.ring ? "transparent" : n.color,
            border: n.ring ? `1px solid ${n.color}` : "none",
            opacity: n.ring ? 0.5 : 0.32,
            boxShadow: n.ring ? "none" : `0 0 ${n.size}px ${n.color}`,
            animation: `floatNode ${n.dur}s ease-in-out ${n.delay}s infinite`,
            "--drift": `${n.drift}px`,
          }}
        />
      ))}

      {/* Órbitas tipo átomo, solo en las esquinas */}
      <svg className="absolute left-[3%] top-[12%] h-[220px] w-[220px] opacity-[.22]" viewBox="0 0 200 200" fill="none">
        <ellipse cx="100" cy="100" rx="92" ry="34" stroke="#1E9AD7" />
        <ellipse cx="100" cy="100" rx="92" ry="34" stroke="#6FD3FF" transform="rotate(60 100 100)" />
        <ellipse cx="100" cy="100" rx="92" ry="34" stroke="#43B02A" transform="rotate(120 100 100)" />
        <circle cx="100" cy="100" r="7" fill="#6FD3FF" />
      </svg>
      <svg className="absolute bottom-[10%] right-[4%] h-[180px] w-[180px] opacity-[.2]" viewBox="0 0 200 200" fill="none">
        <ellipse cx="100" cy="100" rx="92" ry="30" stroke="#F5811F" />
        <ellipse cx="100" cy="100" rx="92" ry="30" stroke="#5E2D8E" transform="rotate(72 100 100)" />
        <ellipse cx="100" cy="100" rx="92" ry="30" stroke="#1E9AD7" transform="rotate(144 100 100)" />
        <circle cx="100" cy="100" r="6" fill="#F5811F" />
      </svg>

      <style>{`
        @keyframes floatNode {
          0%,100% { transform: translate3d(0,0,0) }
          50%     { transform: translate3d(var(--drift), calc(var(--drift) * -0.8), 0) }
        }
      `}</style>
    </div>
  );
}
