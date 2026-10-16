import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constant";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // La página de agradecimiento es transaccional y no aporta valor SEO.
        disallow: ["/gracias", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
