import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import NetworkBg from "@/components/network-bg";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";

const highlights = [
  {
    icon: GraduationCap,
    title: "Academic + Practical Integration",
    desc: "Build strong theoretical and mathematical understanding with hands-on practice.",
  },
  {
    icon: Puzzle,
    title: "Project-Based Learning",
    desc: "Every module produces a real, portfolio-worthy project.",
  },
  {
    icon: Handshake,
    title: "Career Support & Mentorship",
    desc: "6 month free learning with extended mentorship and guidance after graduation.",
  },
  {
    icon: Globe,
    title: "International Collaboration",
    desc: "Unlock opportunities to develop and commercialize ideas with European partners.",
  },
  {
    icon: Lightbulb,
    title: "Non-Profit Scholarships",
    desc: "Market value: 12,000 SAR. Join for only 2,400 SAR after 80% scholarship -- or secure one of 30 full scholarships (100%).",
  },
];

const whatYoullLearn = [
  "Core mathematics and architectures behind LLMs.",
  "The mechanics of attention, tokenization, and transformers.",
  "Fine-tuning pre-trained models and building custom AI agents.",
  "Building, deploying, and optimizing real-world LLM applications.",
];

const programDetails = [
  { icon: Clock, label: "Duration", value: "10 Weeks" },
  { icon: HeadphonesIcon, label: "Support", value: "24/7 AI assistant + daily engineer mentorship" },
  { icon: Layers, label: "Hands-On Projects", value: "Each week includes a working project prototype" },
];

const howToApply = [
  "Submit your application through our official form.",
  "Complete a short technical challenge to assess readiness.",
  "Receive scholarship results and secure your seat.",
  "Begin your 10-week transformation into an AI Engineer.",
];

const companyBenefits = [
  "Tailored AI training and workforce upskilling programs.",
  "Dedicated mentorship from BootcampAI experts.",
  "Collaboration opportunities through our European partnerships.",
  "Access to pre-trained AI talents for future hiring needs.",
];

