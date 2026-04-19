import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap,
  Puzzle,
  Handshake,
  Globe,
  Lightbulb,
  BookOpen,
  Clock,
  HeadphonesIcon,
  Layers,
  Trophy,
  ArrowRight,
  CheckCircle,
  Building2,
  Target,
  Copy,
  Check,
  Loader2,
  Bot,
  Brain,
  Eye,
  MessageSquare,
  Database,
  Cpu,
  PlayCircle,
  Wallet,
  Send,
  Sparkles,
} from "lucide-react";
import NetworkBg from "@/components/network-bg";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";
import { usePageContent, getVal } from "@/hooks/use-content";
import { useCountUp } from "@/hooks/use-count-up";
import bootcampLogo from "@assets/logo_1771719358200.png";
import patternBg from "@assets/pattern_white_1771718036073.png";

const iconMap: Record<string, any> = {
  GraduationCap, Puzzle, Handshake, Globe, Lightbulb, BookOpen, Clock,
  HeadphonesIcon, Layers, Trophy, Building2, Target, MessageSquare, Eye, Brain,
  Bot, Database, Cpu,
};

export default function Bootcamp() {
  const [emailCopied, setEmailCopied] = useState(false);
  const { data: content, isLoading } = usePageContent("bootcamp");

  // Hero (unchanged)
  const heroBadge = getVal(content, "hero", "badge", "Applications Now Open");
  const heroTitle = getVal(content, "hero", "title", "Become the Next LLM Engineer with BootcampAI");
  const heroSubtitle = getVal(content, "hero", "subtitle", "");
  const heroHighlights = getVal(content, "hero", "highlights", []);
  const heroApplyUrl = getVal(content, "hero", "applyUrl", "#");

  const statCount = parseInt(getVal(content, "stats", "count", "320"), 10) || 320;
  const statLabel = getVal(content, "stats", "label", "Students Trained");
  const statDesc = getVal(content, "stats", "description", "");
  const { count: statValue, ref: statRef } = useCountUp(statCount);

  // About (shortened)
  const aboutTitle = getVal(content, "about", "title", "About BootcampAI");
  const aboutDesc = getVal(content, "about", "description1", "");

  // Why Choose
  const whyTitle = getVal(content, "whyChoose", "title", "Why Choose BootcampAI Programs");
  const whySubtitle = getVal(content, "whyChoose", "subtitle", "");
  const whyHighlights = getVal(content, "whyChoose", "highlights", []);
  const whyCta = getVal(content, "whyChoose", "cta", "");

  // Programs (new)
  const programsBadge = getVal(content, "programs", "badge", "Our Programs");
  const programsTitle = getVal(content, "programs", "title", "BootcampAI Programs");
  const programsSubtitle = getVal(content, "programs", "subtitle", "");
  const programItems: any[] = getVal(content, "programs", "items", []);

  // Enterprise (unchanged)
  const entTitle = getVal(content, "enterprise", "title", "For Companies / Enterprise Programs");
  const entDesc = getVal(content, "enterprise", "description", "");
  const entBenefits = getVal(content, "enterprise", "benefits", []);
  const entCta = getVal(content, "enterprise", "cta", "");
  const entEmail = getVal(content, "enterprise", "email", "mahmood.salah@email.com");

  // FAQ (new)
  const faqBadge = getVal(content, "faq", "badge", "FAQ");
  const faqTitle = getVal(content, "faq", "title", "Frequently Asked Questions");
  const faqDesc = getVal(content, "faq", "description", "");
  const faqItems: any[] = getVal(content, "faq", "items", []);

  // SEO (new)
  const seoTitle = getVal(content, "seo", "title", "BootcampAI | Mahmood Salah");
  const seoDescription = getVal(content, "seo", "description", "");
  const seoKeywords = getVal(content, "seo", "keywords", "");
  const seoCanonical = getVal(content, "seo", "canonicalUrl", "");
  const seoOrgName = getVal(content, "seo", "organizationName", "BootcampAI");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(entEmail);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // ---------- Structured data ----------
  const structuredData = useMemo(() => {
    const graph: any[] = [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://mahmoodsalah.com/" },
          { "@type": "ListItem", position: 2, name: "BootcampAI", item: seoCanonical || "https://mahmoodsalah.com/bootcampai" },
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://mahmoodsalah.com/#bootcampai-org",
        name: seoOrgName,
        description: seoDescription,
        url: seoCanonical || "https://mahmoodsalah.com/bootcampai",
        founder: {
          "@type": "Person",
          name: "Mahmood Salah",
          url: "https://mahmoodsalah.com",
        },
        nonprofitStatus: "Nonprofit501c3",
      },
    ];
    (programItems || []).forEach((p: any) => {
      const isActive = p.status === "active";
      graph.push({
        "@type": "Course",
        name: p.title,
        description: p.shortDesc,
        provider: { "@id": "https://mahmoodsalah.com/#bootcampai-org" },
        educationalCredentialAwarded: "BootcampAI Certificate",
        timeRequired: p.duration ? "P10W" : undefined,
        availability: isActive ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Blended",
          courseWorkload: "P10W",
        },
        offers: {
          "@type": "Offer",
          url: p.applyUrl,
          availability: isActive ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
          priceCurrency: "USD",
          price: isActive ? "630" : "0",
          category: isActive ? "Subsidised — partial scholarship" : "Coming soon",
        },
      });
    });
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
  }, [seoOrgName, seoDescription, seoCanonical, programItems, faqItems]);

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

    let ld = document.getElementById("bootcamp-jsonld") as HTMLScriptElement | null;
    if (!ld) { ld = document.createElement("script"); ld.id = "bootcamp-jsonld"; ld.type = "application/ld+json"; document.head.appendChild(ld); }
    ld.text = JSON.stringify(structuredData);

    return () => {
      document.title = prevTitle;
      ld?.remove();
      if (createdCanonical) canonical?.remove();
    };
  }, [seoTitle, seoDescription, seoKeywords, seoCanonical, structuredData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* HERO — unchanged */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }} />
        <NetworkBg />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20 pb-16">
          <Badge variant="outline" className="mb-6 glass-badge rounded-full text-primary animate-fade-in">
            {heroBadge}
          </Badge>
          <div className="flex justify-center -my-[5.5rem] animate-fade-in-up mt-[-100px] mb-[-100px]">
            <img src={bootcampLogo} alt="BootcampAI" className="h-[15rem] sm:h-[18rem] md:h-[21rem] w-auto" data-testid="img-bootcamp-logo" />
          </div>
          <h1
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6 animate-fade-in-up"
            data-testid="text-bootcamp-title"
          >
            {heroTitle.includes("BootcampAI") ? (
              <>
                {heroTitle.split("BootcampAI")[0]}
                <span className="text-[#FD6215]">BootcampAI</span>
                {heroTitle.split("BootcampAI")[1]}
              </>
            ) : heroTitle}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 animate-fade-in-up animation-delay-300">
            {heroHighlights.map((h: string, i: number) => {
              const icons = [BrainIcon, BriefcaseIcon, GraduationCap];
              const HIcon = icons[i] || GraduationCap;
              return (
                <div key={i} className="flex items-center gap-2 text-foreground glass-badge rounded-full px-4 py-2">
                  <HIcon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{h}</span>
                </div>
              );
            })}
          </div>

          <div className="animate-fade-in-up animation-delay-400">
            <Button asChild size="lg" className="rounded-xl bg-[#FD6215] hover:bg-[#e5580f]">
              <a href={heroApplyUrl} target="_blank" rel="noopener noreferrer" data-testid="button-apply-hero">
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* STATS COUNTER */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 md:-mt-12 relative z-10" data-testid="section-bootcamp-stats">
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
                data-testid="text-bootcamp-count"
              >
                {statValue}
                <span className="text-primary/70">+</span>
              </div>
              <p className="font-heading font-semibold text-lg md:text-xl text-foreground mb-3" data-testid="text-bootcamp-stat-label">
                {statLabel}
              </p>
              {statDesc && (
                <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto" data-testid="text-bootcamp-stat-desc">
                  {statDesc}
                </p>
              )}
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ABOUT — short philosophy */}
      <section className="py-20" data-testid="section-about-bootcamp">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
              Our Philosophy
            </Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-5">
              {aboutTitle}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed" data-testid="text-about-description">
              {aboutDesc}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* TECH MARQUEE */}
      <section className="pb-12" data-testid="section-tech-marquee">
        <div className="max-w-6xl mx-auto px-0">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-4 bootcamp-ticker">
              {[
                { icon: Bot, label: "AI Agents", color: "text-[#FD6215]", bg: "bg-[#FD6215]/15" },
                { icon: MessageSquare, label: "LLMs", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/15" },
                { icon: Database, label: "RAG", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/15" },
                { icon: Eye, label: "Computer Vision", color: "text-green-600 dark:text-green-400", bg: "bg-green-500/15" },
                { icon: Brain, label: "Deep Learning", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/15" },
                { icon: Cpu, label: "Fine-Tuning", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/15" },
                { icon: Layers, label: "Prompt Engineering", color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/15" },
                { icon: Globe, label: "MLOps", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-500/15" },
              ].flatMap((item, i) => [item, item].map((t, j) => {
                const TIcon = t.icon;
                return (
                  <div key={`${i}-${j}`} className="flex-shrink-0 glass-card rounded-full px-4 py-2.5 flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg ${t.bg} flex items-center justify-center`}>
                      <TIcon className={`w-4 h-4 ${t.color}`} />
                    </div>
                    <span className="font-heading font-semibold text-sm text-foreground whitespace-nowrap">{t.label}</span>
                  </div>
                );
              }))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE — filtered (3 highlights) */}
      <section className="py-20 glass-section" data-testid="section-why-choose">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">{whyTitle}</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">{whySubtitle}</p>
          </AnimateIn>
          <div className="flex flex-wrap justify-center gap-6">
            {whyHighlights.map((h: any, i: number) => {
              const HIcon = iconMap[h.icon] || Lightbulb;
              return (
                <AnimateIn key={i} delay={i * 0.08} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <div className="glass-card-hover rounded-xl p-6 h-full">
                    <div className="w-12 h-12 rounded-xl glass-badge flex items-center justify-center mb-4">
                      <HIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{h.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{h.desc}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
          {whyCta && (
            <AnimateIn delay={0.4}>
              <p className="text-center text-foreground font-heading font-semibold text-lg mt-10">{whyCta}</p>
            </AnimateIn>
          )}
        </div>
      </section>

      {/* PROGRAMS — accordion */}
      <section id="programs" className="py-20" data-testid="section-programs">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-12">
              <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
                {programsBadge}
              </Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
                {programsTitle}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{programsSubtitle}</p>
            </div>
          </AnimateIn>

          <Accordion type="single" collapsible defaultValue="prog-0" className="space-y-4">
            {programItems.map((p: any, idx: number) => {
              const PIcon = iconMap[p.icon] || Sparkles;
              const isActive = p.status === "active";
              return (
                <AnimateIn key={p.id || idx} delay={idx * 0.08}>
                  <AccordionItem
                    value={`prog-${idx}`}
                    className="glass-card rounded-2xl overflow-hidden border-0"
                    data-testid={`accordion-program-${p.id || idx}`}
                  >
                    <AccordionTrigger className="px-5 md:px-7 py-5 hover:no-underline">
                      <div className="flex items-center gap-4 w-full text-left">
                        <div
                          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${p.accentColor}1F`, color: p.accentColor }}
                        >
                          <PIcon className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-heading font-bold text-base md:text-xl text-foreground">
                              {p.title}
                            </h3>
                            <Badge
                              variant={isActive ? "default" : "secondary"}
                              className={`rounded-full text-[10px] uppercase tracking-wider ${
                                isActive
                                  ? "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/20"
                                  : "bg-muted text-muted-foreground"
                              }`}
                              data-testid={`badge-status-${p.id}`}
                            >
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                              )}
                              {p.statusLabel}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed line-clamp-2">
                            {p.shortDesc}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-5 md:px-7 pb-7">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                        {/* What You'll Learn */}
                        <div className="glass-card rounded-xl p-5">
                          <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" style={{ color: p.accentColor }} />
                            What You'll Learn
                          </h4>
                          <ul className="space-y-2.5">
                            {(p.whatYoullLearn || []).map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: p.accentColor }} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Program Details */}
                        <div className="glass-card rounded-xl p-5">
                          <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" style={{ color: p.accentColor }} />
                            Program Details
                          </h4>
                          <div className="space-y-3">
                            {(p.programDetails || []).map((d: any, i: number) => {
                              const DIcon = iconMap[d.icon] || Clock;
                              return (
                                <div key={i} className="flex items-start gap-3">
                                  <DIcon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: p.accentColor }} />
                                  <div className="text-sm">
                                    <span className="font-semibold text-foreground">{d.label}: </span>
                                    <span className="text-muted-foreground">{d.value}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Tuitions and Scholarships */}
                        <div className="glass-card rounded-xl p-5">
                          <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Wallet className="w-4 h-4" style={{ color: p.accentColor }} />
                            Tuitions and Scholarships
                          </h4>
                          <ul className="space-y-2.5">
                            {(p.tuitions || []).map((t: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                                <Trophy className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: p.accentColor }} />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                          {p.tuitionNote && (
                            <p className="mt-4 text-xs text-muted-foreground italic border-t border-border/40 pt-3">
                              {p.tuitionNote}
                            </p>
                          )}
                        </div>

                        {/* Video */}
                        <div className="glass-card rounded-xl p-5 flex flex-col">
                          <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                            <PlayCircle className="w-4 h-4" style={{ color: p.accentColor }} />
                            Video Overview
                          </h4>
                          {p.videoUrl ? (
                            <div className="relative w-full rounded-lg overflow-hidden flex-1" style={{ paddingBottom: "56.25%" }}>
                              <iframe
                                className="absolute inset-0 w-full h-full"
                                src={p.videoUrl}
                                title={`${p.title} overview`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                data-testid={`video-program-${p.id}`}
                              />
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground text-sm py-8 border border-dashed border-border/60 rounded-lg">
                              <div>
                                <PlayCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                Video coming soon
                              </div>
                            </div>
                          )}
                        </div>

                        {/* How to Apply */}
                        <div className="glass-card rounded-xl p-5 lg:col-span-2">
                          <h4 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Send className="w-4 h-4" style={{ color: p.accentColor }} />
                            How to Apply
                          </h4>
                          {Array.isArray(p.applySteps) && p.applySteps.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                              {p.applySteps.map((step: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                  <div
                                    className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ backgroundColor: p.accentColor }}
                                  >
                                    {i + 1}
                                  </div>
                                  <p className="text-muted-foreground text-sm">{step}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm mb-5">
                              Detailed application steps will be announced when this programme opens. Join the waitlist to be the first to know.
                            </p>
                          )}
                          <div className="flex justify-center">
                            <Button
                              asChild
                              size="lg"
                              className="rounded-xl text-white"
                              style={{ backgroundColor: p.accentColor }}
                            >
                              <a
                                href={p.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid={`button-apply-${p.id}`}
                              >
                                {p.applyText}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </AnimateIn>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* ENTERPRISE — unchanged */}
      <section className="py-20 glass-section" data-testid="section-enterprise">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
            <div className="w-14 h-14 rounded-2xl glass-badge flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3">{entTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">{entDesc}</p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {entBenefits.map((benefit: string, i: number) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="glass-card rounded-xl p-5 flex items-start gap-3 h-full">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground text-sm">{benefit}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.4}>
            <div className="text-center mt-10">
              {entCta && (
                <p className="text-foreground font-heading font-semibold mb-6">{entCta}</p>
              )}
              <Button onClick={handleCopyEmail} size="lg" className="rounded-xl" data-testid="button-copy-email-enterprise">
                {emailCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Email Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Email to Get in Touch
                  </>
                )}
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section id="faq" className="py-20" data-testid="section-bootcamp-faq">
          <div className="max-w-4xl mx-auto px-6">
            <AnimateIn>
              <div className="text-center mb-10">
                <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
                  {faqBadge}
                </Badge>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
                  {faqTitle}
                </h2>
                {faqDesc && <p className="text-muted-foreground max-w-2xl mx-auto">{faqDesc}</p>}
              </div>
            </AnimateIn>
            <AnimateIn delay={0.05}>
              <div className="glass-card rounded-2xl p-4 md:p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((q: any, i: number) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      data-testid={`accordion-bootcamp-faq-${i}`}
                      className="border-b border-border/40 last:border-b-0"
                    >
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
    </div>
  );
}

function BrainIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}
