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
import patternBg from "@assets/pattern_white_1771718036073.webp";

const iconMap: Record<string, any> = {
  GraduationCap, Puzzle, Handshake, Globe, Lightbulb, BookOpen, Clock,
  HeadphonesIcon, Layers, Trophy, Building2, Target, MessageSquare, Eye, Brain,
  Bot, Database, Cpu,
};

export default function Bootcamp() {
  const [emailCopied, setEmailCopied] = useState(false);
  const { data: content, isLoading } = usePageContent("bootcamp");

  const heroBadge = getVal(content, "hero", "badge", "Applications Now Open");
  const heroTitle = getVal(content, "hero", "title", "Become the Next LLM Engineer with BootcampAI");
  const heroSubtitle = getVal(content, "hero", "subtitle", "");
  const heroHighlights = getVal(content, "hero", "highlights", []);
  const heroApplyUrl = getVal(content, "hero", "applyUrl", "#");

  const statCount = parseInt(getVal(content, "stats", "count", "320"), 10) || 320;
  const statLabel = getVal(content, "stats", "label", "Students Trained");
  const statDesc = getVal(content, "stats", "description", "");
  const { count: statValue, ref: statRef } = useCountUp(statCount);

  const aboutTitle = getVal(content, "about", "title", "About BootcampAI");
  const aboutDesc = getVal(content, "about", "description1", "");

  const whyTitle = getVal(content, "whyChoose", "title", "Why Choose BootcampAI Programs");
  const whySubtitle = getVal(content, "whyChoose", "subtitle", "");
  const whyHighlights = getVal(content, "whyChoose", "highlights", []);
  const whyCta = getVal(content, "whyChoose", "cta", "");

  const programsBadge = getVal(content, "programs", "badge", "Our Programs");
  const programsTitle = getVal(content, "programs", "title", "BootcampAI Programs");
  const programsSubtitle = getVal(content, "programs", "subtitle", "");
  const programItems: any[] = getVal(content, "programs", "items", []);

  const entTitle = getVal(content, "enterprise", "title", "For Companies / Enterprise Programs");
  const entDesc = getVal(content, "enterprise", "description", "");
  const entBenefits = getVal(content, "enterprise", "benefits", []);
  const entCta = getVal(content, "enterprise", "cta", "");
  const entEmail = getVal(content, "enterprise", "email", "mahmood.salah@email.com");

  const faqBadge = getVal(content, "faq", "badge", "FAQ");
  const faqTitle = getVal(content, "faq", "title", "Frequently Asked Questions");
  const faqDesc = getVal(content, "faq", "description", "");
  const faqItems: any[] = getVal(content, "faq", "items", []);

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

  const structuredData = useMemo(() => {
    const graph: any[] = [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://mahmoodsalah.xyz/" },
          { "@type": "ListItem", position: 2, name: "BootcampAI", item: seoCanonical || "https://mahmoodsalah.xyz/bootcampai" },
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://mahmoodsalah.xyz/#bootcampai-org",
        name: seoOrgName,
        description: seoDescription,
        url: seoCanonical || "https://mahmoodsalah.xyz/bootcampai",
        founder: {
          "@type": "Person",
          name: "Mahmood Salah",
          url: "https://mahmoodsalah.xyz",
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
        provider: { "@id": "https://mahmoodsalah.xyz/#bootcampai-org" },
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
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }} />
        <NetworkBg />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20 pb-16">
          <Badge variant="outline" className="mb-6 glass-badge rounded-full text-primary animate-fade-in">
            {heroBadge}
          </Badge>
          <div className="flex justify-center -my-[5.5rem] animate-fade-in-up mt-[-100px] mb-[-100px]">
            <img src={bootcampLogo} alt="BootcampAI" className="h-[15rem] sm:h-[18rem] md:h-[21rem] w-auto" decoding="async" data-testid="img-bootcamp-logo" />
          </div>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6 animate-fade-in-up" data-testid="text-bootcamp-title">
            {heroTitle.includes("BootcampAI") ? <>{heroTitle.split("BootcampAI")[0]}<span className="text-[#FD6215]">BootcampAI</span>{heroTitle.split("BootcampAI")[1]}</> : heroTitle}
          </h1>
          {heroSubtitle && <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">{heroSubtitle}</p>}
          {Array.isArray(heroHighlights) && heroHighlights.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {heroHighlights.map((h: string, i: number) => (
                <Badge key={i} variant="secondary" className="rounded-full px-4 py-1.5 text-sm">{h}</Badge>
              ))}
            </div>
          )}
          <Button asChild size="lg" className="rounded-xl bg-[#FD6215] hover:bg-[#FD6215]/90 text-white">
            <a href={heroApplyUrl} target="_blank" rel="noopener noreferrer">Apply Now <ArrowRight className="w-4 h-4 ml-2" /></a>
          </Button>
        </div>
      </section>

      <section className="py-20" data-testid="section-programs">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-12">
              <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">{programsBadge}</Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">{programsTitle}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{programsSubtitle}</p>
            </div>
          </AnimateIn>

          <div className="space-y-4">
            {programItems.map((p: any, idx: number) => {
              const PIcon = iconMap[p.icon] || Sparkles;
              const isActive = p.status === "active";
              const expandable = p.expandable !== false;
              return (
                <AnimateIn key={p.id || idx} delay={idx * 0.08}>
                  <div className="glass-card rounded-2xl overflow-hidden border-0" data-testid={`card-program-${p.id || idx}`}>
                    <div className="px-5 md:px-7 py-5">
                      <div className="flex items-center gap-4 w-full text-left">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${p.accentColor}1F`, color: p.accentColor }}>
                          <PIcon className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-heading font-bold text-base md:text-xl text-foreground">{p.title}</h3>
                            <Badge variant={isActive ? "default" : "secondary"} className={`rounded-full text-[10px] uppercase tracking-wider ${isActive ? "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/20" : "bg-muted text-muted-foreground"}`} data-testid={`badge-status-${p.id}`}>
                              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />}
                              {p.statusLabel}
                            </Badge>
                            {!expandable && <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wider bg-muted text-muted-foreground">Locked</Badge>}
                          </div>
                          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed line-clamp-2">{p.shortDesc}</p>
                        </div>
                      </div>
                    </div>
                    {expandable && (
                      <Accordion type="single" collapsible className="border-t border-border/40">
                        <AccordionItem value={`prog-${idx}`} className="border-0">
                          <AccordionTrigger className="px-5 md:px-7 py-4 hover:no-underline" />
                          <AccordionContent className="px-5 md:px-7 pb-7">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                              <div className="glass-card rounded-xl p-5">
                                <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" style={{ color: p.accentColor }} />What You'll Learn</h4>
                                <ul className="space-y-2.5">{(p.whatYoullLearn || []).map((item: string, i: number) => <li key={i} className="flex items-start gap-2.5 text-muted-foreground text-sm"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: p.accentColor }} /><span>{item}</span></li>)}</ul>
                              </div>
                              <div className="glass-card rounded-xl p-5">
                                <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2"><Target className="w-4 h-4" style={{ color: p.accentColor }} />Program Details</h4>
                                <div className="space-y-3">{(p.programDetails || []).map((d: any, i: number) => { const DIcon = iconMap[d.icon] || Clock; return <div key={i} className="flex items-start gap-3"><DIcon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: p.accentColor }} /><div className="text-sm"><span className="font-semibold text-foreground">{d.label}: </span><span className="text-muted-foreground">{d.value}</span></div></div>; })}</div>
                              </div>
                              <div className="glass-card rounded-xl p-5">
                                <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2"><Wallet className="w-4 h-4" style={{ color: p.accentColor }} />Tuitions and Scholarships</h4>
                                <ul className="space-y-2.5">{(p.tuitions || []).map((t: string, i: number) => <li key={i} className="flex items-start gap-2.5 text-muted-foreground text-sm"><Trophy className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: p.accentColor }} /><span>{t}</span></li>)}</ul>
                                {p.tuitionNote && <p className="mt-4 text-xs text-muted-foreground italic border-t border-border/40 pt-3">{p.tuitionNote}</p>}
                              </div>
                              <div className="glass-card rounded-xl p-5 flex flex-col">
                                <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2"><PlayCircle className="w-4 h-4" style={{ color: p.accentColor }} />Video Overview</h4>
                                {p.videoUrl ? <div className="relative w-full rounded-lg overflow-hidden flex-1" style={{ paddingBottom: "56.25%" }}><iframe className="absolute inset-0 w-full h-full" src={p.videoUrl} title={`${p.title} overview`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen data-testid={`video-program-${p.id}`} /></div> : <div className="flex-1 flex items-center justify-center text-center text-muted-foreground text-sm py-8 border border-dashed border-border/60 rounded-lg"><div><PlayCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />Video coming soon</div></div>}
                              </div>
                              <div className="glass-card rounded-xl p-5 lg:col-span-2">
                                <h4 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2"><Send className="w-4 h-4" style={{ color: p.accentColor }} />How to Apply</h4>
                                {Array.isArray(p.applySteps) && p.applySteps.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">{p.applySteps.map((step: string, i: number) => <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"><div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: p.accentColor }}>{i + 1}</div><p className="text-muted-foreground text-sm">{step}</p></div>)}</div> : <p className="text-muted-foreground text-sm mb-5">Detailed application steps will be announced when this programme opens. Join the waitlist to be the first to know.</p>}
                                <div className="flex justify-center"><Button asChild size="lg" className="rounded-xl text-white" style={{ backgroundColor: p.accentColor }}><a href={p.applyUrl} target="_blank" rel="noopener noreferrer" data-testid={`button-apply-${p.id}`}>{p.applyText}<ArrowRight className="w-4 h-4 ml-2" /></a></Button></div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
