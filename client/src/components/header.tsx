import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/logo.png";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hireDropdownOpen, setHireDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setHireDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setHireDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHireSection = location === "/" || location === "/consultation";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setHireDropdownOpen(!hireDropdownOpen)}
              className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                isHireSection
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="link-nav-hire-me"
            >
              Hire Me
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${hireDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {hireDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-background border border-border rounded-lg shadow-lg py-1 animate-scale-in origin-top-left">
                <Link href="/#about">
                  <span
                    onClick={() => {
                      if (location === "/") {
                        setHireDropdownOpen(false);
                        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`block w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                      location === "/"
                        ? "text-primary bg-primary/5 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    data-testid="button-view-hire"
                  >
                    Hire Me
                  </span>
                </Link>
                <Link href="/consultation">
                  <span
                    className={`block w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                      location === "/consultation"
                        ? "text-primary bg-primary/5 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    data-testid="button-view-consult"
                  >
                    Need a Consultation
                  </span>
                </Link>
              </div>
            )}
          </div>

          <Link href="/bootcamp" onClick={scrollToTop}>
            <span
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                location === "/bootcamp"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="link-nav-bootcampai"
            >
              BootcampAI
            </span>
          </Link>

          <Link href="/mentorship" onClick={scrollToTop}>
            <span
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                location === "/mentorship"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
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
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <nav className="flex flex-col px-6 py-4 gap-1" data-testid="nav-mobile">
            <Link href="/">
              <span
                className={`block px-4 py-3 rounded-md text-sm font-medium cursor-pointer ${
                  location === "/"
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="link-mobile-hire-me"
              >
                Hire Me
              </span>
            </Link>
            <Link href="/consultation">
              <span
                className={`block px-4 py-3 rounded-md text-sm font-medium cursor-pointer pl-8 ${
                  location === "/consultation"
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="link-mobile-consultation"
              >
                Need a Consultation
              </span>
            </Link>
            <Link href="/bootcamp">
              <span
                className={`block px-4 py-3 rounded-md text-sm font-medium cursor-pointer ${
                  location === "/bootcamp"
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="link-mobile-bootcampai"
              >
                BootcampAI
              </span>
            </Link>
            <Link href="/mentorship">
              <span
                className={`block px-4 py-3 rounded-md text-sm font-medium cursor-pointer ${
                  location === "/mentorship"
                    ? "text-primary bg-primary/5"
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
