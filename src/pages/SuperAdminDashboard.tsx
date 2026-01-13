import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Video, 
  GraduationCap, 
  Users, 
  Upload,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import VideoUploadForm from "@/components/VideoUploadForm";
import SubjectForm from "@/components/SubjectForm";
import VideoPlayer from "@/components/VideoPlayer";
import SchoolForm from "@/components/SchoolForm";
import logo from "@/assets/logo.png";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [subjects, setSubjects] = useState<Array<{ _id: string; name: string }>>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalSchools: 0,
    totalSubjects: 0,
    totalVideos: 0,
    storageUsed: '0 B',
  });

  useEffect(() => {
    if (activeTab === "videos" || activeTab === "subjects") {
      fetchSubjects();
      if (activeTab === "videos") {
        fetchVideos();
      }
    }
    if (activeTab === "schools") {
      fetchSchools();
    }
  }, [activeTab]);

  // Fetch subjects and dashboard stats on component mount
  useEffect(() => {
    const token = localStorage.getItem("superAdminToken");
    if (token) {
      fetchSubjects();
      fetchDashboardStats();
    }
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("superAdminToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(API_ENDPOINTS.DASHBOARD.STATS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch dashboard stats:", errorData);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("superAdminToken");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.SUBJECTS.BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch subjects:", errorData);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("✅ Subjects API response:", data);
      console.log("📊 Subjects count:", data.count);
      console.log("📋 Subjects array:", data.data);
      
      if (data.success) {
        const subjectsList = data.data || [];
        // Filter out inactive subjects (soft-deleted)
        const activeSubjects = subjectsList.filter((s: any) => s.isActive !== false);
        console.log("✅ Setting subjects state with:", activeSubjects.length, "active subjects");
        console.log("📝 Subject names:", activeSubjects.map((s: any) => s.name));
        setSubjects(activeSubjects);
      } else {
        console.error("❌ API returned error:", data.error);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("superAdminToken");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.VIDEOS.BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch videos:", errorData);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Videos data:", data);
      
      if (data.success) {
        setVideos(data.data || []);
      } else {
        console.error("API returned error:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchVideos();
    fetchDashboardStats(); // Refresh stats after upload
    setShowUploadForm(false);
  };

  const handleSubjectSuccess = () => {
    setShowSubjectForm(false);
    setEditingSubject(null);
    // Refresh subjects list and stats
    setTimeout(() => {
      fetchSubjects();
      fetchDashboardStats();
    }, 500);
  };

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("superAdminToken");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.SCHOOLS.BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch schools:", errorData);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        const schoolsList = data.data || [];
        // Filter out inactive schools (soft-deleted)
        const activeSchools = schoolsList.filter((s: any) => s.isActive !== false);
        setSchools(activeSchools);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
      setLoading(false);
    }
  };

  const handleSchoolSuccess = () => {
    setShowSchoolForm(false);
    setEditingSchool(null);
    // Refresh schools list and stats
    setTimeout(() => {
      fetchSchools();
      fetchDashboardStats();
    }, 500);
  };

  const handleDeleteSchool = async (schoolId: string, schoolName: string) => {
    if (!confirm(`Are you sure you want to delete "${schoolName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("superAdminToken");
      if (!token) {
        alert("Not authenticated. Please login again.");
        return;
      }

      const response = await fetch(API_ENDPOINTS.SCHOOLS.BY_ID(schoolId), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("School deleted successfully");
        // Refresh schools list and stats
        fetchSchools();
        fetchDashboardStats();
      } else {
        console.error("Failed to delete school:", data);
        alert(data.error || "Failed to delete school");
      }
    } catch (error: any) {
      console.error("Error deleting school:", error);
      alert("Failed to delete school. Please try again.");
    }
  };

  const handleLogout = () => {
    // Clear token and any stored data
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("superAdmin");
    
    // Redirect to super admin login page
    navigate("/super-admin/login");
  };

  const handleDeleteSubject = async (subjectId: string, subjectName: string) => {
    if (!confirm(`Are you sure you want to delete "${subjectName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("superAdminToken");
      if (!token) {
        alert("Not authenticated. Please login again.");
        return;
      }

      const response = await fetch(API_ENDPOINTS.SUBJECTS.BY_ID(subjectId), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Subject deleted successfully");
        // Refresh subjects list
        fetchSubjects();
      } else {
        console.error("Failed to delete subject:", data);
        alert(data.error || "Failed to delete subject");
      }
    } catch (error: any) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject. Please try again.");
    }
  };

  const handleEditSubject = (subject: any) => {
    setEditingSubject(subject);
    setShowSubjectForm(true);
  };

  const stats = [
    { label: "Total Schools", value: dashboardStats.totalSchools.toString(), icon: Users },
    { label: "Total Subjects", value: dashboardStats.totalSubjects.toString(), icon: GraduationCap },
    { label: "Total Videos", value: dashboardStats.totalVideos.toString(), icon: Video },
    { label: "Storage Used", value: dashboardStats.storageUsed, icon: LayoutDashboard },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "videos", label: "Videos", icon: Video },
    { id: "subjects", label: "Subjects", icon: GraduationCap },
    { id: "schools", label: "Schools", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card/60 backdrop-blur-md border-r border-border/30 min-h-screen flex flex-col">
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Viswam OTT Logo" className="w-16 h-16 object-contain" />
            <h1 className="font-display text-2xl font-semibold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Viswam OTT
            </h1>
          </div>
          <p className="text-xs text-[hsl(40,35%,85%)] mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Super Admin
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  activeTab === tab.id
                    ? "bg-primary/20 text-primary border-l-4 border-primary"
                    : "text-[hsl(40,35%,85%)] hover:bg-card/40 hover:text-[hsl(40,40%,90%)]"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/30">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-[hsl(40,35%,85%)] hover:bg-card/40 hover:text-[hsl(40,40%,90%)] transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card/40 backdrop-blur-md border-b border-border/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Super Admin Dashboard
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 bg-card/40 border-border/30 text-[hsl(40,40%,90%)] placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-display font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Dashboard Overview
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="p-6 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8 text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                      </div>
                      <p className="text-3xl font-bold text-[hsl(40,40%,90%)] mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {stat.value}
                      </p>
                      <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-display font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Video Management
                </h1>
                <Button 
                  className="gold-button"
                  onClick={() => setShowUploadForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              </div>

              {loading ? (
                <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    Loading videos...
                  </p>
                </div>
              ) : videos.length === 0 ? (
                <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    No videos uploaded yet. Click "Upload Video" to get started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <div
                      key={video._id}
                      className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-4 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-shadow"
                    >
                      {video.thumbnailUrl && (
                        <div className="relative mb-3 rounded-lg overflow-hidden bg-black aspect-video">
                          <img
                            src={`${API_BASE_URL}${video.thumbnailUrl}`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setSelectedVideo(video)}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
                          >
                            <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center hover:bg-primary transition-colors">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </button>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                        {video.title}
                      </h3>
                      <p className="text-sm text-[hsl(40,35%,85%)] mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {video.class} • {video.duration || "N/A"}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-primary text-primary hover:bg-primary/10"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 border-primary text-primary hover:bg-primary/10">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showUploadForm && (
            <VideoUploadForm
              onClose={() => setShowUploadForm(false)}
              onSuccess={handleUploadSuccess}
              subjects={subjects}
            />
          )}

          {activeTab === "subjects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-display font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Subject Management
                </h1>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                    onClick={fetchSubjects}
                  >
                    Refresh
                  </Button>
                  <Button 
                    className="gold-button"
                    onClick={() => setShowSubjectForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subject
                  </Button>
                </div>
              </div>

              {/* Debug info */}
              <div className="text-xs text-[hsl(40,35%,85%)] mb-2">
                Debug: Loading={loading ? 'true' : 'false'}, Subjects count={subjects.length}
              </div>

              {loading ? (
                <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    Loading subjects...
                  </p>
                </div>
              ) : subjects.length === 0 ? (
                <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    No subjects created yet. Click "Add Subject" to get started.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[hsl(40,35%,85%)] mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    Total: {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
                  </p>
                  {subjects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjects.map((subject: any) => (
                    <div
                      key={subject._id}
                      className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-shadow"
                    >
                      <h3 className="text-xl font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                        {subject.name}
                      </h3>
                      {subject.description && (
                        <p className="text-sm text-[hsl(40,35%,85%)] mb-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                          {subject.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {subject.classes && subject.classes.map((cls: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                          >
                            {cls}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        Videos: {subject.videoCount || 0}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-primary text-primary hover:bg-primary/10"
                          onClick={() => handleEditSubject(subject)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDeleteSubject(subject._id, subject.name)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {showSubjectForm && (
            <SubjectForm
              onClose={() => {
                setShowSubjectForm(false);
                setEditingSubject(null);
              }}
              onSuccess={handleSubjectSuccess}
              subject={editingSubject}
            />
          )}

          {showSchoolForm && (
            <SchoolForm
              onClose={() => {
                setShowSchoolForm(false);
                setEditingSchool(null);
              }}
              onSuccess={handleSchoolSuccess}
              school={editingSchool}
            />
          )}

          {selectedVideo && (
            <VideoPlayer
              video={selectedVideo}
              onClose={() => setSelectedVideo(null)}
            />
          )}

          {activeTab === "schools" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-display font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  School Management
                </h1>
                <Button 
                  className="gold-button"
                  onClick={() => setShowSchoolForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add School
                </Button>
              </div>

              {loading ? (
                <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    Loading schools...
                  </p>
                </div>
              ) : schools.length === 0 ? (
                <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
                  <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    No schools added yet. Click "Add School" to get started.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[hsl(40,35%,85%)] mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    Total: {schools.length} school{schools.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {schools.map((school: any) => (
                      <div
                        key={school._id}
                        className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-shadow"
                      >
                        <h3 className="text-xl font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                          {school.name}
                        </h3>
                        <p className="text-sm text-[hsl(40,35%,85%)] mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                          {school.email}
                        </p>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            {school.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                            Downloads: {school.downloadQuota?.used || 0}/{school.downloadQuota?.allowed || 0}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-primary text-primary hover:bg-primary/10"
                            onClick={() => {
                              setEditingSchool(school);
                              setShowSchoolForm(true);
                            }}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                            onClick={() => handleDeleteSchool(school._id, school.name)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-display font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Settings
              </h1>

              <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
                <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  Settings interface will be here
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;


