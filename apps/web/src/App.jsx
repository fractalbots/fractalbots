import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Galeria from "./components/Galeria";
import Nosotros from "./components/Nosotros";
import Lineas from "./components/Lineas";
import Ecosistema from "./components/Ecosistema";
import Showcase from "./components/Showcase";
import Makerspace from "./components/Makerspace";
import Ruta from "./components/Ruta";
import Metodologia from "./components/Metodologia";
import Trayectoria from "./components/Trayectoria";
import Proyectos from "./components/Proyectos";
import Instituciones from "./components/Instituciones";
import Faq from "./components/Faq";
import Cta from "./components/Cta";
import Footer from "./components/Footer";
import WhatsappFab from "./components/WhatsappFab";

export default function App() {
  return (
    <main id="top" className="relative min-h-screen w-full">
      <Loader />
      <Cursor />
      <Navbar />
      <Hero />
      <Marquee />
      <Galeria />
      <Nosotros />
      <Lineas />
      <Ecosistema />
      <Showcase />
      <Ruta />
      <Metodologia />
      <Trayectoria />
      <Proyectos />
      <Makerspace />
      <Instituciones />
      <Faq />
      <Cta />
      <Footer />
      <WhatsappFab />
    </main>
  );
}
