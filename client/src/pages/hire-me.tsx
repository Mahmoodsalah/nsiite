import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Bot,
  Cloud,
  Eye,
  Loader2,
} from "lucide-react";
import { SiLinkedin, SiYoutube, SiInstagram, SiFacebook } from "react-icons/si";
import NetworkBg from "@/components/network-bg";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";
import mahmoodPortrait from "@assets/1a54ec53-5da8-4e83-87a5-02df3fc9d7ad_1776300934772.png";
import mahmoodImg from "@assets/mahmood.jpg";
import patternBg from "@assets/pattern_white_1771718036073.png";
import innovaLogo from "@assets/innova_nobg.png";
import bootcampAiLogo from "@assets/bootcampai_nobg.png";
import googleLogo from "@assets/google_nobg.png";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePageContent, getVal } from "@/hooks/use-content";

const iconMap: Record<string, any> = { Brain, Bot, Cloud, Eye };
const socialIconMap: Record<string, any> = { linkedin: SiLinkedin, youtube: SiYoutube, instagram: SiInstagram, facebook: SiFacebook };

export default function HireMe() {
  const { data: content, isLoading } = usePageContent("hireme");

  useEffect(() => {
    if (window.location.hash === "#about") {
      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const heroTitle = getVal(content, "hero", "title", "Senior Data Scientist, AI Engineer, and Consultant");
  const heroSubtitle = getVal(content, "hero", "subtitle", "");

  const titles = [
    "Senior Data Scientist",
    "AI Solutions Architect",
    "AI Transformation Consultant",
  ];
  const [titleIndex, setTitleIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const current = titles[titleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (typed.length < current.length) {
        timeout = setTimeout(() => setTyped(current.slice(0, typed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 1400);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 600);
    } else {
      if (typed.length > 0) {
        timeout = setTimeout(() => setTyped(current.slice(0, typed.length - 1)), 40);
      } else {
        setTitleIndex((i) => (i + 1) % titles.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [typed, phase, titleIndex]);
  // Companies carousel — track active dot for mobile swipe indicator
  const companies = [
    { name: "BootcampAI", kind: "image" as const, src: bootcampAiLogo, scale: 1.5, tooltip: "Founding Director (Volunteer)" },
    { name: "Innova", kind: "image" as const, src: innovaLogo, scale: 1.25, tooltip: "Senior Data Scientist" },
    { name: "Udacity", kind: "wordmark" as const, text: "Udacity", tooltip: "AI Mentor" },
    { name: "GLG", kind: "wordmark" as const, text: "GLG", tooltip: "Council Member" },
    { name: "Nielsen", kind: "wordmark" as const, text: "nielsen", tooltip: "Ex: Data acquisition Supervisor" },
    { name: "Google", kind: "image" as const, src: googleLogo, scale: 1, tooltip: "Ex: Google Ambassador and GDG Manager" },
  ];
  const companiesScrollRef = useRef<HTMLDivElement | null>(null);
  const [activeCompany, setActiveCompany] = useState(0);

  useEffect(() => {
    const el = companiesScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / companies.length;
      const idx = Math.round((el.scrollLeft + el.clientWidth / 2 - cardWidth / 2) / cardWidth);
      setActiveCompany(Math.max(0, Math.min(companies.length - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [companies.length]);

  const scrollToCompany = (idx: number) => {
    const el = companiesScrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / companies.length;
    el.scrollTo({ left: cardWidth * idx, behavior: "smooth" });
  };

  const socialLinks = getVal(content, "hero", "socialLinks", []);
  const aboutTitle = getVal(content, "about", "title", "About Me");
  const bio1 = getVal(content, "about", "bio1", "");
  const bio2 = getVal(content, "about", "bio2", "");
  const coreCompetencies = getVal(content, "about", "coreCompetencies", []);
  const projectsTitle = getVal(content, "projects", "title", "Projects");
  const projectsSubtitle = getVal(content, "projects", "subtitle", "");
  const projects = getVal(content, "projects", "items", []);
  const resumeEmbedUrl = getVal(content, "resume", "embedUrl", "");
  const resumeViewUrl = getVal(content, "resume", "viewUrl", "");
  const testimonialsTitle = getVal(content, "testimonials", "title", "Testimonials");
  const testimonialsSubtitle = getVal(content, "testimonials", "subtitle", "");
  const testimonials = getVal(content, "testimonials", "items", []);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden" style={{ minHeight: '100svh' }}>
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }} />
        <NetworkBg />

        {/* Full-height flex wrapper — aligns with header's max-w-6xl + px-6 */}
        <div className="relative z-10 flex flex-col md:grid md:grid-cols-2 md:grid-rows-[1fr_auto] md:items-end md:gap-x-8 lg:gap-x-12 max-w-6xl mx-auto px-0 md:px-6" style={{ minHeight: '100svh' }}>

          {/* ── TEXT COLUMN ── */}
          <div className="
            min-w-0
            flex flex-col justify-center
            px-6 md:px-0
            pt-6 pb-10 md:pt-20 md:pb-8
            text-center md:text-left
            order-2 md:order-1
          ">
            <h1
              className="font-heading font-bold text-xl sm:text-3xl md:text-2xl lg:text-3xl xl:text-4xl text-foreground leading-tight mb-5 animate-fade-in-up"
              data-testid="text-hero-title"
            >
              <span className="block text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl">I'm</span>

              {/* Mobile: simple centered typed text, no spacer (so it stays visually centered) */}
              <span className="md:hidden text-primary block">
                <span className="whitespace-nowrap">
                  {typed}
                  <span
                    aria-hidden="true"
                    className="inline-block w-[2px] h-[0.9em] align-[-0.1em] ml-1 bg-primary animate-pulse"
                  />
                </span>
              </span>

              {/* Desktop: stacked grid keeps width reserved so layout never shifts */}
              <span className="hidden md:inline-grid text-primary align-baseline">
                <span aria-hidden="true" className="invisible whitespace-nowrap [grid-area:1/1]">
                  AI Transformation Consultant
                </span>
                <span className="whitespace-nowrap [grid-area:1/1] text-left">
                  {typed}
                  <span
                    aria-hidden="true"
                    className="inline-block w-[3px] md:w-[4px] h-[0.9em] align-[-0.1em] ml-1 bg-primary animate-pulse"
                  />
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-base lg:text-lg max-w-lg mx-auto md:mx-0 mb-8 leading-relaxed text-justify animate-fade-in-up animation-delay-200">
              {heroSubtitle}
            </p>
            <div className="flex justify-center md:justify-start gap-3 animate-fade-in-up animation-delay-400">
              {socialLinks.map((link: any, i: number) => {
                const Icon = socialIconMap[link.platform] || SiLinkedin;
                return (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl glass-card-hover flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300"
                    data-testid={`link-hero-social-${i}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── IMAGE COLUMN — square, bottom aligned with social buttons ── */}
          <div
            className="
              relative overflow-hidden
              order-1 md:order-2 md:flex-1
              mt-20 md:mt-0 md:mb-0
              mx-auto md:mx-0
              w-[min(90vw,90svh)] h-[min(90vw,90svh)]
              md:w-auto md:h-auto md:max-w-full
              animate-fade-in-up animation-delay-200
            "
            style={{ aspectRatio: '1 / 1' }}
          >
            {/* Amber radial glow — fades at bottom */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(210,140,80,0.38) 0%, rgba(200,120,60,0.13) 42%, transparent 70%)',
                maskImage: 'radial-gradient(ellipse 80% 90% at 50% 35%, black 60%, rgba(0,0,0,0.3) 95%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 50% 35%, black 60%, rgba(0,0,0,0.3) 95%)',
              }}
            />

            {/* Concentric circle rings — fade out at bottom */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              style={{
                maskImage: 'radial-gradient(ellipse 80% 90% at 50% 35%, black 60%, rgba(0,0,0,0.3) 95%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 50% 35%, black 60%, rgba(0,0,0,0.3) 95%)',
              }}
            >
              <div className="relative" style={{ width: '86%', aspectRatio: '1' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(251,191,36,0.14)' }} />
                <div style={{ position: 'absolute', inset: '14%', borderRadius: '50%', border: '1px solid rgba(251,191,36,0.22)' }} />
                <div style={{ position: 'absolute', inset: '28%', borderRadius: '50%', border: '1px solid rgba(251,191,36,0.32)' }} />
              </div>
            </div>

            {/* Portrait image — fades at bottom */}
            <img
              src={mahmoodPortrait}
              alt="Mahmood Salah"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                maskImage: 'radial-gradient(ellipse 85% 95% at 50% 35%, black 65%, rgba(0,0,0,0.3) 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 85% 95% at 50% 35%, black 65%, rgba(0,0,0,0.3) 100%)',
              }}
              data-testid="img-hero-portrait"
            />
          </div>

          {/* ── Companies worked with — full width row under social buttons + photo ── */}
          <div className="order-3 md:col-span-2 md:row-start-2 mt-2 md:mt-8 mb-10 md:mb-12 px-6 md:px-0 animate-fade-in-up animation-delay-400">
            <p
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70 mb-4 text-center md:text-left"
              data-testid="text-companies-label"
            >
              Worked with
            </p>
            {/* Desktop: equal-width grid, all logos in one row.
                Mobile: horizontal swipeable carousel with snap + dot indicator. */}
            <div
              ref={companiesScrollRef}
              className="
                flex md:grid md:grid-cols-6 gap-3 md:gap-4
                overflow-x-auto md:overflow-visible
                snap-x snap-mandatory md:snap-none
                -mx-6 md:mx-0 px-6 md:px-0
                pb-2 md:pb-0
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
              "
            >
              {companies.map((c) => {
                const brandColor =
                  c.name === "Udacity" ? "#02b3e4"
                  : c.name === "GLG" ? "#003a70"
                  : c.name === "Nielsen" ? "#0033a0"
                  : undefined;
                return (
                  <Tooltip key={c.name} delayDuration={150}>
                    <TooltipTrigger asChild>
                      <div
                        className="
                          relative shrink-0 md:shrink
                          h-24
                          w-[78%] sm:w-[44%] md:w-auto
                          snap-center md:snap-align-none
                          rounded-2xl glass-card-hover
                          flex items-center justify-center overflow-hidden
                          transition-all duration-300 group cursor-pointer
                        "
                        data-testid={`logo-company-${c.name.toLowerCase()}`}
                      >
                        {/* Default: dark grey mask/wordmark, larger */}
                        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0 px-2 py-2">
                          {c.kind === "image" ? (
                            <div
                              aria-label={c.name}
                              role="img"
                              className="bg-foreground/80 w-full h-full"
                              style={{
                                WebkitMaskImage: `url(${c.src})`,
                                maskImage: `url(${c.src})`,
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center',
                                maskPosition: 'center',
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                transform: `scale(${c.scale ?? 1})`,
                              }}
                            />
                          ) : (
                            <span className="text-3xl font-heading font-bold tracking-tight text-foreground/80 leading-none">
                              {c.text}
                            </span>
                          )}
                        </div>

                        {/* Hover: real-color logo (no inline name) */}
                        <div className="absolute inset-0 flex items-center justify-center px-2 py-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {c.kind === "image" ? (
                            <img
                              src={c.src}
                              alt={c.name}
                              className="w-full h-full object-contain"
                              style={{ transform: `scale(${c.scale ?? 1})` }}
                            />
                          ) : (
                            <span
                              className="text-3xl font-heading font-bold tracking-tight leading-none"
                              style={{ color: brandColor }}
                            >
                              {c.text}
                            </span>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                      <TooltipContent
                      side="top"
                      sideOffset={10}
                      className="
                        liquid-tooltip
                        border-0 px-4 py-2.5 rounded-2xl
                        text-sm font-heading font-semibold
                      "
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: brandColor || "hsl(var(--primary))" }}
                        />
                        <span className="text-foreground">{c.name}</span>
                      </div>
                      <span
                        className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5"
                      >
                        {c.tooltip}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Mobile-only dot indicator + swipe hint */}
            <div className="md:hidden mt-4 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5">
                {companies.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => scrollToCompany(i)}
                    aria-label={`Go to ${c.name}`}
                    data-testid={`dot-company-${i}`}
                    className={`
                      transition-all duration-300 rounded-full
                      ${i === activeCompany
                        ? "w-6 h-1.5 bg-primary"
                        : "w-1.5 h-1.5 bg-foreground/25 hover:bg-foreground/40"}
                    `}
                  />
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                Swipe to see more
              </p>
            </div>
          </div>

        </div>
      </section>

      <div id="about" className="max-w-6xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-24">
            <AnimateIn>
              <section data-testid="section-about">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                  <div className="md:col-span-1 flex justify-center">
                    <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-primary/20 animate-scale-in shadow-lg shadow-primary/10">
                      <img
                        src={mahmoodImg}
                        alt="Mahmood Salah"
                        className="w-full h-full object-cover"
                        data-testid="img-profile"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h2 className="font-heading font-bold text-3xl text-foreground mb-4">
                      {aboutTitle}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">{bio1}</p>
                    <p className="text-muted-foreground leading-relaxed mb-8">{bio2}</p>

                    <h3 className="font-heading font-semibold text-xl text-foreground mb-4">
                      Core Competencies
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {coreCompetencies.map((comp: any) => {
                        const CompIcon = iconMap[comp.icon] || Brain;
                        return (
                          <div key={comp.label} className="glass-card-hover rounded-xl text-center py-6 px-4">
                            <CompIcon className="w-8 h-8 mx-auto mb-3 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                              {comp.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </AnimateIn>

            <AnimateIn>
              <section data-testid="section-projects">
                <h2 className="font-heading font-bold text-3xl text-foreground mb-2">
                  {projectsTitle}
                </h2>
                <p className="text-muted-foreground mb-8">{projectsSubtitle}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project: any, i: number) => (
                    <AnimateIn key={i} delay={i * 0.05}>
                      <div className="glass-card-hover rounded-xl p-6 h-full group">
                        <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(project.tags || []).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs glass-badge rounded-full">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </AnimateIn>
                  ))}
                </div>
              </section>
            </AnimateIn>

            {resumeEmbedUrl && (
              <AnimateIn>
                <section data-testid="section-resume">
                  <h2 className="font-heading font-bold text-3xl text-foreground mb-6">
                    Resume
                  </h2>
                  <div className="w-full rounded-2xl overflow-hidden glass-card">
                    <iframe
                      src={resumeEmbedUrl}
                      className="w-full h-[800px]"
                      allow="autoplay"
                      title="Mahmood Salah Resume"
                      data-testid="iframe-resume"
                    />
                  </div>
                  {resumeViewUrl && (
                    <p className="text-muted-foreground text-sm mt-3 text-center">
                      Can't see the resume?{" "}
                      <a href={resumeViewUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Open in Google Drive
                      </a>
                    </p>
                  )}
                </section>
              </AnimateIn>
            )}

            <AnimateIn>
              <section data-testid="section-testimonials">
                <h2 className="font-heading font-bold text-3xl text-foreground mb-2">
                  {testimonialsTitle}
                </h2>
                <p className="text-muted-foreground mb-8">{testimonialsSubtitle}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((t: any, i: number) => (
                    <AnimateIn key={i} delay={i * 0.1}>
                      <div className="glass-card-hover rounded-xl p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={t.image}
                            alt={t.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-primary/20"
                            data-testid={`img-testimonial-${i}`}
                          />
                          <div>
                            <h3 className="font-heading font-semibold text-foreground">
                              {t.name}
                            </h3>
                            <p className="text-muted-foreground text-xs">{t.title}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed italic">
                          "{t.text}"
                        </p>
                      </div>
                    </AnimateIn>
                  ))}
                </div>
              </section>
            </AnimateIn>
          </div>
        )}
      </div>
    </div>
  );
}
