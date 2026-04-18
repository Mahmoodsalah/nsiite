import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Clock,
  Sparkles,
  ShieldCheck,
  Workflow,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Brain,
  HandshakeIcon,
} from "lucide-react";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";
import NetworkBg from "@/components/network-bg";
import patternBg from "@assets/pattern_white_1771718036073.png";

export default function Automati() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }} />
        <NetworkBg />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <AnimateIn>
            <Badge variant="outline" className="glass-badge rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] mb-6" data-testid="badge-automati-tag">
              <Sparkles className="w-3 h-3 mr-2 text-primary" />
              AI Automation Service
            </Badge>
          </AnimateIn>
          <AnimateIn delay={0.05}>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6" data-testid="text-automati-title">
              Automate the work that{" "}
              <span className="text-primary">drains your time.</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10" data-testid="text-automati-subtitle">
              We build custom AI agent systems that handle the repetitive parts of your work — so you can focus on what actually moves your life or business forward.
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

      {/* VALUE / OUTCOMES */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <AnimateIn>
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3" data-testid="text-outcomes-title">
              Reclaim hours every week
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stop spending your day on follow-ups, sorting, copying data, reports, and admin work. Let automation do the heavy lifting.
            </p>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Clock, title: "More Time", desc: "Reclaim hours each week from repetitive tasks." },
            { icon: ShieldCheck, title: "Fewer Mistakes", desc: "Consistent execution, every single time." },
            { icon: Zap, title: "Less Stress", desc: "Stop dreading the boring parts of your day." },
            { icon: Sparkles, title: "Higher Value", desc: "Focus on better decisions and real growth." },
          ].map((o, i) => (
            <AnimateIn key={o.title} delay={i * 0.05}>
              <div className="glass-card-hover rounded-2xl p-6 h-full" data-testid={`card-outcome-${i}`}>
                <div className="w-12 h-12 rounded-xl glass-badge flex items-center justify-center mb-4">
                  <o.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{o.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{o.desc}</p>
              </div>
            </AnimateIn>
          ))}
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
              Built around your workflow — not a template
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We study how you actually work, then design an AI system around your process, your goals, and your comfort level.
            </p>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Brain, step: "01", title: "We Study Your Workflow", desc: "Tell us what you do, what takes too long, or what feels boring. We map every repetitive step." },
            { icon: Workflow, step: "02", title: "We Design Around You", desc: "We build an automation tailored to your process — not a generic one-size-fits-all template." },
            { icon: Bot, step: "03", title: "You Stay In Control", desc: "Some systems run fully on their own. Others wait for your approval. The choice is always yours." },
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
                You don't need to be technical.
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                You only need to explain what you want to simplify — we handle the rest. If a task can be automated safely, we automate it. If it needs human judgment, we keep you in control.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                Any workflow with repeated steps, clear patterns, or decision-based actions can usually be improved with AI automation.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "Individuals" },
                { icon: Sparkles, label: "Creators" },
                { icon: Brain, label: "Freelancers" },
                { icon: HandshakeIcon, label: "Consultants" },
                { icon: Workflow, label: "Small Teams" },
                { icon: Bot, label: "Businesses" },
              ].map((p) => (
                <div key={p.label} className="glass-card-hover rounded-xl p-5 flex flex-col items-center text-center gap-2" data-testid={`card-audience-${p.label.toLowerCase().replace(/\s/g,'-')}`}>
                  <p.icon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{p.label}</span>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <AnimateIn>
          <div className="text-center mb-12">
            <Badge variant="outline" className="glass-badge rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
              Pricing
            </Badge>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3" data-testid="text-pricing-title">
              Simple, fair, flexible
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start small, scale when you're ready. Refer a friend and save 10% on your subscription for every referral.
            </p>
          </div>
        </AnimateIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Subscription */}
          <AnimateIn delay={0.05}>
            <div className="glass-card-hover rounded-2xl p-7 h-full flex flex-col" data-testid="card-plan-subscription">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Subscription</p>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-1">Monthly</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-heading font-bold text-4xl text-primary">$15</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Best for individuals starting their automation journey.
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Ongoing AI automation access", "Workflow updates as you grow", "10% off per referral", "Email support"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="rounded-xl glass-card-hover" data-testid="button-plan-subscription" asChild>
                <a href="mailto:contact@mahmoodsalah.com?subject=Automati%20Subscription">Start Subscription</a>
              </Button>
            </div>
          </AnimateIn>

          {/* One-time — featured */}
          <AnimateIn delay={0.1}>
            <div className="glass-card-hover rounded-2xl p-7 h-full flex flex-col relative ring-2 ring-primary/40" data-testid="card-plan-onetime">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] bg-primary text-primary-foreground">
                Most Popular
              </Badge>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">One-Time Setup</p>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-1">Custom Build</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-heading font-bold text-4xl text-primary">$250</span>
                <span className="text-sm text-muted-foreground">one-time</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                A complete automation system designed and delivered for your exact workflow.
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Workflow discovery session", "Custom AI agent build", "Setup, testing, handover", "Yours to keep — no monthly fee"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="rounded-xl" data-testid="button-plan-onetime" asChild>
                <a href="mailto:contact@mahmoodsalah.com?subject=Automati%20Custom%20Setup">Book Custom Setup</a>
              </Button>
            </div>
          </AnimateIn>

          {/* Business */}
          <AnimateIn delay={0.15}>
            <div className="glass-card-hover rounded-2xl p-7 h-full flex flex-col" data-testid="card-plan-business">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">For Companies</p>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-1">Business</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-heading font-bold text-4xl text-primary">Custom</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Pricing scaled to the size and complexity of your team's workflow.
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {["Multi-workflow automation", "Team onboarding & training", "Priority support", "Tailored integrations"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="rounded-xl glass-card-hover" data-testid="button-plan-business" asChild>
                <a href="mailto:contact@mahmoodsalah.com?subject=Automati%20Business%20Inquiry">Talk to Us</a>
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
                Make your time work for you.
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                The goal isn't to make your work feel robotic. It's to remove the robotic parts from your day — so you can live better, work smarter, and free up time for what matters.
              </p>
              <Button size="lg" className="rounded-xl px-8" data-testid="button-automati-cta" asChild>
                <a href="mailto:contact@mahmoodsalah.com?subject=Automati%20Inquiry">
                  Tell Us What to Automate
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
