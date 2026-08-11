import { useMagnetic } from "../lib/hooks";

export default function Button({ href = "#", children, variant = "solid", ...rest }) {
  const ref = useMagnetic();
  const variants = {
    solid: "btn",
    ghost: "btn btn-ghost",
    orange: "btn btn-orange",
    ghostDark: "btn btn-ghost-dark",
  };
  return (
    <a ref={ref} href={href} className={variants[variant]} {...rest}>
      {children}
    </a>
  );
}
