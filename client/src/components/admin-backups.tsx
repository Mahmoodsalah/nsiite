import { useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, RotateCcw, Loader2, History } from "lucide-react";

type BackupInfo = {
  id: string;
  createdAt: string;
  reason: "auto" | "restore" | "migration";
  size: number;
};

const REASON_LABELS: Record<BackupInfo["reason"], string> = {
  auto: "Before edits",
  restore: "Before a restore",
  migration: "Before a site content update",
};

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminBackups() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: backups, isLoading } = useQuery<BackupInfo[]>({
    queryKey: ["/api/admin/backups"],
    staleTime: 0,
  });

  const onRestored = () => {
    // Every page's content may have changed, so drop all cached content.
    queryClient.invalidateQueries();
    toast({ title: "Restored", description: "The site content was restored. The previous version was saved as a backup." });
  };

  const onRestoreError = (error: Error) => {
    toast({ title: "Restore failed", description: error.message.replace(/^\d+:\s*/, ""), variant: "destructive" });
  };

  const restoreBackup = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/backups/${encodeURIComponent(id)}/restore`),
    onSuccess: onRestored,
    onError: onRestoreError,
  });

  const restoreFile = useMutation({
    mutationFn: (items: unknown) => apiRequest("POST", "/api/admin/restore", items),
    onSuccess: onRestored,
    onError: onRestoreError,
  });

  const busy = restoreBackup.isPending || restoreFile.isPending;

  const handleDownloadCurrent = async () => {
    try {
      const res = await apiRequest("GET", "/api/content");
      downloadJson(await res.json(), `content-${format(new Date(), "yyyy-MM-dd-HHmm")}.json`);
    } catch {
      toast({ title: "Download failed", description: "Could not fetch the current content.", variant: "destructive" });
    }
  };

  const handleDownloadBackup = async (id: string) => {
    try {
      const res = await apiRequest("GET", `/api/admin/backups/${encodeURIComponent(id)}`);
      downloadJson(await res.json(), id);
    } catch {
      toast({ title: "Download failed", description: "Could not fetch this backup.", variant: "destructive" });
    }
  };

  const handleRestoreBackup = (b: BackupInfo) => {
    const when = format(new Date(b.createdAt), "d MMM yyyy, h:mm a");
    if (window.confirm(`Restore the whole site to the version from ${when}?\n\nThe current content will be saved as a backup first, so you can undo this.`)) {
      restoreBackup.mutate(b.id);
    }
  };

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    let items: unknown;
    try {
      items = JSON.parse(await file.text());
    } catch {
      toast({ title: "Invalid file", description: "That file is not valid JSON.", variant: "destructive" });
      return;
    }
    if (window.confirm(`Replace the whole site content with "${file.name}"?\n\nThe current content will be saved as a backup first, so you can undo this.`)) {
      restoreFile.mutate(items);
    }
  };

  return (
    <div className="space-y-4" data-testid="section-admin-backups">
      <div className="mb-2">
        <h2 className="font-heading font-semibold text-xl text-foreground">Backups & Restore</h2>
        <p className="text-muted-foreground text-sm">
          A restore point is saved automatically before you edit (at most one every 10 minutes). The latest 30 are kept.
          Restoring always saves the current content first, so a restore can be undone.
        </p>
      </div>

      <div className="glass-card rounded-xl p-4 flex flex-wrap gap-3">
        <Button variant="outline" onClick={handleDownloadCurrent} data-testid="button-download-current">
          <Download className="w-4 h-4 mr-2" />
          Download current content
        </Button>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={busy} data-testid="button-restore-file">
          <Upload className="w-4 h-4 mr-2" />
          Restore from a file
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFileChosen} />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 flex items-center gap-2 border-b border-white/5">
          <History className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-heading font-semibold text-foreground">Restore points</h3>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !backups || backups.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground text-center">
            No restore points yet. One will be created the next time you save a change.
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {backups.map((b) => (
              <li key={b.id} className="p-4 flex flex-wrap items-center gap-3" data-testid={`row-backup-${b.id}`}>
                <div className="flex-1 min-w-[12rem]">
                  <p className="text-sm font-medium text-foreground">
                    {format(new Date(b.createdAt), "d MMM yyyy, h:mm a")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {REASON_LABELS[b.reason]} · {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })} · {Math.round(b.size / 1024)} KB
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleDownloadBackup(b.id)} data-testid={`button-download-backup-${b.id}`}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleRestoreBackup(b)} disabled={busy} data-testid={`button-restore-backup-${b.id}`}>
                  {restoreBackup.isPending && restoreBackup.variables === b.id ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4 mr-1" />
                  )}
                  Restore
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
