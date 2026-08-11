import { useInView } from "../lib/hooks";

/**
 * Título con reveal palabra por palabra al entrar en viewport.
 * Acepta \n en el texto para forzar salto de línea.
 *
 * Cada palabra vive en un contenedor con overflow:hidden, así que el espacio
 * NO puede ir dentro del texto (se recorta). La separación se hace con margen.
 */
export default function AnimatedTitle({ text, className = "", size = "d-lg", as: Tag = "h2" }) {
  const ref = useInView();
  const lines = text.split("\n");
  let idx = 0;

  return (
    <Tag ref={ref} className={`display ${size} ${className}`}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").filter(Boolean).map((word, wi) => {
            const delay = idx++ * 0.075;
            return (
              <span key={`${li}-${wi}`} className="rv-word mr-[.24em]">
                <span style={{ transitionDelay: `${delay}s` }}>{word}</span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
