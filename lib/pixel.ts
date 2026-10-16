// Helper para disparar eventos estándar de Meta Pixel de forma segura.
// No hace nada si el pixel no está cargado (por ejemplo en desarrollo).

type FbqParams = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackPixel(event: string, params?: FbqParams) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
