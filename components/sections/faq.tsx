"use client";

import { memo, useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CircleHelp, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Container } from "../container-wrapper";
import { FeatureHighlight } from "../title";
import { Button } from "../button";
import {
  cardItemVariants,
  containerVariants,
  faqs,
  itemVariants,
  WHATSAPP_LINK,
} from "@/lib/constant";

interface FaqItemProps {
  question: string;
  answer: string;
}

// Acordeón oscuro, en línea con las tarjetas de "Soluciones" y "Proceso":
// colapsado muestra solo la pregunta, al tocarlo se pinta de marca y revela
// la respuesta con la misma animación de altura que el resto de la web.
const FaqItem = memo(function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <motion.div
      variants={cardItemVariants}
      className={cn(
        "rounded-2xl w-full border overflow-hidden transition-colors duration-300",
        isOpen ? "bg-brand border-brand" : "bg-ink border-white/10 hover:border-white/25"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full text-left flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 min-h-[3.75rem] focus:outline-none"
      >
        <h3 className="heading text-sm sm:text-base md:text-lg leading-snug text-white pr-2">
          {question}
        </h3>

        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className={cn(
            "shrink-0 flex items-center justify-center size-7 rounded-full transition-colors duration-300",
            isOpen ? "bg-black/15 text-white" : "bg-white/10 text-white"
          )}
          aria-hidden="true"
        >
          <Plus className="size-3.5" />
        </motion.div>
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
            <p className="text-sm leading-relaxed text-white/90 px-4 sm:px-5 pb-4 sm:pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export function FAQ() {
  return (
    <Container spacing="default">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        id="faq"
        className="scroll-mt-28"
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <FeatureHighlight>
            <div className="w-15 h-[.5px] bg-brand shrink-0" aria-hidden="true" />
            <CircleHelp className="w-4 h-4" aria-hidden="true" />
            <p>Dudas</p>
          </FeatureHighlight>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center text-center mb-6 md:mb-10"
        >
          <h2 className="heading text-2xl sm:text-4xl md:text-5xl text-text leading-[1.05] uppercase max-w-2xl text-balance">
            Lo que preguntás antes de empezar.
          </h2>

          <p className="mt-2 text-sm sm:text-base text-secondary-title">
            Tocá cada pregunta para ver la respuesta.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-4xl mx-auto"
        >
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 md:mt-8 flex flex-col items-center text-center gap-3 w-full max-w-4xl mx-auto"
        >
          <p className="text-sm sm:text-[0.95rem] text-secondary-title">
            ¿No encontrás tu respuesta? Escribinos y te ayudamos al toque.
          </p>
          <Button
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            size="medium"
            className="w-full sm:w-auto"
          >
            Consultar por WhatsApp
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
}
