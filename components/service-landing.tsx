import { memo } from "react";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/header";
import { Footer } from "@/components/sections/footer";
import { Container } from "@/components/container-wrapper";
import { Button, Highlight } from "@/components/button";
import { type LandingPage, WHATSAPP_LINK } from "@/lib/constant";

// Constante inmutable estática para evitar recreación en memoria
const TRUST_POINTS = [
  "Dominio y hosting incluidos",
  "Candado de seguridad (SSL)",
  "Se ve perfecta en el celular",
] as const;

// Componente memoizado para tarjetas de beneficios
const BenefitCard = memo(function BenefitCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-3xl border border-black/5 bg-card p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow">
      <div className="size-11 rounded-2xl bg-brand/10 flex items-center justify-center mb-4" aria-hidden="true">
        <Check className="size-5 text-brand" />
      </div>
      <h2 className="heading text-lg text-text mb-2">{title}</h2>
      <p className="text-sm text-text/60 leading-relaxed">{description}</p>
    </article>
  );
});

export function ServiceLanding({ page }: { page: LandingPage }) {
  // Lógica de enlace a precio con fallback inteligente si hay ID de plan
  const pricingHref = page.planId ? `/#pricing-${page.planId}` : "/#pricing";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-12 md:pb-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
              <Highlight className="flex items-center gap-x-2">
                <span className="size-2 rounded-full bg-brand animate-pulse" aria-hidden="true" />
                <span className="text-xs font-semibold text-text">
                  {page.eyebrow}
                </span>
              </Highlight>

              <h1 className="heading text-4xl md:text-6xl text-text text-balance">
                {page.h1}
              </h1>

              <p className="text-md md:text-xl text-text/70 max-w-2xl text-pretty leading-relaxed">
                {page.intro}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto mt-2">
                <Button href={pricingHref} className="justify-center">
                  Ver Planes y Precios
                </Button>
                <Button
                  variant="secondary"
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="justify-center"
                >
                  <MessageCircle className="size-4 mr-1 shrink-0" aria-hidden="true" />
                  Consultar por WhatsApp
                </Button>
              </div>

              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4" role="list">
                {TRUST_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-1.5 text-sm text-text/60 font-medium"
                  >
                    <Check className="size-4 text-brand shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Beneficios */}
        <section className="py-10 md:py-14">
          <Container>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {page.benefits.map((benefit) => (
                <BenefitCard
                  key={benefit.title}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </Container>
        </section>

        {/* CTA final */}
        <section className="py-10">
          <Container>
            <div className="rounded-4xl bg-gradient-to-tr from-brand to-brand/40 px-6 py-12 md:px-12 md:py-16 shadow-lg text-center flex flex-col items-center gap-5">
              <h2 className="heading text-white text-3xl md:text-5xl text-balance max-w-2xl">
                ¿Listo para empezar tu proyecto?
              </h2>
              <p className="text-white/90 text-sm md:text-md max-w-xl text-pretty">
                Conocé todos los planes, mirá nuestros trabajos y contanos qué
                necesita tu negocio. Estamos en Villa del Dique, Córdoba, y
                trabajamos con clientes de toda Argentina.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  href="/"
                  className="justify-center"
                >
                  Ir al sitio principal
                </Button>
                <Link
                  href={pricingHref}
                  className="heading inline-flex items-center justify-center gap-2 text-white text-sm md:text-md py-2 px-4 rounded-full border border-white/30 hover:bg-white/10 transition-colors"
                >
                  Ver precios
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
