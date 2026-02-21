import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Bot,
  Eye,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import NetworkBg from "@/components/network-bg";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";

export default function Consultation() {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("mahmood.salah@email.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <NetworkBg />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32">
          <h1
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6 animate-fade-in-up"
            data-testid="text-consultation-title"
          >
            Need a Consultation?
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
            Whether you need help with AI strategy, building ML pipelines, or
            transforming your business with data-driven solutions, I'm here to help.
            Let's discuss how I can contribute to your next project.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-400">
            <Button asChild>
              <a href="mailto:mahmood.salah@email.com" data-testid="button-send-email">
                <Mail className="w-4 h-4 mr-2" />
                Send me an email
              </a>
            </Button>
            <Button variant="outline" onClick={handleCopyEmail} data-testid="button-copy-email">
              {emailCopied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy email
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-consultation-services">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimateIn delay={0}>
              <Card className="hover-elevate hover:border-primary/20 transition-colors duration-300">
                <CardContent className="p-6 text-center">
                  <Brain className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    AI Strategy
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Get expert guidance on integrating AI into your business workflows
                    and operations.
                  </p>
                </CardContent>
              </Card>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <Card className="hover-elevate hover:border-primary/20 transition-colors duration-300">
                <CardContent className="p-6 text-center">
                  <Eye className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    Computer Vision
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Custom solutions for image recognition, video analytics, and
                    visual AI systems.
                  </p>
                </CardContent>
              </Card>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <Card className="hover-elevate hover:border-primary/20 transition-colors duration-300">
                <CardContent className="p-6 text-center">
                  <Bot className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    AI Agents & LLMs Systems
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Build intelligent AI agents and LLMs systems that automate complex tasks
                    and enhance productivity.
                  </p>
                </CardContent>
              </Card>
            </AnimateIn>
          </div>
        </div>
      </section>
    </div>
  );
}
