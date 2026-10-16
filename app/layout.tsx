import type { Metadata, Viewport } from 'next'
import { Montserrat, Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import './globals.css'
import { MetaPixel } from '@/components/meta-pixel'
import { GoogleTag } from '@/components/google-tag'
import {
  BRAND_NAME,
  GOOGLE_SITE_VERIFICATION,
  SEO_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_URL,
  WHATSAPP_LINK,
} from '@/lib/constant'

// Fuentes optimizadas con display: 'swap' para prevenir el bloqueo de renderizado
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ceretti Group | Growth & Marketing',
    template: '%s | Ceretti Group',
  },
  description: SITE_DESCRIPTION,
  applicationName: BRAND_NAME,
  generator: BRAND_NAME,
  keywords: SEO_KEYWORDS,
  authors: [{ name: BRAND_NAME, url: SITE_URL }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: 'business',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: 'Ceretti Group | Growth & Marketing',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: 'Ceretti Group | Growth & Marketing',
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: '/ceretti-icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1769aa' },
    { media: '(prefers-color-scheme: dark)', color: '#102b46' },
  ],
}

// Datos estructurados (Structured Data - Schema.org)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: BRAND_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    url: WHATSAPP_LINK,
    availableLanguage: 'Spanish',
  },
  knowsAbout: [
    'Growth marketing',
    'Marketing digital',
    'Estrategia de marca',
    'Posicionamiento SEO',
    'Publicidad digital',
    'Diseño web',
    'Desarrollo web',
    'Landing pages',
    'Ecommerce',
    'Tiendas online',
    'Aplicaciones web',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isProd = process.env.NODE_ENV === 'production'

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`light ${nunito.variable} ${montserrat.variable} bg-background`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        
        {/* Scripts de Seguimiento y Métricas */}
        <GoogleTag />
        <MetaPixel />

        {isProd && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
