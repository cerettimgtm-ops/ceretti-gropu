"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "./button";
import { WHATSAPP_LINK } from "@/lib/constant";

// Solo se muestra una vez por sesión de navegación: si el usuario ya lo vio
// (lo cerró o navegó a otra página del sitio y volvió), no queremos que
// vuelva a interrumpirlo.
const SESSION_KEY = "ceretti_consult_popup_shown";
const DELAY_MS = 10_000;

export function ConsultPopup() {
  const [open, setOpen] = useState(false);
  // Evita que el efecto dispare el popup dos veces (p. ej. en modo dev con
  // doble invocación de efectos de React).
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (triggeredRef.current) return;

    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Si sessionStorage no está disponible (modo privado, etc.), simplemente
      // permitimos que se muestre igual: no es crítico.
    }
    if (alreadyShown) return;

    const timeoutId = setTimeout(() => {
      triggeredRef.current = true;
      setOpen(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // No-op: ver comentario arriba.
      }
    }, DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop: oscurece el fondo para dirigir la atención al popup,
              y permite cerrarlo tocando afuera. */}
          <motion.button
            type="button"
            aria-label="Cerrar"
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consult-popup-title"
            aria-describedby="consult-popup-description"
            className="absolute inset-x-3 will-change-transform"
            style={{
              bottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))",
            }}
            initial={{ y: 96, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <div className="relative rounded-2xl border border-white/10 bg-black/95 backdrop-blur-md shadow-2xl shadow-black/40 p-5">
              <button
                type="button"
                onClick={handleClose}
                aria-label="Cerrar"
                className="absolute top-3 right-3 rounded-full p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="size-4" aria-hidden="true" />
              </button>

              <div className="flex items-start gap-3 pr-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/15">
                  <MessageCircle
                    className="size-5 text-brand"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0">
                  <h3
                    id="consult-popup-title"
                    className="heading text-base text-white leading-tight"
                  >
                    ¿Querés hacer crecer tu marca?
                  </h3>
                  <p
                    id="consult-popup-description"
                    className="mt-1 text-sm text-white/60 leading-relaxed"
                  >
                    Hablemos de tus objetivos y encontremos nuevas
                    oportunidades de crecimiento.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className="py-2 text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
                >
                  Ahora no
                </button>
                <Button
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  size="medium"
                  className="w-full justify-center sm:flex-1"
                >
                  Hacer una consulta
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
