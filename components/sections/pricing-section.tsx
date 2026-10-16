"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CircleDollarSign, Layers, Landmark, LucideIcon } from "lucide-react";

import { Container } from "../container-wrapper";
import { FeatureHighlight } from "../title";
import { Button } from "../button";
import {
  cardItemVariants,
  containerVariants,
  customPlan,
  itemVariants,
  pricing,
  WHATSAPP_LINK,
} from "@/lib/constant";

interface PricingCardProps {
  item: (typeof pricing)[number];
}

// 1. Tarjeta de plan memoizada para rendimiento óptimo
const PricingCard = memo(function PricingCard({ item }: PricingCardProps) {
  const Icon = item.icon as LucideIcon | React.ComponentType<{ className?: string }>;

  return (
    <motion.article
      id={`pricing-${item.id}`}
      variants={cardItemVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative w-full rounded-2xl p-6 md:p-7 h-full shadow-sm hover:shadow-xl bg-white flex flex-col justify-between will-change-transform scroll-mt-28 border ${
        item.label ? "border-brand" : "border-black/10"
      }`}
    >
      {item.label && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {item.label}
        </span>
      )}

      <div>
        <div className="mb-6">
          <div className="p-4 rounded-2xl bg-brand/10 w-fit">
            <Icon className="size-5 text-brand" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-3 pb-6 border-b border-black/10">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="heading text-2xl text-text">{item.plan}</h3>
            {item.tagline && (
              <span className="text-xs uppercase tracking-wide text-brand font-semibold">
                {item.tagline}
              </span>
            )}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 rounded-full bg-brand/10 pl-1.5 pr-2 py-1">
                <Layers className="size-3 text-brand shrink-0" aria-hidden="true" />
                <span className="text-[0.65rem] font-semibold text-text whitespace-nowrap">
                  3 cuotas sin interés
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-brand/10 pl-1.5 pr-2 py-1">
                <Landmark className="size-3 text-brand shrink-0" aria-hidden="true" />
                <span className="text-[0.65rem] font-semibold text-text whitespace-nowrap">
                  15% OFF por transferencia
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-text/80 font-medium leading-relaxed">
            {item.description}
          </p>

          <div className="space-y-1.5 pt-1">
            {item.onSale && item.originalPrice && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base text-text/40 line-through">
                  {item.originalPrice}
                </span>
                <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white">
                  Oferta
                </span>
              </div>
            )}
            <p className="stat-number text-4xl md:text-5xl text-text">
              {item.price}
              <span className="heading text-md font-medium normal-case tracking-normal">
                {" "}
                único pago
              </span>
            </p>
          </div>
        </div>

        <div className="py-6 space-y-3.5">
          {item.features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={feature.label} className="flex items-center gap-3 w-full">
                <FeatureIcon className="size-4 text-brand shrink-0" aria-hidden="true" />
                <p className="text-sm text-text leading-snug">{feature.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Button
          href={`/checkout?plan=${item.id}`}
          size="large"
          className="shadow-md shadow-brand/70 w-full justify-center"
        >
          {item.cta}
        </Button>
      </div>
    </motion.article>
  );
});

export function Pricing() {
  const CustomPlanIcon = customPlan.icon;

  return (
    <Container spacing="lg">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        id="pricing"
        className="scroll-mt-28"
      >
        {/* Cabecera */}
        <motion.div
          variants={itemVariants}
          className="flex items-center flex-col justify-center space-y-6"
        >
          <FeatureHighlight>
            <div className="w-15 h-[.5px] bg-brand" aria-hidden="true" />
            <CircleDollarSign className="size-5" aria-hidden="true" />
            <p>Planes y Precios</p>
          </FeatureHighlight>

          <h2 className="heading text-3xl sm:text-5xl md:text-6xl text-text leading-[1.05] text-center uppercase max-w-3xl text-balance">
            Elegí tu plan y empezá a vender.
          </h2>

          <p className="text-base md:text-xl leading-relaxed text-text text-center max-w-xl text-balance">
            Pago único, sin letra chica. El resto lo hacemos nosotros.
          </p>
        </motion.div>

        {/* Grilla de Planes Estándar */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 py-10 gap-6 md:gap-6"
        >
          {pricing.map((item) => (
            <PricingCard key={item.id || item.plan} item={item} />
          ))}
        </motion.div>

        {/* Plan Personalizado (Custom) */}
        <motion.div
          variants={itemVariants}
          className="mb-6 rounded-3xl border border-white/10 bg-ink p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-8 shadow-xl"
        >
          <div className="p-4 rounded-2xl bg-brand/20 w-fit shrink-0">
            <CustomPlanIcon className="size-5 text-brand" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
              <h3 className="heading text-2xl text-white">{customPlan.plan}</h3>
              <span className="text-xs uppercase tracking-wide text-brand font-semibold">
                {customPlan.tagline}
              </span>
            </div>
            <p className="text-sm text-white/70 font-medium mb-3">
              {customPlan.description}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {customPlan.features.slice(0, 3).map((feature) => {
                const FeatureIcon = feature.icon;
                return (
                  <div key={feature.label} className="flex items-center gap-2 w-fit">
                    <FeatureIcon className="size-4 text-brand shrink-0" aria-hidden="true" />
                    <span className="text-sm text-white/80">{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            <p className="heading text-xl text-white">{customPlan.price}</p>
            <Button
              size="large"
              variant="secondary"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              {customPlan.cta}
            </Button>
          </div>
        </motion.div>

        {/* Testimonio y CTA de Asesoría */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row w-full gap-4 md:gap-6">
          <div className="flex-1 p-6 border border-black/10 rounded-3xl bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="border border-black/10 rounded-full overflow-hidden w-fit shrink-0">
                <Image
                  src="/profile.avif"
                  alt="Foto de Lucía Fernández"
                  width={48}
                  height={48}
                  quality={85}
                  className="object-cover"
                />
              </div>
              <p className="heading text-xl text-text">Lucía Fernández</p>
            </div>

            <p className="font-medium text-sm text-text/80 leading-relaxed">
              &quot;Renovar nuestra web fue la mejor inversión.
              Ahora el sitio es más claro, más rápido, y vendemos más.&quot;
            </p>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex-1 p-6 bg-ink rounded-3xl flex flex-col items-center text-center justify-center gap-4"
          >
            <p className="heading text-xl md:text-2xl text-white leading-snug">
              ¿No sabés cuál elegir?
              <br />
              <span className="text-secondary-title normal-case text-sm font-medium">
                Contanos qué necesitás y te decimos cuál te conviene.
              </span>
            </p>

            <Button
              size="small"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto justify-center"
            >
              Consultar por WhatsApp
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Container>
  );
}
