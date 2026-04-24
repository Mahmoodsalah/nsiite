import { useState, useEffect, useRef } from "react";
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
  ArrowUp,
  ArrowDown,
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
  Upload,
  Image as ImageIcon,
  UserCog,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  nav: "Navigation Menu Items",
  footer: "Footer",
  statsDashboard: "Stats Dashboard (Home)",
  floatingCards: "Floating Cards",
  techMarquee: "Tech Marquee",
  ui: "UI Labels",
  analytics: "Analytics (Google Analytics)",
};

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated, logout, isLoggingOut } = useAuth();
  const { toast } = useToast();
  const [activePage, setActivePage] = useState("hireme");
  const [searchTerm, setSearchTerm] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showAccountDialog, setShowAccountDialog] = useState(false);

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
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAccountDialog(true)}
              data-testid="button-admin-account"
            >
              <UserCog className="w-4 h-4 mr-2" />
              Account
            </Button>
            <Button
              variant="outline"
              onClick={() => logout()}
              disabled={isLoggingOut}
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Signing Out..." : "Sign Out"}
            </Button>
          </div>
        </div>

        <AccountSettingsDialog
          open={showAccountDialog}
          onOpenChange={setShowAccountDialog}
          currentUsername={(user as any)?.username || (user as any)?.firstName || ""}
        />

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

const IMAGE_KEY_REGEX = /(logo|image|icon|avatar|photo|picture|banner|background|thumbnail|favicon|cover|illustration|graphic|asset|src)/i;
const IMAGE_EXT_REGEX = /\.(png|jpe?g|gif|webp|svg|ico|bmp|avif)(\?.*)?$/i;

function isImageField(key: string, value: any): boolean {
  if (typeof value !== "string") return false;
  if (IMAGE_KEY_REGEX.test(key)) return true;
  if (value.startsWith("/logos/") || value.startsWith("/uploads/")) return true;
  if (IMAGE_EXT_REGEX.test(value)) return true;
  return false;
}

function ImageUploadButton({
  onUploaded,
  testId,
  size = "sm",
}: {
  onUploaded: (url: string) => void;
  testId: string;
  size?: "sm" | "xs";
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(err.message || "Upload failed");
      }
      const data = await res.json();
      onUploaded(data.url);
      toast({ title: "Uploaded", description: "Image saved." });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e?.message || "Try a smaller image or different format.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
        data-testid={`${testId}-input`}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={size === "xs" ? "h-7 text-xs" : "h-8 text-xs"}
        data-testid={testId}
      >
        {uploading ? (
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        ) : (
          <Upload className="w-3 h-3 mr-1" />
        )}
        {uploading ? "Uploading…" : "Upload image"}
      </Button>
    </>
  );
}

