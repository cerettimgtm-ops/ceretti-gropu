import { BrandingIcon } from "@/components/icons/branding-icon";
import { CustomIcon } from "@/components/icons/custom-icon";
import { FramerDesign } from "@/components/icons/framer-design-icon";
import { InfiniteIcon } from "@/components/icons/infinite-icon";
import { IntegrationIcon } from "@/components/icons/integrations";
import { LandingPageIcon } from "@/components/icons/landing-page";
 
import { OurWorkIcon } from "@/components/icons/our-work-icon";
import { ProcessIcon } from "@/components/icons/process-icon";
import { ServiceIcon } from "@/components/icons/service-icon";
import { TimeIcon } from "@/components/icons/time-icon";
import { WeDeliverIcon } from "@/components/icons/we-deliver-icon";
import { WebsiteDesign } from "@/components/icons/website-design";
import {
  BarChart3,
  CircleHelp,
  Coins,
  Gauge,
  Globe,
  Headset,
  MessageSquare,
  Search,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { Variants } from "motion";

export const WHATSAPP_LINK = "https://wa.me/message/WHGA7SHTQPLVF1";

export const BRAND_NAME = "Ceretti Group";

export const SITE_URL = "https://cerettigroup.com.ar";

export const SITE_DESCRIPTION =
  "Ceretti Group, Growth & Marketing: creamos, posicionamos y escalamos marcas con estrategia, marketing digital y desarrollo web para crecer.";

export const SEO_KEYWORDS = [
  "Ceretti Group",
  "Growth & Marketing",
  "growth marketing",
  "marketing digital",
  "crecimiento de marcas",
  "posicionamiento de marcas",
  "estrategia de marca",
  "escalamiento de marcas",
  "posicionamiento SEO",
  "publicidad digital",
  "desarrollo web",
];

// IDs públicos de tracking (Meta Pixel y Google Ads). No son secretos: van
// igual expuestos en el HTML del sitio. Se pueden sobrescribir con variables
// de entorno si en algún momento cambian de cuenta publicitaria.
// Los valores predeterminados corresponden a las cuentas publicitarias configuradas.
const DEFAULT_META_PIXEL_ID = "1602538194229202";
const DEFAULT_GOOGLE_ANALYTICS_ID = "GT-KTPRLHJ9";
const DEFAULT_GOOGLE_ADS_ID = "AW-17974657118";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || DEFAULT_META_PIXEL_ID;

// Validamos el formato antes de usar el valor del entorno: si alguien pega
// por error una URL completa o un ID con datos extra (por ejemplo un
// "AW-XXXXXXXXX/etiqueta-de-conversion" en el campo de Analytics), usamos el
// valor por defecto en lugar de romper el tag de Google en todo el sitio.
function pickIfValid(value: string | undefined, pattern: RegExp, fallback: string): string {
  const trimmed = value?.trim();
  if (trimmed && pattern.test(trimmed)) return trimmed;
  return fallback;
}

// Google Analytics 4 / Google Tag: formato "G-XXXXXXX" o "GT-XXXXXXX".
export const GOOGLE_ANALYTICS_ID = pickIfValid(
  process.env.NEXT_PUBLIC_GA_ID,
  /^(G|GT)-[A-Z0-9]+$/i,
  DEFAULT_GOOGLE_ANALYTICS_ID
);

// Google Ads: formato "AW-XXXXXXXXX" (sin barra ni etiqueta de conversión).
export const GOOGLE_ADS_ID = pickIfValid(
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  /^AW-\d+$/i,
  DEFAULT_GOOGLE_ADS_ID
);

// Código de verificación de Google Search Console (meta tag): un token corto
// alfanumérico, nunca una URL. Si el valor cargado es inválido (por ejemplo
// se pegó por error el link del script de gtag), no renderizamos la meta tag
// en lugar de publicar un dato incorrecto. La verificación por archivo HTML
// (public/google45fe8791982d4a42.html) sigue funcionando igual.
const rawSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
export const GOOGLE_SITE_VERIFICATION =
  rawSiteVerification && !/^https?:\/\//i.test(rawSiteVerification)
    ? rawSiteVerification
    : undefined;

/**
 * Landings de servicio pensadas para SEO. Cada una tiene su propia URL,
 * metadatos y contenido único, y siempre conduce a la página principal
 * (planes, contacto por WhatsApp).
 */
export interface LandingPage {
  slug: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  keywords: string[];
  benefits: { title: string; description: string }[];
  planId?: string;
}

export const landingPages: LandingPage[] = [
  {
    slug: "landing",
    eyebrow: "Landing pages que convierten",
    h1: "Landing Pages profesionales para tu negocio",
    metaTitle: "Landing Pages profesionales | Diseño web en Córdoba",
    metaDescription:
      "Diseñamos landing pages rápidas, responsive y optimizadas para Google que convierten visitas en clientes. Dominio, hosting y SSL incluidos. Entrega en 5 a 10 días.",
    intro:
      "Una página pensada para presentar tu negocio y conseguir clientes desde el primer día. Diseño 100% a medida, carga veloz y lista para aparecer en Google.",
    keywords: [
      "landing page",
      "landing page profesional",
      "diseño de landing",
      "página de aterrizaje",
    ],
    planId: "landing",
    benefits: [
      {
        title: "Diseño a medida",
        description: "Cada landing se crea desde cero según tu marca y tu público.",
      },
      {
        title: "Optimizada para Google",
        description: "Estructura, velocidad y SEO técnico listos para posicionar.",
      },
      {
        title: "Convierte visitas",
        description: "Botón de WhatsApp, formularios y llamadas a la acción claras.",
      },
    ],
  },
  {
    slug: "ecommerce",
    eyebrow: "Ecommerce que vende 24/7",
    h1: "Desarrollo de Ecommerce en Argentina",
    metaTitle: "Ecommerce a medida | Tiendas online en Córdoba",
    metaDescription:
      "Creamos ecommerce profesionales con carrito, pagos con tarjeta, Mercado Pago y transferencia. Panel simple para cargar productos. Vendé por internet todos los días.",
    intro:
      "Llevá tu negocio a internet con una tienda que vende sola, a cualquier hora. Catálogo sin límites, cobros integrados y un panel simple para gestionar todo.",
    keywords: [
      "ecommerce",
      "tienda online",
      "vender por internet",
      "carrito de compras",
    ],
    planId: "ecommerce",
    benefits: [
      {
        title: "Cobros integrados",
        description: "Tarjeta, Mercado Pago y transferencia listos para usar.",
      },
      {
        title: "Catálogo sin límites",
        description: "Subí todos los productos que quieras desde un panel simple.",
      },
      {
        title: "Vende 24/7",
        description: "Tu tienda trabaja todo el día, incluso cuando no estás.",
      },
    ],
  },
  {
    slug: "tienda-online",
    eyebrow: "Tu negocio en internet",
    h1: "Tienda Online profesional lista para vender",
    metaTitle: "Tienda Online profesional | Ecommerce en Córdoba",
    metaDescription:
      "Tienda online completa con medios de pago, gestión de productos y diseño responsive. Ideal para comercios que quieren empezar a vender por internet.",
    intro:
      "Una tienda online pensada para que empieces a vender desde el primer día, con medios de pago ya conectados y una gestión pensada para que la manejes vos mismo.",
    keywords: [
      "tienda online",
      "tienda virtual",
      "vender online",
      "negocio en internet",
    ],
    planId: "ecommerce",
    benefits: [
      {
        title: "Lista para vender",
        description: "Medios de pago y catálogo configurados desde el inicio.",
      },
      {
        title: "Fácil de gestionar",
        description: "Cargá productos, precios y fotos sin saber de tecnología.",
      },
      {
        title: "Se ve perfecta en el celular",
        description: "Diseño responsive donde la mayoría de tus clientes compran.",
      },
    ],
  },
  {
    slug: "sitios-web",
    eyebrow: "Sitios web profesionales",
    h1: "Diseño y desarrollo de Sitios Web a medida",
    metaTitle: "Sitios Web profesionales | Diseño web en Córdoba, Argentina",
    metaDescription:
      "Desarrollamos sitios web completos, rápidos y responsive para negocios que quieren crecer. Optimizados para Google, con estadísticas y acompañamiento.",
    intro:
      "Un sitio web completo, rápido y profesional que representa a tu negocio como se merece. Varias páginas, diseño pensado para conseguir clientes y listo para posicionar en Google.",
    keywords: [
      "sitios web",
      "página web profesional",
      "diseño web",
      "desarrollo web",
    ],
    planId: "business",
    benefits: [
      {
        title: "Hasta 5 páginas",
        description: "Inicio, servicios, contacto y todo lo que tu negocio necesite.",
      },
      {
        title: "Rápido en todo dispositivo",
        description: "Carga veloz en celular, tablet y computadora.",
      },
      {
        title: "Con estadísticas",
        description: "Medí las visitas y entendé cómo llegan tus clientes.",
      },
    ],
  },
  {
    slug: "desarrollo-a-medida",
    eyebrow: "Proyectos a medida",
    h1: "Desarrollo web y de software a medida",
    metaTitle: "Desarrollo a medida | Software y web personalizados",
    metaDescription:
      "Proyectos grandes que necesitan algo único: sistemas a medida, integraciones y ecommerce avanzado. Diseño desde cero y acompañamiento prioritario.",
    intro:
      "Para proyectos más grandes que necesitan algo hecho exactamente a tu medida. Diseñamos y desarrollamos desde cero, integrando las herramientas que ya usás.",
    keywords: [
      "desarrollo a medida",
      "software a medida",
      "sistema web",
      "aplicación web personalizada",
    ],
    planId: "custom",
    benefits: [
      {
        title: "Diseño único",
        description: "Todo creado desde cero, sin plantillas ni límites.",
      },
      {
        title: "Integraciones",
        description: "Conectamos tu web con las herramientas que ya usás.",
      },
      {
        title: "Acompañamiento",
        description: "90 días de soporte prioritario después de la entrega.",
      },
    ],
  },
  {
    slug: "apps",
    eyebrow: "Aplicaciones web y móviles",
    h1: "Desarrollo de Apps y aplicaciones web",
    metaTitle: "Desarrollo de Apps | Aplicaciones web a medida en Argentina",
    metaDescription:
      "Creamos aplicaciones web y móviles a medida, rápidas y escalables. Desde la idea hasta el lanzamiento, con diseño propio e integraciones.",
    intro:
      "Convertimos tu idea en una aplicación web o móvil rápida, moderna y escalable. Diseño propio, buenas prácticas y un desarrollo pensado para crecer con tu negocio.",
    keywords: [
      "desarrollo de apps",
      "aplicaciones web",
      "app móvil",
      "aplicación a medida",
    ],
    planId: "custom",
    benefits: [
      {
        title: "Web y móvil",
        description: "Aplicaciones que funcionan en el navegador y en el celular.",
      },
      {
        title: "Escalable",
        description: "Preparadas para crecer a medida que crece tu proyecto.",
      },
      {
        title: "De la idea al lanzamiento",
        description: "Te acompañamos en todo el proceso, sin vueltas técnicas.",
      },
    ],
  },
];

// Links de pago de Mercado Pago por plan (1 pago y 3 cuotas se eligen en Mercado Pago)
export const MP_LINKS: Record<string, string | undefined> = {
  landing: process.env.NEXT_PUBLIC_MP_LINK_LANDING,
  ecommerce: process.env.NEXT_PUBLIC_MP_LINK_ECOMMERCE,
  business: process.env.NEXT_PUBLIC_MP_LINK_BUSINESS,
};

// Datos bancarios para pagos por transferencia (15% OFF)
export const TRANSFER_INFO = {
  alias: process.env.NEXT_PUBLIC_TRANSFER_ALIAS,
  cbu: process.env.NEXT_PUBLIC_TRANSFER_CBU,
  banco: process.env.NEXT_PUBLIC_TRANSFER_BANCO,
  titular: process.env.NEXT_PUBLIC_TRANSFER_TITULAR,
};

export const TRANSFER_DISCOUNT = 0.15;

export const navLinks = [
  {
    label: "Servicios",
    icon: ServiceIcon,
    href: "/#services",
  },

  {
    label: "Proceso",
    icon: ProcessIcon,
    href: "/#process",
  },

  {
    label: "Trabajos",
    icon: OurWorkIcon,
    href: "/#our-work",
  },
  {
    label: "Precios",
    icon: Coins,
    href: "/#pricing",
  },

  {
    label: "Preguntas",
    icon: CircleHelp,
    href: "/#faq",
  },
];

export const brandLogos = [
  { src: "/logos/villa-del-dique-digital-logo.png", name: "Villa del Dique Digital", id: 1 },
  { src: "/logos/grape-barra-movil-logo.png", name: "Grape Barra Móvil", id: 2 },
  { src: "/logos/leac-laboratorio-logo.png", name: "LEAC Laboratorio", id: 3 },
  { src: "/logos/mag-distribuciones-logo.png", name: "MAG Distribuciones", id: 4 },
  { src: "/logos/perimetrales-las-flores-logo.png", name: "Perimetrales Las Flores", id: 5 },
  { src: "/logos/mendez-muebles-y-hogar-logo.png", name: "Méndez Muebles & Hogar", id: 6 },
  { src: "/logos/villa-del-dique-municipalidad-logo.png", name: "Municipalidad de Villa del Dique", id: 7 },
  { src: "/logos/habitar-el-estilo-logo.png", name: "Habitar el Estilo", id: 8 },
  { src: "/logos/electricidad-villa-del-dique-logo.png", name: "Electricidad Villa del Dique", id: 9 },
  { src: "/logos/aldea-de-calamuchita-logo.png", name: "Aldea de Calamuchita", id: 10 },
  { src: "/logos/usa-import-logo.png", name: "USA Import", id: 11 },
  { src: "/logos/nadivas-logo.png", name: "Nadiva's", id: 12 },
  { src: "/logos/conte-construccion-logo.png", name: "Conte Construcción", id: 13 },
  { src: "/logos/cherries-logo.png", name: "Cherries", id: 14 },
  { src: "/logos/mm-asociados-inmobiliaria-serrana-logo.png", name: "MM & Asociados Inmobiliaria Serrana", id: 15 },
  { src: "/logos/non-altra-jewelry-logo.png", name: "Non Altra Jewelry by Erika Navarro", id: 16 },
  { src: "/logos/janneth-aguirre-bienes-raices-logo.png", name: "Janneth Aguirre Bienes Raíces", id: 17 },
  { src: "/logos/amcelta-servicios-aca-logo.png", name: "AM Celta Servicios S.R.L. y Automóvil Club Argentino", id: 18 },
  { src: "/logos/tu-cassa-prefabricadas-logo.png", name: "Tu Cassa Prefabricadas", id: 19 },
  { src: "/logos/pi-management-logo.png", name: "Pi Management", id: 20 },
  { src: "/logos/paseo-kasananda-logo.png", name: "Paseo Kasananda", id: 21 },
  { src: "/logos/cobra-logo.png", name: "Cobra", id: 22 },
  { src: "/logos/cabanas-nuba-logo.png", name: "Cabañas Nuba", id: 23 },
  { src: "/logos/garrison-motors-logo.png", name: "Garrison Motors", id: 24 },
  { src: "/logos/iowa-logo.png", name: "Iowa Desde 1970", id: 25 },
  { src: "/logos/kuden-logo.png", name: "Kudén Equipo Terapéutico Interdisciplinario", id: 26 },
  { src: "/logos/ro-mar-logo.png", name: "Ro Mar", id: 27 },
];

export const projects = [
  {
    img: "/sitio-web-a-medida-municipalidad-villa-del-dique-duality-domain.webp",
    name: "Villa del Dique",
    category: "Sitio Municipal",
    link: "Ver Proyecto",
    href: "https://www.villadeldique.gob.ar/",
    isExternal: true,
  },
  {
    img: "/aplicacion-web-streaming-duality-domain-jimmy-jairaila-un-cafe-con-jj.webp",
    name: "Un Café con JJ",
    category: "App Web de Streaming",
    link: "Ver Proyecto",
    href: "https://www.uncafeconjj.com",
    isExternal: true,
  },
  {
    img: "/ecommerce-indumentaria-demo-duality-domain.webp",
    name: "MEISY",
    category: "Ecommerce de Indumentaria",
    link: "Ver Proyecto",
    href: "https://alevmayorista.villadeldique.com.ar/",
    isExternal: true,
    badge: "",
    promo: "",
  },
  {
    img: "/mag-distribuciones-ecommerce-mayorista.webp",
    name: "MAG Distribuciones",
    category: "Ecommerce Mayorista",
    link: "Ver Proyecto",
    href: "https://www.magdistribuciones.com.ar/",
    isExternal: true,
  },
  {
    img: "/ceretti-management-web-duality-domain.webp",
    name: "Ceretti MGMT",
    category: "Tienda de Servicios",
    link: "Ver Proyecto",
    href: "https://www.cerettimanagement.com.ar/",
    isExternal: true,
  },
  {
    img: "/estudio-agro-contable-web-duality-domain.webp",
    name: "Estudio Contable Agro",
    category: "Sitio Profesional",
    link: "Consultar Proyecto",
    href: WHATSAPP_LINK,
    isExternal: false,
  },
  {
    img: "/panel-de-gestion-ecommerce-duality-domain.webp",
    name: "Panel de Gestión",
    category: "Sistema a Medida",
    link: "Consultar Proyecto",
    href: WHATSAPP_LINK,
    isExternal: false,
  },
  {
    img: "/login-ecommerce-web-duality-domain-panel.webp",
    name: "Plataforma Ecommerce",
    category: "Sistema a Medida",
    link: "Consultar Proyecto",
    href: WHATSAPP_LINK,
    isExternal: false,
  },
  {
    img: "/app-web-villa-del-dique-digital-directorio-duality-domain.webp",
    name: "Villa del Dique Digital",
    category: "App de Comercios Locales",
    link: "Ver Proyecto",
    href: "https://www.villadeldique.com.ar/",
    isExternal: true,
  },
];

export const pricing = [
  {
    id: "landing",
    icon: LandingPageIcon,
    plan: "Landing Pro",
    tagline: "Ideal para arrancar",
    price: "$249.000",
    priceValue: 249000,
    originalPrice: "$295.000",
    onSale: true,
    description: "Una página que presenta tu negocio y suma clientes.",
    features: [
      { icon: LandingPageIcon, label: "Página 100% personalizada" },
      { icon: WebsiteDesign, label: "Se ve perfecta en celular y computadora" },
      { icon: IntegrationIcon, label: "Botón de WhatsApp y formulario de contacto" },
      { icon: Search, label: "Preparada para aparecer en Google" },
      { icon: Globe, label: "Dominio y alojamiento incluidos" },
      { icon: ShieldCheck, label: "Certificado de seguridad (SSL) incluido" },
      { icon: TimeIcon, label: "Entrega en 3 a 5 días hábiles" },
    ],
    cta: "Elegir Este Plan",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    plan: "Tienda Online",
    tagline: "Vendé todos los días",
    price: "$450.000",
    priceValue: 450000,
    description: "Vendé tus productos online, a toda hora.",
    features: [
      { icon: ShoppingCart, label: "Catálogo de productos sin límite" },
      { icon: IntegrationIcon, label: "Carrito de compras y cobro fácil" },
      { icon: Coins, label: "Pagos con tarjeta, Mercado Pago y transferencia" },
      { icon: WebsiteDesign, label: "Panel simple para subir tus productos" },
      { icon: Globe, label: "Dominio y alojamiento incluidos" },
      { icon: ShieldCheck, label: "Certificado de seguridad (SSL) incluido" },
      { icon: TimeIcon, label: "Entrega en 5 a 15 días hábiles" },
    ],
    cta: "Elegir Este Plan",
  },
  {
    id: "business",
    icon: WeDeliverIcon,
    plan: "Business",
    tagline: "El más elegido",
    label: "Recomendado",
    price: "$580.000",
    priceValue: 580000,
    description: "Un sitio completo para crecer en serio.",
    features: [
      { icon: WebsiteDesign, label: "Sitio completo de hasta 5 páginas" },
      { icon: FramerDesign, label: "Diseño pensado para conseguir clientes" },
      { icon: Gauge, label: "Carga rápida en cualquier dispositivo" },
      { icon: Search, label: "Preparado para aparecer en Google" },
      { icon: Globe, label: "Dominio y alojamiento incluidos" },
      { icon: BarChart3, label: "Estadísticas de visitas incluidas" },
      { icon: Headset, label: "30 días de acompañamiento después de la entrega" },
      { icon: TimeIcon, label: "Entrega en 2 a 3 semanas" },
    ],
    cta: "Elegir Este Plan",
  },
];

export const customPlan = {
  id: "custom",
  icon: CustomIcon,
  plan: "Custom",
  tagline: "Sin límites",
  price: "A Medida",
  priceNote: "Definimos el precio juntos, según lo que necesites",
  description: "Para proyectos grandes que necesitan algo a medida.",
  features: [
    { icon: InfiniteIcon, label: "Todas las páginas y secciones que necesites" },
    { icon: BrandingIcon, label: "Diseño único, creado desde cero" },
    { icon: ShoppingCart, label: "Tienda online avanzada o sistema a medida" },
    { icon: IntegrationIcon, label: "Conexión con otras herramientas que ya usás" },
    { icon: Globe, label: "Dominio y alojamiento incluidos" },
    { icon: ShieldCheck, label: "Máxima seguridad y rendimiento" },
    { icon: Headset, label: "90 días de acompañamiento prioritario" },
    { icon: MessageSquare, label: "Charla estratégica para definir todo juntos" },
  ],
  cta: "Cotizar Proyecto",
};

export const faqs = [
  {
  question: "Ya publico todos los días en Instagram, ¿por qué no vendo?",
  answer:
  "Porque tus redes atraen, pero la web cierra. Si el visitante no entiende qué vendés o no confía, se va sin comprar. El problema no está en tu contenido, está en dónde aterriza esa gente.",
  },
  {
  question: "¿Cuánto tarda en estar lista mi web?",
  answer:
  "Landing Pro: 3 a 5 días. Tienda Online: 5 a 15 días. Sitio Business: 2 a 3 semanas. Los proyectos a medida los definimos juntos.",
  },
  {
  question: "¿Pago algo todos los meses?",
  answer:
  "No. Pagás una sola vez por el proyecto. Dominio y hosting van incluidos el primer año y se renuevan de forma anual, sin letra chica.",
  },
  {
  question: "¿Cómo puedo pagar?",
  answer:
  "En un pago, en 3 cuotas sin interés, o por transferencia con 15% off. Vos elegís al confirmar tu plan.",
  },
  ];

export const testimonials = [
  {
    quote:
      "La aplicación vuela, no se cuelga nunca. Me deja trabajar tranquilo en el canal sin estar sufriendo de que algo falle. Full recomendado.",
    name: "Pablo Valdivieso",
    designation: "App Web",
    src: "/profile-pablo-valdivieso.png",
  },
  {
    quote:
      "Nuestros clientes ahora encuentran toda la información de la maquinaria en la web sin que yo tenga que explicar todo por WhatsApp, trabajan de diez los chicos.",
    name: "Balboa Agro Maquinas",
    designation: "Sitio Web",
    src: "/profile-balboa.png",
  },
  {
    quote:
      "Buscaba algo que me traiga consultas y cumplieron. La página es práctica, va al punto y se nota en el movimiento que tengo todos los días. Inversión que se paga sola.",
    name: "Dr. Federico Gansslen",
    designation: "Landing Page",
    src: "/profile-federico-gansslen.png",
  },
];

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const cardItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};
