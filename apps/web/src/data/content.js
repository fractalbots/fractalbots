/* ─────────────────────────────────────────────────────────────
   ENLACES EXTERNOS
   Cambia estas dos URLs si el despliegue se mueve de sitio.
   ───────────────────────────────────────────────────────────── */
export const ENLACES = {
  sistema: "https://fractalbots.vercel.app",          // plataforma de gestión
  tienda: "https://tobotech.vercel.app",              // ToboTech
  repo: "https://github.com/fractalbots/fractalbots", // código fuente
};

/* ─────────────────────────────────────────────────────────────
   GALERÍA DEL CARRUSEL (debajo del banner)

   1. Guarda tus fotos en:  public/img/galeria/
   2. Nómbralas img1.jpg, img2.jpg, img3.jpg…
   3. Añade o quita entradas de esta lista.

   Si un archivo no existe, esa tarjeta muestra un degradado de
   marca en lugar de romperse. Proporción ideal 4:3, mínimo 1000px.
   ───────────────────────────────────────────────────────────── */
export const GALERIA = [
  { src: "/img/galeria/img1.jpg", titulo: "Clases de robótica", pie: "Nivel 1 · Electrónica y primeros circuitos" },
  { src: "/img/galeria/img2.jpg", titulo: "Impresión 3D", pie: "Del modelo digital a la pieza funcional" },
  { src: "/img/galeria/img3.jpg", titulo: "Competencias", pie: "Mini Sumo y seguidores de línea" },
  { src: "/img/galeria/img4.jpg", titulo: "Programación", pie: "Arduino, ESP32 y Python" },
  { src: "/img/galeria/img5.jpg", titulo: "Proyectos propios", pie: "Club de robótica" },
  { src: "/img/galeria/img6.jpg", titulo: "Instituciones", pie: "Programas y capacitación docente" },
];

export const CONTACTO = {
  telefono: "099 016 3527",
  whatsapp: "https://wa.me/593990163527",
  tel: "tel:+593990163527",
  direccion: "Plaza Real de Calderón · Quito, Ecuador",
};

export const NAV = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Ecosistema", href: "#ecosistema" },
  { label: "Formación", href: "#ruta" },
  { label: "Trayectoria", href: "#trayectoria" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Instituciones", href: "#instituciones" },
];

export const HERO_TAGS = [
  "Robótica",
  "Electrónica",
  "Programación",
  "Inteligencia Artificial",
  "Software",
  "STEM",
  "Fabricación digital",
];

export const HERO_CHIPS = [
  { txt: "// Arduino · ESP32 · Raspberry Pi", pos: "left-[6%] top-[26%]", border: "border-white/20" },
  { txt: "// Impresión 3D · CAD", pos: "right-[7%] top-[34%]", border: "border-fb-cyan/50" },
  { txt: "// Python · Visión artificial", pos: "left-[11%] bottom-[22%]", border: "border-fb-green/50" },
  { txt: "// IoT · MQTT · Automatización", pos: "right-[12%] bottom-[27%]", border: "border-fb-orange/50" },
];

export const MARQUEE = [
  "Aprender haciendo",
  "Robótica educativa",
  "Desarrollo de software",
  "Inteligencia artificial",
  "Impresión 3D",
  "IoT",
  "STEM",
  "Mecatrónica",
];

export const STATS = [
  { n: 2017, label: "Primeras competencias", color: "text-fb-cyan" },
  { n: 9, label: "Podios en torneos", color: "text-fb-green" },
  { n: 5, label: "Niveles de formación", color: "text-fb-purple" },
  { n: 3, label: "Líneas: educa · desarrolla · provee", color: "text-fb-orange" },
];

