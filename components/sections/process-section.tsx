"use client";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { Container } from "../container-wrapper";
import { ProcessIcon } from "../icons/process-icon";
import { RequestDrawingIcon } from "../icons/request-drawing-icon";
import { SelectPlan } from "../icons/selectplan-icon";
import { WeDeliverIcon } from "../icons/we-deliver-icon";
import { WeStartDev } from "../icons/westart-dev-icon";
import { FeatureHighlight } from "../title";

// Definición estática de los pasos
const STEPS = [
  {
    n: "01",
    icon: SelectPlan,
    title: "Nos contás tu negocio.",
    description:
      "15 minutos: qué vendés, a quién, y qué te frena para vender más.",
  },
  {
    n: "02",
    icon: RequestDrawingIcon,
    title: "Aprobás el diseño.",
    description: "Lo ves completo antes de programar una sola línea.",
  },
  {
    n: "03",
    icon: WeStartDev,
    title: "Construimos y probamos.",
    description: "Tu web lista y probada en celular, tablet y compu.",
  },
  {
    n: "04",
    icon: WeDeliverIcon,
    title: "Sale a vender.",
    description: "Publicamos todo y seguimos cerca después de la entrega.",
  },
] as const;

interface StepCardProps {
  item: (typeof STEPS)[number];
  index: number;
  isActive: boolean;
  onSelect: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}

// Tarjeta de paso
const StepCard = memo(function StepCard({
  item,
  isActive,
  onSelect,
  setRef,
}: StepCardProps) {
  const Icon = item.icon;

  return (
    <div
      ref={setRef}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="snap-center shrink-0 w-[78vw] sm:w-[22rem] md:w-[24rem] cursor-pointer select-none"
    >
      <motion.div
        animate={{
          scale: isActive ? 1 : 0.94,
          opacity: isActive ? 1 : 0.55,
        }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className={cn(
          "relative flex flex-col gap-5 rounded-3xl p-6 md:p-8 min-h-[19rem] md:min-h-[21rem] border transition-colors",
          isActive
            ? "bg-ink border-brand"
            : "bg-ink/60 border-white/5"
        )}
      >
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "heading text-4xl md:text-5xl leading-none transition-colors",
              isActive ? "text-brand" : "text-white/25"
            )}
          >
            {item.n}
          </span>

          <div
            className={cn(
              "flex items-center justify-center size-12 md:size-14 rounded-2xl shrink-0 transition-colors",
              isActive ? "bg-brand/15" : "bg-white/5"
            )}
          >
            <Icon
              className={cn(
                "size-6 md:size-7 transition-colors",
                isActive ? "text-brand" : "text-white/40"
              )}
              aria-hidden="true"
            />
          </div>
        </div>

        <div>
          <h3 className="heading text-2xl md:text-3xl leading-[1.05] text-white mb-3 uppercase">
            {item.title}
          </h3>

          <p className="text-base md:text-lg leading-relaxed text-white/60">
            {item.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
});

export function ProcessSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);

  // Evita que el IntersectionObserver interfiera
  // con la navegación manual.
  const suppressObserverRef = useRef(false);

  // FIX PRINCIPAL:
  // useRef necesita un valor inicial en React/TypeScript actual.
  const suppressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserverRef.current) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          )[0];

        if (visible) {
          const idx = cardRefs.current.findIndex(
            (el) => el === visible.target
          );

          if (idx !== -1) {
            setActive(idx);
          }
        }
      },
      {
        root: track,
        threshold: [0.5, 0.75],
      }
    );

    cardRefs.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(
      0,
      Math.min(STEPS.length - 1, index)
    );

    // Actualizamos inmediatamente el paso activo.
    setActive(clamped);

    // Bloqueamos temporalmente el IntersectionObserver.
    suppressObserverRef.current = true;

    // Limpiamos el timeout anterior si existe.
    if (suppressTimeoutRef.current !== null) {
      clearTimeout(suppressTimeoutRef.current);
    }

    // Reactivamos el observer después del scroll.
    suppressTimeoutRef.current = setTimeout(() => {
      suppressObserverRef.current = false;
      suppressTimeoutRef.current = null;
    }, 500);

    // Centramos la tarjeta seleccionada.
    cardRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, []);

  // Limpieza del timeout al desmontar el componente.
  useEffect(() => {
    return () => {
      if (suppressTimeoutRef.current !== null) {
        clearTimeout(suppressTimeoutRef.current);
        suppressTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <Container spacing="lg">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          margin: "-100px",
        }}
        id="process"
        className="scroll-mt-28"
      >
        {/* Label */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <FeatureHighlight>
            <div
              className="w-15 h-[.5px] bg-brand shrink-0"
              aria-hidden="true"
            />

            <ProcessIcon
              className="w-5 h-5"
              aria-hidden="true"
            />

            <p>Proceso</p>
          </FeatureHighlight>
        </motion.div>

        {/* Título */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center text-center mb-8 md:mb-12"
        >
          <h2 className="heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-text leading-[1.02] uppercase max-w-3xl text-balance">
            Simple, claro,{" "}
            <span className="text-secondary-title">
              sin vueltas.
            </span>
          </h2>

          <p className="mt-4 text-base md:text-xl leading-relaxed text-text max-w-xl">
            Cuatro pasos y tu web lista para vender. Vos
            aprobás, nosotros hacemos el resto.
          </p>
        </motion.div>

        {/* Carrusel */}
        <motion.div
          variants={itemVariants}
          className="relative -mx-4 sm:-mx-0"
        >
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 sm:px-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {STEPS.map((item, index) => (
              <StepCard
                key={item.n}
                item={item}
                index={index}
                isActive={active === index}
                onSelect={() => goTo(index)}
                setRef={(el) => {
                  cardRefs.current[index] = el;
                }}
              />
            ))}

            {/* Spacer para centrar la última tarjeta */}
            <div
              className="shrink-0 w-px sm:hidden"
              aria-hidden="true"
            />
          </div>

          {/* Navegación */}
          <div className="flex items-center justify-center gap-5 mt-7">
            {/* Flecha anterior */}
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Paso anterior"
              className="flex items-center justify-center size-9 rounded-full border border-text/15 text-text disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand hover:text-brand transition-colors"
            >
              <ArrowLeft
                size={16}
                aria-hidden="true"
              />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {STEPS.map((item, index) => (
                <button
                  key={item.n}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ir al paso ${index + 1}`}
                  aria-current={
                    active === index ? "step" : undefined
                  }
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    active === index
                      ? "w-8 bg-brand"
                      : "w-1.5 bg-text/20"
                  )}
                />
              ))}
            </div>

            {/* Flecha siguiente */}
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === STEPS.length - 1}
              aria-label="Paso siguiente"
              className="flex items-center justify-center size-9 rounded-full border border-text/15 text-text disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand hover:text-brand transition-colors"
            >
              <ArrowRight
                size={16}
                aria-hidden="true"
              />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
}