export default function Bootcamp() {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("mahmood.salah@email.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <NetworkBg />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32">
          <Badge variant="outline" className="mb-6 text-primary border-primary/30 animate-fade-in">
            Applications Now Open
          </Badge>
          <h1
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6 animate-fade-in-up"
            data-testid="text-bootcamp-title"
          >
            Become the Next LLM Engineer with{" "}
            <span className="text-primary">BootcampAI</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
            The region's first non-profit AI bootcamp platform empowering the
            next generation of AI engineers through intensive, project-based
            learning.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 animate-fade-in-up animation-delay-300">
            <div className="flex items-center gap-2 text-foreground">
              <BrainIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">10 Weeks of Deep AI Training</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <BriefcaseIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Real Projects & Global Collaboration</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Scholarships up to 100%</span>
            </div>
          </div>

          <div className="animate-fade-in-up animation-delay-400">
            <Button asChild size="lg">
              <a
                href="https://forms.gle/nCeyqSxashm8Q1bv5"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-apply-hero"
              >
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* About BootcampAI */}
      <section className="py-20 bg-card" data-testid="section-about-bootcamp">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-6 text-center">
              About BootcampAI
            </h2>
            <div className="max-w-3xl mx-auto space-y-4 mb-12">
              <p className="text-muted-foreground leading-relaxed">
                BootcampAI is the first non-profit platform in the Arab region
                dedicated to AI education through immersive bootcamps. Our mission
                is to make high-quality Artificial Intelligence education
                accessible, practical, and career-transforming.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We combine academic rigor with hands-on practice: every topic
                includes real project implementation that bridges the gap between
                theory and real-world solutions. Participants not only learn how AI
                models work but also build and deploy them under expert mentorship.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <AnimateIn delay={0.1}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                    Throughout the bootcamp, participants enjoy:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Daily mentoring from experienced AI engineers.",
                      "24/7 AI-powered assistance for technical support.",
                      "Weekly practical projects reinforcing each concept.",
                      "A collaborative learning environment designed to inspire innovation.",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                    After completing the program, graduates receive:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Three months of free mentorship to support further growth.",
                      "Access to advanced, specialized AI courses.",
                      "Real paths to commercializing their projects through European partnerships.",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Why Choose BootcampAI */}
      <section className="py-20" data-testid="section-why-choose">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">
              Why Choose BootcampAI Programs
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              What sets BootcampAI apart is our commitment to education with impact
              -- not only teaching AI but empowering learners to create, innovate,
              and lead in the field.
            </p>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <AnimateIn key={i} delay={i * 0.08}>
                <Card className="hover-elevate hover:border-primary/20 transition-colors duration-300">
                  <CardContent className="p-6">
                    <h.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-heading font-semibold text-foreground mb-2">
                      {h.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {h.desc}
                    </p>
                  </CardContent>
                </Card>
              </AnimateIn>
            ))}
          </div>
          <AnimateIn delay={0.4}>
            <p className="text-center text-foreground font-heading font-semibold text-lg mt-10">
              Your future as an AI Engineer starts here.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* LLM & AI Agent Bootcamp */}
      <section className="py-20 bg-card" data-testid="section-llm-bootcamp">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">
              LLM & AI Agent Bootcamp
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              BootcampAI's flagship 10-week intensive program designed for
              professionals and learners who want to master Large Language Models
              (LLMs) and AI Agent frameworks.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <AnimateIn delay={0.1}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    What You'll Learn
                  </h3>
                  <ul className="space-y-3">
                    {whatYoullLearn.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Program Details
                  </h3>
                  <div className="space-y-4 mb-6">
                    {programDetails.map((d, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <d.icon className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-foreground text-sm">
                            {d.label}:{" "}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {d.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    Scholarship Structure:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3 text-muted-foreground text-sm">
                      <Trophy className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      30 Fully Funded Scholarships (100%)
                    </li>
                    <li className="flex items-start gap-3 text-muted-foreground text-sm">
                      <Trophy className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      30 Partially Funded Seats (80%), reducing cost to 2,400 SAR | 630 $ only
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimateIn>
          </div>

          <AnimateIn delay={0.3}>
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-2">
                Top participants receive Technical Excellence Awards and real
                opportunities to commercialize their bootcamp projects with
                European collaborators.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20" data-testid="section-how-to-apply">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3">
              How to Apply
            </h2>
            <p className="text-muted-foreground mb-10">
              Applying to BootcampAI is simple:
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {howToApply.map((step, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <Card>
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-muted-foreground text-sm text-left">{step}</p>
                  </CardContent>
                </Card>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.4}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              Applications are now open
            </Badge>
            <p className="text-foreground font-heading font-semibold text-lg mb-6">
              Take your step toward leading the next AI revolution.
            </p>
            <Button asChild size="lg">
              <a
                href="https://forms.gle/ergHXAYYbaoSmFtg7"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-apply-bottom"
              >
                Apply Now -- Become an LLM Engineer
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </AnimateIn>
        </div>
      </section>

      {/* Enterprise Programs */}
      <section className="py-20 bg-card" data-testid="section-enterprise">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
            <Building2 className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-heading font-bold text-3xl text-foreground mb-3">
              For Companies / Enterprise Programs
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              BootcampAI also partners with organizations looking to upskill
              their teams or build AI capabilities from within. We offer
              customized enterprise AI programs that integrate with your
              company's strategy.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {companyBenefits.map((benefit, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <Card>
                  <CardContent className="p-5 flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">{benefit}</p>
                  </CardContent>
                </Card>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.4}>
            <div className="text-center mt-10">
              <p className="text-foreground font-heading font-semibold mb-6">
                Empower your organization with BootcampAI's innovation-driven
                training.
              </p>
              <Button
                onClick={handleCopyEmail}
                size="lg"
                data-testid="button-copy-email-enterprise"
              >
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
