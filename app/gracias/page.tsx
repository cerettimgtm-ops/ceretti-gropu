import type { Metadata } from "next";
import { GraciasContent } from "@/components/gracias/gracias-content";

// Página transaccional: no debe indexarse ni aparecer en resultados de
// búsqueda, ya que muestra datos del pedido en la URL.
export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false, follow: false },
};

interface GraciasPageProps {
  searchParams: Promise<{
    plan?: string;
    planId?: string;
    method?: string;
    amount?: string;
    name?: string;
  }>;
}

export default async function GraciasPage({ searchParams }: GraciasPageProps) {
  const params = await searchParams;

  return (
    <GraciasContent
      plan={params.plan ?? "Tu plan"}
      planId={params.planId ?? ""}
      method={params.method ?? "full"}
      amount={params.amount ?? "0"}
      name={params.name ?? ""}
    />
  );
}
