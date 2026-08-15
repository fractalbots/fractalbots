/* ─────────────────────────────────────────────────────────────
   ENLACES EXTERNOS
   Cambia estas dos URLs si el despliegue se mueve de sitio.
   ───────────────────────────────────────────────────────────── */
export const ENLACES = {
  sistema: "https://sistema.fractalbotsecua.com",     // plataforma de gestión
  tienda: "https://tienda.fractalbotsecua.com",       // ToboTech
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
    enlace: ENLACES.sistema,
    enlaceTexto: "Ver la plataforma",
  },
  {
    num: "LÍNEA 03",
    titulo: "ToboTech\nStore",
    acc: "#F5811F",
    texto:
      "Componentes para creadores. No solamente vendemos piezas: sabemos para qué sirven, porque detrás de cada componente hay un proyecto.",
    items: ["Componentes", "Sensores", "Actuadores", "Kits", "Equipamiento", "Fabricación digital"],
    enlace: ENLACES.tienda,
    enlaceTexto: "Ir a la tienda",
  },
];

/* ─────────────────────────────────────────────────────────────
   ÁREAS DEL ECOSISTEMA

   Cada tarjeta se abre al hacer clic y muestra el detalle completo.

   IMÁGENES DE FONDO: guárdalas en  public/img/areas/  con el nombre
   que indica el campo "img". Se muestran translúcidas detrás del texto.
   Si el archivo no existe, la tarjeta usa un degradado de marca.
   Proporción libre, mínimo 900 px de ancho.
   ───────────────────────────────────────────────────────────── */