export const LINEAS = [
  {
    num: "LÍNEA 01",
    titulo: "Fractal-Bots\nEducación",
    acc: "#1E9AD7",
    texto:
      "Formamos niños, jóvenes y adultos en competencias tecnológicas reales, desde el primer circuito hasta sistemas autónomos con inteligencia artificial.",
    items: ["Robótica", "Electrónica", "Arduino", "ESP32", "Diseño 3D", "Python", "STEM", "Club de robótica", "Vacacionales"],
  },
  {
    num: "LÍNEA 02",
    titulo: "Fractal-Bots\nTecnología",
    acc: "#5E2D8E",
    texto:
      "Desarrollamos software, sistemas y prototipos para personas, instituciones educativas y organizaciones que necesitan digitalizar o automatizar procesos.",
    items: ["Software", "Sistemas académicos", "IA aplicada", "Automatización", "Electrónica", "IoT", "Prototipado", "Integraciones"],
    enlace: "https://fractalbots.vercel.app",
    enlaceTexto: "Ver la plataforma",
  },
  {
    num: "LÍNEA 03",
    titulo: "ToboTech\nStore",
    acc: "#F5811F",
    texto:
      "Componentes para creadores. No solamente vendemos piezas: sabemos para qué sirven, porque detrás de cada componente hay un proyecto.",
    items: ["Componentes", "Sensores", "Actuadores", "Kits", "Equipamiento", "Fabricación digital"],
    enlace: "https://tobotech.vercel.app",
    enlaceTexto: "Ir a la tienda",
  },
];

export const BENTO = [
  {
    tag: "Educación tecnológica",
    titulo: "Centro de robótica educativa",
    texto:
      "Programas por niveles para niños, jóvenes y adultos. Electrónica, programación, diseño mecánico, fabricación digital e inteligencia artificial, siempre construyendo proyectos propios.",
    acc: "#1E9AD7",
    span: "md:col-span-2 md:row-span-2",
    art: "acc-glow",
  },
  {
    tag: "Software",
    titulo: "Plataformas y sistemas a medida",
    texto: "Aplicaciones web, sistemas académicos y administrativos, bases de datos, autenticación y automatización de procesos.",
    acc: "#5E2D8E",
    span: "md:col-span-2",
    art: "hatch",
  },
  {
    tag: "IA",
    titulo: "Inteligencia artificial aplicada",
    texto: "Problema → datos → algoritmo → sistema → resultado.",
    acc: "#43B02A",
    span: "",
    art: "dots",
  },
  {
    tag: "Fabricación",
    titulo: "Diseño e impresión 3D",
    texto: "Del modelo digital al objeto físico.",
    acc: "#F5811F",
    span: "",
    art: "acc-glow",
  },
  {
    tag: "Electrónica · IoT",
    titulo: "Del circuito al sistema",
    texto: "Microcontroladores, sensores, actuadores, comunicaciones inalámbricas y sistemas embebidos conectados.",
    acc: "#43B02A",
    span: "md:col-span-2",
    art: "dots",
  },
  {
    tag: "Instituciones",
    titulo: "Makerspaces y capacitación docente",
    texto: "Llevamos la tecnología dentro de tu institución.",
    acc: "#1E9AD7",
    span: "",
    art: "hatch",
  },
  {
    tag: "Servicios",
    titulo: "Soporte, CCTV y equipamiento",
    texto: "Diagnóstico, instalación, configuración y asesoría técnica.",
    acc: "#5E2D8E",
    span: "",
    art: "acc-glow",
  },
];

