import { useState, useEffect, useRef } from "react";
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
import NetworkBg from "@/components/network-bg";
import patternBg from "@assets/pattern_white_1771718036073.png";
import automatiLogo from "@assets/automati_logo_nobg.png";

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
  const { count: clientCount, ref: clientRef } = useCountUp(23);
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }} />
        <NetworkBg />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <AnimateIn>
            <div className="flex justify-center mb-6" data-testid="badge-automati-tag">
              <img src={automatiLogo} alt="Automati" className="h-40 w-auto dark:invert" />
            </div>
          </AnimateIn>
          <AnimateIn delay={0.05}>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6" data-testid="text-automati-title">
              Your work, powered by{" "}
              <span className="text-primary">intelligence.</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10" data-testid="text-automati-subtitle">
              We design and build custom AI agent systems tailored to the way you work — whether that's running entire workflows on your behalf, supporting your decisions, generating content, handling communications, or anything in between. You tell us what you want to hand off. We make it happen.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-xl px-8" data-testid="button-automati-start" asChild>
                <a href="#pricing">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-8 glass-card-hover" data-testid="button-automati-how" asChild>
                <a href="#how-it-works">See How It Works</a>
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
              How It Works
            </Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3" data-testid="text-how-title">
              We design around your goals — not a template
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We don't offer a generic automation platform. We study how you work, what you're trying to achieve, and we engineer an AI system built specifically for that.
            </p>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Brain, step: "01", title: "Discovery", desc: "We start by understanding your goals, your current workflow, and the parts you most want to change or hand off — big or small." },
            { icon: Bot, step: "02", title: "Design & Build", desc: "We engineer a custom AI system around your exact needs — with the right level of intelligence, autonomy, and control for your situation." },
            { icon: ShieldCheck, step: "03", title: "You Stay in Command", desc: "Some systems run independently. Others wait for your go-ahead. You decide how much control to keep — we build it exactly that way." },
          ].map((s, i) => (
            <AnimateIn key={s.step} delay={i * 0.08}>
              <div className="glass-card-hover rounded-2xl p-7 h-full relative" data-testid={`card-step-${i}`}>
                <div className="absolute top-6 right-6 font-heading font-bold text-3xl text-primary/20">{s.step}</div>
                <div className="w-12 h-12 rounded-xl glass-badge flex items-center justify-center mb-5">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimateIn>
            <div>
              <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
                Who It's For
              </Badge>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-5" data-testid="text-who-title">
                You don't need to understand AI to benefit from it.
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                Whether you're a solo creator managing content and clients, a consultant drowning in admin, or a business with complex processes — if there's a workflow that could be smarter, faster, or handled without you, we can build a system for it.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                You only need to describe what you want to change. We figure out the rest, and we keep you in control of exactly as much as you want.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "Individuals" },
                { icon: Sparkles, label: "Creators & Writers" },
                { icon: Brain, label: "Freelancers" },
                { icon: HandshakeIcon, label: "Consultants" },
                { icon: Zap, label: "Small Teams" },
                { icon: Settings2, label: "Businesses" },
              ].map((p) => (
                <div key={p.label} className="glass-card-hover rounded-xl p-5 flex flex-col items-center text-center gap-2" data-testid={`card-audience-${p.label.toLowerCase().replace(/[\s&]+/g,'-')}`}>
                  <p.icon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{p.label}</span>
                </div>
              ))}
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
                    Your data stays yours. Always.
                  </h2>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed mb-4">
                  We guarantee full privacy and security across every system we build. Your workflows, data, and information are never shared, stored beyond what's necessary, or used for any purpose other than serving you.
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Every system we design is built with confidentiality at its core — not as an afterthought. What you share with us stays with us.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: ShieldCheck, title: "Full Confidentiality", desc: "Your data and workflow details are never shared with third parties." },
                  { icon: Brain, title: "Minimal Data Principle", desc: "We only work with what's strictly needed to build and run your system." },
                  { icon: Settings2, title: "Secure by Design", desc: "Privacy and security are engineered in from day one — not added later." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 glass-card-hover rounded-xl p-4" data-testid={`card-privacy-${item.title.toLowerCase().replace(/\s/g,'-')}`}>
                    <div className="w-9 h-9 rounded-lg glass-badge flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-sm text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
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
              <p className="text-muted-foreground text-sm">Happy Clients</p>
            </div>
            {[
              { value: "100%", label: "Custom-built" },
              { value: "Any", label: "Workflow or industry" },
              { value: "Full", label: "Control, always yours" },
              { value: "Zero", label: "Technical knowledge needed" },
            ].map((v) => (
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
              Pricing
            </Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3" data-testid="text-pricing-title">
              Simple, fair, and built to scale with you
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start with what you need. Refer a friend and get 10% off your subscription for every person you bring in.
            </p>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <AnimateIn delay={0.05}>
            <div className="glass-card-hover rounded-2xl p-7 h-full flex flex-col relative ring-2 ring-primary/40" data-testid="card-plan-subscription">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] bg-primary text-primary-foreground">
                Most Popular
              </Badge>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Subscription</p>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-1">Monthly</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-heading font-bold text-4xl text-primary">$15</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Ongoing access to your AI system — updates, improvements, and support as your needs evolve.
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Continuous AI system access", "Adjustments as you grow", "10% off per referral you bring", "Email support"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="rounded-xl" data-testid="button-plan-subscription" asChild>
                <a href="mailto:contact@mahmoodsalah.com?subject=Automati%20Subscription">Get Started</a>
              </Button>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <div className="glass-card-hover rounded-2xl p-7 h-full flex flex-col" data-testid="card-plan-onetime">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">One-Time Setup</p>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-1">Custom Build</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-heading font-bold text-4xl text-primary">$250</span>
                <span className="text-sm text-muted-foreground">one-time</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                A complete, custom-built AI system designed around your workflow — yours to keep, with no ongoing fees.
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Workflow discovery session", "Fully custom AI system", "Setup, testing & full handover", "No subscription required"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="rounded-xl glass-card-hover" data-testid="button-plan-onetime" asChild>
                <a href="mailto:contact@mahmoodsalah.com?subject=Automati%20Custom%20Setup">Get Started</a>
              </Button>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.15}>
            <div className="glass-card-hover rounded-2xl p-7 h-full flex flex-col" data-testid="card-plan-business">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">For Companies</p>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-1">Business</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-heading font-bold text-4xl text-primary">Custom</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Tailored pricing for teams and organisations with more complex systems and larger-scale needs.
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Multi-system AI architecture", "Team onboarding & training", "Priority support", "Flexible integrations"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="rounded-xl glass-card-hover" data-testid="button-plan-business" asChild>
                <a href="mailto:contact@mahmoodsalah.com?subject=Automati%20Business%20Inquiry">Get Started</a>
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <AnimateIn>
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden" data-testid="section-automati-cta">
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(210,140,80,0.18), transparent 70%)',
            }} />
            <div className="relative">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
                Your time is your most valuable asset.
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                The goal isn't to make your work feel robotic. It's to remove the parts of your day that don't deserve your attention — so you can invest it where it actually matters.
              </p>
              <Button size="lg" className="rounded-xl px-8" data-testid="button-automati-cta" asChild>
                <a href="mailto:contact@mahmoodsalah.com?subject=Automati%20Inquiry">
                  Tell Us What You Want to Change
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </AnimateIn>
      </section>
    </div>
  );
}
