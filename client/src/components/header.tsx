import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageContent, getVal } from "@/hooks/use-content";
import logoPath from "@assets/logo.png";

type NavItem = {
  label: string;
  href?: string;
  parent?: string;
  visible?: boolean;
};

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "", parent: "", visible: true },
  { label: "Hire Me", href: "/hire-me", parent: "Work", visible: true },
  { label: "Need a Consultation?", href: "/consultation", parent: "Work", visible: true },
  { label: "Automati", href: "/automati", parent: "Work", visible: true },
  { label: "BootcampAI", href: "/bootcampai", parent: "", visible: true },
  { label: "Mentorship", href: "/mentorship", parent: "", visible: true },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Header() {
  const [location] = useLocation();
  const { data: globalContent } = usePageContent("global");
  const brandName = getVal(globalContent, "navigation", "brandName", "Mahmood Salah");
  const rawItems = getVal(globalContent, "nav", "items", DEFAULT_NAV_ITEMS) as NavItem[];
  const navItems = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : DEFAULT_NAV_ITEMS;
  const visibleItems = navItems.filter((i) => i.visible !== false);
  const topLevel = visibleItems.filter((i) => !i.parent);
  const childrenOf = (label: string) =>
    visibleItems.filter((i) => i.parent && i.parent === label);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenGroups, setMobileOpenGroups] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const isItemActive = (item: NavItem) => !!item.href && location === item.href;
  const isGroupActive = (label: string) => childrenOf(label).some(isItemActive);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav" : "bg-transparent"
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
          {topLevel.map((item) => {
            const kids = childrenOf(item.label);
            const slug = slugify(item.label);
            if (kids.length > 0) {
              const groupActive = isGroupActive(item.label);
              const open = openDropdown === item.label;
              return (
                <div key={item.label} className="relative" ref={open ? dropdownRef : undefined}>
                  <button
                    onClick={() => setOpenDropdown(open ? null : item.label)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      groupActive
                        ? "text-primary glass-badge"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                    }`}
                    data-testid={`link-nav-${slug}`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div
                      className="absolute top-full left-0 mt-2 w-56 rounded-xl p-1.5 animate-scale-in origin-top-left"
                      style={{
                        background: "var(--glass-bg-strong)",
                        backdropFilter: "blur(28px) saturate(1.8)",
                        WebkitBackdropFilter: "blur(28px) saturate(1.8)",
                        border: "1px solid var(--glass-border)",
                        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      {kids.map((kid) => (
                        <Link
                          key={kid.label}
                          href={kid.href || "#"}
                          onClick={() => {
                            setOpenDropdown(null);
                            scrollToTop();
                          }}
                        >
                          <span
                            className="block px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg transition-colors text-foreground hover:bg-primary/10 whitespace-nowrap"
                            data-testid={`button-view-${slugify(kid.label)}`}
                          >
                            {kid.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link key={item.label} href={item.href || "#"} onClick={scrollToTop}>
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isItemActive(item)
                      ? "text-primary glass-badge"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                  }`}
                  data-testid={`link-nav-${slug}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
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
            {topLevel.map((item) => {
              const kids = childrenOf(item.label);
              const slug = slugify(item.label);
              if (kids.length > 0) {
                const open = !!mobileOpenGroups[item.label];
                const groupActive = isGroupActive(item.label);
                return (
                  <div key={item.label}>
                    <button
                      onClick={() =>
                        setMobileOpenGroups((prev) => ({ ...prev, [item.label]: !prev[item.label] }))
                      }
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all w-full ${
                        groupActive
                          ? "text-primary glass-badge"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      data-testid={`button-mobile-${slug}-toggle`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <div className="flex flex-col gap-1 pl-4">
                        {kids.map((kid) => (
                          <Link
                            key={kid.label}
                            href={kid.href || "#"}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileOpenGroups({});
                              scrollToTop();
                            }}
                          >
                            <span
                              className="block px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all text-muted-foreground hover:text-foreground hover:bg-white/10"
                              data-testid={`link-mobile-${slugify(kid.label)}`}
                            >
                              {kid.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href || "#"}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop();
                  }}
                >
                  <span
                    className={`block px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                      isItemActive(item)
                        ? "text-primary glass-badge"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`link-mobile-${slug}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
