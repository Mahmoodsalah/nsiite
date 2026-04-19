import { useEffect } from "react";
import { usePageContent, getVal } from "@/hooks/use-content";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default function AnalyticsLoader() {
  const { data: globalContent } = usePageContent("global");
  const gaId: string = getVal(globalContent, "analytics", "gaMeasurementId", "").trim();
  const enabled: boolean = String(getVal(globalContent, "analytics", "enabled", "true")).toLowerCase() !== "false";

  useEffect(() => {
    if (!enabled || !gaId) return;
    if (document.getElementById("ga-loader-script")) return;

    const script = document.createElement("script");
    script.id = "ga-loader-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId);
  }, [gaId, enabled]);

  return null;
}
