import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Download, Clock, CheckCircle, XCircle, Plus, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { offlineStorage } from "@/services/offlineStorage";
import VideoPlayer from "@/components/VideoPlayer";
import { API_ENDPOINTS } from "@/config/api";

const DownloadRequests = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [downloadedVideos, setDownloadedVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [quota, setQuota] = useState({
    allowed: 50,
    used: 0,
    remaining: 50,
  });
  const [schoolName, setSchoolName] = useState("School");

  useEffect(() => {
    const token = localStorage.getItem("schoolToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Get school name and quota from localStorage
    const schoolData = localStorage.getItem("school");
    if (schoolData) {
      try {
        const school = JSON.parse(schoolData);
        setSchoolName(school.name || "School");
        if (school.downloadQuota) {
          setQuota({
            allowed: school.downloadQuota.allowed || 50,
            used: school.downloadQuota.used || 0,
            remaining: (school.downloadQuota.allowed || 50) - (school.downloadQuota.used || 0),
          });
        }
      } catch (e) {
        console.error("Error parsing school data:", e);
      }
    }

    fetchSchoolData();
    fetchDownloadRequests();
    fetchDownloadedVideos();

    // Listen for video download events to refresh quota
    const handleVideoDownloaded = () => {
      fetchSchoolData();
      fetchDownloadedVideos();
    };

    window.addEventListener('videoDownloaded', handleVideoDownloaded);

    return () => {
      window.removeEventListener('videoDownloaded', handleVideoDownloaded);
    };
  }, [navigate]);

  const fetchSchoolData = async () => {
    try {
      const token = localStorage.getItem("schoolToken");
      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch current school data from backend to get updated quota
      const response = await fetch(API_ENDPOINTS.AUTH.SCHOOL_ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const school = data.data;
          setSchoolName(school.name || "School");
          
          if (school.downloadQuota) {
            setQuota({
              allowed: school.downloadQuota.allowed || 50,
              used: school.downloadQuota.used || 0,
              remaining: (school.downloadQuota.allowed || 50) - (school.downloadQuota.used || 0),
            });
          }

          // Update localStorage with fresh data
          localStorage.setItem("school", JSON.stringify({
            name: school.name,
            email: school.email,
            downloadQuota: school.downloadQuota,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch school data:", error);
      // Fallback to localStorage if API fails
      const schoolData = localStorage.getItem("school");
      if (schoolData) {
        try {
          const school = JSON.parse(schoolData);
          setSchoolName(school.name || "School");
          if (school.downloadQuota) {
            setQuota({
              allowed: school.downloadQuota.allowed || 50,
              used: school.downloadQuota.used || 0,
              remaining: (school.downloadQuota.allowed || 50) - (school.downloadQuota.used || 0),
            });
          }
        } catch (e) {
          console.error("Error parsing school data:", e);
        }
      }
    }
  };

  const fetchDownloadedVideos = async () => {
    try {
      await offlineStorage.init();
      const videos = await offlineStorage.getAllVideos();
      setDownloadedVideos(videos);
    } catch (error) {
      console.error("Failed to fetch downloaded videos:", error);
    }
  };

  const fetchDownloadRequests = async () => {
    try {
      const token = localStorage.getItem("schoolToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(API_ENDPOINTS.DOWNLOADS.REQUESTS, {
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
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        const requestsList = data.data || [];
        const formattedRequests = requestsList.map((req: any) => ({
          id: req._id,
          videoTitle: req.videoId?.title || "Unknown Video",
          subject: req.videoId?.subjectId?.name || "Unknown Subject",
          requestedAt: new Date(req.requestedAt).toISOString().split('T')[0],
          status: req.status || "pending",
        }));
        setRequests(formattedRequests);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch download requests:", error);
      setLoading(false);
    }
  };

  const handleRequestAccess = () => {
    // TODO: Implement request access functionality
    alert("Request access feature coming soon");
  };

  const handlePlayVideo = async (video: any) => {
    try {
      const videoUrl = await offlineStorage.getVideoUrl(video.videoId);
      setSelectedVideo({
        _id: video.videoId,
        title: video.title,
        description: video.description,
        videoUrl: videoUrl || "",
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        isDownloadable: true,
        subjectId: { name: video.subject },
        class: video.class,
      });
    } catch (error) {
      console.error("Error playing video:", error);
      alert("Failed to play video");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this downloaded video?")) {
      return;
    }

    try {
      await offlineStorage.deleteVideo(videoId);
      await fetchDownloadedVideos();
      alert("Video deleted successfully");
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-primary";
    }
  };

  if (loading) {
    return (
      <DashboardLayout schoolName={schoolName}>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Loading download requests...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout schoolName={schoolName}>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Download Requests
        </h1>

        {/* Quota Information */}
        <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
          <h2 className="text-xl font-display font-semibold text-[hsl(40,40%,90%)] mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Download Quota
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-[hsl(40,35%,85%)] mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Allowed Downloads
              </p>
              <p className="text-2xl font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {quota.allowed}
              </p>
            </div>
            <div>
              <p className="text-sm text-[hsl(40,35%,85%)] mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Used
              </p>
              <p className="text-2xl font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {quota.used}
              </p>
            </div>
            <div>
              <p className="text-sm text-[hsl(40,35%,85%)] mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Remaining
              </p>
              <p className="text-2xl font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {quota.remaining}
              </p>
            </div>
          </div>
          <div className="mt-4 w-full bg-card/40 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${quota.allowed > 0 ? (quota.used / quota.allowed) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Request Additional Access */}
        <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-semibold text-[hsl(40,40%,90%)] mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Need More Downloads?
              </h2>
              <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Request additional download access from Viswam
              </p>
            </div>
            <Button className="gold-button" onClick={handleRequestAccess}>
              <Plus className="w-4 h-4 mr-2" />
              Request Access
            </Button>
          </div>
        </div>

        {/* Downloaded Videos Section */}
        <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
          <h2 className="text-xl font-display font-semibold text-[hsl(40,40%,90%)] mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Downloaded Videos ({downloadedVideos.length})
          </h2>
          {downloadedVideos.length === 0 ? (
            <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              No videos downloaded yet. Download videos from the Learning Library to watch them offline.
            </p>
          ) : (
            <div className="space-y-3">
              {downloadedVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-4 bg-card/20 rounded-lg hover:bg-card/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-[hsl(40,40%,90%)] font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {video.title}
                      </p>
                      <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {video.subject} • {video.class} • Downloaded: {formatDate(video.downloadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayVideo(video)}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Play
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVideo(video.videoId)}
                      className="border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Download Requests List */}
        <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
          <h2 className="text-xl font-display font-semibold text-[hsl(40,40%,90%)] mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Request History
          </h2>
          {requests.length === 0 ? (
            <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              No download requests yet.
            </p>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-card/20 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Download className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[hsl(40,40%,90%)] font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {request.videoTitle}
                      </p>
                      <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {request.subject} • {request.requestedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <span
                      className={`font-medium capitalize ${getStatusColor(request.status)} drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default DownloadRequests;


