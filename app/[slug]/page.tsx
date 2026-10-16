import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceLanding } from "@/components/service-landing";
import { landingPages } from "@/lib/constant";

// Solo se renderizan los slugs definidos; cualquier otro devuelve 404.
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return landingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = landingPages.find((item) => item.slug === slug);

  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/${page.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function LandingSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = landingPages.find((item) => item.slug === slug);

  if (!page) notFound();

  return <ServiceLanding page={page} />;
}
