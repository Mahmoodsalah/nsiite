import { useEffect, useRef, useState } from "react";
import { SiLinkedin, SiYoutube, SiInstagram, SiFacebook } from "react-icons/si";
import NetworkBg from "@/components/network-bg";
import mahmoodPortrait from "@assets/1a54ec53-5da8-4e83-87a5-02df3fc9d7ad_1776300934772.png";
import patternBg from "@assets/pattern_white_1771718036073.png";
import innovaLogo from "@assets/innova_nobg.png";
import bootcampAiLogo from "@assets/bootcampai_nobg.png";
import googleLogo from "@assets/google_nobg.png";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePageContent, getVal } from "@/hooks/use-content";

const socialIconMap: Record<string, any> = { linkedin: SiLinkedin, youtube: SiYoutube, instagram: SiInstagram, facebook: SiFacebook };

export default function Home() {
  const { data: content } = usePageContent("hireme");

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

  const companies = [
    { name: "BootcampAI", kind: "image" as const, src: bootcampAiLogo, scale: 1.73, tooltip: "Founding Director (Volunteer)" },
    { name: "Innova",     kind: "image" as const, src: innovaLogo,      scale: 1.35, tooltip: "Senior Data Scientist" },
    { name: "Udacity",   kind: "wordmark" as const, text: "Udacity",   textSize: "text-xl",  tooltip: "AI Mentor" },
    { name: "GLG",       kind: "wordmark" as const, text: "GLG",       textSize: "text-2xl", tooltip: "Council Member" },
    { name: "Nielsen",   kind: "wordmark" as const, text: "nielsen",   textSize: "text-2xl", tooltip: "Ex: Data acquisition Supervisor" },
    { name: "Google",    kind: "image" as const, src: googleLogo,      scale: 1.1, tooltip: "Ex: Google Ambassador and GDG Manager" },
  ];
  const companiesScrollRef = useRef<HTMLDivElement | null>(null);
  const [activeCompany, setActiveCompany] = useState(0);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

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

  const heroSubtitle = getVal(content, "hero", "subtitle", "");
  const socialLinks = getVal(content, "hero", "socialLinks", []);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden" style={{ minHeight: '100svh' }}>
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }} />
        <NetworkBg />

        <div className="relative z-10 flex flex-col md:grid md:grid-cols-2 md:grid-rows-[1fr_auto] md:items-end md:gap-x-8 lg:gap-x-12 max-w-6xl mx-auto px-0 md:px-6" style={{ minHeight: '100svh' }}>

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

              <span className="md:hidden text-primary block">
                <span className="whitespace-nowrap">
                  {typed}
                  <span
                    aria-hidden="true"
                    className="inline-block w-[2px] h-[0.9em] align-[-0.1em] ml-1 bg-primary animate-pulse"
                  />
                </span>
              </span>

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
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(210,140,80,0.38) 0%, rgba(200,120,60,0.13) 42%, transparent 70%)',
                maskImage: 'radial-gradient(ellipse 80% 90% at 50% 35%, black 60%, rgba(0,0,0,0.3) 95%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 50% 35%, black 60%, rgba(0,0,0,0.3) 95%)',
              }}
            />

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

          <div className="order-3 md:col-span-2 md:row-start-2 mt-2 md:mt-8 mb-10 md:mb-12 px-6 md:px-0 animate-fade-in-up animation-delay-400">
            <p
              className="text-xs uppercase tracking-[0.2em] text-foreground/70 mb-4 text-center md:text-left"
              data-testid="text-companies-label"
            >
              Worked with
            </p>
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
                  <Tooltip
                    key={c.name}
                    delayDuration={150}
                    open={openTooltip === c.name}
                    onOpenChange={(open) => setOpenTooltip(open ? c.name : null)}
                  >
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="
                          relative isolate shrink-0 md:shrink
                          h-24
                          w-[78%] sm:w-[44%] md:w-auto
                          snap-center md:snap-align-none
                          rounded-2xl glass-card-hover
                          flex items-center justify-center overflow-hidden
                          transition-all duration-300 group cursor-pointer
                        "
                        data-testid={`logo-company-${c.name.toLowerCase()}`}
                        style={{ transform: 'translateZ(0)' }}
                        onMouseEnter={() => setOpenTooltip(c.name)}
                        onMouseLeave={() => setOpenTooltip(null)}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          setOpenTooltip(openTooltip === c.name ? null : c.name);
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0 px-3 py-3">
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
                            <span className={`${c.textSize ?? 'text-3xl'} font-heading font-bold tracking-tight text-foreground/80 leading-none`}>
                              {c.text}
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center px-3 py-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {c.kind === "image" ? (
                            <img
                              src={c.src}
                              alt={c.name}
                              className="w-full h-full object-contain"
                              style={{ transform: `scale(${c.scale ?? 1})` }}
                            />
                          ) : (
                            <span
                              className={`${c.textSize ?? 'text-3xl'} font-heading font-bold tracking-tight leading-none`}
                              style={{ color: brandColor }}
                            >
                              {c.text}
                            </span>
                          )}
                        </div>
                      </button>
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
                      <span className="block text-[11px] uppercase tracking-[0.18em] text-foreground/80">
                        {c.tooltip}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

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
    </div>
  );
}
