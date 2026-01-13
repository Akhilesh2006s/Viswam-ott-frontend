import { useState, useRef, useEffect } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import premiumBg from "@/assets/luxury-bg.jpg";
import { offlineStorage } from "@/services/offlineStorage";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

interface VideoPlayerProps {
  video: {
    _id: string;
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration?: string;
    isDownloadable?: boolean;
    subjectId?: any;
    class?: string;
  };
  onClose: () => void;
}

const VideoPlayer = ({ video, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [offlineUrl, setOfflineUrl] = useState<string | null>(null);

  // Check if video is already downloaded
  useEffect(() => {
    const checkDownloaded = async () => {
      try {
        // Check Electron file system first
        if (window.electronAPI) {
          const filePath = await window.electronAPI.getVideoFilePath(video._id);
          if (filePath) {
            // Use file:// protocol for Electron
            const fileUrl = `file://${filePath}`;
            setOfflineUrl(fileUrl);
            setIsDownloaded(true);
            return;
          }
        }
        
        // Fallback to IndexedDB
        await offlineStorage.init();
        const downloaded = await offlineStorage.isVideoDownloaded(video._id);
        setIsDownloaded(downloaded);
        if (downloaded) {
          const url = await offlineStorage.getVideoUrl(video._id);
          setOfflineUrl(url);
        }
      } catch (error) {
        console.error("Error checking downloaded status:", error);
      }
    };
    checkDownloaded();
  }, [video._id]);

  // Construct full video URL - prefer offline if available
  const videoSrc = offlineUrl || (video.videoUrl.startsWith('http') 
    ? video.videoUrl 
    : `${API_BASE_URL}${video.videoUrl}`);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Update video source when offline URL becomes available
    if (offlineUrl && videoElement.src !== offlineUrl) {
      videoElement.src = offlineUrl;
      videoElement.load();
    }

    const updateTime = () => setCurrentTime(videoElement.currentTime);
    const updateDuration = () => setDuration(videoElement.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    videoElement.addEventListener('timeupdate', updateTime);
    videoElement.addEventListener('loadedmetadata', updateDuration);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      videoElement.removeEventListener('timeupdate', updateTime);
      videoElement.removeEventListener('loadedmetadata', updateDuration);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [offlineUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    if (!video.isDownloadable) {
      alert("This video is not available for download");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const token = localStorage.getItem("schoolToken");
      if (!token) {
        alert("Please login to download videos");
        setIsDownloading(false);
        return;
      }

      // Check if already downloaded
      if (isDownloaded) {
        alert("Video is already downloaded!");
        setIsDownloading(false);
        return;
      }

      // Initialize offline storage
      await offlineStorage.init();

      // Fetch video with progress tracking
      const response = await fetch(API_ENDPOINTS.VIDEOS.DOWNLOAD(video._id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download video");
      }

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      const reader = response.body?.getReader();
      const chunks: BlobPart[] = [];

      if (!reader) {
        throw new Error("No response body");
      }

      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        if (value) {
          chunks.push(value);
          receivedLength += value.length;

          if (total > 0) {
            setDownloadProgress((receivedLength / total) * 100);
          }
        }
      }

      // Combine chunks into a single blob
      const blob = new Blob(chunks, { type: "video/mp4" });

      // Check if running in Electron
      if (window.electronAPI) {
        // Convert blob to base64 for Electron
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64data = reader.result as string;
            const base64Content = base64data.split(',')[1]; // Remove data:video/mp4;base64, prefix

            // Save to file system via Electron
            const result = await window.electronAPI.saveVideoFile({
              videoId: video._id,
              videoData: base64Content,
              metadata: {
                id: `video_${video._id}`,
                videoId: video._id,
                title: video.title,
                description: video.description,
                thumbnailUrl: video.thumbnailUrl,
                duration: video.duration,
                subject: video.subjectId?.name || "Unknown",
                class: video.class,
                downloadedAt: Date.now(),
              }
            });

            if (result.success && result.filePath) {
              // Use file:// protocol for Electron
              const fileUrl = `file://${result.filePath}`;
              setOfflineUrl(fileUrl);
              setIsDownloaded(true);
              setDownloadProgress(100);

              if (videoRef.current) {
                videoRef.current.src = fileUrl;
                videoRef.current.load();
              }

              // Notify Electron to resize window
              window.electronAPI.onVideoDownloaded({
                videoId: video._id,
                title: video.title
              });

              // Refresh school data
              window.dispatchEvent(new CustomEvent('videoDownloaded'));

              alert(`Video downloaded successfully!\nSaved to: ${result.filePath}`);
            } else {
              throw new Error(result.error || "Failed to save video file");
            }
          } catch (error: any) {
            console.error("Electron save error:", error);
            throw error;
          } finally {
            setIsDownloading(false);
            setTimeout(() => setDownloadProgress(0), 2000);
          }
        };
        reader.onerror = () => {
          throw new Error("Failed to read video blob");
        };
        reader.readAsDataURL(blob);
        return; // Exit early, completion handled in reader.onloadend
      } else {
        // Fallback to IndexedDB for browser mode
        await offlineStorage.saveVideo({
          id: `video_${video._id}`,
          videoId: video._id,
          title: video.title,
          description: video.description,
          videoData: blob,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          subject: video.subjectId?.name || "Unknown",
          class: video.class,
          downloadedAt: Date.now(),
        });

        // Create object URL for immediate use
        const url = URL.createObjectURL(blob);
        setOfflineUrl(url);
        setIsDownloaded(true);
        setDownloadProgress(100);

        // Update video source to use offline version
        if (videoRef.current) {
          videoRef.current.src = url;
          videoRef.current.load();
        }

        // Refresh school data to update quota (if on download requests page)
        window.dispatchEvent(new CustomEvent('videoDownloaded'));

        alert("Video downloaded successfully! You can now watch it offline.");
      }
    } catch (error: any) {
      console.error("Download error:", error);
      alert(error.message || "Failed to download video. Please try again.");
    } finally {
      setIsDownloading(false);
      setTimeout(() => setDownloadProgress(0), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${premiumBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-6xl bg-card/95 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] border border-primary/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className="flex-1">
            <h2 className="text-xl font-display font-bold text-[hsl(40,40%,90%)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {video.title}
            </h2>
            {video.description && (
              <p className="text-sm text-[hsl(40,35%,85%)] mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {video.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {video.isDownloadable && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading || isDownloaded}
                className="border-primary text-primary hover:bg-primary/10 disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Download className="w-4 h-4 mr-1 animate-pulse" />
                    {Math.round(downloadProgress)}%
                  </>
                ) : isDownloaded ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Downloaded
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </>
                )}
              </Button>
            )}
            <button
              onClick={() => {
                // Notify Electron to reset window size
                if (window.electronAPI) {
                  window.electronAPI.onVideoPlayerClosed();
                }
                onClose();
              }}
              className="text-[hsl(40,35%,85%)] hover:text-[hsl(40,40%,90%)] transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative bg-black/40">
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-auto max-h-[70vh]"
            poster={video.thumbnailUrl ? `${API_BASE_URL}${video.thumbnailUrl}` : undefined}
            controls={false}
          />

          {/* Custom Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-[hsl(40,40%,90%)] hover:bg-white/10"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <div className="flex items-center gap-2 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-[hsl(40,40%,90%)] hover:bg-white/10"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <span className="text-sm text-[hsl(40,40%,90%)]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-[hsl(40,40%,90%)] hover:bg-white/10"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

