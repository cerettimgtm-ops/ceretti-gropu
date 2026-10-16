/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desactiva la cabecera X-Powered-By por seguridad
  poweredByHeader: false,

  // Compresión de respuestas (Gzip / Brotli)
  compress: true,

  // Configuración de optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 año de caché (recomendación directa de PageSpeed/Lighthouse)
    // Breakpoints hasta 3840 para no upscalear/comprimir banners full-width en monitores desktop grandes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 100],
  },

  // Tree-shaking agresivo para librerías de íconos y animaciones
  // Esto reduce drásticamente el JS no utilizado (Total Blocking Time)
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'date-fns',
      '@radix-ui/react-icons',
    ],
  },

  // Estricto chequeo de TypeScript durante la compilación en build
  typescript: {
    ignoreBuildErrors: false,
  },

  // Cabeceras de Seguridad Globales + Caching de Assets Estáticos
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      // Forzar caché agresivo para imágenes estáticas en public/ (logos, favicons, etc.)
      {
        source: "/:path*.(png|jpg|jpeg|gif|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Forzar caché de tipografías locales
      {
        source: "/:path*.(woff|woff2|eot|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
