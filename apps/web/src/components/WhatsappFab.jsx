import { FaWhatsapp } from "react-icons/fa";
import { CONTACTO } from "../data/content";

export default function WhatsappFab() {
  return (
    <a
      href={CONTACTO.whatsapp}
      target="_blank"
      rel="noopener"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-[22px] right-[22px] z-[500] grid h-14 w-14 place-items-center rounded-full bg-fb-green shadow-[0_12px_34px_rgba(67,176,42,.4)] transition-transform duration-500 ease-soft hover:scale-110"
    >
      <FaWhatsapp className="h-7 w-7 text-white" />
    </a>
  );
}
