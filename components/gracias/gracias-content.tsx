"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  Copy,
  CopyCheck,
  MessageCircle,
  MessageSquareText,
  Rocket,
} from "lucide-react";
import { Container } from "../container-wrapper";
import { Button } from "../button";
import { Logo } from "../logo";
import { Footer } from "../sections/footer";
import { ReceiptPdfButton } from "./receipt-pdf-button";
import { MP_LINKS, TRANSFER_INFO, WHATSAPP_LINK } from "@/lib/constant";

interface GraciasContentProps {
  plan: string;
  planId: string;
  method: string;
  amount: string;
  name: string;
}

const DELIVERY_ESTIMATE: Record<string, string> = {
  landing: "3 a 5 días hábiles",
  ecommerce: "5 a 15 días hábiles",
  business: "2 a 3 semanas",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function CopyField({ label, value }: { label: string; value?: string }) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("[v0] No se pudo copiar:", err);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-black/5 last:border-0">
      <div>
        <p className="text-xs uppercase tracking-wide text-text/50 font-semibold">
          {label}
        </p>
        <p className="text-sm md:text-base font-semibold text-text break-all">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="p-2 rounded-full hover:bg-black/5 transition-colors shrink-0"
        aria-label={`Copiar ${label}`}
      >
        {copied ? (
          <CopyCheck className="size-4 text-brand" />
        ) : (
          <Copy className="size-4 text-text/50" />
        )}
      </button>
    </div>
  );
}