export const NIVELES = [
  {
    num: "NIVEL 01",
    acc: "#1E9AD7",
    titulo: "Fundamentos de electrónica y robótica",
    texto: "El estudiante descubre cómo funcionan los componentes y construye sus primeros circuitos y sistemas.",
    items: ["Electricidad", "Resistencias", "LEDs", "Sensores", "Motores", "Servomotores", "Protoboard", "Microcontroladores"],
  },
  {
    num: "NIVEL 02",
    acc: "#43B02A",
    titulo: "Programación y control",
    texto: "Aquí el código empieza a mover cosas reales: entradas, salidas, sensores y actuadores.",
    items: ["Arduino", "Entradas/salidas", "Señales analógicas", "Control de motores", "Algoritmos", "Automatización"],
  },
  {
    num: "NIVEL 03",
    acc: "#5E2D8E",
    titulo: "Diseño mecánico y fabricación digital",
    texto: "La tecnología deja de ser solo electrónica: el estudiante diseña físicamente su propio robot.",
    items: ["Diseño 3D", "Tinkercad", "CAD", "SolidWorks", "Impresión 3D", "Ensamblaje", "Prototipado"],
  },
  {
    num: "NIVEL 04",
    acc: "#F5811F",
    titulo: "Robótica avanzada",
    texto: "Sistemas autónomos, comunicación entre dispositivos y proyectos con complejidad de ingeniería.",
    items: ["ESP32", "Comunicación inalámbrica", "Sensores avanzados", "Robótica móvil", "Internet de las cosas"],
  },
  {
    num: "NIVEL 05",
    acc: "#1E9AD7",
    titulo: "Programación e inteligencia artificial",
    texto: "La robótica se conecta con el software: datos, algoritmos y sistemas que aprenden.",
    items: ["Python", "Análisis de datos", "Visión artificial", "Machine Learning", "IA + dispositivos"],
  },
  {
    num: "CLUB",
    acc: "#43B02A",
    titulo: "Club de robótica",
    texto: "Para quienes quieren ir más allá: investigar, competir y desarrollar prototipos propios.",
    items: ["Mini Sumo", "Seguidor de línea", "Robot Soccer", "Robots autónomos", "Competencias"],
  },
];

export const METODO = [
  { n: "01", t: "Descubrir", d: "Comprendemos el problema y exploramos las tecnologías disponibles." },
  { n: "02", t: "Diseñar", d: "Damos forma a la solución antes de tocar un componente." },
  { n: "03", t: "Construir", d: "Transformamos el diseño en un prototipo físico y funcional." },
  { n: "04", t: "Programar", d: "Damos inteligencia y comportamiento al sistema." },
  { n: "05", t: "Experimentar", d: "Probamos. Fallamos. Medimos. Volvemos a probar." },
  { n: "06", t: "Mejorar", d: "Optimizamos hasta conseguir una solución que funciona de verdad." },
];

export const TRAYECTORIA = [
  { yr: "2017", ev: "Segundo lugar — Robot Soccer", pl: "Torneo MASHA BOTS · Cotopaxi", m: "bg-fb-cyan" },
  { yr: "2017", ev: "Segundo lugar — Categoría Insecto", pl: "Torneo MASHA BOTS · Cotopaxi", m: "bg-fb-cyan" },
  { yr: "2018", ev: "Primer y segundo lugar — Seguidores JR", pl: "Robot Games Zero Latitud · Ambato", m: "bg-fb-orange" },
  { yr: "2018", ev: "Tercer lugar — Impacto Tecnológico Avanzado", pl: "Ecuador", m: "bg-fb-green" },
  { yr: "2018", ev: "Primer lugar — Impacto Tecnológico Avanzado", pl: "Torneo Chaski Bots · Machachi", m: "bg-fb-orange" },
  { yr: "2019", ev: "Primer lugar — Impacto Tecnológico Avanzado", pl: "Robot Games Zero Latitud · Quito", m: "bg-fb-orange" },
  { yr: "2019", ev: "Participación internacional — INTELIBOTS", pl: "Teotihuacán · México", m: "bg-fb-purple" },
  { yr: "2021", ev: "Tercer lugar en el ranking nacional de equipos", pl: "Ranking Ecuador · referencia externa", m: "bg-fb-green" },
];

