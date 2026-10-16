"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, Eye, Heart, Repeat, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { containerVariants, itemVariants } from "@/lib/constant";
import { Button } from "../button";
import { Container } from "../container-wrapper";
import { FeatureHighlight } from "../title";

// Síntomas cortos y visuales que calcan, paso a paso, el recorrido típico
// de alguien que vive de las redes: publica, junta likes y vistas, pero no
// convierte eso en ventas. Así el visitante con dudas se identifica de
// inmediato, sin necesidad de etiquetar "dolor / problema / solución".
const SYMPTOMS = [
  { id: "publicas", icon: Repeat, text: "Publicás todos los días" },
  { id: "likes", icon: Heart, text: "Sumás likes y seguidores" },
  { id: "vistas", icon: Eye, text: "Tenés vistas, pero no mensajes" },
  { id: "carrito", icon: ShoppingCart, text: "Y las ventas no aparecen" },
];

export function DiagnosisSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const count = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Container spacing="none" className="pb-14 md:pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        id="diagnostico"
        className="scroll-mt-28"
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <FeatureHighlight>
            <div className="w-15 h-[.5px] bg-brand shrink-0" aria-hidden="true" />
            <Check className="w-4 h-4" aria-hidden="true" />
            <p>¿Te pasa esto?</p>
          </FeatureHighlight>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center text-center mb-5 md:mb-7"
        >
          <h2 className="heading text-2xl sm:text-3xl md:text-4xl text-text leading-[1.05] uppercase whitespace-nowrap">
            Publicás mucho. ¿Pero vendés?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-secondary-title max-w-md">
            Seguidores, likes, muchas vistas... y pocas ventas. Marcá lo que
            se repite en tu negocio.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          role="group"
          aria-label="Síntomas frecuentes"
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 w-full"
        >
          {SYMPTOMS.map((symptom) => {
            const Icon = symptom.icon;
            const isChecked = !!checked[symptom.id];
            return (
              <button
                key={symptom.id}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggle(symptom.id)}
                className={cn(
                  "group relative flex flex-col justify-between gap-3 rounded-2xl p-4 sm:p-5 min-h-[8rem] sm:min-h-[9rem] text-left transition-colors duration-300 cursor-pointer border",
                  isChecked
                    ? "bg-brand border-brand"
                    : "bg-ink border-white/10 hover:border-white/25"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center size-9 sm:size-10 rounded-full transition-colors duration-300",
                    isChecked ? "bg-black/15" : "bg-white/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 sm:size-5 transition-colors duration-300",
                      isChecked ? "text-white" : "text-brand"
                    )}
                    aria-hidden="true"
                  />
                </div>

                <p
                  className={cn(
                    "text-sm sm:text-[0.95rem] leading-snug font-medium transition-colors duration-300",
                    isChecked ? "text-white" : "text-white/75"
                  )}
                >
                  {symptom.text}
                </p>

                <div
                  className={cn(
                    "absolute top-3 right-3 flex items-center justify-center size-5 rounded-full border transition-all duration-300",
                    isChecked
                      ? "bg-white border-white scale-100 opacity-100"
                      : "border-white/25 scale-90 opacity-0 group-hover:opacity-60"
                  )}
                  aria-hidden="true"
                >
                  <Check className="size-3 text-brand" strokeWidth={3} />
                </div>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl bg-ink px-5 py-4 sm:px-6"
        >
          <p className="flex-1 text-sm sm:text-[0.95rem] text-white/70 leading-snug">
            {count > 0 ? (
              <>
                <span className="text-brand font-semibold">{count} de 4</span>{" "}
                te suenan familiares. Tranquilo: el problema casi nunca es tu
                producto, es cómo lo estás presentando.
              </>
            ) : (
              "Tocá lo que se repite. Spoiler: el problema casi nunca es el producto."
            )}
          </p>
          <Button
            variant="primary"
            size="medium"
            href="/#services"
            className="shrink-0 w-full sm:w-auto"
          >
            Ver cómo lo resolvemos
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
}
