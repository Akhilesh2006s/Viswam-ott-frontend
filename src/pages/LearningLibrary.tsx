import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { ChevronRight, Play, CheckCircle } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { offlineStorage } from "@/services/offlineStorage";

const LearningLibrary = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [schoolName, setSchoolName] = useState("School");
  const [downloadedVideos, setDownloadedVideos] = useState<Set<string>>(new Set());
  const selectedSubjectId = searchParams.get("subject");

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
    checkDownloadedVideos();
  }, [navigate, selectedSubjectId]);

  const checkDownloadedVideos = async () => {
    try {
      await offlineStorage.init();
      const allDownloaded = await offlineStorage.getAllVideos();
      const videoIds = new Set(allDownloaded.map(v => v.videoId));
      setDownloadedVideos(videoIds);
    } catch (error) {
      console.error("Error checking downloaded videos:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("schoolToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://viswam-ott-backend-production.up.railway.app/api/subjects", {
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
        const subjectsList = data.data || [];
        
        // If a specific subject is selected, filter and fetch its videos
        if (selectedSubjectId) {
          const subject = subjectsList.find((s: any) => s._id === selectedSubjectId);
          if (subject) {
            await fetchSubjectVideos(subject, subjectsList);
          } else {
            setSubjects(subjectsList);
            setLoading(false);
          }
        } else {
          // Fetch videos for all subjects
          const subjectsWithVideos = await Promise.all(
            subjectsList.map(async (subject: any) => {
              const videos = await fetchVideosForSubject(subject._id, token);
              return { ...subject, videos };
            })
          );
          setSubjects(subjectsWithVideos);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      setLoading(false);
    }
  };

  const fetchVideosForSubject = async (subjectId: string, token: string) => {
    try {
      const response = await fetch(`https://viswam-ott-backend-production.up.railway.app/api/subjects/${subjectId}/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch videos for subject:", error);
      return [];
    }
  };

  const fetchSubjectVideos = async (subject: any, allSubjects: any[]) => {
    try {
      const token = localStorage.getItem("schoolToken");
      if (!token) return;

      const videos = await fetchVideosForSubject(subject._id, token);
      
      // Organize videos by chapter
      const videosByChapter: { [key: string]: any[] } = {};
      videos.forEach((video: any) => {
        const chapter = video.chapter || "General";
        if (!videosByChapter[chapter]) {
          videosByChapter[chapter] = [];
        }
        videosByChapter[chapter].push(video);
      });

      const chapters = Object.keys(videosByChapter).map(chapter => ({
        name: chapter,
        videos: videosByChapter[chapter],
      }));

      setSubjects([{ ...subject, chapters, videos }]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch subject videos:", error);
      setLoading(false);
    }
  };


  const handleVideoClick = async (video: any) => {
    // Check if video is downloaded and use offline version if available
    try {
      await offlineStorage.init();
      const isDownloaded = await offlineStorage.isVideoDownloaded(video._id);
      if (isDownloaded) {
        const downloadedVideo = await offlineStorage.getVideo(video._id);
        if (downloadedVideo) {
          // Use offline video data
          setSelectedVideo({
            ...video,
            videoUrl: await offlineStorage.getVideoUrl(video._id) || video.videoUrl,
            isOffline: true,
          });
          return;
        }
      }
    } catch (error) {
      console.error("Error checking offline video:", error);
    }
    
    setSelectedVideo(video);
  };

  if (loading) {
    return (
      <DashboardLayout schoolName={schoolName}>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Loading learning library...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout schoolName={schoolName}>
      <div>
        <h1 className="text-3xl font-display font-bold text-[hsl(40,40%,90%)] mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Learning Library
        </h1>

        {subjects.length === 0 ? (
          <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
            <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              No subjects available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {subjects.map((subject) => (
              <div key={subject._id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-semibold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {subject.name}
                  </h2>
                  <div className="flex gap-2">
                    {subject.classes && subject.classes.map((cls: string) => (
                      <span
                        key={cls}
                        className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                {subject.chapters && subject.chapters.length > 0 ? (
                  subject.chapters.map((chapter: any, chapterIndex: number) => (
                    <div
                      key={chapterIndex}
                      className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6"
                    >
                      <h3 className="text-xl font-semibold text-[hsl(40,40%,90%)] mb-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                        {chapter.name}
                      </h3>
                      <div className="space-y-3">
                      {chapter.videos.map((video: any) => (
                        <div
                          key={video._id}
                          onClick={() => handleVideoClick(video)}
                          className="flex items-center justify-between p-4 bg-card/20 rounded-lg hover:bg-card/30 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Play className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-[hsl(40,40%,90%)] font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                  {video.title}
                                </p>
                                {downloadedVideos.has(video._id) && (
                                  <CheckCircle className="w-4 h-4 text-primary" title="Available offline" />
                                )}
                              </div>
                              <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                Duration: {video.duration || "N/A"}
                                {downloadedVideos.has(video._id) && (
                                  <span className="ml-2 text-primary">• Offline</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[hsl(40,35%,85%)]" />
                        </div>
                      ))}
                      </div>
                    </div>
                  ))
                ) : subject.videos && subject.videos.length > 0 ? (
                  <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6">
                    <h3 className="text-xl font-semibold text-[hsl(40,40%,90%)] mb-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                      All Videos
                    </h3>
                    <div className="space-y-3">
                      {subject.videos.map((video: any) => (
                        <div
                          key={video._id}
                          onClick={() => handleVideoClick(video)}
                          className="flex items-center justify-between p-4 bg-card/20 rounded-lg hover:bg-card/30 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Play className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-[hsl(40,40%,90%)] font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                  {video.title}
                                </p>
                                {downloadedVideos.has(video._id) && (
                                  <CheckCircle className="w-4 h-4 text-primary" title="Available offline" />
                                )}
                              </div>
                              <p className="text-sm text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                                {video.class} • Duration: {video.duration || "N/A"}
                                {downloadedVideos.has(video._id) && (
                                  <span className="ml-2 text-primary">• Offline</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[hsl(40,35%,85%)]" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 text-center">
                    <p className="text-[hsl(40,35%,85%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      No videos available for this subject yet.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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

export default LearningLibrary;


