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
  const [mobileHireOpen, setMobileHireOpen] = useState(false);
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setHireDropdownOpen(!hireDropdownOpen)}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isHireSection
                  ? "text-primary glass-badge"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
              data-testid="link-nav-hire-me"
            >
              Hire Me
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${hireDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {hireDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 glass-card rounded-xl py-1.5 animate-scale-in origin-top-left bg-[#ffffff]">
                <Link href="/#about">
                  <span
                    onClick={() => {
                      if (location === "/") {
                        setHireDropdownOpen(false);
                        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="block w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-all rounded-lg mx-1 text-muted-foreground hover:text-foreground hover:bg-white/10"
                    style={{ width: "calc(100% - 8px)" }}
                    data-testid="button-view-hire"
                  >
                    Hire Me
                  </span>
                </Link>
                <Link href="/consultation">
                  <span
                    className="block w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-all rounded-lg mx-1 text-muted-foreground hover:text-foreground hover:bg-white/10"
                    style={{ width: "calc(100% - 8px)" }}
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
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                location === "/bootcamp"
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
            <button
              onClick={() => setMobileHireOpen(!mobileHireOpen)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all w-full ${
                isHireSection
                  ? "text-primary glass-badge"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="button-mobile-hire-toggle"
            >
              Hire Me
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileHireOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileHireOpen && (
              <div className="flex flex-col gap-1 pl-4">
                <Link href="/">
                  <span
                    className="block px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all text-muted-foreground hover:text-foreground hover:bg-white/10"
                    data-testid="link-mobile-hire-me"
                  >
                    Hire Me
                  </span>
                </Link>
                <Link href="/consultation">
                  <span
                    className="block px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all text-muted-foreground hover:text-foreground hover:bg-white/10"
                    data-testid="link-mobile-consultation"
                  >
                    Need a Consultation
                  </span>
                </Link>
              </div>
            )}
            <Link href="/bootcamp">
              <span
                className={`block px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                  location === "/bootcamp"
                    ? "text-primary glass-badge"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="link-mobile-bootcampai"
              >
                BootcampAI
              </span>
            </Link>
            <Link href="/mentorship">
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
