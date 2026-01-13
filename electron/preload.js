const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process
// to use the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window management
  onVideoDownloaded: (videoData) => {
    ipcRenderer.send('video-downloaded', videoData);
  },
  
  onVideoPlayerClosed: () => {
    ipcRenderer.send('video-player-closed');
  },
  
  // Download path management
  getDownloadPath: () => ipcRenderer.invoke('get-download-path'),
  setDownloadPath: (path) => ipcRenderer.invoke('set-download-path', path),
  selectDownloadFolder: () => ipcRenderer.invoke('select-download-folder'),
  loadPreferences: () => ipcRenderer.invoke('load-preferences'),
  
  // File operations
  saveVideoFile: (videoData) => ipcRenderer.invoke('save-video-file', videoData),
  getVideoFilePath: (videoId) => ipcRenderer.invoke('get-video-file-path', videoId),
  openDownloadFolder: () => ipcRenderer.invoke('open-download-folder'),
  
  // Check if running in Electron
  isElectron: true,
  
  // TV/Kiosk mode controls
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen')
});



