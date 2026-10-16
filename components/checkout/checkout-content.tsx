"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  CreditCard,
  Headset,
  Landmark,
  Layers,
  Loader2,
  Lock,
  Percent,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../button";
import { Badge } from "../badge";
import { Logo } from "../logo";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { MP_LINKS, pricing, TRANSFER_DISCOUNT } from "@/lib/constant";
import { trackPixel } from "@/lib/pixel";
import { cn } from "@/lib/utils";

type PaymentMethod = "full" | "installments" | "transfer";
type Plan = (typeof pricing)[number];

interface FormState {
  name: string;
  email: string;
  phone: string;
  business: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s()-]{7,}$/;
const MAX_SUBMIT_ATTEMPTS = 2;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

// Los precios de lista se guardan como texto ("$295.000") para mostrarlos
// tachados; los convertimos a número solo para calcular el ahorro total.
function parsePriceLabel(value: string) {
  const digitsOnly = value.replace(/[^\d]/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
}

function getMethodLabel(paymentMethod: PaymentMethod) {
  if (paymentMethod === "transfer") return "Transferencia · 15% OFF";
  if (paymentMethod === "installments") return "3 cuotas sin interés";
  return "1 pago único";
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Contanos tu nombre para poder identificarte.";
  } else if (form.name.trim().length < 3) {
    errors.name = "Escribí tu nombre completo.";
  }

  if (!form.email.trim()) {
    errors.email = "Necesitamos tu email para enviarte la confirmación.";
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Revisá que el email esté bien escrito.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Dejanos un WhatsApp para coordinar tu proyecto.";
  } else if (!PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = "Ingresá un número válido, con código de área.";
  }

  return errors;
}

export function CheckoutContent({ planId }: { planId: string }) {
  const plan = useMemo(
    () => pricing.find((item) => item.id === planId),
    [planId]
  );

  if (!plan) {
    return <PlanNotFound />;
  }

  return <CheckoutForm plan={plan} />;
}

function PlanNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center space-y-5 rounded-3xl border border-black/10 p-8">
        <div className="size-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto">
          <AlertCircle className="size-6 text-brand" />
        </div>
        <h1 className="heading text-2xl text-text">No Encontramos ese Plan</h1>
        <p className="text-sm text-text/60 leading-relaxed">
          Puede que el enlace esté vencido o mal escrito. Volvé a la sección
          de planes y elegí de nuevo.
        </p>
        <Button href="/#pricing" className="w-full justify-center">
          Ver Planes y Precios
        </Button>
      </div>
    </div>
  );
}

