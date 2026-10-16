"use client";

import { memo, useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Plus, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../button";
import { Container } from "../container-wrapper";
import { ServiceIcon } from "../icons/service-icon";
import { WebsiteDesign } from "../icons/website-design";
import { LandingPageIcon } from "../icons/landing-page";
import { FeatureHighlight } from "../title";
import { containerVariants, itemVariants } from "@/lib/constant";

// 1. Definición estática de los servicios. El "symptom" retoma, con otras
// palabras, lo mismo que la persona pudo haber marcado en el diagnóstico de
// arriba: así entiende de inmediato "esto es lo que necesito".
const SERVICES = [
  {
    id: "landing",
    title: "Landing Page",
    deliveryTime: "3-5 días",
    symptom: "Publicás en redes, pero no tenés dónde cerrar la venta.",
    icon: LandingPageIcon,
    benefits: [
      "Una sola página, un solo objetivo: que actúen.",
      "Pensada para lanzamientos, promos o campañas.",
      "Lista para recibir tráfico pagado desde el día uno.",
    ],
  },
  {
    id: "website",
    title: "Sitio Web Completo",
    deliveryTime: "1-2 semanas",
    symptom: "Preguntan el precio, y después no vuelven a escribir.",
    icon: WebsiteDesign,
    benefits: [
      "Todas tus páginas, en un solo lugar, con tu marca.",
      "Responde las dudas antes de que te escriban.",
      "Multiplica la confianza para elegirte a vos.",
    ],
  },
  {
    id: "ecommerce",
    title: "Tienda Online",
    deliveryTime: "5-10 días",
    symptom: "Tenés seguidores y likes, pero el carrito sigue en cero.",
    icon: ShoppingCart,
    benefits: [
      "Catálogo, carrito y cobros, todo integrado.",
      "Vendés mientras dormís, sin depender de un DM.",
      "Pedidos y stock organizados, no en un cuaderno.",
    ],
  },
] as const;

interface ServiceCardProps {
  service: (typeof SERVICES)[number];
}

// 2. Tarjeta acordeón: colapsada muestra solo lo esencial (ícono, título,
// síntoma). Al tocarla, revela los beneficios y el CTA. Reemplaza las
// capturas de pantalla por una interacción liviana y directa.
const ServiceCard = memo(function ServiceCard({ service }: ServiceCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const Icon = service.icon;

  return (
    <motion.article
      variants={itemVariants}
      className={cn(
        "flex flex-col rounded-2xl w-full border overflow-hidden transition-colors duration-300",
        isOpen ? "bg-brand border-brand" : "bg-ink border-white/10 hover:border-white/25"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full text-left flex flex-col gap-3 p-5 sm:p-6 focus:outline-none"
      >
        <div className="flex items-center justify-between gap-3">
          <div
            className={cn(
              "flex items-center justify-center size-10 sm:size-11 rounded-full shrink-0 transition-colors duration-300",
              isOpen ? "bg-black/15" : "bg-white/10"
            )}
          >
            <Icon
              className={cn(
                "size-5 transition-colors duration-300",
                isOpen ? "text-white" : "text-brand"
              )}
              aria-hidden="true"
            />
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              "shrink-0 flex items-center justify-center size-8 rounded-full transition-colors duration-300",
              isOpen ? "bg-white/20 text-white" : "bg-white/10 text-white"
            )}
            aria-hidden="true"
          >
            <Plus className="size-4" />
          </motion.div>
        </div>

        <h3 className="heading text-lg sm:text-xl text-white leading-snug">
          {service.title}
        </h3>

        <p
          className={cn(
            "text-sm sm:text-[0.95rem] leading-snug font-medium transition-colors duration-300",
            isOpen ? "text-white" : "text-white/70"
          )}
        >
          {service.symptom}
        </p>

        <span
          className={cn(
            "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-300",
            isOpen ? "bg-black/15 text-white" : "bg-white/10 text-white/60"
          )}
        >
          Entrega en {service.deliveryTime}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
            }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-col gap-4">
              <ul className="flex flex-col gap-2.5">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-white leading-snug">
                    <Check className="size-4 shrink-0 mt-0.5" strokeWidth={3} aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="small"
                variant="secondary"
                href="/#pricing"
                className="w-full sm:w-fit"
              >
                Ver Plan
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
});

export function ServiceSection() {
  return (
    <Container spacing="lg">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        id="services"
        className="scroll-mt-28"
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <FeatureHighlight>
            <div className="w-15 h-[.5px] bg-brand shrink-0" aria-hidden="true" />
            <ServiceIcon className="w-5 h-5" aria-hidden="true" />
            <p>La solución</p>
          </FeatureHighlight>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center text-center mb-8 md:mb-12"
        >
          <h2 className="heading text-2xl sm:text-4xl md:text-5xl text-text leading-[1.05] uppercase max-w-2xl text-balance">
            Una web pensada para cerrar la venta.
          </h2>

          <p className="mt-3 text-sm sm:text-base text-secondary-title">
            Elegí qué necesita tu negocio hoy y mirá qué incluye.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full items-start"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </motion.div>
    </Container>
  );
}
