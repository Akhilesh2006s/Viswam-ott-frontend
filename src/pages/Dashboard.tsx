import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Video, HardDrive, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalVideos: 0,
    storageUsed: "0 B",
    weeklyActiveLogins: 0,
  });
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [schoolName, setSchoolName] = useState("School");

  useEffect(() => {
    const token = localStorage.getItem("schoolToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Get school name from localStorage
    const schoolData = localStorage.getItem("school");
    if (schoolData) {
      try {
        const school = JSON.parse(schoolData);
        setSchoolName(school.name || "School");
      } catch (e) {
        console.error("Error parsing school data:", e);
      }
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("schoolToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://viswam-ott-backend-production.up.railway.app/api/schools/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("schoolToken");
          localStorage.removeItem("school");
          navigate("/login");
          return;
        }
        const errorData = await response.json();
        console.error("Failed to fetch dashboard data:", errorData);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setStats({
          totalSubjects: data.data.totalSubjects || 0,
          totalVideos: data.data.totalVideos || 0,
          storageUsed: data.data.storageUsed || "0 B",
          weeklyActiveLogins: data.data.weeklyActiveLogins || 0,
        });
        setSubjects(data.data.subjects || []);
        setRecentVideos(data.data.recentVideos || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setLoading(false);
    }
  };

  const statsCards = [
    {
      label: "Total Subjects",
      value: stats.totalSubjects.toString(),
      icon: BookOpen,
      color: "text-primary",
    },
    {
      label: "Total Videos",
      value: stats.totalVideos.toString(),
      icon: Video,
      color: "text-primary",
    },
    {
      label: "Storage Used",
      value: stats.storageUsed,
      icon: HardDrive,
      color: "text-primary",
    },
    {
      label: "Weekly Active Logins",
      value: stats.weeklyActiveLogins.toString(),
      icon: Users,
      color: "text-primary",
    },
  ];

  // Map subject names to emojis
  const getSubjectEmoji = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("math")) return "📐";
    if (nameLower.includes("science")) return "🔬";
    if (nameLower.includes("english")) return "📚";
    if (nameLower.includes("history")) return "🌍";
    if (nameLower.includes("computer")) return "💻";
    return "📖";
  };

  // Format classes array to string
  const formatClasses = (classes: string[]) => {
    if (!classes || classes.length === 0) return "N/A";
    if (classes.length === 1) return classes[0];
    const sorted = [...classes].sort();
    return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
  };

  // Check if video is new (created in last 7 days)
  const isNewVideo = (createdAt: string) => {
    if (!createdAt) return false;
    const videoDate = new Date(createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return videoDate >= weekAgo;
  };

  if (loading) {
    return (
      <DashboardLayout schoolName={schoolName}>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout schoolName={schoolName}>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div>
          <h2 className="text-2xl font-display font-semibold text-[hsl(40,40%,90%)] mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Subjects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${stat.color} drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`} />
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

        {/* Subject Cards */}
        <div>
          <h2 className="text-2xl font-display font-semibold text-[hsl(40,40%,90%)] mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Subjects
          </h2>
          {subjects.length === 0 ? (
            <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
              <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                No subjects available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-shadow"
                  onClick={() => navigate(`/subjects?subject=${subject._id}`)}
                >
                  <div className="p-6">
                    <div className="text-6xl mb-4 text-center">{getSubjectEmoji(subject.name)}</div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                        {subject.name}
                      </h3>
                      <span className="text-sm font-medium text-primary bg-primary/20 px-2 py-1 rounded drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {subject.videoCount}
                      </span>
                    </div>
                    <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {formatClasses(subject.classes)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Videos */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-display font-semibold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Recent Videos
            </h2>
            {recentVideos.some(v => isNewVideo(v.createdAt)) && (
              <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                NEW
              </span>
            )}
          </div>
          {recentVideos.length === 0 ? (
            <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
              <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                No videos available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentVideos.map((video) => (
                <div
                  key={video._id}
                  className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-shadow"
                  onClick={() => navigate(`/learning-library?video=${video._id}`)}
                >
                  <div className="relative">
                    {video.thumbnailUrl ? (
                      <img
                        src={`https://viswam-ott-backend-production.up.railway.app${video.thumbnailUrl}`}
                        alt={video.title}
                        className="w-full aspect-video object-cover"
                      />
                    ) : (
                      <div className="aspect-video bg-card/40 flex items-center justify-center text-6xl">
                        {getSubjectEmoji(video.subject)}
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    {isNewVideo(video.createdAt) && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[hsl(40,40%,90%)] mb-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                      {video.title}
                    </h3>
                    <p className="text-sm text-[hsl(40,35%,85%)] mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {video.subject} • {video.class}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;


