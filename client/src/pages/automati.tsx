import { useState, useEffect, useRef, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Sparkles,
  ShieldCheck,
  Workflow,
  CheckCircle2,
  ArrowRight,
  Zap,
  Brain,
  HandshakeIcon,
  Users,
  Settings2,
} from "lucide-react";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";
import { usePageContent, getVal } from "@/hooks/use-content";
import NetworkBg from "@/components/network-bg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import patternBg from "@assets/pattern_white_1771718036073.png";
import automatiLogo from "@assets/automati_logo_nobg.png";

const iconMap: Record<string, any> = {
  Bot, Sparkles, ShieldCheck, Workflow, Zap, Brain, HandshakeIcon, Users, Settings2,
};

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.round(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

export default function Automati() {
  const { data: content } = usePageContent("automati");

  const heroLogo = getVal(content, "hero", "logoImage", "");
  const heroTitle = getVal(content, "hero", "title", "Your work, powered by");
  const heroHighlight = getVal(content, "hero", "titleHighlight", "intelligence.");
  const heroSubtitle = getVal(content, "hero", "subtitle", "");
  const heroCtaPrimary = getVal(content, "hero", "ctaPrimary", "Get Started");
  const heroCtaSecondary = getVal(content, "hero", "ctaSecondary", "See How It Works");

  const howBadge = getVal(content, "howItWorks", "badge", "How It Works");
  const howTitle = getVal(content, "howItWorks", "title", "");
  const howDesc = getVal(content, "howItWorks", "description", "");
  const howSteps: any[] = getVal(content, "howItWorks", "steps", []);

  const whoBadge = getVal(content, "whoFor", "badge", "Who It's For");
  const whoTitle = getVal(content, "whoFor", "title", "");
  const whoDesc1 = getVal(content, "whoFor", "description1", "");
  const whoDesc2 = getVal(content, "whoFor", "description2", "");
  const audiences: any[] = getVal(content, "whoFor", "audiences", []);

  const privTitle = getVal(content, "privacy", "title", "");
  const privDesc1 = getVal(content, "privacy", "description1", "");
  const privDesc2 = getVal(content, "privacy", "description2", "");
  const privItems: any[] = getVal(content, "privacy", "items", []);

  const clientCountTarget = parseInt(getVal(content, "valueStrip", "clientCount", "23"), 10) || 23;
  const clientLabel = getVal(content, "valueStrip", "clientLabel", "Happy Clients");
  const stats: any[] = getVal(content, "valueStrip", "stats", []);
  const { count: clientCount, ref: clientRef } = useCountUp(clientCountTarget);

  const pricingBadge = getVal(content, "pricing", "badge", "Pricing");
  const pricingTitle = getVal(content, "pricing", "title", "");
  const pricingDesc = getVal(content, "pricing", "description", "");
  const plans: any[] = getVal(content, "pricing", "plans", []);

  const closingTitle = getVal(content, "closingCta", "title", "");
  const closingDesc = getVal(content, "closingCta", "description", "");
  const closingCta = getVal(content, "closingCta", "cta", "");
  const closingUrl = getVal(content, "closingCta", "ctaUrl", "#");

  const faqBadge = getVal(content, "faq", "badge", "FAQ");
  const faqTitle = getVal(content, "faq", "title", "Questions people often ask");
  const faqDesc = getVal(content, "faq", "description", "");
  const faqItems: any[] = getVal(content, "faq", "items", []);

  const seoTitle = getVal(content, "seo", "title", "Automati — Custom AI Agent Systems | Mahmood Salah");
  const seoDescription = getVal(content, "seo", "description", "");
  const seoKeywords = getVal(content, "seo", "keywords", "");
  const serviceName = getVal(content, "seo", "serviceName", "Automati");
  const serviceProvider = getVal(content, "seo", "serviceProvider", "Mahmood Salah");
  const canonicalUrl = getVal(content, "seo", "canonicalUrl", "");

  const logoSrc = heroLogo && heroLogo.startsWith("/attached_assets/") ? automatiLogo : (heroLogo || automatiLogo);

  const structuredData = useMemo(() => {
    const graph: any[] = [];
    if (serviceName) {
      graph.push({
        "@type": "Service",
        "@id": (canonicalUrl || "") + "#service",
        name: serviceName,
        serviceType: "Custom AI Agent Development",
        description: seoDescription,
        provider: { "@type": "Person", name: serviceProvider, url: canonicalUrl?.replace(/\/automati$/, "") || undefined },
        areaServed: "Worldwide",
        offers: plans.map((p: any) => ({
          "@type": "Offer",
          name: p.label,
          description: p.description,
          price: typeof p.price === "string" ? p.price.replace(/[^0-9.]/g, "") || undefined : undefined,
          priceCurrency: "USD",
          url: p.ctaUrl,
        })),
      });
    }
    if (Array.isArray(faqItems) && faqItems.length > 0) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: faqItems.map((q: any) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      });
    }
    return { "@context": "https://schema.org", "@graph": graph };
  }, [serviceName, serviceProvider, seoDescription, canonicalUrl, plans, faqItems]);

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

    const created: HTMLElement[] = [];
    const desc = setMeta('meta[name="description"]', "name", "description", seoDescription);
    const kw = setMeta('meta[name="keywords"]', "name", "keywords", seoKeywords);
    const ogT = setMeta('meta[property="og:title"]', "property", "og:title", seoTitle);
    const ogD = setMeta('meta[property="og:description"]', "property", "og:description", seoDescription);
    const ogType = setMeta('meta[property="og:type"]', "property", "og:type", "website");
    const ogUrl = setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    const twC = setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    const twT = setMeta('meta[name="twitter:title"]', "name", "twitter:title", seoTitle);
    const twD = setMeta('meta[name="twitter:description"]', "name", "twitter:description", seoDescription);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
        created.push(canonical);
      }
      canonical.href = canonicalUrl;
    }

    let ld = document.getElementById("automati-jsonld") as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement("script");
      ld.id = "automati-jsonld";
      ld.type = "application/ld+json";
      document.head.appendChild(ld);
    }
    ld.text = JSON.stringify(structuredData);

    return () => {
      document.title = prevTitle;
      ld?.remove();
      created.forEach((el) => el.remove());
    };
  }, [seoTitle, seoDescription, seoKeywords, canonicalUrl, structuredData]);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }} />
        <NetworkBg />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <AnimateIn>
            <div className="flex justify-center mb-6" data-testid="badge-automati-tag">
              <img src={logoSrc} alt="Automati" className="h-40 w-auto dark:invert" />
            </div>
          </AnimateIn>
          <AnimateIn delay={0.05}>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6" data-testid="text-automati-title">
              {heroTitle}{" "}
              <span className="text-primary">{heroHighlight}</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10" data-testid="text-automati-subtitle">
              {heroSubtitle}
            </p>
          </AnimateIn>
          <AnimateIn delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-xl px-8" data-testid="button-automati-start" asChild>
                <a href="#pricing">
                  {heroCtaPrimary}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-8 glass-card-hover" data-testid="button-automati-how" asChild>
                <a href="#how-it-works">{heroCtaSecondary}</a>
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <AnimateIn>
          <div className="text-center mb-14">
            <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
              {howBadge}
            </Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3" data-testid="text-how-title">
              {howTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {howDesc}
            </p>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howSteps.map((s: any, i: number) => {
            const Icon = iconMap[s.icon] || Bot;
            return (
              <AnimateIn key={s.step || i} delay={i * 0.08}>
                <div className="glass-card-hover rounded-2xl p-7 h-full relative" data-testid={`card-step-${i}`}>
                  <div className="absolute top-6 right-6 font-heading font-bold text-3xl text-primary/20">{s.step}</div>
                  <div className="w-12 h-12 rounded-xl glass-badge flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimateIn>
            <div>
              <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
                {whoBadge}
              </Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-5" data-testid="text-who-title">
                {whoTitle}
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                {whoDesc1}
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                {whoDesc2}
              </p>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {audiences.map((p: any) => {
                const Icon = iconMap[p.icon] || Users;
                return (
                  <div key={p.label} className="glass-card-hover rounded-xl p-5 flex flex-col items-center text-center gap-2" data-testid={`card-audience-${(p.label || '').toLowerCase().replace(/[\s&]+/g,'-')}`}>
                    <Icon className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium text-foreground">{p.label}</span>
                  </div>
                );
              })}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* PRIVACY & SECURITY */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <AnimateIn>
          <div className="glass-card rounded-3xl p-10 md:p-14 relative overflow-hidden" data-testid="section-privacy">
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(circle at 0% 50%, rgba(210,140,80,0.10), transparent 60%)',
            }} />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl glass-badge flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
                    {privTitle}
                  </h2>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed mb-4">
                  {privDesc1}
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {privDesc2}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {privItems.map((item: any) => {
                  const Icon = iconMap[item.icon] || ShieldCheck;
                  return (
                    <div key={item.title} className="flex items-start gap-4 glass-card-hover rounded-xl p-4" data-testid={`card-privacy-${(item.title || '').toLowerCase().replace(/\s/g,'-')}`}>
                      <div className="w-9 h-9 rounded-lg glass-badge flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-sm text-foreground mb-1">{item.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* VALUE STRIP */}
      <section className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        <AnimateIn>
          <div className="glass-card rounded-2xl px-8 py-8 grid grid-cols-2 md:grid-cols-5 gap-6 text-center" data-testid="section-values">
            <div ref={clientRef} data-testid="stat-clients">
              <p className="font-heading font-bold text-3xl text-primary mb-1">{clientCount}+</p>
              <p className="text-muted-foreground text-sm">{clientLabel}</p>
            </div>
            {stats.map((v: any) => (
              <div key={v.label}>
                <p className="font-heading font-bold text-3xl text-primary mb-1">{v.value}</p>
                <p className="text-muted-foreground text-sm">{v.label}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <AnimateIn>
          <div className="text-center mb-12">
            <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
              {pricingBadge}
            </Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3" data-testid="text-pricing-title">
              {pricingTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {pricingDesc}
            </p>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan: any, i: number) => {
            const isPopular = String(plan.popular) === "true";
            const features: string[] = Array.isArray(plan.features) ? plan.features : [];
            return (
              <AnimateIn key={plan.label || i} delay={0.05 + i * 0.05}>
                <div className="flex flex-col h-full">
                  <div className={`flex justify-center mb-3 ${isPopular ? "" : "invisible"}`}>
                    <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${isPopular ? "bg-primary text-primary-foreground" : ""}`}>
                      Most Popular
                    </Badge>
                  </div>
                  <div className={`glass-card-hover rounded-2xl p-7 flex-1 flex flex-col ${isPopular ? "ring-2 ring-primary/40" : ""}`} data-testid={`card-plan-${i}`}>
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-foreground mb-4">{plan.label}</p>
                    {plan.startingFrom ? (
                      <p className="text-xs text-muted-foreground mb-1">{plan.startingFrom}</p>
                    ) : null}
                    <div className="flex items-baseline gap-1 mb-5">
                      <span className="font-heading font-bold text-4xl text-primary">{plan.price}</span>
                      {plan.priceUnit ? (
                        <span className="text-sm text-muted-foreground">{plan.priceUnit}</span>
                      ) : null}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {plan.description}
                    </p>
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button variant={isPopular ? "default" : "outline"} className={`rounded-xl ${isPopular ? "" : "glass-card-hover"}`} data-testid={`button-plan-${i}`} asChild>
                      <a href={plan.ctaUrl || "#"} target="_blank" rel="noopener noreferrer">{plan.cta || "Get Started"}</a>
                    </Button>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section id="faq" className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <AnimateIn>
            <div className="text-center mb-10">
              <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
                {faqBadge}
              </Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3" data-testid="text-faq-title">
                {faqTitle}
              </h2>
              {faqDesc && (
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {faqDesc}
                </p>
              )}
            </div>
          </AnimateIn>
          <AnimateIn delay={0.05}>
            <div className="glass-card rounded-2xl p-4 md:p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((q: any, i: number) => (
                  <AccordionItem key={i} value={`faq-${i}`} data-testid={`accordion-faq-${i}`} className="border-b border-border/40 last:border-b-0">
                    <AccordionTrigger className="text-left font-heading font-semibold text-base md:text-lg text-foreground hover:no-underline py-5">
                      {q.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5">
                      {q.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimateIn>
        </section>
      )}

      {/* CLOSING CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <AnimateIn>
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden" data-testid="section-automati-cta">
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(210,140,80,0.18), transparent 70%)',
            }} />
            <div className="relative">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
                {closingTitle}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                {closingDesc}
              </p>
              <div className="flex justify-center">
                <Button size="lg" className="rounded-xl px-8" data-testid="button-automati-cta" asChild>
                  <a href={closingUrl}>
                    {closingCta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </AnimateIn>
      </section>
    </div>
  );
}
