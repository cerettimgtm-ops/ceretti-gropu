"use client";

import { navLinks, WHATSAPP_LINK } from "@/lib/constant";
import Link from "next/link";
import { Button } from "./button";
import { Logo } from "./logo";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // Medimos en vivo el alto real del header (anuncio + barra de navegación)
  // para que el resto de la página siempre reserve el espacio exacto,
  // sin importar si el texto del anuncio ocupa una o dos líneas.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--navigation-height",
        `${el.offsetHeight}px`
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-0 z-50 w-full">
      <div ref={headerRef}>
        {/* Barra de anuncio: se oculta al scrollear para ganar espacio */}
        <AnimatePresence initial={false}>
          {!isScrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <Link
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-2 bg-brand px-4 py-2.5 text-center transition-colors hover:bg-brand/90"
              >
                <Megaphone
                  className="hidden sm:block size-4 shrink-0 text-white"
                  aria-hidden="true"
                />
                <span className="text-xs sm:text-sm font-bold text-white leading-snug text-balance">
                  <span className="hidden sm:inline">
                    ¿Querés hacer crecer tu marca?{" "}
                  </span>
                  <span className="sm:hidden">¿Querés crecer? </span>
                  <span className="underline underline-offset-2">
                    Hablemos
                  </span>{" "}
                  por WhatsApp.
                </span>
                <ArrowRight
                  className="size-3.5 shrink-0 text-white transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <header
          className={cn(
            "w-full h-[6.5rem] transition-colors duration-300",
            isScrolled
              ? "bg-background/95 backdrop-blur-md border-b border-black/10 shadow-sm"
              : "bg-background border-b border-black/5"
          )}
        >
          <div className="mx-auto flex h-full max-w-[130rem] items-center justify-between px-5 md:px-10">
            <Link href="/" className="shrink-0">
              <Logo size="medium" />
            </Link>

            {/* Navegación: Desktop */}
            <nav className="hidden lg:flex items-center gap-x-7">
              {navLinks.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className="flex items-center gap-x-1.5 hover:text-brand text-text transition-colors font-semibold text-sm"
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden lg:block shrink-0">
              <Button href="/#pricing" size="medium">
                Quiero mi Web
              </Button>
            </div>

            {/* Botón de menú: Mobile / Tablet */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 hover:bg-black/5 rounded-full transition-colors"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-text" />
              ) : (
                <Menu className="w-6 h-6 text-text" />
              )}
            </button>
          </div>
        </header>
      </div>

      {/* Menú desplegable: Mobile / Tablet (se superpone, no empuja el header) */}
      <motion.nav
        initial={false}
        animate={
          isMobileMenuOpen
            ? { opacity: 1, height: "auto" }
            : { opacity: 0, height: 0 }
        }
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="lg:hidden overflow-hidden bg-background border-b border-black/10 shadow-md"
      >
        <div className="flex flex-col p-4">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-x-3 p-3 hover:bg-black/5 rounded-xl transition-colors text-text hover:text-brand font-semibold"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="mt-2 pt-3 border-t border-black/5">
            <Button
              href="/#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              size="medium"
              className="w-full justify-center"
            >
              Quiero mi Web
            </Button>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
