import { useEffect } from "react";
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

        {/* ── DESKTOP IMAGE — bleeds to right edge with left-side fade ── */}
        <div
          className="hidden md:block absolute top-0 right-0 h-full w-[58%] lg:w-[55%] pointer-events-none animate-fade-in-up animation-delay-200"
          aria-hidden="true"
        >
          {/* Warm cream/peach glow behind photo */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 80% at 35% 50%, rgba(230,170,120,0.35) 0%, rgba(230,170,120,0.12) 45%, transparent 75%)',
            }}
          />
          {/* Photo with horizontal fade mask on the left */}
          <img
            src={mahmoodPortrait}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.85) 38%, black 55%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.85) 38%, black 55%)',
            }}
          />
        </div>

        {/* ── CONTENT ROW — text aligned with nav container ── */}
        <div className="relative z-10 flex flex-col md:block max-w-6xl mx-auto px-0 md:px-6" style={{ minHeight: '100svh' }}>

          {/* ── MOBILE IMAGE — centered square with radial glow ── */}
          <div
            className="md:hidden relative overflow-hidden mx-auto mt-16 w-[min(90vw,90svh)] h-[min(90vw,90svh)] animate-fade-in-up animation-delay-200 order-1"
            style={{ aspectRatio: '1 / 1' }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(210,140,80,0.38) 0%, rgba(200,120,60,0.13) 42%, transparent 70%)'
            }} />
            <img
              src={mahmoodPortrait}
              alt="Mahmood Salah"
              className="absolute inset-0 w-full h-full object-cover"
              data-testid="img-hero-portrait"
            />
          </div>

          {/* ── TEXT COLUMN — aligned with header logo ── */}
          <div className="
            flex flex-col justify-center
            md:min-h-screen md:max-w-xl
            px-6 md:px-0
            pt-6 pb-10 md:py-16
            text-center md:text-left
            order-2
          ">
            <h1
              className="font-heading font-bold text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl text-foreground leading-tight mb-5 animate-fade-in-up"
              data-testid="text-hero-title"
            >
              {heroTitle}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-base lg:text-lg max-w-lg mx-auto md:mx-0 mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
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
