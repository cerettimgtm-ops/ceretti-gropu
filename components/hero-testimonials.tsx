"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials } from "@/lib/constant";

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

export default function HeroTestimonials() {
  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-8">
      <Testimonials testimonials={testimonials} />
    </div>
  );
}

function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="perspective-1000">
      {/* Barra de Controles y Paginación */}
      <div className="flex items-center gap-4 mb-6 transform -rotate-2">
        <button
          onClick={handlePrev}
          disabled={active === 0}
          aria-label="Testimonio anterior"
          className={`p-2 rounded-full transition-all duration-200 hover:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
            active === 0
              ? "text-text/40 opacity-30 cursor-not-allowed"
              : "text-brand hover:scale-110 active:scale-95"
          }`}
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>

        <button
          onClick={handleNext}
          disabled={active === testimonials.length - 1}
          aria-label="Testimonio siguiente"
          className={`p-2 rounded-full transition-all duration-200 hover:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
            active === testimonials.length - 1
              ? "text-text/40 opacity-30 cursor-not-allowed"
              : "text-brand hover:scale-110 active:scale-95"
          }`}
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>

        {/* Indicadores Interactivos (Dots) */}
        <div className="flex items-center gap-2 ml-2" role="tablist" aria-label="Navegación de testimonios">
          {testimonials.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === active}
              aria-label={`Ir al testimonio ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                index === active ? "w-6 bg-brand" : "w-1.5 bg-text/20 hover:bg-text/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stack de Tarjetas en 3D */}
      <div className="relative transform -rotate-2 min-h-[280px]">
        {testimonials.map((testimonial, index) => {
          const isActive = index === active;
          const offset = index - active;

          if (offset < 0) return null;

          return (
            <motion.div
              key={`${testimonial.name}-${index}`}
              className={`absolute top-0 left-0 right-0 origin-bottom will-change-transform ${
                isActive ? "cursor-default" : "cursor-pointer pointer-events-auto"
              }`}
              initial={false}
              animate={{
                y: offset * 6,
                scale: 1 - offset * 0.05,
                opacity: 1 - offset * 0.2,
                zIndex: testimonials.length - offset,
                rotateX: offset * 3,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              tabIndex={isActive ? -1 : 0}
              role={isActive ? undefined : "button"}
              aria-label={isActive ? undefined : `Ver testimonio de ${testimonial.name}`}
              onClick={() => !isActive && setActive(index)}
              onKeyDown={(e) => {
                if (!isActive && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  setActive(index);
                }
              }}
            >
              <div
                className={`bg-white shadow-md hover:shadow-xl transition-shadow duration-300 p-6 rounded-2xl flex flex-col justify-between gap-6 border ${
                  isActive ? "border-black/10" : "border-black/5"
                }`}
              >
                <div>
                  <p className="text-base leading-relaxed text-text font-medium">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative rounded-full overflow-hidden size-12 shrink-0 bg-neutral-100">
                    <Image
                      src={testimonial.src || "/placeholder.svg"}
                      alt={`Fotografía de ${testimonial.name}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="heading text-sm text-text">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-secondary-title font-medium">
                      {testimonial.designation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
