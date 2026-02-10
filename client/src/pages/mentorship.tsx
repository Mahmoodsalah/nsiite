import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Code,
  Building2,
  CheckCircle,
  ArrowRight,
  Wrench,
  BookMarked,
  Network,
  Sparkles,
  TrendingUp,
  Heart,
  Shield,
  Users,
  Eye,
  MessageCircle,
} from "lucide-react";
import NetworkBg from "@/components/network-bg";

const plans = [
  {
    title: "Course Learning Support",
    price: "$150",
    duration: "1 hour",
    description:
      "Focused guidance on AI courses and learning paths. Get unstuck, understand concepts deeply, and accelerate your AI learning journey.",
    bestFor: "AI learners at any level",
    features: [
      "One-on-one mentoring session",
      "Course material review and explanation",
      "Study plan recommendations",
      "Resource curation for your goals",
    ],
    cta: "Book a Session",
    href: "mailto:mahmood.salah@email.com?subject=Course%20Learning%20Support",
    icon: BookOpen,
  },
  {
    title: "Personal Project Mentorship",
    price: "$500",
    duration: "4 hours",
    description:
      "Hands-on collaboration to bring your AI project to life. Get expert feedback, code reviews, and architecture guidance for your personal AI projects.",
    bestFor: "Aspiring AI engineers",
    features: [
      "Project architecture review",
      "Code review and best practices",
      "Model selection and optimization",
      "Deployment strategy guidance",
    ],
    cta: "Start Your Project",
    href: "mailto:mahmood.salah@email.com?subject=Personal%20Project%20Mentorship",
    icon: Code,
    popular: true,
  },
  {
    title: "Company Project Consulting",
    price: "$1,200",
    duration: "12 hours",
    description:
      "Strategic AI consulting for your organization. From feasibility studies to production deployment, get expert guidance on integrating AI into your business.",
    bestFor: "Teams & organizations",
    features: [
      "AI feasibility assessment",
      "Technical architecture planning",
      "Team training and upskilling",
      "Production deployment support",
    ],
    cta: "Get Started",
    href: "mailto:mahmood.salah@email.com?subject=Company%20Project%20Consulting",
    icon: Building2,
  },
];

const benefits = [
  {
    icon: Wrench,
    title: "Tools & Frameworks",
    desc: "I'll help you build confidence and skill in AI tools like TensorFlow, PyTorch, LangChain, and more.",
  },
  {
    icon: BookMarked,
    title: "Resources",
    desc: "I'll point you towards the best courses, papers, and content to accelerate your learning.",
  },
  {
    icon: Network,
    title: "Networking",
    desc: "I'll connect you with other AI professionals and expand your reach in the industry.",
  },
  {
    icon: Sparkles,
    title: "Opportunity",
    desc: "I'll make introductions and help you find AI roles, projects, and collaboration opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    desc: "I'll uncover blind spots and accelerate your growth as an AI engineer.",
  },
];

const mentoringStyle = [
  {
    icon: Heart,
    title: "Authenticity",
    desc: "No sugar-coated feedback. I care about your growth too much to not keep it real. We'll work through challenges and build better solutions, together.",
  },
  {
    icon: Shield,
    title: "Humility",
    desc: "AI is a rapidly evolving field. I don't claim to know everything, but I bring years of hands-on experience and a commitment to continuous learning.",
  },
  {
    icon: Users,
    title: "Equality",
    desc: "To me, you're more than just a mentee. You're a fellow AI practitioner. I'm not the only one teaching and you're not the only one learning.",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "I don't have all the answers, but I'm happy to share what I've learned from building real-world AI systems and guide you to useful resources.",
  },
];

export default function Mentorship() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <NetworkBg />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32">
          <h1
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6"
            data-testid="text-mentorship-title"
          >
            I haven't met you, and this is exciting...
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            But if you need an AI mentor, let's connect. Whether you're learning
            your first model or deploying production AI systems, I can help.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="section-mentorship-intro">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading font-bold text-3xl mb-6">
            Being an AI learner is tough.
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            It seems like every week there's a new model, framework, or research
            breakthrough to keep up with. Honestly, it can be overwhelming and
            intimidating. I know because I've been there. So whether you're new
            to AI or looking for expert guidance on your next project, I can help.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20" data-testid="section-plans">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">
            Mentorship Plans
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Choose the plan that fits your needs. Every plan includes personalized,
            one-on-one guidance tailored to your goals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <Card
                key={i}
                className={`relative flex flex-col ${
                  plan.popular ? "border-primary" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  <plan.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-1">
                    {plan.title}
                  </h3>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-heading font-bold text-3xl text-foreground">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs mb-4">
                    {plan.duration} of focused mentorship
                  </p>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {plan.description}
                  </p>

                  <p className="text-xs text-muted-foreground mb-4">
                    <span className="font-semibold text-foreground">Best for: </span>
                    {plan.bestFor}
                  </p>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-muted-foreground text-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    <a
                      href={plan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`button-plan-${i}`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA mid */}
      <section className="py-16 bg-card" data-testid="section-mentorship-cta">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading font-bold text-2xl text-foreground mb-3">
            If you're wanting to level up, mentorship helps.
          </h2>
          <p className="text-muted-foreground mb-6">
            Schedule a free consultation to ask questions, discuss details, and
            decide if it's a fit.
          </p>
          <Button asChild variant="outline">
            <a
              href="mailto:mahmood.salah@email.com?subject=Mentorship%20Inquiry"
              data-testid="button-introduce"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Introduce yourself
            </a>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20" data-testid="section-benefits">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">
            Benefits of Mentorship
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            I know a thing or two because I've done a thing or two in my AI
            career, and I'm committed to helping you make use of that knowledge.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <Card key={i} className="hover-elevate">
                <CardContent className="p-6">
                  <b.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    {b.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mentoring Style */}
      <section className="py-20 bg-card" data-testid="section-mentoring-style">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-3 text-center">
            My Mentoring Style
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            I strive to function as a catalyst and challenge you to grow as both
            an AI practitioner and a professional. I care about the details and
            will encourage you to think, plan, and dream.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mentoringStyle.map((s, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <s.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        {s.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-3">
            Book a Consult
          </h2>
          <p className="text-muted-foreground mb-8">
            Thinking about mentorship? Let's talk about it. The first call is on
            me.
          </p>
          <Button asChild size="lg">
            <a
              href="mailto:mahmood.salah@email.com?subject=Mentorship%20Consultation"
              data-testid="button-book-consult"
            >
              Introduce yourself
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
