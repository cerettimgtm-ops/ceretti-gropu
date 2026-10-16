"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Button } from "./button";
import { pricing } from "@/lib/constant";

export function StickyPlansCta() {
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);
  // Una vez que el usuario ya scrolleó por completo la sección de precios,
  // no queremos que el sticky vuelva a aparecer flotando sobre el footer.
  const [belowPricing, setBelowPricing] = useState(false);

  // 1. Memoizamos el plan más económico para evitar recalcularlo en cada render
  const cheapestPlan = useMemo(() => {
    if (!pricing?.length) return null;
    return pricing.reduce((min, item) =>
      item.priceValue < min.priceValue ? item : min
    );
  }, []);

  // 2. Optimización de Scroll: Solo actualiza el estado cuando cruza el umbral (evita decenas de re-renders)
  useMotionValueEvent(scrollY, "change", (latest) => {
    const isPast = latest > 480;
    setPastHero((prev) => (prev !== isPast ? isPast : prev));
  });

  // 3. Observer robusto para la sección de precios
  useEffect(() => {
    const target = document.getElementById("pricing");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPricingVisible(entry.isIntersecting);
        // bottom < 0 significa que la sección de precios quedó por completo
        // arriba del viewport: el usuario ya la vio y sigue bajando.
        setBelowPricing(entry.boundingClientRect.bottom < 0);
      },
      { rootMargin: "-15% 0px -15% 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !pricingVisible && !belowPricing;

  if (!cheapestPlan) return null;

  return (
    <motion.div
      className="md:hidden fixed inset-x-3 z-40 will-change-transform"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))" }}
      initial={false}
      animate={
        visible
          ? { y: 0, opacity: 1, pointerEvents: "auto" }
          : { y: 96, opacity: 0, pointerEvents: "none" }
      }
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      aria-hidden={!visible}
    >
      <div className="rounded-2xl border border-white/10 bg-black/95 backdrop-blur-md shadow-2xl shadow-black/30 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col leading-tight min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase tracking-wide text-white/50 font-semibold">
                {cheapestPlan.plan}
              </span>
              <span className="text-[9px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                3 cuotas sin interés
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
              {cheapestPlan.onSale && cheapestPlan.originalPrice && (
                <span className="text-xs text-white/40 line-through">
                  {cheapestPlan.originalPrice}
                </span>
              )}
              <span className="heading text-lg text-white truncate">
                {cheapestPlan.price}
              </span>
            </div>
          </div>
          <Button href="/#pricing" size="small" className="text-xs shrink-0">
            Ver Plan
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