function ImagePreview({ url, testId }: { url: string; testId: string }) {
  const [errored, setErrored] = useState(false);
  useEffect(() => { setErrored(false); }, [url]);
  if (!url) return null;
  if (errored) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <ImageIcon className="w-3 h-3" />
        <span className="truncate">{url}</span>
      </div>
    );
  }
  return (
    <div className="mt-2 inline-flex items-center gap-2 p-2 rounded-md border border-white/10 bg-background/40">
      <img
        src={url}
        alt="preview"
        onError={() => setErrored(true)}
        className="h-12 w-12 object-contain rounded bg-white/5"
        data-testid={testId}
      />
      <span className="text-xs text-muted-foreground truncate max-w-xs">{url}</span>
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
    const showUpload = isImageField(item.contentKey, value) || IMAGE_KEY_REGEX.test(item.contentKey);
    return (
      <StringEditor
        label={item.contentKey}
        value={value}
        onSave={onSave}
        isSaving={isSaving}
        isImage={showUpload}
      />
    );
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
  isImage = false,
}: {
  label: string;
  value: string;
  onSave: (value: string) => void;
  isSaving: boolean;
  isImage?: boolean;
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
        <div className="flex items-center gap-1">
          {isImage && (
            <ImageUploadButton
              testId={`button-upload-${label}`}
              size="xs"
              onUploaded={(url) => { setEditValue(url); onSave(url); }}
            />
          )}
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
      {isImage && editValue && (
        <ImagePreview url={editValue} testId={`img-preview-${label}`} />
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
  inline = false,
  displayLabel,
}: {
  label: string;
  value: any[];
  onSave: (value: any[]) => void;
  isSaving: boolean;
  inline?: boolean;
  displayLabel?: string;
}) {
  const [items, setItems] = useState<any[]>(value);
  const [dirty, setDirty] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(value);
    setDirty(false);
  }, [value]);

  const commitInline = (next: any[]) => {
    setItems(next);
    if (inline) {
      onSave(next);
    } else {
      setDirty(true);
    }
  };

  const updateItemField = (index: number, field: string, val: any) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };
    commitInline(next);
  };

  const updateItemFieldAndSave = (index: number, field: string, val: any) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };
    setItems(next);
    setDirty(false);
    onSave(next);
  };

  const removeItem = (index: number) => {
    commitInline(items.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    commitInline(next);
    setExpandedIndex((prev) => (prev === index ? target : prev === target ? index : prev));
  };

  const addItem = () => {
    const template = items.length > 0
      ? Object.fromEntries(
          Object.entries(items[0]).map(([k, v]) => [
            k,
            Array.isArray(v) ? [] : typeof v === "boolean" ? false : typeof v === "number" ? 0 : "",
          ])
        )
      : {};
    const next = [...items, template];
    commitInline(next);
    setExpandedIndex(items.length);
  };

  return (
    <div data-testid={`field-${label}`} className="pt-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {formatLabel(displayLabel ?? label)} <span className="normal-case font-normal">({items.length} items)</span>
        </label>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={addItem} className="h-7 text-xs" data-testid={`button-add-${label}`}>
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
          {!inline && dirty && (
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
                    onClick={(e) => { e.stopPropagation(); moveItem(i, -1); }}
                    className={`p-1 rounded cursor-pointer ${i === 0 ? "text-muted-foreground/30 pointer-events-none" : "text-muted-foreground hover:bg-white/5"}`}
                    data-testid={`button-move-up-${label}-${i}`}
                    title="Move up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </span>
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); moveItem(i, 1); }}
                    className={`p-1 rounded cursor-pointer ${i === items.length - 1 ? "text-muted-foreground/30 pointer-events-none" : "text-muted-foreground hover:bg-white/5"}`}
                    data-testid={`button-move-down-${label}-${i}`}
                    title="Move down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </span>
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
                      const isObjectArray = fieldVal.length > 0 && typeof fieldVal[0] === "object" && fieldVal[0] !== null && !Array.isArray(fieldVal[0]);
                      if (isObjectArray) {
                        return (
                          <div key={field} className="pt-2 pl-2 border-l-2 border-primary/20">
                            <ObjectArrayEditor
                              label={`${label}-${i}-${field}`}
                              value={fieldVal as any[]}
                              onSave={(next) => updateItemField(i, field, next)}
                              isSaving={isSaving}
                              inline
                              displayLabel={field}
                            />
                          </div>
                        );
                      }
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
                    const showUpload = isImageField(field, strVal) || IMAGE_KEY_REGEX.test(field);
                    return (
                      <div key={field} className="pt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-muted-foreground font-medium">{formatLabel(field)}</label>
                          {showUpload && (
                            <ImageUploadButton
                              testId={`button-upload-${label}-${i}-${field}`}
                              size="xs"
                              onUploaded={(url) => updateItemFieldAndSave(i, field, url)}
                            />
                          )}
                        </div>
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
                        {showUpload && strVal && (
                          <ImagePreview url={strVal} testId={`img-preview-${label}-${i}-${field}`} />
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

function AccountSettingsDialog({
  open,
  onOpenChange,
  currentUsername,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername: string;
}) {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNewUsername(currentUsername);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [open, currentUsername]);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/change-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim(),
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Update failed");
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Account updated",
        description: `Sign in next time with username "${data.username}"${newPassword ? " and your new password." : "."}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      setError(err?.message || "Failed to update credentials");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }
    if (newUsername.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-account-settings">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Change your admin username or password. Updates take effect immediately — no redeploy needed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Current Password <span className="text-destructive">*</span>
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password to confirm"
              data-testid="input-current-password"
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">New Username</label>
            <Input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New username"
              data-testid="input-new-username"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              New Password <span className="text-muted-foreground text-xs">(leave empty to keep current)</span>
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              data-testid="input-new-password"
              autoComplete="new-password"
            />
          </div>
          {newPassword && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                data-testid="input-confirm-password"
                autoComplete="new-password"
              />
            </div>
          )}
          {error && (
            <p className="text-destructive text-sm" data-testid="text-account-error">
              {error}
            </p>
          )}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
              data-testid="button-cancel-account"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              data-testid="button-save-account"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
