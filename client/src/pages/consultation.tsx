import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Bot,
  Eye,
  Mail,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import NetworkBg from "@/components/network-bg";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";
import { usePageContent, getVal } from "@/hooks/use-content";
import { useCountUp } from "@/hooks/use-count-up";
import patternBg from "@assets/pattern_white_1771718036073.png";

const iconMap: Record<string, any> = { Brain, Bot, Eye };

export default function Consultation() {
  const [emailCopied, setEmailCopied] = useState(false);
  const { data: content, isLoading } = usePageContent("consultation");

  const email = getVal(content, "hero", "email", "mahmood.salah@email.com");
  const heroTitle = getVal(content, "hero", "title", "Need a Consultation?");
  const heroSubtitle = getVal(content, "hero", "subtitle", "");
  const services = getVal(content, "services", "items", []);

  const statCount = parseInt(getVal(content, "stats", "count", "48"), 10) || 48;
  const statLabel = getVal(content, "stats", "label", "Consultations Delivered");
  const statDesc = getVal(content, "stats", "description", "");
  const { count, ref: countRef } = useCountUp(statCount);

  const seoTitle = getVal(content, "seo", "title", "AI Consultation | Mahmood Salah");
  const seoDescription = getVal(content, "seo", "description", "");
  const seoKeywords = getVal(content, "seo", "keywords", "");
  const serviceName = getVal(content, "seo", "serviceName", "AI Consultation Services");
  const serviceProvider = getVal(content, "seo", "serviceProvider", "Mahmood Salah");
  const canonicalUrl = getVal(content, "seo", "canonicalUrl", "");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const structuredData = useMemo(() => {
    const graph: any[] = [];
    if (serviceName) {
      graph.push({
        "@type": "Service",
        "@id": (canonicalUrl || "") + "#service",
        name: serviceName,
        serviceType: "AI Consulting",
        description: seoDescription,
        provider: {
          "@type": "Person",
          name: serviceProvider,
          url: canonicalUrl?.replace(/\/consultation$/, "") || undefined,
        },
        areaServed: "Worldwide",
        offers: (Array.isArray(services) ? services : []).map((s: any) => ({
          "@type": "Offer",
          name: s.title,
          description: s.description,
        })),
      });
    }
    if (statCount > 0) {
      graph.push({
        "@type": "AggregateRating",
        ratingValue: "5",
        reviewCount: String(statCount),
        itemReviewed: { "@type": "Service", name: serviceName },
      });
    }
    return { "@context": "https://schema.org", "@graph": graph };
  }, [serviceName, serviceProvider, seoDescription, canonicalUrl, services, statCount]);

  useEffect(() => {
    if (!seoTitle && !seoDescription) return;
    const prevTitle = document.title;
    if (seoTitle) document.title = seoTitle;

    const setMeta = (selector: string, attr: string, name: string, value: string) => {
      if (!value) return null;
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
      return el;
    };

    setMeta('meta[name="description"]', "name", "description", seoDescription);
    setMeta('meta[name="keywords"]', "name", "keywords", seoKeywords);
    setMeta('meta[property="og:title"]', "property", "og:title", seoTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", seoDescription);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", seoTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", seoDescription);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonical;
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    let ld = document.getElementById("consultation-jsonld") as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement("script");
      ld.id = "consultation-jsonld";
      ld.type = "application/ld+json";
      document.head.appendChild(ld);
    }
    ld.text = JSON.stringify(structuredData);

    return () => {
      document.title = prevTitle;
      ld?.remove();
      if (createdCanonical) canonical?.remove();
    };
  }, [seoTitle, seoDescription, seoKeywords, canonicalUrl, structuredData]);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }} />
        <NetworkBg />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32 ml-[166.4px] mr-[166.4px] mt-[0px] mb-[0px] pt-[120px] pb-[120px]">
          <h1
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6 animate-fade-in-up"
            data-testid="text-consultation-title"
          >
            {heroTitle}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-400">
            <Button asChild className="rounded-xl">
              <a href={`mailto:${email}`} data-testid="button-send-email">
                <Mail className="w-4 h-4 mr-2" />
                Send me an email
              </a>
            </Button>
            <Button variant="outline" onClick={handleCopyEmail} className="rounded-xl glass-card" data-testid="button-copy-email">
              {emailCopied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy email
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* STATS COUNTER */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 md:-mt-12">
        <AnimateIn>
          <div
            ref={countRef}
            className="glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            data-testid="section-consultation-stats"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 50% 0%, rgba(210,140,80,0.15), transparent 70%)",
              }}
            />
            <div className="relative">
              <div
                className="font-heading font-bold text-6xl sm:text-7xl md:text-8xl text-primary leading-none mb-3 tabular-nums"
                data-testid="text-consultation-count"
              >
                {count}
                <span className="text-primary/70">+</span>
              </div>
              <p className="font-heading font-semibold text-lg md:text-xl text-foreground mb-3" data-testid="text-consultation-stat-label">
                {statLabel}
              </p>
              {statDesc && (
                <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed" data-testid="text-consultation-stat-description">
                  {statDesc}
                </p>
              )}
            </div>
          </div>
        </AnimateIn>
      </section>

      <section className="pt-12 pb-20" data-testid="section-consultation-services">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service: any, i: number) => {
                const ServiceIcon = iconMap[service.icon] || Brain;
                return (
                  <AnimateIn key={i} delay={i * 0.1}>
                    <div className="glass-card-hover rounded-xl p-6 text-center h-full">
                      <div className="w-14 h-14 rounded-2xl glass-badge flex items-center justify-center mx-auto mb-4">
                        <ServiceIcon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {service.description}
                      </p>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
