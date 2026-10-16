"use client";

import Link from "next/link";
import { motion } from "motion/react";

// Banner: invita a dejar de perder tiempo con contenido que no convierte y
// pasar a una web que sí vende. Lleva directo a la sección de precios.
export function ContentBannerSection() {
  return (
    <Link
      href="/#pricing"
      aria-label="Conocé las soluciones digitales de Ceretti Group y hacé crecer tu marca."
      className="block w-full overflow-hidden rounded-t-[2.5rem] bg-ink px-6 py-16 text-center md:rounded-t-[5rem] md:px-12 md:py-24"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto max-w-4xl"
      >
        <p className="heading text-sm uppercase tracking-[0.18em] text-brand">
          Ceretti Group · Growth &amp; Marketing
        </p>
        <h2 className="heading mt-5 text-3xl leading-tight text-white text-balance sm:text-4xl md:text-6xl">
          Que cada acción impulse el crecimiento de tu marca.
        </h2>
        <span className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-strong">
          Conocé nuestros servicios
        </span>
      </motion.div>
    </Link>
  );
}
