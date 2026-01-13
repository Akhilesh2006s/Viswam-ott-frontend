import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "@/config/api";

const Subjects = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
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

    fetchSubjects();
  }, [navigate]);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("schoolToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(API_ENDPOINTS.SUBJECTS.BASE, {
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
        console.error("Failed to fetch subjects:", errorData);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setSubjects(data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      setLoading(false);
    }
  };

  // Map subject names to emojis
  const getSubjectEmoji = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("math")) return "📐";
    if (nameLower.includes("science")) return "🔬";
    if (nameLower.includes("english")) return "📚";
    if (nameLower.includes("history")) return "🌍";
    if (nameLower.includes("geography")) return "🗺️";
    if (nameLower.includes("physics")) return "⚛️";
    if (nameLower.includes("chemistry")) return "🧪";
    if (nameLower.includes("biology")) return "🔬";
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

  if (loading) {
    return (
      <DashboardLayout schoolName={schoolName}>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Loading subjects...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout schoolName={schoolName}>
      <div>
        <h1 className="text-3xl font-display font-bold text-[hsl(40,40%,90%)] mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          All Subjects
        </h1>
        
        {subjects.length === 0 ? (
          <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
            <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              No subjects available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <Link
                key={subject._id}
                to={`/learning-library?subject=${subject._id}`}
                className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-shadow"
              >
                <div className="p-6">
                  <div className="text-6xl mb-4 text-center">{getSubjectEmoji(subject.name)}</div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                      {subject.name}
                    </h3>
                    <span className="text-sm font-medium text-primary bg-primary/20 px-2 py-1 rounded drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {subject.videoCount || 0}
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {formatClasses(subject.classes)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subjects;