export const PROYECTOS = [
  {
    titulo: "Sistema Académico",
    label: "Sistema\nAcadémico",
    media: null, // ← pon aquí "/img/proyectos/sistema.jpg" cuando tengas la captura
    acc: "#1E9AD7",
    texto:
      "Plataforma web para gestionar procesos educativos con perfiles separados de administrador, docente y estudiante, autenticación y generación de documentos.",
    stack: ["JavaScript", "Supabase", "Auth", "Base de datos", "PDF"],
  },
  {
    titulo: "ToboTech",
    label: "ToboTech\nStore",
    media: null, // ← "/img/proyectos/tobotech.jpg"
    acc: "#F5811F",
    texto:
      "Tienda tecnológica especializada en electrónica y robótica, con catálogo por categorías, carrito de compras y autenticación de usuarios.",
    stack: ["E-commerce", "Supabase", "Carrito", "Interfaz responsive"],
  },
  {
    titulo: "Cronometría IoT para torneos",
    label: "Torneos\nIoT",
    video: "/videos/taller.mp4",
    poster: "/img/taller-poster.jpg",
    acc: "#43B02A",
    video: "/media/promo-fractalbots.mp4",
    texto:
      "Sistema de tiempos en tiempo real para competencias de robótica: sensores en pista, publicación por MQTT y marcador en vivo.",
    stack: ["ESP32", "MQTT", "Marcador en vivo", "Automatización"],
  },
  {
    titulo: "Robots de competencia",
    label: "Robots de\ncompetencia",
    media: null, // ← "/img/proyectos/robots.jpg"
    acc: "#5E2D8E",
    texto:
      "Mini Sumo, seguidores de línea, robot soccer y plataformas móviles autónomas diseñadas, impresas y programadas por nuestros estudiantes.",
    stack: ["Mecatrónica", "Impresión 3D", "Sensores", "Control"],
  },
];

export const INSTITUCIONES = [
  { t: "Extracurriculares", d: "Programas de robótica fuera del horario académico.", acc: "#1E9AD7" },
  { t: "Curriculares", d: "Integración de tecnología dentro de la formación académica.", acc: "#43B02A" },
  { t: "Capacitación docente", d: "Formamos a quienes forman: Arduino, 3D, IA y metodología por proyectos.", acc: "#5E2D8E" },
  { t: "Makerspaces", d: "Diseño de espacios para construir, experimentar y prototipar.", acc: "#F5811F" },
];

export const FAQS = [
  {
    q: "¿Es solamente una academia de robótica?",
    a: "No. Fractal-Bots integra educación tecnológica y desarrollo de soluciones: enseñamos robótica, electrónica, programación, IA, STEM y fabricación digital, y además desarrollamos software, sistemas y prototipos para instituciones y organizaciones.",
  },
  {
    q: "¿Qué edades pueden estudiar?",
    a: "Tenemos programas adaptables para niños, jóvenes y adultos. Los contenidos cambian de profundidad, pero la metodología es la misma: aprender construyendo.",
  },
  {
    q: "¿Necesito conocimientos previos?",
    a: "No necesariamente. Los programas pueden comenzar desde los fundamentos de electricidad y electrónica, sin experiencia previa en programación.",
  },
  {
    q: "¿Desarrollan software a medida?",
    a: "Sí. Aplicaciones web, sistemas académicos y administrativos, plataformas de gestión, bases de datos, integraciones y automatización de procesos.",
  },
  {
    q: "¿Trabajan con inteligencia artificial?",
    a: "Sí, aplicada a problemas concretos: chatbots y asistentes, visión artificial, análisis de datos, automatización e integración de IA con dispositivos y robótica.",
  },
  {
    q: "¿Pueden acompañarme en un proyecto académico?",
    a: "Ofrecemos acompañamiento técnico y desarrollo de prototipos para proyectos académicos y de investigación: definición del alcance, diseño electrónico, programación, modelado 3D, integración de sensores y documentación técnica.",
  },
  {
    q: "¿Realizan impresión 3D?",
    a: "Sí: diseño de piezas, impresión de prototipos y componentes funcionales, capacitación en laminado y parámetros, además de mantenimiento y reparación de impresoras.",
  },
];
