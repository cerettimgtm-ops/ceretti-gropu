"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

import { Container } from "../container-wrapper";
import { Button } from "../button";
import {
  containerVariants,
  itemVariants,
  WHATSAPP_LINK,
} from "@/lib/constant";

export function Footer() {
  return (
    <footer className="bg-ink w-full rounded-t-[5rem] py-20 md:py-28">
      <Container spacing="none" className="flex flex-col justify-between h-full gap-16 md:gap-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between"
        >
          <motion.div variants={itemVariants} className="max-w-2xl">
            <h2 className="heading text-4xl sm:text-5xl md:text-6xl text-white leading-[1.02] mb-5">
              Hagamos crecer <span className="text-brand">tu marca.</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70">
              Ceretti Group · Growth &amp; Marketing
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              size="large"
              className="justify-center"
            >
              <MessageCircle className="size-5 mr-2" aria-hidden="true" />
              Hablemos por WhatsApp
            </Button>
          </motion.div>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
          <p className="text-white/60 text-xs font-medium">
            Ceretti Group © {new Date().getFullYear()}
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar a Ceretti Group por WhatsApp"
            className="text-white/70 hover:text-brand transition-colors"
          >
            <MessageCircle size={18} aria-hidden="true" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
