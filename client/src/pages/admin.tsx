import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

type SiteContent = {
  id: number;
  page: string;
  section: string;
  contentKey: string;
  value: any;
};

const PAGE_LABELS: Record<string, string> = {
  hireme: "Hire Me",
  consultation: "Consultation",
  bootcamp: "BootcampAI",
  mentorship: "Mentorship",
  global: "Global Settings",
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Section",
  about: "About Section",
  projects: "Projects",
  resume: "Resume",
  testimonials: "Testimonials",
  services: "Services",
  whyChoose: "Why Choose",
  llmBootcamp: "LLM Bootcamp",
  howToApply: "How to Apply",
  enterprise: "Enterprise",
  intro: "Introduction",
  plans: "Plans",
  benefits: "Benefits",
  mentoringStyle: "Mentoring Style",
  bottomCta: "Bottom CTA",
  settings: "Settings",
};

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <h1 className="font-heading font-bold text-2xl text-foreground mb-4" data-testid="text-admin-login-title">
              Admin Panel
            </h1>
            <p className="text-muted-foreground mb-6">
              Sign in to manage your website content.
            </p>
            <Button asChild size="lg" data-testid="button-admin-login">
              <a href="/api/login">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const grouped = groupContent(allContent || []);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground" data-testid="text-admin-title">
              Content Manager
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome, {user?.firstName || user?.email || "Admin"}
            </p>
          </div>
          <Button variant="outline" asChild data-testid="button-admin-logout">
            <a href="/api/logout">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </a>
          </Button>
        </div>

        {contentLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([page, sections]) => (
              <PageAccordion
                key={page}
                page={page}
                sections={sections}
                onSave={(page, section, key, value) =>
                  updateMutation.mutate({ page, section, contentKey: key, value })
                }
                isSaving={updateMutation.isPending}
              />
            ))}
          </div>
        )}
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

function PageAccordion({
  page,
  sections,
  onSave,
  isSaving,
}: {
  page: string;
  sections: Record<string, SiteContent[]>;
  onSave: (page: string, section: string, key: string, value: any) => void;
  isSaving: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card data-testid={`card-page-${page}`}>
      <button
        className="w-full p-4 flex items-center justify-between text-left"
        onClick={() => setOpen(!open)}
        data-testid={`button-toggle-page-${page}`}
      >
        <h2 className="font-heading font-semibold text-xl text-foreground">
          {PAGE_LABELS[page] || page}
        </h2>
        {open ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4">
          {Object.entries(sections).map(([section, items]) => (
            <SectionEditor
              key={section}
              page={page}
              section={section}
              items={items}
              onSave={onSave}
              isSaving={isSaving}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

function SectionEditor({
  page,
  section,
  items,
  onSave,
  isSaving,
}: {
  page: string;
  section: string;
  items: SiteContent[];
  onSave: (page: string, section: string, key: string, value: any) => void;
  isSaving: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg">
      <button
        className="w-full p-3 flex items-center justify-between text-left bg-muted/30 rounded-t-lg"
        onClick={() => setOpen(!open)}
        data-testid={`button-toggle-section-${page}-${section}`}
      >
        <h3 className="font-medium text-foreground text-sm">
          {SECTION_LABELS[section] || section}
        </h3>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="p-3 space-y-4">
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
    <div data-testid={`field-${label}`}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {formatLabel(label)}
        </label>
        {dirty && (
          <Button
            size="sm"
            onClick={() => { onSave(editValue); setDirty(false); }}
            disabled={isSaving}
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
          className="text-sm"
          data-testid={`textarea-${label}`}
        />
      ) : (
        <Input
          value={editValue}
          onChange={(e) => { setEditValue(e.target.value); setDirty(true); }}
          className="text-sm"
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
    <div data-testid={`field-${label}`}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {formatLabel(label)}
        </label>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={addItem} data-testid={`button-add-${label}`}>
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
          {dirty && (
            <Button size="sm" onClick={() => { onSave(items); setDirty(false); }} disabled={isSaving} data-testid={`button-save-${label}`}>
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
              className="text-sm flex-1"
              data-testid={`input-${label}-${i}`}
            />
            <Button size="icon" variant="ghost" onClick={() => removeItem(i)} className="text-destructive" data-testid={`button-remove-${label}-${i}`}>
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
    <div data-testid={`field-${label}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {formatLabel(label)} ({items.length} items)
        </label>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={addItem} data-testid={`button-add-${label}`}>
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
          {dirty && (
            <Button size="sm" onClick={() => { onSave(items); setDirty(false); }} disabled={isSaving} data-testid={`button-save-${label}`}>
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
            <div key={i} className="border border-border rounded-md">
              <button
                className="w-full p-2 flex items-center justify-between text-left text-sm"
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
                <div className="px-2 pb-2 space-y-2">
                  {Object.entries(item).map(([field, fieldVal]) => {
                    if (Array.isArray(fieldVal)) {
                      return (
                        <div key={field}>
                          <label className="text-xs text-muted-foreground">{formatLabel(field)}</label>
                          <TagsEditor
                            tags={fieldVal as string[]}
                            onChange={(tags) => updateItemField(i, field, tags)}
                          />
                        </div>
                      );
                    }
                    if (typeof fieldVal === "boolean") {
                      return (
                        <div key={field} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={fieldVal}
                            onChange={(e) => updateItemField(i, field, e.target.checked)}
                            data-testid={`checkbox-${label}-${i}-${field}`}
                          />
                          <label className="text-xs text-muted-foreground">{formatLabel(field)}</label>
                        </div>
                      );
                    }
                    const strVal = String(fieldVal ?? "");
                    const isLong = strVal.length > 80;
                    return (
                      <div key={field}>
                        <label className="text-xs text-muted-foreground">{formatLabel(field)}</label>
                        {isLong ? (
                          <Textarea
                            value={strVal}
                            onChange={(e) => updateItemField(i, field, e.target.value)}
                            rows={3}
                            className="text-sm"
                            data-testid={`textarea-${label}-${i}-${field}`}
                          />
                        ) : (
                          <Input
                            value={strVal}
                            onChange={(e) => updateItemField(i, field, e.target.value)}
                            className="text-sm"
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
      <div className="flex flex-wrap gap-1 mb-1">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs"
          >
            {tag}
            <button onClick={() => onChange(tags.filter((_, j) => j !== i))} className="hover:text-destructive">
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
          className="text-xs h-7"
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
    <div data-testid={`field-${label}`}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {formatLabel(label)}
        </label>
        {dirty && (
          <Button size="sm" onClick={handleSave} disabled={isSaving} data-testid={`button-save-${label}`}>
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        )}
      </div>
      <Textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setDirty(true); setError(""); }}
        rows={6}
        className="text-sm font-mono"
        data-testid={`textarea-${label}`}
      />
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}

function formatLabel(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}
