"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "../button";
import {
  BRAND_NAME,
  SITE_URL,
  TRANSFER_DISCOUNT,
  TRANSFER_INFO,
  WHATSAPP_LINK,
} from "@/lib/constant";

const PAYMENT_LABELS: Record<string, string> = {
  full: "1 pago",
  installments: "3 cuotas sin interés",
  transfer: "Transferencia bancaria",
};

interface ReceiptPdfButtonProps {
  plan: string;
  method: string;
  amount: number;
  name: string;
  orderId: string;
  deliveryEstimate?: string;
  isTransfer?: boolean;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

const displayWhatsapp = WHATSAPP_LINK.replace(/^https?:\/\//, "");
const displaySite = SITE_URL.replace(/^https?:\/\//, "");

export function ReceiptPdfButton({
  plan,
  method,
  amount,
  name,
  orderId,
  deliveryEstimate,
  isTransfer,
}: ReceiptPdfButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      // --- Palette (matches app theme) ---
      const brand: [number, number, number] = [23, 105, 170];
      const brandStrong: [number, number, number] = [16, 77, 130];
      const ink: [number, number, number] = [16, 43, 70];
      const text: [number, number, number] = [23, 43, 62];
      const muted: [number, number, number] = [116, 135, 154];
      const softLine: [number, number, number] = [223, 231, 238];
      const softFill: [number, number, number] = [246, 250, 253];
      const white: [number, number, number] = [255, 255, 255];

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 48;
      const contentWidth = pageWidth - margin * 2;

      const setFill = (c: [number, number, number]) => doc.setFillColor(...c);
      const setText = (c: [number, number, number]) => doc.setTextColor(...c);
      const setDraw = (c: [number, number, number]) => doc.setDrawColor(...c);

      // ============ HEADER BAND ============
      setFill(ink);
      doc.rect(0, 0, pageWidth, 118, "F");
      setFill(brand);
      doc.rect(0, 118, pageWidth, 4, "F");

      // Monogram badge
      const badgeCx = margin + 22;
      const badgeCy = 52;
      setFill(brand);
      doc.circle(badgeCx, badgeCy, 22, "F");
      setText(white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("CG", badgeCx, badgeCy + 5.5, { align: "center" });

      // Brand name + tagline
      setText(white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(BRAND_NAME, badgeCx + 34, badgeCy - 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(230, 239, 246);
      doc.text("Growth & Marketing", badgeCx + 34, badgeCy + 13);

      // Right-aligned doc meta
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setText(brand);
      doc.text("COMPROBANTE DE PEDIDO", pageWidth - margin, 40, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(206, 222, 236);
      doc.text(`N.° ${orderId}`, pageWidth - margin, 58, { align: "right" });
      doc.text(
        new Date().toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        pageWidth - margin,
        73,
        { align: "right" }
      );

      let y = 158;

      // ============ SUMMARY STRIP (3 cols) ============
      const stripHeight = 74;
      setFill(softFill);
      doc.roundedRect(margin, y, contentWidth, stripHeight, 10, 10, "F");

      const colW = contentWidth / 3;
      const colPadTop = y + 22;

      const summaryCols: [string, string][] = [
        ["Cliente", name || "-"],
        ["Plan contratado", plan],
        ["Total del pedido", formatCurrency(amount)],
      ];

      summaryCols.forEach(([label, value], i) => {
        const cx = margin + colW * i + 24;
        setText(muted);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.text(label.toUpperCase(), cx, colPadTop);

        setText(i === 2 ? brandStrong : text);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        const clipped =
          value.length > 26 ? `${value.slice(0, 24)}…` : value;
        doc.text(clipped, cx, colPadTop + 20);

        if (i > 0) {
          setDraw(softLine);
          doc.setLineWidth(0.75);
          doc.line(margin + colW * i, y + 14, margin + colW * i, y + stripHeight - 14);
        }
      });

      y += stripHeight + 28;

      // ============ ORDER DETAIL TABLE ============
      setText(ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Detalle del pedido", margin, y);
      y += 8;
      setDraw(softLine);
      doc.setLineWidth(1);
      doc.line(margin, y, pageWidth - margin, y);
      y += 22;

      const rows: [string, string][] = [
        ["Plan", plan],
        ["Medio de pago", PAYMENT_LABELS[method] ?? "1 pago"],
      ];

      if (isTransfer) {
        rows.push([
          "Descuento aplicado",
          `${TRANSFER_DISCOUNT * 100}% por transferencia`,
        ]);
      }

      rows.push(["N.° de pedido", orderId]);

      if (deliveryEstimate) {
        rows.push(["Entrega estimada", deliveryEstimate]);
      }

      doc.setFontSize(10.5);
      rows.forEach(([label, value], i) => {
        if (i % 2 === 0) {
          setFill(softFill);
          doc.rect(margin, y - 13, contentWidth, 23, "F");
        }
        setText(muted);
        doc.setFont("helvetica", "normal");
        doc.text(label, margin + 14, y);
        setText(text);
        doc.setFont("helvetica", "bold");
        doc.text(value, pageWidth - margin - 14, y, { align: "right" });
        y += 23;
      });

      y += 12;

      // ============ TOTAL BANNER ============
      const bannerH = 44;
      setFill(brand);
      doc.roundedRect(margin, y, contentWidth, bannerH, 10, 10, "F");
      setText(white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("TOTAL PAGADO", margin + 20, y + bannerH / 2 + 4);
      doc.setFontSize(19);
      doc.text(formatCurrency(amount), pageWidth - margin - 20, y + bannerH / 2 + 5, {
        align: "right",
      });

      y += bannerH + 22;

      // ============ BANK DETAILS (transfer only) ============
      if (
        isTransfer &&
        (TRANSFER_INFO.alias || TRANSFER_INFO.cbu || TRANSFER_INFO.banco)
      ) {
        setText(ink);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("Datos bancarios utilizados", margin, y);
        y += 8;
        setDraw(softLine);
        doc.line(margin, y, pageWidth - margin, y);
        y += 20;

        const bankRows: [string, string | undefined][] = [
          ["Alias", TRANSFER_INFO.alias],
          ["CBU", TRANSFER_INFO.cbu],
          ["Banco", TRANSFER_INFO.banco],
          ["Titular", TRANSFER_INFO.titular],
        ];

        const bankPairs = bankRows.filter(([, v]) => Boolean(v)) as [
          string,
          string
        ][];
        const halfW = contentWidth / 2;
        const bankRowH = 34;

        bankPairs.forEach(([label, value], i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const cx = margin + col * halfW;
          const cy = y + row * bankRowH;

          setText(muted);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.text(label.toUpperCase(), cx, cy);
          setText(text);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text(value, cx, cy + 15);
        });

        y += Math.ceil(bankPairs.length / 2) * bankRowH + 18;
      }

      // ============ NEXT STEPS (compact timeline) ============
      setText(ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Próximos pasos", margin, y);
      y += 8;
      setDraw(softLine);
      doc.line(margin, y, pageWidth - margin, y);
      y += 20;

      const steps = [
        "Registramos tu pedido y tus datos de contacto.",
        "Nuestro equipo te escribe por WhatsApp para coordinar los detalles.",
        "Arrancamos el desarrollo de tu proyecto según lo conversado.",
      ];

      doc.setFontSize(10);
      steps.forEach((step, i) => {
        setFill(brand);
        doc.circle(margin + 6, y - 3, 8, "F");
        setText(white);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(String(i + 1), margin + 6, y, { align: "center" });

        setText(text);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(step, contentWidth - 34);
        doc.text(lines, margin + 24, y);
        y += 14 * lines.length + 5;
      });

      // ============ FOOTER ============
      const footerY = 792; // fixed near bottom, keeps everything on one A4 page
      setDraw(softLine);
      doc.setLineWidth(1);
      doc.line(margin, footerY - 34, pageWidth - margin, footerY - 34);

      setText(ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(BRAND_NAME, margin, footerY - 16);

      setText(muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        `${displayWhatsapp}  ·  ${displaySite}`,
        margin,
        footerY - 3
      );

      doc.setFontSize(8.5);
      setText(muted);
      doc.text(
        "Este comprobante confirma la recepción de tu pedido y no reemplaza una factura fiscal.",
        pageWidth - margin,
        footerY - 16,
        { align: "right" }
      );
      doc.text("Página 1 de 1", pageWidth - margin, footerY - 3, {
        align: "right",
      });

      doc.save(`comprobante-${orderId}.pdf`);
    } catch (err) {
      console.error("[v0] No se pudo generar el PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      variant="secondary"
      className="w-full justify-center"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          <Download className="size-4" />
          Descargar Comprobante PDF
        </>
      )}
    </Button>
  );
}
