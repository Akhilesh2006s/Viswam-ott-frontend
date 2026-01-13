import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/config/api";

interface SchoolFormProps {
  onClose: () => void;
  onSuccess: () => void;
  school?: any; // School to edit (if provided, it's edit mode)
}

const SchoolForm = ({ onClose, onSuccess, school }: SchoolFormProps) => {
  const isEditMode = !!school;
  
  const [formData, setFormData] = useState({
    name: school?.name || "",
    email: school?.email || "",
    password: "",
    downloadQuota: school?.downloadQuota?.allowed || 50,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update form data when school prop changes
  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name || "",
        email: school.email || "",
        password: "", // Don't pre-fill password
        downloadQuota: school.downloadQuota?.allowed || 50,
      });
    }
  }, [school]);

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
      if (!formData.name || !formData.email) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // For new schools, password is required
      if (!isEditMode && !formData.password) {
        setError("Password is required for new schools");
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Validate password length for new schools
      if (!isEditMode && formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      const url = isEditMode 
        ? API_ENDPOINTS.SCHOOLS.BY_ID(school._id)
        : API_ENDPOINTS.SCHOOLS.BASE;
      
      const method = isEditMode ? "PUT" : "POST";

      const requestBody: any = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        downloadQuota: {
          allowed: parseInt(formData.downloadQuota.toString()) || 50,
        },
      };

      // Only include password if it's provided (for new schools or when updating)
      if (formData.password) {
        requestBody.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`School ${isEditMode ? 'updated' : 'created'} successfully:`, data.data);
        onSuccess();
        onClose();
      } else {
        console.error(`Failed to ${isEditMode ? 'update' : 'create'} school:`, data);
        setError(data.error || `Failed to ${isEditMode ? 'update' : 'create'} school`);
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} school. Please try again.`);
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
              {isEditMode ? "Edit School" : "Add School"}
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
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">School Name *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., ABC High School"
                required
                className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]"
              />
            </div>

            <div>
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">Email *</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="school@example.com"
                required
                className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]"
              />
            </div>

            <div>
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">
                Password {isEditMode ? "(leave blank to keep current)" : "*"}
              </Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isEditMode ? "Enter new password (optional)" : "Minimum 6 characters"}
                required={!isEditMode}
                minLength={isEditMode ? undefined : 6}
                className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]"
              />
            </div>

            <div>
              <Label className="text-[hsl(40,40%,90%)] mb-2 block">Download Quota (Allowed)</Label>
              <Input
                name="downloadQuota"
                type="number"
                value={formData.downloadQuota}
                onChange={handleInputChange}
                placeholder="50"
                min="0"
                className="bg-card/40 border-border/30 text-[hsl(40,40%,90%)]"
              />
              <p className="text-xs text-[hsl(40,35%,85%)] mt-1">
                Number of videos the school can download
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
                  isEditMode ? "Update School" : "Create School"
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

export default SchoolForm;


