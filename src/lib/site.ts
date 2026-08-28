export const SITE = {
  nombre: "ADONAI",
  nombreLargo: "Iglesia Cristiana ADONAI",
  eslogan: "Un hogar donde crecer en Cristo.",
  descripcion:
    "ADONAI es una iglesia cristiana que busca ser un hogar espiritual para todas las personas y familias.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://adonai.ejemplo.com",

  // [PENDIENTE:BRANDA] Revisar cada valor con el equipo de la iglesia.
  fundada: "2018",

  horarios: {
    domingo: "Domingos · 10:00 a. m.",
    miercoles: "Miércoles · 7:00 p. m.",
    etiquetaDomingo: "Culto de adoración",
    etiquetaMiercoles: "Reunión de oración y palabra",
  },

  pastores: [
    {
      nombre: "Isabel Mahecha",
      rol: "Apóstola · Pastora principal",
      foto: null,
      celular: "310 488 56 09",
      whatsapp: "573104885609",
      email: "isabelmahechamartinez@gmail.com",
      bio: "[PENDIENTE:BRANDA] Breve biografía de la apóstola Isabel y su familia.",
    },
    {
      nombre: "Gustavo Adolfo Sánchez",
      rol: "Pastor · Copastor",
      foto: null,
      celular: "315 813 29 37",
      whatsapp: "573158132937",
      email: "gustavoadolfosanchezr@gmail.com",
      bio: "[PENDIENTE:BRANDA] Breve biografía del pastor Gustavo y su familia.",
    },
  ],

  ubicacion: {
    direccion: "Av. Libertadores #20-07 · Frente a los lavaderos de autos",
    ciudad: "Paipa, Boyacá",
    mapsEmbed:
      "https://www.google.com/maps?q=Av.+Libertadores+%2320-07,+Paipa,+Boyac%C3%A1,+Colombia&output=embed",
    mapsLink: "https://www.google.com/maps?q=Av.+Libertadores+%2320-07,+Paipa,+Boyaca,+Colombia",
  },

  // Fotos reales de la iglesia: copiarlas a /public/fotos/ y escribir aquí la ruta. null = no mostrar foto.
  imagenes: {
    hero: null,
    nosotros: null,
    pastores: null,
    casasOasis: null,
    adoracion: null,
    dar: null,
    galeria: [],
  },

  // Logos propios de cada sección (Casa Oasis, jóvenes y ministerios tienen identidad propia).
  logos: {
    casasOasis: null,
    jovenes: null,
    ninos: null,
    alabanza: null,
    matrimonios: null,
    mujeres: null,
    hombres: null,
  },

  contacto: {
    whatsapp: "+57 310 488 56 09",
    whatsappLink: "https://wa.me/573104885609",
    email: "isabelmahechamartinez@gmail.com",
    emailPastores: process.env.MAIL_TO_PASTORES ?? "isabelmahechamartinez@gmail.com",
    facebook: "[PENDIENTE:BRANDA] https://facebook.com/...",
    instagram: "[PENDIENTE:BRANDA] https://instagram.com/...",
  },

  dar: {
    nota:
      "El sitio no procesa pagos: solo mostramos los canales externos que la iglesia ya usa. Los diezmos y ofrendas se registran de forma confidencial.",
    metodos: [
      {
        nombre: "Nequi",
        descripcion: "Transferencia a Nequi del pastor o la cuenta oficial de la iglesia.",
        detalle: "Ahorros · [PENDIENTE:BRANDA] 300 000 00 00 · Titular: [PENDIENTE:BRANDA]",
      },
      {
        nombre: "PSE / Bancos",
        descripcion: "Transferencia desde la banca virtual a la cuenta de la iglesia.",
        detalle: "[PENDIENTE:BRANDA] Bancolombia · Cuenta de ahorros No. [PENDIENTE:BRANDA]",
      },
      {
        nombre: "Transferencia",
        descripcion: "Transferencia electrónica directa desde cualquier banco.",
        detalle: "[PENDIENTE:BRANDA] Nombre de titular · Cédula: [PENDIENTE:BRANDA]",
      },
    ],
  },

  ministerios: [
    {
      id: "jovenes",
      nombre: "Jóvenes",
      foto: null,
      logo: null,
      descripcion:
        "Un espacio para jóvenes que buscan identidad, propósito y amistades sanas en comunidad.",
    },
    {
      id: "ninos",
      nombre: "Niños",
      foto: null,
      logo: null,
      descripcion:
        "Enseñanza bíblica y actividades seguras para que los niños conozcan a Dios a su nivel.",
    },
    {
      id: "alabanza",
      nombre: "Alabanza",
      foto: null,
      logo: null,
      descripcion:
        "Equipo de música y adoración que guía al pueblo en un ambiente de presencia de Dios.",
    },
    {
      id: "matrimonios",
      nombre: "Matrimonios",
      foto: null,
      logo: null,
      descripcion:
        "Acompañamiento y formación para parejas: fundamentos sólidos para hogares firmes.",
    },
    {
      id: "mujeres",
      nombre: "Mujeres",
      foto: null,
      logo: null,
      descripcion:
        "Encuentros de edificación, crecimiento y apoyo mutuo para las mujeres de la iglesia.",
    },
    {
      id: "hombres",
      nombre: "Hombres",
      foto: null,
      logo: null,
      descripcion:
        "Hombres que aprenden a liderar sus casas y vivir con propósito e integridad.",
    },
  ],

  admin: {
    email: "fmleonm19@gmail.com",
  },
} as const;

