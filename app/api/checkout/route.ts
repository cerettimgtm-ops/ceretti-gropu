import { NextResponse } from "next/server";
import { pricing, customPlan, TRANSFER_DISCOUNT, BRAND_NAME } from "@/lib/constant";

const PAYMENT_LABELS: Record<string, string> = {
  full: "1 pago",
  installments: "3 cuotas sin interés",
  transfer: "Transferencia bancaria (15% OFF)",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, name, email, phone, business, paymentMethod } = body ?? {};

    if (
      typeof planId !== "string" ||
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof paymentMethod !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    const plan = [...pricing, customPlan].find((item) => item.id === planId);

    if (!plan || !("priceValue" in plan) || typeof plan.priceValue !== "number") {
      return NextResponse.json({ error: "Plan inválido." }, { status: 400 });
    }

    if (!PAYMENT_LABELS[paymentMethod]) {
      return NextResponse.json(
        { error: "Medio de pago inválido." },
        { status: 400 }
      );
    }

    const finalAmount =
      paymentMethod === "transfer"
        ? plan.priceValue * (1 - TRANSFER_DISCOUNT)
        : plan.priceValue;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const lines = [
        `🆕 *Nuevo pedido - ${BRAND_NAME}*`,
        ``,
        `*Plan:* ${plan.plan}`,
        `*Medio de pago:* ${PAYMENT_LABELS[paymentMethod]}`,
        `*Monto:* ${formatCurrency(finalAmount)}`,
        ``,
        `*Cliente:* ${name}`,
        `*Negocio:* ${business?.trim() ? business : "-"}`,
        `*Email:* ${email}`,
        `*WhatsApp:* ${phone}`,
      ];

      const text = lines.join("\n");

      try {
        const res = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "Markdown",
            }),
          }
        );

        if (!res.ok) {
          const errBody = await res.text();
          console.error("[v0] Error enviando mensaje a Telegram:", errBody);
        }
      } catch (err) {
        console.error("[v0] Error de red enviando a Telegram:", err);
      }
    } else {
      console.error("[v0] Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[v0] Error procesando el checkout:", error);
    return NextResponse.json(
      { error: "No pudimos procesar el pedido." },
      { status: 500 }
    );
  }
}
