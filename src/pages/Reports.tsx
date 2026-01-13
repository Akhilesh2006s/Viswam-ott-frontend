import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Download, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/config/api";

const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [subjectUsage, setSubjectUsage] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({
    videosWatched: 0,
    totalTime: "0h 0m",
    activeDays: 0,
  });
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

    fetchReports();
    fetchSubjectWiseUsage();
  }, [navigate]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("schoolToken");
      if (!token) {
        navigate("/login");
        return;
      }

      // Get current month's reports
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const response = await fetch(
        `${API_ENDPOINTS.REPORTS.BASE}?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("schoolToken");
          localStorage.removeItem("school");
          navigate("/login");
          return;
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        const reportsList = data.data || [];
        setReports(reportsList);

        // Calculate monthly stats
        const videosWatched = reportsList.length;
        const uniqueDays = new Set(
          reportsList.map((r: any) => new Date(r.timestamp).toDateString())
        ).size;
        
        // Group by subject for recent activity
        const groupedBySubject: { [key: string]: any[] } = {};
        reportsList.forEach((report: any) => {
          const subject = report.subjectId?.name || "Unknown";
          if (!groupedBySubject[subject]) {
            groupedBySubject[subject] = [];
          }
          groupedBySubject[subject].push(report);
        });

        const recentActivity = Object.keys(groupedBySubject).map(subject => ({
          subject,
          date: new Date(groupedBySubject[subject][0].timestamp).toISOString().split('T')[0],
          videosWatched: groupedBySubject[subject].length,
          totalTime: "N/A", // Duration not stored in UsageReport
        })).slice(0, 10);

        setReports(recentActivity);
        setMonthlyStats({
          videosWatched,
          totalTime: "N/A", // Calculate if duration is available
          activeDays: uniqueDays,
        });
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  const fetchSubjectWiseUsage = async () => {
    try {
      const token = localStorage.getItem("schoolToken");
      if (!token) return;

      // Get current month's usage
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const response = await fetch(
        `${API_ENDPOINTS.REPORTS.SUBJECT_WISE}?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const usage = data.data || [];
          
          // Calculate max usage for percentage
          const maxVideos = Math.max(...usage.map((u: any) => u.videosWatched || 0), 1);
          
          const usageWithPercent = usage.map((item: any) => ({
            subject: item.subjectName || "Unknown",
            usage: maxVideos > 0 ? Math.round((item.videosWatched / maxVideos) * 100) : 0,
            videos: item.videosWatched || 0,
          }));

          setSubjectUsage(usageWithPercent);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch subject-wise usage:", error);
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert("PDF export feature coming soon");
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    alert("CSV export feature coming soon");
  };

  if (loading) {
    return (
      <DashboardLayout schoolName={schoolName}>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Loading reports...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout schoolName={schoolName}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Reports
          </h1>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={handleExportPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={handleExportCSV}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                This Month
              </h3>
            </div>
            <p className="text-3xl font-bold text-[hsl(40,40%,90%)] mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {monthlyStats.videosWatched}
            </p>
            <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Videos Watched
            </p>
          </div>

          <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                Total Time
              </h3>
            </div>
            <p className="text-3xl font-bold text-[hsl(40,40%,90%)] mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {monthlyStats.totalTime}
            </p>
            <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              This Month
            </p>
          </div>

          <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                Active Days
              </h3>
            </div>
            <p className="text-3xl font-bold text-[hsl(40,40%,90%)] mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {monthlyStats.activeDays}
            </p>
            <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              This Month
            </p>
          </div>
        </div>

        {/* Subject-wise Usage */}
        <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
          <h2 className="text-2xl font-display font-semibold text-[hsl(40,40%,90%)] mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Subject-wise Usage
          </h2>
          {subjectUsage.length === 0 ? (
            <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              No usage data available yet.
            </p>
          ) : (
            <div className="space-y-4">
              {subjectUsage.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[hsl(40,40%,90%)] font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {item.subject}
                    </span>
                    <span className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {item.videos} videos
                    </span>
                  </div>
                  <div className="w-full bg-card/40 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
          <h2 className="text-2xl font-display font-semibold text-[hsl(40,40%,90%)] mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Recent Activity
          </h2>
          {reports.length === 0 ? (
            <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              No recent activity.
            </p>
          ) : (
            <div className="space-y-3">
              {reports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-card/20 rounded-lg"
                >
                  <div>
                    <p className="text-[hsl(40,40%,90%)] font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {report.subject}
                    </p>
                    <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {report.date} • {report.videosWatched} videos
                    </p>
                  </div>
                  <p className="text-[hsl(40,40%,90%)] font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {report.totalTime}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;


