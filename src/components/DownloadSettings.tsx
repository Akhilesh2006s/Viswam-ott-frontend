import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Save, RefreshCw, Folder } from "lucide-react";
import { toast } from "sonner";

const DownloadSettings = () => {
  const [downloadPath, setDownloadPath] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCurrentPath();
  }, []);

  const loadCurrentPath = async () => {
    if (!window.electronAPI) {
      setDownloadPath("Browser Mode - Using IndexedDB");
      return;
    }

    setIsLoading(true);
    try {
      const prefs = await window.electronAPI.loadPreferences();
      setDownloadPath(prefs.downloadPath || "");
    } catch (error) {
      console.error("Error loading preferences:", error);
      toast.error("Failed to load download path");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFolder = async () => {
    if (!window.electronAPI) {
      toast.error("This feature is only available in the desktop app");
      return;
    }

    setIsLoading(true);
    try {
      const result = await window.electronAPI.selectDownloadFolder();
      if (result.success) {
        setDownloadPath(result.path || "");
        toast.success("Download folder updated!");
      } else if (!result.canceled) {
        toast.error(result.error || "Failed to select folder");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to select folder");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePath = async () => {
    if (!window.electronAPI || !downloadPath) {
      toast.error("Please select a valid folder");
      return;
    }

    setIsSaving(true);
    try {
      const result = await window.electronAPI.setDownloadPath(downloadPath);
      if (result.success) {
        toast.success("Download path saved successfully!");
      } else {
        toast.error(result.error || "Failed to save path");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save path");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenFolder = async () => {
    if (!window.electronAPI) {
      toast.error("This feature is only available in the desktop app");
      return;
    }

    try {
      await window.electronAPI.openDownloadFolder();
      toast.success("Opening download folder...");
    } catch (error: any) {
      toast.error(error.message || "Failed to open folder");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Download Settings
        </CardTitle>
        <CardDescription>
          Choose where downloaded videos are stored on your computer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="download-path">Download Location</Label>
          <div className="flex gap-2">
            <Input
              id="download-path"
              value={downloadPath}
              onChange={(e) => setDownloadPath(e.target.value)}
              placeholder="Select a folder..."
              disabled={isLoading || !window.electronAPI}
              className="flex-1 font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleSelectFolder}
              disabled={isLoading || !window.electronAPI}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Browse
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenFolder}
              disabled={!window.electronAPI}
              title="Open current download folder"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          {downloadPath && downloadPath !== "Browser Mode - Using IndexedDB" && (
            <p className="text-sm text-muted-foreground break-all">
              Videos will be saved to: <code className="text-xs bg-muted px-1 py-0.5 rounded">{downloadPath}</code>
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSavePath}
            disabled={isSaving || !downloadPath || !window.electronAPI || downloadPath === "Browser Mode - Using IndexedDB"}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Path"}
          </Button>
          <Button
            variant="outline"
            onClick={loadCurrentPath}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>

        {!window.electronAPI && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ You're running in browser mode. Download path settings are only available in the desktop app.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DownloadSettings;




