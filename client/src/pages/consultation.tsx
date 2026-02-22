import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Bot,
  Eye,
  Mail,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import NetworkBg from "@/components/network-bg";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";
import { usePageContent, getVal } from "@/hooks/use-content";
import patternBg from "@assets/pattern_white_1771718036073.png";

const iconMap: Record<string, any> = { Brain, Bot, Eye };

export default function Consultation() {
  const [emailCopied, setEmailCopied] = useState(false);
  const { data: content, isLoading } = usePageContent("consultation");

  const email = getVal(content, "hero", "email", "mahmood.salah@email.com");
  const heroTitle = getVal(content, "hero", "title", "Need a Consultation?");
  const heroSubtitle = getVal(content, "hero", "subtitle", "");
  const services = getVal(content, "services", "items", []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }} />
        <NetworkBg />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32 ml-[166.4px] mr-[166.4px] mt-[0px] mb-[0px] pt-[120px] pb-[120px]">
          <h1
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6 animate-fade-in-up"
            data-testid="text-consultation-title"
          >
            {heroTitle}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-400">
            <Button asChild className="rounded-xl">
              <a href={`mailto:${email}`} data-testid="button-send-email">
                <Mail className="w-4 h-4 mr-2" />
                Send me an email
              </a>
            </Button>
            <Button variant="outline" onClick={handleCopyEmail} className="rounded-xl glass-card" data-testid="button-copy-email">
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
      <section className="pt-0 pb-20" data-testid="section-consultation-services">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service: any, i: number) => {
                const ServiceIcon = iconMap[service.icon] || Brain;
                return (
                  <AnimateIn key={i} delay={i * 0.1}>
                    <div className="glass-card-hover rounded-xl p-6 text-center h-full">
                      <div className="w-14 h-14 rounded-2xl glass-badge flex items-center justify-center mx-auto mb-4">
                        <ServiceIcon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {service.description}
                      </p>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