function CheckoutForm({ plan }: { plan: Plan }) {
  const router = useRouter();
  const formId = useId();
  const mobilePanelId = useId();
  const desktopPanelId = useId();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("full");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    business: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});

  const discountedPrice = plan.priceValue * (1 - TRANSFER_DISCOUNT);
  const installmentPrice = plan.priceValue / 3;

  // Desglose de precio: precio de lista (si hay promo), ahorro de lanzamiento
  // y ahorro extra por transferencia, para mostrar cada oferta con claridad.
  const originalPriceValue =
    plan.onSale && plan.originalPrice ? parsePriceLabel(plan.originalPrice) : 0;
  const launchSavings =
    plan.onSale && originalPriceValue > plan.priceValue
      ? originalPriceValue - plan.priceValue
      : 0;
  const transferSavings = plan.priceValue - discountedPrice;

  const totalToPay =
    paymentMethod === "transfer" ? discountedPrice : plan.priceValue;

  const totalSavings =
    paymentMethod === "transfer"
      ? launchSavings + transferSavings
      : launchSavings;

  const updateField = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      setErrors(validate({ ...form, [field]: value }));
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  };

  const fieldError = (field: keyof FormState) =>
    touched[field] ? errors[field] : undefined;

  const notifyOrder = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          planId: plan.id,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          business: form.business.trim(),
          paymentMethod,
        }),
      });

      if (!res.ok && res.status >= 500 && attempts < MAX_SUBMIT_ATTEMPTS) {
        setAttempts((n) => n + 1);
        await new Promise((resolve) => setTimeout(resolve, 800));
        return notifyOrder();
      }
    } catch (err) {
      console.error("[v0] No se pudo notificar el pedido:", err);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, phone: true, business: true });
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = document.querySelector(
        "[aria-invalid='true']"
      );
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setSubmitError(
        "No tenés conexión a internet en este momento. Revisá tu conexión e intentá de nuevo."
      );
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setAttempts(0);

    trackPixel("InitiateCheckout", {
      content_name: plan.plan,
      content_ids: [plan.id],
      currency: "ARS",
      value: plan.priceValue,
    });

    await notifyOrder();

    const finalAmount = Math.round(totalToPay);

    const params = new URLSearchParams({
      plan: plan.plan,
      planId: plan.id,
      method: paymentMethod,
      amount: String(finalAmount),
      name: form.name.trim(),
      email: form.email.trim(),
    });

    if (paymentMethod !== "transfer") {
      const mpLink = MP_LINKS[plan.id];
      if (mpLink) {
        const paymentWindow = window.open(
          mpLink,
          "_blank",
          "noopener,noreferrer"
        );
        if (!paymentWindow) {
          console.error(
            "[v0] El navegador bloqueó la ventana de Mercado Pago."
          );
        }
      }
    }

    trackPixel("Purchase", {
      content_name: plan.plan,
      content_ids: [plan.id],
      currency: "ARS",
      value: finalAmount,
    });

    router.push(`/gracias?${params.toString()}`);
  };

  const sharedSummaryProps = {
    plan,
    paymentMethod,
    discountedPrice,
    installmentPrice,
    launchSavings,
    transferSavings,
    totalToPay,
    totalSavings,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-10 xl:px-16 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Logo size="medium" />
          </Link>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-semibold text-text/60 text-right">
            <Lock className="size-4 text-brand shrink-0" />
            Pago 100% Seguro
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-10 xl:px-16 py-6 sm:py-8 md:py-14 pb-40 sm:pb-36 lg:pb-16">
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text/60 hover:text-text mb-5 sm:mb-6 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver a Planes
          </Link>

          <div className="space-y-2 mb-6 md:mb-10 lg:mb-12 max-w-2xl">
            <h1 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-text text-balance">
              Finalizá tu Compra
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-text/60 leading-relaxed">
              Completá tus datos, elegí cómo pagar y arrancamos con tu
              proyecto.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px] gap-6 lg:gap-8 xl:gap-12 items-start">
            {/* Summary — collapsible bar on mobile, sticky sidebar on desktop */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-8">
              <div className="lg:hidden">
                <OrderSummaryCard
                  {...sharedSummaryProps}
                  panelId={mobilePanelId}
                  collapsible
                  open={summaryOpen}
                  onToggle={() => setSummaryOpen((v) => !v)}
                />
              </div>
              <div className="hidden lg:block">
                <OrderSummaryCard
                  {...sharedSummaryProps}
                  panelId={desktopPanelId}
                  collapsible={false}
                  open
                  onToggle={() => {}}
                />
              </div>
            </div>

            {/* Form */}
            <form
              id={formId}
              onSubmit={handleSubmit}
              noValidate
              className="order-2 lg:order-1 space-y-5 sm:space-y-6 max-w-2xl lg:max-w-none"
            >
              <SectionCard step={1} title="Tus Datos">
                <div className="space-y-2">
                  <Label htmlFor="checkout-name" className="text-sm">
                    Nombre y apellido
                  </Label>
                  <Input
                    id="checkout-name"
                    required
                    autoFocus
                    autoComplete="name"
                    aria-invalid={Boolean(fieldError("name"))}
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className="h-12 text-base"
                  />
                  {fieldError("name") && (
                    <p className="flex items-center gap-1.5 text-sm text-destructive">
                      <AlertCircle className="size-3.5 shrink-0" />
                      {fieldError("name")}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="checkout-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      aria-invalid={Boolean(fieldError("email"))}
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className="h-12 text-base"
                    />
                    {fieldError("email") && (
                      <p className="flex items-center gap-1.5 text-sm text-destructive">
                        <AlertCircle className="size-3.5 shrink-0" />
                        {fieldError("email")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkout-phone" className="text-sm">
                      WhatsApp
                    </Label>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      aria-invalid={Boolean(fieldError("phone"))}
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      className="h-12 text-base"
                    />
                    {fieldError("phone") && (
                      <p className="flex items-center gap-1.5 text-sm text-destructive">
                        <AlertCircle className="size-3.5 shrink-0" />
                        {fieldError("phone")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkout-business" className="text-sm">
                    Nombre de tu negocio{" "}
                    <span className="text-text/40 normal-case">
                      (opcional)
                    </span>
                  </Label>
                  <Input
                    id="checkout-business"
                    autoComplete="organization"
                    value={form.business}
                    onChange={(e) => updateField("business", e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </SectionCard>

              <SectionCard step={2} title="Cómo Querés Pagar">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as PaymentMethod)
                  }
                  className="space-y-3"
                >
                  <PaymentOption
                    value="full"
                    active={paymentMethod === "full"}
                    icon={CreditCard}
                    title="1 pago"
                    priceLine={`Tarjeta o Mercado Pago · ${formatCurrency(
                      plan.priceValue
                    )}`}
                    note={
                      launchSavings > 0
                        ? `Precio oferta · ahorrás ${formatCurrency(
                            launchSavings
                          )}`
                        : undefined
                    }
                  />

                  <PaymentOption
                    value="installments"
                    active={paymentMethod === "installments"}
                    icon={Layers}
                    title="3 cuotas sin interés"
                    badge="0% interés"
                    priceLine={`Con tarjeta · ${formatCurrency(
                      installmentPrice
                    )} por cuota`}
                    note={
                      launchSavings > 0
                        ? `Precio oferta · ahorrás ${formatCurrency(
                            launchSavings
                          )}`
                        : undefined
                    }
                  />

                  <PaymentOption
                    value="transfer"
                    active={paymentMethod === "transfer"}
                    icon={Landmark}
                    title="Transferencia bancaria"
                    badge="15% OFF"
                    highlight
                    priceLine={`Pagás ${formatCurrency(discountedPrice)}`}
                    note={`La forma más económica · ahorrás ${formatCurrency(
                      launchSavings + transferSavings
                    )} en total`}
                  />
                </RadioGroup>
              </SectionCard>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-1">
                <TrustPill icon={Lock} label="Datos protegidos" />
                <TrustPill icon={ShieldCheck} label="Pago seguro" />
                <TrustPill icon={Headset} label="Soporte 24/7" />
              </div>

              {submitError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="flex items-start gap-2 rounded-xl bg-destructive/5 p-4 text-sm text-destructive"
                >
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{submitError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                size="large"
                className="w-full justify-center hidden lg:flex disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span className="sr-only">Procesando tu pedido…</span>
                  </>
                ) : submitError ? (
                  "Reintentar"
                ) : paymentMethod === "transfer" ? (
                  "Ver Datos para Transferir"
                ) : (
                  "Ir a Mercado Pago"
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Sticky mobile CTA bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 border-t border-black/10 bg-background/95 backdrop-blur-sm p-3.5 sm:p-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 sm:gap-4 max-w-[1400px] mx-auto">
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-wide text-text/50 font-semibold truncate">
              {getMethodLabel(paymentMethod)}
            </p>
            <p className="heading text-lg sm:text-xl text-brand truncate">
              {formatCurrency(totalToPay)}
            </p>
          </div>
          <Button
            type="submit"
            form={formId}
            disabled={loading}
            aria-busy={loading}
            className="justify-center shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Confirmar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-card p-5 sm:p-6 md:p-9 lg:p-10 space-y-5 lg:space-y-6">
      <div className="flex items-center gap-3">
        <span className="heading flex items-center justify-center size-7 sm:size-8 lg:size-9 rounded-full bg-brand text-white text-sm lg:text-base shrink-0">
          {step}
        </span>
        <p className="heading text-sm md:text-base lg:text-lg uppercase tracking-wide text-text/70">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function TrustPill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-card px-3 py-1.5 text-xs sm:text-sm font-medium text-text/60">
      <Icon className="size-3.5 text-brand shrink-0" />
      {label}
    </span>
  );
}

function PaymentOption({
  value,
  active,
  icon: Icon,
  title,
  badge,
  priceLine,
  note,
  highlight,
}: {
  value: PaymentMethod;
  active: boolean;
  icon: LucideIcon;
  title: string;
  badge?: string;
  priceLine: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <label
      className={cn(
        "relative flex items-start gap-3.5 sm:gap-4 lg:gap-5 rounded-2xl border p-4 sm:p-5 lg:p-6 cursor-pointer transition-all active:bg-brand/5",
        active
          ? "border-brand bg-brand/5 shadow-sm"
          : "border-black/10 hover:border-black/20"
      )}
    >
      <RadioGroupItem value={value} className="mt-0.5 size-5 shrink-0" />
      <Icon
        className={cn(
          "size-5 lg:size-6 shrink-0 mt-0.5 transition-colors",
          active ? "text-brand" : "text-text/40"
        )}
      />
      <div className="flex-1 min-w-0 space-y-1 lg:space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-base lg:text-lg font-semibold text-text">{title}</p>
          {badge && (
            <span
              className={cn(
                "heading text-[0.62rem] lg:text-[0.7rem] rounded-full px-2 lg:px-2.5 py-1 leading-none shrink-0",
                highlight ? "bg-brand text-white" : "bg-ink/10 text-ink"
              )}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm lg:text-base text-text/60 break-words">{priceLine}</p>
        {note && (
          <p className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-brand">
            <Percent className="size-3 lg:size-3.5 shrink-0" />
            <span className="break-words">{note}</span>
          </p>
        )}
      </div>
      {active && (
        <div
          className="flex items-center justify-center size-5 lg:size-6 rounded-full bg-brand shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <Check className="size-3 lg:size-3.5 text-white" />
        </div>
      )}
    </label>
  );
}

interface OrderSummaryCardProps {
  plan: Plan;
  paymentMethod: PaymentMethod;
  discountedPrice: number;
  installmentPrice: number;
  launchSavings: number;
  transferSavings: number;
  totalToPay: number;
  totalSavings: number;
  panelId: string;
  collapsible: boolean;
  open: boolean;
  onToggle: () => void;
}

function OrderSummaryCard({
  plan,
  paymentMethod,
  installmentPrice,
  launchSavings,
  transferSavings,
  totalToPay,
  totalSavings,
  panelId,
  collapsible,
  open,
  onToggle,
}: OrderSummaryCardProps) {
  const isOpen = open || !collapsible;

  return (
    <div className="rounded-3xl border border-black/10 bg-card overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={collapsible ? onToggle : undefined}
        aria-expanded={isOpen}
        aria-controls={panelId}
        disabled={!collapsible}
        className={cn(
          "w-full flex items-center gap-3 lg:gap-4 p-4 sm:p-5 md:p-6 lg:p-7 text-left",
          collapsible ? "cursor-pointer" : "cursor-default"
        )}
      >
        <div className="p-2.5 md:p-3 lg:p-3.5 rounded-2xl bg-brand/10 shrink-0">
          <plan.icon className="size-5 md:size-6 lg:size-7 text-brand" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="heading text-base md:text-xl lg:text-2xl text-text leading-tight truncate">
            {plan.plan}
          </p>
          {plan.tagline && (
            <p className="text-[0.7rem] md:text-xs lg:text-sm uppercase tracking-wide text-brand font-semibold truncate">
              {plan.tagline}
            </p>
          )}
        </div>
        {plan.label && (
          <Badge className="hidden sm:flex text-[0.65rem] lg:text-xs px-2.5 lg:px-3 py-1.5 lg:py-2 shrink-0">
            {plan.label}
          </Badge>
        )}
        <div className="text-right shrink-0 pl-1">
          <p className="heading text-base md:text-2xl lg:text-3xl text-brand leading-none">
            {formatCurrency(totalToPay)}
          </p>
        </div>
        {collapsible && (
          <ChevronDown
            className={cn(
              "size-5 text-text/40 shrink-0 transition-transform duration-300",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
            }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 md:px-8 lg:px-8 pb-5 sm:pb-6 md:pb-8 lg:pb-9 space-y-5 lg:space-y-6 border-t border-black/5">
              <div className="space-y-3 lg:space-y-3.5 pt-5 lg:pt-6">
                {plan.features.map((feature) => (
                  <div key={feature.label} className="flex items-start gap-2.5 lg:gap-3">
                    <Check className="size-4 lg:size-[1.125rem] text-brand shrink-0 mt-0.5" />
                    <p className="text-sm lg:text-[0.95rem] text-text/80 leading-snug">
                      {feature.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 lg:space-y-3 pt-4 lg:pt-5 border-t border-black/5">
                <div className="flex items-center justify-between text-sm lg:text-base">
                  <span className="text-text/60">Medio de pago</span>
                  <span className="font-medium text-text text-right">
                    {getMethodLabel(paymentMethod)}
                  </span>
                </div>

                {plan.onSale && plan.originalPrice && (
                  <div className="flex items-center justify-between text-sm lg:text-base">
                    <span className="text-text/60">Precio de lista</span>
                    <span className="text-text/40 line-through">
                      {plan.originalPrice}
                    </span>
                  </div>
                )}

                {plan.onSale && (
                  <div className="flex items-center justify-between text-sm lg:text-base">
                    <span className="text-text/60">Precio oferta</span>
                    <span className="font-medium text-text">
                      {formatCurrency(plan.priceValue)}
                    </span>
                  </div>
                )}

                {paymentMethod === "transfer" && (
                  <div className="flex items-center justify-between text-sm lg:text-base">
                    <span className="text-text/60">
                      Descuento por transferencia (15%)
                    </span>
                    <span className="font-medium text-brand">
                      -{formatCurrency(transferSavings)}
                    </span>
                  </div>
                )}

                {paymentMethod === "installments" && (
                  <div className="flex items-center justify-between text-sm lg:text-base">
                    <span className="text-text/60">3 cuotas sin interés</span>
                    <span className="font-medium text-text">
                      {formatCurrency(installmentPrice)} c/u
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-black/5">
                  <span className="heading text-sm lg:text-base uppercase tracking-wide text-text/60">
                    Total
                  </span>
                  <span className="heading text-2xl sm:text-3xl lg:text-4xl text-brand">
                    {formatCurrency(totalToPay)}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex items-center justify-end gap-1.5 text-xs sm:text-sm lg:text-base font-semibold text-brand">
                    <Percent className="size-3.5 lg:size-4 shrink-0" />
                    Ahorrás {formatCurrency(totalSavings)} en total
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
