"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "../button";
import { Container } from "../container-wrapper";
import { OurWorkIcon } from "../icons/our-work-icon";
import { FeatureHighlight } from "../title";
import {
  cardItemVariants,
  containerVariants,
  itemVariants,
  projects,
  WHATSAPP_LINK,
} from "@/lib/constant";

interface WorkCardProps {
  item: (typeof projects)[number];
  index: number;
}

// Subcomponente de tarjeta de proyecto memoizado
const WorkCard = memo(function WorkCard({ item, index }: WorkCardProps) {
  const isPriority = index < 2;

  return (
    <motion.article variants={cardItemVariants}>
      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver proyecto ${item.name}`}
        className="group block"
      >
        <motion.div
          initial={{ clipPath: "inset(8% 8% 8% 8% round 1rem)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1rem)" }}
          viewport={{ once: true, margin: "-80px" }}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative aspect-[1080/1350] overflow-hidden rounded-2xl shadow-sm group-hover:shadow-2xl transition-shadow will-change-transform bg-ink/5"
        >
          <Image
            src={item.img}
            alt={`Vista previa del proyecto ${item.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={isPriority}
            loading={isPriority ? undefined : "lazy"}
            quality={90}
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 rounded-full bg-brand px-2.5 py-1 sm:px-3 sm:py-1.5 text-[0.65rem] sm:text-xs font-bold uppercase tracking-wide text-white">
            {item.category}
          </span>

          {/* Overlay oscuro al hacer hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Botón flotante central */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none">
            <div className="flex items-center justify-center size-14 rounded-full bg-white text-ink shadow-lg">
              <ArrowUpRight size={22} aria-hidden="true" />
            </div>
          </div>
        </motion.div>

        <div className="pt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="heading text-xl sm:text-2xl md:text-3xl lg:text-4xl text-text truncate min-w-0">
              {item.name}
            </h3>
            {item.badge && (
              <span className="shrink-0 rounded-full bg-ink px-2.5 py-1 text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-wide text-white">
                {item.badge}
              </span>
            )}
            {item.promo && (
              <span className="shrink-0 rounded-full bg-brand px-2.5 py-1 text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-wide text-white">
                {item.promo}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-text">
            <span className="text-sm md:text-base font-semibold group-hover:text-brand transition-colors">
              {item.link}
            </span>
            <ArrowUpRight
              size={16}
              className="group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
});

export function WorkSection() {
  return (
    <Container spacing="lg">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        id="our-work"
        className="scroll-mt-28"
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <FeatureHighlight>
            <div className="w-15 h-[.5px] bg-brand shrink-0" aria-hidden="true" />
            <OurWorkIcon className="w-5 h-5" aria-hidden="true" />
            <p>Trabajos</p>
          </FeatureHighlight>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center text-center mb-10 md:mb-14"
        >
          <h2 className="heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-text leading-[1.02] uppercase max-w-3xl text-balance">
            Algunos de <span className="text-secondary-title">nuestros trabajos.</span>
          </h2>

          <p className="mt-4 text-base md:text-xl leading-relaxed text-text max-w-xl">
            Marcas que se sentían igual y hoy se perciben distinto.
          </p>
        </motion.div>

        <motion.div className="space-y-8" variants={containerVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {projects.map((item, index) => (
              <WorkCard key={item.name} item={item} index={index} />
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center text-center pt-4"
          >
            <Button
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              size="large"
            >
              Quiero Ver el Portfolio Completo
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Container>
  );
}