export const BENTO = [
  {
    tag: "Automatización industrial",
    titulo: "Robots y automatización para empresas",
    texto: "Sistemas que trabajan solos: control, sensores y monitoreo aplicados a procesos reales de producción.",
    acc: "#F5811F",
    span: "md:col-span-2 md:row-span-2",
    img: "/img/areas/automatizacion.jpg",
    detalle: {
      intro:
        "No revendemos robots importados: diseñamos y construimos la solución que tu proceso necesita. Empezamos entendiendo qué se hace hoy a mano, qué cuesta y dónde se pierde tiempo, y desde ahí definimos qué conviene automatizar.",
      items: [
        "Automatización de procesos repetitivos",
        "Sistemas de control con microcontroladores y PLC",
        "Sensórica industrial y adquisición de datos",
        "Monitoreo remoto por IoT con tableros en vivo",
        "Brazos y mecanismos a medida",
        "Integración con los sistemas que ya usas",
      ],
      entrega:
        "Entregamos el equipo funcionando, la documentación técnica y la capacitación de tu personal para operarlo.",
    },
  },
  {
    tag: "Software",
    titulo: "Plataformas y sistemas a medida",
    texto: "Aplicaciones web, sistemas de gestión, bases de datos y automatización de procesos administrativos.",
    acc: "#5E2D8E",
    span: "md:col-span-2",
    img: "/img/areas/software.jpg",
    detalle: {
      intro:
        "Desarrollamos el sistema que tu operación necesita cuando el software genérico no alcanza. Tenemos plataformas propias en producción, no solo portafolio.",
      items: [
        "Sistemas de gestión y administrativos",
        "Plataformas académicas con perfiles y permisos",
        "Bases de datos y seguridad por roles",
        "Reportes y generación automática de documentos",
        "Integraciones con servicios existentes",
        "Comercio electrónico",
      ],
      entrega:
        "Sistema desplegado, con capacitación de uso y acompañamiento durante la puesta en marcha.",
    },
  },
  {
    tag: "IA",
    titulo: "Inteligencia artificial aplicada",
    texto: "Problema → datos → algoritmo → sistema → resultado.",
    acc: "#43B02A",
    span: "",
    img: "/img/areas/ia.jpg",
    detalle: {
      intro:
        "IA puesta a resolver un problema concreto y medible, no como palabra de moda. Si un script sencillo resuelve tu caso, te lo decimos.",
      items: [
        "Visión artificial para conteo, inspección y control de calidad",
        "Chatbots y asistentes para atención al cliente",
        "Análisis de datos y detección de patrones",
        "Automatización de tareas repetitivas",
        "IA integrada a dispositivos y robótica",
      ],
      entrega: "Prueba de concepto medible antes de comprometerte con el desarrollo completo.",
    },
  },
  {
    tag: "Fabricación",
    titulo: "Diseño e impresión 3D",
    texto: "Del modelo digital a la pieza funcional.",
    acc: "#F5811F",
    span: "",
    img: "/img/areas/impresion3d.jpg",
    detalle: {
      intro:
        "Diseñamos y fabricamos las piezas que no se consiguen en el mercado, o que salen más caras importadas que hechas aquí.",
      items: [
        "Diseño 3D y CAD desde cero",
        "Impresión de prototipos y piezas funcionales",
        "Repuestos y piezas descontinuadas",
        "Carcasas, soportes y mecanismos",
        "Mantenimiento y reparación de impresoras 3D",
      ],
      entrega: "Pieza física entregada, con el archivo digital por si necesitas reproducirla después.",
    },
  },
  {
    tag: "Electrónica · IoT",
    titulo: "Del circuito al sistema",
    texto: "Microcontroladores, sensores, comunicaciones inalámbricas y dispositivos conectados.",
    acc: "#1E9AD7",
    span: "md:col-span-2",
    img: "/img/areas/electronica.jpg",
    detalle: {
      intro:
        "Electrónica a medida cuando el equipo comercial no hace exactamente lo que necesitas. Diseñamos, programamos y probamos hasta que funciona en campo.",
      items: [
        "Diseño de circuitos y sistemas embebidos",
        "Sensores de temperatura, presencia, nivel, consumo",
        "Comunicación inalámbrica y protocolos industriales",
        "Monitoreo remoto con alertas automáticas",
        "Cronometría y sistemas de medición de precisión",
      ],
      entrega: "Dispositivo funcionando en tu instalación, con planos y documentación.",
    },
  },
  {
    tag: "Educación tecnológica",
    titulo: "Centro de robótica educativa",
    texto: "Programas por niveles para niños, jóvenes y adultos, siempre construyendo proyectos propios.",
    acc: "#1E9AD7",
    span: "",
    img: "/img/areas/educacion.jpg",
    detalle: {
      intro:
        "Formación desde el primer circuito hasta sistemas autónomos con inteligencia artificial. Nuestros equipos compiten desde 2017.",
      items: [
        "Cinco niveles progresivos de formación",
        "Club de robótica y preparación para competencias",
        "Talleres vacacionales",
        "Programas para niños, jóvenes y adultos",
        "Nivelación en matemáticas, física y programación",
      ],
      entrega: "El estudiante termina con proyectos propios construidos, no con un certificado de asistencia.",
    },
  },
  {
    tag: "Instituciones",
    titulo: "Makerspaces y capacitación docente",
    texto: "Llevamos la tecnología dentro de tu institución y formamos al equipo que la sostiene.",
    acc: "#43B02A",
    span: "",
    img: "/img/areas/makerspace.jpg",
    detalle: {
      intro:
        "Montamos el espacio, el equipamiento y el currículo, y capacitamos a los docentes para que el programa siga funcionando cuando nos vamos.",
      items: [
        "Diseño y montaje de makerspaces",
        "Equipamiento y selección de herramienta",
        "Currículo integrado al plan académico",
        "Capacitación docente en robótica, 3D e IA",
        "Programas curriculares y extracurriculares",
      ],
      entrega: "Espacio operativo y equipo docente capacitado para sostenerlo de forma autónoma.",
    },
  },
  {
    tag: "Servicios",
    titulo: "Soporte, CCTV y equipamiento",
    texto: "Diagnóstico, instalación, configuración y asesoría técnica.",
    acc: "#5E2D8E",
    span: "",
    img: "/img/areas/soporte.jpg",
    detalle: {
      intro:
        "Servicio técnico y videovigilancia para quienes necesitan que la tecnología simplemente funcione.",
      items: [
        "Videovigilancia CCTV e integración con IA",
        "Diagnóstico, mantenimiento y reparación",
        "Instalación y configuración de equipos",
        "Suministro de equipamiento tecnológico",
        "Asesoría tecnológica para proyectos",
      ],
      entrega: "Sistema instalado y funcionando, con soporte posterior.",
    },
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

/* ─────────────────────────────────────────────────────────────
   PROYECTOS

   Cada tarjeta puede mostrar un VÍDEO corto o una IMAGEN.
   Los archivos ya están apuntados con su nombre definitivo: basta
   con guardarlos en la carpeta indicada y aparecen solos.

   VÍDEOS  →  public/videos/
       sistema.mp4      Pantallas del panel de gestión
       tienda.mp4       Navegación por ToboTech
       torneo.mp4       Cronómetro y marcador en vivo
       robots.mp4       Robots compitiendo en la pista

   PÓSTERES (primer fotograma, evita el parpadeo)  →  public/img/proyectos/
       sistema.jpg   tienda.jpg   torneo.jpg   robots.jpg

   Mientras falte un archivo, la tarjeta muestra el marcador de
   degradado: no se rompe ni queda en negro.

   Vídeos de 5 a 10 segundos, sin audio, menos de 1 MB. Para comprimir:
   ffmpeg -i original.mp4 -vf scale=1100:-2 -crf 31 -an -movflags +faststart salida.mp4
   ───────────────────────────────────────────────────────────── */
export const PROYECTOS = [
  {
    titulo: "Sistema Académico",
    label: "Sistema\nAcadémico",
    acc: "#1E9AD7",
    video: "/videos/sistema.mp4",
    poster: "/img/proyectos/sistema.jpg",
    texto:
      "Plataforma web para gestionar procesos educativos con perfiles separados de administrador, docente y estudiante, autenticación y generación de documentos.",
    stack: ["JavaScript", "Supabase", "Auth", "Base de datos", "PDF"],
  },
  {
    titulo: "ToboTech",
    label: "ToboTech\nStore",
    acc: "#F5811F",
    video: "/videos/tienda.mp4",
    poster: "/img/proyectos/tienda.jpg",
    texto:
      "Tienda tecnológica especializada en electrónica y robótica, con catálogo por categorías, carrito de compras y autenticación de usuarios.",
    stack: ["E-commerce", "Supabase", "Carrito", "Interfaz responsive"],
  },
  {
    titulo: "Cronometría IoT para torneos",
    label: "Torneos\nIoT",
    acc: "#43B02A",
    video: "/videos/torneo.mp4",
    poster: "/img/proyectos/torneo.jpg",
    texto:
      "Sistema de tiempos en tiempo real para competencias de robótica: sensores en pista, publicación por MQTT y marcador en vivo.",
    stack: ["ESP32", "MQTT", "Marcador en vivo", "Automatización"],
  },
  {
    titulo: "Robots de competencia",
    label: "Robots de\ncompetencia",
    acc: "#5E2D8E",
    video: "/videos/robots.mp4",
    poster: "/img/proyectos/robots.jpg",
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
