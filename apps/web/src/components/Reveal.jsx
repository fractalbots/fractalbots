import { useInView } from "../lib/hooks";

export default function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const ref = useInView();
  return (
    <Tag ref={ref} className={`fade-up ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </Tag>
  );
}
