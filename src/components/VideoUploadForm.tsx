import { useState, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoUploadFormProps {
  onClose: () => void;
  onSuccess: () => void;
  subjects: Array<{ _id: string; name: string }>;
}

const VideoUploadForm = ({ onClose, onSuccess, subjects }: VideoUploadFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    class: "",
    chapter: "",
    topic: "",
    duration: "",
    isDownloadable: false,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "video") {
        setVideoFile(file);
      } else {
        setThumbnailFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("superAdminToken");
      if (!token) {
        setError("Not authenticated. Please login again.");
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.subjectId || !formData.class) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (!videoFile && !formData.videoUrl) {
        setError("Please upload a video file or provide a video URL");
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const uploadData = new FormData();
      
      if (videoFile) {
        uploadData.append("video", videoFile);
      }
      
      if (thumbnailFile) {
        uploadData.append("thumbnail", thumbnailFile);
      }

      // Append other form fields
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description || "");
      uploadData.append("subjectId", formData.subjectId);
      uploadData.append("class", formData.class);
      uploadData.append("chapter", formData.chapter || "");
      uploadData.append("topic", formData.topic || "");
      uploadData.append("duration", formData.duration || "");
      uploadData.append("isDownloadable", formData.isDownloadable.toString());

      const response = await fetch("https://viswam-ott-backend-production.up.railway.app/api/videos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Failed to upload video");
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card/90 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Upload Video
            </h2>
            <button
              onClick={onClose}
              className="text-[hsl(40,35%,85%)] hover:text-[hsl(40,40%,90%)] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">Video File *</Label>
              <div className="flex items-center gap-4">
                <Input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "video")}
                  className="text-[hsl(40,40%,90%)]"
                />
                {videoFile && (
                  <span className="text-sm text-[hsl(40,35%,85%)]">
                    {videoFile.name}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">Thumbnail (Optional)</Label>
              <Input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "thumbnail")}
                className="text-[hsl(40,40%,90%)]"
              />
              {thumbnailFile && (
                <span className="text-sm text-[hsl(40,35%,85%)] mt-1 block">
                  {thumbnailFile.name}
                </span>
              )}
            </div>

            <div>
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">Title *</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]"
              />
            </div>

            <div>
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">Description</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-card/40 border border-border/30 rounded-md text-[hsl(40,40%,90%)] focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[hsl(40,40%,90%)] mb-2 block">Subject *</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, subjectId: value }))
                  }
                >
                  <SelectTrigger className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject._id} value={subject._id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[hsl(40,40%,90%)] mb-2 block">Class *</Label>
                <Input
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  placeholder="e.g., Class 6 - 10"
                  required
                  className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[hsl(40,40%,90%)] mb-2 block">Chapter</Label>
                <Input
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleInputChange}
                  className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]"
                />
              </div>

              <div>
                <Label className="text-[hsl(40,40%,90%)] mb-2 block">Topic</Label>
                <Input
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]"
                />
              </div>
            </div>

            <div>
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">Duration (e.g., 10:30)</Label>
              <Input
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="MM:SS"
                className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDownloadable"
                checked={formData.isDownloadable}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isDownloadable: e.target.checked }))
                }
                className="w-4 h-4"
              />
              <Label htmlFor="isDownloadable" className="text-[hsl(40,40%,90%)]">
                Allow download
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="gold-button flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-primary text-primary hover:bg-primary/10"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadForm;


