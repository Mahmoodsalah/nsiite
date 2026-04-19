import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  LogIn,
  LogOut,
  Save,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
  FileText,
  Briefcase,
  GraduationCap,
  Users,
  Settings,
  Search,
  Bot,
  Home,
} from "lucide-react";

type SiteContent = {
  id: number;
  page: string;
  section: string;
  contentKey: string;
  value: any;
};

const PAGE_CONFIG: Record<string, { label: string; icon: any; description: string }> = {
  home: { label: "Home Page", icon: Home, description: "Landing hero, typing titles, social links & SEO" },
  hireme: { label: "Hire Me", icon: Briefcase, description: "About, projects, resume & testimonials" },
  consultation: { label: "Consultation", icon: FileText, description: "Consultation services & contact" },
  bootcamp: { label: "BootcampAI", icon: GraduationCap, description: "Bootcamp program details & applications" },
  mentorship: { label: "Mentorship", icon: Users, description: "Mentorship plans, benefits & pricing" },
  automati: { label: "Automati", icon: Bot, description: "Custom AI automation services & pricing" },
  global: { label: "Global Settings", icon: Settings, description: "Navigation, footer, stats dashboard & site-wide settings" },
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Section",
  about: "About Section",
  projects: "Projects",
  resume: "Resume",
  testimonials: "Testimonials",
  services: "Services",
  whyChoose: "Why Choose",
  programs: "Programs",
  llmBootcamp: "LLM Bootcamp",
  howToApply: "How to Apply",
  enterprise: "Enterprise",
  intro: "Introduction",
  plans: "Plans",
  benefits: "Benefits",
  mentoringStyle: "Mentoring Style",
  bottomCta: "Bottom CTA",
  settings: "Settings",
  howItWorks: "How It Works",
  whoFor: "Who It's For",
  privacy: "Privacy & Security",
  valueStrip: "Value Strip",
  pricing: "Pricing",
  closingCta: "Closing CTA",
  faq: "FAQ",
  seo: "SEO & Meta",
  seoHome: "SEO - Home Page",
  seoHireMe: "SEO - Hire Me Page",
  stats: "Stats Counter",
  navigation: "Navigation Bar",
  footer: "Footer",
  statsDashboard: "Stats Dashboard (Home)",
  floatingCards: "Floating Cards",
  techMarquee: "Tech Marquee",
  ui: "UI Labels",
  analytics: "Analytics (Google Analytics)",
};

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activePage, setActivePage] = useState("hireme");
  const [searchTerm, setSearchTerm] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const { data: allContent, isLoading: contentLoading } = useQuery<SiteContent[]>({
    queryKey: ["/api/content"],
    enabled: isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { page: string; section: string; contentKey: string; value: any }) => {
      const res = await apiRequest("PUT", "/api/content", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Saved", description: "Content updated successfully." });
    },
    onError: (error: Error) => {
      if (error.message.startsWith("401")) {
        window.location.href = "/api/login";
        return;
      }
      toast({ title: "Error", description: "Failed to save content.", variant: "destructive" });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    },
    onSuccess: () => {
      setLoginError("");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: () => {
      setLoginError("Invalid username or password");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="glass-card max-w-md w-full mx-4 rounded-2xl p-8 text-center">
          <h1 className="font-heading font-bold text-2xl text-foreground mb-4" data-testid="text-admin-login-title">
            Admin Panel
          </h1>
          <p className="text-muted-foreground mb-6">
            Sign in to manage your website content.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginMutation.mutate();
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
              <Input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Enter username"
                className="rounded-xl"
                data-testid="input-admin-username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="rounded-xl"
                data-testid="input-admin-password"
              />
            </div>
            {loginError && (
              <p className="text-destructive text-sm text-center">{loginError}</p>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              disabled={loginMutation.isPending}
              data-testid="button-admin-login"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Sign In
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const grouped = groupContent(allContent || []);
  const pageData = grouped[activePage] || {};

  const filteredSections = searchTerm
    ? Object.fromEntries(
        Object.entries(pageData).filter(([section, items]) =>
          items.some(
            (item) =>
              item.contentKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (typeof item.value === "string" && item.value.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (SECTION_LABELS[section] || section).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      )
    : pageData;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground" data-testid="text-admin-title">
              Content Manager
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome, {user?.firstName || user?.email || "Admin"}. Edit your site content below.
            </p>
          </div>
          <Button variant="outline" asChild data-testid="button-admin-logout">
            <a href="/api/logout">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </a>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <div className="glass-card rounded-xl p-3 lg:sticky lg:top-24">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Pages</p>
              <nav className="space-y-1" data-testid="nav-admin-pages">
                {Object.entries(PAGE_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  const isActive = activePage === key;
                  const hasContent = grouped[key] && Object.keys(grouped[key]).length > 0;
                  return (
                    <button
                      key={key}
                      onClick={() => { setActivePage(key); setSearchTerm(""); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary/15 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      data-testid={`button-page-${key}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{config.label}</span>
                      {!hasContent && <span className="ml-auto text-xs text-muted-foreground/50">empty</span>}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {contentLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <h2 className="font-heading font-semibold text-xl text-foreground">
                      {PAGE_CONFIG[activePage]?.label || activePage}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {PAGE_CONFIG[activePage]?.description || ""}
                    </p>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search fields..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 text-sm"
                      data-testid="input-search-fields"
                    />
                  </div>
                </div>

                {Object.keys(filteredSections).length === 0 ? (
                  <div className="glass-card rounded-xl p-12 text-center">
                    <p className="text-muted-foreground">
                      {searchTerm ? "No fields match your search." : "No content found for this page."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(filteredSections).map(([section, items]) => (
                      <SectionEditor
                        key={`${activePage}-${section}`}
                        page={activePage}
                        section={section}
                        items={items}
                        onSave={(page, section, key, value) =>
                          updateMutation.mutate({ page, section, contentKey: key, value })
                        }
                        isSaving={updateMutation.isPending}
                        defaultOpen={Object.keys(filteredSections).length <= 3}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function groupContent(content: SiteContent[]) {
  const grouped: Record<string, Record<string, SiteContent[]>> = {};
  for (const item of content) {
    if (!grouped[item.page]) grouped[item.page] = {};
    if (!grouped[item.page][item.section]) grouped[item.page][item.section] = [];
    grouped[item.page][item.section].push(item);
  }
  return grouped;
}

function SectionEditor({
  page,
  section,
  items,
  onSave,
  isSaving,
  defaultOpen = false,
}: {
  page: string;
  section: string;
  items: SiteContent[];
  onSave: (page: string, section: string, key: string, value: any) => void;
  isSaving: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen, page]);

  return (
    <div className="glass-card rounded-xl overflow-hidden" data-testid={`section-editor-${page}-${section}`}>
      <button
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`button-toggle-section-${page}-${section}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${open ? "bg-primary" : "bg-muted-foreground/30"}`} />
          <h3 className="font-heading font-semibold text-foreground">
            {SECTION_LABELS[section] || section}
          </h3>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
            {items.length} {items.length === 1 ? "field" : "fields"}
          </span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-5 border-t border-white/5">
          {items.map((item) => (
            <ContentFieldEditor
              key={item.id}
              item={item}
              onSave={(value) => onSave(page, section, item.contentKey, value)}
              isSaving={isSaving}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ContentFieldEditor({
  item,
  onSave,
  isSaving,
}: {
  item: SiteContent;
  onSave: (value: any) => void;
  isSaving: boolean;
}) {
  const value = item.value;
  const isArray = Array.isArray(value);
  const isString = typeof value === "string";

  if (isString) {
    return <StringEditor label={item.contentKey} value={value} onSave={onSave} isSaving={isSaving} />;
  }

  if (isArray) {
    if (value.length === 0) {
      return <StringEditor label={item.contentKey} value="[]" onSave={(v) => { try { onSave(JSON.parse(v)); } catch {} }} isSaving={isSaving} />;
    }
    if (typeof value[0] === "string") {
      return <StringArrayEditor label={item.contentKey} value={value} onSave={onSave} isSaving={isSaving} />;
    }
    return <ObjectArrayEditor label={item.contentKey} value={value} onSave={onSave} isSaving={isSaving} />;
  }

  if (typeof value === "object" && value !== null) {
    return <JsonEditor label={item.contentKey} value={value} onSave={onSave} isSaving={isSaving} />;
  }

  return <StringEditor label={item.contentKey} value={String(value)} onSave={onSave} isSaving={isSaving} />;
}

function StringEditor({
  label,
  value,
  onSave,
  isSaving,
}: {
  label: string;
  value: string;
  onSave: (value: string) => void;
  isSaving: boolean;
}) {
  const [editValue, setEditValue] = useState(value);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setEditValue(value);
    setDirty(false);
  }, [value]);

  const isLong = value.length > 100;

  return (
    <div data-testid={`field-${label}`} className="pt-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {formatLabel(label)}
        </label>
        {dirty && (
          <Button
            size="sm"
            onClick={() => { onSave(editValue); setDirty(false); }}
            disabled={isSaving}
            className="h-7 text-xs"
            data-testid={`button-save-${label}`}
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        )}
      </div>
      {isLong ? (
        <Textarea
          value={editValue}
          onChange={(e) => { setEditValue(e.target.value); setDirty(true); }}
          rows={4}
          className="text-sm bg-background/50"
          data-testid={`textarea-${label}`}
        />
      ) : (
        <Input
          value={editValue}
          onChange={(e) => { setEditValue(e.target.value); setDirty(true); }}
          className="text-sm bg-background/50"
          data-testid={`input-${label}`}
        />
      )}
    </div>
  );
}

function StringArrayEditor({
  label,
  value,
  onSave,
  isSaving,
}: {
  label: string;
  value: string[];
  onSave: (value: string[]) => void;
  isSaving: boolean;
}) {
  const [items, setItems] = useState<string[]>(value);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setItems(value);
    setDirty(false);
  }, [value]);

  const updateItem = (index: number, val: string) => {
    const next = [...items];
    next[index] = val;
    setItems(next);
    setDirty(true);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    setDirty(true);
  };

  const addItem = () => {
    setItems([...items, ""]);
    setDirty(true);
  };

  return (
    <div data-testid={`field-${label}`} className="pt-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {formatLabel(label)}
        </label>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={addItem} className="h-7 text-xs" data-testid={`button-add-${label}`}>
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
          {dirty && (
            <Button size="sm" onClick={() => { onSave(items); setDirty(false); }} disabled={isSaving} className="h-7 text-xs" data-testid={`button-save-${label}`}>
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              className="text-sm flex-1 bg-background/50"
              data-testid={`input-${label}-${i}`}
            />
            <Button size="icon" variant="ghost" onClick={() => removeItem(i)} className="text-destructive h-9 w-9" data-testid={`button-remove-${label}-${i}`}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ObjectArrayEditor({
  label,
  value,
  onSave,
  isSaving,
}: {
  label: string;
  value: any[];
  onSave: (value: any[]) => void;
  isSaving: boolean;
}) {
  const [items, setItems] = useState<any[]>(value);
  const [dirty, setDirty] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(value);
    setDirty(false);
  }, [value]);

  const updateItemField = (index: number, field: string, val: any) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };
    setItems(next);
    setDirty(true);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    setDirty(true);
    setExpandedIndex(null);
  };

  const addItem = () => {
    const template = items.length > 0 ? Object.fromEntries(Object.keys(items[0]).map(k => [k, ""])) : {};
    setItems([...items, template]);
    setExpandedIndex(items.length);
    setDirty(true);
  };

  return (
    <div data-testid={`field-${label}`} className="pt-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {formatLabel(label)} <span className="normal-case font-normal">({items.length} items)</span>
        </label>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={addItem} className="h-7 text-xs" data-testid={`button-add-${label}`}>
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
          {dirty && (
            <Button size="sm" onClick={() => { onSave(items); setDirty(false); }} disabled={isSaving} className="h-7 text-xs" data-testid={`button-save-${label}`}>
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const displayTitle = item.title || item.name || item.label || item.platform || `Item ${i + 1}`;
          const isExpanded = expandedIndex === i;
          return (
            <div key={i} className="border border-white/10 rounded-lg bg-background/30">
              <button
                className="w-full p-3 flex items-center justify-between text-left text-sm"
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                data-testid={`button-toggle-item-${label}-${i}`}
              >
                <span className="font-medium text-foreground truncate">{displayTitle}</span>
                <div className="flex items-center gap-1">
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); removeItem(i); }}
                    className="text-destructive hover:bg-destructive/10 p-1 rounded cursor-pointer"
                    data-testid={`button-remove-${label}-${i}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </span>
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-white/5">
                  {Object.entries(item).map(([field, fieldVal]) => {
                    if (Array.isArray(fieldVal)) {
                      return (
                        <div key={field} className="pt-2">
                          <label className="text-xs text-muted-foreground font-medium">{formatLabel(field)}</label>
                          <TagsEditor
                            tags={fieldVal as string[]}
                            onChange={(tags) => updateItemField(i, field, tags)}
                          />
                        </div>
                      );
                    }
                    if (typeof fieldVal === "boolean") {
                      return (
                        <div key={field} className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            checked={fieldVal}
                            onChange={(e) => updateItemField(i, field, e.target.checked)}
                            className="rounded"
                            data-testid={`checkbox-${label}-${i}-${field}`}
                          />
                          <label className="text-xs text-muted-foreground font-medium">{formatLabel(field)}</label>
                        </div>
                      );
                    }
                    const strVal = String(fieldVal ?? "");
                    const isLong = strVal.length > 80;
                    return (
                      <div key={field} className="pt-2">
                        <label className="text-xs text-muted-foreground font-medium">{formatLabel(field)}</label>
                        {isLong ? (
                          <Textarea
                            value={strVal}
                            onChange={(e) => updateItemField(i, field, e.target.value)}
                            rows={3}
                            className="text-sm bg-background/50 mt-1"
                            data-testid={`textarea-${label}-${i}-${field}`}
                          />
                        ) : (
                          <Input
                            value={strVal}
                            onChange={(e) => updateItemField(i, field, e.target.value)}
                            className="text-sm bg-background/50 mt-1"
                            data-testid={`input-${label}-${i}-${field}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TagsEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    if (input.trim()) {
      onChange([...tags, input.trim()]);
      setInput("");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-1 mt-1">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20"
          >
            {tag}
            <button onClick={() => onChange(tags.filter((_, j) => j !== i))} className="hover:text-destructive ml-0.5">
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
          placeholder="Add tag..."
          className="text-xs h-7 bg-background/50"
        />
        <Button size="sm" variant="outline" onClick={addTag} className="h-7 text-xs">
          Add
        </Button>
      </div>
    </div>
  );
}

function JsonEditor({
  label,
  value,
  onSave,
  isSaving,
}: {
  label: string;
  value: any;
  onSave: (value: any) => void;
  isSaving: boolean;
}) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
    setDirty(false);
  }, [value]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(text);
      onSave(parsed);
      setDirty(false);
      setError("");
    } catch {
      setError("Invalid JSON");
    }
  };

  return (
    <div data-testid={`field-${label}`} className="pt-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {formatLabel(label)}
        </label>
        {dirty && (
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-7 text-xs" data-testid={`button-save-${label}`}>
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        )}
      </div>
      <Textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setDirty(true); setError(""); }}
        rows={6}
        className="text-sm font-mono bg-background/50"
        data-testid={`textarea-${label}`}
      />
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}

function formatLabel(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}
