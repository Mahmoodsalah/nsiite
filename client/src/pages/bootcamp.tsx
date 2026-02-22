import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import NetworkBg from "@/components/network-bg";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";
import { usePageContent, getVal } from "@/hooks/use-content";
import bootcampLogo from "@assets/logo_1771719358200.png";
import patternBg from "@assets/pattern_white_1771718036073.png";

const iconMap: Record<string, any> = {
  GraduationCap, Puzzle, Handshake, Globe, Lightbulb, BookOpen, Clock,
  HeadphonesIcon, Layers, Trophy, Building2, Target,
};

export default function Bootcamp() {
  const [emailCopied, setEmailCopied] = useState(false);
  const { data: content, isLoading } = usePageContent("bootcamp");

  const heroBadge = getVal(content, "hero", "badge", "Applications Now Open");
  const heroTitle = getVal(content, "hero", "title", "Become the Next LLM Engineer with BootcampAI");
  const heroSubtitle = getVal(content, "hero", "subtitle", "");
  const heroHighlights = getVal(content, "hero", "highlights", []);
  const heroApplyUrl = getVal(content, "hero", "applyUrl", "#");

  const aboutTitle = getVal(content, "about", "title", "About BootcampAI");
  const aboutDesc1 = getVal(content, "about", "description1", "");
  const aboutDesc2 = getVal(content, "about", "description2", "");
  const duringBenefits = getVal(content, "about", "duringBenefits", []);
  const afterBenefits = getVal(content, "about", "afterBenefits", []);

  const whyTitle = getVal(content, "whyChoose", "title", "Why Choose BootcampAI Programs");
  const whySubtitle = getVal(content, "whyChoose", "subtitle", "");
  const whyHighlights = getVal(content, "whyChoose", "highlights", []);
  const whyCta = getVal(content, "whyChoose", "cta", "");

  const llmTitle = getVal(content, "llmBootcamp", "title", "LLM & AI Agent Bootcamp");
  const llmSubtitle = getVal(content, "llmBootcamp", "subtitle", "");
  const whatYoullLearn = getVal(content, "llmBootcamp", "whatYoullLearn", []);
  const programDetails = getVal(content, "llmBootcamp", "programDetails", []);
  const scholarships = getVal(content, "llmBootcamp", "scholarships", []);
  const bottomNote = getVal(content, "llmBootcamp", "bottomNote", "");

  const applyTitle = getVal(content, "howToApply", "title", "How to Apply");
  const applySubtitle = getVal(content, "howToApply", "subtitle", "");
  const applySteps = getVal(content, "howToApply", "steps", []);
  const applyBadge = getVal(content, "howToApply", "badge", "");
  const applyCta = getVal(content, "howToApply", "cta", "");
  const applyUrl = getVal(content, "howToApply", "applyUrl", "#");
  const applyText = getVal(content, "howToApply", "applyText", "Apply Now");

  const entTitle = getVal(content, "enterprise", "title", "For Companies / Enterprise Programs");
  const entDesc = getVal(content, "enterprise", "description", "");
  const entBenefits = getVal(content, "enterprise", "benefits", []);
  const entCta = getVal(content, "enterprise", "cta", "");
  const entEmail = getVal(content, "enterprise", "email", "mahmood.salah@email.com");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(entEmail);
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
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32">
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
      <section className="py-20" data-testid="section-about-bootcamp">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-6 text-center">
              {aboutTitle}
            </h2>
            <div className="max-w-3xl mx-auto space-y-4 mb-12">
              <p className="text-muted-foreground leading-relaxed">{aboutDesc1}</p>
              <p className="text-muted-foreground leading-relaxed">{aboutDesc2}</p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <AnimateIn delay={0.1}>
              <div className="glass-card rounded-xl p-6 h-full">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Throughout the bootcamp, participants enjoy:
                </h3>
                <ul className="space-y-3">
                  {duringBenefits.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <div className="glass-card rounded-xl p-6 h-full">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  After completing the program, graduates receive:
                </h3>
                <ul className="space-y-3">
                  {afterBenefits.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
      <section className="py-20 glass-section" data-testid="section-why-choose">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">{whyTitle}</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">{whySubtitle}</p>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyHighlights.map((h: any, i: number) => {
              const HIcon = iconMap[h.icon] || Lightbulb;
              return (
                <AnimateIn key={i} delay={i * 0.08}>
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
      <section className="py-20" data-testid="section-llm-bootcamp">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">{llmTitle}</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">{llmSubtitle}</p>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <AnimateIn delay={0.1}>
              <div className="glass-card rounded-xl p-6 h-full">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  What You'll Learn
                </h3>
                <ul className="space-y-3">
                  {whatYoullLearn.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <div className="glass-card rounded-xl p-6 h-full">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Program Details
                </h3>
                <div className="space-y-4 mb-6">
                  {programDetails.map((d: any, i: number) => {
                    const DIcon = iconMap[d.icon] || Clock;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <DIcon className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-foreground text-sm">{d.label}: </span>
                          <span className="text-muted-foreground text-sm">{d.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h4 className="font-semibold text-foreground text-sm mb-2">Scholarship Structure:</h4>
                <ul className="space-y-2">
                  {scholarships.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <Trophy className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          </div>

          {bottomNote && (
            <AnimateIn delay={0.3}>
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">{bottomNote}</p>
              </div>
            </AnimateIn>
          )}
        </div>
      </section>
      <section className="py-20 glass-section" data-testid="section-how-to-apply">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3">{applyTitle}</h2>
            <p className="text-muted-foreground mb-10">{applySubtitle}</p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {applySteps.map((step: string, i: number) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="glass-card rounded-xl p-5 flex items-start gap-3 h-full">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-muted-foreground text-sm text-left">{step}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.4}>
            {applyBadge && (
              <Badge variant="outline" className="mb-4 glass-badge rounded-full text-primary">
                {applyBadge}
              </Badge>
            )}
            {applyCta && (
              <p className="text-foreground font-heading font-semibold text-lg mb-6">{applyCta}</p>
            )}
            <Button asChild size="lg" className="rounded-xl">
              <a href={applyUrl} target="_blank" rel="noopener noreferrer" data-testid="button-apply-bottom">
                {applyText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </AnimateIn>
        </div>
      </section>
      <section className="py-20" data-testid="section-enterprise">
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