export function GraciasContent({
  plan,
  planId,
  method,
  amount,
  name,
}: GraciasContentProps) {
  const numericAmount = Number(amount) || 0;

  const orderId = useMemo(
    () => `DD-${Date.now().toString().slice(-8)}`,
    []
  );

  const mpLink = MP_LINKS[planId];
  const isTransfer = method === "transfer";

  return (
    <div className="min-h-screen flex flex-col">
      <Container className="flex-1 py-10 md:py-16" spacing="none">
        <div className="max-w-[75rem] mx-auto w-full py-10 md:py-16">
          <Link href="/" className="block w-fit mx-auto mb-8">
            <Logo size="large" />
          </Link>

          <div className="flex flex-col items-center text-center gap-4 mb-10 md:mb-14">
            <div className="size-16 rounded-full bg-brand/10 flex items-center justify-center">
              <Check className="size-8 text-brand" />
            </div>
            <h1 className="heading text-3xl md:text-5xl text-text text-balance">
              {name ? `¡Gracias, ${name.split(" ")[0]}!` : "¡Gracias por tu pedido!"}
            </h1>
            <p className="text-base md:text-lg text-text/70 max-w-lg text-balance">
              Recibimos los datos de tu pedido y ya le avisamos a nuestro
              equipo. En breve nos comunicamos con vos para arrancar.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_23rem] gap-6 lg:gap-10 items-start">
            {/* Main column */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="rounded-3xl border border-black/10 bg-card p-6 md:p-8">
                <h2 className="heading text-lg text-text mb-5">
                  Qué Sigue Ahora
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="size-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                      <Check className="size-4 text-brand" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-text">
                        Pedido confirmado
                      </p>
                      <p className="text-sm text-text/60 leading-relaxed">
                        Ya registramos tus datos y tu plan elegido.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                      <MessageSquareText className="size-4 text-brand" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-text">
                        Te contactamos por WhatsApp
                      </p>
                      <p className="text-sm text-text/60 leading-relaxed">
                        En las próximas horas nuestro equipo te escribe para
                        coordinar los detalles de tu proyecto.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                      <Rocket className="size-4 text-brand" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-text">
                        Arrancamos con el desarrollo
                      </p>
                      <p className="text-sm text-text/60 leading-relaxed">
                        {DELIVERY_ESTIMATE[planId]
                          ? `Entrega estimada: ${DELIVERY_ESTIMATE[planId]}, contados desde que confirmamos toda la información de tu negocio.`
                          : "Coordinamos el plazo de entrega según el alcance de tu proyecto a medida."}
                      </p>
                    </div>
                  </div>
                </div>

                {DELIVERY_ESTIMATE[planId] && (
                  <div className="flex items-center gap-2 mt-5 pt-5 border-t border-black/5 text-sm text-text/50">
                    <Clock className="size-3.5 shrink-0" />
                    Los plazos comienzan a correr una vez que nos envíes el
                    contenido de tu negocio.
                  </div>
                )}
              </div>

              {isTransfer ? (
                <div className="rounded-3xl border border-black/10 bg-card p-6 md:p-8">
                  <h2 className="heading text-lg text-text mb-1">
                    Datos para transferir
                  </h2>
                  <p className="text-sm text-text/60 mb-2">
                    Ya tenés el 15% de descuento aplicado en el total.
                  </p>

                  <div>
                    <CopyField label="Alias" value={TRANSFER_INFO.alias} />
                    <CopyField label="CBU" value={TRANSFER_INFO.cbu} />
                    <CopyField label="Banco" value={TRANSFER_INFO.banco} />
                    <CopyField label="Titular" value={TRANSFER_INFO.titular} />
                  </div>

                  <p className="text-sm text-text/70 mt-4">
                    Cuando hagas la transferencia, enviános el comprobante
                    por WhatsApp para confirmar tu pedido.
                  </p>

                  <Button
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full justify-center mt-4"
                  >
                    <MessageCircle className="size-4" />
                    Enviar Comprobante por WhatsApp
                  </Button>
                </div>
              ) : (
                <div className="rounded-3xl border border-black/10 bg-card p-6 md:p-8">
                  <h2 className="heading text-lg text-text mb-1">
                    Completá tu pago en Mercado Pago
                  </h2>
                  <p className="text-sm text-text/60 mb-4">
                    Te abrimos Mercado Pago en una pestaña nueva para que
                    termines el pago de forma segura. Si no se abrió, tocá
                    el botón.
                  </p>

                  {mpLink ? (
                    <Button
                      href={mpLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full justify-center"
                    >
                      Ir a Mercado Pago
                    </Button>
                  ) : (
                    <p className="text-sm text-text/60">
                      Nos vamos a comunicar con vos para enviarte el link de
                      pago.
                    </p>
                  )}
                </div>
              )}

              <div className="rounded-3xl bg-ink p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="heading text-lg text-white mb-1">
                    ¿Tenés Alguna Duda?
                  </h2>
                  <p className="text-sm text-white/60">
                    Escribinos por WhatsApp y te respondemos al toque.
                  </p>
                </div>
                <Button
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  className="w-full sm:w-auto justify-center shrink-0"
                >
                  <MessageCircle className="size-4" />
                  Escribir por WhatsApp
                </Button>
              </div>
            </div>

            {/* Sidebar column */}
            <div className="space-y-6 order-1 lg:order-2 lg:sticky lg:top-8">
              <div className="rounded-3xl border border-black/10 bg-card p-6 md:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-black/5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-text/50 font-semibold">
                      Plan
                    </p>
                    <p className="heading text-xl text-text">{plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-text/50 font-semibold">
                      Total
                    </p>
                    <p className="heading text-xl text-brand">
                      {formatCurrency(numericAmount)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-sm">
                  <span className="text-text/50 font-medium">
                    N.° de pedido
                  </span>
                  <span className="font-semibold text-text">{orderId}</span>
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 bg-card p-6 md:p-8 flex flex-col items-center text-center gap-4">
                <div>
                  <h2 className="heading text-lg text-text mb-1">
                    Guardá tu comprobante
                  </h2>
                  <p className="text-sm text-text/60">
                    Descargalo en PDF para tener el detalle de tu pedido.
                  </p>
                </div>
                <ReceiptPdfButton
                  plan={plan}
                  method={method}
                  amount={numericAmount}
                  name={name}
                  orderId={orderId}
                  deliveryEstimate={DELIVERY_ESTIMATE[planId]}
                  isTransfer={isTransfer}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
}
