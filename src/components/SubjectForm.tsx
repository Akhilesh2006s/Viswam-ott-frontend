import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/config/api";

interface SubjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
  subject?: any; // Subject to edit (if provided, it's edit mode)
}

const SubjectForm = ({ onClose, onSuccess, subject }: SubjectFormProps) => {
  const isEditMode = !!subject;
  
  const [formData, setFormData] = useState({
    name: subject?.name || "",
    description: subject?.description || "",
    classes: subject?.classes?.join(", ") || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update form data when subject prop changes
  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name || "",
        description: subject.description || "",
        classes: subject.classes?.join(", ") || "",
      });
    }
  }, [subject]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("superAdminToken");
      if (!token) {
        setError("Not authenticated. Please login again.");
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.name || !formData.classes) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Parse classes (comma-separated or space-separated)
      const classesArray = formData.classes
        .split(/[,\n]/)
        .map((cls) => cls.trim())
        .filter((cls) => cls.length > 0);

      if (classesArray.length === 0) {
        setError("Please enter at least one class");
        setLoading(false);
        return;
      }

      const url = isEditMode 
        ? API_ENDPOINTS.SUBJECTS.BY_ID(subject._id)
        : API_ENDPOINTS.SUBJECTS.BASE;
      
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || "",
          classes: classesArray,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`Subject ${isEditMode ? 'updated' : 'created'} successfully:`, data.data);
        onSuccess();
        onClose();
      } else {
        console.error(`Failed to ${isEditMode ? 'update' : 'create'} subject:`, data);
        setError(data.error || `Failed to ${isEditMode ? 'update' : 'create'} subject`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card/90 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {isEditMode ? "Edit Subject" : "Add Subject"}
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
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">Subject Name *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Mathematics, Science, English"
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
                placeholder="Subject description (optional)"
                className="w-full px-3 py-2 bg-card/40 border border-border/30 rounded-md text-[hsl(40,40%,90%)] focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">
                Classes * (comma-separated)
              </Label>
              <Input
                name="classes"
                value={formData.classes}
                onChange={handleInputChange}
                placeholder="e.g., Class 6, Class 7, Class 8, Class 9, Class 10"
                required
                className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]"
              />
              <p className="text-xs text-[hsl(40,35%,85%)] mt-1">
                Enter classes separated by commas (e.g., Class 6, Class 7, Class 8)
              </p>
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
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditMode ? "Update Subject" : "Create Subject"
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

export default SubjectForm;

