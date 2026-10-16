import type { MetadataRoute } from "next";
import { SITE_URL, landingPages } from "@/lib/constant";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const home: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const landings: MetadataRoute.Sitemap = landingPages.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...home, ...landings];
}
