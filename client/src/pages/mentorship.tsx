import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Code,
  Building2,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Wrench,
  BookMarked,
  Network,
  Sparkles,
  TrendingUp,
  Heart,
  Shield,
  Users,
  Eye,
  Copy,
  Check,
  Loader2,
  Rocket,
  Target,
  Zap,
  Clock,
} from "lucide-react";
import NetworkBg from "@/components/network-bg";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";
import { usePageContent, getVal } from "@/hooks/use-content";
import { useCountUp } from "@/hooks/use-count-up";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import patternBg from "@assets/pattern_white_1771718036073.png";

const iconMap: Record<string, any> = {
  BookOpen, Code, Building2, Wrench, BookMarked, Network, Sparkles,
  TrendingUp, Heart, Shield, Users, Eye,
};

export default function Mentorship() {
  const [emailCopied, setEmailCopied] = useState(false);
  const { data: content, isLoading } = usePageContent("mentorship");

  const heroTitle = getVal(content, "hero", "title", "Information Is Everywhere. Direction Is Rare.");
  const heroSubtitle = getVal(content, "hero", "subtitle", "");

  const statCount = parseInt(getVal(content, "stats", "count", "572"), 10) || 572;
  const statLabel = getVal(content, "stats", "label", "Mentees Guided");
  const statDesc = getVal(content, "stats", "description", "");
  const { count: statValue, ref: statRef } = useCountUp(statCount);
  const introTitle = getVal(content, "intro", "title", "Being an AI learner is tough.");
  const introDesc = getVal(content, "intro", "description", "");
  const plansTitle = getVal(content, "plans", "title", "Mentorship Plans");
  const plansSubtitle = getVal(content, "plans", "subtitle", "");
  const plansLimitedNotice = getVal(content, "plans", "limitedTimeNotice", "");
  const plans = getVal(content, "plans", "items", []);
  const benefitsTitle = getVal(content, "benefits", "title", "Benefits of Mentorship");
  const benefitsSubtitle = getVal(content, "benefits", "subtitle", "");
  const benefits = getVal(content, "benefits", "items", []);
  const styleTitle = getVal(content, "mentoringStyle", "title", "My Mentoring Style");
  const styleSubtitle = getVal(content, "mentoringStyle", "subtitle", "");
  const mentoringStyle = getVal(content, "mentoringStyle", "items", []);
  const ctaTitle = getVal(content, "bottomCta", "title", "Book a Consult");
  const ctaSubtitle = getVal(content, "bottomCta", "subtitle", "");
  const ctaEmail = getVal(content, "bottomCta", "email", "mahmood.salah@email.com");

  const faqBadge = getVal(content, "faq", "badge", "FAQ");
  const faqTitle = getVal(content, "faq", "title", "Common questions about the mentorship");
  const faqDesc = getVal(content, "faq", "description", "");
  const faqItems: any[] = getVal(content, "faq", "items", []);

  const seoTitle = getVal(content, "seo", "title", "AI Mentorship | Mahmood Salah");
  const seoDescription = getVal(content, "seo", "description", "");
  const seoKeywords = getVal(content, "seo", "keywords", "");
  const seoCanonical = getVal(content, "seo", "canonicalUrl", "");
  const seoServiceName = getVal(content, "seo", "serviceName", "AI Mentorship Programme");
  const seoProvider = getVal(content, "seo", "serviceProvider", "Mahmood Salah");

  const structuredData = useMemo(() => {
    const graph: any[] = [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://mahmoodsalah.com/" },
          { "@type": "ListItem", position: 2, name: "Mentorship", item: seoCanonical || "https://mahmoodsalah.com/mentorship" },
        ],
      },
      {
        "@type": "Person",
        "@id": "https://mahmoodsalah.com/#person",
        name: seoProvider,
        url: "https://mahmoodsalah.com",
        jobTitle: "Senior Data Scientist & AI Engineer",
        description: "Senior Data Scientist and AI Engineer specialising in AI agents, LLMs, and computer vision. AI Mentor at Udacity.",
        sameAs: [
          "https://www.linkedin.com/in/mahmoodsalah",
          "https://www.youtube.com/@MahmoodSalah",
        ],
      },
      {
        "@type": "Service",
        "@id": (seoCanonical || "") + "#service",
        name: seoServiceName,
        serviceType: "AI Mentorship",
        description: seoDescription,
        provider: { "@id": "https://mahmoodsalah.com/#person" },
        areaServed: "Worldwide",
        offers: (Array.isArray(plans) ? plans : []).map((p: any) => ({
          "@type": "Offer",
          name: p.title,
          description: p.description,
          price: typeof p.price === "string" ? p.price.replace(/[^0-9.,]/g, "") || undefined : undefined,
          priceCurrency: "USD",
          url: p.href,
          eligibleDuration: p.duration,
        })),
      },
    ];
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
  }, [seoServiceName, seoProvider, seoDescription, seoCanonical, plans, faqItems]);

  useEffect(() => {
    if (!seoTitle) return;
    const prevTitle = document.title;
    document.title = seoTitle;

    const setMeta = (sel: string, attr: string, name: string, val: string) => {
      if (!val) return;
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };
    setMeta('meta[name="description"]', "name", "description", seoDescription);
    setMeta('meta[name="keywords"]', "name", "keywords", seoKeywords);
    setMeta('meta[property="og:title"]', "property", "og:title", seoTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", seoDescription);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:url"]', "property", "og:url", seoCanonical);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", seoTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", seoDescription);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonical;
    if (seoCanonical) {
      if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
      canonical.href = seoCanonical;
    }

    let ld = document.getElementById("mentorship-jsonld") as HTMLScriptElement | null;
    if (!ld) { ld = document.createElement("script"); ld.id = "mentorship-jsonld"; ld.type = "application/ld+json"; document.head.appendChild(ld); }
    ld.text = JSON.stringify(structuredData);

    return () => {
      document.title = prevTitle;
      ld?.remove();
      if (createdCanonical) canonical?.remove();
    };
  }, [seoTitle, seoDescription, seoKeywords, seoCanonical, structuredData]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ctaEmail);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }} />
        <NetworkBg />

        <div className="absolute top-20 left-[8%] hidden lg:block animate-fade-in-up animation-delay-400">
          <div className="glass-card rounded-2xl p-4 mentorship-float-card" style={{ animationDelay: '0s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Personalized</p>
                <p className="font-heading font-semibold text-sm text-foreground">1-on-1 Sessions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-32 right-[6%] hidden lg:block animate-fade-in-up animation-delay-500">
          <div className="glass-card rounded-2xl p-4 mentorship-float-card" style={{ animationDelay: '1.5s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Goal-Driven</p>
                <p className="font-heading font-semibold text-sm text-foreground">Real Projects</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-32 left-[10%] hidden lg:block animate-fade-in-up animation-delay-600">
          <div className="glass-card rounded-2xl p-4 mentorship-float-card" style={{ animationDelay: '3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fast-Track</p>
                <p className="font-heading font-semibold text-sm text-foreground">Your AI Career</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8 animate-fade-in-up" data-testid="badge-mentorship">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Mentorship Program</span>
          </div>

          <h1
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6 animate-fade-in-up animation-delay-100"
            data-testid="text-mentorship-title"
          >
            {heroTitle.includes("Direction Is Rare") ? (
              <>
                {heroTitle.split("Direction Is Rare")[0]}
                <span className="text-primary font-extrabold">Direction Is Rare.</span>
              </>
            ) : (
              heroTitle
            )}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Button
              size="lg"
              className="rounded-xl text-base px-8"
              onClick={() => document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-view-plans"
            >
              View Plans
              <ArrowDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden" data-testid="section-mentorship-intro">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '400px', backgroundRepeat: 'repeat' }} />
        <AnimateIn className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-heading font-bold text-3xl text-primary-foreground mb-6">{introTitle}</h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">{introDesc}</p>
        </AnimateIn>
      </section>

      <section className="py-20" id="plans" data-testid="section-plans">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">{plansTitle}</h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-6">{plansSubtitle}</p>
          </AnimateIn>

          {plansLimitedNotice && (
            <AnimateIn delay={0.05}>
              <div className="flex items-center justify-center gap-2.5 mb-10 px-5 py-3 rounded-full border border-primary/30 bg-primary/5 w-fit mx-auto" data-testid="banner-limited-time">
                <Clock className="w-4 h-4 text-primary shrink-0 animate-pulse" />
                <span className="text-sm font-medium text-foreground">{plansLimitedNotice}</span>
              </div>
            </AnimateIn>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan: any, i: number) => {
              const PlanIcon = iconMap[plan.icon] || BookOpen;
              return (
                <AnimateIn key={i} delay={i * 0.1}>
                  <div
                    className={`relative flex flex-col h-full glass-card-hover rounded-xl ${
                      plan.popular ? "ring-2 ring-primary/30" : ""
                    }`}
                  >
                    {(plan.popular || plan.discount) && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                        {plan.popular && (
                          <Badge className="rounded-full">Most Popular</Badge>
                        )}
                        {plan.discount && (
                          <Badge variant="destructive" className="rounded-full">{plan.discount}</Badge>
                        )}
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="w-12 h-12 rounded-xl glass-badge flex items-center justify-center mb-4">
                        <PlanIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-xl text-foreground mb-1">{plan.title}</h3>

                      <div className="flex items-baseline gap-2 mb-1">
                        {plan.originalPrice && (
                          <span className="text-muted-foreground line-through text-lg">{plan.originalPrice}</span>
                        )}
                        <span className="font-heading font-bold text-3xl text-foreground">{plan.price}</span>
                      </div>
                      <p className="text-muted-foreground text-xs mb-4">{plan.duration} of focused mentorship</p>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{plan.description}</p>

                      <p className="text-xs text-muted-foreground mb-4">
                        <span className="font-semibold text-foreground">Best for: </span>
                        {plan.bestFor}
                      </p>

                      <ul className="space-y-2 mb-6 flex-1">
                        {(plan.features || []).map((f: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-muted-foreground text-sm">
                            <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Button asChild variant={plan.popular ? "default" : "outline"} className="w-full rounded-xl">
                        <a href={plan.href} target="_blank" rel="noopener noreferrer" data-testid={`button-plan-${i}`}>
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 glass-section" data-testid="section-benefits">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">{benefitsTitle}</h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">{benefitsSubtitle}</p>
          </AnimateIn>
          <div className="flex flex-wrap justify-center gap-6">
            {benefits.map((b: any, i: number) => {
              const BIcon = iconMap[b.icon] || Wrench;
              return (
                <AnimateIn key={i} delay={i * 0.08} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <div className="glass-card-hover rounded-xl p-6 h-full">
                    <div className="w-12 h-12 rounded-xl glass-badge flex items-center justify-center mb-4">
                      <BIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{b.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20" data-testid="section-mentorship-stats">
        <AnimateIn>
          <div
            ref={statRef}
            className="glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.12), transparent 65%)",
              }}
            />
            <div className="relative z-10">
              <div
                className="font-heading font-bold text-6xl sm:text-7xl md:text-8xl text-primary leading-none mb-3 tabular-nums"
                data-testid="text-mentorship-count"
              >
                {statValue}
                <span className="text-primary/70">+</span>
              </div>
              <p className="font-heading font-semibold text-lg md:text-xl text-foreground mb-3" data-testid="text-mentorship-stat-label">
                {statLabel}
              </p>
              {statDesc && (
                <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto" data-testid="text-mentorship-stat-desc">
                  {statDesc}
                </p>
              )}
            </div>
          </div>
        </AnimateIn>
      </section>

      <section className="py-20" data-testid="section-mentoring-style">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">{styleTitle}</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">{styleSubtitle}</p>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mentoringStyle.map((s: any, i: number) => {
              const SIcon = iconMap[s.icon] || Heart;
              return (
                <AnimateIn key={i} delay={i * 0.1}>
                  <div className="glass-card-hover rounded-xl p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl glass-badge flex items-center justify-center flex-shrink-0">
                        <SIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-foreground mb-2">{s.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section id="faq" className="py-20" data-testid="section-mentorship-faq">
          <div className="max-w-4xl mx-auto px-6">
            <AnimateIn>
              <div className="text-center mb-10">
                <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
                  {faqBadge}
                </Badge>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
                  {faqTitle}
                </h2>
                {faqDesc && (
                  <p className="text-muted-foreground max-w-2xl mx-auto">{faqDesc}</p>
                )}
              </div>
            </AnimateIn>
            <AnimateIn delay={0.05}>
              <div className="glass-card rounded-2xl p-4 md:p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((q: any, i: number) => (
                    <AccordionItem key={i} value={`faq-${i}`} data-testid={`accordion-mentorship-faq-${i}`} className="border-b border-border/40 last:border-b-0">
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
          </div>
        </section>
      )}

      <section className="py-20 glass-section" data-testid="section-bottom-cta">
        <AnimateIn className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-3">{ctaTitle}</h2>
          <p className="text-muted-foreground mb-8">{ctaSubtitle}</p>
          <Button onClick={handleCopyEmail} size="lg" className="rounded-xl" data-testid="button-copy-email-consult">
            {emailCopied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Email Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Email
              </>
            )}
          </Button>
        </AnimateIn>
      </section>
    </div>
  );
}
