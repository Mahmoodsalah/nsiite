import { SiLinkedin, SiYoutube, SiX, SiFacebook } from "react-icons/si";
import { Link } from "wouter";

const socialLinks = [
  { icon: SiLinkedin, href: "https://linkedin.com/in/mahmoodsalah", label: "LinkedIn" },
  { icon: SiYoutube, href: "https://youtube.com", label: "YouTube" },
  { icon: SiX, href: "https://x.com", label: "X" },
  { icon: SiFacebook, href: "https://facebook.com", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background" data-testid="footer">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Mahmood Salah</h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Senior Data Scientist and AI Engineer specializing in AI agents, computer vision, and deep learning technologies.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/">
                <span className="text-background/70 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-hire">
                  Hire Me
                </span>
              </Link>
              <Link href="/bootcamp">
                <span className="text-background/70 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-bootcamp">
                  BootcampAI
                </span>
              </Link>
              <Link href="/mentorship">
                <span className="text-background/70 text-sm hover:text-background transition-colors cursor-pointer" data-testid="link-footer-mentorship">
                  Mentorship
                </span>
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Connect</h3>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-background/10 flex items-center justify-center text-background/70 hover:text-background hover:bg-background/20 transition-colors"
                  data-testid={`link-social-${link.label.toLowerCase()}`}
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <a
              href="mailto:mahmood@example.com"
              className="mt-4 inline-block text-background/70 text-sm hover:text-background transition-colors"
              data-testid="link-email"
            >
              mahmood.salah@email.com
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 text-center">
          <p className="text-background/50 text-xs">
            &copy; {new Date().getFullYear()} Mahmood Salah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
