"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Landmark,
  Layers,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { MP_LINKS, TRANSFER_DISCOUNT } from "@/lib/constant";
import { trackPixel } from "@/lib/pixel";
import { cn } from "@/lib/utils";

type PaymentMethod = "full" | "installments" | "transfer";

interface CheckoutPlan {
  id: string;
  plan: string;
  price: string;
  priceValue: number;
}

interface CheckoutDialogProps {
  plan: CheckoutPlan;
  ctaLabel: string;
}

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

export function CheckoutDialog({ plan, ctaLabel }: CheckoutDialogProps) {
  const router = useRouter();
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"info" | "payment">("info");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("full");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    business: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  const discountedPrice = plan.priceValue * (1 - TRANSFER_DISCOUNT);
  const installmentPrice = plan.priceValue / 3;

  const resetState = () => {
    setStep("info");
    setPaymentMethod("full");
    setSubmitError(null);
    setLoading(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    // No permitimos cerrar el diálogo mientras se está confirmando el pedido.
    if (!nextOpen && loading) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      resetState();
    }
  };

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

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, phone: true, business: true });
    if (Object.keys(validationErrors).length > 0) return;
    trackPixel("InitiateCheckout", {
      content_name: plan.plan,
      content_ids: [plan.id],
      currency: "ARS",
      value: plan.priceValue,
    });
    setStep("payment");
  };

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
        // Reintentamos una vez ante errores transitorios del servidor.
        setAttempts((n) => n + 1);
        await new Promise((resolve) => setTimeout(resolve, 800));
        return notifyOrder();
      }
    } catch (err) {
      console.error("[v0] No se pudo notificar el pedido:", err);
      // No bloqueamos el flujo del cliente por un error de notificación interna
      // (por ejemplo si Telegram está caído): el pedido igual se confirma y
      // el cliente puede seguir a pagar. Queda registrado en la consola para
      // hacer seguimiento manual si hiciera falta.
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleConfirm = async () => {
    if (loading) return;

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setSubmitError(
        "No tenés conexión a internet en este momento. Revisá tu conexión e intentá de nuevo."
      );
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setAttempts(0);

    await notifyOrder();

    const finalAmount = Math.round(
      paymentMethod === "transfer" ? discountedPrice : plan.priceValue
    );

    const params = new URLSearchParams({
      plan: plan.plan,
      planId: plan.id,
      method: paymentMethod,
      amount: String(finalAmount),
      name: form.name.trim(),
      email: form.email.trim(),
    });

    let paymentWindow: Window | null = null;

    if (paymentMethod !== "transfer") {
      const mpLink = MP_LINKS[plan.id];
      if (mpLink) {
        paymentWindow = window.open(mpLink, "_blank", "noopener,noreferrer");
        if (!paymentWindow) {
          // El navegador bloqueó el popup: avisamos para que el cliente
          // pueda abrir el link manualmente desde la página de gracias.
          console.error("[v0] El navegador bloqueó la ventana de Mercado Pago.");
        }
      }
    }

    trackPixel("Purchase", {
      content_name: plan.plan,
      content_ids: [plan.id],
      currency: "ARS",
      value: finalAmount,
    });

    setLoading(false);
    setOpen(false);
    resetState();
    router.push(`/gracias?${params.toString()}`);
  };

  const fieldError = (field: keyof FormState) =>
    touched[field] ? errors[field] : undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            size="large"
            className="shadow-md shadow-brand/70 w-full justify-center sm:w-auto"
          />
        }
      >
        {ctaLabel}
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-1.5rem)] sm:max-w-md max-h-[90dvh] overflow-y-auto p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {step === "info" ? (
          <>
            <DialogHeader>
              <DialogTitle className="heading text-xl text-text">
                {plan.plan}
              </DialogTitle>
              <DialogDescription>
                Contanos tus datos para reservar tu proyecto.{" "}
                <span className="font-semibold text-text/80">
                  {plan.price}
                </span>
              </DialogDescription>
            </DialogHeader>

            <form
              id={formId}
              onSubmit={handleContinue}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-1.5">
                <Label htmlFor="checkout-name">Nombre y apellido</Label>
                <Input
                  id="checkout-name"
                  required
                  autoComplete="name"
                  aria-invalid={Boolean(fieldError("name"))}
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                />
                {fieldError("name") && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {fieldError("name")}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="checkout-email">Email</Label>
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
                />
                {fieldError("email") && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {fieldError("email")}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="checkout-phone">WhatsApp</Label>
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
                />
                {fieldError("phone") ? (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {fieldError("phone")}
                  </p>
                ) : (
                  <p className="text-xs text-text/50">
                    *Con código de área
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="checkout-business">
                  Nombre de tu negocio o instagram{" "}
                  <span className="text-text/40 normal-case">(opcional)</span>
                </Label>
                <Input
                  id="checkout-business"
                  autoComplete="organization"
                  value={form.business}
                  onChange={(e) => updateField("business", e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full justify-center">
                Continuar
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-text/50">
                <ShieldCheck className="size-3.5 shrink-0" />
                Tus datos se usan solo para coordinar tu proyecto.
              </p>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="heading text-xl text-text">
                Elegí cómo pagar
              </DialogTitle>
              <DialogDescription>
                Plan {plan.plan} · {plan.price}
              </DialogDescription>
            </DialogHeader>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod)
              }
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-start gap-3 rounded-xl border border-black/10 p-3.5 sm:p-3 cursor-pointer transition-colors active:bg-brand/5",
                  paymentMethod === "full" && "border-brand bg-brand/5"
                )}
              >
                <RadioGroupItem value="full" className="mt-0.5 size-5 sm:size-4" />
                <CreditCard className="size-4 text-brand shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text">1 pago</p>
                  <p className="text-xs text-text/60 break-words">
                    Tarjeta o Mercado Pago · {formatCurrency(plan.priceValue)}
                  </p>
                </div>
              </label>

              <label
                className={cn(
                  "flex items-start gap-3 rounded-xl border border-black/10 p-3.5 sm:p-3 cursor-pointer transition-colors active:bg-brand/5",
                  paymentMethod === "installments" && "border-brand bg-brand/5"
                )}
              >
                <RadioGroupItem
                  value="installments"
                  className="mt-0.5 size-5 sm:size-4"
                />
                <Layers className="size-4 text-brand shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text">
                    3 cuotas sin interés
                  </p>
                  <p className="text-xs text-text/60 break-words">
                    Con tarjeta · {formatCurrency(installmentPrice)} por cuota
                  </p>
                </div>
              </label>

              <label
                className={cn(
                  "flex items-start gap-3 rounded-xl border border-black/10 p-3.5 sm:p-3 cursor-pointer transition-colors active:bg-brand/5",
                  paymentMethod === "transfer" && "border-brand bg-brand/5"
                )}
              >
                <RadioGroupItem
                  value="transfer"
                  className="mt-0.5 size-5 sm:size-4"
                />
                <Landmark className="size-4 text-brand shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text">
                    Transferencia bancaria{" "}
                    <span className="text-brand">15% OFF</span>
                  </p>
                  <p className="text-xs text-text/60 break-words">
                    Pagás {formatCurrency(discountedPrice)}
                  </p>
                </div>
              </label>
            </RadioGroup>

            {submitError && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-2 rounded-xl bg-destructive/5 p-3 text-xs text-destructive"
              >
                <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{submitError}</p>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setStep("info")}
                disabled={loading}
                className="flex items-center justify-center gap-1 py-2.5 text-sm font-medium text-text/60 hover:text-text sm:justify-start sm:py-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="size-4" />
                Volver
              </button>

              <Button
                onClick={handleConfirm}
                disabled={loading}
                aria-busy={loading}
                className="w-full justify-center sm:flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span className="sr-only">Procesando tu pedido…</span>
                  </>
                ) : submitError ? (
                  "Reintentar"
                ) : paymentMethod === "transfer" ? (
                  "Ver datos para transferir"
                ) : (
                  "Ir a Mercado Pago"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
