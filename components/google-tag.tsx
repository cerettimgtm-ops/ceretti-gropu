import Script from "next/script";
import { GOOGLE_ADS_ID, GOOGLE_ANALYTICS_ID } from "@/lib/constant";

/**
 * Google tag (gtag.js) — combina Google Analytics (GA4) y Google Ads.
 * No renderiza nada si no hay ningún ID configurado, para no romper
 * el sitio en desarrollo ni disparar peticiones innecesarias.
 */
export function GoogleTag() {
  const ids = [GOOGLE_ANALYTICS_ID, GOOGLE_ADS_ID].filter(Boolean) as string[];

  if (ids.length === 0) return null;

  const configCalls = ids.map((id) => `gtag('config', '${id}');`).join("\n            ");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${configCalls}
          `}
      </Script>
    </>
  );
}
