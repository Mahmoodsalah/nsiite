import { SiLinkedin, SiYoutube, SiInstagram, SiFacebook } from "react-icons/si";
import { Link } from "wouter";
import { usePageContent, getVal } from "@/hooks/use-content";

const socialIconMap: Record<string, any> = {
  linkedin: SiLinkedin,
  youtube: SiYoutube,
  instagram: SiInstagram,
  facebook: SiFacebook,
};

export default function Footer() {
  const { data: content } = usePageContent("hireme");
  const socialLinks = getVal(content, "hero", "socialLinks", []);
  const email = getVal(content, "hero", "socialLinks", []).length > 0
    ? "mahmood.salah@email.com"
    : "mahmood.salah@email.com";

  return (
    <footer className="relative overflow-hidden" data-testid="footer">
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/95 to-foreground" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 text-background">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Mahmood Salah</h3>
            <p className="text-background/60 text-sm leading-relaxed">
              Senior Data Scientist and AI Engineer specializing in AI agents, computer vision, and deep learning technologies.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/#about" onClick={() => {
                setTimeout(() => {
                  document.getElementById("about")?.scrollIntoView({ behavior: "instant" });
                }, 100);
              }}>
                <span className="text-background/60 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-hire">
                  Hire Me
                </span>
              </Link>
              <Link href="/bootcamp" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
                <span className="text-background/60 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-bootcamp">
                  BootcampAI
                </span>
              </Link>
              <Link href="/mentorship" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
                <span className="text-background/60 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-mentorship">
                  Mentorship
                </span>
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Connect</h3>
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
              href="mailto:mahmoodsalah89@gmail.com"
              className="mt-4 inline-block text-background/60 text-sm hover:text-background transition-colors"
              data-testid="link-email"
            >
              mahmoodsalah89@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 text-center">
          <p className="text-background/40 text-xs">
            &copy; {new Date().getFullYear()} Mahmood Salah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
