"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { Container } from "../container-wrapper";
import { Button } from "../button";
import { ProjectsScroll } from "../projects-scroll";
import { DiagnosisSection } from "./diagnosis-section";
import { brandLogos, WHATSAPP_LINK } from "@/lib/constant";

// Subcomponente memoizado para el Marquee de Marcas
const BrandMarquee = memo(function BrandMarquee() {
  const logos = [...brandLogos, ...brandLogos];

  return (
    <div className="flex items-center mask-gradient overflow-hidden">
      <div
        className="flex items-center gap-x-14 sm:gap-x-18 animate-marquee will-change-transform"
        style={{ animationDuration: "48s" }}
      >
        {logos.map((item, index) => {
          const isPriority = index < 4;
          return (
            <div
              key={`${item.id}-${index}`}
              className="h-16 sm:h-20 md:h-24 shrink-0 flex items-center justify-center"
            >
              <Image
                src={item.src}
                alt={item.name}
                width={382}
                height={189}
                priority={isPriority}
                loading={isPriority ? undefined : "lazy"}
                quality={85}
                className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export function HeroSection() {
  return (
    <div>
      <section
        id="hero"
        aria-label="Sección principal"
        className="w-full pt-[var(--navigation-height)] bg-background"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto flex min-h-[48rem] max-w-6xl flex-col items-center justify-center px-5 py-20 text-center md:min-h-[58rem] md:px-10"
        >
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-5 py-2 text-sm font-bold tracking-wide text-brand">
            <span aria-hidden="true">🚀</span>
            Growth &amp; Marketing
          </span>
          <h1 className="heading max-w-5xl text-5xl leading-[1.02] text-text text-balance sm:text-6xl md:text-7xl lg:text-8xl">
            Creamos, posicionamos y{" "}
            <span className="text-brand">escalamos marcas.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-text/70 md:text-xl">
            Estrategia y creatividad para impulsar marcas con ambición de crecer.
          </p>
          <div className="mt-9">
            <Button
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              size="large"
            >
              Hablemos de tu marca
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Marquee de Marcas: fondo claro, igual al resto de la web */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full bg-background pt-8 pb-6 md:pt-10 md:pb-8"
      >
        <Container spacing="none" className="relative flex items-center justify-center py-4 md:py-6">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          >
            <span className="heading text-[3.5rem] sm:text-[5rem] md:text-[7rem] leading-none text-brand/15 blur-[2px] whitespace-nowrap">
              CONFIANZA
            </span>
          </div>
          <h2 className="heading relative text-2xl sm:text-3xl md:text-4xl text-text uppercase tracking-tight text-center">
            Ellos ya <span className="text-brand">confiaron</span>
          </h2>
        </Container>
        <BrandMarquee />
      </motion.div>

      {/* Diagnóstico: Dolor -> Problema -> Solución */}
      <DiagnosisSection />

      <section
        aria-label="Estrategia para hacer crecer tu marca"
        className="mx-5 overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center md:mx-10 md:rounded-[4rem] md:px-14 md:py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-4xl"
        >
          <p className="heading text-sm uppercase tracking-[0.18em] text-brand">
            Ceretti Group · Growth &amp; Marketing
          </p>
          <h2 className="heading mt-5 text-3xl leading-tight text-white text-balance sm:text-4xl md:text-6xl">
            De una buena idea a una marca que crece.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            Conectamos estrategia, comunicación y presencia digital para llevar
            cada proyecto a su próximo nivel.
          </p>
        </motion.div>
      </section>

      {/* Ticker / Carousel de Proyectos */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full bg-background pb-16 md:pb-20"
      >
        <ProjectsScroll />
      </motion.div>
    </div>
  );
}
