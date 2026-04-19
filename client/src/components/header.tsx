import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageContent, getVal } from "@/hooks/use-content";
import logoPath from "@assets/logo.png";

export default function Header() {
  const [location] = useLocation();
  const { data: globalContent } = usePageContent("global");
  const navWork = getVal(globalContent, "navigation", "workLabel", "Work");
  const navHire = getVal(globalContent, "navigation", "hireMeLabel", "Hire Me");
  const navConsult = getVal(globalContent, "navigation", "consultationLabel", "Need a Consultation?");
  const navAutomati = getVal(globalContent, "navigation", "automatiLabel", "Automati");
  const navBootcamp = getVal(globalContent, "navigation", "bootcampLabel", "BootcampAI");
  const navMentorship = getVal(globalContent, "navigation", "mentorshipLabel", "Mentorship");
  const brandName = getVal(globalContent, "navigation", "brandName", "Mahmood Salah");
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

  const isHireSection = location === "/hire-me" || location === "/consultation" || location === "/automati";

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
            <img src={logoPath} alt={brandName} className="h-8 w-auto" />
            <span className="font-heading font-semibold text-foreground text-sm tracking-wide">
              {brandName}
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
              data-testid="link-nav-work"
            >
              {navWork}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${hireDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {hireDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 glass-card rounded-xl p-1.5 animate-scale-in origin-top-left bg-white shadow-lg border border-black/5">
                <Link href="/hire-me" onClick={() => { setHireDropdownOpen(false); scrollToTop(); }}>
                  <span
                    className="block px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg transition-colors text-foreground/80 hover:text-foreground hover:bg-primary/10 whitespace-nowrap"
                    data-testid="button-view-hire"
                  >
                    {navHire}
                  </span>
                </Link>
                <Link href="/consultation" onClick={() => { setHireDropdownOpen(false); scrollToTop(); }}>
                  <span
                    className="block px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg transition-colors text-foreground/80 hover:text-foreground hover:bg-primary/10 whitespace-nowrap"
                    data-testid="button-view-consult"
                  >
                    {navConsult}
                  </span>
                </Link>
                <Link href="/automati" onClick={() => { setHireDropdownOpen(false); scrollToTop(); }}>
                  <span
                    className="block px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg transition-colors text-foreground/80 hover:text-foreground hover:bg-primary/10 whitespace-nowrap"
                    data-testid="button-view-automati"
                  >
                    {navAutomati}
                  </span>
                </Link>
              </div>
            )}
          </div>

          <Link href="/bootcampai" onClick={scrollToTop}>
            <span
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                location === "/bootcampai"
                  ? "text-primary glass-badge"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
              data-testid="link-nav-bootcampai"
            >
              {navBootcamp}
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
              {navMentorship}
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
              data-testid="button-mobile-work-toggle"
            >
              {navWork}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileHireOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileHireOpen && (
              <div className="flex flex-col gap-1 pl-4">
                <Link href="/hire-me" onClick={() => { setMobileMenuOpen(false); setMobileHireOpen(false); scrollToTop(); }}>
                  <span
                    className="block px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all text-muted-foreground hover:text-foreground hover:bg-white/10"
                    data-testid="link-mobile-hire-me"
                  >
                    {navHire}
                  </span>
                </Link>
                <Link href="/consultation" onClick={() => { setMobileMenuOpen(false); setMobileHireOpen(false); scrollToTop(); }}>
                  <span
                    className="block px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all text-muted-foreground hover:text-foreground hover:bg-white/10"
                    data-testid="link-mobile-consultation"
                  >
                    {navConsult}
                  </span>
                </Link>
                <Link href="/automati" onClick={() => { setMobileMenuOpen(false); setMobileHireOpen(false); scrollToTop(); }}>
                  <span
                    className="block px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all text-muted-foreground hover:text-foreground hover:bg-white/10"
                    data-testid="link-mobile-automati"
                  >
                    {navAutomati}
                  </span>
                </Link>
              </div>
            )}
            <Link href="/bootcampai" onClick={() => { setMobileMenuOpen(false); scrollToTop(); }}>
              <span
                className={`block px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                  location === "/bootcampai"
                    ? "text-primary glass-badge"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="link-mobile-bootcampai"
              >
                {navBootcamp}
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
                {navMentorship}
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
