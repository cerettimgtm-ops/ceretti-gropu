"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

import { Container } from "../container-wrapper";
import { Button } from "../button";
import {
  containerVariants,
  itemVariants,
  WHATSAPP_LINK,
} from "@/lib/constant";

export function CTA() {
  return (
    <Container spacing="lg">
      <motion.section
        aria-label="Llamado a la acción"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full bg-gradient-to-tr from-brand to-brand/70 rounded-3xl px-5 md:px-14 py-16 md:py-20 shadow-lg hover:shadow-xl will-change-transform"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center justify-end w-full h-full space-y-7 text-center"
        >
          <motion.div variants={itemVariants}>
            <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-md">
              <Check className="size-6 text-brand" strokeWidth={3} aria-hidden="true" />
            </div>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="heading text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] max-w-3xl text-balance uppercase"
          >
            Última Llamada: Empezá a Vender, no Solo a Mostrar.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg leading-relaxed font-medium text-white/90 max-w-lg"
          >
            Elegí tu plan, contanos sobre tu negocio y en pocos días tenés
            una web lista para convertir visitas en clientes.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="gap-3 flex flex-col sm:flex-row w-full sm:w-auto items-stretch justify-center"
          >
            <Button
              href="/#pricing"
              variant="dark"
              size="large"
              className="justify-center"
            >
              Ver Planes y Precios
            </Button>
            <Button
              variant="secondary"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              size="large"
              className="justify-center"
            >
              Chatear por WhatsApp
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>
    </Container>
  );
}
