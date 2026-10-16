"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function PromoBannerSection() {
  return (
    <Link
      href="/#pricing"
      aria-label="Conocé las soluciones digitales de Ceretti Group para tu marca."
      className="block overflow-hidden rounded-t-[2.5rem] bg-brand px-6 py-16 text-white md:rounded-t-[5rem] md:px-12 md:py-24"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        <p className="heading text-sm uppercase tracking-[0.18em] text-white/75">
          Growth &amp; Marketing
        </p>
        <h2 className="heading mt-5 text-3xl leading-tight text-balance sm:text-4xl md:text-6xl">
          Tu marca tiene potencial. Hagámoslo crecer.
        </h2>
        <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand transition-colors hover:bg-white/90">
          Ver servicios
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </motion.div>
    </Link>
  );
}
