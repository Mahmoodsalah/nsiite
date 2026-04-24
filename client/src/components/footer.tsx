import { SiLinkedin, SiYoutube, SiInstagram, SiFacebook } from "react-icons/si";
import { Link } from "wouter";
import { usePageContent, getVal } from "@/hooks/use-content";
import patternBg from "@assets/pattern_white_1771718036073.webp";

const socialIconMap: Record<string, any> = {
  linkedin: SiLinkedin,
  youtube: SiYoutube,
  instagram: SiInstagram,
  facebook: SiFacebook,
};

export default function Footer() {
  const { data: content } = usePageContent("home");
  const { data: globalContent } = usePageContent("global");
  const socialLinks = getVal(content, "hero", "socialLinks", []);

  const brandName = getVal(globalContent, "footer", "brandName", "Mahmood Salah");
  const brandTagline = getVal(globalContent, "footer", "brandTagline", "Senior Data Scientist and AI Engineer specializing in AI agents, computer vision, and deep learning technologies.");
  const quickLinksTitle = getVal(globalContent, "footer", "quickLinksTitle", "Quick Links");
  const connectTitle = getVal(globalContent, "footer", "connectTitle", "Connect");
  const contactEmail = getVal(globalContent, "footer", "contactEmail", "mahmoodsalah89@gmail.com");
  const copyrightTpl = getVal(globalContent, "footer", "copyrightText", "© {year} Mahmood Salah. All rights reserved.");
  const copyright = copyrightTpl.replace("{year}", String(new Date().getFullYear()));

  const navHire = getVal(globalContent, "navigation", "hireMeLabel", "Hire Me");
  const navConsult = getVal(globalContent, "navigation", "consultationLabel", "Consultation");
  const navBootcamp = getVal(globalContent, "navigation", "bootcampLabel", "BootcampAI");
  const navMentorship = getVal(globalContent, "navigation", "mentorshipLabel", "Mentorship");
  const navAutomati = getVal(globalContent, "navigation", "automatiLabel", "Automati");

  return (
    <footer className="relative overflow-hidden" data-testid="footer">
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/95 to-foreground" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${patternBg})`, backgroundSize: '400px', backgroundRepeat: 'repeat' }} />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 text-background">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">{brandName}</h3>
            <p className="text-background/60 text-sm leading-relaxed">{brandTagline}</p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">{quickLinksTitle}</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/hire-me" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
                <span className="text-background/60 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-hire">
                  {navHire}
                </span>
              </Link>
              <Link href="/consultation" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
                <span className="text-background/60 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-consultation">
                  {navConsult}
                </span>
              </Link>
              <Link href="/bootcampai" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
                <span className="text-background/60 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-bootcamp">
                  {navBootcamp}
                </span>
              </Link>
              <Link href="/mentorship" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
                <span className="text-background/60 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-mentorship">
                  {navMentorship}
                </span>
              </Link>
              <Link href="/automati" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
                <span className="text-background/60 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-automati">
                  {navAutomati}
                </span>
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">{connectTitle}</h3>
            <div className="flex gap-3">
              {socialLinks.map((link: any, i: number) => {
                const Icon = socialIconMap[link.platform] || SiLinkedin;
                return (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-background/10 flex items-center justify-center text-background/60 hover:text-background hover:bg-background/20 transition-all duration-300"
                    data-testid={`link-social-${link.platform}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-4 inline-block text-background/60 text-sm hover:text-background transition-colors"
              data-testid="link-email"
            >
              {contactEmail}
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 text-center">
          <p className="text-background/40 text-xs">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
