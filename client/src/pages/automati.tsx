import { useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Brain,
  Users,
  Settings2,
  ListChecks,
  Handshake,
  FileText,
  History,
  KeyRound,
  Lock,
  Clock,
  MessageSquare,
  CalendarClock,
  Radar,
  UserRound,
  HeartHandshake,
  Plus,
} from "lucide-react";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";
import { useCountUp } from "@/hooks/use-count-up";
import { usePageContent, getVal } from "@/hooks/use-content";
import NetworkBg from "@/components/network-bg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import patternBg from "@assets/pattern_white_1771718036073.webp";
import automatiLogo from "@assets/automati_logo_nobg.png";

const iconMap: Record<string, any> = {
  Bot, Sparkles, ShieldCheck, Brain, Users, Settings2, ListChecks, Handshake, FileText, History, KeyRound, Lock,
  MessageSquare, CalendarClock, Radar,
  CheckCircle: CheckCircle2, CheckCircle2,
};

function SectionHeader({ badge, title, description, testId }: { badge: string; title: string; description?: string; testId?: string }) {
  return (
    <div className="text-center mb-12 md:mb-14">
      <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
        {badge}
      </Badge>
      <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3" data-testid={testId}>
        {title}
      </h2>
      {description ? <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">{description}</p> : null}
    </div>
  );
}

export default function Automati() {
  const { data: content } = usePageContent("automati");

  const heroLogo = getVal(content, "hero", "logoImage", "");
  const heroEyebrow = getVal(content, "hero", "eyebrow", "");
  const heroTitle = getVal(content, "hero", "title", "Hire your first");
  const heroHighlight = getVal(content, "hero", "titleHighlight", "AI Employee.");
  const heroSubtitle = getVal(content, "hero", "subtitle", "");
  const heroCtaPrimary = getVal(content, "hero", "ctaPrimary", "Hire an AI Employee");
  const heroCtaSecondary = getVal(content, "hero", "ctaSecondary", "See what it can do");
  const toolsLabel = getVal(content, "hero", "toolsLabel", "");
  const tools: string[] = getVal(content, "hero", "tools", []);

  const partnerBadge = getVal(content, "partnership", "badge", "");
  const partnerTitle = getVal(content, "partnership", "title", "");
  const partnerDesc = getVal(content, "partnership", "description", "");
  const humanTitle = getVal(content, "partnership", "humanTitle", "Your people focus on");
  const humanItems: string[] = getVal(content, "partnership", "humanItems", []);
  const aiTitle = getVal(content, "partnership", "aiTitle", "Your AI Employee handles");
  const aiItems: string[] = getVal(content, "partnership", "aiItems", []);
  const partnerFootnote = getVal(content, "partnership", "footnote", "");

  const triggersBadge = getVal(content, "triggers", "badge", "");
  const triggersTitle = getVal(content, "triggers", "title", "");
  const triggersDesc = getVal(content, "triggers", "description", "");
  const triggers: any[] = getVal(content, "triggers", "items", []);

  const workBadge = getVal(content, "finishedWork", "badge", "Finished work, not chat");
  const workTitle = getVal(content, "finishedWork", "title", "");
  const workDesc = getVal(content, "finishedWork", "description", "");
  const askLabel = getVal(content, "finishedWork", "askLabel", "You asked");
  const workItems: any[] = getVal(content, "finishedWork", "items", []);

  const rolesBadge = getVal(content, "roles", "badge", "Any team");
  const rolesTitle = getVal(content, "roles", "title", "");
  const rolesDesc = getVal(content, "roles", "description", "");
  const roles: any[] = getVal(content, "roles", "items", []);

  const trustBadge = getVal(content, "trust", "badge", "");
  const trustTitle = getVal(content, "trust", "title", "");
  const trustDesc1 = getVal(content, "trust", "description1", "");
  const trustDesc2 = getVal(content, "trust", "description2", "");
  const trustItems: any[] = getVal(content, "trust", "items", []);

  const howBadge = getVal(content, "howItWorks", "badge", "How it works");
  const howTitle = getVal(content, "howItWorks", "title", "");
  const howDesc = getVal(content, "howItWorks", "description", "");
  const howSteps: any[] = getVal(content, "howItWorks", "steps", []);

  const clientCountTarget = parseInt(getVal(content, "valueStrip", "clientCount", "23"), 10) || 23;
  const clientLabel = getVal(content, "valueStrip", "clientLabel", "Happy Clients");
  const stats: any[] = getVal(content, "valueStrip", "stats", []);
  const { count: clientCount, ref: clientRef } = useCountUp(clientCountTarget);

  const pricingBadge = getVal(content, "pricing", "badge", "Pricing");
  const pricingTitle = getVal(content, "pricing", "title", "");
  const pricingDesc = getVal(content, "pricing", "description", "");
  const setupNote = getVal(content, "pricing", "setupNote", "");
  const plans: any[] = getVal(content, "pricing", "plans", []);

  const closingTitle = getVal(content, "closingCta", "title", "");
  const closingDesc = getVal(content, "closingCta", "description", "");
  const closingCta = getVal(content, "closingCta", "cta", "");
  const closingUrl = getVal(content, "closingCta", "ctaUrl", "#");

  const faqBadge = getVal(content, "faq", "badge", "FAQ");
  const faqTitle = getVal(content, "faq", "title", "Questions companies ask");
  const faqDesc = getVal(content, "faq", "description", "");
  const faqItems: any[] = getVal(content, "faq", "items", []);

  const seoTitle = getVal(content, "seo", "title", "Automati — AI Employees That Work Alongside Your Team");
  const seoDescription = getVal(content, "seo", "description", "");
  const seoKeywords = getVal(content, "seo", "keywords", "");
  const serviceName = getVal(content, "seo", "serviceName", "Automati");
  const serviceProvider = getVal(content, "seo", "serviceProvider", "Automati");
  const canonicalUrl = getVal(content, "seo", "canonicalUrl", "");

  const logoSrc = heroLogo && heroLogo.startsWith("/attached_assets/") ? automatiLogo : (heroLogo || automatiLogo);

  const structuredData = useMemo(() => {
    const graph: any[] = [];
    if (serviceName) {
      graph.push({
        "@type": "Service",
        "@id": (canonicalUrl || "") + "#service",
        name: serviceName,
        serviceType: "AI Employees for business teams",
        description: seoDescription,
        provider: { "@type": "Organization", name: serviceProvider, url: canonicalUrl || undefined },
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
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: "600px", backgroundRepeat: "repeat" }} />
        <NetworkBg />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <AnimateIn>
            <div className="flex justify-center mb-6" data-testid="badge-automati-tag">
              <img src={logoSrc} alt="Automati" className="h-24 md:h-32 w-auto dark:invert" decoding="async" />
            </div>
          </AnimateIn>
          {heroEyebrow ? (
            <AnimateIn delay={0.03}>
              <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-xs text-primary mb-6">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {heroEyebrow}
              </Badge>
            </AnimateIn>
          ) : null}
          <AnimateIn delay={0.05}>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] mb-6" data-testid="text-automati-title">
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
              <Button size="lg" className="rounded-full px-8" data-testid="button-automati-start" asChild>
                <a href="#pricing">
                  {heroCtaPrimary}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 glass-card-hover" data-testid="button-automati-how" asChild>
                <a href="#roles">{heroCtaSecondary}</a>
              </Button>
            </div>
          </AnimateIn>
          {tools.length > 0 ? (
            <AnimateIn delay={0.2}>
              <div className="mt-14" data-testid="section-automati-tools">
                {toolsLabel ? (
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">{toolsLabel}</p>
                ) : null}
                <ul className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                  {tools.map((t) => (
                    <li key={t} className="rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 text-xs font-medium text-foreground/70">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          ) : null}
        </div>
      </section>

      {/* PEOPLE + AI EMPLOYEE */}
      {partnerTitle && (
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20" data-testid="section-partnership">
          <AnimateIn>
            <SectionHeader badge={partnerBadge} title={partnerTitle} description={partnerDesc} testId="text-partnership-title" />
          </AnimateIn>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            <AnimateIn className="h-full">
              <div className="glass-card rounded-3xl p-7 md:p-9 h-full" data-testid="card-partnership-human">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-foreground/5 flex items-center justify-center">
                    <UserRound className="w-5 h-5 text-foreground/70" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground">{humanTitle}</h3>
                </div>
                <ul className="space-y-3">
                  {humanItems.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-foreground/85 leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-foreground/40 mt-0.5 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
            <div aria-hidden="true" className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full liquid-glass items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <AnimateIn delay={0.08} className="h-full">
              <div className="glass-card rounded-3xl p-7 md:p-9 h-full ring-1 ring-primary/25" data-testid="card-partnership-ai">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground">{aiTitle}</h3>
                </div>
                <ul className="space-y-3">
                  {aiItems.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-foreground/85 leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          </div>
          {partnerFootnote ? (
            <AnimateIn delay={0.1}>
              <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm md:text-base font-medium text-foreground/80" data-testid="text-partnership-footnote">
                <HeartHandshake className="w-5 h-5 text-primary shrink-0" />
                {partnerFootnote}
              </p>
            </AnimateIn>
          ) : null}
        </section>
      )}

      {/* FINISHED WORK */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20" data-testid="section-finished-work">
        <AnimateIn>
          <SectionHeader badge={workBadge} title={workTitle} description={workDesc} testId="text-work-title" />
        </AnimateIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {workItems.map((w: any, i: number) => {
            const pending = /approv/i.test(w.status || "");
            return (
              <AnimateIn key={w.title || i} delay={(i % 2) * 0.06} className="h-full">
                <article className="glass-card rounded-2xl p-6 h-full flex flex-col" data-testid={`card-work-${i}`}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="font-heading font-semibold text-base text-foreground">{w.title}</h3>
                    {w.status ? (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${
                          pending ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700"
                        }`}
                      >
                        {pending ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {w.status}
                      </span>
                    ) : null}
                  </div>
                  <div className="rounded-xl bg-muted/60 px-4 py-3 mb-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-1">{askLabel}</p>
                    <p className="text-sm font-medium text-foreground">“{w.ask}”</p>
                  </div>
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{w.result}</p>
                  </div>
                  {w.tools ? <p className="mt-5 pt-4 border-t border-border/50 text-xs text-muted-foreground">{w.tools}</p> : null}
                </article>
              </AnimateIn>
            );
          })}
        </div>
      </section>

      {/* HOW IT PICKS UP WORK */}
      {triggers.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20" data-testid="section-triggers">
          <AnimateIn>
            <SectionHeader badge={triggersBadge} title={triggersTitle} description={triggersDesc} testId="text-triggers-title" />
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {triggers.map((t: any, i: number) => {
              const Icon = iconMap[t.icon] || Bot;
              return (
                <AnimateIn key={t.title || i} delay={i * 0.06} className="h-full">
                  <div className="glass-card rounded-2xl p-6 h-full flex flex-col" data-testid={`card-trigger-${i}`}>
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{t.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">{t.desc}</p>
                    {t.example ? (
                      <p className="mt-auto rounded-xl bg-muted/60 px-4 py-3 text-sm text-foreground/80 italic">{t.example}</p>
                    ) : null}
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </section>
      )}

      {/* ROLES */}
      {roles.length > 0 && (
        <section id="roles" className="max-w-6xl mx-auto px-6 py-16 md:py-20 scroll-mt-24" data-testid="section-roles">
          <AnimateIn>
            <SectionHeader badge={rolesBadge} title={rolesTitle} description={rolesDesc} testId="text-roles-title" />
          </AnimateIn>
          <AnimateIn delay={0.05}>
            <Tabs defaultValue="role-0">
              <div className="flex justify-center mb-8">
                {/* Wraps into rows on phones so every team stays visible */}
                <TabsList className="liquid-glass h-auto rounded-3xl md:rounded-full p-1.5 gap-1 flex flex-wrap md:flex-nowrap" data-testid="tabs-roles">
                  {roles.map((r: any, i: number) => (
                    <TabsTrigger
                      key={r.title || i}
                      value={`role-${i}`}
                      className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                      data-testid={`tab-role-${i}`}
                    >
                      {r.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {roles.map((r: any, i: number) => {
                const Icon = iconMap[r.icon] || Bot;
                const tasks: string[] = Array.isArray(r.tasks) ? r.tasks : [];
                return (
                  <TabsContent key={r.title || i} value={`role-${i}`} className="mt-0 animate-fade-in">
                    <div className="glass-card rounded-3xl p-7 md:p-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-start" data-testid={`panel-role-${i}`}>
                      <div className="md:col-span-2">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-heading font-bold text-2xl text-foreground mb-2">{r.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{r.summary}</p>
                      </div>
                      <ul className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tasks.map((t) => (
                          <li key={t} className="flex items-start gap-3 rounded-xl bg-muted/50 p-4 text-sm text-foreground/85 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </AnimateIn>
        </section>
      )}

      {/* HUMANS IN CHARGE */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20" data-testid="section-trust">
        <AnimateIn>
          <div className="glass-card rounded-3xl p-8 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 50%, rgba(210,140,80,0.10), transparent 60%)" }} />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                {trustBadge ? (
                  <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
                    {trustBadge}
                  </Badge>
                ) : null}
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-5" data-testid="text-trust-title">
                  {trustTitle}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-4">{trustDesc1}</p>
                <p className="text-muted-foreground text-base leading-relaxed">{trustDesc2}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trustItems.map((item: any) => {
                  const Icon = iconMap[item.icon] || ShieldCheck;
                  return (
                    <div key={item.title} className="rounded-2xl bg-card border border-border/60 p-5" data-testid={`card-trust-${(item.title || "").toLowerCase().replace(/\s/g, "-")}`}>
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-sm text-foreground mb-1.5">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <AnimateIn>
          <SectionHeader badge={howBadge} title={howTitle} description={howDesc} testId="text-how-title" />
        </AnimateIn>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howSteps.map((s: any, i: number) => {
            const Icon = iconMap[s.icon] || Bot;
            return (
              <AnimateIn key={s.step || i} delay={i * 0.08} className="h-full">
                <li className="glass-card-hover rounded-2xl p-7 h-full relative list-none" data-testid={`card-step-${i}`}>
                  <div className="absolute top-6 right-6 font-heading font-bold text-3xl text-primary/20">{s.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </li>
              </AnimateIn>
            );
          })}
        </ol>
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
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16 md:py-20 scroll-mt-24">
        <AnimateIn>
          <SectionHeader badge={pricingBadge} title={pricingTitle} description={pricingDesc} testId="text-pricing-title" />
        </AnimateIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan: any, i: number) => {
            const isPopular = String(plan.popular) === "true";
            const features: string[] = Array.isArray(plan.features) ? plan.features : [];
            return (
              <AnimateIn key={plan.label || i} delay={0.05 + i * 0.05} className="h-full">
                <div className="flex flex-col h-full">
                  <div className={`flex justify-center mb-3 ${isPopular ? "" : "invisible"}`}>
                    <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${isPopular ? "bg-primary text-primary-foreground" : ""}`}>
                      {getVal(content, "ui", "mostPopularLabel", "Most Popular")}
                    </Badge>
                  </div>
                  <div className={`glass-card-hover rounded-2xl p-7 flex-1 flex flex-col ${isPopular ? "ring-2 ring-primary/40" : ""}`} data-testid={`card-plan-${i}`}>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-foreground mb-4">{plan.label}</h3>
                    {plan.startingFrom ? <p className="text-xs text-muted-foreground mb-1">{plan.startingFrom}</p> : null}
                    <div className="flex flex-wrap items-baseline gap-x-1.5 mb-5">
                      <span className="font-heading font-bold text-4xl text-primary">{plan.price}</span>
                      {plan.priceUnit ? <span className="text-sm text-muted-foreground">{plan.priceUnit}</span> : null}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">{plan.description}</p>
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button variant={isPopular ? "default" : "outline"} className={`rounded-full ${isPopular ? "" : "glass-card-hover"}`} data-testid={`button-plan-${i}`} asChild>
                      <a href={plan.ctaUrl || "#"} target="_blank" rel="noopener noreferrer">{plan.cta || "Get Started"}</a>
                    </Button>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
        {setupNote ? (
          <p className="text-center text-sm text-muted-foreground mt-8" data-testid="text-setup-note">{setupNote}</p>
        ) : null}
      </section>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section id="faq" className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <AnimateIn>
            <SectionHeader badge={faqBadge} title={faqTitle} description={faqDesc} testId="text-faq-title" />
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
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, rgba(210,140,80,0.18), transparent 70%)" }} />
            <div className="relative">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">{closingTitle}</h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">{closingDesc}</p>
              <div className="flex justify-center">
                <Button size="lg" className="rounded-full px-8" data-testid="button-automati-cta" asChild>
                  <a href={closingUrl} target="_blank" rel="noopener noreferrer">
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