export type CategoriaContacto = {
  id: string;
  titulo: string;
  pregunta: string;
  descripcion: string;
  href: string;
  confidencial: boolean;
  placeholders: { nombre: string; contacto: string; mensaje: string };
};

export const CATEGORIAS_CONTACTO: CategoriaContacto[] = [
  {
    id: "JOVENES",
    titulo: "¿Eres joven?",
    pregunta: "Cuéntanos quién eres y qué te interesa",
    descripcion:
      "Si quieres empezar a participar con el grupo de jóvenes, mándanos un mensaje y te contactamos.",
    href: "/contacto/jovenes",
    confidencial: false,
    placeholders: {
      nombre: "Tu nombre",
      contacto: "WhatsApp o correo",
      mensaje: "¿Qué te gustaría vivir en el grupo de jóvenes?",
    },
  },
  {
    id: "ASESORIA_FAMILIAR",
    titulo: "¿Necesitas asesoría familiar?",
    pregunta: "Estamos para acompañarte en familia",
    descripcion:
      "Conversa de forma privada y confidencial con un consejero de la iglesia para tu matrimonio o familia.",
    href: "/contacto/asesoria",
    confidencial: true,
    placeholders: {
      nombre: "Tu nombre",
      contacto: "WhatsApp o correo",
      mensaje: "Cuéntanos brevemente de qué tema te gustaría hablar. Todo queda en confianza.",
    },
  },
  {
    id: "ORACION",
    titulo: "¿Buscas ayuda espiritual / oración?",
    pregunta: "Enciende una petición de oración",
    descripcion:
      "Pide oración o pide hablar con un pastor. Tu petición se entrega en oración de forma confidencial.",
    href: "/contacto/ayuda-espiritual",
    confidencial: true,
    placeholders: {
      nombre: "Tu nombre",
      contacto: "WhatsApp o correo",
      mensaje: "Tu petición de oración (puedes escribir lo que quieras compartir).",
    },
  },
  {
    id: "VISITANTE",
    titulo: "¿Eres nuevo / visitante?",
    pregunta: "Te esperamos este domingo",
    descripcion:
      "Encuentra horarios, dirección y cómo llegar. No necesitas inscripción: solo llega.",
    href: "/contacto/nuevo",
    confidencial: false,
    placeholders: { nombre: "", contacto: "", mensaje: "" },
  },
];