import type { Metadata } from "next";
import { CheckoutContent } from "@/components/checkout/checkout-content";

// Página transaccional: no debe indexarse.
export const metadata: Metadata = {
  title: "Finalizar Compra",
  robots: { index: false, follow: false },
};

interface CheckoutPageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;

  return <CheckoutContent planId={params.plan ?? ""} />;
}
