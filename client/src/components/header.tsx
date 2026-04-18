import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/logo.png";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isHireSection = location === "/" || location === "/consultation";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-nav"
          : "bg-transparent"
      }`}
      data-testid="header"
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" onClick={scrollToTop} data-testid="link-home">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={logoPath} alt="Mahmood Salah" className="h-8 w-auto" />
            <span className="font-heading font-semibold text-foreground text-sm tracking-wide">
              Mahmood Salah
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
          <Link href="/" onClick={scrollToTop}>
            <span
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isHireSection
                  ? "text-primary glass-badge"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
              data-testid="link-nav-hire-me"
            >
              Hire Me
            </span>
          </Link>

          <Link href="/bootcampai" onClick={scrollToTop}>
            <span
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                location === "/bootcampai"
                  ? "text-primary glass-badge"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
              data-testid="link-nav-bootcampai"
            >
              BootcampAI
            </span>
          </Link>

          <Link href="/mentorship" onClick={scrollToTop}>
            <span
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                location === "/mentorship"
                  ? "text-primary glass-badge"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
              data-testid="link-nav-mentorship"
            >
              Mentorship
            </span>
          </Link>
        </nav>

        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav">
          <nav className="flex flex-col px-6 py-4 gap-1" data-testid="nav-mobile">
            <Link href="/" onClick={() => { setMobileMenuOpen(false); scrollToTop(); }}>
              <span
                className={`block px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                  isHireSection
                    ? "text-primary glass-badge"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="link-mobile-hire-me"
              >
                Hire Me
              </span>
            </Link>
            <Link href="/bootcampai" onClick={() => { setMobileMenuOpen(false); scrollToTop(); }}>
              <span
                className={`block px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                  location === "/bootcampai"
                    ? "text-primary glass-badge"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="link-mobile-bootcampai"
              >
                BootcampAI
              </span>
            </Link>
            <Link href="/mentorship" onClick={() => { setMobileMenuOpen(false); scrollToTop(); }}>
              <span
                className={`block px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                  location === "/mentorship"
                    ? "text-primary glass-badge"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="link-mobile-mentorship"
              >
                Mentorship
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
