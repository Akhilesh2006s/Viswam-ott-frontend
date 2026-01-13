export interface ElectronAPI {
  onVideoDownloaded: (videoData: { videoId: string; title: string }) => void;
  onVideoPlayerClosed: () => void;
  getDownloadPath: () => Promise<string>;
  setDownloadPath: (path: string) => Promise<{ success: boolean; path?: string; error?: string }>;
  selectDownloadFolder: () => Promise<{ success: boolean; path?: string; error?: string; canceled?: boolean }>;
  loadPreferences: () => Promise<{ downloadPath: string }>;
  saveVideoFile: (data: { videoId: string; videoData: string; metadata: any }) => Promise<{ success: boolean; filePath?: string; filename?: string; error?: string }>;
  getVideoFilePath: (videoId: string) => Promise<string | null>;
  openDownloadFolder: () => Promise<{ success: boolean }>;
  toggleFullscreen: () => Promise<{ isFullScreen: boolean }>;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}



